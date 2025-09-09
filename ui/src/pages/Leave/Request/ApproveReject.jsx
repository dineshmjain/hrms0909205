import React, { useEffect, useState, useMemo } from "react";
import Header from "../../../components/header/Header";
import { useLocation } from "react-router-dom";
import { Typography } from "@material-tailwind/react";
import moment from "moment";
import SubCardHeader from "../../../components/header/SubCardHeader";
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";
import { PiInfoBold } from "react-icons/pi";
import { usePrompt } from "../../../context/PromptProvider";
import { Dialog, DialogBody, DialogHeader, IconButton } from '@material-tailwind/react';
import { HiOutlineXMark } from "react-icons/hi2";
import { LeaveBalanceUserAction, LeaveRequestApproveRejectAction } from "../../../redux/Action/Leave/LeaveAction";
import { useDispatch, useSelector } from "react-redux";
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddRequest = () => {
  const [errors, setErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState([]);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate()
  const [showSelectedRemarks, setShowSelectedRemarks] = useState([]);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const { showPrompt, hidePrompt } = usePrompt();
  const [leaveTypeSelection, setLeaveTypeSelection] = useState({});
  const [paidTypeSelection, setPaidTypeSelection] = useState({});
  const [commenterror, setCommentError] = useState("");
  const leaveDays = state.days
  const label = "block antialiased font-sans text-gray-500 text-[14px] font-medium w-fit"
  const value = "block antialiased font-sans text-gray-800 text-[16px] mb-1 font-semibold"

  const handleShowPrompt = (request, data) => {
    setOpenDialog(true);
    setStatus(request)
  }

  const { leaveBalance } = useSelector((state) => state.leave);
  console.log(leaveBalance, "leaveBalance");

  const confirmUpdate = async () => {
    if(comment.length =="" || comment == undefined || comment == null){
     return setCommentError("Please Add Comment")
    }else{
      const selectedObject = {};
      selectedDate.forEach((date) => selectedObject[date] = {
        ...leaveDays[date],
        remarks: comment,
        status: status,
        type: leaveTypeSelection[date] || leaveDays[date].type,
        paid: paidTypeSelection[date] !== undefined
          ? paidTypeSelection[date] === "true"
          : leaveDays[date].paid
      });
      try {
        const payload = {
          "leavePolicyId": state.leavePolicyId,
          "employeeId": state.userId,
          "userLeaveId": state._id,
          "from": state.from,
          "to": state.to,
          "days": selectedObject
        }
        console.log(payload, "payload data");
        const result = await dispatch(LeaveRequestApproveRejectAction(payload));
        if (result?.meta?.requestStatus === "fulfilled") {
          setOpenDialog(false);
          setComment("")
          navigate("/request/list");
        }
      } catch (error) {
        setOpenDialog(false);
        console.error("Submission Error:", error);
      }
      setOpenDialog(false);
      setComment("")
      setCommentError("")
    }
  }
  const handleCardClick = (date) => {
    // const maxSelectable = leaveBalance[0]?.currentBalance ?? Infinity;
    let updatedSelection = [];
    if (selectedDate.includes(date)) {
      updatedSelection = selectedDate.filter((d) => d !== date);
    } else {
      // if (selectedDate.length < maxSelectable) {
      updatedSelection = [...selectedDate, date];
      // } else {
      //   toast.error("Selection limited to " + maxSelectable + " days as per your leave balance");
      //   return;
      // }
    }
    setSelectedDate(updatedSelection);
    const selectedObject = {};
    updatedSelection.forEach((d) => {
      selectedObject[d] = leaveDays[d];
    });
  };

  const showRemarks = (params, e) => {
    e.stopPropagation();
    setShowSelectedRemarks((res) => ({
      ...res,
      [params]: !res[params],
    }));
  }
  const handleLeaveTypeChange = (date, value) => {
    setLeaveTypeSelection((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  const handleIsPaidChange = (date, value) => {
    setPaidTypeSelection((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

  const getDateFormat = (date) => {
    return moment(date).format('ll')
  }

  const closeDialog = () => {
    setOpenDialog(false);
    setComment("")
  }

  useEffect(() => {
    getLeaveBalance()
  }, []);

  const getLeaveBalance = async () => {
    try {
      const payload = {
        "leavePolicyId": state.leavePolicyId,
        "employeeId": state.userId,
      }
      const result = await dispatch(LeaveBalanceUserAction(payload));
    } catch (error) {
      console.error("Submission Error:", error);
    }
  }
  console.log(leaveBalance, "leaveBalance");

  return (
    <div className="flex flex-col w-full p-2 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
      <Dialog open={openDialog} size='sm'>
        <DialogHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">Comment's for {status == 'approved' ? 'Approve' : 'Reject'} Leave</h3>
          <HiOutlineXMark onClick={closeDialog} />
        </DialogHeader>
        <DialogBody >
          <input
            id="searchInput"
            type="text"
            value={comment}
            className={`border-2 border-gray-400 mr-2 rounded-md w-full p-2`}
            placeholder="Enter Comment"
            onChange={(e) => { setComment(e.target.value) }}
          />
          <span className="text-red-900 text-[14px]">{commenterror}</span>
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
      <Header
        isBackHandler={true}
        isButton={false}
        headerLabel={"Approve/Reject Details"}
        subHeaderLabel={"view Leave Requests"}
      />
      <div className="flex flex-col gap-2 p-2 mb-2">
        <div className="ml-[3rem] flex-col">
          <div className="pb-2 border-gray-200 flex justify-between items-center">
            <div>
              <Typography className={value}>
                {state.userDetails.firstName} {state.userDetails.lastName}
              </Typography>
              {/* <div className="flex gap-2">
                <div className="bg-primary rounded-md shadow-md px-2 py-1">
                  <Typography className="block antialiased font-sans text-gray-800 text-[16px] font-medium text-white">
                    {state.noOfDaysAppliedLeave} Days
                  </Typography>
                </div>
                <div className="bg-primaryLight rounded-md shadow-md px-2 py-1">
                  <Typography className="block antialiased font-sans text-gray-800 text-[16px] font-medium text-primary">
                    {state.leavePolicyName}
                  </Typography>
                </div>
                <div className="bg-blue-100 rounded-md shadow-md px-2 py-1">
                  <Typography className="block antialiased font-sans text-gray-800 text-[16px] font-medium text-yellow-900">
                    {getDateFormat(state.from)} - {getDateFormat(state.to)}
                  </Typography>
                </div>
              </div> */}
              <div className="flex gap-2 flex-wrap items-center">
                {/* Days Applied */}
                <div className="bg-blue-100 rounded-md shadow-sm px-3 py-1">
                  <Typography className="text-sm font-medium text-blue-800 flex items-center gap-1">
                    {state.noOfDaysAppliedLeave} Days Applied
                  </Typography>
                </div>

                {/* Leave Type */}
                <div className="bg-green-100 rounded-md shadow-sm px-3 py-1">
                  <Typography className="text-sm font-medium text-green-800 flex items-center gap-1">
                    {state.leavePolicyName}
                  </Typography>
                </div>

                {/* Date Range */}
                <div className="bg-indigo-100 rounded-md shadow-sm px-3 py-1">
                  <Typography className="text-sm font-medium text-indigo-800 flex items-center gap-1">
                    {getDateFormat(state.from)} - {getDateFormat(state.to)}
                  </Typography>
                </div>
              </div>

            </div>
            <div className="p-4 w-fit items-center">
              <div className="text-sm font-normal text-gray-700 ml-2">Leave Summary</div>
              <div className="flex gap-3">
                <div className="font-medium rounded-md px-2 py-1 text-primary">
                  Total: {leaveBalance[0]?.totalAccrued}
                </div>
                <div className="font-medium text-yellow-900 rounded-md px-2 py-1">
                  Used: {leaveBalance[0]?.usedLeaves}
                </div>
                <div className={`px-3 py-1 rounded-md
                  ${leaveBalance[0]?.currentBalance == 0 ? 'text-red-900' : ' text-green-700'}
                   font-medium flex items-center gap-1`}>
                  Balance: {leaveBalance[0]?.currentBalance}
                </div>
              </div>
            </div>
          </div>
          <div className="pb-2 border-gray-200 mt-2 flex justify-between items-center">
            <div className="gap-2">
             <label className="text-[14px] font-normal text-gray-700">Reason</label>
              <Typography className={value}>
                {state.reason}
              </Typography>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex gap-2 items-left">
              <label className="text-[14px] font-normal text-gray-700 mb-2">Date Wise Leave Details</label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(leaveDays).map(([date, details], idx) => {
                const isSelected = selectedDate.includes(date);
                const isCollapsed = showSelectedRemarks[date];
                return (
                  <div key={idx}
                    onClick={() => handleCardClick(date)}
                    className={`cursor-pointer rounded-xl p-4 border shadow-md transition-all duration-200 h-fit ${isSelected
                      ? "border-2 border-blue-900 shadow-lg"
                      : "bg-white border-gray-200"
                      }`}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-md font-semibold text-gray-800">
                        <span className="font-medium text-sm">Date: </span>{date}
                      </h3>
                      <Typography
                        className={`inline-block px-3 py-1 rounded-md text-sm font-medium uppercase ${details.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-900'
                          : details.status === 'approved'
                            ? 'bg-green-50 text-green-900'
                            : 'bg-red-50 text-red-900'
                          }`}
                      > {details.status}
                      </Typography>
                    </div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Leave Type:</span>{" "}
                      <select
                        value={leaveTypeSelection[date] || details.type}
                        onChange={(e) => handleLeaveTypeChange(date, e.target.value)}
                        className="ml-2 border rounded px-2 py-1"
                        onClick={e => e.stopPropagation()} // Prevent card click
                      >
                        <option value="full">Full Day</option>
                        <option value="half">Half Day</option>
                      </select>
                    </p>
                    {/* <p className="text-sm text-gray-900">
                      <span className="font-medium">Leave Type:</span>{" "}
                      {details.type === "full" ? "Full Day" : "Half Day"}
                    </p> */}
                    {/* <p className="text-sm text-gray-900">
                      <span className="font-medium">Paid:</span>{" "}
                      {String(details.paid) === "true" ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </p> */}
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Paid:</span>{" "}
                      <select
                        value={paidTypeSelection[date] || details.paid}
                        onChange={(e) => handleIsPaidChange(date, e.target.value)}
                        className="ml-2 border rounded px-2 py-1"
                        onClick={e => e.stopPropagation()} // Prevent card click
                      >
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </p>
                    {isCollapsed && (
                      <>
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">Remarks :</span>{" "}
                          {details.remarks}
                        </p>
                        <p className="text-sm text-gray-900">
                         {details.status === 'approved' && ( <span className="font-medium">Approved By :</span>)}{" "}
                         {details.status === 'rejected' && ( <span className="font-medium">Rejected By :</span>)}{" "}
                          {details.approvedBy?.firstName} {details.approvedBy?.lastName}
                        </p>
                        <p className="text-sm text-gray-900">
                            {details.status === 'approved' && ( <span className="font-medium">Approved At :</span>)}{" "}
                         {details.status === 'rejected' && ( <span className="font-medium">Rejected At :</span>)}{" "}
                          {getDateFormat(details.approvedAt)}
                        </p>
                      </>
                    )
                    }
                    <p className="text-sm text-gray-900 text-right justify-right">
                      <span className="text-[12px] font-medium flex items-center justify-end gap-1" onClick={(e) => showRemarks(date, e)}>
                        {isCollapsed ? (
                          <>Show Less <FaChevronUp /></>
                        ) : (
                          <>Show More <FaChevronDown /></>
                        )}
                      </span>{" "}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="mt-10 flex gap-4">
            <button
              className={`p-2 rounded-md transition 
                ${selectedDate.length === 0
                  ? "bg-green-300 text-white cursor-not-allowed"
                  : "bg-green-700 text-white "}`}
              disabled={selectedDate.length === 0}
              onClick={() => handleShowPrompt('approved', state)} >
              Approve
            </button>
            <button
              className={` p-2 rounded-md transition 
                ${selectedDate.length === 0
                  ? "bg-red-300 text-white cursor-not-allowed"
                  : "bg-red-700 text-white"}`}
              disabled={selectedDate.length === 0}
              onClick={() => handleShowPrompt('rejected', state)} >
              Reject
            </button>
          </div>
        </div>
      </div>

    </div>
  )
};


export default AddRequest;