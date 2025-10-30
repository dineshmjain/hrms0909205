// import React, { useEffect, useRef, useState } from "react";
// import { useDispatch } from "react-redux";
// import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
// // import {
// //   BranchGetApi,
// //   subOrgListApi,
// //   EmployeeListApi,
// //   DepartmentGetApi,
// //   DesignationListApi,
// // } from '../../apis';

// import { PiMagnifyingGlassBold, PiXBold } from "react-icons/pi";
// import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
// import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
// import YearMonthFilter from "../YearMonthFilter/YearMonthFilter";
// import { removeEmptyStrings } from "../../constants/reusableFun";
// import { BranchGetApi } from "../../apis/Branch/Branch";
// import { subOrgListApi } from "../../apis/Organization/Organization";
// import { EmployeeListApi } from "../../apis/Employee/Employee";
// import { DepartmentGetApi } from "../../apis/Department/Department";
// import { DesignationListApi } from "../../apis/Designation/Designation";
// import { Button } from "@material-tailwind/react";
// import { useSelector } from "react-redux";

// const Filter = ({
//   pageName,
//   selectedFilters,
//   setSelectedFilters,
//   showFilters = true,
//   onSet,
//   employeFilterType = "multiple",
// }) => {
//   const checkModules = useCheckEnabledModule();
//   const dispatch = useDispatch();
//   useEffect(() => {
//     let data = localStorage.getItem(`${pageName}List`);

//     data = JSON?.parse(data);
//     if (data) {
//       // get all the selected data
//       Object.keys(data).forEach((key) => {
//         const name = key.replace(/Id$/, "");

//         console.log(data, "========================name recived");
//         if (dropdownData[name]) {
//           triggerDropdownAPIs(name, data);
//         }
//       });
//     }
//   }, []);
//     const getReqBody = (dropdown, updatedFilters, triggeringDropdown) => {
//     const reqBody = {};

//     // Skip for branch, or apply custom values for others
//     if (dropdown !== "branch") {
//       reqBody.category = "assigned";
//       reqBody.mapedData = dropdown;
//     }

//     // Add dependency values dynamically
//     dropdownData?.[dropdown]?.reqbody?.forEach((key) => {
//       if (updatedFilters[key]) {
//         reqBody[key] = updatedFilters[key];
//       }
//     });

//     // Include subOrgId only if subOrg is the triggering dropdown
//     if (triggeringDropdown === "subOrg") {
//       reqBody.subOrgId = updatedFilters?.subOrgId;
//     }

//     return reqBody;
//   };

//     const triggerDropdownAPIs = (name, updatedFilters) => {

//     const currentPageLevel = hierarchyLevels[pageName];
// console.log(currentPageLevel)
//     dropdownData?.[name]?.getOnSelect?.forEach((dropdown) => {
//       const dropdownLevel = hierarchyLevels[dropdown];
//       // Only fetch if dropdown is ABOVE current page level
//       if (dropdownLevel < currentPageLevel) {
//         const reqBody = getReqBody(dropdown, updatedFilters, name);
// console.log(reqBody,)
//         // dispatch(dropdownData?.[dropdown]?.action(reqBody));
//       }
//     });
//   };

//   useEffect(() => {
//     let data = JSON.stringify(selectedFilters);
//     localStorage.setItem(`${pageName}List`, data);
//   }, [selectedFilters]);
//   const displayName = {
//     subOrg: { name: "Organization", moduleName: "suborganization" },
//     user: { name: "Employee", moduleName: "user" },
//   };

//   const filterData = useRef({
//     employee: ["subOrg", "branch", "department", "designation", "user"],
//     designation: ["subOrg", "branch", "department"],
//     department: ["subOrg", "branch"],
//     branch: ["subOrg"],
//     client: ["subOrg", "branch"],
//     attendancereport: ["subOrg", "branch", "department", "designation", "user"],
//   });

//   const selectedPage = filterData.current?.[pageName];

//   const [branchList, setBranchList] = useState([]);
//   const [orgList, setOrgList] = useState([]);
//   const [departmentList, setDepartmentList] = useState([]);
//   const [designationList, setDesignationList] = useState([]);
//   const [employeeList, setEmployeeList] = useState([]);

