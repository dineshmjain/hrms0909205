import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Header from "../../components/header/Header";
import SubCardHeader from "../../components/header/SubCardHeader";
import BasicInformation, {
  BasicConfig,
} from "../User/BasicInformation/BasicInformation";
import OfficialForm from "../User/Official/OfficalForm";
import { OfficialConfig } from "../User/Official/OfficialConfig";
import { EmployeeCreateAction } from "../../redux/Action/Employee/EmployeeAction";
import { removeEmptyStrings } from "../../constants/reusableFun";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import Password from "../User/Password/Password";
// Import the Bulk Upload component
import ImportUser from "../User/ImportUser";
import { Card, CardBody, Typography } from "@material-tailwind/react";

const EmployeeCreation = ({ formData, employeeList = [], onSuccess }) => {
  const [selectedOption, setSelectedOption] = useState(""); // "add", "bulk", "skip"
  const { user } = useSelector((state) => state?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const employeeLabel =
    employeeList.length === 0 ? "Add First Employee" : "Add More Employees";
  const basicConfig = BasicConfig();
  const officialConfig = OfficialConfig();

  const initialValues = {
    ...basicConfig.initialValues,
    ...officialConfig.initialValues,
    branchId: formData?.branchId || "", // prefill from wizard
    branchName: formData?.branchName || "",
    subOrgId: formData?.subOrgId || "", // also pass subOrg if needed
  };

  const validationSchema = Yup.object({
    ...basicConfig.validationSchema,
    ...officialConfig.validationSchema,
  });
  useEffect(() => {
    // If subOrgId exists in formData, fetch its branches
    if (formData?.subOrgId) {
      dispatch(
        BranchGetAction({
          mapedData: "branch",
          orgLevel: true,
          subOrgId: formData.subOrgId,
        })
      );
    } else {
      // else fetch all branches
      dispatch(BranchGetAction({ mapedData: "branch" }));
    }
  }, [dispatch, formData?.subOrgId]);
  const handleSubmit = async (values) => {
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
        isSubOrg: !!user?.modules?.["suborganization"]?.r,
      });

      const result = await dispatch(EmployeeCreateAction(payload));
      if (result?.meta?.requestStatus === "fulfilled") {
        // navigate("/user");
      }
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Landing buttons */}
      <div className="w-full flex flex-col items-center text-center gap-4">
        <Typography className="text-primary font-semibold text-[18px] capitalize  ">
          Add Employees
        </Typography>
        <p className="text-gray-600 max-w-full">
          You can add employees individually, upload in bulk, or skip for now.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <button
            onClick={() => setSelectedOption("add")}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              selectedOption === "add"
                ? "bg-blue-700"
                : "bg-primary hover:bg-blue-700"
            }`}
          >
            Add Employee
          </button>

          <button
            onClick={() => setSelectedOption("bulk")}
            className={`px-6 py-2 rounded-md text-white font-medium transition-colors ${
              selectedOption === "bulk"
                ? "bg-green-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Bulk Upload
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 font-medium transition-colors"
          >
            Skip
          </button>
        </div>
        {selectedOption === "add" && (
          <div className="">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              validateOnMount
            >
              {({ submitForm }) => (
                <>
                  <Header handleClick={submitForm} />
                  <div className="flex flex-col md:ml-6 gap-6 mt-4">
                    <div className="pb-4 border-b border-gray-200">
                      <BasicInformation showProfileImage={false} columns={5} />
                    </div>
                    <div className="pt-4">
                      <SubCardHeader headerLabel="Official Information" />
                      <OfficialForm />
                    </div>
                  </div>
                </>
              )}
            </Formik>
          </div>
        )}
        {selectedOption === "bulk" && (
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <ImportUser noRedirect={true} isWizard={true} />
          </div>
        )}
        {console.log("FormData received in EmployeeCreation:", formData)}
        {employeeList.length > 0 && (
          <div className="space-y-3 w-full">
            <Typography variant="h6">Existing Employees</Typography>
            <div className="overflow-x-auto rounded-lg shadow-md border">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Employee Id
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-2 text-center font-semibold text-gray-700">
                      Mobile
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {employeeList.map((emp) => (
                    <tr key={emp._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{emp?.employeeId || "-"}</td>
                      <td className="px-4 py-2">
                        {emp?.name?.firstName} {emp?.name?.lastName}
                      </td>
                      <td className="px-4 py-2">{emp?.email || "-"}</td>
                      <td className="px-4 py-2">{emp?.mobile || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bulk Upload Section */}
      </div>

      {/* Add Employee Form */}
    </div>
  );
};

export default EmployeeCreation;
