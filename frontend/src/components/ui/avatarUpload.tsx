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
          src={image || "https://github.com/shadcn.png"}
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
