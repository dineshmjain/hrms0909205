import React, { useState } from "react";
import Chips from "../../Chips/Chips";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";

const AssignmentType = ({
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
  const assignList = {
    assignee: {
      value: "Assignee",
      color: "#c0c0c0",
      defaultValue: { name: "assignedTo", value: [] },
    },
    shift: {
      value: "Shift Based",
      color: "#4d4d4d",
      // defaultValue: { name: "shifts", value: [] },
    },
    time: {
      value: "Time Based",
      color: "#212121",
      defaultValue: {
        name: "times",
        value: [
          {
            startTime: "",
            endTime: "",
            designationId: "",
          },
        ],
      },
    },
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
              color={assignList[actualData?.assignmentType]?.color}
              text={assignList[actualData?.assignmentType]?.value}
            />
          </div>
        </MenuHandler>

        <MenuList className="bg-gray-100 text-gray-900 prevent-modal-open">
          {Object?.entries(assignList)?.map(([key, value], iIdx) => {
            return (
              <MenuItem
                key={iIdx}
                className="p-1"
                onClick={() => {
                  if (
                    value?.value ==
                    assignList[actualData?.assignmentType]?.value
                  )
                    return;
                  let e = {
                    target: {
                      name: "assignmentType", 
                      value: key,
                    },
                  };
                  handleChange(e, idx, subIdx);  
                  Object?.entries(assignList)?.forEach(
                    ([childKey, childData]) => {
                      let isSelected = childKey == key;
                      if (childData?.defaultValue) {
                        e.target.name = childData.defaultValue.name;
                        e.target.value = isSelected
                          ? childData.defaultValue.value
                          : null;
                        handleChange(e, idx, subIdx);
                      }
                    }
                  );
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

export default AssignmentType;
