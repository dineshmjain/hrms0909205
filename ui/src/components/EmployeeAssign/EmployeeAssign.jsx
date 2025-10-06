import React, { useEffect, useRef, useState } from "react";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
import { useSelector } from "react-redux";
import Header from "../header/Header";
import Filter from "../Filter/Filter";
import Table from "../Table/Table";
import { useDispatch } from "react-redux";
import {
  EmployeeClientListAction,
  EployeeClientMappingAction,
  EployeeClientUnMappingAction,
} from "../../redux/Action/Employee/EmployeeAction";
import { useNavigate } from "react-router-dom";
import { Switch } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { clientBranchListAction, clientBranchRequirementAction } from "../../redux/Action/ClientBranch/ClientBranchAction";
import { clientListAction } from "../../redux/Action/Client/ClientAction";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import MultiSelectRadio from "../MultiSelectRadio/MultiSelectRadio";
import { changeMappingStatus } from "../../redux/reducer/EmployeeReducer";
import Filterbutton from "../Filter/Filterbutton";
import { removeEmptyStrings } from "../../constants/reusableFun";
import MultiSelectFilter from "../Filter/MultiSelectFilter";

const EmployeeAssign = ({ state }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    subOrgId: "",
    branchId: "",
    departmentId: "",
    designationId: "",
  });

  const { clientList } = useSelector((state) => state?.client);
  const { clientBranchList } = useSelector((state) => state?.clientBranch);
  const [showFilters, setShowFilters] = useState(true); // return true on greater than sm screen
  const {
    employeeList,
    loading,
    clientPageNo,
    clientTotalRecord,
    clientLimit,
  } = useSelector((state) => state?.employee);
  const [selectedClient, setSelectedClient] = useState({
    clientMappedId: state?._id || "",
    clientBranchIds: [],
    category: "all",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const editButton = (user) => {
    navigate("../../../user/edit?tab=Official", { state: user });
  };

  const handleAssignEmp = (e, data) => {
    if (!selectedClient?.clientMappedId) return toast.error("Select Client!");
    let reqbody = {
      clientMappedId: [selectedClient?.clientMappedId],
      id: data?._id,
      clientBranchIds: selectedClient?.clientBranchIds,
    };

    let isAssign = !data?.clientAssigned;
    let action = isAssign
      ? EployeeClientMappingAction
      : EployeeClientUnMappingAction;

    let promise = dispatch(action(reqbody))?.then(({ payload }) => {
      if (payload?.status == 200) {
        dispatch(changeMappingStatus({ id: data?._id, isActive: isAssign }));
      } else {
        // throw an error to trigger toast's error state
        throw new Error(payload?.message || "Unknown error");
      }
    });

    toast.promise(promise, {
      loading: `Updating employee data...`,
      success: `Employee ${isAssign ? "Mapped" : "Un-Mapped"}!`,
      error: (error) => {
        return `Failed to ${isAssign ? "Map" : "Un-Map"} employee. `;
      },
    });
  };

  const labels = {
    firstName: {
      DisplayName: "Name",
      type: "object",
      objectName: "name",
    },
    lastName: {
      DisplayName: "Surname",
      type: "object",
      objectName: "name",
    },
    assign: {
      DisplayName: "Assigned",
      type: "function",
      data: (data, idx) => (
        <Switch
          circleProps={{ className: "ml-5" }}
          checked={data?.clientAssigned}
          color="green"
          disabled={loading}
          onChange={(e) => {
            e.stopPropagation();
            handleAssignEmp(e, data);
          }}
        />
      ),
    },
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
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  useEffect(()=>{
getClientRequirements()
  },[selectedClient])

  const getClientRequirements =async()=>{
    const params ={
      clientMappedId:selectedClient?.clientMappedId,
      branchId:selectedClient?.clientBranchIds
    }
    dispatch(clientBranchRequirementAction({...params}))

  }

  const getEmployeeList = (paginationData = {}, silent = false) => {
    if (
      !selectedClient?.clientMappedId ||
      selectedClient?.clientBranchIds?.length == 0
    ) {
      return;
    }
    const filters = removeEmptyStrings({ ...selectedFilters });
    const action = EmployeeClientListAction({
      ...paginationData,
      ...filters,
      ...selectedClient,
    });

    if (silent) {
      return dispatch(action);
    }

    const promise = dispatch(action);

    toast.promise(promise, {
      loading: "Loading employees...",
      success: "Employee list updated!",
      error: "Failed to load employees.",
    });

    return promise;
  };

  const handleChange = (name, value) => {
    setSelectedClient((prev) => {
      return { ...prev, [name]: value };
    });
  };
useEffect(() => {
  const debounceTimeout = setTimeout(() => {
    getEmployeeList({ page: 1, limit: 10 });
  }, 400);
  return () => clearTimeout(debounceTimeout);
}, [
  JSON.stringify({
    branchIds: selectedClient?.clientBranchIds,
    category: selectedClient?.category,
    filters: selectedFilters,
  }),
]);

  const getClientBranch = (clientId) => {
    dispatch(clientBranchListAction({ clientMappedId: clientId }));
  };

  useEffect(() => {
    if (state?._id) {
      return getClientBranch(state?._id);
    }
    dispatch(clientListAction({})).then(({ payload }) => {
      if (payload?.data?.length) {
        handleChange("clientMappedId", payload?.data?.[0]?._id);
        getClientBranch(payload?.data?.[0]?._id);
      }
    });
  }, [state]);

  return (
    <>
      <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
        <Header
          headerLabel={
            "Assign Employees to " +
            (state?.name ? `${state?.name}` : "Client Branch")
          }
          subHeaderLabel={
            `Overview Of Your ` +
            (state?.name ? `${state?.name}` : "Client Branch")
          }
          isButton={false}
        />
        <div className="flex  flex-col ">
          <div className="bg-white rounded-md px-4 py-2">
            <div className="flex flex-col gap-2 bg-white ">
              {/* <span className="font-semibold text-gray-700 text-md">
              Select Client and Branch{" "}
            </span> */}
              <div className="text-gray-700 font-semibold mb-2 mt-0 text-[14px] ">
                Select Client and Branch
              </div>
              <div className="flex gap-4  items-center flex-wrap">
                <SingleSelectDropdown
                  selectedOption={selectedClient?.clientMappedId}
                  listData={clientList}
                  selectedOptionDependency={"_id"}
                  feildName="name"
                  inputName="Client"
                  disabled={state?._id}
                  handleClick={(data) => {
                    setSelectedClient((prev) => {
                      return {
                        category: "all",
                        clientMappedId: data?._id,
                        clientBranchIds: [],
                      };
                    });
                    getClientBranch(data?._id);
                  }}
                  hideLabel
                />
               <SingleSelectDropdown
                  listData={clientBranchList}
                  selectedOption={selectedClient?.clientBranchIds[0]}
                  selectedOptionDependency={"_id"}
                  feildName="name"
                  InputName={"Client Branch"}
                  handleClick={(data) => {
                    setSelectedClient((prev) => {
                      return {
                       ...prev,
                        clientBranchIds:[...prev.clientBranchIds,data?._id],
                      };
                    });
                   
                  }}
                  // setFieldName={"clientBranchIds"}
                  // setSelectedData={setSelectedClient}
                  hideLabel
                />
                <div className="flex items-center self-center justify-start ">
                  {["all", "assigned", "unassigned"].map((value, idx) => {
                    let rounded =
                      idx == 0
                        ? "rounded-s-lg"
                        : idx == 2
                        ? "rounded-e-lg"
                        : "";
                    return (
                      <div key={idx} className="w-full ">
                        <input
                          type="radio"
                          name="tab"
                          id={value}
                          value={value}
                          checked={selectedClient?.category === value}
                          onChange={() =>
                            setSelectedClient((prev) => {
                              return {
                                ...prev,
                                category: value,
                              };
                            })
                          }
                          className="hidden peer"
                        />
                        <label
                          htmlFor={value}
                          className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-400 
        hover:bg-gray-300  peer-checked:bg-primaryLight cursor-pointer peer-checked:text-pop 
          capitalize ${rounded}`}
                        >
                          {value}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="text-gray-700 font-semibold  mt-0 text-[14px] mb-1">
                Employee Filters
              </div>
              <Filterbutton
                setShowFilters={setShowFilters}
                showFilters={showFilters}
              />
            </div>
            <MultiSelectFilter
              pageName={"employee"}
              name="mapEmployee"
              setSelectedFilters={setSelectedFilters}
              showFilters={showFilters}
              // onSet={() => {
              //   getEmployeeList({ page: 1, limit: 10 });
              // }}
              selectedFilters={selectedFilters}
            />
          </div>
          <div className="flex gap-2  py-4 flex-col">
            <Table
              tableJson={
                selectedClient?.clientBranchIds?.length ? employeeList : []
              }
              labels={labels}
              isLoading={loading}
              paginationProps={{
                totalRecord: clientTotalRecord,
                pageNo: clientPageNo,
                limit: clientLimit,
                onDataChange: (page, limit, name = "") => {
                  getEmployeeList({ page, limit });
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeAssign;
