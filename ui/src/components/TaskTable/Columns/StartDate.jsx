import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const StartDate = ({ projectData, data, idx, handleChange, handleUpdate }) => {
  const error = useSelector((state) => state.error?.error);
  return (
    <>
      <input
        value={data?.startDate}
        onChange={(e) => {
          if (data?.endDate && moment(data?.endDate).isBefore(e.target.value)) {
            return toast.error("Start Date should be before End Date");
          }
          return handleChange(e, idx);
        }}
        type="date"
        name="startDate"
        // min={projectData?.startDate}
        max={data?.endDate}
        onBlur={(e) => {
          handleUpdate(e, idx);
        }}
        id="startDate"
        placeholder="Start Date"
        className={`px-2 p-1 hover:bg-gray-400 ${
          error?.[`startDate-${idx}`] && `border-red-600 border-2 border-box `
        } bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] self-center h-fit w-[130px] text-sm `}
      />
    </>
  );
};

export default StartDate;
