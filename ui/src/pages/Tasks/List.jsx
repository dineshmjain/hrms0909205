import React, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoFilter, IoPersonAddSharp } from "react-icons/io5";
import { Button, Chip, IconButton, Input } from "@material-tailwind/react";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ProjectDeleteAction,
  ProjectListAction,
} from "../../redux/Action/project/project";
import { toast } from "react-hot-toast";
import { EmployeeClientListAction } from "../../redux/Action/Employee/EmployeeAction";
import MultiSelectRadio from "../../components/MultiSelectRadio/MultiSelectRadio";

import { usePrompt } from "../../context/PromptProvider";
import { TaskListAction } from "../../redux/Action/task/taskAction";
import Loader from "../Loader/Loader";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { emptyTask } from "../../redux/reducer/TaskReducer";
import { emptyProjectList } from "../../redux/reducer/projectReducer";
import ListFilter from "./ListPages/ListFilter";
import { emptyError } from "../../redux/reducer/ErrorReducer";
import { MdClear, MdRefresh } from "react-icons/md";
import { debounce } from "lodash";
import { DepartmentClientListAction } from "../../redux/Action/Department/DepartmentAction";
import { DesignationClientListAction } from "../../redux/Action/Designation/DesignationAction";
import Header from "../../components/header/Header";
import MultiSelectDropdown from "../../components/MultiSelectDropdown/MultiSelectDropdown";
import BasicTaskModal from "./DetailedView/BasicTaskModal";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { PiMagnifyingGlassBold, PiXBold } from "react-icons/pi";
import { checkPointListAction } from "../../redux/Action/Checkpoint/CheckpointAction";

const BasicTaskTable = lazy(() =>
  import("../../components/BasicTask/BasicTaskTable")
);

