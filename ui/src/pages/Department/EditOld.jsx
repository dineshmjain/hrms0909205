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

const Edit = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const [params, setParams] = useSearchParams({ tab: "branch" });
  const navigate = useNavigate();
  const assignedData = useSelector((state) => state.assignments);
  const { branchList } = useSelector((state) => state.branch);
  const { designationList } = useSelector((state) => state.designation);
  const tab = params.get("tab");

  const [isEdit, setIsEdit] = useState(true);
  const [finalData, setFinalData] = useState({});
  const [formValidity, setFormValidity] = useState({
    basicInfo: true,
    kycInfo: true,
    address: true,
  });
  const [selectedId, setSelectedId] = useState();
  const [defaultTab, setDefaultTab] = useState("all");
  const [renderData, setRenderData] = useState([]);

  const tabs = [
    { id: 1, label: "all", value: "all" },
    { id: 2, label: "assigned", value: "assigned" },
    { id: 3, label: "unAssigned", value: "unassigned" },
  ];

  const labels = useMemo(
    () => ({
      name: { DisplayName: "Name" },
      assign: {
        DisplayName: "Assigned",
        type: "function",
        data: (data) => (
          <Switch
            circleProps={{ className: "ml-5" }}
            value={data?.assign}
            color="green"
          />
        ),
      },
    }),
    []
  );

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
            toast.success(
              payload?.message || "Department updated successfully!"
            );
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
    <div className="flex flex-col gap-4 w-full h-full bg-white border border-gray-100 rounded-md p-2 overflow-auto">
      <Header
        buttonTitle="Save"
        isBackHandler
        isEditAvaliable={isEdit}
        isButton
        handleClick={handleSave}
        handleEdit={handleEdit}
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

      <div className="flex maxsm:flex-col gap-4 border-t-2 bg-white shadow-backgroundHover shadow-sm flex-1 overflow-hidden">
        {/* Sidebar Tabs */}
        <div className="flex flex-col maxsm:flex-row scrolls gap-2 p-2 border-r-2 border-gray-300 overflow-auto sm:w-32 md:w-44">
          {["branch", "designation"].map((item) => (
            <div
              key={item}
              id={item}
              className={`flex capitalize items-center justify-between p-2 cursor-pointer rounded-lg ${
                tab === item ? "bg-pop text-white" : "hover:bg-gray-200"
              }`}
              onClick={() => handleTabClick(item)}
            >
              <h2 className="text-sm max-w-[25ch] truncate">{item}</h2>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 p-2 w-full">
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
        </div>
      </div>
    </div>
  );
};

export default Edit;
