import React, { useEffect, useState, useMemo } from "react";
import Header from "../../../components/header/Header";
import { Typography, Input } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import { useNavigate } from "react-router-dom";
import { PiInfoBold } from "react-icons/pi";
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { LeavePolicyCreateAction } from "../../../redux/Action/Leave/LeaveAction";
import { useDispatch, useSelector } from "react-redux";
import PolicyForm from "./PolicyForm";

const AddConfig = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    leaveName: "",
    type: {},
    days: null,
    appType: {},
    creditedDay: {},
    creditedMonth: {},
    gender: {},
    paidType: {},
    eligibleNoOfDays: "",
    applyBeforeDays: 0,
    applyAfterDays: 0,
  });
  const typeList = [
    { label: "Monthly", value: "monthly" },
    { label: "Yearly", value: "yearly" },
  ];
  const appTypes = [
    { label: "Pre", value: "pre" },
    { label: "Post", value: "post" },
  ];
  const genders = [
    { label: "All", value: "all" },
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
  ];
  const paidTypes = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ];
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
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleDropdownChange = (field) => (selected) => {
    setForm((prev) => ({
      ...prev,
      [field]: selected || ""
    }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };
  const validate = () => {
    const temp = {};
    if (!form.leaveName) {
      temp.leaveName = "Name is required";
    } else if (/^\s/.test(form.leaveName)) {
        temp.leaveName = "Name cannot start with a whitespace";
      }
    if (!form.type.value) {
      temp.type = "Select Repeat Cycle";
    }
    if (!form.days) {
      temp.days = "No Of Days is Required";
    }else if(form.days.length>3){
       temp.days = "Only 3 Digits allowed";
    }
    if (!form.gender.value) {
      temp.gender = "Gender is Required";
    }
    if (!form.appType.value) {
      temp.appType = "Approval Type is Required";
    }
    if (!form.paidType.value) {
      temp.paidType = "Paid Type is Required";
    }
    // if (!form.applyBeforeDays) {
    //   temp.applyBeforeDays = "Applied Before Days Is Required";
    // }else if(form.applyBeforeDays.length>3){
    //    temp.applyBeforeDays = "Only 3 Digits allowed";
    // }
    // if (!form.applyAfterDays) {
    //   temp.applyAfterDays = "Applied After Days Is Required";
    // }else if(form.applyAfterDays.length>3){
    //    temp.applyAfterDays = "Only 3 Digits allowed";
    // }
    // if (!form.eligibleNoOfDays) {
    //   temp.eligibleNoOfDays = "Eligible Days Is Required";
    // }else if(form.eligibleNoOfDays.length>3){
    //    temp.eligibleNoOfDays = "Only 3 Digits allowed";
    // } 
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const json = {
        "name": form.leaveName,
        "cycle": {
          "type": form.type?.value,
          "creditedDay": form.creditedDay?.value,
        },
        "noOfDays": form.days,
        "genderEligibility": form.gender?.value,
        "eligibleNoOfDays": form.eligibleNoOfDays,
        "approval": {
          "type": form.appType.value,
          "applyBeforeDays": form.applyBeforeDays,
          "applyAfterDays": form.applyAfterDays
        },
        "isPaid": form.paidType.value === "Yes" ? true : false
      }
      if (form.creditedMonth) {
        json.cycle["creditedMonth"] = form.creditedMonth?.value
      }
      console.log(json, "give json");
      const result = await dispatch(LeavePolicyCreateAction({ ...json }));
      if (result?.meta?.requestStatus === "fulfilled") {
        navigate("/policy/list");
      }
    } catch (error) {
      console.error("Submission Error:", error);
    }
  }
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
        handleChange={handleChange}
        handleDropdownChange={handleDropdownChange}
        typeList={typeList}
        monthDay={monthDay}
        YearlyMonth={YearlyMonth}
        genders={genders}
        appTypes={appTypes}
        paidTypes={paidTypes}
        setErrors={setErrors}
        isEdit={false}
      />
    </div>
  )
};


export default AddConfig;