import { getToken } from "@/lib/token";
import { privateHttp, publicHttp } from "./http";

publicHttp.interceptors.response.use((response) => response.data, (error) => Promise.reject(error.response.data));

privateHttp.interceptors.request.use(async function (config) {
        await pending()

    const token = getToken();

    if(!token) {
        window.location.replace("/login");
    }

    config.headers.setAuthorization(`Bearer ${token}`);

    return config;
  }, (error) =>  Promise.reject(error.response));

privateHttp.interceptors.response.use((response) => response.data, function (error) {
    if(error.status === 401) {
       window.location.replace("/login")
    }
    return Promise.reject(error.response.data);
});

const pending = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, 2000)
    })
}