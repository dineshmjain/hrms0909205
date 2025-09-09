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

const TaskRecognition = ({
  data,
  idx,
  subData,
  subIdx,
  handleChange,
  details,
}) => {
  const recList = {
    location: {
      name: "Location",
      icon: <IoLocationSharp className="w-4 h-4" />,
    },
    face: {
      name: "Face Regonition",
      icon: <PiScanSmileyBold className="w-4 h-4" />,
    },
    qr: { name: "Qr Code   ", icon: <HiQrCode className="w-4 h-4" /> },
  };
  const acutalData = subIdx == undefined ? data : subData;
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="flex items-center w-full justify-between  prevent-modal-open cursor-pointer gap-2 font-medium truncate max-w-[13ch] hover:bg-gray-400 p-1 rounded-md">
            {acutalData?.taskRecognition?.length
              ? acutalData?.taskRecognition?.map(
                  (type) => `${recList[type]?.name},`
                )
              : "Select type"}
          </div>
        </MenuHandler>

        <MenuList className="bg-gray-100 text-gray-900 prevent-modal-open prevent-modal-open  flex flex-col gap-2">
          {Object?.entries(recList)?.map(([key, value], iIdx) => {
            let isSelected = acutalData?.taskRecognition?.includes(key);
            return (
              <MenuItem
                key={iIdx}
                onClick={() => {
                  let value = [...acutalData?.taskRecognition];
                  if (isSelected) {
                    value = value.filter((item) => item != key);
                  } else {
                    value.push(key);
                  }
                  let e = {
                    target: {
                      name: "taskRecognition",
                      value: value,
                    },
                  };
                  handleChange(e, idx, subIdx);
                }}
                className={`flex items-center  justify-between group relative  prevent-modal-open focus:bg-gray-500 cursor-pointer gap-2 font-medium p-1 rounded-md ${
                  isSelected && `bg-gray-400  `
                }`}
              >
                <div className="flex gap-2 items-center">
                  {" "}
                  {value?.icon} {value?.name}{" "}
                </div>
                {isSelected && (
                  <MdCancel className="w-5 h-5 group-hover:flex hidden  text-red-900 absolute top-[10%] right-1" />
                )}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>{" "}
    </div>
  );
};

export default TaskRecognition;
