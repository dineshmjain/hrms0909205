import React, { useEffect, useState } from "react";
import Table from "../../../components/Table/Table";
import { useNavigate } from "react-router-dom";
import { Select, Option } from "@material-tailwind/react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { GetMonthlyUserAttendenceAction } from "../../../redux/Action/Attendence/attendenceAction";

const List = () => {
  const [selectedMonth, setSelectedMonth] = useState(-1);
  const { attendence: attendance, loading } = useSelector(
    (state) => state?.attendence
  );
  const dispatch = useDispatch();
  const nav = useNavigate();

  const dateRanges = [
    { startDate: "2025-01-01", endDate: "2025-02-01" },
    { startDate: "2025-02-01", endDate: "2025-03-01" },
    { startDate: "2025-03-01", endDate: "2025-04-01" },
    { startDate: "2025-04-01", endDate: "2025-05-01" },
    { startDate: "2025-05-01", endDate: "2025-06-01" },
    { startDate: "2025-06-01", endDate: "2025-07-01" },
    { startDate: "2025-07-01", endDate: "2025-08-01" },
    { startDate: "2025-08-01", endDate: "2025-09-01" },
    { startDate: "2025-09-01", endDate: "2025-10-01" },
    { startDate: "2025-10-01", endDate: "2025-11-01" },
    { startDate: "2025-11-01", endDate: "2025-12-01" },
    { startDate: "2025-12-01", endDate: "2026-01-01" },
  ];

  const labels = {
    date: { DisplayName: "Date", type: "date" },
    name: { DisplayName: "Shift", type: "object", objectName: "shiftDetails" },
    checkIn: {
      DisplayName: "Check In",
      type: "time",
      format: "DD MMM - hh:mm A",
    },
    checkOut: {
      DisplayName: "Check Out",
      type: "time",
      format: "DD MMM - hh:mm A",
    },
    attendance: { DisplayName: "Status", type: "status" },
    noOfWorkingHours: {
      DisplayName: "No. of Hours",
      type: "function",

      data: (data) => {
        const diffInMilliseconds = data?.workingHours * 24 * 60 * 60 * 1000;
        const duration = moment.duration(diffInMilliseconds);
        return duration?.hours()
          ? `${String(duration.hours()).padStart(2, "0")}h ${String(
              duration.minutes()
            ).padStart(2, "0")}m`
          : "0";
      },
    },
  };

  const handleShowDayWise = (data) => {
    nav("./daywise", {
      state: {
        dayId: data?._id,
        shift: data?.shiftDetails,
        date: data?.date,
      },
    });
  };

  // Load selected month from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("AttendenceList"));
    if (stored?.selectedMonth >= 0) {
      setSelectedMonth(stored.selectedMonth);
    } else {
      setSelectedMonth(moment().month()); // default to current month
    }
  }, []);

  // Save selected month to localStorage
  useEffect(() => {
    if (selectedMonth >= 0) {
      localStorage.setItem(
        "AttendenceList",
        JSON.stringify({ selectedMonth })
      );
    }
  }, [selectedMonth]);

  // Fetch attendance data when selectedMonth changes
  useEffect(() => {
    if (selectedMonth >= 0) {
      const reqbody = { date: dateRanges[selectedMonth] };
      dispatch(GetMonthlyUserAttendenceAction(reqbody));
    }
  }, [selectedMonth]);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex flex-wrap justify-between gap-2">
        <h6 className="font-semibold text-xl">Attendance List</h6>
        <div className="w-76 maxsm:w-full">
          <Select
            variant="outlined"
            // label="Select Month"
            value={String(selectedMonth)}
            onChange={(val) => setSelectedMonth(Number(val))}
          >
            {dateRanges.map((_, idx) => (
              <Option key={idx} value={String(idx)}>
                {moment().month(idx).format("MMMM")}
              </Option>
            ))}
          </Select>
        </div>
      </div>

      <div className="w-full rounded-md flex gap-4 maxmd:flex-col">
        <Table
          tableJson={attendance?.monthlyList ?? []}
          labels={labels}
          isLoading={loading}
          hideSlNo
          onRowClick={handleShowDayWise}
        />
      </div>
    </div>
  );
};

export default List;
