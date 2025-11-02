import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Form, useFormikContext } from "formik";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
import { useCheckEnabledModule } from "../../../hooks/useCheckEnabledModule";
import { Typography } from "@material-tailwind/react";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";

// Generate salary day options (1-31)
const salaryDayOptions = Array.from({ length: 31 }, (_, i) => ({
  label: `${i + 1}${getOrdinalSuffix(i + 1)} of the month`,
  value: String(i + 1),
}));

// Helper function for ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

const weekDaysOptions = [
  { label: "Monday", value: "monday" },
  { label: "Tuesday", value: "tuesday" },
  { label: "Wednesday", value: "wednesday" },
  { label: "Thursday", value: "thursday" },
  { label: "Friday", value: "friday" },
  { label: "Saturday", value: "saturday" },
  { label: "Sunday", value: "sunday" },
];

// Month list for financial year dropdowns
const monthList = [
  { _id: "1", name: "January" },
  { _id: "2", name: "February" },
  { _id: "3", name: "March" },
  { _id: "4", name: "April" },
  { _id: "5", name: "May" },
  { _id: "6", name: "June" },
  { _id: "7", name: "July" },
  { _id: "8", name: "August" },
  { _id: "9", name: "September" },
  { _id: "10", name: "October" },
  { _id: "11", name: "November" },
  { _id: "12", name: "December" },
];

export const BasicConfig = () => {
  return {
    initialValues: {
      name: "",
      subOrgId: "",
      timeSettingType: "startEnd",
      startTime: "",
      endTime: "",
      maxIn: "",
      minOut: "",
      salaryCycle: {
        startDay: "",
        endDay: "",
      },
      financialYear: {
        startDate: "",
        endDate: "",
      },
      weekOff: [],
    },
    validationSchema: {
      name: Yup.string().required("Branch Name is required"),
      subOrgId: Yup.string().required("SubOrg Type is required"),
      startTime: Yup.string().required("Start Time is required"),
      endTime: Yup.string()
        .required("End Time is required")
        .test(
          "is-greater",
          "End Time must be after Start Time",
          function (value) {
            const { startTime } = this.parent;
            if (!startTime || !value) return true;
            return value > startTime;
          }
        ),
      maxIn: Yup.number()
        .min(0, "Grace In must be positive")
        .required("Grace In is required"),
      minOut: Yup.number()
        .min(0, "Grace Out must be positive")
        .required("Grace Out is required"),
      salaryCycle: Yup.object().shape({
        startDay: Yup.number()
          .min(1, "Start day must be between 1 and 31")
          .max(31, "Start day must be between 1 and 31")
          .required("Salary Cycle Start Day is required"),
        endDay: Yup.number()
          .min(1, "End day must be between 1 and 31")
          .max(31, "End day must be between 1 and 31")
          .required("Salary Cycle End Day is required"),
      }),
      financialYear: Yup.object().shape({
        startDate: Yup.string().required(
          "Financial Year Start Month is required"
        ),
        endDate: Yup.string().required("Financial Year End Month is required"),
      }),
      weekOff: Yup.array().min(1, "Select at least one week off"),
    },
  };
};

