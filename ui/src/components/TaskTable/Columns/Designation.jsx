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

const Designation = ({
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
    <div className="">
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
          <span
            className={`cursor-pointer prevent-modal-open text-sm hover:bg-gray-400 font-medium px-2 p-1 max-w-[18ch] truncate rounded-md flex self-center justify-self-center items-center  ${
              error?.[`${timesIdx}-designationId-${idx}`] &&
              `border-red-600 border-2 border-box `
            }`}
          >
            {actualData?.designationId
              ? designationList?.find(
                  (check) => check?._id == actualData?.designationId
                )?.name
              : "Select Deignation"}
          </span>
        </MenuHandler>
        <MenuList className="bg-gray-100 text-gray-900  flex gap-1 flex-col justify-center w-fit items-center prevent-modal-open">
          {designationList?.map((designation, iIdx) => {
            let isSelected = actualData?.designationId == designation?._id;

            return (
              <MenuItem
                key={iIdx}
                className={`  group  p-1 px-2  flex justify-between items-center prevent-modal-open  hover:bg-opacity-80 focus:bg-gray-500  ${
                  isSelected && `bg-gray-400  `
                }`}
                onClick={() => {
                  let value = isSelected ? "" : designation?._id;
                  let temp =
                    subIdx == undefined
                      ? [...data?.times]
                      : [...subData?.times];
                  temp[timesIdx] = { ...actualData, designationId: value };
                  let e = {
                    target: {
                      name: "times",
                      value: [...temp],
                    },
                  };
                  handleChange(e, idx, subIdx);
                }}
              >
                <span className="h-5 ">{designation?.name}</span>
                {isSelected && (
                  <MdCancel className="w-5 h-5 group-hover:flex hidden  text-red-900" />
                )}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
};

export default Designation;
