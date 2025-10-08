import { getToken, setToken, TokenTypeEnum } from "@/lib/token";
import { privateHttp, publicHttp } from "./http";
import { refreshToken } from "./auth";

publicHttp.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response?.data || error)
);

privateHttp.interceptors.request.use(
  async function (config) {
    await pending();
    const token = getToken(TokenTypeEnum.ACCESS_TOKEN);

    if (!token) {
      window.location.replace("/login");
    }

    config.headers.setAuthorization(`Bearer ${token}`);

    return config;
  },
  (error) => Promise.reject(error.response)
);

privateHttp.interceptors.response.use(
  (response) => response.data,
  async function (error) {
    const originalConfig = error.config;

    if (error.status === 401) {

      if (!originalConfig._retry) {
        originalConfig._retry = true;
        return _refreshToken(originalConfig)
      }
    
      window.location.replace("/login")
    }
    
    return Promise.reject(error.response?.data);
  }
);

const _refreshToken = async (originalConfig: any) => {
    try {
        const refreshedToken = await refreshToken(getToken(TokenTypeEnum.REFRESH_TOKEN));
        setToken(TokenTypeEnum.ACCESS_TOKEN, refreshedToken.data.access_token);
        setToken(TokenTypeEnum.REFRESH_TOKEN, refreshedToken.data.refresh_token);

        return privateHttp(originalConfig);
    } catch (error) {
        window.location.replace("/login");
    }
}

const pending = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};