//   const [subOrgId, setSubOrgId] = useState("");
//   const [branchIds, setBranchIds] = useState([]);
//   const [departmentIds, setDepartmentIds] = useState([]);
//   const [designationIds, setDesignationIds] = useState([]);
//   const [employeeIds, setEmployeeIds] = useState([]);
//   const { user } = useSelector((state) => state?.user)
//   const initialData = useRef(selectedFilters);
//   const formattedEmployeeList = employeeList.map((emp) => ({
//     ...emp,
//     label: `${emp?.name?.firstName || ""} ${emp?.name?.lastName || ""}`.trim(),
//   }));

//   useEffect(() => {
//     if (checkModules("suborganization", "r")) {
//       fetchSubOrgs();
//     } else {
//       fetchBranches();
//     }
//   }, []);

//   useEffect(() => {
//     if (subOrgId) fetchBranches();
//   }, [subOrgId]);

//   useEffect(() => {
//     if (branchIds?.length) {
//       fetchDepartments();
//       fetchDesignations();
//     }
//   }, [branchIds]);

//   useEffect(() => {
//     fetchEmployees();
//   }, [subOrgId, branchIds, departmentIds, designationIds]);

//   // useEffect(() => {
//   //   const filt = removeEmptyStrings({
//   //     orgIds: subOrgId ? [subOrgId] : [],
//   //     branchIds,
//   //     departmentIds,
//   //     designationIds,
//   //     employeeIds,
//   //   });
//   //   // setSelectedFilters(filt);
//   //   setSelectedFilters((prev) => ({
//   //     ...prev, // preserve year, month, page, etc.
//   //     ...filt, // update orgIds, branchIds, etc.
//   //   }));
//   // }, [subOrgId, branchIds, departmentIds, designationIds, employeeIds]);
//   useEffect(() => {
//     const filt = {
//       orgIds: subOrgId ? [subOrgId] : [],
//       branchIds,
//       departmentIds,
//       designationIds,

//       employeeIds: employeeIds?.length > 0 ? employeeIds : [],
//     };

//     const cleanFilt = Object.entries(filt).reduce((acc, [key, value]) => {
//       if (Array.isArray(value)) {
//         acc[key] = value; // always assign arrays, even if empty
//       } else if (value) {
//         acc[key] = value;
//       }
//       return acc;
//     }, {});

//     setSelectedFilters((prev) => ({
//       ...prev,
//       ...cleanFilt,
//     }));
//   }, [subOrgId, branchIds, departmentIds, designationIds, employeeIds]);

//   console.log(selectedFilters);

//   const fetchBranches = async () => {
//     try {
//       const params = checkModules("suborganization", "r") ? { subOrgId } : {};
//       const response = await BranchGetApi(params);
//       setBranchList(response?.data || []);
//     } catch (error) {
//       console.error("Error fetching branches", error);
//     }
//   };

//   // const fetchSubOrgs = async () => {
//   //   try {
//   //     const response = await subOrgListApi();
//   //     setOrgList(response?.data || []);
//   //   } catch (error) {
//   //     console.error("Error fetching sub orgs", error);
//   //   }
//   // };
//   const fetchSubOrgs = async () => {
//     try {
//       const response = await subOrgListApi();
//       const orgList = response?.data || [];
//       setOrgList(orgList);

//       //  Apply default subOrgId only for attendancereport page
//       if (pageName === "attendancereport" && orgList.length > 0 && !subOrgId) {
//         const defaultId = orgList[0]?._id;
//         setSubOrgId(defaultId);
//       }
//     } catch (error) {
//       console.error("Error fetching sub orgs", error);
//     }
//   };

//   const fetchEmployees = async () => {
//     try {
//       const params = {
//         orgIds: subOrgId !== "" ? [subOrgId] : [],
//         branchIds,
//         departmentIds,
//         designationIds,
//         params: ["name"],
//       };
//       const response = await EmployeeListApi(params);
//       setEmployeeList(response?.data || []);
//       if (employeFilterType === "single" && response?.data?.length > 0) {
//         // setEmployeeIds([response.data[0]._id]); // Set first employee as default for single selection
//       } else {
//         setEmployeeIds([]);
//       }
//     } catch (error) {
//       console.error("Error fetching employees", error);
//     }
//   };

