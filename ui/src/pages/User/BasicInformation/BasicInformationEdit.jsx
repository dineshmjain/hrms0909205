import { useRef, useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { getTypeOfIndustyAction } from "../../../redux/Action/Global/GlobalAction";
import { useFormikContext } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import axiosInstance from "../../../config/axiosInstance";
import { Avatar } from "@material-tailwind/react";
import ProfileImageUploader from "./ProfileImageUploader";
import { EmployeeDetailsByTypeAction } from "../../../redux/Action/Employee/EmployeeAction";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import { string } from "prop-types";
import { set } from "date-fns";
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
// ✅ Exporting field config for Formik in parent
export const BasicConfig = () => {
  return {
    initialValues: {
      firstName: "",
      lastName: "",
      mobile: "",

      email: "",

      joinDate: moment().format("yyyy-MM-DD"),
      dateOfBirth: moment().subtract(14, "y").format("yyyy-MM-DD"),
      profileImage: "",
      employeeId: "",

      gender: "",

      maritalStatus: "",
      bloodGroup: "",
      workTimingType: "",
      shiftIds: [],
      salaryConfig: false,
      qualification: "",
      emergencyNumber: "",
      guardianNumber: "",
      guardianName: "",
    },
    validationSchema: {
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      mobile: Yup.string()
        .matches("^[6-9][0-9]{9}$", "Not a valid Mobile Number")
        .required("Mobile Number is required"),

      email: Yup.string().email(),

      dateOfBirth: Yup.date()
        .max(
          moment().subtract(14, "years").toDate(),
          "Employee must be at least 14 years old"
        )
        .required("Date Of Birth is required"),

      joinDate: Yup.date().required("Joining Date is required"),
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

// ✅ React component
const BasicInformationEdit = ({ isEditAvailable }) => {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const { employeePersonalDetails } = useSelector((state) => state?.employee);
  useEffect(() => {
    dispatch(
      EmployeeDetailsByTypeAction({
        type: "personal",
        body: { id: state?._id },
      })
    );
  }, [dispatch, state?._id]);
  let baseURL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    setFieldValue("firstName", employeePersonalDetails?.name?.firstName);
    setFieldValue("lastName", employeePersonalDetails?.name?.lastName);
    setFieldValue("mobile", employeePersonalDetails?.mobile);
    setFieldValue("email", employeePersonalDetails?.email);

    setFieldValue("gender", employeePersonalDetails?.gender);
    setFieldValue(
      "dateOfBirth",
      employeePersonalDetails?.dateOfBirth
        ? moment(employeePersonalDetails.dateOfBirth).format("YYYY-MM-DD")
        : ""
    );

    setFieldValue("profileImage", employeePersonalDetails?.profileImage);

    setFieldValue("id", state?._id);
    setFieldValue("employeeId", employeePersonalDetails?.employeeId);
    setFieldValue("bloodGroup", employeePersonalDetails?.bloodGroup);
    setFieldValue("qualification", employeePersonalDetails?.qualification);
    setFieldValue("emergencyNumber", employeePersonalDetails?.emergencyNumber);
    setFieldValue("guardianNumber", employeePersonalDetails?.guardianNumber);
    setFieldValue("guardianName", employeePersonalDetails?.guardianName);
    setFieldValue("gender", employeePersonalDetails?.gender);
  }, [employeePersonalDetails]);
  // console.log(employeePersonalDetails, state?._id);
  // console.log("gender", employeePersonalDetails?.gender);
  // console.log("Employee details received:", employeePersonalDetails);

  // console.log("Profile Image Upload", employeePersonalDetails?.profileImage);

  //  Use Redux state correctly
  const { typeOfIndustries = [] } = useSelector((state) => state.global);

  //  Fetch dropdown data
  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();
  const [uploadedImage, setUploadedImage] = useState();
  const handleAvatarClick = () => {
    // fileInputRef.current.click();
    console.log("d");
  };

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
    const img = await uploadImage(file);
    setUploadedImage(img);
    console.log(img);
  };

  const uploadImage = async (file) => {
    console.log(file, "recived");
    if (!file) {
      console.error("No file provided");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(
        "user/upload/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload successful:", response.data?.data?.imagePath);
      setFieldValue("profileImage", response.data?.data?.imagePath);
    } catch (error) {
      console.error(
        "Image upload failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  };
  const [showPwd, setShowPwd] = useState(false);
  const handlePassword = () => {
    setShowPwd(!showPwd);
  };
  function getProfileImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
    const imagePath = path.startsWith("/") ? path : `/${path}`; // Ensure the path starts with /
    return `${baseURL}${imagePath}`; // Combine base URL with image path
  }

  return (
    <div className="w-full p-2">
      <SubCardHeader headerLabel={"Basic Information"} />
      <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 flex-wrap gap-4">
          {/* <FormikInput
            name="employeeId"
            size="sm"
            label="Employee ID"
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.employeeId}
          /> */}
          <FormikInput
            name="firstName"
            size="sm"
            label={"First Name"}
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.firstName}
          />
          <FormikInput
            name="lastName"
            size="sm"
            label={"Last Name"}
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.lastName}
          />
          <FormikInput
            name="mobile"
            size="sm"
            label={"Mobile Number"}
            // disabled={!isEditAvailable}
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.mobile}
          />
          <FormikInput
            name="email"
            size="sm"
            label={"Email"}
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.email}
          />

          <FormikInput
            name="qualification"
            size="sm"
            label="Qualification"
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.qualification}
          />
          <FormikInput
            name="emergencyNumber"
            size="sm"
            label="Emergency Contact Number"
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.emergencyNumber}
          />
          <FormikInput
            name="guardianName"
            size="sm"
            label="Guardian Name"
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.guardianName}
          />
          <FormikInput
            name="guardianNumber"
            size="sm"
            label="Guardian Contact Number"
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.guardianNumber}
          />
          <FormikInput
            name="gender"
            size="sm"
            label="Gender"
            inputType={isEditAvailable ? "edit" : "dropdown"}
            listData={genderOptions}
            inputName="Select Gender"
            feildName="label"
            hideLabel={true}
            showTip={false}
            showSerch
            handleClick={(option) => setFieldValue("gender", option?.value)}
            selectedOption={values?.gender}
            selectedOptionDependency="value"
            editValue={
              genderOptions?.find((d) => d.value === values?.gender)?.label
            }
          />

          {/* <SingleSelectDropdown
            inputName="Gender"
            hideLabel={true}
            listData={genderOptions}
            selectedOption={values.gender}
            selectedOptionDependency="value"
            feildName="label"
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.gender}
            handleClick={(option) => setFieldValue("gender", option.value)}
          /> */}

          <FormikInput
            name="dateOfBirth"
            size="sm"
            label={"DOB"}
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.dateOfBirth}
            max={moment().subtract(14, "y").endOf("Year").format("yyyy-MM-DD")}
          />

          {/* <SingleSelectDropdown
            inputName="Blood Group"
            hideLabel={true}
            listData={bloodGroupOptions}
            selectedOption={values.bloodGroup}
            selectedOptionDependency="value"
            feildName="label"
            inputType={isEditAvailable ? "edit" : "input"}
            editValue={values?.bloodGroup}
            handleClick={(option) => setFieldValue("bloodGroup", option.value)}
          /> */}
          <FormikInput
            name="bloodGroup"
            size="sm"
            label="Blood Group"
            inputType={isEditAvailable ? "edit" : "dropdown"}
            listData={bloodGroupOptions}
            inputName="Select Blood Group"
            feildName="label"
            hideLabel={true}
            showTip={false}
            showSerch
            handleClick={(option) => setFieldValue("bloodGroup", option?.value)}
            selectedOption={values?.bloodGroup}
            selectedOptionDependency="value"
            editValue={
              bloodGroupOptions?.find((d) => d.value === values?.bloodGroup)
                ?.label
            }
          />
        </div>
        {console.log("ProfileImageUploader defaultImage:", values.profileImage)}
        <ProfileImageUploader
          onUpload={uploadImage}
          defaultImage={getProfileImageUrl(values.profileImage)}
        />
        {console.log(
          "Final profile image URL:",
          getProfileImageUrl(values.profileImage)
        )}
      </div>
    </div>
  );
};

export default BasicInformationEdit;
