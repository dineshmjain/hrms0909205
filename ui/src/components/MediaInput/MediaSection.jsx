import React, { useState } from "react";
import { FaImage, FaVideo, FaMicrophone, FaFile } from "react-icons/fa6";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { MediaUploadAction } from "../../redux/Action/Media/MediaAction";
import ReturnMedia from "./ReturnMedia";

const mediaData = {
  Image: {
    icon: <FaImage className="w-6 h-6" />,
    accept: "image/*",
    apiName: "image",
  },
  Video: {
    icon: <FaVideo className="w-6 h-6" />,
    accept: "video/*",
    apiName: "video",
  },
  Audio: {
    icon: <FaMicrophone className="w-6 h-6" />,
    accept: "audio/*",
    apiName: "audio",
  },
  Document: {
    icon: <FaFile className="w-6 h-6" />,
    accept: ".pdf,.doc,.docx",
    apiName: "attachment",
  },
};

const MediaSection = ({
  selectedMedia,
  setSelectedMedia,
  existingMedia,
  setExistingMedia,
}) => {
  const dispatch = useDispatch();

  const handleRemoveElement = (idx, name) => {
    setSelectedMedia((prev) => {
      const temp = [...prev[name]];
      temp.splice(idx, 1);
      return {
        ...prev,
        [name]: temp,
      };
    });
  };

  const handleRemoveExisting = (idx, name) => {
    setExistingMedia((prev) => {
      const temp = [...prev[name]];
      temp.splice(idx, 1);
      return {
        ...prev,
        [name]: temp,
      };
    });
  };

  const handleFileChange = (e) => {
    const { files, name } = e.target;
    const fileArray = Array.from(files);

    const fileBlobs = fileArray.map((file) => ({
      id: crypto.randomUUID(), // Unique ID for tracking
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
      error: null,
    }));

    // Add files to state with uploading=true
    setSelectedMedia((prev) => ({
      ...prev,
      [name]: [...(prev[name] || []), ...fileBlobs],
    }));

    console.log(fileBlobs, "<-------------");

    // Upload each file
    fileBlobs.forEach(async (blob) => {
      try {
        const response = await dispatch(
          MediaUploadAction({
            type: mediaData?.[name]?.apiName,
            file: blob.file,
          })
        );
        console.log(response);

        const uploadedUrl = response?.payload?.data?.[0]?.filePath;

        setSelectedMedia((prev) => {
          const updated = [...(prev[name] || [])];
          const targetIndex = updated.findIndex((item) => item.id === blob.id);
          if (targetIndex === -1) return prev;

          updated[targetIndex] = {
            ...updated[targetIndex],
            uploading: false,
            uploadedUrl,
          };
          return { ...prev, [name]: updated };
        });
      } catch (err) {
        console.error("Upload failed", err);
        setSelectedMedia((prev) => {
          const updated = [...(prev[name] || [])];
          const targetIndex = updated.findIndex((item) => item.id === blob.id);
          if (targetIndex === -1) return prev;

          updated[targetIndex] = {
            ...updated[targetIndex],
            uploading: false,
            error: "Upload failed",
          };
          return { ...prev, [name]: updated };
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Upload buttons */}
      <div className="flex flex-wrap gap-4">
        {Object.entries(mediaData).map(([name, media], midx) => (
          <TooltipMaterial key={midx} content={`Attach ${name}`}>
            <label
              htmlFor={name}
              className="rounded-md cursor-pointer h-fit aspect-square flex items-center justify-center p-2 hover:bg-primaryLight hover:text-primary"
            >
              {media.icon}
              <input
                id={name}
                name={name}
                type="file"
                className="hidden"
                accept={media.accept}
                multiple
                onChange={handleFileChange}
              />
            </label>
          </TooltipMaterial>
        ))}
      </div>

      {/* Preview section */}
      <div className="flex gap-2 flex-wrap rounded-md p-1 w-fit">
        {/*selected Media */}
        {Object.entries(selectedMedia).map(([key, value], idx) =>
          value.map((preview, pidx) => (
            <TooltipMaterial content={preview?.file?.name} key={preview.id}>
              <div className="w-24 h-24 rounded-md relative group cursor-pointer bg-blue-100 flex items-center justify-center overflow-hidden">
                {/* Delete icon on hover */}
                <div className="absolute top-0 left-0 w-full h-full p-1 sm:hidden flex sm:group-hover:flex items-start justify-end bg-[#0000003b]">
                  <div className="p-1 rounded-md bg-blue-100">
                    <MdDelete
                      className="w-4 h-4 text-red-800"
                      onClick={() => handleRemoveElement(pidx, key)}
                    />
                  </div>
                </div>

                {/* Upload states */}
                {preview.uploading ? (
                  <div className="flex flex-col items-center text-blue-800 text-sm animate-pulse">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-1" />
                    Uploading...
                  </div>
                ) : preview.error ? (
                  <div className="flex flex-col items-center text-red-600 text-sm">
                    <span>❌</span>
                    Failed
                  </div>
                ) : key === "Image" ? (
                  <img
                    src={preview.preview}
                    alt="uploaded"
                    className="w-20 h-20 object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-center px-1">
                    {mediaData?.[key]?.icon}
                    <span className="text-xs truncate max-w-[8ch]">
                      {preview?.file?.name}
                    </span>
                  </div>
                )}
              </div>
            </TooltipMaterial>
          ))
        )}
        {/* existing Media */}
        {Object.entries(existingMedia).map(([key, value], idx) =>
          value.map((filePath, pidx) => {
            return (
              <TooltipMaterial content={filePath?.split("/")?.[2]} key={pidx}>
                <div className="w-24 h-24 rounded-md relative group cursor-pointer bg-blue-100 flex items-center justify-center overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full p-1 sm:hidden flex sm:group-hover:flex items-start justify-end bg-[#0000003b]">
                    <div className="p-1 rounded-md bg-blue-100">
                      <MdDelete
                        className="w-4 h-4 text-red-800"
                        onClick={() => handleRemoveExisting(pidx, key)}
                      />
                    </div>
                  </div>
                  <ReturnMedia
                    key={pidx}
                    type={key?.toLocaleLowerCase()}
                    file={filePath}
                  />
                </div>
              </TooltipMaterial>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MediaSection;
