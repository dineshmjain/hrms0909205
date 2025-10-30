import React, { useEffect, useState, useMemo } from "react";
// import {Table} from "../../components/Table/Table";
import Table from "../../components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { MdDelete, MdModeEditOutline, MdShare } from "react-icons/md";
import { EmployeeGetAction } from "../../redux/Action/Employee/EmployeeAction";
import MultiSelectFilter from "../../components/Filter/MultiSelectFilter";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { PiUserPlusBold } from "react-icons/pi";
import { Typography } from "@material-tailwind/react";
import moment from "moment";
const List = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    orgId: "",
    branchIds: [],
    departmentIds: [],
    designationIds: [],
    employeeIds: [],
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  // Access employeeList directly
  const { employeeList, loading, error, totalRecord, limit, pageNo } =
    useSelector((state) => state.employee);
  const user = useSelector((state) => state.user.user);
  const isSubOrg = !!user?.modules?.["suborganization"]?.r;
  console.log("isSubOrg:", isSubOrg);
  const getEmployeeList = (params) => {
    let body = removeEmptyStrings(params);
    console.log("Fetching employees with params:", body);
    dispatch(EmployeeGetAction(removeEmptyStrings(body)));
    // console.log(params);
  };

  const addButton = () => {
    navigate("/user/add");
  };

  const editButton = (branch) => {
    navigate("/user/edit?tab=Official", { state: branch });
  };
  const conditionalLabels = !isSubOrg
    ? {} // hide organizationName
    : {
        organizationName: {
          DisplayName: "Organization",
          type: "object",
          objectName: "organization",
        },
      };
  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5 " />,
      onClick: (data, title) => {
        editButton(data);
      },
    },
    {
      title: "Share",
      text: <MdShare className="w-5 h-5 text-pop" />,
      onClick: (data, title) => {},
    },
    {
      title: "Delete",
      text: <MdDelete className="w-5 h-5 text-pop" />,
      onClick: (data, title) => {},
    },
  ];

  const labels = {
    // ...baseLabels,

    firstName: {
      DisplayName: "First Name",
      type: "object",
      objectName: "name",
    },
    lastName: {
      DisplayName: "Last Name",
      type: "object",
      objectName: "name",
    },
    email: { DisplayName: "Email" },
    mobile: { DisplayName: "Mobile" },

    ...conditionalLabels,
    branchName: { DisplayName: "Branch", type: "object", objectName: "branch" },
    departmentName: {
      DisplayName: "Department",
      type: "object",
      objectName: "department",
    },
    designationName: {
      DisplayName: "Designation",
      type: "object",
      objectName: "designation",
    },
    workTiming: {
      DisplayName: "Work Timing",
      type: "function",
      data: (data) => {
        const timing = data?.workTiming;
        if (!timing) return "N/A";

        const { name, startTime, endTime } = timing;
        return `${name || ""} (${startTime || "N/A"} - ${endTime || "N/A"})`;
      },
    },

    createdByName: {
      DisplayName: "CreatedBy",
      type: "function",
      data: (data, idx, subData, subIdx) => {
        return (
          (data?.createdByName &&
            Object.values(data?.createdByName)?.join(" ")) ||
          "N/A"
        );
      },
    },
    // modifiedDate: {
    //   DisplayName: "Last Modified",
    //   type: "time",
    //   format: "DD-MM-YYYY HH:mm A",
    // }
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "function",
      data: (data) => {
        const raw = data?.createdDate;
        const formatted = raw
          ? moment(raw).local().format("DD-MM-YYYY hh:mm A")
          : "N/A";

        console.log("Raw Modified Date:", raw);
        console.log("Formatted Modified Date:", formatted);

        return formatted;
      },
    },
  };
  const importButton = () => navigate("/user/import");
  // Render the table with the employee list
  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize  ">
            Employee List
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
            Overview Of Your Employees
          </Typography>
        </div>
        <div className="gap-3 flex">
          <button
            size="sm"
            className="bg-primary p-2 px-2 h-10 flex items-center gap-2   rounded-md text-white font-medium tracking-tight text-sm hover:bg-primaryLight hover:text-primary"
            onClick={addButton}
          >
            Add New Employee
            <PiUserPlusBold className="w-4 h-4 cursor-pointer" />
          </button>
          <button
            size="sm"
            className="flex h-10 items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm hover:text-primary"
            onClick={importButton}
          >
            Import Employee
          </button>
        </div>
      </div>
      <div className="bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
          Filters
        </div>
        <MultiSelectFilter
          showFilters={showFilters}
          selectedFilters={selectedFilters}
          onSet={(data) => {
            let { employeeId, ...rest } = data;
            getEmployeeList({
              page: 1,
              limit: 10,
              ...rest,
            });
          }}
          setSelectedFilters={setSelectedFilters}
          pageName={"employee"}
        />
      </div>
      <Table
        tableJson={employeeList}
        labels={labels}
        actions={actions}
        isLoading={loading}
        onRowClick={editButton}
        tableName="Employee List"
        paginationProps={{
          totalRecord,
          pageNo,
          limit,
          onDataChange: (page, limit, search = "") => {
            getEmployeeList({ page, limit, search });
          },
        }}
      />
    </div>
  );
};

export default List;
