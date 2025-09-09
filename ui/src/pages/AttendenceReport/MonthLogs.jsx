import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import Header from "../../components/header/Header";
import Table from "../../components/Table/Table";
import Filter from "../../components/Filter/Filter";
import { getMonthLogsAction } from "../../redux/Action/Attendence/attendenceAction";
import { removeEmptyStrings } from "../../constants/reusableFun";

const MonthLogs = () => {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);
  const [searchParams] = useSearchParams();

  const [selectedFilters, setSelectedFilters] = useState({
    employeeIds: [],
    page: 1,
    limit: 10,
    year: "",
    month: "",
  });

  const { data: monthLogsList = [], totalRecord = 0 } =
    useSelector((state) => state?.attendence?.monthLogs?.data) || {};

  const loading = useSelector((state) => state?.attendence?.loading);

  const getMonthLogs = (filters) => {
    const { employeeIds, ...rest } = filters;
    const employeeId = employeeIds?.[0] || "";

    if (rest.year && rest.month ) {
      const params = removeEmptyStrings({ ...rest, employeeId });
      dispatch(getMonthLogsAction(params));
    }
  };

  const updateFilters = (newFilters, runSearch = false) => {
    setSelectedFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      if (runSearch) {
        const { employeeIds,orgIds,branchIds,departmentIds,designationIds, ...rest } = updated;
        const mainPayload =removeEmptyStrings({ ...rest, employeeIds })
        getMonthLogs(mainPayload);
      }
      return updated;
    });
  };

  // Load filters from localStorage only once on mount
  useEffect(() => {
    if (hasInitialized.current) return;

    try {
      const storedFilters = localStorage.getItem("prevFilters");
      const parsedFilters = storedFilters ? JSON.parse(storedFilters) : null;

      if (parsedFilters) {
        const employeeIds = parsedFilters.employeeIds || [];
        const initialFilters = {
          employeeIds,
          page: 1,
          limit: 10,
          year: parsedFilters.year || "",
          month: parsedFilters.month || "",
        };

        setSelectedFilters(initialFilters);

        if (initialFilters.year && initialFilters.month && employeeIds.length) {
          getMonthLogs(initialFilters);
        }

        localStorage.removeItem("prevFilters");
      }
    } catch (error) {
      console.error("Error parsing prevFilters from localStorage:", error);
    }

    hasInitialized.current = true;
  }, []);

  const handleSearch = () => {
    updateFilters({ page: 1 }, true);
  };

  const handlePageChange = (page, limit) => {
    updateFilters({ page, limit }, true);
  };

  const labels = {
    date: { DisplayName: "Date" },
    // checkInTime: { DisplayName: "Check In" },
    // checkOutTime: { DisplayName: "Check Out" },
    workingHours: { DisplayName: "Working Minutes" },
    breakMinutes: { DisplayName: "Break Minutes" },
    approvalStatus: { 
      DisplayName: "Status",
      type: "chip",
      colorData: {
        Error: "#ffc3bf",
        Approved: "#a0ffb0",
      },
      textColor: {
        Error: "#ac0000",
        Approved: "#006e04",
      }
    },
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        isBackHandler={true}
        headerLabel="Attendance Month Logs"
        subHeaderLabel="Detailed Monthly Attendance Data"
      />

      <div className="w-full bg-white p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 text-sm font-semibold mb-4">
            Filters
          </span>
        </div>

        <Filter
          pageName="attendancereport"
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          showFilters={true}
          onSet={handleSearch}
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
        />
      </div>
    </div>
  );
};

export default MonthLogs;
