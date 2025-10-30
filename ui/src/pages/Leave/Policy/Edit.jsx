// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Header from "../../../components/header/Header";
// import PolicyForm from "./PolicyForm";
// import {
//   LeavePolicyUpdateAction,
//   LeavePolicyNameGetAction,
// } from "../../../redux/Action/Leave/LeaveAction";
// import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";

// const Edit = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { state } = useLocation();
//   const [isEditAvaliable, setIsEditAvaliable] = useState(true);

//   const leavePolicyList = useSelector(
//     (state) => state.leave?.LeavePolicyNameList || []
//   );

//   const { branchList } = useSelector((state) => state?.branch);

//   const [leavePolicyOptions, setLeavePolicyOptions] = useState([]);
//   const branchOptions = branchList.map((b) => ({
//     label: b.name,
//     value: b._id,
//   }));

//   const [form, setForm] = useState({
//     _id: "",
//     branch: {},
//     leavePolicy: {},
//     yearlyCount: "",
//     isMonthly: false,
//     monthlyCount: "",
//     creditedDay: {},
//     creditedMonth: {},
//     leaveHandling: {},
//     handlingType: {},
//     maxAllowedLeave: "",
//     salaryBasis: {},
//     salaryPercent: "",
//   });

//   const [errors, setErrors] = useState({});

//   // Define options before useEffect
//   const monthDay = Array.from({ length: 28 }, (_, i) => ({
//     label: `${i + 1}`,
//     value: `${i + 1}`,
//   }));

//   const YearlyMonth = [
//     { label: "January", value: "January" },
//     { label: "February", value: "February" },
//     { label: "March", value: "March" },
//     { label: "April", value: "April" },
//     { label: "May", value: "May" },
//     { label: "June", value: "June" },
//     { label: "July", value: "July" },
//     { label: "August", value: "August" },
//     { label: "September", value: "September" },
//     { label: "October", value: "October" },
//     { label: "November", value: "November" },
//     { label: "December", value: "December" },
//   ];

//   useEffect(() => {
//     dispatch(LeavePolicyNameGetAction());
//     dispatch(BranchGetAction({ mapedData: "branch", orgLevel: true }));
//   }, [dispatch]);

//   useEffect(() => {
//     if (leavePolicyList.length) {
//       const options = leavePolicyList.map((item) => ({
//         label: item.name,
//         value: item._id,
//       }));
//       setLeavePolicyOptions(options);
//     }
//   }, [leavePolicyList]);

//   useEffect(() => {
//     if (state && branchList.length > 0) {
//       console.log("Edit state data:", state);

//       // Find the matching branch
//       const selectedBranch = branchList.find((b) => b._id === state.branchId);

//       // Find the matching leave policy
//       const selectedLeavePolicy = leavePolicyOptions.find(
//         (p) => p.value === state.leavePolicyId
//       );

//       // Find credited day
//       const selectedDay = monthDay.find(
//         (item) => item.value === state.cycle?.creditedDay?.toString()
//       );

//       // Find credited month (if yearly)
//       const selectedMonth = YearlyMonth.find(
//         (item) => item.value === state.cycle?.creditedMonth
//       );

//       // Determine leave handling
//       let leaveHandling = { label: "None", value: "none" };
//       let handlingType = {};

//       if (state.carryForwardEnabled) {
//         leaveHandling = { label: "Carry Forward", value: "carry" };
//         handlingType = {
//           label: state.carryForwardCycle === "yearly" ? "Yearly" : "Monthly",
//           value: state.carryForwardCycle,
//         };
//       } else if (state.salaryConversionEnabled) {
//         leaveHandling = { label: "Convert to Salary", value: "salary" };
//         handlingType = {
//           label:
//             state.salaryConversionCycle === "yearly" ? "Yearly" : "Monthly",
//           value: state.salaryConversionCycle,
//         };
//       }

//       // Determine salary basis
//       let salaryBasis = {};
//       if (state.salaryConversionBase) {
//         salaryBasis = {
//           label: state.salaryConversionBase === "basic" ? "Basic" : "Gross",
//           value: state.salaryConversionBase,
//         };
//       }

//       const isMonthlyLeave = state.cycle?.type === "monthly";

