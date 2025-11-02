import React from "react";
import BasicInformation, {
  BasicConfig,
} from "../User/BasicInformation/BasicInformation";
import Header from "../../components/header/Header";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { clientCreateAction } from "../../redux/Action/Client/ClientAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { EmployeeCreateAction } from "../../redux/Action/Employee/EmployeeAction";
// import Official, { OfficialConfig } from './Officaial/Official';
import { removeEmptyStrings } from "../../constants/reusableFun";

import OfficialForm from "./Official/OfficalForm";
import { OfficialConfig } from "./Official/OfficialConfig";
import SubCardHeader from "../../components/header/SubCardHeader";
import { useEffect, useState } from "react";
import {
  GetSmsTemplateKeyAction,
  GetSendSmsTemplateAction,
} from "../../redux/Action/Wizard/WizardAction";
import ShareModal from "../../components/ShareModal/ShareModal";
const Add = () => {
  const { user } = useSelector((state) => state?.user);
  const { smskey } = useSelector((state) => state.wizard);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const BasicCon = BasicConfig();
  const OfficalCon = OfficialConfig();
  // const OfficalCon = OfficialConfig();

  const initialValues = {
    ...BasicCon.initialValues,
    ...OfficalCon.initialValues,
    ...OfficalCon.initialValues,
  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
    ...OfficalCon.validationSchema,
    ...OfficalCon.validationSchema,
  });
  const dispatch = useDispatch();

  // Fetch SMS template key on component mount
  useEffect(() => {
    dispatch(GetSmsTemplateKeyAction({ SoftwareID: 17 }));
  }, [dispatch]);
  // const handleSubmit = async (values) => {
  //   try {
  //     console.log(values, "recived");

  //     const userPayload = removeEmptyStrings({
  //       name: {
  //         firstName: values?.firstName,
  //         lastName: values?.lastName,
  //       },
  //       // isSubOrg: true,
  //       email: values?.email,
  //       mobile: values?.mobile,
  //       joinDate: values?.joinDate,
  //       dateOfBirth: values?.dateOfBirth,
  //       password: values?.password,
  //       profileImage: values?.profileImage,
  //       branchId: [values?.branchId],
  //       subOrgId: values?.subOrgId,
  //       departmentId: values?.departmentId,
  //       designationId: values?.designationId,
  //       roleId: values?.roleId,
  //       martialStatus: values?.martialStatus,
  //       bloodGroup: values?.bloodGroup,
  //       qualification: values?.qualification,
  //       employeeId: values?.employeeId,
  //       gender: values?.gender,
  //       workTimingType: values?.workTimingType,
  //       shiftIds: values?.shiftIds || [],
  //       salaryConfig: values?.salaryConfig || false,
  //       guardianNumber: values?.guardianNumber,
  //       emergencyNumber: values?.emergencyNumber,
  //       guardianName: values?.guardianName,
  //       isSubOrg: !!user?.modules?.["suborganization"]?.r,

  //       // ...(values?.isSubOrg ? { isSubOrg: true } : {}), // ← Adds isSubOrg: true if applicable
  //     });

  //     console.log("Payload sent to backend:", userPayload);

  //     const result = await dispatch(EmployeeCreateAction({ ...userPayload }));
  //     console.log(result?.meta?.requestStatus === "fulfilled");

  //     if (result?.meta?.requestStatus === "fulfilled") {
  //       // Store the created employee data WITH password for SMS sharing
  //       const employeeWithPassword = {
  //         ...result?.payload?.data,
  //         name: {
  //           firstName: values?.firstName,
  //           lastName: values?.lastName,
  //         },
  //         email: values?.email,
  //         password: values?.password,
  //         mobile: values?.mobile,
  //       };

  //       // Show success toast
  //       setToast({
  //         message: result?.payload?.message || "Employee created successfully",
  //         type: "success",
  //       });

  //       // Send SMS with credentials
  //       await sendCredentialsSMS(employeeWithPassword);

  //       // Navigate after success
  //       setTimeout(() => {
  //         navigate("/user");
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Handle share confirmation from modal
  const handleShareConfirm = async (employeeData) => {
    console.log("Sharing employee:", employeeData);

    // Check if SMS template key is available
    if (!smskey || smskey.length === 0) {
      console.error("SMS template not loaded");
      return;
    }

    // Find the template with key "share_credentials"
    const template = smskey.find((t) => t.key === "share_credentials");

    if (!template) {
      console.error("Template 'share_credentials' not found");
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
      console.error("Employee mobile number not found");
      return;
    }

    // Check if password is available
    if (!employeeData?.password) {
      console.error("Password not available");
      return;
    }

    // Configure these values as per your application
    const softwareName = "SecurForce"; // Change this to your software name
    const loginUrl = "securforce.com"; // Change this to your login URL

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
        console.log("SMS sent successfully");
        // Clear the password from state after successful share
        setSelectedEmployee(null);
      } else {
        console.error(
          "Failed to send SMS:",
          result?.payload?.message || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const handleSubmit = async (values) => {
    try {
      console.log(values, "received");

      const userPayload = removeEmptyStrings({
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
        guardianNumber: values?.guardianNumber,
        emergencyNumber: values?.emergencyNumber,
        guardianName: values?.guardianName,
        isSubOrg: !!user?.modules?.["suborganization"]?.r,
      });

      console.log("Payload sent to backend:", userPayload);

      const result = await dispatch(EmployeeCreateAction({ ...userPayload }));
      console.log(result?.meta?.requestStatus === "fulfilled");

      if (result?.meta?.requestStatus === "fulfilled") {
        // Store the created employee data WITH password for SMS sharing
        const employeeWithPassword = {
          ...result?.payload?.data,
          name: {
            firstName: values?.firstName,
            lastName: values?.lastName,
          },
          email: values?.email,
          password: values?.password,
          mobile: values?.mobile,
        };

        // Open share modal automatically for newly created employee
        setSelectedEmployee(employeeWithPassword);
        setShareModalOpen(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full h-screen bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ submitForm, values, setFieldValue }) => (
          <>
            {/*  Pass Formik handleSubmit to Header */}
            <Header
              isBackHandler={true}
              headerLabel={"Employee"}
              subHeaderLabel={"Add Employee Details"}
              handleClick={() => {
                submitForm();
              }}
            />

            <div className="md:ml-[3rem] flex-col">
              <div className="pb-2 border-b-2 flex-col border-gray-200">
                <Form>
                  <BasicInformation />

                  <div className="ml-2">
                    <SubCardHeader headerLabel="Official Information" />
                  </div>
                  <OfficialForm />
                  <ShareModal
                    isOpen={shareModalOpen}
                    onClose={() => {
                      setShareModalOpen(false);
                      setSelectedEmployee(null);
                      navigate("/user");
                    }}
                    onConfirm={handleShareConfirm}
                    employeeData={selectedEmployee}
                  />
                </Form>
              </div>
            </div>
          </>
        )}
      </Formik>
    </div>
  );
};

export default Add;
