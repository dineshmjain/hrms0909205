import { TabPanel } from "@material-tailwind/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SingleLine from "../../DetailsListItems/SingleLine";
import { IoSearch } from "react-icons/io5";
import SingleSelectDropdown from "../../SingleSelectDropdown/SingleSelectDropdown";
import { toast } from "react-hot-toast";
import { usePrompt } from "../../../Context/PromptProvider";

const EmployeeSidebar = ({
  assignedData,
  setAssignedData,
  handleUpdate,
  handleSubTaskChange,
  selectedList,
  employeeList,
  pageType,
  limit,
  type,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [serch, setSerch] = useState("");
  const [empFilteredList, setEmpFilteredList] = useState(employeeList);
  const departmentList = useSelector((state) => state?.department?.department);
  const { showPrompt, hidePrompt } = usePrompt();

  const designationList = useSelector(
    (state) => state?.designation?.designation
  );

  const dispatch = useDispatch();

  const handleAddOnServer = async (eidx) => {
    let e = {
      target: {
        name: type == "project" ? "teamMembers" : "assignToUserId",
        value: [empFilteredList?.[eidx]?._id],
      },
    };

    try {
      await handleUpdate(e, assignedData?.idx, assignedData?.subIdx);
      handleAddOnUI(eidx);
    } catch (error) {
      console.log(error);
      toast.error("Couldn't assign User!");
    }
  };

  const handleAddOnUI = (eidx) => {
    let e = {
      target: {
        name: "assignedTo",
        value: [...selectedList, { ...empFilteredList?.[eidx], type: "emp" }],
      },
    };
    handleSubTaskChange(e, assignedData?.idx, assignedData?.subIdx);
  };
  const handleRemoveOnUI = (sidx) => {
    let temp = [...selectedList];
    temp?.splice(sidx, 1);
    let e = {
      target: {
        name: "assignedTo",
        value: [...temp],
      },
    };
    handleSubTaskChange(e, assignedData?.idx, assignedData?.subIdx);
  };

  const handleAsKPrompt = (sidx) => {
    showPrompt({
      heading: "Are You Sure?",
      message: (
        <span>
          <b>{Object?.values(selectedList[sidx]?.name)?.join(" ")}</b> will be
          removed from all task and subtask.{" "}
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            handleRemoveOnServer(sidx);
            return hidePrompt();
          },
        },
        {
          label: "No",
          type: 0,
          onClick: () => {
            return hidePrompt();
          },
        },
      ],
    });
  };
  const handleRemoveOnServer = async (sidx) => {
    let e = {
      target: {
        name: type == "project" ? "removeAssignedUser" : "unAssignUser",
        value: [selectedList?.[sidx]?._id],
      },
    };
    try {
      await handleUpdate(e, assignedData?.idx, assignedData?.subIdx);
      handleRemoveOnUI(sidx);
    } catch (error) {
      toast.error("Couldn't unassign User!");
    }
  };

  useEffect(() => {
    if (selectedList) {
      setSelectedIds((prev) => {
        let temp = selectedList?.map((selected) => {
          return selected?._id;
        });
        return [...temp];
      });
    }
  }, [selectedList]);

  useEffect(() => {
    if (selectedDesignation || selectedDept) {
      let temp = employeeList?.filter((emp) => {
        let shldAdd = false;
        if (selectedDept) {
          shldAdd = emp?.department?.departmentId == selectedDept;
        }
        if (selectedDesignation && shldAdd) {
          shldAdd = emp?.designation?.designationId == selectedDesignation;
        }
        return shldAdd;
      });
      setEmpFilteredList(temp);
    } else {
      setEmpFilteredList(employeeList);
    }
  }, [selectedDesignation, selectedDept, employeeList]);

  return (
    <div
      className="flex flex-col gap-2 w-full font-maprope h-full "
      key={"Employee"}
      value={"Employee"}
    >
      <div
        className="w-full bg-gray-300 px-2 p-1 rounded-md flex items-center gp-2"
        key={"Employee"}
      >
        <input
          type="text"
          className="w-full bg-gray-300 outline-none px-1 placeholder-gray-700 text-gray-900 "
          placeholder="Serch by Name"
          value={serch}
          onChange={(e) => setSerch(e.target.value)}
        />
        <IoSearch className="w-6 h-6" />
      </div>
      <div className="flex gap-2">
        <SingleSelectDropdown
          showSerch={false}
          globalCss={"w-[49%] text-sm maxsm:max-w-[49%]"}
          tailwindCss={"bg-gray-300"}
          inputName="Department"
          selectedOption={selectedDept}
          showTip={false}
          hideLabel={true}
          handleClick={(data) => {
            if (selectedDept == data?._id) {
              return setSelectedDept("");
            }
            setSelectedDept(data?._id);
          }}
          listData={departmentList}
          feildName="name"
          selectedOptionDependency={"_id"}
        />
        <SingleSelectDropdown
          showSerch={false}
          globalCss={"w-[49%] text-sm maxsm:max-w-[49%]"}
          tailwindCss={"bg-gray-300"}
          inputName="Designation"
          selectedOption={selectedDesignation}
          showTip={false}
          hideLabel={true}
          handleClick={(data) => {
            if (selectedDesignation == data?._id) {
              return setSelectedDesignation("");
            }
            setSelectedDesignation(data?._id);
          }}
          listData={designationList}
          feildName="name"
          selectedOptionDependency={"_id"}
        />
      </div>
      <div className="flex gap-2 flex-col flex-1 mb-10 ">
        <div className="flex flex-col gap-2 bg-gray-400 rounded-md p-2 min-h-[250px] h-[40vh] ">
          <span className="text-sm text-center text-gray-900 font-medium">
            Assigned Employees
          </span>
          <div className="flex flex-col gap-2 scrolls overflow-y-scroll ">
            {selectedList?.map((semp, sidx) => {
              return (
                semp?.type == "emp" && (
                  <SingleLine
                    type="remove"
                    idx={sidx}
                    css="bg-gray-200"
                    emp={{ ...semp, type: "emp" }}
                    serchValue={serch}
                    handleClick={() => {
                      if (type == "project" && pageType == "update")
                        return handleAsKPrompt(sidx);
                      if (pageType == "update")
                        return handleRemoveOnServer(sidx);
                      handleRemoveOnUI(sidx);
                    }}
                  />
                )
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-2 bg-gray-400 rounded-md p-2 min-h-[250px] h-[40vh]  ">
          <span className="text-sm text-center text-gray-900 font-medium">
            Unassigned Employees
          </span>
          <div className="flex flex-col gap-2 scrolls overflow-y-scroll">
            {empFilteredList?.map((emp, eidx) => {
              return (
                !selectedIds?.includes(emp?._id) && (
                  <SingleLine
                    emp={{ ...emp, type: "emp" }}
                    idx={eidx}
                    type="add"
                    css="bg-gray-200"
                    serchValue={serch}
                    handleClick={() => {
                      if (limit && selectedList?.length == limit) {
                        return toast?.error(
                          `Max of ${limit} employee(s) can be assigned!`
                        );
                      }
                      if (pageType == "update") return handleAddOnServer(eidx);
                      handleAddOnUI(eidx);
                    }}
                  />
                )
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSidebar;
