// import React, { useEffect, useState, useMemo } from "react";
// import Header from "../../../components/header/Header";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Table from "../../../components/Table/Table";
// import {
//   LeavePolicyGetAction,
//   LeavePolicyStatusUpdateAction,
// } from "../../../redux/Action/Leave/LeaveAction";
// import { MdModeEditOutline } from "react-icons/md";
// import { use } from "react";
// import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
// import { usePrompt } from "../../../context/PromptProvider";
// import { Button, Chip } from "@material-tailwind/react";
// import toast from "react-hot-toast";
// import { removeEmptyStrings } from "../../../constants/reusableFun";
// import MultiSelectFilter from "../../../components/Filter/MultiSelectFilter";
// const List = () => {
//   const navigate = useNavigate();
//   const addButton = () => navigate("/policy/add");
//   const dispatch = useDispatch();
//   const checkMoudles = useCheckEnabledModule();
//   const { showPrompt, hidePrompt } = usePrompt();
//   const [selectedFilters, setSelectedFilters] = useState({
//     orgId: "",
//     branchIds: [],
//     departmentIds: [],
//     designationIds: [],
//     employeeIds: [],
//   });
//   const {
//     PolicyList,
//     loading: LeaveLoading,
//     totalRecord,
//     pageNo,
//     limit,
//   } = useSelector((state) => state.leave);
//   const [showFilters, setShowFilters] = useState(true);
//   const user = useSelector((state) => state.user.user);
//   const isSubOrg = !!user?.modules?.["suborganization"]?.r;
//   console.log("isSubOrg:", isSubOrg);
//   const getPolicyList = (params) => {
//     let finalParams = {
//       page: params.page,
//       limit: params.limit,
//     };

//     if (params.name) {
//       finalParams.search = params.name;
//     }

//     if (params.orgIds) {
//       finalParams.orgIds = params.orgIds;
//     }

//     if (params.branchIds && params.branchIds.length > 0) {
//       finalParams.branchIds = params.branchIds;
//     }

//     if (checkMoudles("policy", "r")) {
//       finalParams = removeEmptyStrings(finalParams);
//     }

//     console.log("Final params being sent to API:", finalParams);
//     dispatch(LeavePolicyGetAction(finalParams));
//   };

//   // useEffect(() => {
//   //   getPolicyList();
//   // }, [dispatch]);

//   console.log(PolicyList, "what i sthe list hererer");
//   const handleShowPrompt = (data) => {
//     showPrompt({
//       heading: "Are you sure?",
//       message: (
//         <span>
//           Are you sure you want to{" "}
//           <b>{data?.isActive ? `Deactivate` : `Activate`} </b> the{" "}
//           <b>{data.name}</b> Branch ?
//         </span>
//       ),
//       buttons: [
//         {
//           label: "Yes",
//           type: 1,
//           onClick: () => {
//             confirmUpdate(data);
//           },
//         },
//         {
//           label: "No",
//           type: 0,
//           onClick: () => {
//             return hidePrompt();
//           },
//         },
//       ],
//     });
//   };

//   const confirmUpdate = (data) => {
//     if (!data) return;
//     const payload = {
//       _id: data._id,
//       isActive: data.isActive ? false : true,
//     };
//     dispatch(LeavePolicyStatusUpdateAction(payload))
//       .then(() => {
//         getPolicyList({ page: pageNo, limit: limit, name: "" });
//       })
//       .catch((err) => toast.error("Assignment failed"));
//     hidePrompt();
//   };

//   const labels = {
//     leavePolicyName: {
//       DisplayName: "Name",
//     },
//     // genderEligibility: {
//     //   DisplayName: "Gender",
//     // },
//     noOfDays: {
//       DisplayName: "No Of Days",
//     },
//     type: {
//       DisplayName: "Cycle Type",
//       type: "object",
//       objectName: "cycle",
//     },

//     creditedDay: {
//       DisplayName: "Credited Day",
//       type: "object",
//       objectName: "cycle",
//     },
//     creditedMonth: {
//       DisplayName: "Credited Month",
//       type: "object",
//       objectName: "cycle",
//     },
//     policyFeatures: {
//       DisplayName: "Policy Handling",
//       type: "function",
//       data: (row) => {
//         const features = [];

//         if (row.carryForwardEnabled) {
//           features.push(`Carry Forward: Yes (${row.carryForwardCycle})`);
//         }

//         if (row.salaryConversionEnabled) {
//           features.push(
//             `Salary Conversion: Yes (${row.salaryConversionCycle})`
//           );
//         }

//         if (row.isExpiredLeaveAtMonthEnd) {
//           features.push("Expiry: Expires at Month End");
//         }

