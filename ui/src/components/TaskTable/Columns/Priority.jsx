import React, { useState } from "react";
import Chips from "../../Chips/Chips";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";

const Priority = ({
  data,
  idx,
  subData,
  subIdx,
  isEditable,
  handleChange,
  handleUpdate,
  type,
  details,
}) => {
  const priorityList = {
    high: { color: "#cc2b2b", value: "High" },
    medium: { color: "#0f27af", value: "Medium" },
    low: { color: "#808080", value: "Low" },
  };

  const [isOpen, setIsOpen] = useState(false);
  const actualData = subIdx == undefined ? data : subData;

  return (
    <div className="">
      {" "}
      <Menu
        open={isOpen}
        handler={(e) => {
          if (!(details?.isEditable == false)) {
            setIsOpen(e);
          }
        }}
        allowHover
        className="prevent-modal-open "
      >
        <MenuHandler>
          <div className="flex items-center w-full justify-center text-sm prevent-modal-open">
            <Chips
              color={priorityList[actualData?.priority]?.color}
              text={priorityList[actualData?.priority]?.value}
            />
          </div>
        </MenuHandler>

        <MenuList className="bg-gray-100 text-gray-900 prevent-modal-open">
          {Object?.entries(priorityList)?.map(([key, value], iIdx) => {
            return (
              <MenuItem
                key={iIdx}
                className="p-1"
                onClick={() => {
                  if (value?.value == priorityList[actualData?.priority]?.value)
                    return;
                  let e = {
                    target: {
                      name: "priority",
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

export default Priority;