//   const fetchDepartments = async () => {
//     try {
//       const response = await DepartmentGetApi();
//       setDepartmentList(response?.data || []);
//       setEmployeeIds([]);
//     } catch (error) {
//       console.error("Error fetching departments", error);
//     }
//   };

//   const fetchDesignations = async () => {
//     try {
//       const response = await DesignationListApi();
//       setDesignationList(response?.data || []);
//       setEmployeeIds([]);
//     } catch (error) {
//       console.error("Error fetching designations", error);
//     }
//   };

//   const handleReset = () => {
//     setSubOrgId("");
//     setBranchIds([]);
//     setDepartmentIds([]);
//     setDesignationIds([]);
//     setEmployeeIds([]);
//     setSelectedFilters({ ...initialData.current });
//   };
//   useEffect(() => {
//     if (selectedFilters.employeeIds?.length) {
//       setEmployeeIds(selectedFilters.employeeIds);
//     }
//   }, [selectedFilters.employeeIds]);

//   if (!selectedPage) return null;

//   return (
//     <div>
//       {showFilters && (
//         <div className="transition-all duration-300 ease-in-out flex flex-wrap items-end gap-4">
//           {/* Sub Organization */}
//           {selectedPage.includes("subOrg") && user?.modules['suborganization'].r &&(
//             <SingleSelectDropdown
//               inputName="Organization"
//               hideLabel
//               listData={orgList}
//               selectedOption={subOrgId}
//               selectedOptionDependency="_id"
//               handleClick={(sel) => setSubOrgId(sel?._id || "")}
//             />
//           )}

//           {/* Branch */}
//           {selectedPage.includes("branch") && (
//             <MultiSelectDropdown
//               FeildName="name"
//               InputName="Branch"
//               Dependency="_id"
//               hideLabel
//               data={branchList}
//               selectedData={branchIds}
//               setSelectedData={setBranchIds}
//             />
//           )}

//           {/* Department */}
//           {selectedPage.includes("department") && (
//             <MultiSelectDropdown
//               FeildName="name"
//               InputName="Department"
//               Dependency="_id"
//               hideLabel
//               data={departmentList}
//               selectedData={departmentIds}
//               setSelectedData={setDepartmentIds}
//             />
//           )}

//           {/* Designation */}
//           {selectedPage.includes("designation") && (
//             <MultiSelectDropdown
//               FeildName="name"
//               InputName="Designation"
//               Dependency="_id"
//               hideLabel
//               data={designationList}
//               selectedData={designationIds}
//               setSelectedData={setDesignationIds}
//             />
//           )}

//           {/* Employee */}
//           {selectedPage.includes("user") && (
//             // <MultiSelectDropdown
//             //   FeildName="name"
//             //   InputName="Employees"
//             //   Dependency="_id"
//             //   hideLabel
//             //   data={employeeList}
//             //   selectedData={employeeIds}
//             //   setSelectedData={setEmployeeIds}
//             //   type="object"
//             //   selectType={employeFilterType}
//             // />
//             <MultiSelectDropdown
//               FeildName="name"
//               InputName="Employees"
//               Dependency="_id"
//               hideLabel
//               data={employeeList}
//               selectedData={
//                 employeFilterType === "single"
//                   ? employeeIds[0] || "" // for single selection, use first element or empty string
//                   : employeeIds
//               }
//               setSelectedData={
//                 employeFilterType === "single"
//                   ? (id) => setEmployeeIds(id ? [id] : []) // wrap in array to keep employeeIds as array
//                   : setEmployeeIds
//               }
//               type="object"
//               selectType={employeFilterType}
//             />
//           )}

//           {/* YearMonth Filter */}
//           {pageName === "attendancereport" && (
//             <div className="flex w-auto">
//               <YearMonthFilter
//                 selectedFilters={selectedFilters}
//                 setSelectedFilters={setSelectedFilters}
//               />
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex gap-2 ">
//             {onSet && (
//               // <button
//               //   className="flex items-center gap-1 bg-primary text-white px-3 py-2 rounded-md hover:bg-popMedium transition-all duration-200 text-sm"
//               //   onClick={() => onSet(selectedFilters)}
//               // >
//               //   Search
//               //   <PiMagnifyingGlassBold className="w-4 h-4" />
//               // </button>

