import React from "react";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import { FaFile } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const baseURL = import.meta.env.MEDIA_BASE_URL || "http://192.168.1.118:8052";

export const handleDownloadMedia = async (filePath) => {
  try {
    const response = await fetch(`${baseURL}${filePath}`);
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filePath?.split("/")?.[1];
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Download error:", error);
  }
};

const ReturnMedia = ({ file, type, className }) => {
  switch (type) {
    case "image":
      return (
        <img
          src={`${baseURL}${file}`}
          alt={file?.split("/")?.[1]}
          className={`w-20 h-20 apsect-sqaure object-cover`}
        />
      );
    case "video":
      return (
        <video
          src={`${baseURL}${file}`}
          alt={file?.split("/")?.[1]}
          className="w-20 h-20 apsect-video object-cover"
          controls
        />
      );
    case "document":
      return (
        <div
          className={`w-22 h-22 apsect-sqaure flex flex-col items-center justify-between `}
        >
          <FaFile className="w-10 h-10 text-blue-500" />
          <span className="self-start truncate text-sm font-medium text-blue-900">
            {file?.split("/")?.[2]?.split(".")[1]}
          </span>
        </div>
      );
    case "audio":
      return (
        <audio
          src={`${baseURL}${file}`}
          alt={file?.split("/")?.[1]}
          className="w-52 "
          controls
        />
      );
    case "location":
      return (
        <div
          className={`w-44 apsect-video flex flex-col items-center justify-between rounded-md bg-blue-50 p-1 cursor-pointer`}
          onClick={() => {}}
        >
          <TooltipMaterial content={`Keshwapur`}>
            <span className="self-start max-w-[15ch] truncate text-sm font-medium ">
              Keshwapur
            </span>
          </TooltipMaterial>
          <FaLocationDot className="w-14 h-14 text-red-500" />
          <span></span>
        </div>
      );
  }
};

export default ReturnMedia;