const BasicInformation = ({ isEditAvaliable, isClient }) => {
  const dispatch = useDispatch();
  const { state, search } = useLocation();
  const checkModule = useCheckEnabledModule();
  const { values, setFieldValue, errors, touched } = useFormikContext();
  const { subOrgs, loaded, loading } = useSelector((state) => state.subOrgs);
  const { user } = useSelector((state) => state?.user);
  const { branchkycDetails } = useSelector((state) => state?.branch);

  useEffect(() => {
    if (state) {
      setFieldValue("name", state?.name);
      if (user?.modules?.["suborganization"]?.r) {
        setFieldValue("subOrgId", state?.subOrgId);
      }
      // Pre-fill branch settings if editing
      if (state?.startTime) setFieldValue("startTime", state.startTime);
      if (state?.endTime) setFieldValue("endTime", state.endTime);
      if (state?.maxIn !== undefined) setFieldValue("maxIn", state.maxIn);
      if (state?.minOut !== undefined) setFieldValue("minOut", state.minOut);
      if (state?.salaryCycleType)
        setFieldValue("salaryCycleType", state.salaryCycleType);
      if (state?.salaryCycle) setFieldValue("salaryCycle", state.salaryCycle);
      if (state?.financialYear)
        setFieldValue("financialYear", state.financialYear);
      if (state?.weekOff) setFieldValue("weekOff", state.weekOff);
    }
  }, [dispatch, state]);

  // useEffect(() => {
  //   if (user?.modules?.["suborganization"]?.r) {
  //     dispatch(SubOrgListAction());
  //   }
  // }, [dispatch, user]);
  useEffect(() => {
    console.log("User:", user);
    console.log("User Modules:", user?.modules);
    console.log(
      "SubOrganization Read Permission:",
      user?.modules?.["suborganization"]?.r
    );

    if (user?.modules?.["suborganization"]?.r) {
      console.log("SubOrganization read permission granted");
      dispatch(SubOrgListAction());
    } else {
      console.log("SubOrganization read permission denied");
    }
  }, [dispatch, user]);
  const toggleWeekOff = (day) => {
    const currentWeekOff = values.weekOff || [];
    if (currentWeekOff.includes(day)) {
      setFieldValue(
        "weekOff",
        currentWeekOff.filter((d) => d !== day)
      );
    } else {
      setFieldValue("weekOff", [...currentWeekOff, day]);
    }
  };

  return (
    <div className="w-full">
      <Form>
        <div className="p-2">
          {/* Basic Information Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <FormikInput
              name="name"
              size="sm"
              label={"Branch Name"}
              inputType={isEditAvaliable ? "edit" : "input"}
              editValue={values?.name}
            />
            {!isClient && checkModule("suborganization", "r") && (
              <FormikInput
                name="subOrgId"
                size="sm"
                label={"Organization"}
                inputType={isEditAvaliable ? "edit" : "dropdown"}
                listData={subOrgs}
                inputName={`Select Organization`}
                feildName={"name"}
                hideLabel={true}
                showTip={false}
                showSerch={true}
                handleClick={(selected) => {
                  setFieldValue("subOrgId", selected?._id);
                }}
                selectedOption={values?.subOrgId}
                selectedOptionDependency={"_id"}
                editValue={
                  subOrgs?.filter((d) => d._id == values?.subOrgId)[0]?.name
                }
              />
            )}
          </div>

          {/* Working Hours Section */}

          {/* Working Hours Section */}
          <div className="mt-6">
            <Typography variant="h6" className="text-gray-800 mb-4">
              Working Hours
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <FormikInput
                name="startTime"
                size="sm"
                label="Start Time"
                inputType={isEditAvaliable ? "edit" : "input"}
                type="time"
                editValue={values?.startTime}
              />
              <FormikInput
                name="endTime"
                size="sm"
                label="End Time"
                inputType={isEditAvaliable ? "edit" : "input"}
                type="time"
                editValue={values?.endTime}
              />
              <FormikInput
                name="maxIn"
                size="sm"
                label="Grace In (Minutes)"
                inputType={isEditAvaliable ? "edit" : "input"}
                type="number"
                min="0"
                editValue={values?.maxIn}
              />
              <FormikInput
                name="minOut"
                size="sm"
                label="Grace Out (Minutes)"
                inputType={isEditAvaliable ? "edit" : "input"}
                type="number"
                min="0"
                editValue={values?.minOut}
              />
            </div>
          </div>

          {/* Salary Cycle Section */}
          <div className="col-span-1 md:col-span-2 mt-6">
            <Typography className="text-primary mb-4 font-medium text-[14px] capitalize">
              Salary Cycle
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormikInput
                name="salaryCycle.startDay"
                size="sm"
                label="Salary Cycle Start Day"
                inputType={isEditAvaliable ? "edit" : "input"}
                type="number"
                min="1"
                max="31"
                placeholder="e.g., 25"
                editValue={values?.salaryCycle?.startDay}
              />

              <FormikInput
                name="salaryCycle.endDay"
                size="sm"
                label="Salary Cycle End Day"
                inputType={isEditAvaliable ? "edit" : "input"}
                type="number"
                min="1"
                max="31"
                placeholder="e.g., 24"
                editValue={values?.salaryCycle?.endDay}
              />
            </div>
            {touched.salaryCycle && errors.salaryCycle && (
              <div className="text-red-500 text-sm mt-2">
                {typeof errors.salaryCycle === "string"
                  ? errors.salaryCycle
                  : errors.salaryCycle.startDay || errors.salaryCycle.endDay}
              </div>
            )}
          </div>

          {/* Financial Year Section */}
          <div className="col-span-1 md:col-span-2 mt-6">
            <Typography className="text-primary mb-4 font-medium text-[14px] capitalize">
              Financial Year
            </Typography>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <SingleSelectDropdown
                  feildName="name"
                  listData={monthList}
                  inputName="Start Month"
                  selectedOptionDependency="_id"
                  selectedOption={values.financialYear?.startDate}
                  handleClick={(value) =>
                    setFieldValue("financialYear.startDate", value._id)
                  }
                  hideLabel={true}
                />
                {touched.financialYear?.startDate &&
                  errors.financialYear?.startDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.financialYear.startDate}
                    </p>
                  )}
              </div>

              <div>
                <SingleSelectDropdown
                  feildName="name"
                  listData={monthList}
                  inputName="End Month"
                  selectedOptionDependency="_id"
                  selectedOption={values.financialYear?.endDate}
                  handleClick={(value) =>
                    setFieldValue("financialYear.endDate", value._id)
                  }
                  hideLabel={true}
                />
                {touched.financialYear?.endDate &&
                  errors.financialYear?.endDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.financialYear.endDate}
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Week Off Section */}
          <div className="mt-6">
            <Typography variant="h6" className="text-gray-800 mb-4">
              Week Off Days
            </Typography>
            <div className="flex flex-wrap gap-3">
              {weekDaysOptions.map((day) => (
                <label
                  key={day.value}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer transition-all ${
                    values.weekOff?.includes(day.value)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                  } ${isEditAvaliable ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={values.weekOff?.includes(day.value)}
                    onChange={() =>
                      !isEditAvaliable && toggleWeekOff(day.value)
                    }
                    className="hidden"
                    disabled={isEditAvaliable}
                  />
                  <span className="font-medium">{day.label}</span>
                </label>
              ))}
            </div>
            {touched.weekOff && errors.weekOff && (
              <p className="text-red-500 text-sm mt-2">{errors.weekOff}</p>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicInformation;
