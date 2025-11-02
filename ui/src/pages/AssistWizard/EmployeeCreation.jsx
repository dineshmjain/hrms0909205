import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import CombinedFormWizard from "../AssistWizard/components/CombinedEmployeeForm";
import { BasicConfig } from "../User/BasicInformation/BasicInformation";
import {
  EmployeeCreateAction,
  EmployeeGetAction,
} from "../../redux/Action/Employee/EmployeeAction";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import {
  GetSmsTemplateKeyAction,
  GetSendSmsTemplateAction,
} from "../../redux/Action/Wizard/WizardAction";
import ImportUser from "../User/ImportUser";
import { Typography } from "@material-tailwind/react";
import { Plus, Upload, ArrowRight } from "lucide-react";
import Table from "../../components/Table/Table";
import { MdShare } from "react-icons/md";
import moment from "moment";
import ShareModal from "../../components/ShareModal/ShareModal";
import { CheckCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-50" : "bg-red-50";
  const borderColor =
    type === "success" ? "border-green-200" : "border-red-200";
  const textColor = type === "success" ? "text-green-700" : "text-red-700";
  const iconColor = type === "success" ? "text-green-500" : "text-red-500";

  return (
    <div
      className={`fixed top-4 right-4 z-50 ${bgColor} border ${borderColor} rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md animate-in slide-in-from-top duration-300`}
    >
      {type === "success" && (
        <CheckCircle className={`w-5 h-5 ${iconColor} flex-shrink-0`} />
      )}
      <span className={`${textColor} font-medium text-sm flex-1`}>
        {message}
      </span>
      <button
        onClick={onClose}
        className={`${textColor} hover:opacity-70 flex-shrink-0`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const EmployeeCreation = ({ formData, employeeList = [], onSuccess }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useSelector((state) => state?.user);
  const [toast, setToast] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get employee list and SMS template from Redux
  const {
    employeeList: reduxEmployeeList,
    loading,
    totalRecord,
    limit,
    pageNo,
  } = useSelector((state) => state.employee);

  // Get SMS template key from Redux
  const { smskey } = useSelector((state) => state.wizard);

  const basicConfig = BasicConfig();

  const initialValues = {
    ...basicConfig.initialValues,
    branchId: formData?.branchId || "",
    branchName: formData?.branchName || "",
    subOrgId: formData?.subOrgId || "",
  };

  const validationSchema = Yup.object({
    ...basicConfig.validationSchema,
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch SMS template key on component mount
  useEffect(() => {
    dispatch(GetSmsTemplateKeyAction({ SoftwareID: 17 }));
  }, [dispatch]);

  useEffect(() => {
    if (formData?.subOrgId) {
      dispatch(
        BranchGetAction({
          mapedData: "branch",
          orgLevel: true,
          subOrgId: formData.subOrgId,
        })
      );
    } else {
      dispatch(BranchGetAction({ mapedData: "branch" }));
    }
  }, [dispatch, formData?.subOrgId]);

  // Fetch employee list on mount
  useEffect(() => {
    dispatch(EmployeeGetAction({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const payload = removeEmptyStrings({
        name: {
          firstName: values?.firstName,
          lastName: values?.lastName,
        },
        email: values?.email,
        mobile: values?.mobile,
        joinDate: values?.joinDate,
        dateOfBirth: values?.dateOfBirth,
        password: values?.password,
        profileImage: values?.profileImage,
        branchId: [values?.branchId],
        subOrgId: values?.subOrgId,
        departmentId: values?.departmentId,
        designationId: values?.designationId,
        roleId: values?.roleId,
        martialStatus: values?.martialStatus,
        bloodGroup: values?.bloodGroup,
        qualification: values?.qualification,
        employeeId: values?.employeeId,
        gender: values?.gender,
        workTimingType: values?.workTimingType,
        shiftIds: values?.shiftIds || [],
        salaryConfig: values?.salaryConfig || false,
        emergencyNumber: values?.emergencyNumber,
        guardianNumber: values?.guardianNumber,
        guardianName: values?.guardianName,
        isSubOrg: !!user?.modules?.["suborganization"]?.r,
      });

      const result = await dispatch(EmployeeCreateAction(payload));

      if (result?.payload?.status === 200) {
        // Store the created employee data WITH password for sharing
        const employeeWithPassword = {
          ...result?.payload?.data,
          name: {
            firstName: values?.firstName,
            lastName: values?.lastName,
          },
          email: values?.email,
          password: values?.password, // Store password for sharing
          mobile: values?.mobile,
        };

        // Show success toast
        setToast({
          message: result?.payload?.message || "User Added successfully",
          type: "success",
        });

        // Reset form
        resetForm();

        // Refresh employee list
        dispatch(EmployeeGetAction({ page: 1, limit: 10 }));

        // Open share modal automatically for newly created employee
        setSelectedEmployee(employeeWithPassword);
        setShareModalOpen(true);

        // Optional: Close the form section after success
        setTimeout(() => {
          setSelectedOption("");
        }, 3000);
      } else {
        // Show error toast
        setToast({
          message: result?.payload?.message || "Failed to add employee",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error creating employee:", error);
      setToast({
        message: "Error creating employee",
        type: "error",
      });
    }
  };

  // Handle share button click from table
  const handleShareClick = (employeeData) => {
    setSelectedEmployee(employeeData);
    setShareModalOpen(true);
  };

  // Handle share confirmation
  const handleShareConfirm = async (employeeData) => {
    console.log("Sharing employee:", employeeData);

    // Check if SMS template key is available
    if (!smskey || smskey.length === 0) {
      setToast({
        message: "SMS template not loaded. Please try again.",
        type: "error",
      });
      return;
    }

    // Find the template with key "share_credentials"
    const template = smskey.find((t) => t.key === "share_credentials");

    if (!template) {
      setToast({
        message: "SMS template not found. Please contact admin.",
        type: "error",
      });
      return;
    }

    // Extract employee details
    const fullName = `${employeeData?.name?.firstName || ""} ${
      employeeData?.name?.lastName || ""
    }`.trim();
    const username = employeeData?.mobile || "N/A";
    const password =
      employeeData?.password || "Please contact admin for password";
    const mobile = employeeData?.mobile;

    // Validate mobile number
    if (!mobile) {
      setToast({
        message: "Employee mobile number not found.",
        type: "error",
      });
      return;
    }

    // Check if password is available
    if (!employeeData?.password) {
      setToast({
        message:
          "Password not available. This feature only works for newly created employees.",
        type: "error",
      });
      return;
    }

    // Configure these values as per your application
    const softwareName = "SecurForce"; // Change this to your software name
    const loginUrl = "securforce.com"; // Change this to your login URL

    // let message = template.Message;
    // message = message.replace("{#var#}", fullName); // 1st: Employee Name
    // message = message.replace("{#var#}", softwareName); // 2nd: Software Name
    // message = message.replace("{#var#}", username); // 3rd: Username
    // message = message.replace("{#var#}", password); // 4th: Password
    // message = message.replace("{#var#}", loginUrl); // 5th: Login URL
    let message = template.Message;

    // Replace all {#var#} placeholders with actual values in order
    const replacements = [fullName, softwareName, username, password, loginUrl];
    replacements.forEach((value) => {
      message = message.replace("{#var#}", value);
    });
    // Prepare SMS payload
    const smsPayload = {
      SoftwareID: 17,
      SenderId: "MWBTEC",
      UserId: 0,
      Receiver: [mobile],
      Message: message,
      templateKey: "share_credentials",
    };

    console.log("SMS Payload:", smsPayload);

    // Dispatch the SMS action
    try {
      const result = await dispatch(GetSendSmsTemplateAction(smsPayload));

      if (result?.payload?.status === 200) {
        setShareModalOpen(false);
        setToast({
          message: "Credentials shared successfully via SMS!",
          type: "success",
        });
        // Clear the password from state after successful share
        setSelectedEmployee(null);
      } else {
        setToast({
          message: result?.payload?.message || "Failed to send SMS",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      setToast({
        message: "Error sending SMS. Please try again.",
        type: "error",
      });
    }
  };

  // Table labels configuration
  const labels = {
    firstName: {
      DisplayName: "Name",
      type: "object",
      objectName: "name",
    },
    mobile: { DisplayName: "Mobile" },
    branchName: { DisplayName: "Branch", type: "object", objectName: "branch" },
    workTiming: {
      DisplayName: "Work Timing",
      type: "function",
      data: (data) => {
        const timing = data?.workTiming;
        if (!timing) return "N/A";
        const { name, startTime, endTime } = timing;
        return `${name || ""} (${startTime || "N/A"} - ${endTime || "N/A"})`;
      },
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "function",
      data: (data) => {
        const raw = data?.createdDate;
        return raw ? moment(raw).local().format("DD-MM-YYYY hh:mm A") : "N/A";
      },
    },
  };

  // const actions = [
  //   {
  //     title: "Share",
  //     text: <MdShare className="w-5 h-5 text-primary" />,
  //     onClick: (data) => {
  //       handleShareClick(data);
  //     },
  //   },
  // ];

  const getEmployeeList = (params) => {
    let body = removeEmptyStrings(params);
    console.log("Fetching employees with params:", body);
    dispatch(EmployeeGetAction(removeEmptyStrings(body)));
  };

  const refreshEmployeeList = () => {
    dispatch(EmployeeGetAction({ page: 1, limit: 10 }));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-start text-left gap-4">
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left Section - Title and Description */}
          <div className="flex-1">
            <Typography className="text-primary font-semibold text-[18px] capitalize">
              Add Employees
            </Typography>
            <p className="text-gray-600 mt-2">
              You can add employees individually, upload in bulk, or skip for
              now.
            </p>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <button
              onClick={() => setSelectedOption("add")}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedOption === "add"
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-blue-50 text-blue-600 border-2 border-blue-200 hover:bg-blue-100"
              }`}
            >
              <Plus size={18} />
              <span>Add Employee</span>
            </button>

            <button
              onClick={() => setSelectedOption("bulk")}
              className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedOption === "bulk"
                  ? "bg-green-600 text-white shadow-lg shadow-green-200"
                  : "bg-green-50 text-green-600 border-2 border-green-200 hover:bg-green-100"
              }`}
            >
              <Upload size={18} />
              <span>Bulk Upload</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 bg-gray-100 text-gray-700 border-2 border-gray-200 hover:bg-gray-200"
            >
              <span>Skip</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {selectedOption === "add" && (
          <div className="w-full">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnMount
              validateOnChange
              validateOnBlur
            >
              {({ submitForm, isValid, errors }) => (
                <>
                  <div className="flex flex-col md:ml-6 gap-6 mt-6">
                    <div className="">
                      <CombinedFormWizard />
                    </div>
                  </div>
                  <Header
                    handleClick={submitForm}
                    isValid={isValid}
                    className="mt-0"
                  />
                </>
              )}
            </Formik>
          </div>
        )}

        {selectedOption === "bulk" && (
          <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
            <ImportUser
              noRedirect={true}
              isWizard={true}
              onUploadSuccess={refreshEmployeeList}
            />
          </div>
        )}

        {/* Employee List Table with Pagination */}
        <div className="w-full">
          <div className="flex justify-between items-center p-4 bg-white rounded-lg">
            <div>
              <Typography className="text-gray-900 font-semibold text-[18px]">
                Existing Employees
              </Typography>
            </div>
          </div>

          <Table
            tableJson={reduxEmployeeList}
            labels={labels}
            // actions={actions}
            isLoading={loading}
            hideColumns={true}
            tableName="Employee List"
            hideReload={true}
            paginationProps={{
              totalRecord,
              pageNo,
              limit,
              onDataChange: (page, limit, search = "") => {
                getEmployeeList({ page, limit, search });
              },
            }}
          />
          <ShareModal
            isOpen={shareModalOpen}
            onClose={() => {
              setShareModalOpen(false);
              setSelectedEmployee(null); // Clear selected employee
            }}
            onConfirm={handleShareConfirm}
            employeeData={selectedEmployee}
          />
        </div>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default EmployeeCreation;
