import { privateHttp } from "./http";

export async function upload(formData: FormData) {
  return privateHttp.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}