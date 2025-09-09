import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { GetSingleDayAttendanceAction } from "../../redux/Action/Attendence/attendenceAction";
import { useSelector } from "react-redux";
import Table from "../../components/Table/Table";
import { ShiftGetAction } from "../../redux/Action/Shift/ShiftAction";
import moment from "moment";
import { IoAlertCircle } from "react-icons/io5";
import { Button } from "@material-tailwind/react";

import AttendanceCorrection from "../../components/Attendence/AttendanceCorrection";

const Daywise = () => {
  const { state } = useLocation();
  const attendance = useSelector((state) => state?.attendence?.attendence);
  const shiftList = useSelector((state) => state?.shiftList?.shiftList);
  const [selectedLog, setSelectedLog] = useState(-1); // selected log for correction modal
  const dispatch = useDispatch();
  useEffect(() => {
    if (state?.dayId) {
      let reqbody = { employeeAttendanceId: state?.dayId };
      if (state?.shift?._id) {
        dispatch(ShiftGetAction({ id: state?.shift?._id }));
      }
      dispatch(GetSingleDayAttendanceAction(reqbody));
    }
  }, [state?.dayId]);

  console.log(attendance);

  const labels = {
    transactionDate: {
      DisplayName: "Time",
      type: "time",

      format: "DD MMM - hh:mm A",
    },
    type: {
      DisplayName: "Type",
      type: "chip",
      colorData: { checkIn: "#7dd3fc", checkOut: "#fdba74" },
    },
  };
  const actions = [
    {
      title: "Request Correction",
      text: <IoAlertCircle className="w-5 h-5 text-red-500" />,
      onClick: (data, idx) => {
        setSelectedLog(idx);
      },
    },
  ];
  return (
    <div className="flex flex-col gap-2 p-2">
      <AttendanceCorrection
        logData={attendance?.singleDay?.[selectedLog]}
        onClose={() => setSelectedLog(null)}
      />

      <h6 className="font-semibold text-lg">
        Attendence List{" "}
        <span className="font-medium text-gray-500 text-sm">/ Logs</span>
      </h6>
      <div className="p-2 flex flex-wrap bg-backgroundHover rounded-md text-gray-900  gap-2 text-sm ">
        <span className="font-semibold flex  gap-2 items-center ">
          Name :
          <span className={`font-medium text-gray-800 `}>Kamal Purohit</span>
        </span>{" "}
        |
        <span className="font-semibold flex  gap-2 items-center ">
          Date :
          <span className={`font-medium text-gray-800 `}>
            {moment(state?.date)?.format("DD MMMM YYYY")}
          </span>
        </span>{" "}
        |
        <span className="font-semibold flex  gap-2 items-center ">
          Working Hours :
          <span className={`font-medium text-gray-800 `}>09h 05m</span>
        </span>{" "}
        |
        <span className="font-semibold flex  gap-2 items-center">
          {state?.shift?.name} :
          {shiftList?.[0] ? (
            <span className={`font-medium text-gray-800 `}>
              {moment(shiftList?.[0]?.startTime, "HH:mm").format("hh:mm A")} -{" "}
              {moment(shiftList?.[0]?.endTime, "HH:mm").format("hh:mm A")}
            </span>
          ) : (
            <span className="skeleton-loader w-[20ch] h-5"></span>
          )}
        </span>
      </div>
      <div className="w-full rounded-md  flex gap-4 flex-col">
        <Table
          tableJson={attendance?.singleDay ?? []}
          labels={labels}
          actions={actions}
        />
        <Button size="md" className="w-fit">
          {" "}
          Add Punch{" "}
        </Button>
      </div>
    </div>
  );
};

export default Daywise;