//         // Join only the true values with a pipe separator
//         return features.join(" | ") || "-"; // "-" if nothing is true
//       },
//     },

//     // eligibleNoOfDays: {
//     //   DisplayName: "Eligible Days",
//     // },
//     modifiedDate: {
//       DisplayName: "Last Modified",
//       type: "time",
//       format: "DD-MM-YYYY HH:mm A",
//     },
//     isActive: {
//       DisplayName: "Status",
//       type: "function",
//       data: (data, idx, subData, subIdx) => {
//         return (
//           <div className="flex justify-center items-center gap-2" key={idx}>
//             <Chip
//               color={data?.isActive ? "green" : "red"}
//               variant="ghost"
//               value={data?.isActive ? "Active" : "Inactive"}
//               className="cursor-pointer font-poppins"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 if (checkMoudles("policy", "d") == false)
//                   return toast.error(
//                     "You are Unauthorized to Activate/Deactivate POlicy!"
//                   );
//                 handleShowPrompt(data);
//               }}
//             />
//           </div>
//         );
//       },
//     },
//   };
//   const actions = [
//     {
//       title: "Edit",
//       text: <MdModeEditOutline className="w-5 h-5" />,
//       onClick: (policy) => {
//         if (checkMoudles("policy", "u") == false)
//           return toast.error("You are Unauthorized to Edit Policy!");
//         editButton(policy);
//       },
//     },
//   ];
//   const editButton = (leave) => {
//     if (leave?.isActive == false) {
//       return toast.error("Cannot Edit Please Activate");
//     } else {
//       navigate("/policy/edit", { state: leave });
//     }
//   };

//   return (
//     <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
//       <Header
//         handleClick={addButton}
//         buttonTitle={"Add"}
//         headerLabel={"Leave Policy"}
//         subHeaderLabel={"Overview of Your Policy"}
//       />
//       <div className="">
//         <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
//           Filters
//         </div>
//         <MultiSelectFilter
//           showFilters={showFilters}
//           selectedFilters={selectedFilters}
//           onSet={(data) => {
//             console.log("Filter data received:", data);
//             setSelectedFilters(data);

//             const params = {
//               page: 1,
//               limit: 10,
//             };

//             if (data.orgIds) params.orgIds = data.orgIds;
//             if (data.branchIds && data.branchIds.length > 0) {
//               params.branchIds = data.branchIds;
//             }

//             getPolicyList(params);
//           }}
//           setSelectedFilters={setSelectedFilters}
//           pageName={"policy"}
//         />
//         <Table
//           tableName="Policy"
//           tableJson={PolicyList}
//           isLoading={LeaveLoading}
//           labels={labels}
//           onRowClick={editButton}
//           actions={actions}
//           paginationProps={{
//             totalRecord,
//             pageNo,
//             limit,
//             onDataChange: (page, limit, name = "") => {
//               getPolicyList({ page, limit, name });
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// };

// export default List;
import React, { useEffect, useState, useMemo } from "react";
import Header from "../../../components/header/Header";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/Table/Table";
import {
  LeavePolicyGetAction,
  LeavePolicyStatusUpdateAction,
} from "../../../redux/Action/Leave/LeaveAction";
import { MdModeEditOutline } from "react-icons/md";
import { use } from "react";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import { usePrompt } from "../../../context/PromptProvider";
import { Button, Chip } from "@material-tailwind/react";
import toast from "react-hot-toast";
import { removeEmptyStrings } from "../../../constants/reusableFun";
import MultiSelectFilter from "../../../components/Filter/MultiSelectFilter";

