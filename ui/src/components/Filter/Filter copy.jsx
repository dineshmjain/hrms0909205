// import React, { useEffect, useRef, useState } from "react";
// import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
// import { useSelector } from "react-redux";
// import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
// import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction";
// import { DesignationGetAction } from "../../redux/Action/Designation/DesignationAction";
// import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
// import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
// import { useDispatch } from "react-redux";
// import { EmployeeGetAction } from "../../redux/Action/Employee/EmployeeAction";
// import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
// import YearMonthFilter from "../YearMonthFilter/YearMonthFilter";

// import { object } from "prop-types";
// import {
//   PiMagnifyingGlass,
//   PiMagnifyingGlassBold,
//   PiMagnifyingGlassDuotone,
//   PiX,
//   PiXBold,
// } from "react-icons/pi";

// let displayName = {
//   subOrg: {
//     name: "Organization",
//     moduleName: "suborganization",
//   },
//   user: {
//     name: "Employee",
//     moduleName: "user",
//   },
// };

// const Filter = ({
//   pageName,
//   name,
//   selectedFilters,
//   setSelectedFilters,
//   showFilters = true,
//   onSet,
// }) => {
//   const { subOrgs } = useSelector((state) => state?.subOrgs);
//   const { branchList } = useSelector((state) => state?.branch);
//   const { departmentList } = useSelector((state) => state?.department);
//   const { designationList } = useSelector((state) => state?.designation);
//   const { employeeList } = useSelector((state) => state?.employee);
//   const initialData = useRef(selectedFilters);

//   console.log(subOrgs, "SubOrgs List");

//   const hierarchyLevels = {
//     subOrg: 0,
//     branch: 1,
//     department: 2,
//     designation: 3,
//     employee: 4,
//     client: 4,
//     attendancereport: 5,
//   };

//   const getMoudleName = (name) => {
//     return displayName?.[name]?.moduleName ?? name;
//   };
//   console.log("Module Nameeeeeeee", displayName);
//   const getDisplayName = (name) => {
//     return displayName?.[name]?.name ?? name;
//   };

//   const dispatch = useDispatch();
//   const checkModules = useCheckEnabledModule();

//   const dropdownData = {
//     subOrg: {
//       action: SubOrgListAction,
//       getOnSelect: ["branch", "department", "designation"],
//       list: subOrgs,
//     },
//     branch: {
//       action: BranchGetAction,
//       // getOnSelect: ["department", "designation"],
//       list: branchList,
//       required: "subOrg",
//       multiselect:true,
//       reqbody: [],
//       type:""
//     },
//     department: {
//       action: DepartmentGetAction,
//       getOnSelect: ["designation"],
//       list: departmentList,
//       required: "branch",
//       reqbody: ["branchId"],
//       type:""
//     },
//     designation: {
//       action: DesignationGetAction,
//       getOnSelect: [],
//       list: designationList,
//       required: "branch",
//       reqbody: ["branchId", "departmentId"],
//       type:""
//     },
//     user: {
//       action: EmployeeGetAction,
//       getOnSelect: ["branch"],
//       list: employeeList,
//       multiselect: true,
//       required: "branch",
// type:"object",
//       reqbody: ["branchId", "departmentId", "designationId"],
//     },
//   };

//   const filterData = useRef({
//     employee: ["subOrg", "branch", "department", "designation", "user"],
//     designation: ["subOrg", "branch", "department"],
//     department: ["subOrg", "branch"],
//     branch: ["subOrg"],
//     client: ["subOrg", "branch"],
//     attendancereport: ["subOrg", "branch", "department", "designation", "user"],
//   });

//   const getReqBody = (dropdown, updatedFilters, triggeringDropdown) => {
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

//   // Reusable function to trigger dropdown API calls
//   const triggerDropdownAPIs = (name, updatedFilters) => {

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

//   const handleChange = (name, value) => {
//     const fieldName = `${name}Id`;
//     let updatedFilters = { ...selectedFilters, [fieldName]: value };

//     // Reset dependent dropdowns
//     dropdownData?.[name]?.getOnSelect?.forEach((dropdown) => {
//       updatedFilters = { ...updatedFilters, [`${dropdown}Id`]: "" };
//     });
// console.log(name,updatedFilters,'find filters data ===================================================================')
//     triggerDropdownAPIs(name, updatedFilters);
//     setSelectedFilters(updatedFilters);
//   };

