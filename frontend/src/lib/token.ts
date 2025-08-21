export const getToken = () => {
   const tokenStr = localStorage.getItem("token")

   return tokenStr && JSON.parse(tokenStr) || ''
}

export const setToken = (token: string) => {
   localStorage.setItem('token', JSON.stringify(token))
}

export const clearToken = () => localStorage.removeItem("token")