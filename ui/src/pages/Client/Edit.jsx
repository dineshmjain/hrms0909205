import React, { useState } from "react";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Header from "../../components/header/Header";
import TabSection from "../../components/TabSection/TabSection";

import { removeEmptyStrings } from "../../constants/reusableFun";
import { EmployeeEditAction } from "../../redux/Action/Employee/EmployeeAction";
import BasicInformation from "./BasicInformation/BasicInformation";
import TabsContent from "./Tabs/TabsContent";
import { clientEditAction } from "../../redux/Action/Client/ClientAction";
const Edit = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [params, setParams] = useSearchParams({ tab: "clientOwnerDetails" });
  const tab = params.get("tab");

  

  const [isEditAvailable, setIsEditAvailable] = useState(true);

  const employee = useSelector((state) => state?.employeee);

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    id: employee?.data?.id || "",
    // Add more fields if needed
  };

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    navigate(`/client/edit?tab=${targetTab}`, { state });
  };

  const handleSubmit = async (values) => {
    try {
      console.log("Received values:", values);

      const userPayload = removeEmptyStrings({
        name:values?.name,
        orgTypeId:values?.orgTypeId,
        id: values?.id,
        clientId:values?.clientId
      });
console.log(userPayload)
      const result = await dispatch(clientEditAction(userPayload));
      if (result?.meta?.requestStatus === "fulfilled") {
        setIsEditAvailable(!isEditAvailable);
      }
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  return (
    <div className="flex flex-col w-full flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-auto p-2">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ submitForm }) => (
          <>
            <Header
              isBackHandler
              headerLabel="Client"
              subHeaderLabel="Edit Client Details"
              handleClick={submitForm}
              isEditAvaliable={isEditAvailable}
            handleBack={() => {
                navigate("../");
              }}
              isButton
              handleEdit={() => setIsEditAvailable((prev) => !prev)}
            />
            <Form>
              <div className="ml-[3rem] flex-col">
                <div className="pb-2  border-gray-200">
              <BasicInformation isEditAvaliable={isEditAvailable} />
              </div>
              </div>
            </Form>
          </>
        )}
      </Formik>

      <TabSection
        tabs={["clientOwnerDetails","clientBranch","clientShift", "assignEmp","emergencyNo","settings"]}
        selectedTab={tab}
        handleTabClick={handleTabClick}
      >
        <div className="flex-1 flex flex-col gap-2 w-full">
          <TabsContent tab={tab} state={state} />
        </div>
      </TabSection>
    </div>
  );
};

export default Edit;
