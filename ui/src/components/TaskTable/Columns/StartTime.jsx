import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const StartTime = ({ projectData, data, idx, handleChange, handleUpdate }) => {
  const error = useSelector((state) => state.error?.error);
  return (
    <input
      value={data?.startTime}
      onChange={(e) => {
        if (data?.endTime) {
          const start = moment(e.target.value, "HH:mm");
          const end = moment(data?.endTime, "HH:mm");
          if (start?.isAfter(end))
            return toast.error("Start Time should be before End Time");
        }
        return handleChange(e, idx);
      }}
      type="time"
      name="startTime"
      // min={projectData?.startTime}
      max={data?.endTime}
      onBlur={(e) => {
        handleUpdate(e, idx);
      }}
      id="from"
      placeholder="Start Time"
      className={`px-2 p-1 hover:bg-gray-400 ${
        error?.[`startTime-${idx}`] && `border-red-600 border-2 border-box `
      } bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] self-center h-fit w-[130px] text-sm`}
    />
  );
};

export default StartTime;
