import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import YearMonthFilter from "../YearMonthFilter/YearMonthFilter";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction";
import { DesignationGetAction } from "../../redux/Action/Designation/DesignationAction";
import { EmployeeGetActionForFilter } from "../../redux/Action/Employee/EmployeeAction";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { PiMagnifyingGlassBold, PiXBold } from "react-icons/pi";
import { Button } from "@material-tailwind/react";
import DateStatusFilter from "../DateStatusFilter/DateStatusFilter";

const displayName = {
  org: { name: "Organization", moduleName: "suborganization" },
  employee: { name: "Employee", moduleName: "user" },
};

const MultiSelectFilter = ({
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

  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { branchList } = useSelector((state) => state?.branch);
  const { departmentList } = useSelector((state) => state?.department);
  const { designationList } = useSelector((state) => state?.designation);
  const { employeesFilters } = useSelector((state) => state?.employee);
  const { user } = useSelector((state) => state?.user);
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
    attendanceapprovals: 4,
  };

  const dropdownData = {
    org: {
      action: SubOrgListAction,
      getOnSelect: ["branch", "department", "designation", "employee"],
      multiselect: isOrgMulti,
      list: subOrgs,
    },
    branch: {
      action: BranchGetAction,
      getOnSelect: ["department", "designation", "employee"],
      list: branchList,
      multiselect: isBranchMulti,
      required: user?.modules?.["suborganization"]?.r ? "org" : "",
      reqbody: user?.modules?.["suborganization"]?.r ? ["orgIds"] : [],
    },
    department: {
      action: DepartmentGetAction,
      getOnSelect: ["designation", "employee"],
      list: departmentList,
      multiselect: isDepartmentMulti,
      required: "branch",
      reqbody: ["orgId"],
    },
    designation: {
      action: DesignationGetAction,
      getOnSelect: ["employee"],
      list: designationList,
      multiselect: isDesignationMulti,
      required: "branch",
      reqbody: ["orgId"],
    },
    employee: {
      action: EmployeeGetActionForFilter,
      getOnSelect: [],
      list: employeesFilters,
      multiselect: isEmployeeMulti,
      required: "branch",
      reqbody: ["orgId", "branchIds", "departmentIds", "designationIds"],
    },
    attendreport: {
      action: EmployeeGetActionForFilter,
      getOnSelect: [],
      list: employeesFilters,
      multiselect: isEmployeeMulti,
      required: "branch",
      reqbody: [
        "orgId",
        "branchIds",
        "departmentIds",
        "designationIds",
        "employeeIds",
      ],
    },
    attendancemonthreport: {
      action: EmployeeGetActionForFilter,
      getOnSelect: [],
      list: employeesFilters,
      multiselect: isEmployeeMulti,
      required: "branch",
      reqbody: [
        "orgId",
        "branchIds",
        "departmentIds",
        "designationIds",
        "employeeIds",
      ],
    },
    attendanceapprovals: {
      action: EmployeeGetActionForFilter,
      getOnSelect: [],
      list: employeesFilters,
      multiselect: isEmployeeMulti,
      required: "branch",
      reqbody: [
        "orgId",
        "branchIds",
        "departmentIds",
        "designationIds",
        "employeeIds",
        // "date",
        // "statusType",
      ],
    },
    roster: {
      action: EmployeeGetActionForFilter,
      getOnSelect: [],
      list: employeesFilters,
      multiselect: isEmployeeMulti,
      required: "branch",
      reqbody: [
        "orgId",
        "branchIds",
        "departmentIds",
        "designationIds",
        "employeeIds",
      ],
    },
  };

  const filterMap = {
    employee: ["org", "branch", "department", "designation", "employee"],
    designation: ["org", "branch", "department"],
    department: ["org", "branch"],
    branch: ["org"],
    client: ["org", "branch"],
    attendreport: [
      "org",
      "branch",
      "department",
      "designation",
      "employee",
      "year",
      "month",
    ],
    attendancemonthreport: [
      "org",
      "branch",
      "department",
      "designation",
      "employee",
      "year",
      "month",
    ],
    attendanceapprovals: [
      "org",
      "branch",
      "department",
      "designation",
      "employee",
      "date",
      "statusType",
    ],

    roster: ["org", "branch", "department", "designation", "employee"],
    holiday: ["year", "month", "status"],
    salary: ["org", "branch", "department", "designation"],
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
    console.log("handke =======================================", name, value);
    const field = `${name}Ids`;
    console.log("handke =======================================", field);
    let updated = {
      ...selectedFilters,
      [field]:
        name == "employee"
          ? dropdownData[name]?.multiselect
            ? value
            : [value] || ""
          : value,
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
          }
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

  // useEffect(() => {
  //   const stored = JSON.parse(localStorage.getItem(`${pageName}List`));

  //   console.log(stored, 'stored filters');
  //   if (stored) {
  //     const keys = ["org", "branch", "department", "designation", "employee","attendreport","attendancemonthreport","roster"];
  //     keys.forEach((key) => {
  //       const dropdownKey = `${key}Ids`;
  //       if (stored[dropdownKey] && dropdownData[key]) {
  //         console.log(key, stored[dropdownKey],dropdownData[key], 'stored key');
  //         const req = getReqBody(key, stored, key);
  //         console.log(req,'final Params')
  //         if(req?.orgIds)
  //         {
  //           req?.orgId = req?.orgIds;
  //           delete req.orgIds;
  //         }
  //         dispatch(dropdownData[key].action(req))
  //       }
  //     });

  //     setSelectedFilters(stored);
  //     setFiltersReady(true); // Wait until storage is loaded
  //   }
  // }, []);
  const loadFromStorage = async () => {
    try {
      const stored = localStorage.getItem(`${pageName}List`);
      if (stored) {
        const parsedStored = JSON.parse(stored);
        console.log(parsedStored, "found stored filters");

        // Set filters first to initialize state
        setSelectedFilters(parsedStored);

        const keys = [
          "org",
          "branch",
          "department",
          "designation",
          "employee",
          "attendreport",
          "attendancemonthreport",
          "attendanceapprovals",
          "roster",
        ];

        // Load data for stored filters sequentially to maintain hierarchy
        for (const key of keys) {
          const fieldKey = `${key}Ids`;
          if (parsedStored[fieldKey] && dropdownData[key]) {
            let req = getReqBody(key, parsedStored, key);

            try {
              if (key === "org" && req?.orgIds) {
                await dispatch(dropdownData[key].action({ orgId: req.orgIds }));
              } else if (key === "branch" && req?.orgIds) {
                await dispatch(
                  dropdownData[key].action({ subOrgId: req.orgIds })
                );
              } else {
                await dispatch(dropdownData[key].action(req));
              }
            } catch (error) {
              console.error(`Error loading ${key} data:`, error);
            }
          }
        }
      }

      setFiltersReady(true);
    } catch (error) {
      console.error("Error loading from storage:", error);
      setFiltersReady(true);
    }
  };

  useEffect(() => {
    // Initialize with empty filters if no storage
    if (!localStorage.getItem(`${pageName}List`)) {
      setFiltersReady(true);
    } else {
      loadFromStorage();
    }
  }, [pageName]);
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
  }, [filtersReady]);

  useEffect(() => {
    localStorage.setItem(`${pageName}List`, JSON.stringify(selectedFilters));
  }, [selectedFilters, pageName]);

  useEffect(() => {
    if (checkModules("suborganization", "r")) {
      dispatch(SubOrgListAction());
    } else {
      console.log("Suborganization module not enabled");
      dispatch(BranchGetAction({}));
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
        console.log(selectedFilters, "sel");
        return (
          <SingleSelectDropdown
            key={idx}
            selectedOption={
              dropdown === "employee"
                ? Array.isArray(selectedFilters?.employeeIds)
                  ? selectedFilters.employeeIds[0] || ""
                  : ""
                : selectedFilters?.[fieldName] || ""
            }
            listData={currentData.list}
            selectedOptionDependency="_id"
            feildName="name"
            isLoading={loadingState[dropdown]}
            inputName={getDisplayName(dropdown)}
            handleClick={(data) => {
              handleChange(dropdown, data?._id);
            }}
            hideLabel
          />
        );
      })}

      {["attendreport", "attendancemonthreport", "holiday"].includes(
        pageName
      ) && (
        <YearMonthFilter
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
          allowFutureMonths={pageName === "holiday"}
        />
      )}
      {["attendanceapprovals"].includes(pageName) && (
        <DateStatusFilter
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      )}

      {selectedPage.includes("status") && (
        <div className="w-40">
          <SingleSelectDropdown
            selectedOption={selectedFilters.status}
            inputName="Status"
            listData={[
              { id: "true", name: "Active" },
              { id: "false", name: "Inactive" },
            ]}
            selectedOptionDependency="id"
            feildName="name"
            handleClick={(selected) => {
              setSelectedFilters((prev) => ({
                ...prev,
                status: selected?.id,
              }));
            }}
            hideLabel
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {onSet && (
          <Button
            onClick={() => onSet(selectedFilters)}
            className="px-3 py-3 bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-xs flex gap-2 justify-between"
          >
            Search <PiMagnifyingGlassBold className="w-4 h-4" />
          </Button>
        )}

        <button
          onClick={() => {
            const emptyFilters = {};
            setSelectedFilters(emptyFilters);
            localStorage.removeItem(`${pageName}List`);
            if (onSet) {
              onSet(emptyFilters);
            }
          }}
          className="flex items-center gap-2 bg-popLight text-popfont-medium px-3 py-2 rounded-md text-sm hover:bg-popMedium"
        >
          Clear <PiXBold className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MultiSelectFilter;
