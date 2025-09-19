import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { Typography } from "@material-tailwind/react";
import MultiSelectFilter from "../../../components/Filter/MultiSelectFilter";
import Table from "../../../components/Table/Table"; // don’t forget to import

const TemplateList = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState({
    orgId: "",
    branchIds: [],
    departmentIds: [],
    designationIds: [],
  });

  // Dummy data
  const employeeList = [
    {
      id: 1,
      name: "Security Guard 1",
      description: "Less than 1 year experience",
      modifiedDate: "2025-09-15T10:30:00Z",
    },
    {
      id: 2,
      name: "Security Guard 2",
      description: "1 to 3 year experience",
      modifiedDate: "2025-09-14T09:15:00Z",
    },
    {
      id: 3,
      name: "Security Guard 3",
      description: "3 to 5 year experience",
      modifiedDate: "2025-09-12T14:45:00Z",
    },
  ];

  // Labels for the table
  const labels = {
    name: { DisplayName: "Name" },
    description: { DisplayName: "Description" },
    modifiedDate: {
      DisplayName: "Modified Date",
      type: "time",
      format: "DD-MM-YYYY hh:mm A", // your Table should handle this if it follows same convention
    },
  };

  const actions = [
    {
      title: "Edit",
      text: "✏️",
      onClick: (row) => {
        console.log("Edit clicked:", row);
        navigate("/salary/template/edit", { state: row });
      },
    },
  ];

  const loading = false; // no API, so just hardcode
  const totalRecord = employeeList.length;
  const pageNo = 1;
  const limit = 10;

  const editButton = (row) => {
    console.log("Row clicked", row);
    navigate("/salary/template/edit", { state: row });
  };

  const getEmployeeList = () => {
    // placeholder – you’ll replace this when backend is ready
    console.log("Fetching dummy list…");
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize">
            Salary Templates
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize">
            Overview Of Your Salary Templates
          </Typography>
        </div>
        <div>
          <button
            size="sm"
            className="bg-primary p-2 px-2 h-10 flex items-center gap-2 rounded-md text-white font-medium tracking-tight text-sm hover:bg-primaryLight hover:text-primary"
            onClick={() => navigate("/salaryTemplate/create")}
          >
            <IoMdAdd className="w-4 h-4 cursor-pointer" />
            Create New Template
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
          Filters
        </div>
        <MultiSelectFilter
          showFilters={true}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onSet={(filters) => console.log("Salary filters", filters)}
          pageName={"salary"}
          isBranchMulti={false}
          isDepartmentMulti={false}
          isDesignationMulti={false}
        />
      </div>

      <Table
        tableJson={employeeList}
        labels={labels}
        actions={actions}
        isLoading={loading}
        onRowClick={editButton}
        tableName="Salary Templates"
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

export default TemplateList;
