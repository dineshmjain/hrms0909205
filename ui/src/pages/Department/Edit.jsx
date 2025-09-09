import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Header from "../../components/header/Header";
import BasicInformation from "./BasicInformation/BasicInformation";
import MappingTable from "../../components/MappingTable/MappingTable";

import {
  Switch,
  Tab,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import { DepartmentEditAction } from "../../redux/Action/Department/DepartmentAction";
import toast from "react-hot-toast";
import MultiMappingTable from "../../components/MappingTable/MultiMappingTable";
import TabSection from "../../components/TabSection/TabSection";

const Edit = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams({ tab: "branch" });
  const navigate = useNavigate();
  const tab = params.get("tab");

  const [isEdit, setIsEdit] = useState(true);
  const [finalData, setFinalData] = useState({});
  const [formValidity, setFormValidity] = useState({
    basicInfo: true,
    kycInfo: true,
    address: true,
  });

 

  const handleTabClick = (targetTab) => {
    setParams({ tab: targetTab });
    nav(`/department/edit?tab=${targetTab}`, { state });
  };

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
            DepartmentEditAction({ ...formData, departmentId: state?._id })
          );
          const { meta, payload } = result || {};
          console.log(meta);

          if (meta?.requestStatus === "fulfilled") {
            // toast.success(
            //   payload?.message || "Department updated successfully!"
            // );
            setIsEdit(!isEdit)
            navigate("/department");
          } else {
            toast.error(payload?.message || "Failed to create department.");
          }
        } catch (error) {
          console.error("Error updated department:", error);
          toast.error("An error occurred while updated the department.");
        }
      }
    } catch (error) {
      toast.error("An error occurred while creating the department.");
    }
  };

  // useEffect(() => {
  //   const el = document.getElementById(tab || "branch");
  //   el?.scrollIntoView({ behavior: "smooth" });
  // }, [tab]);

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
        handleClick={handleSave}
        handleEdit={handleEdit}
        handleBack={() => {
          navigate("../");
        }}
        headerLabel="Department"
        subHeaderLabel="Edit Your Department Details"
      />

      <div className="mx-10 flex flex-col gap-4">
        <div className="border-gray-300 pb-2">
          <BasicInformation
            isEditAvaliable={isEdit}
            state={state}
            onChange={(data) =>
              setFinalData((prev) => ({ ...prev, basicInfo: data }))
            }
            onValidate={(isValid) =>
              setFormValidity((prev) => ({ ...prev, basicInfo: isValid }))
            }
          />
        </div>
      </div>

      {/* <TabSection
        tabs={[]} 
        // tabs={["branch", "designation", "mapping"]}
      //   selectedTab={tab}
      //   handleTabClick={handleTabClick}
      // >
        {/* Content Area */}
        {/* <div className="flex-1 min-h-0 w-full">
          {tab === "designation" && (
            <MappingTable
              state={state}
              tab={tab}
              pageName={"department"}
              title={`Map a designation to ${state?.name} `}
            />
          )}
          {tab === "branch" && (
            <MappingTable
              state={state}
              tab={tab}
              pageName={"department"}
              title={`Map ${state?.name} to a branch`}
            />
          )}
          {tab === "mapping" && (
            <MultiMappingTable state={state} page={"department"} />
          )}
        </div> */}
      {/* </TabSection> */}
    </div>
  );
};

export default Edit;
