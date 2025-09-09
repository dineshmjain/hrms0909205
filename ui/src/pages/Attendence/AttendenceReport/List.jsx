import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../../../components/header/Header";
import MultiSelectFilter from "../../../components/Filter/MultiSelectFilter";
import Table from "../../../components/Table/Table";
import { getAttendanceReportAction } from "../../../redux/Action/Attendence/attendenceAction";
import { removeEmptyStrings } from "../../../constants/reusableFun";
import { MdVisibility } from "react-icons/md";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { list: attendanceList = [], totalRecord = 0 } = useSelector(
    (state) => state?.attendence?.report || {}
  );
  const loading = useSelector((state) => state?.attendence?.loading);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [showFilters, setShowFilters] = useState(true);
  const [hasFetchedInitially, setHasFetchedInitially] = useState(false);
  const checkModules = useCheckEnabledModule();
  const [selectedFilters, setSelectedFilters] = useState({
    year: currentYear,
    month: currentMonth,
    orgIds: [],
    branchIds: [],
    clientMappedIds: [],
    clientBranchIds: [],
    departmentIds: [],
    designationIds: [],
    employeeIds: [],
    page: 1,
    limit: 10,
    subOrgId: "",
  });

  const getAttendanceList = (filters) => {
    const {
      year,
      month,
      page = 1,
      limit = 10,
      orgIds = [],
      branchIds = [],
      clientMappedIds = [],
      clientBranchIds = [],
      departmentIds = [],
      designationIds = [],
      employeeIds = [],
    } = filters;

    const cleanFilters = removeEmptyStrings({
      year,
      month,
      page,
      limit,
      orgIds,
      branchIds,
      clientMappedIds,
      clientBranchIds,
      departmentIds,
      designationIds,
      employeeIds: Array.isArray(employeeIds) ? employeeIds : [],
    });

    if (
      cleanFilters.year &&
      cleanFilters.month &&
      (cleanFilters?.orgIds || cleanFilters?.branchIds)
    ) {
      const { orgIds, ...rest } = cleanFilters;
      let updated = {};
      if (typeof orgIds === "string") {
        updated = { orgIds: [orgIds], ...rest };
      } else {
        updated = { orgIds, ...rest };
      }

      dispatch(getAttendanceReportAction(updated));
    }
  };

  // Auto-fetch after default orgId is set
  useEffect(() => {
    if (
      !hasFetchedInitially &&
      selectedFilters?.orgIds?.length > 0 &&
      selectedFilters?.year &&
      selectedFilters?.month
    ) {
      getAttendanceList(selectedFilters);
      setHasFetchedInitially(true);
    }
  }, [selectedFilters.orgIds, selectedFilters.year, selectedFilters.month]);

  // Default org setup
  // useEffect(() => {
  //   if (subOrgs?.length > 0 && selectedFilters.orgIds.length === 0) {
  //     const defaultOrgId = subOrgs[0]?._id;
  //     if (defaultOrgId) {
  //       const updatedFilters = {
  //         ...selectedFilters,
  //         subOrgId: defaultOrgId,
  //         orgIds: [defaultOrgId],
  //       };
  //       setSelectedFilters(updatedFilters);
  //     }
  //   }
  // }, [subOrgs]);

  const handleSearch = (filters = selectedFilters) => {
    // setSelectedFilters(filters);
    getAttendanceList(filters);
  };

  const handlePageChange = (page, limit) => {
    const updatedFilters = { ...selectedFilters, page, limit };
    // setSelectedFilters(updatedFilters);
    getAttendanceList(updatedFilters);
  };

  const handleRowClick = (row) => {
    const payload = {
      ...selectedFilters,
      employeeIds: [row.userId],
      employeeName: row.name,
    };

    // localStorage.setItem("attendreportList", JSON.stringify(payload));
    localStorage.setItem("attendancemonthreportList", JSON.stringify(payload));
    navigate("/daylogs");
  };
  const actions = [
    {
      title: "View",
      text: <MdVisibility className="w-5 h-5 cursor-pointer" />,
      onClick: (row) => {
        // Optional: check permissions if needed
        // if (!checkModules("attendance", "v")) return toast.error("Unauthorized!");

        const payload = {
          ...selectedFilters,
          employeeIds: [row.userId],
          employeeName: row.name,
        };

        localStorage.setItem(
          "attendancemonthreportList",
          JSON.stringify(payload)
        );
        navigate("/daylogs");
      },
    },
  ];
  const labels = {
    name: {
      DisplayName: "Employee Name",
      type: "function",
      data: (data) =>
        `${data?.name?.firstName || ""} ${data?.name?.lastName || ""}`,
    },
    monthName: { DisplayName: "Month" },
    monthDays: { DisplayName: "Total Days" },
    presentDays: { DisplayName: "Present Days" },
    noOfShifts: { DisplayName: "No of Shifts" },
    earlyIn: {
      DisplayName: "Early In",
      type: "chip",
      colorData: {
        anyColor: "#cbf7ffff",
        // anyColor: "#ffffff"
      },
      textColor: {
        anyColor: "#09414bff",
      },
    },
    onTimeIn: {
      DisplayName: "On Time In",
      type: "chip",
      colorData: {
        anyColor: "#caffe0ff",
        // anyColor: "#ffffff"
      },
      textColor: {
        anyColor: "#094e26ff",
      },
    },
    lateIn: {
      DisplayName: "Late In",
      type: "chip",
      colorData: {
        anyColor: "#ffcdcdff",
        // anyColor: "#ffffff"
      },
      textColor: {
        anyColor: "#420505ff",
      },
    },
    earlyOut: {
      DisplayName: "Early Out",
      type: "chip",
      colorData: {
        anyColor: "#ffcdcdff",
        // anyColor: "#ffffff"
      },
      textColor: {
        anyColor: "#420505ff",
      },
    },
    onTimeOut: {
      DisplayName: "On Time Out",
      type: "chip",
      colorData: {
        anyColor: "#caffe0ff",
        // anyColor: "#ffffff"
      },
      textColor: {
        anyColor: "#094e26ff",
      },
    },
    lateOut: {
      DisplayName: "Late Out",
      type: "chip",
      colorData: {
        anyColor: "#cbf7ffff",
        // anyColor: "#ffffff"
      },
      textColor: {
        anyColor: "#09414bff",
      },
    },
    absentDays: { DisplayName: "Absent Days" },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">
      <Header
        headerLabel="Attendance Monthly Report"
        subHeaderLabel="Overview of Monthly Attendance Data"
      />

      <div className="w-full bg-white p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm font-semibold mb-4">
            Filters
          </span>
        </div>

        <MultiSelectFilter
          pageName="attendreport"
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          showFilters={showFilters}
          onSet={handleSearch}
        />
      </div>

      <div className="w-full">
        <Table
          tableJson={attendanceList}
          labels={labels}
          isLoading={loading}
          tableName="Attendance Report"
          onRowClick={handleRowClick}
          actions={actions}
          paginationProps={{
            totalRecord,
            onDataChange: handlePageChange,
          }}
        />
      </div>
    </div>
  );
};

export default List;