//       setForm({
//         _id: state._id || "",
//         branch: selectedBranch
//           ? { label: selectedBranch.name, value: selectedBranch._id }
//           : {},
//         leavePolicy: selectedLeavePolicy || {},
//         yearlyCount: isMonthlyLeave
//           ? state.yearlyLeaveCount || state.noOfDays * 12 || ""
//           : state.noOfDays || "",
//         isMonthly: isMonthlyLeave,
//         monthlyCount: isMonthlyLeave ? state.noOfDays || "" : "",
//         creditedDay: selectedDay || {},
//         creditedMonth: selectedMonth || {},
//         leaveHandling,
//         handlingType,
//         maxAllowedLeave: state.maxLeavesConvertSalary || "",
//         salaryBasis,
//         salaryPercent: state.leaveEncashmentRatePerDaySalary || "",
//       });
//     }
//   }, [state, branchList, leavePolicyOptions]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     setForm((prev) => {
//       let updatedForm = {
//         ...prev,
//         [name]: type === "checkbox" ? checked : value,
//       };

//       // Auto-calc monthlyCount when yearlyCount changes
//       if (name === "yearlyCount" && updatedForm.isMonthly) {
//         updatedForm.monthlyCount = Math.floor(value / 12) || 0;
//       }

//       // Auto-calc monthlyCount when toggling isMonthly
//       if (name === "isMonthly") {
//         if (checked && updatedForm.yearlyCount) {
//           updatedForm.monthlyCount =
//             Math.floor(updatedForm.yearlyCount / 12) || 0;
//         } else {
//           updatedForm.monthlyCount = "";
//         }
//       }

//       return updatedForm;
//     });

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: null }));
//     }
//   };

//   const handleDropdownChange = (field) => (selected) => {
//     setForm((prev) => {
//       if (field === "branch") {
//         return {
//           ...prev,
//           branch: selected || {},
//           branchId: selected?.value || "",
//         };
//       }
//       return {
//         ...prev,
//         [field]: selected || {},
//       };
//     });
//     setErrors((prev) => ({ ...prev, [field]: null }));
//   };

//   const validate = () => {
//     const temp = {};

//     if (!form.branch?.value) {
//       temp.branch = "Please select a branch";
//     }

//     if (!form.leavePolicy?.value) {
//       temp.leavePolicy = "Please select a leave policy";
//     }

//     if (!form.yearlyCount) {
//       temp.yearlyCount = "Yearly count is required";
//     } else if (form.yearlyCount <= 0) {
//       temp.yearlyCount = "Yearly count must be greater than 0";
//     }

//     if (!form.creditedDay?.value) {
//       temp.creditedDay = "Please select a credited day";
//     }

//     if (!form.isMonthly && !form.creditedMonth?.value) {
//       temp.creditedMonth = "Please select a credited month";
//     }

//     if (!form.leaveHandling?.value) {
//       temp.leaveHandling = "Please select leave handling option";
//     }

//     if (
//       (form.leaveHandling?.value === "carry" ||
//         form.leaveHandling?.value === "salary") &&
//       !form.handlingType?.value
//     ) {
//       temp.handlingType = "Please select handling type";
//     }

//     if (form.leaveHandling?.value === "salary") {
//       if (!form.maxAllowedLeave) {
//         temp.maxAllowedLeave = "Max allowed leave is required";
//       }
//       if (!form.salaryBasis?.value) {
//         temp.salaryBasis = "Please select salary basis";
//       }
//       if (!form.salaryPercent) {
//         temp.salaryPercent = "Salary percent is required";
//       }
//     }

//     setErrors(temp);
//     return Object.keys(temp).length === 0;
//   };

//   // const handleSubmit = async (e) => {
//   //   e.preventDefault();
//   //   if (!validate()) {
//   //     console.log("Validation failed:", errors);
//   //     return;
//   //   }

//   //   try {
//   //     const payload = {
//   //       _id: form._id,
//   //       branchId: form.branch?.value,
//   //       noOfDays: form.isMonthly ? form.monthlyCount : form.yearlyCount,
//   //       cycle: {
//   //         type: form.isMonthly ? "monthly" : "yearly",
//   //         creditedDay: form.creditedDay?.value,
//   //         ...(form.isMonthly
//   //           ? {}
//   //           : { creditedMonth: form.creditedMonth?.value }),
//   //       },
//   //       carryForwardEnabled: form.leaveHandling?.value === "carry",
//   //       ...(form.leaveHandling?.value === "carry"
//   //         ? { carryForwardCycle: form.handlingType?.value }
//   //         : {}),
//   //       salaryConversionEnabled: form.leaveHandling?.value === "salary",
//   //       ...(form.leaveHandling?.value === "salary"
//   //         ? {
//   //             salaryConversionCycle: form.handlingType?.value,
//   //             maxLeavesConvertSalary:
//   //               form.handlingType?.value === "yearly"
//   //                 ? form.maxAllowedLeave
//   //                 : undefined,
//   //             leaveEncashmentRatePerDaySalary: form.salaryPercent,
//   //             salaryConversionBase: form.salaryBasis?.value,
//   //           }
//   //         : {}),
//   //       isExpiredLeaveAtMonthEnd: false,
//   //     };

