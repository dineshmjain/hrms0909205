import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { Typography, Chip } from "@material-tailwind/react";
import Table from "../../../components/Table/Table"; // reuse your custom table

const StatutorySettings = () => {
  const navigate = useNavigate();

  // Dummy data for statutory heads
  const statutoryList = [
    {
      id: 1,
      name: "Provident Fund (PF)",
      employeeContribution: "12%",
      employerContribution: "12%",
      wageLimit: "₹15,000",
      calculationComponents: "Basic, DA",
      isActive: true,
      modifiedDate: "2025-09-15T10:30:00Z",
      createdBy: "System",
    },
    {
      id: 2,
      name: "Employees' State Insurance (ESI)",
      employeeContribution: "0.75%",
      employerContribution: "1.75%",
      wageLimit: "₹21,000",
      calculationComponents: "Basic, DA, HRA",
      isActive: true,
      modifiedDate: "2025-09-14T09:15:00Z",
      createdBy: "System",
    },
    {
      id: 3,
      name: "Professional Tax",
      employeeContribution: "₹200 (Monthly)",
      employerContribution: "-",
      wageLimit: "-",
      calculationComponents: "Gross Salary",
      isActive: false,
      modifiedDate: "2025-09-13T12:00:00Z",
      createdBy: "System",
    },
    {
      id: 4,
      name: "TDS",
      employeeContribution: "As per slabs",
      employerContribution: "-",
      wageLimit: "₹2,50,000",
      calculationComponents: "Gross Salary",
      isActive: true,
      modifiedDate: "2025-09-12T08:20:00Z",
      createdBy: "System",
    },
  ];

  // Labels for the table
  const labels = {
    name: { DisplayName: "Statutory Component" },
    employeeContribution: { DisplayName: "Employee Contribution" },
    employerContribution: { DisplayName: "Employer Contribution" },
    wageLimit: { DisplayName: "Wage Limit" },
    calculationComponents: { DisplayName: "Calculation Components" },
    createdBy: { DisplayName: "Created By" },
    isActive: {
            DisplayName: "Status",
            type: "function",
            data: (data, idx, subData, subIdx) => {
                return (
                  <div className="flex justify-center items-center gap-2" key={idx}>
                    <Chip
                      color={data?.isActive ? "green" : "red"}
                      variant="ghost"
                      value={data?.isActive ? "Active" : "Inactive"}
                      className="cursor-pointer font-poppins"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowPrompt(data);
                      }}
                    />
                  </div>
                );
              },
            },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY hh:mm A",
    },
  };

  const actions = [
    {
      title: "Edit",
      text: "✏️",
      onClick: (row) => {
        console.log("Edit clicked:", row);
        navigate("/salary/statutory/edit", { state: row });
      },
    },
  ];

  const loading = false;
  const totalRecord = statutoryList.length;
  const pageNo = 1;
  const limit = 10;

  const editButton = (row) => {
    navigate("/salary/statutory/edit", { state: row });
  };

  const getStatutoryList = () => {
    console.log("Fetching statutory list…");
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      {/* Header */}
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize">
            Statutory Settings
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize">
            Configure statutory components like PF, ESI, PT, and TDS
          </Typography>
        </div>
        <div>
          <button
            size="sm"
            className="bg-primary p-2 px-2 h-10 flex items-center gap-2 rounded-md text-white font-medium tracking-tight text-sm hover:bg-primaryLight hover:text-primary"
            onClick={() => navigate("/salary/statutory/create")}
          >
            <IoMdAdd className="w-4 h-4 cursor-pointer" />
            Add Statutory Component
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        tableJson={statutoryList}
        labels={labels}
        actions={actions}
        isLoading={loading}
        onRowClick={editButton}
        tableName="Statutory Settings"
        paginationProps={{
          totalRecord,
          pageNo,
          limit,
          onDataChange: (page, limit, search = "") => {
            getStatutoryList({ page, limit, search });
          },
        }}
      />
    </div>
  );
};

export default StatutorySettings;
