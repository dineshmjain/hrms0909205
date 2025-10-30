import React, { useEffect, useState } from "react";
import { Formik, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Header from "../../components/header/Header";
import SubCardHeader from "../../components/header/SubCardHeader";

import BasicInformation, {
  BasicConfig,
} from "./BasicInformation/BasicInformation";
import AddressNew, { AddressCon } from "../../components/Address/AddressNew";
import {
  BranchCreateAction,
  BranchEditAction,
} from "../../redux/Action/Branch/BranchAction";
import { useSelector } from "react-redux";
import { removeEmptyStrings } from "../../constants/reusableFun";
import TabSection from "../../components/TabSection/TabSection";
import MappingTable from "../../components/MappingTable/MappingTable";
import KYCInformation from "./KYCInformation/KYCInformation";
import MultiMappingTable from "../../components/MappingTable/MultiMappingTable";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";
import toast from "react-hot-toast";
const Edit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.user);
  const { state } = useLocation();
  console.log(state, "editedd");
  const checkMoudles = useCheckEnabledModule();
  const [isEditAvaliable, setIsEditAvaliable] = useState(true);
  // ✅ Load configs
  const BasicCon = BasicConfig();
  const AddressConf = AddressCon();

  // ✅ Combine initial values
  const initialValues = {
    ...BasicCon.initialValues,
    ...AddressConf.initialValues,
  };

  // ✅ Combine Yup schemas correctly using shape() and fields
  const validationSchema = Yup.object({
    ...BasicCon.validationSchema,
    ...AddressConf.validationSchema,
  });

  const [params, setParams] = useSearchParams({ tab: "kyc" });
  const tab = params.get("tab");

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    navigate(`/branch/edit?tab=${targetTab}`, { state });
  };

  const submitForm1 = async (values) => {
    try {
      console.log("full", values);
      const {
        name,
        structuredAddress,
        subOrgId,
        timeSettingType,
        startTime,
        endTime,
        maxIn,
        minOut,
        reportingTime,

        salaryCycle,
        financialYear,
        weekoff,
      } = values;

      const responseData = removeEmptyStrings({
        name,
        subOrgId,
        ...structuredAddress,
        id: state?._id,
        timeSettingType,
        startTime,
        endTime,
        maxIn,
        minOut,
        reportingTime,
        timeSettingType,
        salaryCycle,
        financialYear,
        weekoff,
      });

      console.log(responseData);
      const response = await dispatch(BranchEditAction(responseData));
      const { meta, payload } = response || {};
      console.log(meta);
      setIsEditAvaliable(!isEditAvaliable);
      if (meta?.requestStatus === "fulfilled") {
        navigate(isClient ? -1 : "/branch/list");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col w-full p-2   bg-white border border-gray-100 rounded-md overflow-auto ">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({ submitForm, values }) => (
          <>
            <Header
              isBackHandler={true}
              headerLabel="Edit"
              subHeaderLabel="Edit Branch Details"
              isEditAvaliable={isEditAvaliable}
              handleEdit={() => {
                if (checkMoudles("branch", "u")) {
                  setIsEditAvaliable(!isEditAvaliable);
                } else {
                  toast.error("You don't have permission to edit this branch");
                }
              }}
              handleClick={() => {
                submitForm();
                submitForm1(values);
              }}
              // handleBack={() => {
              //   navigate("../");
              // }}
            />
            <Form>
              <div className="ml-[3rem] flex-col">
                <div className="pb-2  border-gray-200">
                  <BasicInformation
                    isEditAvaliable={isEditAvaliable}
                    isClient={state?.clientMappedId}
                  />
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
      <div className="flex flex-col w-full min-h-screen bg-white border border-gray-100 rounded-md overflow-auto ">
        <TabSection
          tabs={["kyc"]}
          // tabs={["kyc", "department", "designation", "mapping"]}
          selectedTab={tab}
          handleTabClick={handleTabClick}
        >
          {/* Content Area */}
          <div className="flex-1 min-h-0 p-2 w-full">
            {tab === "department" && (
              <MappingTable
                state={state}
                tab={tab}
                pageName={"branch"}
                title={`Map a department to ${state?.name}`}
              />
            )}
            {tab === "designation" && (
              <MappingTable
                state={state}
                tab={tab}
                pageName={"branch"}
                title={`Map a designation to ${state?.name}`}
              />
            )}

            {tab == "kyc" && (
              <div>
                <div className=" flex flex-col gap-4">
                  <KYCInformation tab={"kyc"} />
                </div>
              </div>
            )}

            {tab == "mapping" && (
              <MultiMappingTable state={state} page="branch" />
            )}
          </div>
        </TabSection>
      </div>
    </div>
  );
};

export default Edit;
