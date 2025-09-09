import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { LeaveEditAction, LeaveGetByIdAction } from "../../../redux/Action/Leave/LeaveAction";
import Header from "../../../components/header/Header";
import PolicyForm from "./PolicyForm";
import { LeavePolicyUpdateAction } from "../../../redux/Action/Leave/LeaveAction";

const Edit = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { state } = useLocation();
    const [isEditAvaliable, setIsEditAvaliable] = useState(true);

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
        applyBeforeDays: "",
        applyAfterDays: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const selectedType = typeList.find((item) => item.value === state.cycle.type);
        const selectedDay = monthDay.find((item) => item.value === state.cycle.creditedDay.toString());
        const selectedMonth = YearlyMonth.find((item) => item.value === state.cycle.creditedMonth);
        const selectedGender = genders.find((item) => item.value === state.genderEligibility);
        const selectedAppType = appTypes.find((item) => item.value === state.approval?.type);
        const selectedPaidType = paidTypes.find((item) => item.value === state.isPaid ? "Yes" : "No");
        setForm({
            _id: state._id || "",
            leaveName: state.name || "",
            type: selectedType || "",
            days: state.noOfDays || "",
            appType: selectedAppType || "",
            creditedDay: selectedDay || "",
            creditedMonth: selectedMonth || "",
            gender: selectedGender || "",
            paidType: selectedPaidType,
            eligibleNoOfDays: state.eligibleNoOfDays || "",
            applyBeforeDays: state.approval?.applyBeforeDays || "",
            applyAfterDays: state.approval?.applyAfterDays || "",
        });
    }, []);

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
            [field]: selected || "",
        }));
        setErrors((prev) => ({ ...prev, [field]: null }));
    };

    const validate = () => {
        const temp = {};
        if (!form.leaveName) temp.leaveName = "Name is required";
        setErrors(temp);
        return Object.keys(temp).length === 0;
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            const payload = {
                "_id": form._id,
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
                payload.cycle["creditedMonth"] = form.creditedMonth?.value
            }
            console.log(payload, "edited options");
            const result = await dispatch(LeavePolicyUpdateAction({ ...payload }));
            setIsEditAvaliable(!isEditAvaliable);
            if (result?.meta?.requestStatus === "fulfilled") {
                navigate("/policy/list");
            }
        } catch (error) {
            console.error("Submission Error:", error);
        }
    };
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

    return (
        <div className="flex flex-col w-full flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
            <Header
                isBackHandler={true}
                headerLabel="Edit Policy"
                subHeaderLabel="Edit Policy Details"
                isEditAvaliable={isEditAvaliable}
                handleEdit={() => {
                    setIsEditAvaliable(!isEditAvaliable);
                }}
                 buttonTitle="Edit"
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
                isEditAvaliable={isEditAvaliable}
            />
        </div>
    );
};

export default Edit;