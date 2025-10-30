import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { IoSparkles } from "react-icons/io5";
import { Typography } from "@material-tailwind/react";
import MultiSelectFilter from "../../../components/Filter/MultiSelectFilter";
import Table from "../../../components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { SalaryTemplatesGetAction } from "../../../redux/Action/Salary/SalaryAction";
import { MdModeEditOutline } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { toTitleCase } from "../../../constants/reusableFun";

import AssignTemplateSidebar from "./components/AssignTemplateSidebar";
import PreviewTemplateSidebar from "./components/PreviewTemplateSidebar";

const TemplateList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedFilters, setSelectedFilters] = useState({
    orgId: "",
    branchIds: [],
    departmentIds: [],
    designationIds: [],
  });

  const [openSidebar, setOpenSidebar] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const { list, loading, totalRecord, pageNo, limit } = useSelector(
    (s) => s.salary.templates
  );

  useEffect(() => {
    getTemplateList({ page: 1, limit: 10 });
  }, []);

  const getTemplateList = (params) => {
    dispatch(SalaryTemplatesGetAction({ ...params }));
  };

  const handleOpenSidebar = (row) => {
    setSelectedTemplate(row);
    setOpenSidebar(true);
  };

  const handleCloseSidebar = () => {
    setOpenSidebar(false);
    setSelectedTemplate(null);
  };

  const handleOpenPreview = (row) => {
    setSelectedTemplate(row);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setSelectedTemplate(null);
  };

  const labels = {
    templateName: {
      DisplayName: "Name",
      type: "function",
      data: (row) => toTitleCase(row?.templateName),
    },
    description: { DisplayName: "Description" },
    modifiedDate: {
      DisplayName: "Modified Date",
      type: "time",
      format: "DD-MM-YYYY hh:mm A",
    },
  };

  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (row) => navigate(`/salaryTemplate/edit/${row._id}`),
    },
    {
      title: "Assign",
      text: <FaUserPlus className="w-5 h-5" />,
      onClick: (row) => handleOpenSidebar(row),
    },
    {
      title: "Preview",
      text: <FaEye className="w-5 h-5" />,
      onClick: (row) => handleOpenPreview(row),
    },
  ];

  const editButton = (row) => {
    navigate("/salaryTemplate/edit", { state: row });
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      {/* Sidebar */}
      <AssignTemplateSidebar
        open={openSidebar}
        onClose={handleCloseSidebar}
        selectedTemplate={selectedTemplate}
      />

      <PreviewTemplateSidebar
        open={openPreview}
        onClose={handleClosePreview}
        selectedTemplate={selectedTemplate}
      />

      {/* Header */}
      <div className="flex justify-between p-2">
        <div>
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize">
            Salary Templates
          </Typography>
          <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize">
            Overview Of Your Salary Templates
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <button
            size="sm"
            className="bg-primary p-2 px-2 h-10 flex items-center gap-2 rounded-md text-white font-medium tracking-tight text-sm hover:bg-primaryLight hover:text-primary"
            onClick={() => navigate("/salaryTemplate/wizard")}
          >
            <IoSparkles className="w-4 h-4 cursor-pointer" />
            Assist Wizard
          </button> 
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-md shadow-hrms">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
          Filters
        </div>
        <MultiSelectFilter
          showFilters={true}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          onSet={(filters) => {
            setSelectedFilters(filters);
            getTemplateList({ page: 1, limit, ...filters });
          }}
          pageName={"salary"}
          isBranchMulti={false}
          isDepartmentMulti={false}
          isDesignationMulti={false}
        />
      </div>

      {/* Table */}
      <Table
        tableJson={list}
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
            getTemplateList({ page, limit, search });
          },
        }}
      />
    </div>
  );
};

export default TemplateList;