//   // store selected filter in session storage
//   // useEffect(() => {
//   //   let data = localStorage.getItem(`${pageName}List`);

//   //   data = JSON?.parse(data);
//   //   if (data) {
//   //     // get all the selected data
//   //     Object.keys(data).forEach((key) => {
//   //       const name = key.replace(/Id$/, "");
//   //       if (dropdownData[name]) {
//   //         triggerDropdownAPIs(name, data);
//   //       }
//   //     });
//   //   }
//   // }, []);

//   // useEffect(() => {
//   //   let data = JSON.stringify(selectedFilters);
//   //   localStorage.setItem(`${pageName}List`, data);
//   // }, [selectedFilters]);

//   useEffect(() => {
//     if (checkModules("suborganization", "r")) {
//       dispatch(SubOrgListAction());
//     } else {
//       dispatch(BranchGetAction());
//     }
//   }, []);
//   useEffect(() => {
//     if (pageName === "attendancereport") {
//       dispatch(BranchGetAction());
//       dispatch(EmployeeGetAction());
//     }
//   }, [pageName, dispatch]);

//   const selectedPage = filterData?.current?.[pageName];

//   // if (!selectedPage) return <></>;
//   if (!selectedPage) return <></>;

//   return (
//     <>
//       <div
//         className={`transition-all duration-300 ease-in-out max-h-0  ${
//           showFilters ? "max-h-[1000px]" : " overflow-hidden"
//         } flex flex-wrap gap-4`}
//       >
//         {selectedPage?.map((dropdown, idx) => {
//           let name = getMoudleName(dropdown);

//           if (!checkModules(name, "r")) return <></>;

//           let currentDropdownData = dropdownData?.[dropdown];
//           if (currentDropdownData?.multiselect) {
//             return (
//               <MultiSelectDropdown
//                 key={idx}
//                 selectedData={selectedFilters?.["employeeId"]}
//                 data={currentDropdownData?.list}
//                 Dependency={"_id"}
//                 FeildName="name"
//                 type={currentDropdownData?.type}
//                 InputName={getDisplayName(dropdown)}
//                 setSelectedData={setSelectedFilters}
//                 setFieldName={"employeeId"}
//                 // handleClick={(data) => {
//                 //   handleChange(dropdown, data?._id);
//                 // }}
//                 hideLabel
//               />
//             );
//           }
//           return (
//             <SingleSelectDropdown
//               key={idx}
//               selectedOption={selectedFilters?.[`${dropdown}Id`]}
//               listData={currentDropdownData?.list}
//               selectedOptionDependency={"_id"}
//               feildName="name"
//               // handleError={{
//               //   triggerOn:
//               //     !currentDropdownData?.required ||
//               //     selectedFilters?.[currentDropdownData?.required],
//               //   error: `Select ${currentDropdownData?.required}`,
//               // }}
//               inputName={getDisplayName(dropdown)}
//               handleClick={(data) => {
//                 handleChange(dropdown, data?._id);
//               }}
//               hideLabel
//             />
//           );
//         })}
//         {/*  Now show YearMonthFilter before Search and Clear */}
//         <div className="flex gap-2 items-center">

//           {pageName === "attendancereport" && (
//             <div className="flex w-auto">
//               <YearMonthFilter
//                 selectedFilters={selectedFilters}
//                 setSelectedFilters={setSelectedFilters}
//               />
//             </div>
//           )}

//           {onSet && (
//             <div
//               className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm"
//               // size="sm"
//               onClick={() => onSet(selectedFilters)}
//             >
//               Search
//               <PiMagnifyingGlassBold className="w-4 h-4 cursor-pointer" />
//             </div>
//           )}

//           <div
//             className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm"
//             // size="sm"
//             onClick={() => {
//               setSelectedFilters({ ...initialData?.current });
//             }}
//           >
//             clear
//             <PiXBold className="w-4 h-4 cursor-pointer" />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Filter;


import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useCheckEnabledModule } from '../../hooks/useCheckEnabledModule';
import { BranchGetApi } from '../../apis/Branch/Branch';
import { subOrgListApi } from '../../apis/Organization/Organization';
import { EmployeeListApi } from '../../apis/Employee/Employee';
import { DepartmentGetApi } from '../../apis/Department/Department';
import { DesignationListApi } from '../../apis/Designation/Designation';
import { PiMagnifyingGlassBold, PiXBold } from 'react-icons/pi';
import SingleSelectDropdown from '../SingleSelectDropdown/SingleSelectDropdown';
import MultiSelectDropdown from '../MultiSelectDropdown/MultiSelectDropdown';

