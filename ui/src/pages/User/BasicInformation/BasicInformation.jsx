import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../components/input/FormikInput";
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
const settingOptions = [
  { label: "Branch Setting", value: "branch" },
  { label: "Shift Setting", value: "shift" },
];
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
      workTimingType: "", // 'branch' or 'shift'
      shiftIds: [], // store selected shift IDs
      salaryConfig: false, // default false
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
    },
  };
};

// ✅ React component
const BasicInformation = ({ showProfileImage = true, columns = 4 }) => {
  const dispatch = useDispatch();
  const shiftList = useSelector((state) => state.shift?.shiftList || []);
  console.log("Shift List Logs", shiftList);
  // ✅ Use Redux state correctly
  const { typeOfIndustries = [] } = useSelector((state) => state.global);
  const { values, setFieldValue } = useFormikContext();

  // ✅ Fetch dropdown data
  useEffect(() => {
    dispatch(getTypeOfIndustyAction());
    dispatch(ShiftGetAction());
  }, [dispatch]);

  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef();
  const [uploadedImage, setUploadedImage] = useState();
  const handleAvatarClick = () => {
    // fileInputRef.current.click();
    console.log("d");
  };
  function getProfileImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
    const imagePath = path.startsWith("/") ? path : `/${path}`; // Ensure the path starts with /
    console.log(
      `${baseURL}${imagePath}`,
      "======================================recived image"
    );
    return `${baseURL}${imagePath}`; // Combine base URL with image path
  }
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
  useEffect(() => {
    if (values.profileImage) {
      console.log("Updated profile image:", values.profileImage);
    }
  }, [values.profileImage]);
  const [showPwd, setShowPwd] = useState(false);
  const handlePassword = () => {
    setShowPwd(!showPwd);
  };
  // function getProfileImageUrl(path) {
  //   if (!path) return "";
  //   if (path.startsWith("http")) return path;
  //   if (path.startsWith("/hrms")) return path;
  //   return "/hrms" + path;
  // }
  return (
    <div className="w-full">
      <SubCardHeader headerLabel={"Basic Information"} />
      <div className="flex flex-col lg:flex-row justify-between py-2 gap-2">
        <div
          className={`text-start grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-${columns} flex-1 flex-wrap gap-6`}
        >
          <FormikInput
            name="employeeId"
            size="sm"
            label="Employee ID"
            inputType="input"
          />
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
            name="dateOfBirth"
            size="sm"
            label={"Date Of Birth"}
            inputType="input"
            type="date"
            max={moment().subtract(14, "y").endOf("Year").format("yyyy-MM-DD")}
          />

          <FormikInput
            name="qualification"
            size="sm"
            label="Qualification"
            inputType="input"
          />
          <SingleSelectDropdown
            inputName="Gender"
            listData={genderOptions}
            selectedOption={values.gender} // from Formik
            selectedOptionDependency="value"
            feildName="label"
            handleClick={(option) => setFieldValue("gender", option.value)}
          />

          <SingleSelectDropdown
            inputName="maritalStatus"
            listData={maritalStatusOptions}
            selectedOption={values.maritalStatus} // from Formik
            selectedOptionDependency="value"
            feildName="label"
            handleClick={(option) =>
              setFieldValue("maritalStatus", option.value)
            }
          />
          <SingleSelectDropdown
            inputName="Blood Group"
            listData={bloodGroupOptions}
            selectedOption={values.bloodGroup} // from Formik
            selectedOptionDependency="value"
            feildName="label"
            handleClick={(option) => setFieldValue("bloodGroup", option.value)}
          />
        </div>

        {showProfileImage && (
          <ProfileImageUploader
            onUpload={uploadImage}
            defaultImage={getProfileImageUrl(values.profileImage)}
          />
        )}
        {console.log(
          "Final profile image URL:",
          getProfileImageUrl(values.profileImage)
        )}
        {/* <div className="flex flex-col items-center gap-2 min-w-[140px]">
      
          
          <div
                      className="relative w-32 h-32 rounded-full cursor-pointer border-4 border-white shadow-lg hover:shadow-xl transition-shadow duration-300"
                      onClick={handleAvatarClick}
                    >
                      {profileImage ? (
                        <Avatar
                          src={profileImage}
                          alt="Profile"
          
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                          <FaUserCircle className="w-24 h-24 text-gray-400" />
                        </div>
                      )}
                      <FormikInput
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        name={'profileImage'}
                        onChange={handleImageChange}
                      />
                    </div>
                    <span className="text-gray-600 text-sm text-center">
                      Click to upload profile image
                    </span>
        </div> */}
      </div>
      <Typography variant="h6" className="font-semibold text-gray-800 mt-4">
        Employee Settings
      </Typography>
      <div className="col-span-full flex items-center gap-6 mb-4 mt-2 flex-wrap">
        {/* Radio Buttons for Work Timing Type */}
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
                // Reset shift when changing from shift to branch
                if (option.value !== "shift") setFieldValue("shiftIds", []);
              }}
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}

        {/* Shift Dropdown shown only when shift is selected */}
        {values.workTimingType === "shift" && (
          <div className="w-64">
            <SingleSelectDropdown
              inputName="Shift"
              placeholder="Select Shift"
              listData={shiftList}
              selectedOption={values.shiftIds[0] || ""}
              selectedOptionDependency="_id"
              feildName="name"
              handleClick={(option) => setFieldValue("shiftIds", [option._id])}
              hideLabel={true}
            />
          </div>
        )}
      </div>
      <div className="col-span-full flex items-center gap-2 mt-2">
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
      </div>
    </div>
  );
};

export default BasicInformation;
