import React from "react";
import { FaMinus } from "react-icons/fa";
import { IoMdAdd, IoMdRemove } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import TooltipMaterial from "../../TooltipMaterial/TooltipMaterial";

const Actions = ({
  data,
  idx,
  subData,
  subIdx,
  isEditable,
  handleAddSubTask,
  handleRemoveSubTask,
  details,
}) => {
  return (
    <div className="flex w-full justify-center prevent-modal-open">
      <TooltipMaterial content="Remove Sub Task">
        <div
          className="p-2 hover:bg-red-200 rounded-md cursor-pointer prevent-modal-open "
          onClick={() => handleRemoveSubTask(idx, subIdx)}
        >
          <IoMdRemove className="w-4 h-4" />
        </div>
      </TooltipMaterial>
      {subIdx + 1 == data?.subTaskData?.length ? (
        <TooltipMaterial content="Add Sub Task">
          <div 
            className="p-2 hover:bg-blue-200 rounded-md cursor-pointer prevent-modal-open "
            onClick={() => handleAddSubTask(idx, subIdx)}
          >
            <IoMdAdd className="w-4 h-4" />
          </div>
        </TooltipMaterial>
      ) : (
        <div className="w-8 h-8  rounded-md "></div>
      )}
    </div>
  );
};

export default Actions;
