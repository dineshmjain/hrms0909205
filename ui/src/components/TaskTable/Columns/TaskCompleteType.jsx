import React, { useState } from "react";
import Chips from "../../Chips/Chips";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { IoLocationSharp } from "react-icons/io5";
import { HiQrCode } from "react-icons/hi2";
import { PiScanSmileyBold } from "react-icons/pi";
import { MdCancel } from "react-icons/md";
import { BiCurrentLocation } from "react-icons/bi";
import { RiProgress6Line } from "react-icons/ri";
import { useSelector } from "react-redux";

const TaskCompleteType = ({
  data,
  idx,
  subData,
  subIdx,
  handleChange,
  details,
}) => {
  const recList = {
    status: {
      name: "Status",
      
      icon: <RiProgress6Line className="w-4 h-4" />,
    },
    GPS: {
      name: "GPS location",
      icon: <BiCurrentLocation className="w-4 h-4" />,
      defaultValue: { name: "GPSLocation", value: {} },
    },
    checkpoints: {
      name: "Checkpoint",
      icon: <IoLocationSharp className="w-4 h-4" />,
      defaultValue: { name: "checkpointIds", value: [] },
    },
  };
  const actualData = subIdx == undefined ? data : subData;
  const [isOpen, setIsOpen] = useState(false);
  const { error } = useSelector((state) => state?.error);

  const len = actualData?.taskEndType?.length;
  return (
    <div className=" ">
      {" "}
      <Menu
        open={isOpen}
        handler={(e) => {
          if (!(details?.isEditable == false)) {
            setIsOpen(e);
          }
        }}
        allowHover
        dismiss={{ itemPress: false }}
      >
        <MenuHandler>
          <div
            className={`flex items-center w-full justify-between  prevent-modal-open cursor-pointer gap-2 text-sm font-medium truncate max-w-[13ch] hover:bg-gray-400 p-1 rounded-md ${
              error[`taskEndType-${idx}`] && `border-red-500 border-2 `
            }`}
          >
            {len > 0
              ? recList?.[actualData?.taskEndType[0]]?.name +
                (len > 1 ? ` +${len - 1}` : ``)
              : `Empty`}
          </div>
        </MenuHandler>

        <MenuList className="bg-gray-100 text-gray-900 prevent-modal-open prevent-modal-open  flex flex-col gap-2">
          {Object?.entries(recList)?.map(([key, data], iIdx) => {
            let isSelected = actualData?.taskEndType?.includes(key);
            return (
              <MenuItem
                key={iIdx}
                onClick={async () => {
                  let value = [...actualData?.taskEndType];
                  if (isSelected) {
                    value = value.filter((item) => item != key);
                  } else {
                    value.push(key);
                  }
                  let e = {
                    target: {
                      name: "taskEndType",
                      value: value,
                    },
                  };
                  await handleChange(e, idx, subIdx);
                  if (data?.defaultValue) {
                    e.target.name = data.defaultValue.name;
                    e.target.value = isSelected
                      ? null
                      : data.defaultValue.value;
                  }
                  handleChange(e, idx, subIdx);
                }}
                className={`flex items-center  justify-between group relative  prevent-modal-open focus:bg-gray-500 cursor-pointer gap-2 font-medium p-1 rounded-md ${
                  isSelected && `bg-gray-400  text-green-800 hover:text-red-900`
                }`}
              >
                <div className="flex gap-2 items-center">
                  {" "}
                  {data?.icon} {data?.name}{" "}
                </div>
                {isSelected && (
                  <MdCancel className="w-5 h-5 group-hover:flex hidden absolute top-[10%] right-1" />
                )}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>{" "}
    </div>
  );
};

export default TaskCompleteType;
