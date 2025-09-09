import React from "react";

const FileUploadButton = ({ label, accept, type, handleClick, tailwindCss }) => {
  return (
    <div>
      <label
        className={`px-3 max-w-[18ch]  p-1.5 cursor-pointer max-sm:text-sm uppercase text-sm  font-medium bg-red-600  truncate h-min self-center rounded-md  text-gray-100 border-gray-500 border shadow-sm shadow-gray-300 flex gap-2 items-center ${tailwindCss}`}
        htmlFor="file-upload"
      >
        {label}
      </label>
      <input
        id="file-upload"
        type={type}
        accept={accept}
        className="hidden "
        onChange={handleClick}
      />
    </div>
  );
};

export default FileUploadButton;
