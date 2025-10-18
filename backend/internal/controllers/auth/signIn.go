package controllers

import (
	"chairTime/constant"
	_ "chairTime/docs"
	"chairTime/internal/app"
	"chairTime/internal/auth"
	"chairTime/internal/domain"
	"context"
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
	"golang.org/x/sync/errgroup"
	"gorm.io/gorm"
)

// Sign in godoc
//
//	@Summary		Sign in to account
//	@Description	Sign in to account
//	@Tags			Authentication
//	@Accept			json
//	@Produce		json
//	@Param			payload	body		domain.LoginPayload	true "User credentials"
//	@Success		201		{object}	domain.LoginRes		"Logged in"
//	@Failure		400		{object}	error
//	@Failure		500		{object}	error
//	@Router			/auth/sign-in [post]
func SignIn(app *app.Application, e echo.Context) error {
	userCredential := new(domain.LoginPayload)

	if err := e.Bind(&userCredential); err != nil {
		return app.BadRequestResponse(e, err)
	}

	if err := e.Validate(userCredential); err != nil {
		return app.BadRequestResponse(e, err)
	}

	result, err := checkUserExistence(app, e.Request().Context(), userCredential.Username)

	if errors.Is(err, gorm.ErrRecordNotFound) {
		return app.UnauthorizedErrorResponse(e, err)
	} else if err != nil {
		return app.InternalServerError(e, err)
	}

	passwordErr := bcrypt.CompareHashAndPassword([]byte(result.Password), []byte(userCredential.Password))

	if passwordErr != nil {
		return app.UnauthorizedErrorResponse(e, passwordErr)
	}

	claimsAccessToken := auth.CustomClaims{
		Role: result.RoleId,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(result.Id),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(app.Config.Auth.AccessTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Audience:  jwt.ClaimStrings{app.Config.Auth.Iss},
		},
	}

	claimsRefreshToken := auth.CustomClaims{
		Role: result.RoleId,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   strconv.Itoa(result.Id),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(app.Config.Auth.RefreshTokenExp)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Audience:  jwt.ClaimStrings{app.Config.Auth.Iss},
		},
	}

	accessToken, accessTokenErr := app.Authenticator.GenerateToken(claimsAccessToken)
	refreshToken, refreshTokenErr := app.Authenticator.GenerateRefreshToken(claimsRefreshToken)

	if accessTokenErr != nil || refreshTokenErr != nil {
		return app.InternalServerError(e, err)
	}

	successRes := domain.LoginRes{
		Status:  http.StatusOK,
		Message: "Success",
		Data: domain.Credential{
			Role:         result.RoleId,
			ID:           result.Id,
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
		},
	}

	return e.JSON(http.StatusOK, successRes)
}

type UserInfo struct {
	Id       int
	Password string
	RoleId   int
}

func checkUserExistence(app *app.Application, rCtx context.Context, userName string) (UserInfo, error) {
	ctx, cancel := context.WithCancel(rCtx)
	defer cancel()

	g, ctx := errgroup.WithContext(ctx)
	resultChan := make(chan interface{}, 1)

	g.Go(func() error {
		user, err := app.Repository.Auth.GetUserByName(ctx, userName)
		if user.ID != 0 && err == nil {
			select {
			case resultChan <- user:
				cancel() // stop others
			default:
			}
		}

		return nil
	})

	g.Go(func() error {
		master, err := app.Repository.Master.GetMasterByName(ctx, userName)
		if master.ID != 0 && err == nil {
			select {
			case resultChan <- master:
				cancel() // stop others
			default:
			}
		}

		return nil
	})

	g.Go(func() error {
		admin, err := app.Repository.Admin.GetAdminByName(ctx, userName)

		if admin.ID != 0 && err == nil {
			select {
			case resultChan <- admin:
				cancel() // stop others
			default:
			}
		}

		return nil
	})

	var result interface{}

	select {
	case result = <-resultChan:
	case <-ctx.Done():
	}

	_ = g.Wait()

	if result == nil {
		return UserInfo{}, nil
	}

	switch v := result.(type) {
	case domain.User:
		return UserInfo{Id: v.ID, Password: v.Password, RoleId: constant.UserRoleId}, nil
	case domain.Master:
		return UserInfo{Id: v.ID, Password: v.Password, RoleId: constant.MasterRoleId}, nil
	case domain.Admin:
		return UserInfo{Id: v.ID, Password: v.Password, RoleId: constant.AdminRoleId}, nil
	}

	// return the found result (could be *domain.User, *domain.Master, *domain.Admin) and nil error
	return UserInfo{}, gorm.ErrRecordNotFound
}