//   //     console.log("Update payload:", payload);

//   //     const result = await dispatch(LeavePolicyUpdateAction(payload));

//   //     if (result?.meta?.requestStatus === "fulfilled") {
//   //       navigate("/policy/list");
//   //     }
//   //   } catch (error) {
//   //     console.error("Submission Error:", error);
//   //   }
//   // };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) {
//       console.log("Validation failed:", errors);
//       return;
//     }

//     try {
//       const payload = {
//         _id: form._id,
//         branchId: form.branch?.value,
//         cycle: {
//           type: form.isMonthly ? "monthly" : "yearly",
//           creditedDay: form.creditedDay?.value,
//           ...(form.isMonthly
//             ? {}
//             : { creditedMonth: form.creditedMonth?.value }),
//         },
//         carryForwardEnabled: form.leaveHandling?.value === "carry",
//         ...(form.leaveHandling?.value === "carry"
//           ? { carryForwardCycle: form.handlingType?.value }
//           : {}),
//         salaryConversionEnabled: form.leaveHandling?.value === "salary",
//         ...(form.leaveHandling?.value === "salary"
//           ? {
//               salaryConversionCycle: form.handlingType?.value,
//               maxLeavesConvertSalary:
//                 form.handlingType?.value === "yearly"
//                   ? form.maxAllowedLeave
//                   : undefined,
//               leaveEncashmentRatePerDaySalary: form.salaryPercent,
//               salaryConversionBase: form.salaryBasis?.value,
//             }
//           : {}),
//         isExpiredLeaveAtMonthEnd: false,
//       };

//       // ✅ Apply consistent leave count logic
//       if (form.isMonthly) {
//         payload.noOfDays = form.monthlyCount || 0;
//       } else {
//         payload.noOfDays = form.yearlyCount || 0;
//         payload.yearlyLeaveCount = form.yearlyCount || 0;
//       }

//       console.log("Update payload:", payload);

//       const result = await dispatch(LeavePolicyUpdateAction(payload));

//       if (result?.meta?.requestStatus === "fulfilled") {
//         navigate("/policy/list");
//       }
//     } catch (error) {
//       console.error("Submission Error:", error);
//     }
//   };

//   return (
//     <div className="flex flex-col w-full p-2 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
//       <Header
//         isBackHandler={true}
//         headerLabel="Edit Policy"
//         subHeaderLabel="Edit Policy Details"
//         isEditAvaliable={isEditAvaliable}
//         handleEdit={() => {
//           setIsEditAvaliable(!isEditAvaliable);
//         }}
//         buttonTitle="Save"
//         handleClick={handleSubmit}
//       />
//       <PolicyForm
//         form={form}
//         errors={errors}
//         branchOptions={branchOptions}
//         handleChange={handleChange}
//         handleDropdownChange={handleDropdownChange}
//         leavePolicyOptions={leavePolicyOptions}
//         monthDay={monthDay}
//         YearlyMonth={YearlyMonth}
//         setErrors={setErrors}
//         onSubmit={(e) => e.preventDefault()}
//         isEditAvaliable={isEditAvaliable}
//         isEdit={true}
//       />
//     </div>
//   );
// };

// export default Edit;
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../../components/header/Header";
import PolicyForm from "./PolicyForm";
import {
  LeavePolicyUpdateAction,
  LeavePolicyNameGetAction,
} from "../../../redux/Action/Leave/LeaveAction";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";

