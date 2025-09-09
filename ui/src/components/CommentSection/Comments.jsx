import React, { useEffect, useReducer, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import CircleList from "../DetailsListItems/CircleList";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import {
  CommentCreateAction,
  CommentDeleteAction,
  CommentEditAction,
  CommentListAction,
} from "../../redux/Action/comments/comments";

import { FaFile, FaImage, FaMicrophone, FaPlus, FaVideo } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";

import {
  Menu,
  MenuItem,
  MenuHandler,
  MenuList,
} from "@material-tailwind/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete, MdEdit, MdOutlineAttachFile, MdSend, MdOutlineCancel, MdOutlineCheckCircle } from "react-icons/md";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import { IoCloseCircleSharp } from "react-icons/io5";
import MediaFile from "./MediaFile";
// import { addError } from "../../Store/Reducers/error/ErrorReducer";

const Comments = ({ task }) => {
  const [selectedEditComment, setSelectedEditComment] = useState(null);
  const comments = useSelector((state) => state?.comments?.comments);
  const loading = useSelector((state) => state?.comments?.loading);
  const [showMedia, setShowMedia] = useState(false);
  const lastCommentRef = useRef();
  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [nextPage, setNextPage] = useState(false);
  const commentInputRef = useRef();
  const popupRef = useRef(null);
  const mediaInitialData = {
    Image: [],
    Video: [],
    Audio: [],
    Document: [],
    Location: [],
  };
  const [selectedMedia, setSelectedMedia] = useState({
    Image: [],
    Video: [],
    Audio: [],
    Document: [],
    Location: [],
  });
  const [hasPreview, setHasPreview] = useState(false);
  const { error } = useSelector((state) => state?.error);
  const mediaData = {
    Image: {
      icon: <FaImage className="w-5 h-5" />,
      accept: "image/*",
    },
    Video: {
      icon: <FaVideo className="w-5 h-5" />,
      accept: "video/*",
    },
    Audio: {
      icon: <FaMicrophone className="w-5 h-5" />,
      accept: "audio/*",
    },
    Document: {
      icon: <FaFile className="w-5 h-5" />,
      accept: ".pdf,.doc,.docx",
    },
    Location: {
      icon: <FaLocationDot className="w-5 h-5" />,
    },
  };

  const getComments = () => {
    let taskId = task?.subTaskId
      ? { subTaskId: task?.subTaskId }
      : { taskId: task?.taskId };
    dispatch(CommentListAction(taskId));
  };

  const addComments = async () => {
    const formData = new FormData();

    if (task?.subTaskId) {
      formData.append("taskId", task?.taskId);
      formData.append("subTaskId", task?.subTaskId);
    } else {
      formData.append("taskId", task?.taskId);
    }

    formData.append("comment", comment);

    // Handle all media types
    Object.entries(selectedMedia).forEach(([type, files]) => {
      files.forEach((item) => {
        if (item?.file) {
          formData.append("file", item.file);
        } else if (type === "Location" && item?.latitude && item?.longitude) {
          // If your backend expects location as a separate field
          formData.append(
            "location",
            JSON.stringify({
              latitude: item.latitude,
              longitude: item.longitude,
            })
          );
        }
      });
    });

    dispatch(CommentCreateAction(formData))?.then(({ payload }) => {
      if (payload?.status == 200) {
        setComment("");
        setSelectedMedia(mediaInitialData);
        getComments();
      }
    });
  };

  const getCommentList = async (reqbody) => {
    await dispatch(CommentListAction(reqbody))?.then(({ payload }) => {
      if (payload?.status == 200) {
        // console.log(payload?.data?.data);

        setNextPage(payload?.data?.next_page);
        // setComments((prev) => [...prev,...payload?.data?.data]);
      }
    });
  };
  const saveEditedComment = () => {
    dispatch(
      CommentEditAction({ _id: selectedEditComment, comment: comment })
    )?.then(({ payload }) => {
      if (payload?.status == 200) {
        setComment("");
        setSelectedEditComment(null);
        getComments();
      }
    });
  };

  const getDateForComment = (inputDate) => {
    const date = moment(inputDate).startOf("day");
    const today = moment().startOf("day");
    if (date.isSame(today, "day")) {
      return "Today";
    } else if (date.isSame(moment().subtract(1, "day"), "day")) {
      return "Yesterday";
    } else {
      return date.format("DD MMM"); // Fallback to a standard format
    }
  };

  const handleDeleteComment = (id) => {
    dispatch(CommentDeleteAction({ _id: id }))?.then(({ payload }) => {
      if (payload?.status == 200) {
        getComments();
      }
    });
  };

  const handleFocus = () => {
    if (commentInputRef.current) {
      commentInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  const handleFileChange = (e) => {
    const { files, name } = e.target; // Extract files and input name

    const fileArray = Array.from(files); // Convert FileList to an array
    const fileBlobs = fileArray.map((file) => ({
      file, // Original file object
      preview: URL.createObjectURL(file), // Blob URL for preview
    }));

    setSelectedMedia((prev) => ({
      ...prev,
      [name]: [...prev[name], ...fileBlobs], // Append new files to the correct category
    }));
    setShowMedia(false);
  };

  const handleRemoveElement = (idx, name) => {
    // console.log(idx, name);

    setSelectedMedia((prev) => {
      let temp = [...prev[name]];
      temp?.splice(idx, 1);
      return {
        ...prev,
        [name]: [...temp],
      };
    });
  };

  // console.log(selectedMedia);

  useEffect(() => {
    if (task?.taskId) {
      getComments();
    } else {
      // dispatch(addError({ comment: "Save the task to start commenting" }));
    }
  }, [task]);

  useEffect(() => {
    const hasFiles =
      selectedMedia.Image.length > 0 ||
      selectedMedia.Video.length > 0 ||
      selectedMedia.Audio.length > 0 ||
      selectedMedia.Document.length > 0 ||
      (selectedMedia.Location.lat && selectedMedia.Location.long);

    setHasPreview(hasFiles);
  }, [selectedMedia]); // Runs whenever `selectedMedia` changes

  useEffect(() => {
    if (nextPage) {
      const observer = new IntersectionObserver(
        (entries) => {
          const lastRow = entries[0];
          if (lastRow.isIntersecting) {
            // console.log("Last comment is visible");
          }
        },
        {
          root: null, // Use the viewport as the root
          threshold: 0.1, // Trigger when 10% of the last row is visible
        }
      );

      const currentLastRow = lastCommentRef.current;

      if (currentLastRow) {
        observer.observe(currentLastRow);
      }

      // Cleanup observer when effect re-runs
      return () => {
        if (currentLastRow) {
          observer.unobserve(currentLastRow);
        }
      };
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      let btn = document?.getElementById("closeBtn");

      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !btn.contains(event.target)
      ) {
        setShowMedia(false); // Close when clicking outside
      }
    };

    if (showMedia) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMedia]);


  return (
    <div className="flex flex-col h-full w-full border-2 border-gray-400 overflow-hidden rounded-md">
      {/* check if comment section has any comment or is loading */}
      {comments?.length && !loading ? (
        <div className="flex-1 overflow-y-auto scrolls bg-white p-2 flex flex-col-reverse gap-2 ">
          {comments?.map((comment, idx) => (
            <div className="flex flex-col gap-2 group " key={idx}>
              {/**print date if the coming comment has a previous date or their no next date */}
              {(!comments[idx + 1]?.createdAt ||
                moment(comment?.createdAt)?.isAfter(
                  comments[idx + 1]?.createdAt,
                  "day"
                )) && (
                  <div className="self-center text-[.7rem] font-medium bg-popLight text-popfont medium rounded-md p-1">
                    {getDateForComment(comment?.createdAt)}
                  </div>
                )}
              {comment?.mediaFiles?.length > 0 && (
                <MediaFile
                  mediaFiles={comment?.mediaFiles}
                  position={comment?.isOwnComment}
                />
              )}
              {comment?.status ? (
                <></>
                // <div className="self-center text-[.7rem] font-semibold max-w-[90%] text-wrap     overflow-hidden text-gray-900 bg-gray-300 rounded-md p-1 text-center">
                //   {/* {comment?.comment} */}
                // </div>
              ) : (
                <div
                  className={`flex gap-1 ${comment?.isOwnComment && `flex-row-reverse`
                    }`}
                  key={idx}
                >
                  {!comment?.isOwnComment && (
                    <div className="w-8 h-8">
                      <CircleList dataList={[comment]} />
                    </div>
                  )}
                  <div>
                    {/* <div
                      className={`relative p-1 px-2 rounded-md max-w-xs ${comment?.isOwnComment
                        ? "rounded-br-none bg-primary text-primaryLight text-sm "
                        : "rounded-bl-none bg-popLight text-sm text-primary"
                        } whitespace-pre-line flex flex-col gap-2`}
                    > */}
                    <div
                      className={`relative px-3 py-2 rounded-2xl max-w-xs whitespace-pre-line text-sm shadow-sm 
                         ${comment?.isOwnComment
                          ? "bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-br-none self-end"
                          : "bg-gray-100 rounded-bl-none self-start"
                        }`}
                    >
                      {/* {!comment?.isOwnComment && (
                        <span className=" text-xs text-gray-700 font-semibold">
                          {Object?.values(comment?.name)?.join(" ")}
                        </span>
                      )} */}
                      {!comment?.isOwnComment && (
                        <span className="text-xs text-gray-700 font-bold block">
                          {Object?.values(comment?.name)?.join(" ")}
                        </span>
                      )}
                      {/* <span>
                        {comment?.comment}

                      </span> */}
                      <span className="break-words leading-relaxed">
                        {comment?.comment}
                      </span>
                    </div>
                    <span className={`text-[.6rem] align-text-bottom ${comment?.isOwnComment
                      ? "flex-end float-right"
                      : "flex-start float-left"
                      } text-gray-600 pl-1`}>
                      {moment(comment?.createdAt).format("hh:mm A")}
                    </span>
                    {/* <span className={`text-[0.65rem] text-gray-300 absolute bottom-1 right-2`}>
                      {moment(comment?.createdAt).format("hh:mm A")}
                    </span> */}

                  </div>

                  {comment?.isOwnComment && (
                    <Menu className="z-10 prevent-sidebar-close ">
                      <MenuHandler>
                        <div className="w-3 h-3 cursor-pointer mt-1">
                          <BsThreeDotsVertical className="w-3 h-3 cursor-pointer p-none text-gray-600  group-hover:flex hidden" />
                        </div>
                      </MenuHandler>

                      <MenuList className="p-0 font-medium font-map text-gray-900">
                        <MenuItem
                          className="prevent-sidebar-close"
                          onClick={() => {
                            handleDeleteComment(comment?._id);
                          }}
                        >
                          <span className="flex items-center gap-2 ">
                            <MdDelete className="w-4 h-4 text-red-700 text-xs" />
                            Delete
                          </span>
                        </MenuItem>

                        <MenuItem
                          className="prevent-sidebar-close"
                          onClick={() => {
                            setSelectedEditComment(comment?._id);
                            setComment(comment?.comment);
                            commentInputRef.current.focus();
                          }}
                        >
                          <span className="flex items-center gap-2 ">
                            <MdEdit className="w-4 h-4 text-gray-700 text-xs" />
                            Edit
                          </span>
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto scrolls items-center justify-center p-2 flex flex-col gap-1">
          <span className="font-semibold text-gray-700">No comments yet</span>
          <span className={`"font-semibold text-sm ${error?.comment ? `text-red-400` : `text-gray-400`}`}>
            {error?.comment ?? `  Start a conversation`}
          </span>
        </div>
      )}
      {/* Input Section */}
      <div className="p-2 border-gray-700 bg-white relative flex flex-col gap-2 ">
        <AnimatePresence>
          {showMedia && (
            <motion.div
              ref={popupRef}
              key="media-popup"
              initial={{ opacity: 0, scale: 0, y: "50%" }}
              animate={{ opacity: 1, scale: 1, y: "0%" }}
              exit={{ opacity: 0, scale: 0, y: "50%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute bottom-[110%] left-[0%] w-fit rounded-md gap-2 items-center justify-center ml-2"
            >
              <div
                className={` flex flex-col gap-2 p-2 rounded-md px-2 flex-wrap justify-center w-fit shadow-md bg-white
              `}
              >
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
            </motion.div>
          )}
        </AnimatePresence>

        {hasPreview && !selectedEditComment && (
          <div className="flex gap-2 overflow-x-scroll scrolls bg-gray-400 rounded-md p-1 ">
            {Object?.entries(selectedMedia)?.map(([key, value], idx) => {
              return (
                value?.length > 0 &&
                value?.map((preview, pidx) => {
                  return (
                    <TooltipMaterial content={preview?.file?.name}>
                      <div
                        className="w-12 h-12 aspect-square  rounded-md relative group cursor-pointer bg-gray-300 flex items-center justify-center overflow-hidden "
                        key={pidx + `${idx}`}
                      >
                        <div className="absolute top-0 left-0 text-red-200 w-12 h-12 hidden group-hover:flex items-center  justify-center bg-[#0000008c] ">
                          <IoCloseCircleSharp
                            className="w-10 h-10"
                            onClick={() => {
                              handleRemoveElement(pidx, key);
                            }}
                          />
                        </div>

                        {key == "Image" ? (
                          <img
                            src={preview?.preview}
                            alt={mediaData?.[key]?.icon}
                            className=" w-12 h-12 object-cover "
                          />
                        ) : (
                          <div className="flex flex-col items-center ">
                            {mediaData?.[key]?.icon}
                            <span className="text-xs text-nowrap max-w-[5ch] truncate">
                              {preview?.file?.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </TooltipMaterial>
                  );
                })
              );
            })}
          </div>
        )}
        {/* <div className="flex gap-2 w-full rounded-md bg-popLight border border-gray-500 px-2 items-center">
          {!selectedEditComment && (
            <button
              onClick={() => {
                setShowMedia((prev) => !prev);
              }}
              id="closeBtn"
              className={`text-blue-800 rounded-md w-5 h-5 flex items-center  justify-center aspect-square rotate-[45deg]  ${showMedia && `rotate-[181deg]`
                }   transition-smooth`}
            >
              <MdOutlineAttachFile className="w-6 h-6" />{" "}
            </button>
          )}
          <input
            className="w-full bg-transparent rounded-xl p-2 min-h-10 scrolls peer placeholder-gray-600 focus:outline-none focus:ring-0 focus:border-none"
            ref={commentInputRef}
            value={comment}
            placeholder="Enter message here..."
            onFocus={handleFocus}
            onChange={(e) => {
              let { value } = e.target;
              setComment(value);
            }}
            style={{ minHeight: "40px", maxHeight: "150px" }} // Optional: Prevent too much expansion
          />

          <div className="flex gap-2 items-center justify-center">
            {selectedEditComment && (
              <TooltipMaterial content={"Cancel"}>
                <button
                  className=""
                  onClick={() => {
                    setSelectedEditComment(null);
                    setComment("");
                  }}
                >
                  <MdOutlineCancel className="mt-2 text-blue-800 w-6 h-6" />
                </button>
              </TooltipMaterial>

            )}
            {selectedEditComment && (
              <TooltipMaterial content={"Save"}>
                <button
                  onClick={() => {
                    if (selectedEditComment) return saveEditedComment();
                    addComments();
                  }}
                > <MdOutlineCheckCircle className="mt-2 text-blue-800 w-6 h-6" />
                </button>
              </TooltipMaterial>
            )}
            {!selectedEditComment && (
              <MdSend onClick={() => {
                if (!comment) return toast?.error("Comment cannot be empty");
                addComments();
              }} className="w-5 h-5 text-blue-800" />
            )}
          </div>
        </div> */}
        <div className="flex items-center gap-2 w-full bg-white px-2 rounded-xl border border-gray-300 shadow-sm">
          {!selectedEditComment && (
            <button
              onClick={() => setShowMedia((prev) => !prev)}
              id="closeBtn"
              className={`text-blue-700 hover:text-blue-500 rounded-full w-8 h-8 flex items-center justify-center transition-transform duration-200 ${showMedia ? "rotate-[181deg]" : "rotate-[45deg]"
                }`}
            >
              <MdOutlineAttachFile className="w-5 h-5" />
            </button>
          )}

          {/* Input Box */}
          {selectedEditComment ? (
            <textarea
              ref={commentInputRef}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Edit your message..."
              className="flex-1 bg-transparent resize-none rounded-md text-sm leading-tight text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none min-h-[40px] max-h-[150px] py-2"
            />
          ) : (
            <input
              ref={commentInputRef}
              type="text"
              value={comment}
              onFocus={handleFocus}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter message here..."
              className="flex-1 bg-transparent rounded-md text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 focus:border-none min-h-[40px]"
            />
          )}

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {selectedEditComment && (
              <>
                <TooltipMaterial content="Cancel">
                  <button onClick={() => {
                    setSelectedEditComment(null);
                    setComment("");
                  }}>
                    <MdOutlineCancel className="text-blue-700 hover:text-red-500 w-6 h-6" />
                  </button>
                </TooltipMaterial>

                <TooltipMaterial content="Save">
                  <button
                    onClick={() => {
                      if (selectedEditComment) return saveEditedComment();
                      addComments();
                    }}
                  >
                    <MdOutlineCheckCircle className="text-blue-700 hover:text-green-600 w-6 h-6" />
                  </button>
                </TooltipMaterial>
              </>
            )}

            {!selectedEditComment && (
              <TooltipMaterial content="Send">
                <button
                  onClick={() => {
                    if (!comment) return toast?.error("Comment cannot be empty");
                    addComments();
                  }}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white p-2 hover:scale-110 transition-transform duration-150"
                >
                  <MdSend className="w-4 h-4" />
                </button>
              </TooltipMaterial>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default Comments;
