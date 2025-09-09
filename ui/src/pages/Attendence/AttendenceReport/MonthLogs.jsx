import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/header/Header";
import Table from "../../../components/Table/Table";
import MultiSelectFilter from "../../../components/Filter/MultiSelectFilter";
import {
  getMonthLogsAction,
  getUserShiftLogsAction,
  AttendanceDayApprovalActions,
} from "../../../redux/Action/Attendence/attendenceAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";
// import AttendanceAccordion from "../../../components/Attendence/AttendanceAccordion";
import { MdHdrStrong, MdModeEditOutline, MdVisibility } from "react-icons/md";
import { Dialog, DialogHeader, DialogBody } from "@material-tailwind/react";
import { Modal } from "../../../components/Modal/Modal";
import UnderlineTabs from "../../../components/UnderlineTabs/UnderlineTabs";

const MonthLogs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.user); // your actual user reducer

  const userId = user?._id || "";
  console.log("User ID:", userId);
  const [previewImage, setPreviewImage] = useState(null);
  const [expanded, setExpanded] = useState([]); // store multiple ids

  const toggleExpand = (id) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    page: 1,
    limit: 10,
    year: "",
    month: "",
  });
  // const [expandedDate, setExpandedDate] = useState(null);
  const [dialogData, setDialogData] = useState(null);
  const lastPayloadRef = React.useRef(null);
  const { logsByDate = {}, loading: logLoading } = useSelector(
    (state) => state.attendence.userShiftLogs || {}
  );

  const { data: monthLogsList = [], totalRecord = 0 } =
    useSelector((state) => state?.attendence?.monthLogs?.data) || {};
  const shiftList = useSelector((state) => state.attendence?.shiftList?.data);
  const reportList = useSelector((state) => state.attendence?.report?.list);
  const [selectedReport, setSelectedReport] = useState(null);
  console.log("Report List from Redux", reportList);
  console.log("Shift List from Redux:", shiftList);
  const commonShiftId = shiftList?.[0]?.shiftId;
  const commonTransactionDate = shiftList?.[0]?.transactionDate;

  console.log("Common ShiftId:", commonShiftId);
  console.log("Common Transaction Date:", commonTransactionDate);
  const loading = useSelector((state) => state?.attendence?.loading);
  const [openDialog, setOpenDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const getMonthLogs = useCallback(
    (filters) => {
      const {
        employeeIds,
        orgIds,
        employeeName,
        branchIds,
        subOrgId,
        ...rest
      } = filters;

      const employeeId = Array.isArray(employeeIds)
        ? employeeIds[0]
        : employeeIds;

      if (rest.year && rest.month) {
        const params = removeEmptyStrings({ ...rest, employeeId });
        console.log(" Dispatching getMonthLogs with:", params);
        console.trace();
        dispatch(getMonthLogsAction(params));
      }
    },
    [dispatch]
  );

  // const updateFilters = useCallback(
  //   (newFilters, runSearch = false) => {
  //     setSelectedFilters((prev) => {
  //       const updated = { ...prev, ...newFilters };
  //       if (runSearch) {
  //         const { employeeIds, ...rest } = updated;
  //         const mainPayload = removeEmptyStrings({
  //           ...rest,
  //           employeeId: Array.isArray(employeeIds)
  //             ? employeeIds[0]
  //             : employeeIds,
  //         });
  //         getMonthLogs(mainPayload);
  //       }
  //       return updated;
  //     });
  //   },
  //   [getMonthLogs]
  // );
  const updateFilters = useCallback((newFilters) => {
    setSelectedFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // useEffect(() => {
  //   if (selectedFilters.year && selectedFilters.month) {
  //     getMonthLogs(selectedFilters);
  //   }
  // }, [selectedFilters, getMonthLogs]);
  // Initial load: triggered only when filters change
  // useEffect(() => {
  //   const { orgIds, employeeName, ...rest } = selectedFilters;
  //   getMonthLogs(rest);
  // }, [selectedFilters, getMonthLogs]);

  // useEffect(() => {
  //   console.log("selectedFilters:::", selectedFilters);

  //   const { orgIds, employeeName, ...rest } = selectedFilters;

  //   const employeeIds = selectedFilters.employeeIds;
  //   const employeeId = Array.isArray(employeeIds)
  //     ? employeeIds[0]
  //     : employeeIds;

  //   const payload = removeEmptyStrings({
  //     ...rest,
  //     employeeId,
  //   });

  //   console.log("Payload to getMonthLogs:", payload);
  //   getMonthLogs(payload);
  //   console.trace();
  // }, [selectedFilters, getMonthLogs]);
  useEffect(() => {
    if (!selectedFilters.year || !selectedFilters.month) return;

    const { year, month, page, limit, employeeIds } = selectedFilters;

    const employeeId = Array.isArray(employeeIds)
      ? employeeIds[0]
      : employeeIds;

    const payload = removeEmptyStrings({
      year,
      month,
      page: page || 1,
      limit: limit || 10,
      employeeId,
    });
    // Prevent duplicate dispatches (StrictMode double run)
    if (JSON.stringify(lastPayloadRef.current) === JSON.stringify(payload)) {
      return;
    }

    lastPayloadRef.current = payload;
    console.log("Final Payload to getMonthLogs:", payload);
    dispatch(getMonthLogsAction(payload));
  }, [dispatch, selectedFilters]);

  const handleSearch = useCallback(() => {
    updateFilters({ page: 1 }, true);
  }, [updateFilters]);

  const handlePageChange = useCallback(
    (page, limit) => {
      updateFilters({ page, limit }, true);
    },
    [updateFilters]
  );

  const labels = {
    date: { DisplayName: "Date" },
    workingHours: { DisplayName: "Working Minutes" },
    breakMinutes: { DisplayName: "Break Minutes" },
    approvalStatus: {
      DisplayName: "Status",
      type: "chip",
      colorData: {
        pending: "#ffecb3",
        Error: "#ffc3bf",
        Approved: "#a0ffb0",
      },
      textColor: {
        pending: "#b37f00",
        Error: "#ac0000",
        Approved: "#006e04",
      },
    },
  };
  const actions = [
    {
      title: "View",
      text: <MdVisibility className="w-5 h-5 cursor-pointer" />,
      onClick: (row) => {
        handleViewClick(row);
      },
    },
  ];
  const editButton = (leave) => {
    if (leave?.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/policy/edit", { state: leave });
    }
  };
  const handleApproval = async (shift, status) => {
    console.log("Clicked:", status, shift);
    const approvalStatus =
      status === "Approved" ? true : status === "Rejected" ? false : null;
    const payload = {
      employeeId: selectedEmployeeId, //  take from stored value
      shiftId: commonShiftId,
      transactionDate: commonTransactionDate,
      approvalStatus: status === "Approved", // backend expects boolean
    };

    console.log("Dispatching Payload:", payload);

    const res = await dispatch(AttendanceDayApprovalActions(payload));
    if (res?.payload?.success) {
      // Update UI with string status
      setDialogData((prev) =>
        prev.map((s) =>
          s.shiftId === shift.data.shiftId
            ? { ...s, approvalStatus: status } // "Approved" / "Rejected"
            : s
        )
      );
    }
  };

  function mergeDateWithCurrentTime(dateStr) {
    const today = new Date(dateStr); // gives midnight
    const now = new Date(); // current time

    today.setHours(
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
      now.getMilliseconds()
    );

    return today;
  }
  const handleViewClick = (row) => {
    // const date = new Date();
    const date = mergeDateWithCurrentTime(row.date);
    console.log("Row date:", date);
    const employeeId = Array.isArray(selectedFilters?.employeeIds)
      ? selectedFilters.employeeIds[0]
      : selectedFilters.employeeIds;

    if (!employeeId) {
      console.warn("no employee id");
      return;
    }

    setSelectedEmployeeId(employeeId);

    dispatch(getUserShiftLogsAction({ date, employeeId })).then((res) => {
      const logs = res?.payload?.data?.data;
      if (logs?.length > 0) {
        const allTransactions = logs.flatMap(
          (shift) => shift.transactions || []
        );
        allTransactions.sort(
          (a, b) => new Date(a.transactionDate) - new Date(b.transactionDate)
        );

        setDialogData(logs);

        const report = reportList?.find((item) => {
          const rowDate = new Date(row.date);
          const rowMonth = rowDate.getMonth() + 1;
          const rowYear = rowDate.getFullYear();

          return (
            item.userId === employeeId &&
            item.month === rowMonth &&
            (!item.year || item.year === rowYear)
          );
        });

        setSelectedReport(report || null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full ">
      {/* <Dialog open={openDialog} size='sm'>
        <DialogHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">Approval Shift Logs</h3>
          <HiOutlineXMark onClick={closeDialog} />
        </DialogHeader>
        <DialogBody >

        </DialogBody>
      </Dialog> */}
      <Header
        isBackHandler={true}
        headerLabel="Attendance Daily Logs"
        subHeaderLabel="Detailed Daily Attendance Data"
      />

      <div className="w-full bg-white p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm font-semibold mb-4">
            Filters
          </span>
        </div>

        <MultiSelectFilter
          pageName="attendancemonthreport"
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          showFilters={true}
          onSet={handleSearch}
          isEmployeeMulti={false}
          employeFilterType="single"
        />
      </div>

      <div className="w-full">
        <Table
          tableJson={monthLogsList}
          labels={labels}
          isLoading={loading}
          tableName="Month Logs"
          paginationProps={{
            totalRecord,
            onDataChange: handlePageChange,
          }}
          actions={actions}
        />
        {dialogData && (
          <Modal
            size="xl"
            // heading={`Details for ${new Date(
            //   dialogData?.[0]?.transactionDate
            // ).toLocaleDateString("en-GB")}`}
            heading={
              <div className="space-y-1">
                <p className="text-sm  text-gray-950 font-medium ">
                  Employee Name : {""}
                  {selectedReport?.name?.firstName}{" "}
                  {selectedReport?.name?.lastName}
                </p>
              </div>
            }
            onClose={() => setDialogData(null)}
            handleOpen={() => setDialogData(null)}
            open={!!dialogData}
            contentCss="w-full max-h-[75vh] overflow-y-auto"
          >
            <div className=" w-full text-sm text-gray-700">
              {/* === Reusable Underline Tabs === */}
              <UnderlineTabs
                tabs={dialogData.map((shift, i) => ({
                  label: shift.shiftName || `Shift ${i + 1}`,
                  data: shift,
                }))}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                renderContent={(shift, index) => {
                  //  Prepare validation keys once
                  const validationKeys = [
                    "isTimeMatch",
                    "isLocationMatch",
                    "isBranchMatch",
                    "isShiftMatch",
                  ];

                  //  Check if all validations exist
                  const allValidationsExist = validationKeys.every(
                    (key) =>
                      shift.data?.[key] !== undefined &&
                      shift.data?.[key] !== null
                  );

                  // Check if all are true
                  const allValidationsTrue = validationKeys.every(
                    (key) => shift.data?.[key]
                  );

                  return (
                    <div className="flex flex-col md:flex-row gap-6 mt-4">
                      {/* Left: Transactions Timeline */}
                      <div className="flex-1 pr-2 border-r max-h-[75vh] overflow-y-auto">
                        <h5 className="font-semibold text-primary">
                          Transactions Timeline
                        </h5>

                        <div className="relative ml-2 border-l-2 border-gray-300">
                          {shift.data.transactions?.map((txn) => {
                            const imageUrl = txn.imagePath
                              ? `${import.meta.env.VITE_MEDIA_BASE_URL_HRMS}${
                                  txn.imagePath
                                }`
                              : null;

                            return (
                              <div key={txn._id} className="relative mb-2 pl-4">
                                <span className="absolute left-[-0.5rem] top-4 w-4 h-4 bg-blue-500 border-2 border-white rounded-full z-10"></span>

                                {/* Transaction card */}
                                <div className="bg-white p-4 rounded-lg flex items-start gap-4">
                                  {imageUrl && (
                                    <div className="relative">
                                      <img
                                        src={imageUrl}
                                        alt="Transaction"
                                        className="h-16 w-16 object-cover rounded-lg"
                                      />
                                      {/* View icon overlay */}
                                      <button
                                        onClick={() =>
                                          setPreviewImage(imageUrl)
                                        }
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg opacity-0 hover:opacity-100 transition"
                                      >
                                        <MdVisibility className="text-white w-6 h-6" />
                                      </button>
                                    </div>
                                  )}

                                  <div className="flex-1">
                                    <p className="text-sm text-primary font-medium">
                                      {txn.type === "checkIn"
                                        ? "Check-In"
                                        : "Check-Out"}{" "}
                                      —{" "}
                                      {new Date(
                                        txn.transactionDate
                                      ).toLocaleTimeString()}
                                    </p>
                                    <p className="mt-2 text-sm text-gray-800">
                                      {txn.geoLocation?.address?.length > 35 ? (
                                        <>
                                          {expanded.includes(txn._id)
                                            ? txn.geoLocation?.address
                                            : txn.geoLocation?.address.slice(
                                                0,
                                                35
                                              )}

                                          <button
                                            onClick={() =>
                                              toggleExpand(txn._id)
                                            }
                                            className="ml-1 text-primary underline text-xs"
                                          >
                                            {expanded.includes(txn._id)
                                              ? "View less"
                                              : "View more"}
                                          </button>
                                        </>
                                      ) : (
                                        txn.geoLocation?.address
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right: Shift Details */}
                      <div className="w-1/2 space-y-4 text-sm sticky top-0 self-start">
                        {/* === Shift Details === */}
                        <div className="border rounded-lg p-3 bg-white shadow-sm text-gray-900">
                          <h5 className="font-semibold text-primary mb-2">
                            Shift Details
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <p>
                              <strong className="text-gray-900">
                                Shift Name :
                              </strong>{" "}
                              {shift.data.shiftName}
                            </p>
                            <p>
                              <strong className="text-gray-900">
                                Shift Time :
                              </strong>{" "}
                              {shift.data.startTime} – {shift.data.endTime}
                            </p>

                            <p>
                              <strong>Working Hours :</strong>{" "}
                              {shift.data.workingHours}
                            </p>
                            <p>
                              <strong>Break Minutes :</strong>{" "}
                              {shift.data.breakMinutes}
                            </p>
                            <p>
                              <strong> Status :</strong>{" "}
                              {shift.data.approvalStatusError}
                            </p>
                          </div>
                        </div>

                        {/* === Shift Validations === */}
                        <div className="border rounded-lg p-3 bg-white shadow-sm text-gray-900 flex justify-between items-start">
                          {/* Left side → Validations list */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-900">
                            {validationKeys
                              .filter(
                                (key) =>
                                  shift.data?.[key] !== undefined &&
                                  shift.data?.[key] !== null
                              )
                              .map((key, idx) => {
                                const label = key
                                  .replace(/^is/, "")
                                  .replace(/([A-Z])/g, " $1")
                                  .trim();

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="w-5 h-5 flex items-center justify-center border border-primary rounded-md">
                                      {shift.data[key] ? (
                                        <span className="text-green-600 text-sm">
                                          ✔
                                        </span>
                                      ) : (
                                        <span className="text-red-600 text-sm">
                                          ✘
                                        </span>
                                      )}
                                    </span>
                                    <p className="text-gray-800">{label}</p>
                                  </div>
                                );
                              })}
                          </div>

                          {/* Right side → Approval Status */}
                          <div className="flex flex-row items-start">
                            {/* Error message if no validation keys are present */}
                            {validationKeys.every(
                              (key) =>
                                shift.data?.[key] === undefined ||
                                shift.data?.[key] === null
                            ) && (
                              <div className="mb-1 text-red-600 text-sm font-medium">
                                {shift.data.approvalStatusError ||
                                  "Validation data missing!"}
                              </div>
                            )}

                            {/* Status badge */}
                            <span
                              className={`px-3 py-1 ml-4 rounded-md text-sm font-semibold
      ${
        shift.data.approvalStatus === "Approved"
          ? "bg-green-100 p-2 text-green-700"
          : shift.data.approvalStatus === "Error"
          ? "bg-red-100 p-2 text-red-800"
          : "bg-yellow-100 text-yellow-800"
      }`}
                            >
                              {shift.data.approvalStatus || "Pending"}
                            </span>
                          </div>
                        </div>

                        {/* === Approve / Reject if validations exist and not already approved/rejected === */}
                        {allValidationsExist &&
                          shift.data.action === true &&
                          shift.data.approvalStatus !== "Approved" &&
                          shift.data.approvalStatus !== "Rejected" && (
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() =>
                                  handleApproval(shift, "Approved")
                                }
                                className="px-3 py-1 rounded-md text-xs font-semibold bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleApproval(shift, "Rejected")
                                }
                                className="px-3 py-1 rounded-md text-xs font-semibold bg-red-500 text-white hover:bg-red-600"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                }}
              />
            </div>
            {previewImage && (
              <div className="fixed inset-0 bg-black bg-opacity-0 flex items-center justify-center z-[999]">
                <div className="relative">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-[40vh] max-w-[40vw] rounded-xl object-contain"
                  />
                  <button
                    onClick={() => setPreviewImage(null)}
                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </Modal>
        )}
      </div>
    </div>
  );
};

export default MonthLogs;
