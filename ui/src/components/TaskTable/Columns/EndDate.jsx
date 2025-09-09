import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const EndDate = ({
  projectData,
  data,
  idx,
  handleChange,
  handleUpdate,
}) => {
  const error = useSelector((state) => state.error?.error);
  return (
    <input
      value={data?.endDate}
      onChange={(e) => {
        // if (!projectData?.startDate || !projectData?.endDate) {
        //   return toast.error("Select Project Date");
        // }
        if (
          data?.startDate &&
          moment(data?.startDate).isAfter(e.target.value)
        ) {
          return toast.error("End Date should be After Start Date");
        }
        return handleChange(e, idx);
      }}
      type="date"
      name="endDate"
      placeholder="Start Date"
      min={data?.startDate}
      // max={projectData?.endDate}
      onBlur={(e) => {
        handleUpdate(e, idx);
      }}
      id="from"
      className={` hover:bg-gray-400 ${
        error?.[`endDate-${idx}`] && `border-red-600 border-2 border-box `
      } bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] w-[130px] h-fit px-2 p-1 text-sm`}
    />
  );
};

export default EndDate;
