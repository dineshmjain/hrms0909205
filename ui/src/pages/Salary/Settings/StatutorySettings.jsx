import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Chip } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/Table/Table";
import { SalaryComponentsGetAction } from "../../../redux/Action/Salary/SalaryAction";
import { usePrompt } from "../../../context/PromptProvider";
import { toTitleCase } from "../../../constants/reusableFun";

const StatutorySettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showPrompt, hidePrompt } = usePrompt();

  // Grab statutory slice from redux
  const { list, loading, totalRecord, pageNo, limit } = useSelector(
    (s) => s.salary.statutory
  );

  // Fetch statutory components on mount
  useEffect(() => {
    getStatutoryList({ page: 1, limit: 10 });
  }, []);

  const getStatutoryList = (params) => {
    dispatch(
      SalaryComponentsGetAction({
        ...params,
        category: "statutory", // updated filter
      })
    );
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? `Deactivate` : `Activate`}</b> the{" "}
          <b>{toTitleCase(data.name)}</b> statutory component?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            // stub for now
            hidePrompt();
          },
        },
        {
          label: "No",
          type: 0,
          onClick: () => hidePrompt(),
        },
      ],
    });
  };

  // Formatter helpers
  const formatContribution = (value, row) => {
    if (typeof value === "number") {
      return `${value * 100}%`;
    }
    if (value === null && row?.statutoryDetails?.note) {
      return row.statutoryDetails.note;
    }
    return "-";
  };

  const formatLimit = (limit, row) => {
    if (typeof limit === "number") {
      return `₹${limit.toLocaleString("en-IN")}`;
    }
    if (limit === null && row?.statutoryDetails?.note) {
      return row.statutoryDetails.note;
    }
    return "-";
  };

  // Labels for the table
  const labels = {
    name: {
      DisplayName: "Statutory Component",
      type: "function",
      data: (row) => toTitleCase(row?.name),
    },
    employeeContribution: {
      DisplayName: "Employee Contribution",
      type: "function",
      data: (row) =>
        formatContribution(row?.statutoryDetails?.contribution?.employee, row),
    },
    employerContribution: {
      DisplayName: "Employer Contribution",
      type: "function",
      data: (row) =>
        formatContribution(row?.statutoryDetails?.contribution?.employer, row),
    },
    wageLimit: {
      DisplayName: "Wage Limit",
      type: "function",
      data: (row) => formatLimit(row?.statutoryDetails?.limit, row),
    },
    createdByName: {
      DisplayName: "Created By",
      type: "function",
      data: (row) => row?.createdByName || "System",
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx) => (
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
      ),
    },
  };

  const actions = [
    {
      title: "Edit",
      text: "✏️",
      onClick: (row) => {
        navigate("/salary/statutory/edit", { state: row });
      },
    },
  ];

  const editButton = (row) => {
    navigate("/salary/statutory/edit", { state: row });
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
      </div>

      {/* Table */}
      <Table
        tableJson={list}
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
