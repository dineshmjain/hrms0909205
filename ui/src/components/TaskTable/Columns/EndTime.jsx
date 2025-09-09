import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const EndTime = ({ projectData, data, idx, handleChange, handleUpdate }) => {
  const error = useSelector((state) => state.error?.error);
  return (
    <input
      value={data?.endTime}
      onChange={(e) => {
        if (data?.startTime) {
          const end = moment(e.target.value, "HH:mm");
          const start = moment(data?.startTime, "HH:mm");
          if (start?.isAfter(end))
            return toast.error("End Time should be after Start Time");
        }
        return handleChange(e, idx);
      }}
      type="time"
      name="endTime"
      min={data?.startTime}
      onBlur={(e) => {
        handleUpdate(e, idx);
      }}
      id="to"
      placeholder="End Time"
      className={`px-2 p-1 hover:bg-gray-400 ${
        error?.[`endTime-${idx}`] && `border-red-600 border-2 border-box `
      } bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] self-center h-fit w-[130px] text-sm`}
    />
  );
};

export default EndTime;
