import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import moment from "moment";

const TImesEndtime = ({
  data,
  idx,
  subData,
  subIdx,
  timesIdx,
  isEditable,
  handleChange,
  handleUpdate,
  details,
  projectData,
}) => {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const error = useSelector((state) => state?.error?.error);
  const actualData =
    subIdx == undefined ? data?.times?.[timesIdx] : subData?.times?.[timesIdx];
  const { designationList } = useSelector((state) => state?.designation);

  return (
    <input
      value={actualData?.endTime}
      onChange={(e) => {
        let value = e.target.value;
        if (actualData?.startTime) {
          const start = moment(actualData?.startTime, "HH:mm");
          const end = moment(value, "HH:mm");
          if (end.isBefore(start))
            return toast.error("End Time should be after Start Time");
        }

        let temp = subIdx == undefined ? [...data?.times] : [...subData?.times];
        temp[timesIdx] = { ...actualData, endTime: value };
        let event = {
          target: {
            name: "times",
            value: [...temp],
          },
        };
        return handleChange(event, idx);
      }}
      type="time"
      name="endTime"
      min={actualData?.startTime}
      //   onBlur={(e) => {
      //     handleUpdate(e, idx, subIdx);
      //   }}
      id="to"
      placeholder="End Time"
      className={`px-2 p-1 hover:bg-gray-400 bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] self-center h-fit w-[130px] text-sm ${
        error?.[`${timesIdx}-endTime-${idx}`] &&
        `border-red-600 border-2 border-box `
      }`}
    />
  );
};

export default TImesEndtime;
