import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import React, { useState } from "react";

const TaskType = ({
  data,
  idx,
  subData,
  subIdx,
  isEditable,
  handleChange,
  details,
}) => {
  const typeList = {
    oneTime: { Name: "One Time", defaultDueByValue: null },

    daily: {
      Name: "Daily Recursive",
      defaultDueByValue: null,
    },

    weekly: { Name: "Weekly Recursive", defaultDueByValue: ["monday"] },

    monthly: { Name: "Monthly Recursive", defaultDueByValue: "1" },
  };

  const actualData = subIdx == undefined ? data : subData;

  const [isOpen, setIsOpen] = useState(false);
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
      >
        <MenuHandler>
          <span className="cursor-pointer hover:bg-gray-400 font-medium px-2 p-1 text-sm rounded-md w-fit self-center">
            {typeList?.[actualData?.taskType]?.Name}
          </span>
        </MenuHandler>
        <MenuList className="bg-gray-100 text-gray-900 prevent-modal-open ">
          {Object?.entries(typeList)?.map(([taskTypeName, value], iIdx) => {
            return (
              <MenuItem
                className=""
                key={iIdx}
                onClick={async () => {
                  let e = {
                    target: {
                      name: "taskType",
                      value: taskTypeName,
                    },
                  };

                  await handleChange(e, idx, subIdx);
                  e.target = {
                    name: "dueBy",
                    value: value?.defaultDueByValue,
                  };
                   handleChange(e, idx, subIdx);
                }}
              >
                {value?.Name}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </div>
  );
};

export default TaskType;
