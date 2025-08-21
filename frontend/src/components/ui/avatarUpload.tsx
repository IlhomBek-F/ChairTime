import { upload } from "@/api/user";
import { getToken } from "@/utils/token";
import { useRef, useState } from "react";

export default function AvatarUploader() {
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      let formData = new FormData();
      formData.append("profile_image", file);
      upload(formData)
      .then(console.log)
      .catch(console.log)
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
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
