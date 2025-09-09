import { useRef, useState, useEffect } from "react";
import { Avatar } from "@material-tailwind/react";
import { FaUserCircle } from "react-icons/fa";

const ProfileImageUploader = ({ onUpload, defaultImage }) => {

  console.log(defaultImage,'d')
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(defaultImage || null);
const [hasuploaded,setHasUploaded]=useState(false)
  useEffect(() => {
    setPreview(defaultImage || null);
  }, [defaultImage]);

  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setPreview(imageURL);
      setHasUploaded(true);
      onUpload && onUpload(file);
    }
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-32 h-32 rounded-full border-4 border-white shadow-lg hover:shadow-xl cursor-pointer overflow-hidden"
        onClick={handleAvatarClick}
      >
        {preview ? (
          <Avatar
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
            <FaUserCircle className="text-gray-400 w-24 h-24" />
          </div>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      <span className="text-sm text-gray-600 text-center">
        Click to upload profile image
      </span>
    </div>
  );
};

export default ProfileImageUploader;
