export enum TokenTypeEnum {
   ACCESS_TOKEN = "access_token",
   REFRESH_TOKEN = "refresh_token"
}

export const getToken = (tokenType: TokenTypeEnum) => {
   const tokenStr = localStorage.getItem(tokenType)

   return tokenStr && JSON.parse(tokenStr) || ''
}

export const setToken = (tokenType: TokenTypeEnum, token: string) => {
   localStorage.setItem(tokenType, JSON.stringify(token))
}

export const clearToken = () => {
    localStorage.removeItem(TokenTypeEnum.ACCESS_TOKEN)
    localStorage.removeItem(TokenTypeEnum.REFRESH_TOKEN)
}