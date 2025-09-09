import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import moment from "moment";
import React, { useState } from "react";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";

const DueBy = ({
  data,
  idx,
  subData,
  subIdx,
  isEditable,
  handleChange,
  handleUpdate,
  details,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { error } = useSelector((state) => state?.error);
  const actualData = subIdx == undefined ? data : subData;
  const dateList = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31],
  ];
  const dayList = {
    sunday: "Sunday",

    monday: "Monday",

    tuesday: "Tuesday",

    wednesday: "Wednesday",

    thursday: "Thursday",

    friday: "Friday",

    saturday: "Saturday",
  };

  switch (actualData?.taskType) {
    // case "oneTime":
    //   return (
    //     <input
    //       type="date"
    //       className={`bg-transparent px-2 p-1 text-sm hover:bg-gray-400 rounded-md cursor-pointer prevent-modal-open  ${
    //         error?.[`dueBy-${idx}-${subIdx}`] &&
    //         `border-red-600 border-2 border-box  `
    //       }`}
    //       min={data?.startDate || moment().format("yyyy-MM-DD")}
    //       max={data?.endDate}
    //       name="dueBy"
    //       disabled={details?.isEditable == false}
    //       value={actualData?.dueBy}
    //       onChange={(e) => {
    //         handleChange(e, idx, subIdx);
    //       }}
    //     />
    //   );
    // case "daily":
    //   return (
    //     <>
    //       <input
    //         type="time"
    //         className={`bg-transparent  p-1 text-sm hover:bg-gray-400 rounded-md cursor-pointer prevent-modal-open   w-fit ${
    //           error?.[`dueBy-${idx}-${subIdx}`] &&
    //           `border-red-600 border-2 border-box  `
    //         }`}
    //         name="dueBy"
    //         disabled={details?.isEditable == false}
    //         value={actualData?.dueBy?.startTime}
    //         onChange={(e) => {
    //           let event = {
    //             target: {
    //               name: "dueBy",
    //               value: { ...actualData?.dueBy, startTime: e.target.value },
    //             },
    //           };
    //           handleChange(event, idx, subIdx);
    //         }}
    //       />
    //       <span>-</span>
    //       <input
    //         type="time"
    //         className={`bg-transparent px-2 p-1 text-sm hover:bg-gray-400 rounded-md cursor-pointer prevent-modal-open   w-fit  ${
    //           error?.[`dueBy-${idx}-${subIdx}`] &&
    //           `border-red-600 border-2 border-box  `
    //         }`}
    //         name="dueBy"
    //         disabled={details?.isEditable == false}
    //         min={actualData?.dueBy?.startTime}
    //         value={actualData?.dueBy?.endTime}
    //         onChange={(e) => {
    //           let event = {
    //             target: {
    //               name: "dueBy",
    //               value: { ...actualData?.dueBy, endTime: e.target.value },
    //             },
    //           };
    //           handleChange(event, idx, subIdx);
    //         }}
    //       />
    //     </>
    //   );
    case "weekly":
      let len = actualData?.dueBy?.length;

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
                className={`cursor-pointer prevent-modal-open text-sm hover:bg-gray-400 font-medium px-2 p-1 max-w-[20ch] truncate rounded-md flex self-center justify-self-center items-center  ${
                  error?.[`dueBy-${idx}-${subIdx}`] &&
                  `border-red-600 border-2 border-box  `
                }`}
              >
                {len > 0
                  ? dayList?.[actualData?.dueBy[0]] +
                    (len > 1 ? ` +${len - 1}` : ``)
                  : "select Day"}
              </span>
            </MenuHandler>
            <MenuList className="bg-gray-100 text-gray-900 flex gap-1 flex-col justify-center w-fit items-center prevent-modal-open">
              {Object?.entries(dayList)?.map(([day, displayName], iIdx) => {
                let isSelected = len ? actualData?.dueBy?.includes(day) : false;
                return (
                  <MenuItem
                    key={iIdx}
                    className={`  group  p-1 px-2  flex justify-between items-center prevent-modal-open  hover:bg-opacity-80 focus:bg-gray-500  ${
                      isSelected && `bg-gray-400  `
                    }`}
                    onClick={() => {
                      let value = [...actualData?.dueBy];
                      if (isSelected) {
                        value = value.filter((item) => item != day);
                      } else {
                        value.push(day);
                      }
                      let e = {
                        target: {
                          name: "dueBy",
                          value: value,
                        },
                      };
                      handleChange(e, idx, subIdx);
                    }}
                  >
                    <span className="h-5">{displayName}</span>
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
    case "monthly":
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
              <span
                className={`cursor-pointer prevent-modal-open text-sm hover:bg-gray-400 prevent-modal-open font-medium px-2 p-1 rounded-md w-fit self-center ${
                  error?.[`dueBy-${idx}-${subIdx}`] &&
                  `border-red-600 border-2 border-box  `
                }`}
              >
                {actualData?.dueBy || "select Date"}
              </span>
            </MenuHandler>
            <MenuList className="bg-gray-100 text-gray-900 ">
              {dateList?.map((week, widx) => {
                return (
                  <div className="flex flex-col w-full gap-2" key={widx}>
                    <div className="flex items-center  w-full ">
                      {week?.map((day, dIdx) => {
                        return (
                          <MenuItem
                            className="w-[2ch] flex items-center justify-center hover:bg-gray-300 prevent-modal-open cursor-pointer prevent-modal-open "
                            key={dIdx}
                            style={{
                              padding: "10px 20px",
                            }}
                            onClick={() => {
                              let e = {
                                target: {
                                  name: "dueBy",
                                  value: day,
                                },
                              };
                              handleChange(e, idx, subIdx);
                            }}
                          >
                            <span>{day}</span>
                          </MenuItem>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </MenuList>
          </Menu>
        </div>
      );
  }
};

export default DueBy;