const Filter = ({
  pageName,
  name,
  selectedFilters,
  setSelectedFilters,
  showFilters = true,
  onSet,
}) => {
  const displayName = {
    subOrg: { name: "Organization", moduleName: "suborganization" },
    user: { name: "Employee", moduleName: "user" },
  };

  const filterData = useRef({
    employee: ["subOrg", "branch", "department", "designation", "user"],
    designation: ["subOrg", "branch", "department"],
    department: ["subOrg", "branch"],
    branch: ["subOrg"],
    client: ["subOrg", "branch"],
    attendancereport: ["subOrg", "branch", "department", "designation", "user"],
  });

  const dispatch = useDispatch();
  const checkModules = useCheckEnabledModule();

  const [branchList, setBranchList] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [designationList, setDesignationList] = useState([]);
 const [branchIds, setBranchIds] = useState([]);
  const [subOrgId, setsubOrgId] = useState([]);
  const [departmentIds, setDepartmentIds] = useState([]);
  const [designationIds, setDesignationIds] = useState([]);
  const selectedPage = filterData?.current?.[pageName];

  useEffect(() => {
    if (checkModules("suborganization", "r")) {
      SubOrgList();
    } else {
      BranchList();
    }
  }, []);

  useEffect(() => {
    if (pageName === "attendancereport") {
      BranchList();
      EmployeeList();
    }
  }, [pageName]);

  const BranchList = async () => {
    try {
      const response = await BranchGetApi({});
      console.log("Branch List:", response?.data);
      setBranchList(response?.data || []);
    } catch (error) {
      console.error("BranchList error", error);
    }
  };

  const SubOrgList = async () => {
    try {
      const response = await subOrgListApi({});
      console.log("Sub Org List:", response?.data);
      setOrgList(response?.data || []);
    } catch (error) {
      console.error("SubOrgList error", error);
    }
  };

  const EmployeeList = async () => {
    try {
      const response = await EmployeeListApi();
      console.log("Employee List:", response?.data);
    } catch (error) {
      console.error("EmployeeList error", error);
    }
  };

  const DepartmentList = async () => {
    try {
      const response = await DepartmentGetApi();
      console.log("Department List:", response?.data);
      setDepartmentList(response?.data || []);
    } catch (error) {
      console.error("DepartmentList error", error);
    }
  };

  const DesignationList = async () => {
    try {
      const response = await DesignationListApi();
      console.log("Designation List:", response?.data);
      setDesignationList(response?.data || []);
    } catch (error) {
      console.error("DesignationList error", error);
    }
  };

  if (!selectedPage) return null;

  return (
    <div
      className={`transition-all duration-300 ease-in-out max-h-0 ${
        showFilters ? "max-h-[1000px]" : "overflow-hidden"
      } flex flex-wrap gap-4`}
    >
      {/* {selectedPage.includes("subOrg") && <SingleSelectDropdown inputName='Organization'hideLabel listData={SubOrgList} />}
      {selectedPage.includes("branch") && <MultiSelectDropdown InputName="Branch" hideLabel/>}
      {selectedPage.includes("department") && <MultiSelectDropdown InputName="Department" hideLabel/>}
      {selectedPage.includes("designation") && <MultiSelectDropdown InputName="Designation" hideLabel/>}
      {selectedPage.includes("user") && <MultiSelectDropdown InputName="Employees" hideLabel/>} */}

             {pageName === "attendancereport" && (
            <div className="flex w-auto">
              <YearMonthFilter
                selectedFilters={selectedFilters}
                setSelectedFilters={setSelectedFilters}
              />
            </div>
          )}

          {onSet && (
            <div
              className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm"
              // size="sm"
              onClick={() => onSet(selectedFilters)}
            >
              Search
              <PiMagnifyingGlassBold className="w-4 h-4 cursor-pointer" />
            </div>
          )}

          <div
            className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-popLight shadow-none text-popfont-medium px-2 py-2 rounded-md hover:bg-popMedium hover:shadow-none text-sm"
            // size="sm"
            onClick={() => {
              setSelectedFilters({ ...initialData?.current });
            }}
          >
            clear
            <PiXBold className="w-4 h-4 cursor-pointer" />
          </div>
    </div>
  );
};

export default Filter;

