import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikInput from "../../../components/Input/FormikInput";
import SubCardHeader from "../../../components/header/SubCardHeader";
import { getTypeOfIndustyAction } from "../../../redux/Action/Global/GlobalAction";
import { useFormikContext } from "formik";
import { Form, useNavigate } from "react-router-dom";
import moment from "moment";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import axiosInstance from "../../../config/axiosInstance";
import { Avatar } from "@material-tailwind/react";
import ProfileImageUploader from "./ProfileImageUploader";

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
      dateOfBirth:Yup.date().max(moment().subtract(14, 'years').toDate(), 'Employee must be at least 14 years old').required("Date Of Birth is required"),
      joinDate: Yup.string().required("Joining Date is required"),
    },
  };
};

// ✅ React component
const BasicInformation = () => {
  const dispatch = useDispatch();

  // ✅ Use Redux state correctly
  const { typeOfIndustries = [] } = useSelector((state) => state.global);
  const { values, setFieldValue } = useFormikContext();

  // ✅ Fetch dropdown data
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
  function getProfileImageUrl(path) {
    if (!path) return "";
    if (path.startsWith("http")) return path;

    const baseURL = import.meta.env.VITE_BASE_URL?.replace(/\/+$/, "");
    const imagePath = path.startsWith("/") ? path : `/${path}`; // Ensure the path starts with /
    console.log(`${baseURL}${imagePath}`,'======================================recived image')
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
      <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 flex-wrap gap-4">
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
        </div>

        <ProfileImageUploader
          onUpload={uploadImage}
          defaultImage={getProfileImageUrl(values.profileImage)}
        />
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
    </div>
  );
};

export default BasicInformation;
