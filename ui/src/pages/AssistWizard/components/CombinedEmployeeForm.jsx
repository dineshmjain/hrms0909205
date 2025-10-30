import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { getTypeOfIndustyAction } from "../../../redux/Action/Global/GlobalAction";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import { Form, useFormikContext } from "formik";
import moment from "moment";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axiosInstance from "../../../config/axiosInstance";
import { Typography } from "@material-tailwind/react";
import { ShiftGetAction } from "../../../redux/Action/Shift/ShiftAction";
import { useLocation } from "react-router-dom";
import { SubOrgListAction } from "../../../redux/Action/SubOrgAction/SubOrgAction";
import { BranchGetAction } from "../../../redux/Action/Branch/BranchAction";
import { DepartmentGetAssignedAction } from "../../../redux/Action/Department/DepartmentAction";
import { DesignationGetAssignedAction } from "../../../redux/Action/Designation/DesignationAction";
import { RoleGetAction } from "../../../redux/Action/Roles/RoleAction";
import { EmployeeOfficialDetailsAction } from "../../../redux/Action/Employee/EmployeeAction";
import Address from "../../User/Address/Address";
const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const maritalStatusOptions = [
  { label: "Single", value: "single" },
  { label: "Married", value: "married" },
];

const bloodGroupOptions = [
  { label: "A+", value: "A+" },
  { label: "A-", value: "A-" },
  { label: "B+", value: "B+" },
  { label: "B-", value: "B-" },
  { label: "O+", value: "O+" },
  { label: "O-", value: "O-" },
  { label: "AB+", value: "AB+" },
  { label: "AB-", value: "AB-" },
];

const settingOptions = [
  { label: "Branch Setting", value: "branch" },
  { label: "Shift Setting", value: "shift" },
];

export const BasicConfig = () => {
  return {
    initialValues: {
      firstName: "",
      lastName: "",
      mobile: "",
      password: "",
      email: "",
      joinDate: moment().format("yyyy-MM-DD"),
      dateOfBirth: "",
      profileImage: "",
      employeeId: "",
      gender: "",
      qualification: "",
      maritalStatus: "",
      bloodGroup: "",
      workTimingType: "",
      shiftIds: [],
      salaryConfig: false,
      emergencyNumber: "",
      guardianNumber: "",
      guardianName: "",
    },
    validationSchema: {
      firstName: Yup.string().required("First Name is required").min(3),
      lastName: Yup.string().required("Last Name is required"),
      mobile: Yup.string()
        .matches("^[6-9][0-9]{9}$", "Not a valid Mobile Number")
        .required("Mobile Number is required"),
      password: Yup.string()
        .required("Password is required")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters"
        ),
      email: Yup.string().matches(
        "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$",
        "Not a valid Email"
      ),
      dateOfBirth: Yup.date()
        .max(
          moment().subtract(14, "years").toDate(),
          "Employee must be at least 14 years old"
        )
        .required("Date Of Birth is required"),
      joinDate: Yup.string().required("Joining Date is required"),
      emergencyNumber: Yup.string().matches(
        "^[6-9][0-9]{9}$",
        "Not a valid Mobile Number"
      ),
      guardianNumber: Yup.string().matches(
        "^[6-9][0-9]{9}$",
        "Not a valid Mobile Number"
      ),
      guardianName: Yup.string().min(
        3,
        "Guardian name must be at least 3 characters"
      ),
    },
  };
};

