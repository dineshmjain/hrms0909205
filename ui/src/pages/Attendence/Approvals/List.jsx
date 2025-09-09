import React, { useEffect, useState, useMemo } from "react";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table/Table";
import {
  LeaveRequestApproveRejectAction,
  LeaveRequestGetAction,
} from "../../../redux/Action/Leave/LeaveAction";
import { MdModeEditOutline } from "react-icons/md";
import { use } from "react";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import { usePrompt } from "../../../context/PromptProvider";
import { Button, Chip, Typography } from "@material-tailwind/react";

import MultiSelectFilter from "../../../components/Filter/MultiSelectFilter";
import { AttendanceApprovalGetActions } from "../../../redux/Action/Attendence/attendenceAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";

const List = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const {
    list: approvalList,
    totalRecord,
    limit,
    pageNo,
  } = useSelector((state) => state.attendence.approval);
  const loading = useSelector((state) => state.attendence.loading);

  const { data: monthLogsArray = [], totalRecord: monthLogsTotal = 0 } =
    useSelector((state) => state?.attendence?.monthLogs?.data) || {};

  console.log("monthLogsArray:", monthLogsArray);

  const statusType = monthLogsArray[0]?.approvalStatus?.toLowerCase();
  console.log("statusType:", statusType);

  const [showFilters, setShowFilters] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    subOrgIds: [],
    branchIds: [],
    departmentIds: [],
    designationIds: [],
    employeeIds: [],
    statusType: statusType,
    date: new Date().toISOString().split("T")[0], // today's date in YYYY-MM-DD
  });
  console.log(selectedFilters, "selectedFilters");

  const getApprovalList = (params = {}) => {
    let updatedParams = removeEmptyStrings({
      ...selectedFilters, // send all filters
      limit: limit || 10,
      page: pageNo || 1,
      ...params, // allow override if passed
    });

    if (checkMoudles("request", "r")) {
      updatedParams = { ...updatedParams };
    }

    console.log("updatedParams", updatedParams);
    dispatch(AttendanceApprovalGetActions(updatedParams));
  };
  const handleSearch = () => {
    const updated = removeEmptyStrings({
      statusType: selectedFilters.statusType,
      date: selectedFilters.date,
      limit: selectedFilters.limit || 2,
      page: selectedFilters.page || 1,
      subOrgIds: selectedFilters.subOrgIds?.length
        ? selectedFilters.subOrgIds
        : undefined,
      branchIds: selectedFilters.branchIds?.length
        ? selectedFilters.branchIds
        : undefined,
      departmentIds: selectedFilters.departmentIds?.length
        ? selectedFilters.departmentIds
        : undefined,
      designationIds: selectedFilters.designationIds?.length
        ? selectedFilters.designationIds
        : undefined,
      employeeIds: selectedFilters.employeeIds?.length
        ? selectedFilters.employeeIds
        : undefined,
    });

    console.log("Final request body:", updated);
    getApprovalList(updated);
  };

  const labels = {
    name: {
      DisplayName: "Employee Name",
      type: "function",
      data: (row) =>
        `${row?.name?.firstName || ""} ${row?.name?.lastName || ""}`,
    },
    transactionDate: {
      DisplayName: "Date",
      type: "time",
      format: "DD-MM-YYYY",
    },
    noOfShifts: { DisplayName: "No of Shifts" },
    approvalStatus: {
      DisplayName: "Status",
      type: "chip",
      colorData: {
        Pending: "#ffecb3",
        Error: "#ffc3bf",
        Approved: "#a0ffb0",
      },
      textColor: {
        Pending: "#b37f00",
        Error: "#ac0000",
        Approved: "#006e04",
      },
    },
  };

  const actions = [];

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize  ">
            Attendance Approvals
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
            Overview of Your Employees Attendance Approvals
          </Typography>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
          Filters
        </div>
        <MultiSelectFilter
          pageName="attendanceapprovals"
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          showFilters={showFilters}
          onSet={handleSearch} // ✅ this now receives updated filters
        />
      </div>
      <div className="">
        <Table
          tableName="Attendance Approval"
          tableJson={approvalList}
          isLoading={loading}
          labels={labels}
        />
      </div>
    </div>
  );
};

export default List;
