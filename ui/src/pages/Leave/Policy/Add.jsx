import React, { useEffect, useState } from "react";
import Header from "../../../components/header/Header";
import { useNavigate } from "react-router-dom";
import {
  LeavePolicyCreateAction,
  LeavePolicyUpdateAction,
  LeavePolicyNameGetAction,
} from "../../../redux/Action/Leave/LeaveAction";
import { useDispatch, useSelector } from "react-redux";
import PolicyForm from "./PolicyForm";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";

const AddConfig = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const leavePolicyList = useSelector(
    (state) => state.leave?.LeavePolicyNameList || []
  );

  const [leavePolicyOptions, setLeavePolicyOptions] = useState([]);

  // ✅ Set default values for Carry Forward and Monthly
  const [form, setForm] = useState({
    leavePolicy: {},
    yearlyCount: "",
    isMonthly: true, // ✅ Default to Monthly
    monthlyCount: "",
    creditedDay: {},
    creditedMonth: {},
    leaveHandling: { label: "Carry Forward", value: "carry" }, // ✅ Default to Carry Forward
    handlingType: { label: "Monthly", value: "monthly" }, // ✅ Default to Monthly
    maxAllowedLeave: "",
    salaryBasis: {},
    salaryPercent: "",
    branchId: "",
  });

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

  const { branchList } = useSelector((state) => state?.branch);
  console.log("branchList from Redux:", branchList);
  
  // Convert branchList to dropdown options
  const branchOptions = branchList.map((b) => ({
    label: b.name,
    value: b._id,
  }));

  useEffect(() => {
    dispatch(LeavePolicyNameGetAction());
  }, [dispatch]);

  useEffect(() => {
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

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDropdownChange = (field) => (selected) => {
    setForm((prev) => {
      // If selecting branch, update branchId as well
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

    // Validate leave policy selection
    if (!form.leavePolicy?.value) {
      temp.leavePolicy = "Please select a leave policy";
    }

    // Validate yearly count
    if (!form.yearlyCount) {
      temp.yearlyCount = "Yearly count is required";
    } else if (form.yearlyCount <= 0) {
      temp.yearlyCount = "Yearly count must be greater than 0";
    }

    // Validate credited day
    if (!form.creditedDay?.value) {
      temp.creditedDay = "Please select a credited day";
    }

    // Validate credited month (only if not monthly)
    if (!form.isMonthly && !form.creditedMonth?.value) {
      temp.creditedMonth = "Please select a credited month";
    }

    // Validate leave handling
    if (!form.leaveHandling?.value) {
      temp.leaveHandling = "Please select leave handling option";
    }

    // ✅ Handling type is now always required (removed "none" option)
    if (!form.handlingType?.value) {
      temp.handlingType = "Please select handling type";
    }

    // Validate salary conversion fields
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

  const handleSubmit = async () => {
    console.log("Submit clicked - validating...");

    if (!validate()) {
      console.log("Validation failed:", errors);
      return;
    }

    try {
      // Base payload
      const payload = {
        branchId: form.branchId,
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

      // CREATE: include leavePolicyId
      if (!form._id) {
        payload.leavePolicyId = form.leavePolicy?.value;
      }

      console.log("Payload for API:", payload);

      const result = await dispatch(
        form._id
          ? LeavePolicyUpdateAction({ _id: form._id, ...payload })
          : LeavePolicyCreateAction(payload)
      );

      console.log("API Result:", result);

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
        headerLabel={"Create Policy"}
        subHeaderLabel={"Configure Your Policy Details"}
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
        isEdit={false}
      />
    </div>
  );
};

export default AddConfig;