//               <Button
//                 onClick={() => onSet(selectedFilters)}
//                 size="md"
//                 className="bg-primary hover:bg-popMedium transition-all duration-200 text-xs flex gap-2 justify-between"
//               >
//                 Search <PiMagnifyingGlassBold className="w-4 h-4" />
//               </Button>
//             )}
//             <Button
//               onClick={() => handleReset(selectedFilters)}
//               size="md"
//               className="bg-popLight hover:bg-popMedium transition-all rounded-md duration-200 text-xs flex gap-2 justify-between text-popfont-medium"
//             >
//               Clear <PiXBold className="w-4 h-4" />
//             </Button>
//             {/* <button
//           className="flex items-center gap-1 bg-popLight text-popfont-medium px-3 py-2 rounded-md hover:bg-popMedium transition-all duration-200 text-sm"
//           onClick={handleReset}
//         >
//           Clear
//           <PiXBold className="w-4 h-4" />
//         </button> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Filter;
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PiMagnifyingGlassBold, PiXBold } from "react-icons/pi";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import YearMonthFilter from "../YearMonthFilter/YearMonthFilter";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import { BranchGetApi } from "../../apis/Branch/Branch";
import { subOrgListApi } from "../../apis/Organization/Organization";
import { EmployeeListApi } from "../../apis/Employee/Employee";
import { DepartmentGetApi } from "../../apis/Department/Department";
import { DesignationListApi } from "../../apis/Designation/Designation";
import { Button, Input } from "@material-tailwind/react";
import { data } from "autoprefixer";

// Dummy placeholders for dropdownData and hierarchyLevels
const dropdownData = {
  subOrg: {
    getOnSelect: ["branch", "department"],
    reqbody: [],
    action: () => {}, // Your real async action
  },
  branch: {
    getOnSelect: ["department", "designation"],
    reqbody: ["subOrgId"],
    action: () => {}, // Your real async action
  },
};

const hierarchyLevels = {
  subOrg: 1,
  branch: 2,
  department: 3,
  designation: 4,
  user: 5,
  attendancereport: 6,
};

