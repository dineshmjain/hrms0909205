import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { Typography, Chip } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/Table/Table";
import { SalaryComponentsGetAction } from "../../../redux/Action/Salary/SalaryAction";
import { toTitleCase } from "../../../constants/reusableFun";
import { usePrompt } from "../../../context/PromptProvider";

const ComponentSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showPrompt, hidePrompt } = usePrompt();

  // Grab state from redux
  const { list, loading, totalRecord, pageNo, limit } = useSelector(
    (s) => s.salary.components
  );

  useEffect(() => {
    // fetch only normal components by default
    getComponentList({ page: 1, limit: 10, category: "normal" });
  }, []);

  const getComponentList = (params) => {
    dispatch(
      SalaryComponentsGetAction({
        category: "normal", // always enforce normal category here
        ...params,
      })
    );
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? `Deactivate` : `Activate`} </b> the{" "}
          <b>{toTitleCase(data.name)}</b> component?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            // placeholder: trigger activate/deactivate API here
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

  // Labels for the table
  const labels = {
    name: {
      DisplayName: "Component Name",
      type: "function",
      data: (row) => toTitleCase(row?.name),
    },
    category: {
      DisplayName: "Type",
      type: "function",
      data: (row) => toTitleCase(row?.category),
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
            className="cursor-pointer font-poppins transition-all duration-300 ease-in-out"
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
        navigate("/salary/component/edit", { state: row });
      },
    },
  ];

  const editButton = (row) => {
    navigate("/salary/component/edit", { state: row });
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      {/* Header */}
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize">
            Salary Components
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize">
            Manage and configure your Organization's salary components
          </Typography>
        </div>
        <div>
          <button
            size="sm"
            className="bg-primary p-2 px-2 h-10 flex items-center gap-2 rounded-md text-white font-medium tracking-tight text-sm hover:bg-primaryLight hover:text-primary"
            onClick={() => navigate("/salarySettings/create")}
          >
            <IoMdAdd className="w-4 h-4 cursor-pointer" />
            Add Component
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        tableJson={list}
        labels={labels}
        actions={actions}
        isLoading={loading}
        onRowClick={editButton}
        tableName="Salary Components"
        paginationProps={{
          totalRecord,
          pageNo,
          limit,
          onDataChange: (page, limit, search = "") => {
            getComponentList({ page, limit, search });
          },
        }}
      />
    </div>
  );
};

export default ComponentSettings;
