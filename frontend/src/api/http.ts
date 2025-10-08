import axios from "axios";

export const publicHttp = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
  timeoutErrorMessage: "The request took too long - please try again later.",
  headers: {
    "Content-Type": "application/json"
  },
});

export const privateHttp = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 5000,
    timeoutErrorMessage: "The request took too long - please try again later.",
    headers: {
        "Content-Type": "application/json"
    }
})