const Filter = ({
  pageName,
  selectedFilters,
  setSelectedFilters,
  showFilters = true,
  onSet,

  employeFilterType = "multiple",
}) => {
  const checkModules = useCheckEnabledModule();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state?.user);
  const initialData = useRef(selectedFilters);

  const filterData = useRef({
    employee: ["subOrg", "branch", "department", "designation", "user"],
    designation: ["subOrg", "branch", "department"],
    department: ["subOrg", "branch"],
    branch: ["subOrg"],
    client: ["subOrg", "branch"],
    attendancereport: ["subOrg", "branch", "department", "designation", "user"],
    leave: ["subOrg", "branch", "department"],
    leavehistory: ["subOrg", "branch", "department", "designation", "user"],
  });

  const selectedPage = filterData.current?.[pageName];

  const [branchList, setBranchList] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);

  const [subOrgId, setSubOrgId] = useState("");
  const [branchIds, setBranchIds] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [designationIds, setDesignationIds] = useState([]);
  const [employeeIds, setEmployeeIds] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const formattedEmployeeList = employeeList.map((emp) => ({
    ...emp,
    label: `${emp?.name?.firstName || ""} ${emp?.name?.lastName || ""}`.trim(),
  }));

  // Restore filters from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${pageName}List`);
    if (saved) {
      const parsed = JSON.parse(saved);
      console.log(
        parsed,
        selectedFilters,
        "========================saved filters"
      );
      Object.keys(parsed).forEach((key) => {
        const name = key.replace(/Id$/, "");
        if (dropdownData[name]) {
          triggerDropdownAPIs(name, parsed);
        }
      });
    }
  }, []);

  // Save filters to localStorage
  useEffect(() => {
    localStorage.setItem(`${pageName}List`, JSON.stringify(selectedFilters));
  }, [selectedFilters]);

  useEffect(() => {
    if (checkModules("suborganization", "r")) {
      fetchSubOrgs();
    } else {
      fetchBranches();
    }
  }, []);

  useEffect(() => {
    if (subOrgId) fetchBranches();
  }, [subOrgId]);

  useEffect(() => {
    if (branchIds?.length) {
      fetchDepartments();
      fetchDesignations();
    }
  }, [branchIds]);

  useEffect(() => {
    fetchEmployees();
  }, [subOrgId, branchIds, departmentIds, designationIds]);

  useEffect(() => {
    const filt = {
      orgIds: subOrgId ? [subOrgId] : [],
      branchIds,
      departmentIds,
      designationIds,
      employeeIds: employeeIds?.length > 0 ? employeeIds : [],
      fromDate, // always include
      toDate,
    };

    const cleanFilt = Object.entries(filt).reduce((acc, [key, value]) => {
      if (Array.isArray(value)) acc[key] = value;
      else if (value) acc[key] = value;
      return acc;
    }, {});

    setSelectedFilters((prev) => ({ ...prev, ...cleanFilt }));
  }, [
    subOrgId,
    branchIds,
    departmentIds,
    designationIds,
    employeeIds,
    fromDate,
    toDate,
  ]);

  const triggerDropdownAPIs = (name, updatedFilters) => {
    const currentPageLevel = hierarchyLevels[pageName];
    dropdownData?.[name]?.getOnSelect?.forEach((dropdown) => {
      const dropdownLevel = hierarchyLevels[dropdown];
      if (dropdownLevel < currentPageLevel) {
        const reqBody = getReqBody(dropdown, updatedFilters, name);
        console.log(
          dropdownData?.[dropdown]?.action(reqBody),
          "=====================******************************Request body for dropdown API"
        );
        // dispatch(dropdownData?.[dropdown]?.action(reqBody));
      }
    });
  };

  const getReqBody = (dropdown, updatedFilters, triggeringDropdown) => {
    const reqBody =
      dropdown !== "branch"
        ? { category: "assigned", mapedData: dropdown }
        : {};
    dropdownData?.[dropdown]?.reqbody?.forEach((key) => {
      if (updatedFilters[key]) reqBody[key] = updatedFilters[key];
    });
    if (triggeringDropdown === "subOrg")
      reqBody.subOrgId = updatedFilters?.subOrgId;
    return reqBody;
  };

  const fetchBranches = async () => {
    try {
      const params = checkModules("suborganization", "r") ? { subOrgId } : {};
      const response = await BranchGetApi(params);
      setBranchList(response?.data || []);
    } catch (error) {
      console.error("Error fetching branches", error);
    }
  };

  const fetchSubOrgs = async () => {
    try {
      const response = await subOrgListApi();
      const orgList = response?.data || [];
      setOrgList(orgList);
      if (pageName === "attendancereport" && orgList.length > 0 && !subOrgId) {
        setSubOrgId(orgList[0]?._id);
      }
    } catch (error) {
      console.error("Error fetching sub orgs", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await DepartmentGetApi();
      setDepartmentList(response?.data || []);
      setEmployeeIds([]);
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await DesignationListApi();
      setDesignationList(response?.data || []);
      setEmployeeIds([]);
    } catch (error) {
      console.error("Error fetching designations", error);
    }
  };
  useEffect(() => {
    let data = JSON.stringify(selectedFilters);
    localStorage.setItem(`${pageName}List`, data);
  }, [selectedFilters]);
  const fetchEmployees = async () => {
    try {
      const params = {
        orgIds: subOrgId !== "" ? [subOrgId] : [],
        branchIds,
        departmentIds,
        designationIds,
        params: ["name"],
      };
      const response = await EmployeeListApi(params);
      setEmployeeList(response?.data || []);
      if (employeFilterType === "single" && response?.data?.length > 0) {
        // setEmployeeIds([response.data[0]._id]);
      } else {
        setEmployeeIds([]);
      }
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleReset = () => {
    setSubOrgId("");
    setBranchIds([]);
    setDepartmentIds([]);
    setDesignationIds([]);
    setEmployeeIds([]);
    setFromDate("");
    setToDate("");
    setSelectedFilters({ ...initialData.current });
  };

  useEffect(() => {
    if (selectedFilters.employeeIds?.length) {
      setEmployeeIds(selectedFilters?.employeeIds);
    }
  }, [selectedFilters?.employeeIds]);

  useEffect(() => {
    let data = localStorage.getItem(`${pageName}List`);
    console.log(data, "data from local storage");
    data = JSON?.parse(data);
    console.log(data, "data from local storage after parsing");
  }, [data]);

  if (!selectedPage) return null;

  return (
    <div>
      {showFilters && (
        <div className="transition-all duration-300 ease-in-out flex flex-wrap items-end gap-4">
          {/* Sub Organization */}
          {selectedPage.includes("subOrg") &&
            user?.modules["suborganization"]?.r && (
              <SingleSelectDropdown
                inputName="Organization"
                hideLabel
                listData={orgList}
                selectedOption={subOrgId}
                selectedOptionDependency="_id"
                handleClick={(sel) => setSubOrgId(sel?._id || "")}
              />
            )}

          {/* Branch */}
          {selectedPage.includes("branch") && (
            <MultiSelectDropdown
              FeildName="name"
              InputName="Branch"
              Dependency="_id"
              hideLabel
              data={branchList}
              selectedData={branchIds}
              setSelectedData={setBranchIds}
            />
          )}

          {/* Department */}
          {selectedPage.includes("department") && (
            <MultiSelectDropdown
              FeildName="name"
              InputName="Department"
              Dependency="_id"
              hideLabel
              data={departmentList}
              selectedData={departmentIds}
              setSelectedData={setDepartmentIds}
            />
          )}

          {/* Designation */}
          {selectedPage.includes("designation") && (
            <MultiSelectDropdown
              FeildName="name"
              InputName="Designation"
              Dependency="_id"
              hideLabel
              data={designationList}
              selectedData={designationIds}
              setSelectedData={setDesignationIds}
            />
          )}

          {/* Employee */}
          {selectedPage.includes("user") && (
            <MultiSelectDropdown
              FeildName="name"
              InputName="Employees"
              Dependency="_id"
              hideLabel
              data={formattedEmployeeList}
              selectedData={
                employeFilterType === "single"
                  ? employeeIds[0] || ""
                  : employeeIds
              }
              setSelectedData={
                employeFilterType === "single"
                  ? (id) => setEmployeeIds(id ? [id] : [])
                  : setEmployeeIds
              }
              type="object"
              selectType={employeFilterType}
            />
          )}

          {/* YearMonth Filter */}
          {pageName === "attendancereport" && (
            <div className="flex w-auto">
              <YearMonthFilter
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            </div>
          )}
          {pageName === "leave" && (
            <div className="flex w-auto gap-4">
              <div className="min-w-[140px] maxsm:w-full">
                <Input
                  type="date"
                  label="From Date"
                  name="fromDate"
                  className="font-manrope"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e?.target?.value);
                  }}
                />
              </div>
              <div className="min-w-[140px] maxsm:w-full">
                <Input
                  type="date"
                  label="To Date"
                  name="toDate"
                  className="font-manrope"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e?.target?.value);
                  }}
                />
              </div>
              <div className="flex flex-col gap-1">
                {/* <label className="text-sm font-medium text-gray-700">
                  Status
                </label> */}
                <SingleSelectDropdown
                  inputName="Status"
                  hideLabel
                  listData={[
                    { _id: "", name: "All" },
                    { _id: "Pending", name: "Pending" },
                    { _id: "Approved", name: "Approved" },
                    { _id: "Rejected", name: "Rejected" },
                  ]}
                  selectedOption={selectedFilters.status || ""}
                  selectedOptionDependency="_id"
                  handleClick={(selected) => {
                    setSelectedFilters((prev) => ({
                      ...prev,
                      status: selected?._id || "",
                    }));
                  }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            {onSet && (
              <Button
                onClick={() => onSet(selectedFilters)}
                size="md"
                className="px-3 py-3 bg-primary hover:bg-primaryLight hover:text-primary transition-all duration-200 text-xs flex gap-2 justify-between"
              >
                Search <PiMagnifyingGlassBold className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={handleReset}
              size="md"
              className="bg-popLight hover:bg-popMedium transition-all rounded-md duration-200 text-xs flex gap-2 justify-between text-popfont-medium"
            >
              Clear <PiXBold className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filter;
