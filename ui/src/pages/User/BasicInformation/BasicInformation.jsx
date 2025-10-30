import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { getTypeOfIndustyAction } from "../../../redux/Action/Global/GlobalAction";
import SingleSelectDropdown from "../../../components/SingleSelectDropdown/SingleSelectDropdown";
import { useFormikContext } from "formik";
import { Form, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import axiosInstance from "../../../config/axiosInstance";
import { Avatar, Typography } from "@material-tailwind/react";
import ProfileImageUploader from "./ProfileImageUploader";
import { ShiftGetAction } from "../../../redux/Action/Shift/ShiftAction";

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

// const settingOptions = [
//   { label: "Branch Setting", value: "branch" },
//   { label: "Shift Setting", value: "shift" },
// ];

//  Exporting field config for Formik in parent
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

// ✅ React component
const BasicInformation = ({ showProfileImage = true, columns = 4 }) => {
  const dispatch = useDispatch();
  const shiftList = useSelector((state) => state.shift?.shiftList || []);
  const { typeOfIndustries = [] } = useSelector((state) => state.global);
  const { values, setFieldValue } = useFormikContext();

  // Filter shifts based on selected branch
  const filteredShifts = values.branchId
    ? shiftList.filter((shift) => shift.branchId === values.branchId)
    : [];

  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
  }, [dispatch]);

  // Fetch shifts when branch is selected
  useEffect(() => {
    if (values.branchId) {
      dispatch(ShiftGetAction({ branchId: values.branchId }));
    }
  }, [dispatch, values.branchId]);

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();
  const [uploadedImage, setUploadedImage] = useState();

  const handleAvatarClick = () => {
    console.log("d");
  };

  function getProfileImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
    const imagePath = path.startsWith("/") ? path : `/${path}`;
    return `${baseURL}${imagePath}`;
  }

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
    const img = await uploadImage(file);
    setUploadedImage(img);
  };

  const uploadImage = async (file) => {
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

      setFieldValue("profileImage", response.data?.data?.imagePath);
    } catch (error) {
      console.error(
        "Image upload failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  useEffect(() => {
    if (values.profileImage) {
      console.log("Updated profile image:", values.profileImage);
    }
  }, [values.profileImage]);

  const [showPwd, setShowPwd] = useState(false);
  const handlePassword = () => {
    setShowPwd(!showPwd);
  };

  return (
    <div className="w-full">
      <SubCardHeader headerLabel={"Basic Information"} />
      <div className="flex flex-col lg:flex-row justify-between py-2 gap-2">
        <div
          className={`text-start grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-${columns} flex-1 flex-wrap gap-6`}
        >
          {/* <FormikInput
            name="employeeId"
            size="sm"
            label="Employee ID"
            inputType="input"
          /> */}
          <FormikInput
            name="firstName"
            size="sm"
            label={"First Name"}
            inputType="input"
          />
          <FormikInput
            name="lastName"
            size="sm"
            label={"Last Name"}
            inputType="input"
          />
          <FormikInput
            name="mobile"
            size="sm"
            label={"Mobile Number"}
            inputType="input"
          />
          <FormikInput
            name="email"
            size="sm"
            label={"Email"}
            inputType="input"
          />
          <FormikInput
            name="password"
            size="sm"
            label={"Password"}
            inputType="input"
            type={showPwd ? "password" : "text"}
            icon={
              showPwd ? (
                <FaEye onClick={handlePassword} />
              ) : (
                <FaEyeSlash onClick={handlePassword} />
              )
            }
          />

          <FormikInput
            name="qualification"
            size="sm"
            label="Qualification"
            inputType="input"
          />
          <FormikInput
            name="emergencyNumber"
            size="sm"
            label="Emergency Contact Number"
            inputType="input"
          />
          <FormikInput
            name="guardianName"
            size="sm"
            label="Guardian Name"
            inputType="input"
          />
          <FormikInput
            name="guardianNumber"
            size="sm"
            label="Guardian Contact Number"
            inputType="input"
          />
          <SingleSelectDropdown
            inputName="Gender"
            listData={genderOptions}
            selectedOption={values.gender}
            selectedOptionDependency="value"
            feildName="label"
            handleClick={(option) => setFieldValue("gender", option.value)}
          />
          <SingleSelectDropdown
            inputName="maritalStatus"
            listData={maritalStatusOptions}
            selectedOption={values.maritalStatus}
            selectedOptionDependency="value"
            feildName="label"
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
            handleClick={(option) => setFieldValue("bloodGroup", option.value)}
          />

          <FormikInput
            name="dateOfBirth"
            size="sm"
            label={"Date Of Birth"}
            inputType="input"
            type="date"
            max={moment().subtract(14, "y").endOf("Year").format("yyyy-MM-DD")}
          />
        </div>

        {showProfileImage && (
          <ProfileImageUploader
            onUpload={uploadImage}
            defaultImage={getProfileImageUrl(values.profileImage)}
          />
        )}
      </div>

      {/* <div className="col-span-full flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          name="salaryConfig"
          className="accent-blue-600"
          checked={values.salaryConfig}
          onChange={(e) => setFieldValue("salaryConfig", e.target.checked)}
        />
        <span className="text-gray-700">
          Would you like to add default salary setting to this employee?
        </span>
      </div> */}
    </div>
  );
};

export default BasicInformation;
