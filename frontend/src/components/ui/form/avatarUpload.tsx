import { upload } from "@/api/user";
import { getToken } from "@/lib/token";
import { useRef, useState } from "react";

export default function AvatarUploader() {
  const [image, setImage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const formData = new FormData();
      formData.append("profile_image", file);
      const reader = new FileReader();
      
       upload(formData)
      .then(() => {
         reader.onloadend = () => {
          setImage(reader.result as string);
        };

        reader.readAsDataURL(file);
      })
      .catch(console.log)
    }
  };

  const handleClick = () => {
     if(fileInputRef.current) {
       fileInputRef.current.click();
     }
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className="w-32 h-32 rounded-full overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
        onClick={handleClick}
      >
        <img
          src={image || `http://localhost:8080/api/file/${getToken()}`}
          alt="Avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={fileInputRef}
        className="hidden"
      />
    </div>
  );
}
