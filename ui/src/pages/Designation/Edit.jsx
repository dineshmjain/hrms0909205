import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/Header";
import BasicInformation from "./BasicInformation/BasicInformation";

import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import toast from "react-hot-toast";
import { DesignationEditAction } from "../../redux/Action/Designation/DesignationAction";
import MappingTable from "../../components/MappingTable/MappingTable";
import TabSection from "../../components/TabSection/TabSection";
import MultiMappingTable from "../../components/MappingTable/MultiMappingTable";
import RoleManagement from "./RoleManagement";

const Edit = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams({ tab: "branch" });
  const nav = useNavigate();
  const tab = params.get("tab");

  const [isEdit, setIsEdit] = useState(true);
  const [finalData, setFinalData] = useState({});
  const [formValidity, setFormValidity] = useState({
    basicInfo: true,
    kycInfo: true,
    address: true,
  });

  // const handleSave = () => {
  //   setIsEdit(!isEdit);
  //   // Optionally validate and submit
  // };

  const fetchTypeList = useCallback(() => {
    const params = { mappedData: "branch", orgLevel: true, subOrgId: "" };
    dispatch(BranchGetAction(params));
  }, [dispatch]);

  const handleSave = async () => {
    try {
      const isAllValid = Object.values(formValidity).every(Boolean);
      console.log(isAllValid, "isAllValid");
      if (!isAllValid) {
        toast.error("Please complete all required fields before saving.");
        return;
      }

      const errors = [];
      const formData = finalData.basicInfo.reduce((acc, field) => {
        if (field.required && !field.value?.toString().trim()) {
          errors.push(`${field.label} is required.`);
        }
        acc[field.key] = field.value;
        return acc;
      }, {});
      console.log(formData, errors);
      if (errors.length > 0) {
        toast.error(errors.join("\n"));
        return;
      } else {
        try {
          console.log("Form submitted:", formData);
          const result = await dispatch(
            DesignationEditAction({ ...formData, designationId: state?._id })
          );
          const { meta, payload } = result || {};
          console.log(meta, payload, "te");

          if (meta?.requestStatus === "fulfilled") {
            // toast.success(payload?.message || 'Designation created successfully!');
            // navigate("/designation");
            setIsEdit(!isEdit)
          } else {
            toast.error(payload?.message || "Failed to create Designation.");
          }
        } catch (error) {
          console.error("Error creating Designation:", error);
          toast.error("An error occurred while creating the Designation.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while creating the Designation.");
    }
  };

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    nav(`/designation/edit?tab=${targetTab}`, { state });
  };

  const handleEdit = () => {
    setIsEdit(!isEdit);
  };
  return (
    <div className="flex flex-col gap-4 w-full pb-4 flex-1 bg-white border border-gray-100 rounded-md p-2 overflow-auto">
      <Header
        buttonTitle="Save"
        isBackHandler
        isEditAvaliable={isEdit}
        isButton
        handleBack={() => {
          navigate("../");
        }}
        handleClick={handleSave}
        handleEdit={handleEdit}
        headerLabel="Designation"
        subHeaderLabel="Edit Your Designation Details"
      />

      <div className="mx-10 flex flex-col gap-4">
        <div className="border-gray-300 pb-2">
          <BasicInformation
            isEditAvaliable={isEdit}
            data={state}
            onChange={(data) =>
              setFinalData((prev) => ({ ...prev, basicInfo: data }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, basicInfo: isValid }))
            }
          />
        </div>
      </div>
      <TabSection
        // tabs={["branch"]}
        // tabs={["branch", "department", "mapping"]}
        tabs={["role"]}
        selectedTab={tab}
        handleTabClick={handleTabClick}
      >
        <div className="flex-1 min-h-0 p-2 w-full h-full">
          {/* {tab === "department" && (
            <MappingTable
              state={state}
              tab={tab}
              pageName={"designation"}
              title={`Map a department to ${state?.name} `}
            />
          )}
          {tab === "branch" && (
            <MappingTable
              state={state}
              tab={tab}
              pageName={"designation"}
              title={`Map ${state?.name} to a branch`}
            />
          )}
          {tab === "mapping" && (
            <MultiMappingTable page="designation" state={state} />
          )} */}
          {
            tab=="role" &&(
              <RoleManagement/>
            )
          }
        </div>
      </TabSection>
    </div>
  );
};

export default Edit;
