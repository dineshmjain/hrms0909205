import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { MdCancel } from "react-icons/md";
import toast from "react-hot-toast";
import moment from "moment";

const TimesStartTime = ({
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
      value={actualData?.startTime}
      onChange={(e) => {
        let value = e.target.value;
        if (actualData?.endTime) {
          const start = moment(value, "HH:mm");
          const end = moment(actualData?.endTime, "HH:mm");
          if (start?.isAfter(end))
            return toast.error("Start Time should be before End Time");
        }

        let temp = subIdx == undefined ? [...data?.times] : [...subData?.times];
        temp[timesIdx] = { ...actualData, startTime: value };
        let event = {
          target: {
            name: "times",
            value: [...temp],
          },
        };
        return handleChange(event, idx);
      }}
      type="time"
      name="startTime"
      max={actualData?.endTime}
      //   onBlur={(e) => {
      //     handleUpdate(e, idx, subIdx);
      //   }}
      id="from"
      placeholder="Start Time"
      className={`px-2 p-1 hover:bg-gray-400 bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] self-center h-fit w-[130px] text-sm ${
        error?.[`${timesIdx}-startTime-${idx}`] && `border-red-600 border-2 border-box `
      }`}
    />
  );
};

export default TimesStartTime;
