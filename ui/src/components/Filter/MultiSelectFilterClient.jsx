import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import YearMonthFilter from "../YearMonthFilter/YearMonthFilter";
import {
  SubOrgListAction,
} from "../../redux/Action/SubOrgAction/SubOrgAction";
import {
  BranchGetAction,
} from "../../redux/Action/Branch/BranchAction";
import {
  DepartmentGetAction,
} from "../../redux/Action/Department/DepartmentAction";
import {
  DesignationGetAction,
} from "../../redux/Action/Designation/DesignationAction";
import {
  EmployeeClientListAction,
  EmployeeGetActionForFilter,
} from "../../redux/Action/Employee/EmployeeAction";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { PiMagnifyingGlassBold, PiXBold } from "react-icons/pi";
import { clientDepartmentAction, clientDesignationAction, clientListAction } from "../../redux/Action/Client/ClientAction";
import { clientBranchListAction } from "../../redux/Action/ClientBranch/ClientBranchAction";

const displayName = {
  org: { name: "Organization", moduleName: "suborganization" },
  employee: { name: "Employee", moduleName: "user" },
};

const MultiSelectFilterClient = ({
  pageName,
  selectedFilters,
  setSelectedFilters,
  showFilters = true,
  onSet,
  isOrgMulti = false,
  isBranchMulti = true,
  isDepartmentMulti = true,
  isDesignationMulti = true,
  isEmployeeMulti = true,
}) => {
  const dispatch = useDispatch();
  const checkModules = useCheckEnabledModule();
  const initialData = useRef(selectedFilters);

 const { clientList = [], clientDepartments = [], clientDesignations = [] } = useSelector(state => state.client || {});
  const { clientBranchList = [] } = useSelector(state => state.clientBranch || {});
  const { employeeList } = useSelector(state => state.employee || {})

  const hierarchyLevels = {
    org: 0,
    branch: 1,
    department: 2,
    designation: 3,
    employee: 4,
    client: 4,
    attendreport: 4,
    attendancemonthreport: 4,
    roster: 4,
  };

  const dropdownData = {
    org: {
      action: clientListAction,
      getOnSelect: ["branch", "department", "designation"],
      multiselect: isOrgMulti,
      list: clientList,
    },
    branch: {
      action: clientBranchListAction,
      getOnSelect: ["department", "designation", "employee"],
      list: clientBranchList,
      multiselect: isBranchMulti,
      required: "org",
      reqbody: ["clientId","clientMappedId"],
    },
    department: {
      action: clientDepartmentAction,
      getOnSelect: ["branch"],
      list: clientDepartments,
      multiselect: isDepartmentMulti,
      required: "branch",
     reqbody: ["clientId","clientMappedId"],
    },
    designation: {
      action: clientDesignationAction,
      getOnSelect: ["branch","department"],
      list: clientDesignations,
      multiselect: isDesignationMulti,
      required: "branch",
      reqbody: ["clientId","clientMappedId"],
    },

    roster: {
      action: EmployeeClientListAction,
      getOnSelect: [],
      list: employeeList,
      multiselect: isEmployeeMulti,
      required: "branch",
      reqbody: ["clientId","clientMappedId","branchIds","departmentIds","designationIds"],
    },
    
  };

  const filterMap = {

    roster: ["clientId","clientMappedId","branchIds","departmentIds","designationIds"],
  };

  const getModuleName = (key) => displayName?.[key]?.moduleName ?? key;
  const getDisplayName = (key) => displayName?.[key]?.name ?? key;

  const getReqBody = (dropdown, filters, trigger) => {
    const req = {};
    dropdownData[dropdown]?.reqbody?.forEach((key) => {
      if (filters[key]) req[key] = filters[key];
    });
    if (trigger === "org") req.orgIds = filters?.orgIds;
    return req;
  };

  const getReverseDependencies = (changedField) => {
    return Object.entries(dropdownData)
      .filter(([_, config]) => config.getOnSelect?.includes(changedField))
      .map(([key]) => key);
  };

    const handleChange = (name, value) => {

    console.log("handke =======================================", name, value)
    const field = `${name}Ids`;
    console.log("handke =======================================", field)
    let updated = {
      ...selectedFilters,
      [field]: name =='employee'?dropdownData[name]?.multiselect ? value : [value] || "" :value,
    };


    // Clear dependents of this dropdown
    dropdownData[name]?.getOnSelect?.forEach((dep) => {
      updated[`${dep}Ids`] = "";
    });

    // 💡 Also clear employee if dependencies change
    if (["branch", "department", "designation"].includes(name)) {
      updated["employeeIds"] = "";
    }

    // Get reverse dependents (e.g., employee depends on department, etc.)
    const reverseDeps = getReverseDependencies(name);
    const allToTrigger = new Set([
      ...(dropdownData[name]?.getOnSelect || []),
      ...reverseDeps,
    ]);

    // Set loading state
    const newLoading = {};
    allToTrigger.forEach((dep) => {
      newLoading[dep] = true;
    });
    setLoadingState((prev) => ({ ...prev, ...newLoading }));

    // Dispatch actions and stop loading
    allToTrigger.forEach((dep) => {
      const req = getReqBody(dep, updated, name);
      console.log(dep, req, dropdownData, "dispatch");
      if (["org"].includes(name) && dep == "branch") {
        dispatch(dropdownData[dep].action({ subOrgId: req?.orgIds })).finally(
          () => {
            setLoadingState((prev) => ({ ...prev, [dep]: false }));
          },
        );
        console.log(req, "hell");
      } else {
        dispatch(dropdownData[dep].action(req)).finally(() => {
          setLoadingState((prev) => ({ ...prev, [dep]: false }));
        });
      }
    });

    setSelectedFilters(updated);
  };
  
  const [loadingState, setLoadingState] = React.useState({});
  const [filtersReady, setFiltersReady] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`${pageName}List`));

    console.log(stored, 'stored filters');
    if (stored) {
      const keys = ["org", "branch", "department", "designation", "employee","attendreport","attendancemonthreport","roster"];
      keys.forEach((key) => {
        const dropdownKey = `${key}Ids`;
        if (stored[dropdownKey] && dropdownData[key]) {
          const req = getReqBody(key, stored, key);
          console.log(req,'final Params')
          
          dispatch(dropdownData[key].action(req),'final Params')
        }
      });
  
      setSelectedFilters(stored);
      setFiltersReady(true); // Wait until storage is loaded
    }
  }, []);

  const triggerDropdownAPIs = (name, updatedFilters) => {
    const currentPageLevel = hierarchyLevels[pageName];
    dropdownData?.[name]?.getOnSelect?.forEach((dropdown) => {
      const dropdownLevel = hierarchyLevels[dropdown];
      // Only fetch if dropdown is ABOVE current page level
      if (dropdownLevel <= currentPageLevel) {
        const reqBody = getReqBody(dropdown, updatedFilters, name);
        dispatch(dropdownData?.[dropdown]?.action(reqBody));
      }
    });
  };
  useEffect(() => {
    if (filtersReady && onSet) {
      onSet(selectedFilters);
    }
  }, [filtersReady,]);
  
  

  useEffect(() => {
    localStorage.setItem(`${pageName}List`, JSON.stringify(selectedFilters));
  }, [selectedFilters, pageName]);

  useEffect(() => {
    if (checkModules("suborganization", "r")) {
      dispatch(SubOrgListAction());
    } else {
      dispatch(BranchGetAction());
    }
  }, []);

  const selectedPage = filterMap[pageName];
  if (!selectedPage) return null;
 

  return (
    <div
      className={`transition-all duration-300 ease-in-out max-h-0 ${
        showFilters ? "max-h-[1000px]" : "overflow-hidden"
      } flex flex-wrap gap-4 items-start`}
    >
      {selectedPage.map((dropdown, idx) => {
        const moduleName = getModuleName(dropdown);
        if (!checkModules(moduleName, "r")) return null;

        const currentData = dropdownData[dropdown];
        const fieldName = `${dropdown}Ids`;

        if (currentData?.multiselect) {
          return (
            <MultiSelectDropdown
              key={idx}
              selectedData={selectedFilters?.[fieldName]}
              data={currentData.list}
              Dependency="_id"
              FeildName="name"
              isLoading={loadingState[dropdown]}
              type={dropdown === "employee" ? "object" : null}
              InputName={getDisplayName(dropdown)}
              setSelectedData={setSelectedFilters}
              setFieldName={fieldName}
              onClose={(wasChanged) => {
                if (wasChanged) {
                  setTimeout(() => {
                    handleChange(dropdown, selectedFilters?.[fieldName] || []);
                  }, 300);
                }
              }}
              hideLabel
            />
          );
        }

        return (
          <SingleSelectDropdown
            key={idx}
            selectedOption={selectedFilters?.[fieldName]}
            listData={currentData.list}
            selectedOptionDependency="_id"
            feildName="name"
            isLoading={loadingState[dropdown]}
            inputName={
              dropdown === "employee"
                ? "mergedName"
                : getDisplayName(dropdown)
            }
            handleClick={(data) => {
              handleChange(dropdown, data?._id);
            }}
            hideLabel
          />
        );
      })}

      {(pageName === "attendreport" || pageName === "attendancemonthreport") && (
        <div className="flex w-auto">
          <YearMonthFilter
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {onSet && (
          <button
            onClick={() => onSet(selectedFilters)}
            className="flex items-center gap-2 bg-primary text-white px-3 py-2 rounded-md text-sm hover:bg-popMedium"
          >
            Search <PiMagnifyingGlassBold className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setSelectedFilters({ ...initialData.current })}
          className="flex items-center gap-2 bg-popLight text-popfont-medium px-3 py-2 rounded-md text-sm hover:bg-popMedium"
        >
          Clear <PiXBold className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MultiSelectFilterClient;
