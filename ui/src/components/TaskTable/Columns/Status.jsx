import React, { useState } from "react";
import Chips from "../../Chips/Chips";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";

const Status = ({
  data,
  idx,
  subData,
  subIdx,
  handleChange,
  details,
}) => {
  const statusList = {
    pending: { value: "Pending", color: "#fde047" },
    inProgress: { value: "In Progress", color: "#ffa500" },
    completed: { value: "Completed", color: "#008000" },
  };
  const acutalData =  subIdx == undefined ? data : subData;
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
      >
        <MenuHandler>
          <div className="flex items-center w-full justify-center text-sm prevent-modal-open ">
            <Chips
              color={statusList[acutalData?.status]?.color}
              text={statusList[acutalData?.status]?.value}
            />
          </div>
        </MenuHandler>

        <MenuList className="bg-gray-100 text-gray-900 prevent-modal-open prevent-modal-open ">
          {Object?.entries(statusList)?.map(([key, value], iIdx) => {
            return (
              <MenuItem
                key={iIdx}
                className="p-1"
                onClick={() => {
                  if (value?.value == statusList[acutalData?.status]?.value)
                    return;
                  let e = {
                    target: {
                      name: "status",
                      value: key,
                    },
                  };
                  handleChange(e, idx, subIdx);
                }}
              >
                <div className="flex items-center w-full justify-center font-manrope">
                  <Chips color={value?.color} text={value?.value} />
                </div>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>{" "}
    </div>
  );
};

export default Status;
