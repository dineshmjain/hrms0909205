import { FaFontAwesomeFlag } from "react-icons/fa";
import { FaPersonWalking } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  IoBriefcaseSharp,
  IoCalendarNumberOutline,
  IoLocationSharp,
  IoPersonAddSharp,
} from "react-icons/io5";
import { MdOutlineAddCircleOutline } from "react-icons/md";

import { IoIosHourglass, IoMdRepeat, IoMdTime } from "react-icons/io";
import {
  RiAttachmentLine,
  RiImageEditLine,
  RiProgress6Line,
} from "react-icons/ri";
import { BiCalendarEdit, BiCurrentLocation } from "react-icons/bi";
import { LuScanLine } from "react-icons/lu";
import { HiQrCode } from "react-icons/hi2";
import { useMemo } from "react";
import { PiIdentificationBadge } from "react-icons/pi";

export const requiredFeilds = {
  task: ["name", "taskEndType"],
  subTask: ["name", "taskEndType"],
};

export const feilds = {
  status: {
    name: "Status",
    icon: <RiProgress6Line className="w-4 h-4" />,
    type: "basic",
  },
  priority: {
    name: "Priority",
    icon: <FaFontAwesomeFlag className="w-4 h-4" />,
    type: "basic",
  },
  assignedTo: {
    name: "Assign",
    icon: <IoPersonAddSharp className="w-4 h-4" />,
    type: "assignment",
  },
  assignmentType: {
    name: "Assignment Type",
    icon: <IoBriefcaseSharp className="w-4 h-4" />,
    type: "assignment",
  },
  startDate: {
    name: "Start date",
    icon: <IoCalendarNumberOutline className="w-4 h-4" />,
    type: "dueBy",
  },

  endDate: {
    name: "Due date",
    icon: <IoCalendarNumberOutline className="w-4 h-4" />,
    type: "dueBy",
  },
  startTime: {
    name: "Start time",
    icon: <IoMdTime className="w-4 h-4" />,
    type: "dueBy",
  },
  endTime: {
    name: "End time",
    icon: <IoMdTime className="w-4 h-4" />,
    type: "dueBy",
  },
  taskType: {
    name: "Task type",
    icon: <BiCalendarEdit className="w-4 h-4" />,
    type: "dueBy",
  },
  dueBy: {
    name: "Repeat on",
    icon: <IoMdRepeat className="w-4 h-4" />,
    type: "dueBy",
  },
  taskEndType: {
    name: "Task End Type",
    icon: <LuScanLine className="w-4 h-4" />,
    type: "taskEndType",
  },
  GPSLocation: {
    name: "Location",
    icon: <BiCurrentLocation className="w-4 h-4" />,
    type: "taskEndType",
  },
  checkpointIds: {
    name: "Checkpoints",
    icon: <IoLocationSharp className="w-4 h-4" />,
    type: "checkpoints",
  },
  times: {
    name: "Times",
    icon: <IoLocationSharp className="w-4 h-4" />,
    type: "times",
  },
  designationId: {
    name: "Designation",
    icon: <PiIdentificationBadge className="w-4 h-4" />,
    type: "times",
  },
};

const FeildDetails = ({ name, isSubTask }) => {
  let feildData = useMemo(() => feilds?.[name], [name]);

  return (
    <span className="font-semibold flex gap-2 items-center text-gray-700">
      {" "}
      {feildData?.icon}
      <span className="text-sm text-gray-600 font-medium ">
        {feildData?.name}
      </span>
      {requiredFeilds?.[isSubTask ? "subTask" : "task"]?.includes(name) && (
        <span className="text-red-800 -ml-2">*</span>
      )}
    </span>
  );
};

export default FeildDetails;
