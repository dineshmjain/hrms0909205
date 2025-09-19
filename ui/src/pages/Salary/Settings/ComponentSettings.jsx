import React from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { Typography, Chip } from "@material-tailwind/react";
import Table from "../../../components/Table/Table"; // your custom Table component

const ComponentSettings = () => {
  const navigate = useNavigate();

  // Dummy data
  const componentList = [
    {
      id: 1,
      name: "Basic Pay",
      type: "Earning",
      createdBy: "System",
    //   modifiedDate: "2025-09-15T10:30:00Z",
    //   isActive: true,
    },
    {
      id: 2,
      name: "House Rent Allowance (HRA)",
      type: "Earning",
      createdBy: "System",
    //   modifiedDate: "2025-09-14T09:15:00Z",
    //   isActive: true,
    },
    {
      id: 3,
      name: "Conveyance Allowance",
      type: "Earning",
      createdBy: "System",
    //   modifiedDate: "2025-09-13T12:00:00Z",
    //   isActive: false,
    },
    {
      id: 4,
      name: "Special Allowance",
      type: "Earning",
      createdBy: "System",
    //   modifiedDate: "2025-09-12T08:20:00Z",
    //   isActive: true,
    },
  ];

  // Labels for the table
  const labels = {
    name: { DisplayName: "Component Name" },
    type: { DisplayName: "Type" },
    createdBy: { DisplayName: "Created By" },
    // isActive: {
    //     DisplayName: "Status",
    //     type: "function",
    //     data: (data, idx, subData, subIdx) => {
    //         return (
    //           <div className="flex justify-center items-center gap-2" key={idx}>
    //             <Chip
    //               color={data?.isActive ? "green" : "red"}
    //               variant="ghost"
    //               value={data?.isActive ? "Active" : "Inactive"}
    //               className="cursor-pointer font-poppins"
    //               onClick={(e) => {
    //                 e.stopPropagation();
    //                 handleShowPrompt(data);
    //               }}
    //             />
    //           </div>
    //         );
    //       },
    //     },
    // modifiedDate: {
    //   DisplayName: "Last Modified",
    //   type: "time",
    //   format: "DD-MM-YYYY hh:mm A",
    // },
  };

  const actions = [
    {
      title: "Edit",
      text: "✏️",
      onClick: (row) => {
        console.log("Edit clicked:", row);
        navigate("/salary/component/edit", { state: row });
      },
    },
  ];

  const loading = false; // static for now
  const totalRecord = componentList.length;
  const pageNo = 1;
  const limit = 10;

  const editButton = (row) => {
    console.log("Row clicked", row);
    navigate("/salary/component/edit", { state: row });
  };

  const getComponentList = () => {
    // placeholder – backend will replace this
    console.log("Fetching salary components…");
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
            onClick={() => navigate("/salary/component/create")}
          >
            <IoMdAdd className="w-4 h-4 cursor-pointer" />
            Add Component
          </button>
        </div>
      </div>

      {/* Table */}
      <Table
        tableJson={componentList}
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