const CombinedFormWizard = ({
  showProfileImage = true,
  columns = 4,
  isEditAvailable,
}) => {
  const dispatch = useDispatch();
  const shiftList = useSelector((state) => state.shift?.shiftList || []);
  const { typeOfIndustries = [] } = useSelector((state) => state.global);
  const { values, setFieldValue } = useFormikContext();
  const { state } = useLocation();
  const { user } = useSelector((state) => state?.user);
  const { subOrgs } = useSelector((state) => state?.subOrgs);
  const { branchList } = useSelector((state) => state?.branch);
  const { assignedBranchDepartments } = useSelector(
    (state) => state?.department
  );
  const { designationBranchDepartemnt } = useSelector(
    (state) => state?.designation
  );
  const { rolesList } = useSelector((state) => state?.roles);
  const { employeeOfficial } = useSelector((state) => state?.employee);

  const filteredShifts = values.branchId
    ? shiftList.filter((shift) => shift.branchId === values.branchId)
    : [];

  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);

  useEffect(() => {
    if (values.branchId) {
      dispatch(ShiftGetAction({ branchId: values.branchId }));
    }
  }, [dispatch, values.branchId]);

  const [showPwd, setShowPwd] = useState(false);

  const handlePassword = () => {
    setShowPwd(!showPwd);
  };

  useEffect(() => {
    if (state?._id) {
      dispatch(EmployeeOfficialDetailsAction({ id: state._id }));
    } else {
      setFieldValue("subOrgId", "");
      setFieldValue("branchId", "");
      setFieldValue("departmentId", "");
      setFieldValue("designationId", "");
      setFieldValue("joinDate", "");
      setFieldValue("roleId", "");
      setFieldValue("id", "");
      setFieldValue("workTimingType", "");
      setFieldValue("shiftIds", []);
    }
  }, [dispatch, state?._id, setFieldValue]);

  useEffect(() => {
    if (employeeOfficial && state?._id) {
      setFieldValue("roleId", employeeOfficial?.roleId || "");
      setFieldValue("branchId", employeeOfficial?.branchId?.[0] || "");
      setFieldValue("subOrgId", employeeOfficial?.subOrgId || "");
      setFieldValue("departmentId", employeeOfficial?.departmentId || "");
      setFieldValue("designationId", employeeOfficial?.designationId || "");
      setFieldValue(
        "joinDate",
        employeeOfficial?.joinDate
          ? moment(employeeOfficial.joinDate).format("YYYY-MM-DD")
          : ""
      );
      setFieldValue("workTimingType", employeeOfficial?.workTimingType || "");
      setFieldValue("shiftIds", employeeOfficial?.shiftIds || []);
      setFieldValue("id", state._id);
    }
  }, [employeeOfficial, state?._id, setFieldValue]);

  useEffect(() => {
    dispatch(RoleGetAction());
    if (user?.modules?.["suborganization"]?.r) {
      dispatch(SubOrgListAction());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (values?.subOrgId) {
      dispatch(
        BranchGetAction({
          mapedData: "branch",
          orgLevel: true,
          subOrgId: values.subOrgId,
        })
      );
    }
  }, [dispatch, values?.subOrgId]);

  useEffect(() => {
    if (values?.branchId) {
      const params = new URLSearchParams({
        branchId: values.branchId,
        mapedData: "department",
        category: "assigned",
      });
      dispatch(DepartmentGetAssignedAction(params));
    }
  }, [dispatch, values?.branchId]);

  useEffect(() => {
    if (values?.branchId && values?.departmentId) {
      const params = new URLSearchParams({
        branchId: values.branchId,
        department: values.departmentId,
        mapedData: "designation",
        category: "assigned",
      });
      dispatch(DesignationGetAssignedAction(params));
    }
  }, [dispatch, values?.branchId, values?.departmentId]);

  useEffect(() => {
    if (values?.branchId) {
      dispatch(ShiftGetAction({ branchId: values.branchId }));
    }
  }, [dispatch, values?.branchId]);

  return (
    <div className="w-full">
      {/* <SubCardHeader headerLabel={"Basic Information"} /> */}

      {/* Personal Information */}
      <div className="p-6 rounded-lg border border-gray-200 bg-white  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FormikInput
            name="employeeId"
            size="sm"
            label="Employee ID"
            inputType="input"
            floatingLabel
          />
          <FormikInput
            name="firstName"
            size="sm"
            label="First Name"
            inputType="input"
            floatingLabel
          />
          <FormikInput
            name="lastName"
            size="sm"
            label="Last Name"
            inputType="input"
            floatingLabel
          />
          <FormikInput
            name="mobile"
            size="sm"
            label="Mobile Number"
            inputType="input"
            floatingLabel
          />
          <FormikInput
            name="email"
            size="sm"
            label="Email"
            inputType="input"
            floatingLabel
          />
          <div>
            <FormikInput
              name="password"
              size="sm"
              label="Password"
              floatingLabel
              inputType="input"
              type={showPwd ? "text" : "password"}
              icon={
                showPwd ? (
                  <FaEye onClick={handlePassword} className="cursor-pointer" />
                ) : (
                  <FaEyeSlash
                    onClick={handlePassword}
                    className="cursor-pointer"
                  />
                )
              }
            />
          </div>

          <FormikInput
            name="qualification"
            size="sm"
            label="Qualification"
            inputType="input"
            floatingLabel
          />

          <FormikInput
            name="emergencyNumber"
            size="sm"
            label="Emergency Contact"
            inputType="input"
            floatingLabel
          />
          <FormikInput
            name="guardianName"
            size="sm"
            label="Guardian Name"
            inputType="input"
            floatingLabel
          />
          <FormikInput
            name="guardianNumber"
            size="sm"
            label="Guardian Contact"
            inputType="input"
            floatingLabel
          />
          <SingleSelectDropdown
            inputName="Gender"
            listData={genderOptions}
            selectedOption={values.gender}
            selectedOptionDependency="value"
            feildName="label"
            handleClick={(option) => setFieldValue("gender", option.value)}
            hideLabel={true}
          />
          <SingleSelectDropdown
            inputName="Marital Status"
            listData={maritalStatusOptions}
            selectedOption={values.maritalStatus}
            selectedOptionDependency="value"
            feildName="label"
            hideLabel={true}
            handleClick={(option) =>
              setFieldValue("maritalStatus", option.value)
            }
          />
          <SingleSelectDropdown
            inputName="Blood Group"
            listData={bloodGroupOptions}
            selectedOption={values.bloodGroup}
            selectedOptionDependency="value"
            feildName="label"
            hideLabel={true}
            handleClick={(option) => setFieldValue("bloodGroup", option.value)}
          />

          {user?.modules?.["suborganization"]?.r && (
            <FormikInput
              name="subOrgId"
              size="sm"
              label="Organization"
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={subOrgs}
              inputName="Select Organization"
              feildName="name"
              hideLabel
              showTip={false}
              showSerch
              handleClick={(selected) =>
                setFieldValue("subOrgId", selected?._id)
              }
              selectedOption={values?.subOrgId}
              editValue={subOrgs?.find((d) => d._id === values.subOrgId)?.name}
              selectedOptionDependency="_id"
            />
          )}
          <FormikInput
            name="branchId"
            size="sm"
            // label="Branch"
            inputType={isEditAvailable ? "edit" : "dropdown"}
            listData={branchList}
            inputName="Select Branch"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => {
              setFieldValue("branchId", selected?._id);
              setFieldValue("shiftIds", []);
              setFieldValue("workTimingType", "");
              dispatch(ShiftGetAction({ branchId: selected?._id }));
            }}
            selectedOption={values?.branchId}
            editValue={branchList?.find((d) => d._id === values.branchId)?.name}
            selectedOptionDependency="_id"
          />

          <FormikInput
            name="departmentId"
            size="sm"
            // label="Department"
            inputType={isEditAvailable ? "edit" : "dropdown"}
            listData={assignedBranchDepartments}
            inputName="Select Department"
            feildName="name"
            hideLabel={true}
            showTip={false}
            showSerch
            handleClick={(selected) =>
              setFieldValue("departmentId", selected?._id)
            }
            selectedOption={values?.departmentId}
            editValue={
              assignedBranchDepartments?.find(
                (d) => d._id === values.departmentId
              )?.name
            }
            selectedOptionDependency="_id"
          />

          <FormikInput
            name="designationId"
            size="sm"
            // label="Designation"
            inputType={isEditAvailable ? "edit" : "dropdown"}
            listData={designationBranchDepartemnt}
            inputName="Select Designation"
            feildName="name"
            hideLabel={true}
            showTip={false}
            showSerch
            handleClick={(selected) =>
              setFieldValue("designationId", selected?._id)
            }
            selectedOption={values?.designationId}
            editValue={
              designationBranchDepartemnt?.find(
                (d) => d._id === values?.designationId
              )?.name
            }
            selectedOptionDependency="_id"
          />
          <FormikInput
            name="dateOfBirth"
            size="sm"
            label="Date Of Birth"
            inputType="input"
            type="date"
            max={moment().subtract(14, "y").endOf("Year").format("yyyy-MM-DD")}
            floatingLabel
          />

          <FormikInput
            name="joinDate"
            size="sm"
            label="Join Date"
            type="date"
            inputType={isEditAvailable ? "edit" : "input"}
            value={values?.joinDate}
            editValue={values?.joinDate}
            floatingLabel
          />

          <div className="flex flex-wrap gap-2 ">
            {settingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="workTimingType"
                  value={option.value}
                  className="accent-blue-600"
                  checked={values.workTimingType === option.value}
                  onChange={() => {
                    setFieldValue("workTimingType", option.value);
                    if (option.value !== "shift") setFieldValue("shiftIds", []);
                  }}
                  disabled={isEditAvailable}
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          {values.workTimingType === "shift" && (
            <div className="mt-4">
              {!values.branchId ? (
                <p className="text-sm text-gray-500">
                  Please select a branch first to view shifts
                </p>
              ) : filteredShifts.length === 0 ? (
                <p className="text-sm text-orange-600">
                  No shifts available for selected branch
                </p>
              ) : (
                <SingleSelectDropdown
                  inputName="Shift"
                  placeholder="Select Shift"
                  listData={filteredShifts}
                  selectedOption={values.shiftIds[0] || ""}
                  selectedOptionDependency="_id"
                  feildName="name"
                  handleClick={(option) =>
                    setFieldValue("shiftIds", [option._id])
                  }
                  hideLabel={true}
                  disabled={isEditAvailable}
                />
              )}
            </div>
          )}
        </div>
        
      </div>

      {/* Official Information */}
      <Form>
        {/* <div className="p-6 rounded-lg border border-gray-200 bg-white mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Official Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {user?.modules?.["suborganization"]?.r && (
              <FormikInput
                name="subOrgId"
                size="sm"
                label="Organization"
                inputType={isEditAvailable ? "edit" : "dropdown"}
                listData={subOrgs}
                inputName="Select Organization"
                feildName="name"
                hideLabel
                showTip={false}
                showSerch
                handleClick={(selected) =>
                  setFieldValue("subOrgId", selected?._id)
                }
                selectedOption={values?.subOrgId}
                editValue={
                  subOrgs?.find((d) => d._id === values.subOrgId)?.name
                }
                selectedOptionDependency="_id"
              />
            )}

            <FormikInput
              name="branchId"
              size="sm"
              label="Branch"
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={branchList}
              inputName="Select Branch"
              feildName="name"
              hideLabel
              showTip={false}
              showSerch
              handleClick={(selected) => {
                setFieldValue("branchId", selected?._id);
                setFieldValue("shiftIds", []);
                setFieldValue("workTimingType", "");
                dispatch(ShiftGetAction({ branchId: selected?._id }));
              }}
              selectedOption={values?.branchId}
              editValue={
                branchList?.find((d) => d._id === values.branchId)?.name
              }
              selectedOptionDependency="_id"
            />

            <FormikInput
              name="departmentId"
              size="sm"
              label="Department"
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={assignedBranchDepartments}
              inputName="Select Department"
              feildName="name"
              hideLabel
              showTip={false}
              showSerch
              handleClick={(selected) =>
                setFieldValue("departmentId", selected?._id)
              }
              selectedOption={values?.departmentId}
              editValue={
                assignedBranchDepartments?.find(
                  (d) => d._id === values.departmentId
                )?.name
              }
              selectedOptionDependency="_id"
            />

            <FormikInput
              name="designationId"
              size="sm"
              label="Designation"
              inputType={isEditAvailable ? "edit" : "dropdown"}
              listData={designationBranchDepartemnt}
              inputName="Select Designation"
              feildName="name"
              hideLabel
              showTip={false}
              showSerch
              handleClick={(selected) =>
                setFieldValue("designationId", selected?._id)
              }
              selectedOption={values?.designationId}
              editValue={
                designationBranchDepartemnt?.find(
                  (d) => d._id === values?.designationId
                )?.name
              }
              selectedOptionDependency="_id"
            />

            <FormikInput
              name="joinDate"
              size="sm"
              label="Join Date"
              type="date"
              inputType={isEditAvailable ? "edit" : "input"}
              value={values?.joinDate}
              editValue={values?.joinDate}
            />
          </div>
        </div> */}

        {/* Employee Settings */}
        {/* <div className="p-6 rounded-lg border border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Employee Settings
          </h3>

          <div className="flex flex-wrap gap-4 mb-5">
            {settingOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="workTimingType"
                  value={option.value}
                  className="accent-blue-600"
                  checked={values.workTimingType === option.value}
                  onChange={() => {
                    setFieldValue("workTimingType", option.value);
                    if (option.value !== "shift") setFieldValue("shiftIds", []);
                  }}
                  disabled={isEditAvailable}
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>

          {values.workTimingType === "shift" && (
            <div className="mt-4">
              {!values.branchId ? (
                <p className="text-sm text-gray-500">
                  Please select a branch first to view shifts
                </p>
              ) : filteredShifts.length === 0 ? (
                <p className="text-sm text-orange-600">
                  No shifts available for selected branch
                </p>
              ) : (
                <SingleSelectDropdown
                  inputName="Shift"
                  placeholder="Select Shift"
                  listData={filteredShifts}
                  selectedOption={values.shiftIds[0] || ""}
                  selectedOptionDependency="_id"
                  feildName="name"
                  handleClick={(option) =>
                    setFieldValue("shiftIds", [option._id])
                  }
                  hideLabel={true}
                  disabled={isEditAvailable}
                />
              )}
            </div>
          )}
        </div> */}
      </Form>
    </div>
  );
};

export default CombinedFormWizard;
