import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import Header from "../../components/header/Header";
import TabSection from "../../components/TabSection/TabSection";
import BasicInformationEdit, { BasicConfig } from "./BasicInformation/BasicInformationEdit";
import Official from "./Official/Official";
import Address from "./Address/Address";
import Password from "./Password/Password";

import { removeEmptyStrings } from "../../constants/reusableFun";
import { EmployeeEditAction } from "../../redux/Action/Employee/EmployeeAction";
import { EmployeeDetailsByTypeAction } from "../../redux/Action/Employee/EmployeeAction";
import { useEffect } from "react";
import AccessManagement from "./AccessManagement/AccessManagement";

const Edit = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams({ tab: "Official" });
  const tab = params.get("tab") || "Official";

  const [isEditAvailable, setIsEditAvailable] = useState(true);
  const { employeePersonalDetails } = useSelector((state) => state.employee);

  const BasicCon = BasicConfig();


const initialValues = {
    ...BasicCon.initialValues,

  };

  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,

  });
  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    navigate(`/user/edit?tab=${targetTab}`, { state: location.state });
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Received values:", values);

      const userPayload = removeEmptyStrings({
        name: {
          firstName: values?.firstName,
          lastName: values?.lastName,
        },
        profileImage: values?.profileImage,
        email: values?.email,
        dateOfBirth: values?.dateOfBirth,
        id: values?.id,
      });

      const result = await dispatch(EmployeeEditAction(userPayload));
      if (result?.meta?.requestStatus === "fulfilled") {
        setIsEditAvailable(!isEditAvailable);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };
  useEffect(() => {
    if (tab === "Official" && location.state?._id) {
      dispatch(
        EmployeeDetailsByTypeAction({
          type: "personal",
          body: { id: location.state._id },
        })
      );
    }
    if (tab === "Address" && location.state?._id) {
      dispatch(
        EmployeeDetailsByTypeAction({
          type: "address",
          body: { id: location.state._id },
        })
      );
    }
  }, [tab, location.state?._id, dispatch]);
  return (
    <div className="flex flex-col w-full pb-4 bg-white border border-gray-100 rounded-md overflow-auto">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ submitForm,errors }) => {
          console.log(errors)
          return(
          <>
            <Header
              isBackHandler
              headerLabel="Employee"
              subHeaderLabel="Edit Employee Details"
              handleClick={submitForm}
              isEditAvaliable={isEditAvailable}
              isButton
              handleEdit={() => setIsEditAvailable((prev) => !prev)}
              handleBack={() => {
                navigate("../");
              }}
            />
            <div className="mx-10 flex flex-col gap-4">
              <div className="border-gray-300 pb-2">
                <Form>
                  <BasicInformationEdit isEditAvailable={isEditAvailable} />
                </Form>
              </div>
            </div>
          </>
        )}}
      </Formik>

      <TabSection
        tabs={["Official", "Address", "Password","AccessMangement"]}
        selectedTab={tab}
        handleTabClick={handleTabClick}
      >
        <div className="flex-1 min-h-0 p-2 w-full">
          {tab === "Official" && <Official />}
          {tab === "Address" && <Address />}
          {tab === "Password" && <Password />}
          {
            tab==="AccessMangement" && <AccessManagement/>
          }
        </div>
      </TabSection>
    </div>
  );
};

export default Edit;
