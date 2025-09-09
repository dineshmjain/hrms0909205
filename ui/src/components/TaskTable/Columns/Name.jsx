import React from "react";
import { BiCommentDetail } from "react-icons/bi";
import { useSelector } from "react-redux";

const Name = ({
  data,
  idx,
  subData,
  subIdx,
  isEditable,
  handleChange,
  handleShowComments,
  handleUpdate,
  details,
}) => {
  const { error } = useSelector((state) => state?.error);
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <textarea
        rows={1}
        className={`max-w-full  bg-transparent prevent-modal-open text-center scrolls hover:bg-gray-400 px-4 p-1 rounded-md font-medium outline-none focus:bg-gray-400 ${
          error?.[`name-${idx}-${subIdx}`] &&
          `border-red-600 border-2 border-box  `
        }`}
        type="text"
        placeholder="Subdata Name"
        name={"name"}
        disabled={details?.isEditable == false}
        onChange={(e) => {
          handleChange(e, idx, subIdx);
        }}
        onBlur={(e) => {
          handleUpdate(e, idx, subIdx);
        }}
        value={subData?.name}
      />
      <div
        className="p-1 hover:bg-gray-400 rounded-md cursor-pointer"
        onClick={() =>
          handleShowComments({ taskId: data?._id, subTaskId: subData?._id })
        }
      >
        <BiCommentDetail className="w-5 h-5  prevent-modal-open " />
      </div>
    </div>
  );
};

export default Name;