const List = () => {
  const navigate = useNavigate();
  const addButton = () => navigate("/policy/add");
  const dispatch = useDispatch();
  const checkMoudles = useCheckEnabledModule();
  const { showPrompt, hidePrompt } = usePrompt();
  const [selectedFilters, setSelectedFilters] = useState({
    orgId: "",
    branchIds: [],
    departmentIds: [],
    designationIds: [],
    employeeIds: [],
  });
  const {
    PolicyList,
    loading: LeaveLoading,
    totalRecord,
    pageNo,
    limit,
  } = useSelector((state) => state.leave);
  const [showFilters, setShowFilters] = useState(true);
  const user = useSelector((state) => state.user.user);
  const isSubOrg = !!user?.modules?.["suborganization"]?.r;
  console.log("isSubOrg:", isSubOrg);

  const getPolicyList = (params) => {
    let finalParams = {
      page: params.page,
      limit: params.limit,
    };

    if (params.name) {
      finalParams.search = params.name;
    }

    if (params.orgIds) {
      finalParams.orgIds = params.orgIds;
    }

    // ✅ Convert branchIds array to branchId (singular) - send first selected branch
    if (params.branchIds && params.branchIds.length > 0) {
      finalParams.branchId = params.branchIds[0]; // Send only first branch as single value
    }

    if (checkMoudles("policy", "r")) {
      finalParams = removeEmptyStrings(finalParams);
    }

    console.log("Final params being sent to API:", finalParams);
    dispatch(LeavePolicyGetAction(finalParams));
  };

  console.log(PolicyList, "what i sthe list hererer");

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b>{data?.isActive ? `Deactivate` : `Activate`} </b> the{" "}
          <b>{data.name}</b> Branch ?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            confirmUpdate(data);
          },
        },
        {
          label: "No",
          type: 0,
          onClick: () => {
            return hidePrompt();
          },
        },
      ],
    });
  };

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      _id: data._id,
      isActive: data.isActive ? false : true,
    };
    dispatch(LeavePolicyStatusUpdateAction(payload))
      .then(() => {
        getPolicyList({ page: pageNo, limit: limit, name: "" });
      })
      .catch((err) => toast.error("Assignment failed"));
    hidePrompt();
  };

  const labels = {
    leavePolicyName: {
      DisplayName: "Name",
    },
    noOfDays: {
      DisplayName: "No Of Days",
    },
    type: {
      DisplayName: "Cycle Type",
      type: "object",
      objectName: "cycle",
    },
    creditedDay: {
      DisplayName: "Credited Day",
      type: "object",
      objectName: "cycle",
    },
    creditedMonth: {
      DisplayName: "Credited Month",
      type: "object",
      objectName: "cycle",
    },
    policyFeatures: {
      DisplayName: "Policy Handling",
      type: "function",
      data: (row) => {
        const features = [];

        if (row.carryForwardEnabled) {
          features.push(`Carry Forward: Yes (${row.carryForwardCycle})`);
        }

        if (row.salaryConversionEnabled) {
          features.push(
            `Salary Conversion: Yes (${row.salaryConversionCycle})`
          );
        }

        if (row.isExpiredLeaveAtMonthEnd) {
          features.push("Expiry: Expires at Month End");
        }

        return features.join(" | ") || "-";
      },
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx, subData, subIdx) => {
        return (
          <div className="flex justify-center items-center gap-2" key={idx}>
            <Chip
              color={data?.isActive ? "green" : "red"}
              variant="ghost"
              value={data?.isActive ? "Active" : "Inactive"}
              className="cursor-pointer font-poppins"
              onClick={(e) => {
                e.stopPropagation();
                if (checkMoudles("policy", "d") == false)
                  return toast.error(
                    "You are Unauthorized to Activate/Deactivate Policy!"
                  );
                handleShowPrompt(data);
              }}
            />
          </div>
        );
      },
    },
  };

  const actions = [
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (policy) => {
        if (checkMoudles("policy", "u") == false)
          return toast.error("You are Unauthorized to Edit Policy!");
        editButton(policy);
      },
    },
  ];

  const editButton = (leave) => {
    if (leave?.isActive == false) {
      return toast.error("Cannot Edit Please Activate");
    } else {
      navigate("/policy/edit", { state: leave });
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full border-1 border-gray-50 rounded-md">
      <Header
        handleClick={addButton}
        buttonTitle={"Add"}
        headerLabel={"Leave Policy"}
        subHeaderLabel={"Overview of Your Policy"}
      />
      <div className="">
        <div className="text-gray-700 font-semibold mt-0 text-[14px] mb-1">
          Filters
        </div>
        <MultiSelectFilter
          showFilters={showFilters}
          selectedFilters={selectedFilters}
          onSet={(data) => {
            console.log("Filter data received:", data);
            setSelectedFilters(data);

            const params = {
              page: 1,
              limit: 10,
            };

            if (data.orgIds) params.orgIds = data.orgIds;
            if (data.branchIds && data.branchIds.length > 0) {
              params.branchIds = data.branchIds; // Keep as array here, will be converted in getPolicyList
            }

            getPolicyList(params);
          }}
          setSelectedFilters={setSelectedFilters}
          pageName={"policy"}
        />
        <Table
          tableName="Policy"
          tableJson={PolicyList}
          isLoading={LeaveLoading}
          labels={labels}
          onRowClick={editButton}
          actions={actions}
          paginationProps={{
            totalRecord,
            pageNo,
            limit,
            onDataChange: (page, limit, name = "") => {
              getPolicyList({ page, limit, name });
            },
          }}
        />
      </div>
    </div>
  );
};

export default List;