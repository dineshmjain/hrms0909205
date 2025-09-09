import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import moment from "moment";
import toast from "react-hot-toast";
import FeildDetails from "../../../Pages/Tasks/DetailedView/FeildDetails";
import Designation from "./Designation";
import TimesStartTime from "./TimesStartTime";
import TImesEndtime from "./TImesEndtime";
import { Button } from "@material-tailwind/react";
import { PiListPlus, PiPlus, PiX } from "react-icons/pi";

const Times = ({
  data,
  idx,
  subData,
  subIdx,
  isEditable,
  details,
  handleChange,
  handleUpdate,
  projectData,
}) => {
  const dispatch = useDispatch();
  const actualData = subIdx == undefined ? data : subData;
  if (actualData?.assignmentType != "time") return null;
  return (
    <div className="flex flex-col gap-2">
      {actualData?.times?.map((times, tidx) => {
        return (
          <div className="flex flex-wrap gap-4  items-center" key={`${tidx}`}>
            <div className="flex gap-2 w-[300px] maxmd:w-full  justify-between items-center bg-white p-1 rounded-md border-2">
              <FeildDetails name={"startTime"} />
              <TimesStartTime
                data={data}
                idx={idx}
                subData={subData}
                subIdx={subIdx}
                timesIdx={tidx}
                isEditable={isEditable}
                handleChange={handleChange}
                handleUpdate={handleUpdate}
                details={details}
                projectData={projectData}
              />
            </div>
            <div className="flex gap-2 w-[300px] maxmd:w-full justify-between items-center bg-white p-1 rounded-md border-2">
              <FeildDetails name={"endTime"} />
              <TImesEndtime
                data={data}
                idx={idx}
                subData={subData}
                subIdx={subIdx}
                timesIdx={tidx}
                isEditable={isEditable}
                handleChange={handleChange}
                handleUpdate={handleUpdate}
                details={details}
                projectData={projectData}
              />
            </div>
            <div className="flex gap-2 w-[300px] maxmd:w-full justify-between items-center bg-white p-1 rounded-md border-2">
              <FeildDetails name={"designationId"} />
              <Designation
                data={data}
                idx={idx}
                subData={subData}
                subIdx={subIdx}
                timesIdx={tidx}
                isEditable={isEditable}
                handleChange={handleChange}
                handleUpdate={handleUpdate}
                details={details}
                projectData={projectData}
              />
            </div>
            {/* code herer */}
            {actualData?.times?.length > 1 && (
              <button
                className="text-red-500 bg-red-100 text-sm flex p-1 h-fit rounded-md items-center ml-2"
                onClick={() => {
                  let temp = actualData?.times?.filter((_, i) => i !== tidx);
                  let e = {
                    target: {
                      name: "times",
                      value: temp,
                    },
                  };
                  handleChange(e, idx, subIdx);
                }}
                title="Delete row"
              >
                <PiX className="w-4 h-4" />{" "}
              </button>
            )}
            {tidx == actualData?.times?.length - 1 && (
              <button
                className="text-primaryLight bg-primary text-sm flex p-1 h-fit rounded-md items-center"
                onClick={() => {
                  const allFilled = actualData?.times?.every(
                    (t) => t.startTime && t.endTime && t.designationId
                  );
                  if (!allFilled)
                    return toast.error(
                      "Please fill all fields before adding a new entry."
                    );
                  let temp = [
                    ...actualData?.times,
                    { startTime: "", endTime: "", designationId: "" },
                  ];

                  let e = {
                    target: {
                      name: "times",
                      value: temp,
                    },
                  };
                  handleChange(e, idx, subIdx);
                }}
              >
                <PiPlus className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Times;
