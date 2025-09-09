import React, { useEffect, useState, useMemo } from "react";
import { getFileType } from "../../constants/reusableFun";
import { FaFile, FaImage, FaMicrophone, FaVideo } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdDownload } from "react-icons/md";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import { Dialog, DialogBody, DialogHeader, IconButton } from '@material-tailwind/react';
import { HiOutlineXMark } from "react-icons/hi2";
const baseURL = import.meta.env.MEDIA_BASE_URL || `http://192.168.1.118:8052/`;

const MediaFile = ({ mediaFiles, position }) => {

  const [openDialog, setOpenDialog] = useState(false);
  const [image, setImage] = useState("");
  const handleDownload = async (filePath) => {
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

  const viewImage = (event, file) => {
    event.stopPropagation()
    setOpenDialog(true)
    setImage(`${baseURL}${file}`)
  }

  const closeDialog = (event) => {
    event.stopPropagation()
    setOpenDialog(false)
  }


  const handleRetunMedia = (file, type) => {
    switch (type) {
      case "image":
        return (
          <img
            src={`${baseURL}${file}`}
            alt={file?.split("/")?.[1]}
            className="w-44 h-44 apsect-sqaure object-cover" onClick={(event) => viewImage(event, file)}
          />
        );
      case "video":
        return (
          <video
            src={`${baseURL}${file}`}
            alt={file?.split("/")?.[1]}
            className="h-44 apsect-video object-cover"
            controls
          />
        );
      case "document":
        return (

          <div className="w-44 h-44 apsect-sqaure flex flex-col items-center justify-between ">
            <TooltipMaterial content={file?.split("/")?.[1]}>
              <span className="self-start max-w-[15ch] truncate text-sm font-medium ">
                {file?.split("/")?.[1]}
              </span>
            </TooltipMaterial>
            <FaFile className="w-20 h-20 text-blue-500" />
            <span></span>
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
          <div className="w-44 apsect-video flex flex-col items-center justify-between rounded-md bg-blue-50 p-1 cursor-pointer " onClick={() => {

          }}>
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
  return (
    <>
        <Dialog open={openDialog} size='sm' className="prevent-sidebar-close">
          <DialogHeader className="flex justify-between">
            <HiOutlineXMark onClick={(event) => closeDialog(event)} />
          </DialogHeader>
          <DialogBody >
            <img
              src={image}
              alt={image?.split("/")?.[1]}
              className="w-50 h-50 apsect-sqaure object-cover"
            />
                    </DialogBody>
                 </Dialog>
      <div className="flex flex-col w-full gap-2 ">
        {mediaFiles?.map((file, fidx) => {
          const mediaType = getFileType(file);

          return (
            <div
              className={` h-fit p-2 w-fit  bg-blue-100 rounded-b-md group/item   relative ${position ? `rounded-l-md self-end` : `rounded-r-md ml-8`
                } overflow-hidden`}
              key={fidx}
            >
              {mediaType != "location" && (
                <div
                  className="absolute hidden top-3 right-3 p-1 rounded-md bg-blue-200 cursor-pointer group-hover/item:flex "
                  onClick={() => handleDownload(file)}
                >
                  <MdDownload className="w-6 h-6" />
                </div>
              )}{" "}
              {handleRetunMedia(file, mediaType)}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MediaFile;