const Edit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [isEditAvaliable, setIsEditAvaliable] = useState(true);

  const leavePolicyList = useSelector(
    (state) => state.leave?.LeavePolicyNameList || []
  );

  const { branchList } = useSelector((state) => state?.branch);

  const [leavePolicyOptions, setLeavePolicyOptions] = useState([]);
  const branchOptions = branchList.map((b) => ({
    label: b.name,
    value: b._id,
  }));

  const [form, setForm] = useState({
    _id: "",
    branch: {},
    leavePolicy: {},
    yearlyCount: "",
    isMonthly: false,
    monthlyCount: "",
    creditedDay: {},
    creditedMonth: {},
    leaveHandling: {},
    handlingType: {},
    maxAllowedLeave: "",
    salaryBasis: {},
    salaryPercent: "",
  });

  const [errors, setErrors] = useState({});

  // Define options before useEffect
  const monthDay = Array.from({ length: 28 }, (_, i) => ({
    label: `${i + 1}`,
    value: `${i + 1}`,
  }));

  const YearlyMonth = [
    { label: "January", value: "January" },
    { label: "February", value: "February" },
    { label: "March", value: "March" },
    { label: "April", value: "April" },
    { label: "May", value: "May" },
    { label: "June", value: "June" },
    { label: "July", value: "July" },
    { label: "August", value: "August" },
    { label: "September", value: "September" },
    { label: "October", value: "October" },
    { label: "November", value: "November" },
    { label: "December", value: "December" },
  ];

  useEffect(() => {
    dispatch(LeavePolicyNameGetAction());
    dispatch(BranchGetAction({ mapedData: "branch", orgLevel: true }));
  }, [dispatch]);

  useEffect(() => {
    if (leavePolicyList.length) {
      const options = leavePolicyList.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      setLeavePolicyOptions(options);
    }
  }, [leavePolicyList]);

  useEffect(() => {
    if (state && branchList.length > 0) {
      console.log("Edit state data:", state);

      // Find the matching branch
      const selectedBranch = branchList.find((b) => b._id === state.branchId);

      // Find the matching leave policy
      const selectedLeavePolicy = leavePolicyOptions.find(
        (p) => p.value === state.leavePolicyId
      );

      // Find credited day
      const selectedDay = monthDay.find(
        (item) => item.value === state.cycle?.creditedDay?.toString()
      );

      // Find credited month (if yearly)
      const selectedMonth = YearlyMonth.find(
        (item) => item.value === state.cycle?.creditedMonth
      );

      // Determine leave handling - Remove "None" option
      let leaveHandling = { label: "Carry Forward", value: "carry" }; // Default
      let handlingType = { label: "Monthly", value: "monthly" }; // Default

      if (state.carryForwardEnabled) {
        leaveHandling = { label: "Carry Forward", value: "carry" };
        handlingType = {
          label: state.carryForwardCycle === "yearly" ? "Yearly" : "Monthly",
          value: state.carryForwardCycle,
        };
      } else if (state.salaryConversionEnabled) {
        leaveHandling = { label: "Convert to Salary", value: "salary" };
        handlingType = {
          label:
            state.salaryConversionCycle === "yearly" ? "Yearly" : "Monthly",
          value: state.salaryConversionCycle,
        };
      }

      // Determine salary basis
      let salaryBasis = {};
      if (state.salaryConversionBase) {
        salaryBasis = {
          label: state.salaryConversionBase === "basic" ? "Basic" : "Gross",
          value: state.salaryConversionBase,
        };
      }

      const isMonthlyLeave = state.cycle?.type === "monthly";

      // ✅ Calculate yearly and monthly counts correctly
      let yearlyCount = "";
      let monthlyCount = "";

      if (isMonthlyLeave) {
        // If it's monthly cycle
        monthlyCount = state.noOfDays || "";
        // Calculate yearly from monthly (or use yearlyLeaveCount if available)
        yearlyCount = state.yearlyLeaveCount || (state.noOfDays ? state.noOfDays * 12 : "");
      } else {
        // If it's yearly cycle
        yearlyCount = state.noOfDays || state.yearlyLeaveCount || "";
        monthlyCount = ""; // Not applicable for yearly
      }

      setForm({
        _id: state._id || "",
        branch: selectedBranch
          ? { label: selectedBranch.name, value: selectedBranch._id }
          : {},
        leavePolicy: selectedLeavePolicy || {},
        yearlyCount: yearlyCount,
        isMonthly: isMonthlyLeave,
        monthlyCount: monthlyCount,
        creditedDay: selectedDay || {},
        creditedMonth: selectedMonth || {},
        leaveHandling,
        handlingType,
        maxAllowedLeave: state.maxLeavesConvertSalary || "",
        salaryBasis,
        salaryPercent: state.leaveEncashmentRatePerDaySalary || "",
      });
    }
  }, [state, branchList, leavePolicyOptions]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => {
      let updatedForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      // Auto-calc monthlyCount when yearlyCount changes
      if (name === "yearlyCount" && updatedForm.isMonthly) {
        const yearlyVal = parseFloat(value) || 0;
        updatedForm.monthlyCount = (yearlyVal / 12).toFixed(2);
      }

      // Auto-calc monthlyCount when toggling isMonthly
      if (name === "isMonthly") {
        if (checked && updatedForm.yearlyCount) {
          const yearlyVal = parseFloat(updatedForm.yearlyCount) || 0;
          updatedForm.monthlyCount = (yearlyVal / 12).toFixed(2);
        } else {
          updatedForm.monthlyCount = "";
        }
      }

      return updatedForm;
    });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDropdownChange = (field) => (selected) => {
    setForm((prev) => {
      if (field === "branch") {
        return {
          ...prev,
          branch: selected || {},
          branchId: selected?.value || "",
        };
      }
      return {
        ...prev,
        [field]: selected || {},
      };
    });
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const temp = {};

    if (!form.branch?.value) {
      temp.branch = "Please select a branch";
    }

    if (!form.leavePolicy?.value) {
      temp.leavePolicy = "Please select a leave policy";
    }

    if (!form.yearlyCount) {
      temp.yearlyCount = "Yearly count is required";
    } else if (form.yearlyCount <= 0) {
      temp.yearlyCount = "Yearly count must be greater than 0";
    }

    if (!form.creditedDay?.value) {
      temp.creditedDay = "Please select a credited day";
    }

    if (!form.isMonthly && !form.creditedMonth?.value) {
      temp.creditedMonth = "Please select a credited month";
    }

    if (!form.leaveHandling?.value) {
      temp.leaveHandling = "Please select leave handling option";
    }

    // ✅ Always require handlingType (removed "none" option)
    if (!form.handlingType?.value) {
      temp.handlingType = "Please select handling type";
    }

    if (form.leaveHandling?.value === "salary") {
      if (!form.maxAllowedLeave) {
        temp.maxAllowedLeave = "Max allowed leave is required";
      }
      if (!form.salaryBasis?.value) {
        temp.salaryBasis = "Please select salary basis";
      }
      if (!form.salaryPercent) {
        temp.salaryPercent = "Salary percent is required";
      }
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      console.log("Validation failed:", errors);
      return;
    }

    try {
      const payload = {
        _id: form._id,
        branchId: form.branch?.value,
        cycle: {
          type: form.isMonthly ? "monthly" : "yearly",
          creditedDay: form.creditedDay?.value,
          ...(form.isMonthly
            ? {}
            : { creditedMonth: form.creditedMonth?.value }),
        },
        carryForwardEnabled: form.leaveHandling?.value === "carry",
        ...(form.leaveHandling?.value === "carry"
          ? { carryForwardCycle: form.handlingType?.value }
          : {}),
        salaryConversionEnabled: form.leaveHandling?.value === "salary",
        ...(form.leaveHandling?.value === "salary"
          ? {
              salaryConversionCycle: form.handlingType?.value,
              maxLeavesConvertSalary:
                form.handlingType?.value === "yearly"
                  ? form.maxAllowedLeave
                  : undefined,
              leaveEncashmentRatePerDaySalary: form.salaryPercent,
              salaryConversionBase: form.salaryBasis?.value,
            }
          : {}),
        isExpiredLeaveAtMonthEnd: false,
      };

      // ✅ Apply consistent leave count logic
      if (form.isMonthly) {
        // For monthly: send monthlyCount as noOfDays, yearlyCount as yearlyLeaveCount
        payload.noOfDays = parseFloat(form.monthlyCount) || 0;
        payload.yearlyLeaveCount = parseFloat(form.yearlyCount) || 0;
      } else {
        // For yearly: send yearlyCount as both noOfDays and yearlyLeaveCount
        payload.noOfDays = parseFloat(form.yearlyCount) || 0;
        payload.yearlyLeaveCount = parseFloat(form.yearlyCount) || 0;
      }

      console.log("Update payload:", payload);

      const result = await dispatch(LeavePolicyUpdateAction(payload));

      if (result?.meta?.requestStatus === "fulfilled") {
        navigate("/policy/list");
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  return (
    <div className="flex flex-col w-full p-2 flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
      <Header
        isBackHandler={true}
        headerLabel="Edit Policy"
        subHeaderLabel="Edit Policy Details"
        isEditAvaliable={isEditAvaliable}
        handleEdit={() => {
          setIsEditAvaliable(!isEditAvaliable);
        }}
        buttonTitle="Save"
        handleClick={handleSubmit}
      />
      <PolicyForm
        form={form}
        errors={errors}
        branchOptions={branchOptions}
        handleChange={handleChange}
        handleDropdownChange={handleDropdownChange}
        leavePolicyOptions={leavePolicyOptions}
        monthDay={monthDay}
        YearlyMonth={YearlyMonth}
        setErrors={setErrors}
        onSubmit={(e) => e.preventDefault()}
        isEditAvaliable={isEditAvaliable}
        isEdit={true}
      />
    </div>
  );
};

export default Edit;