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

const Add = () => {
  const { user } = useSelector((state) => state?.user);

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

  const handleSubmit = async (values) => {
    try {
      console.log(values, "recived");

      const userPayload = removeEmptyStrings({
        name: {
          firstName: values?.firstName,
          lastName: values?.lastName,
        },
        // isSubOrg: true,
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
        guardianNumber:values?.guardianNumber,
        emergencyNumber:values?.emergencyNumber,
        guardianName:values?.guardianName,
        isSubOrg: !!user?.modules?.["suborganization"]?.r,

        // ...(values?.isSubOrg ? { isSubOrg: true } : {}), // ← Adds isSubOrg: true if applicable
      });

      console.log("Payload sent to backend:", userPayload);

      const result = await dispatch(EmployeeCreateAction({ ...userPayload }));
      console.log(result?.meta?.requestStatus === "fulfilled");

      if (result?.meta?.requestStatus === "fulfilled") {
        navigate("/user"); // ← Change this to your target route
      }
    } catch (error) {
      console.log(error);
    }
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
