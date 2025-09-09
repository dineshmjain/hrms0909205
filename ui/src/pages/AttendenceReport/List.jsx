import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/Header";
import Filter from "../../components/Filter/Filter";
import Table from "../../components/Table/Table";
import { getAttendanceReportAction } from "../../redux/Action/Attendence/attendenceAction";
import Filterbutton from "../../components/Filter/Filterbutton";
// import YearMonthFilter from "../../components/YearMonthFilter/YearMonthFilter";
import { useNavigate } from "react-router-dom";
const List = () => {
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(window?.innerWidth > 640);
  const { subOrgs } = useSelector((state) => state?.subOrgs);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const navigate = useNavigate();
  const [hasFetchedInitially, setHasFetchedInitially] = useState(false);

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

  const { list: attendanceList = [], totalRecord = 0 } = useSelector(
    (state) => state?.attendence?.report || {}
  );
  const loading = useSelector((state) => state?.attendence?.loading);

  const getAttendanceList = (filters) => {
    const cleanFilters = {
      year: filters.year,
      month: filters.month,
      page: filters.page || 1,
      limit: filters.limit || 10,
      orgIds: filters.orgIds || [],
      branchIds: filters.branchIds || [],
      clientMappedIds: filters.clientMappedIds || [],
      clientBranchIds: filters.clientBranchIds || [],
      departmentIds: filters.departmentIds || [],
      designationIds: filters.designationIds || [],
      // employeeIds: filters.employeeIds?.length
      //   ? filters.employeeIds
      //   : filters.employeeId?.length
      //   ? filters.employeeId
      //   : [],
      employeeIds: Array.isArray(filters.employeeIds)
        ? filters.employeeIds
        : [],
    };

    Object.keys(cleanFilters).forEach(
      (key) =>
        (cleanFilters[key] === "" || cleanFilters[key] === undefined) &&
        delete cleanFilters[key]
    );

    console.log("Fetching attendance with filters: ", cleanFilters);

    if (
      cleanFilters.year &&
      cleanFilters.month &&
      cleanFilters.orgIds.length > 0
    ) {
      dispatch(getAttendanceReportAction(cleanFilters));
    }
  };

  useEffect(() => {
    if (
      !hasFetchedInitially &&
      selectedFilters?.orgIds?.length > 0 &&
      selectedFilters?.year &&
      selectedFilters?.month
    ) {
      getAttendanceList(selectedFilters);
      setHasFetchedInitially(true); // prevent future auto calls
    }
  }, [selectedFilters.orgIds, selectedFilters.year, selectedFilters.month]);

  useEffect(() => {
    if (subOrgs?.length > 0 && !selectedFilters.orgIds.length) {
      const defaultOrgId = subOrgs?.[0]?._id;
      if (defaultOrgId) {
        const updatedFilters = {
          ...selectedFilters,
          subOrgId: defaultOrgId,
          orgIds: [defaultOrgId], // Set the default orgId here
        };
        setSelectedFilters(updatedFilters);
      }
    }
  }, [subOrgs]);

  const handleSearch = (filters = selectedFilters) => {
    setSelectedFilters(filters);
    getAttendanceList(filters);
  };

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
    lateIn: { DisplayName: "Late In" },
    earlyOut: { DisplayName: "Early Out" },
    absentDays: { DisplayName: "Absent Days" },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        headerLabel="Attendance Monthly Report"
        subHeaderLabel="Overview of Monthly Attendance Data"
      />

      <div className="w-full bg-white p-4 ">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm font-semibold mb-4">
            Filters
          </span>
        </div>

        <Filter
          pageName="attendancereport"
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          showFilters={showFilters}
          onSet={handleSearch}
          // employeFilterType="single"
        />
      </div>

      <div className="w-full">
        <Table
          tableJson={attendanceList}
          labels={labels}
          isLoading={loading}
          tableName="Attendance Report"
          onRowClick={(row) => {
            console.log("Navigating to monthlogs with:", {
              year: selectedFilters.year,
              month: selectedFilters.month,
              employeeId: row.userId, // <-- Correct field
              selectedFilters, // send full filter
            });
            localStorage.setItem('prevFilters',JSON.stringify({
            
                ...selectedFilters,
                employeeIds: [row.userId],
                employeeName: row.name, // optional but helpful if you want to show/display name
              
            }))
            navigate("/attendance/monthlogs");
          }}
          paginationProps={{
            totalRecord,
            onDataChange: (page, limit) => {
              const updatedFilters = { ...selectedFilters, page, limit };
              setSelectedFilters(updatedFilters);
              getAttendanceList(updatedFilters);
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;
