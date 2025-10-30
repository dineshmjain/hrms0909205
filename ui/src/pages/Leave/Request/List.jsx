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
import { PiEyeFill, PiCheckFat } from "react-icons/pi";
import { FaXmark, FaCheck } from "react-icons/fa6";
import Filter from "../../../components/Filter/Filter";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
} from "@material-tailwind/react";
import { HiOutlineXMark } from "react-icons/hi2";
import toast from "react-hot-toast";
import { removeEmptyStrings } from "../../../constants/reusableFun";

const List = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const {
    RequestList,
    loading: LeaveLoading,
    totalRecord,
    pageNo,
    limit,
  } = useSelector((state) => state.leave);
  const [showFilters, setShowFilters] = useState(true);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    subOrgId: [],
    orgIds: [],
    branchIds: [],
    branchId: "",
    departmentIds: "",
    fromDate: "",
    toDate: "",
    status: "",
  });
  console.log(selectedFilters, "selectedFilters");

  const getRequestList = (params) => {
    let updatedParams = {
      ...params,
    };
    let filters = {
      orgIds: selectedFilters.orgIds,
      branchIds: selectedFilters.branchIds,
      departmentIds: selectedFilters.departmentIds,
      fromDate: selectedFilters.fromDate,
      toDate: selectedFilters.toDate,
      status: selectedFilters.status,
    };

    console.log("updatedParams", updatedParams);

    if (checkMoudles("request", "r")) {
      updatedParams = { ...updatedParams, ...filters };
    }
    dispatch(LeaveRequestGetAction(removeEmptyStrings(updatedParams)));
  };
  const labels = {
    firstName: {
      DisplayName: "Employee",
      type: "object",
      objectName: "userDetails",
    },
    from: {
      DisplayName: "From Date",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
    to: {
      DisplayName: "To Date",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
    leavePolicyName: {
      DisplayName: "Leave Type",
    },
    noOfDaysAppliedLeave: {
      DisplayName: "Days",
    },
    reason: {
      DisplayName: "Reason",
    },
    status: {
      DisplayName: "Status",
    },
    createdDate: {
      DisplayName: "Created At",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  const actions = [
    {
      title: "View",
      text: <PiEyeFill className="w-5 h-5 mr-1 ml-1" />,
      onClick: (request) => {
        if (checkMoudles("request", "u") == false)
          return toast.error("You are Unauthorized to Approve/Reject Request!");
        approveReject(request);
      },
    },
    {
      title: "Approve",
      text: <FaRegCheckCircle className="w-5 h-5 mr-1 ml-1 text-green-700" />,
      onClick: (request) => {
        if (checkMoudles("request", "u") == false)
          return toast.error("You are Unauthorized to Approve/Reject Request!");
        SubmitApproval("approved", request);
      },
    },
    {
      title: "Reject",
      text: <FaRegCircleXmark className="w-5 h-5 ml-1 mr-1 text-red-700" />,
      onClick: (request) => {
        if (checkMoudles("request", "u") == false)
          return toast.error("You are Unauthorized to Approve/Reject Request!");
        SubmitApproval("rejected", request);
      },
    },
  ];

  const approveReject = (request) => {
    if (request?.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/request/ApproveReject", { state: request });
    }
  };

  const SubmitApproval = (request, data) => {
    setOpenDialog(true);
    setStatus(request);
    setSelectedRow(data);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setComment("");
  };

  const confirmUpdate = async () => {
    try {
      const updatedDays = {};
      Object.entries(selectedRow.days).forEach(([date, dayInfo]) => {
        updatedDays[date] = {
          // ...dayInfo,
          status: status,
          remarks: comment,
          paid: dayInfo.paid,
          type: dayInfo.type,
        };
      });
      const payload = {
        leavePolicyId: selectedRow.leavePolicyId,
        userLeaveId: selectedRow._id,
        employeeId: selectedRow.userId,
        from: selectedRow.from,
        to: selectedRow.to,
        days: updatedDays,
      };
      console.log(payload, "what is the payload here");
      const result = await dispatch(LeaveRequestApproveRejectAction(payload));
      if (result?.meta?.requestStatus === "fulfilled") {
        setOpenDialog(false);
        setComment("");
        getRequestList({ page: pageNo, limit: limit });
        // getRequestList()
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setOpenDialog(false);
    }
    setOpenDialog(false);
    setComment("");
  };
  useEffect(() => {
    getRequestList({ page: 1, limit: 10 });
  }, [selectedFilters]);

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Dialog open={openDialog} size="sm">
        <DialogHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">Please Enter Comment</h3>
          <HiOutlineXMark onClick={closeDialog} />
        </DialogHeader>
        <DialogBody>
          <input
            id="searchInput"
            type="text"
            value={comment}
            className={`border-2 border-gray-400 mr-2 rounded-md w-full p-2`}
            placeholder="Enter Comment"
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              className="bg-green-700 text-white px-4 py-1 rounded-md h-fit"
              onClick={confirmUpdate}
            >
              Submit
            </button>
            <button
              className="bg-red-700 text-white px-4 py-1 rounded-md h-fit"
              onClick={closeDialog}
            >
              Cancel
            </button>
          </div>
        </DialogBody>
      </Dialog>
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize  ">
            Leave Request
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
            Overview of Your Employees Leave Requests
          </Typography>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
          Filters
        </div>
        <Filter
          showFilters={showFilters}
          selectedFilters={selectedFilters}
          onSet={(data) => {
            let { ...rest } = data;
            getRequestList({
              page: 1,
              limit: 10,
            });
          }}
          setSelectedFilters={setSelectedFilters}
          pageName={"leave"}
        />
      </div>
      <div className="">
        <Table
          tableName="Policy"
          tableJson={RequestList}
          isLoading={LeaveLoading}
          labels={labels}
          onRowClick={approveReject}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, name = "") => {
              getRequestList({ page, limit, name });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