const List = ({ pageName = "task" }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const branchList = useSelector((state) => state?.branch?.branchList);
  const branchList = useSelector(
    (state) => state?.clientBranch?.clientBranchList
  );
  const initialFilter = {
    name: "",
    branchId: "",
    assignToUserId: [],
    fromDate: "",
    toDate: "",
    clientId: "",
    projectId: "",
    category: "All",
  };
  const initialEmpFilter = {
    departmentIds: [],
    designationIds: [],
  };
  const [selectedFilter, setSelectedFilter] = useState(() => {
    const data = window?.localStorage?.getItem("ProjectList");
    return data ? JSON.parse(data) : { ...initialFilter };
  });
  const [employeeFilters, setEmployeeFilter] = useState(initialEmpFilter);
  const [taskList, setTaskList] = useState([]);
  const tasks = useSelector((state) => state?.task?.task);
  const projectData = useSelector((state) => state?.project?.project);
  const employeeList = useSelector((state) => state?.employee?.employeeList);
  const clientList = useSelector((state) => state?.client?.clientList);
  const user = useSelector((state) => state?.user?.user);
  const { departmentList } = useSelector((state) => state?.department);
  const { designationList } = useSelector((state) => state?.designation);

  //select project data helps parsing the data that is ready to be used when task creation
  const selectedProject = useMemo(() => {
    if (!selectedFilter?.projectId) {
      return null;
    }

    let assignedTo = employeeList;
    let temp = {};
    temp.assignedTo = assignedTo;
    temp._id = selectedFilter?.projectId;
    temp.clientId = selectedFilter?.clientId;
    temp.branchId = selectedFilter?.branchId;
    return { ...temp };
  }, [selectedFilter, employeeList]);

  const nav = useNavigate();
  const dispatch = useDispatch();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // generating reqbody from filter
  const generateRequestBody = (state) => {
    return Object.fromEntries(
      Object.entries(state).filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0; // Keep non-empty arrays
        }
        return (
          value !== "" &&
          value !== null &&
          value !== undefined &&
          _ != "clientId"
        ); // Filter out empty strings, null, and undefined
      })
    );
  };

  const handleGetTaskList = (reqbody) => {
    dispatch(
      TaskListAction({
        ...reqbody,
        isActive: true,
      })
    );
  };

  const handleGetProjectList = (reqbody) => {
    let { assignToUserId, projectId, ...body } = reqbody;
    if (reqbody?.assignToUserId) {
      body.teamMembers = reqbody?.assignToUserId;
    }
    dispatch(ProjectListAction(body));
  };

  const handleGetBranchList = (data) => {
    // if the user logged in is a client automatcally get the branch list of the client
    if (user?.isClient) {
      if (branchList?.[0]?.clientId != user?._id)
        return dispatch(clientBranchListAction({ clientMappedId: user?._id }));
    }
    // else check if the client is selected
    if (data?.clientId) {
      if (branchList?.[0]?.clientId != data?.clientId)
        return dispatch(
          clientBranchListAction({ clientMappedId: data?.clientId })
        );
    }
    //check if the cuurrent branchlist isnt of a client and is empty
    if (!branchList?.clientId && branchList?.length == 0)
      return dispatch(BranchGetAction());
  };

  const dontMakeApiCallOnChangeOf = ["assignToUserId", "clientId"];
  const modules = useRef({
    name: {
      isEditable: true,
      DisplayName: "Name",
    },
    assignedTo: {
      isEditable: true,
      DisplayName: "Assigned To",
    },
    taskType: {
      isEditable: true,
      DisplayName: "Task Type",
    },
    dueBy: {
      isEditable: true,
      DisplayName: "Due By",
    },
    priority: {
      isEditable: true,
      DisplayName: "Priority",
    },
    status: {
      isEditable: true,
      DisplayName: "Status",
    },

    actions: {
      isEditable: true,
      DisplayName: "Actions",
    },
  });

  const handleGetEmployeeList = (data) => {
    let reqBody = {
      ...data,
      category: "assigned",
    };

    dispatch(EmployeeClientListAction(reqBody));
  };

  const handleGetBothData = (body, pagination = { page: 1, limit: 10 }) => {
    let reqbody = generateRequestBody(body);
    if (!body?.clientId) return toast?.error("Select Client!");
    if (!body?.branchId) return toast?.error("Select Client Branch!");
    handleGetTaskList({ ...reqbody, ...pagination });
    dispatch(
      checkPointListAction({
        clientMappedId: body?.clientId,
      })
    );
  };

  const handleChangeFilter = (name, value) => {
    setSelectedFilter((prev) => {
      let temp = { ...prev, [name]: value };
      // if (
      //   !dontMakeApiCallOnChangeOf.includes(name) &&
      //   ((name == "branchId" && value) || selectedFilter?.branchId) // check if branchId exists
      // ) {
      //   handleGetBothData(temp);
      // }
      return { ...temp };
    });
  };

  const handleOpenCreateModel = () => {
    setIsCreateModalOpen(true);
  };
  const handleClear = () => {
    setSelectedFilter({ ...initialFilter });
  };

  useEffect(() => {
    setTaskList(tasks);
  }, [tasks]);

  useEffect(() => {
    dispatch(emptyError());

    let data = JSON.parse(window?.localStorage?.getItem("ProjectList"));

    handleGetBranchList(data);
    if (data?.branchId && data?.projectId) {
      handleGetBothData(data);
    }

    if (data?.clientId && data?.branchId) {
      let body = {
        clientMappedId: data?.clientId ?? "",
        clientBranchIds: [data?.branchId],
      };

      dispatch(DesignationClientListAction(body));
      dispatch(DepartmentClientListAction(body));
      handleGetEmployeeList(body);
    }
  }, []);

  useEffect(() => {
    if (pageName == "patrolling") {
      handleChangeFilter("projectId", "685d24892c42a7e75ee814eb");
    }
  }, [pageName]);

  useEffect(() => {
    window?.localStorage?.setItem(
      "ProjectList",
      JSON.stringify(selectedFilter)
    );
  }, [selectedFilter]);

  useEffect(() => {
    dispatch(clientListAction());
  }, [user]);

  return (
    <Suspense fallback={<Loader />}>
      {isCreateModalOpen && (
        <BasicTaskModal
          taskData={{}}
          modules={modules.current}
          onClose={() => {
            let reqbody = generateRequestBody(selectedFilter);
            handleGetTaskList(reqbody);
          }}
          setTaskData={setIsCreateModalOpen}
          projectData={selectedProject}
          pageName={pageName}
          type={"create"}
        />
      )}
      <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
        <ListFilter
          isFilterOpen={isFilterOpen}
          setIsFilterOpen={setIsFilterOpen}
          projectData={projectData}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          generateRequestBody={generateRequestBody}
          handleGetTaskList={handleGetTaskList}
        />

        <Header
          headerLabel={`${pageName} List`}
          subHeaderLabel={`List of all ${pageName}`}
          handleClick={() => {
            if (selectedFilter?.branchId) {
              handleOpenCreateModel();
            } else {
              toast.error("Select a branch!");
            }
          }}
        />
        <div className="bg-white p-4 flex-wrap items-center shadow-hrms rounded-md">
          <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
            Filters
          </div>
          <div className="flex gap-4 flex-wrap items-end">
            <SingleSelectDropdown
              listData={clientList ?? []}
              inputName="Client"
              hideLabel={true}
              handleError={{ triggerOn: !user?.isClient }}
              feildName="name"
              selectedOptionDependency={"_id"}
              selectedOption={selectedFilter?.clientId}
              handleClick={(data) => {
                setTaskList([]);
                dispatch(emptyTask());
                dispatch(emptyProjectList());
                if (data?.name == "Self") {
                  setSelectedFilter({ ...initialFilter, clientId: "" });
                  return dispatch(BranchGetAction());
                }
                setSelectedFilter({
                  ...initialFilter,
                  projectId: selectedFilter?.projectId,
                  clientId: data?._id,
                });
                dispatch(clientBranchListAction({ clientMappedId: data?._id }));
              }}
            />

            <SingleSelectDropdown
              listData={branchList}
              inputName="Client Branch"
              hideLabel={true}
              feildName="name"
              selectedOptionDependency={"_id"}
              addRoute={"../../../client/list"}
              selectedOption={selectedFilter?.branchId}
              handleClick={(data) => {
                handleChangeFilter("branchId", data?._id);
                setSelectedFilter((prev) => ({
                  ...prev,
                  clientId: prev?.clientId ?? "",
                  assignToUserId: [],
                }));
                setEmployeeFilter({
                  ...initialEmpFilter,
                });
                let req = {
                  clientMappedId: data?.clientMappedId ?? "",
                  clientBranchIds: [data?._id],
                };
                dispatch(DesignationClientListAction(req));
                dispatch(DepartmentClientListAction(req));
                handleGetEmployeeList(req);
              }}
            />
            <MultiSelectDropdown
              data={departmentList}
              FeildName="name"
              displayType
              Dependency={"_id"}
              InputName="Select Departments"
              selectedData={employeeFilters?.departmentIds}
              setSelectedData={setEmployeeFilter}
              setFieldName={"departmentIds"}
              hideLabel={true}
              disabled={!(selectedFilter?.branchId && selectedFilter?.clientId)}
              onClose={(didChange) => {
                if (
                  didChange &&
                  selectedFilter?.branchId &&
                  selectedFilter?.clientId
                ) {
                  let req = {
                    clientMappedId: selectedFilter?.clientId ?? "",
                    clientBranch: [selectedFilter?.branchId],
                    ...employeeFilters,
                  };
                  let body = removeEmptyStrings(req);
                  handleGetEmployeeList(body);
                }
              }}
            />
            <MultiSelectDropdown
              data={designationList}
              FeildName="name"
              displayType
              Dependency={"_id"}
              InputName="Select Designations"
              selectedData={employeeFilters?.designationIds}
              setSelectedData={setEmployeeFilter}
              setFieldName={"designationIds"}
              hideLabel={true}
              disabled={!(selectedFilter?.branchId && selectedFilter?.clientId)}
              onClose={(didChange) => {
                if (
                  didChange &&
                  selectedFilter?.branchId &&
                  selectedFilter?.clientId
                ) {
                  let req = {
                    clientMappedId: selectedFilter?.clientId ?? "",
                    clientBranch: [selectedFilter?.branchId],
                    ...employeeFilters,
                  };
                  handleGetEmployeeList({ ...req });
                }
              }}
            />
            <MultiSelectDropdown
              data={employeeList}
              FeildName="name"
              type="object"
              displayType
              Dependency={"_id"}
              InputName="Select Employee"
              selectedData={selectedFilter?.assignToUserId}
              setSelectedData={setSelectedFilter}
              setFieldName={"assignToUserId"}
              hideLabel={true}
              disabled={!selectedFilter?.branchId}
              // onClose={(didChange) => {
              //   if (didChange) {
              //     if (selectedFilter?.branchId) {
              //       handleGetBothData(selectedFilter);
              //     }
              //   }
              // }}
            />

            <div className="min-w-[140px] maxsm:w-full">
              <Input
                type="date"
                label="From Date"
                name="fromDate"
                className="font-manrope"
                value={selectedFilter?.fromDate}
                onChange={(e) => {
                  let { value, name } = e?.target;
                  handleChangeFilter(name, value);
                }}
              />
            </div>
            <div className="min-w-[140px] maxsm:w-full">
              <Input
                type="date"
                label="To Date"
                name="toDate"
                className="font-manrope"
                value={selectedFilter?.toDate}
                onChange={(e) => {
                  let { value, name } = e?.target;
                  handleChangeFilter(name, value);
                }}
              />
            </div>
            <MultiSelectRadio
              list={["All", "Active", "InActive"]}
              checked={selectedFilter?.category}
              onChange={(value) => {
                console.log("category", value);
                
                handleChangeFilter("category", value);
              }}
            />

            <div
              className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm"
              // size="sm"
              onClick={() => {
                handleGetBothData(selectedFilter);
              }}
            >
              Search
              <PiMagnifyingGlassBold className="w-4 h-4 cursor-pointer" />
            </div>
            <div
              className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm"
              // size="sm"
              onClick={() => {
                setSelectedFilter({ ...initialFilter });
              }}
            >
              Clear
              <PiXBold className="w-4 h-4 cursor-pointer" />
            </div>
            <div className="flex items-center gap-2">
              <IconButton
                className="bg-primary hover:bg-primaryLight hover:text-primary"
                size="sm"
                onClick={() => setIsFilterOpen(true)}
              >
                <IoFilter className="w-5 h-5" />
              </IconButton>
            </div>
          </div>
        </div>
        <BasicTaskTable
          hideAddTask={true}
          type="list"
          pageName={pageName}
          taskList={taskList}
          setTaskList={setTaskList}
          modules={modules?.current}
          projectList={projectData}
          selectedProject={selectedProject}
          onDataChange={(page, limit, name = "") => {
            handleGetBothData(selectedFilter, { page, limit });
          }}
        />
      </div>
    </Suspense>
  );
};

export default List;
