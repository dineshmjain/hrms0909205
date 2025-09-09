import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";


import { BranchCreateAction } from "../../../../redux/Action/Branch/BranchAction";
import { clientBranchCreateAction } from "../../../../redux/Action/ClientBranch/ClientBranchAction";
import { removeEmptyStrings } from "../../../../constants/reusableFun";
import BasicForm, { DeviceConfig } from "./BasicForm";
import Header from "../../../../components/header/Header";

const Add = ({ onComplete }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isClient, setIsClient] = useState(false);
  const { active: isSetupMode } = useSelector((state) => state?.setupMode);
  const { user } = useSelector((state) => state?.user);
  const [submitting, setSubmitting] = useState(false);
  console.log(
    user,
    "useruseruseruseruseruseruseruseruseruseruseruseruseruseruseruseruseruseruseruseruseruser"
  );
  // Configs
  const BasicCon = DeviceConfig();
 
  const initialValues = {
    ...BasicCon.initialValues,

  };
  const { subOrgId, ...res } = BasicCon.validationSchema;

  const validationSchema = Yup.object().shape({

    ...res,
   
  });

  // Handle form submit
  const handleSubmit = async (values) => {
    if (submitting) return; // Prevent double dispatch
    setSubmitting(true);
    console.log(values?.isEdit, "edit");
    try {
      console.log(values, "rrrrrrrrrrrrrrrrrrrrrrrrr");
      const { name, branchAddress, subOrgId } = values;

      const payload = removeEmptyStrings({
        name,
        subOrgId,
        clientMappedId: isClient ? state?.clientMappedId : "",
        clientId: isClient ? state?.clientId : "",
        ...branchAddress?.structuredAddress,
      });
      console.log(payload, "final");

      const Action = isClient ? clientBranchCreateAction : BranchCreateAction;
      const response = await dispatch(Action(payload));
      const { meta } = response || {};
      console.log("Action Response:", response);

      if (meta?.requestStatus === "fulfilled") {
        console.log("Navigating after success");
        if (isSetupMode) {
          onComplete?.();
        } else {
          navigate(isClient ? -1 : "/branch/list");
        }
      }
    } catch (error) {
      console.error("Submission Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    setIsClient(!!state?.clientId);
  }, [state]);

 

  return (
    <div className="flex flex-col w-full flex-1 bg-white border border-gray-100 rounded-md shadow-hrms overflow-scroll">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnMount
      >
        {({ submitForm, values, errors }) => {
          console.log(values, errors);
          return (
            <>
              <Header
                isBackHandler={true}
                headerLabel={"Device"}
                subHeaderLabel={
                  isClient ? state?.clientName : "Add Your Device Information"
                }
                handleClick={() => submitForm()}
              />
              <Form>
                <div className="sm:ml-[3rem] p-2 flex-col">
                  <div className="pb-2 border-b-2 border-gray-200">
                    <BasicForm/>
                  </div>
                  
                </div>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default Add;
