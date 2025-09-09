import React, { useState } from "react";
import SingleSelectDropdown from "../../../Components/SingleSelectDropdown/SingleSelectDropdown";
import SideDrawer from "../../../Components/Drawer/SideDrawer";
import Priority from "../../../Components/TaskTable/Columns/Priority";
import { Button } from "@material-tailwind/react";

const ListFilter = ({
  isFilterOpen,
  setIsFilterOpen,
  projectData,
  selectedFilter,
  setSelectedFilter,
  generateRequestBody,
  handleGetTaskList,
}) => {
  const [extraFilters, setExtraFilters] = useState({
    status: "",
    priority: "",
  });
  const statusList = [
    { displayName: "Pending", color: "#fde047", name: "pending" },
    { displayName: "In Progress", color: "#ffa500", name: "inProgress" },
    { displayName: "Completed", color: "#008000", name: "completed" },
  ];
  const priorityList = [
    { color: "#cc2b2b", displayName: "High", name: "high" },
    { color: "#0f27af", displayName: "Medium", name: "medium" },
    { color: "#808080", displayName: "Low", name: "low" },
  ];

  const handleSave = () => {
    let basereqbody = generateRequestBody(selectedFilter);
    let extraReqbody = generateRequestBody(extraFilters);
    let reqbody = { ...basereqbody, ...extraReqbody };
    handleGetTaskList(reqbody);
  };

  return (
    <SideDrawer
      heading={"Task Filters"}
      isOpen={isFilterOpen}
      onClose={() => setIsFilterOpen(false)}
    >
      <div className="flex flex-col gap-2 w-full">
        <SingleSelectDropdown
          listData={statusList}
          feildName="displayName"
          showSerch={false}
          inputName="Status"
          showTip={false}
          selectedOptionDependency={"name"}
          selectedOption={extraFilters?.status}
          handleClick={(data) => {
            setExtraFilters((prev) => {
              return { ...prev, status: data?.name };
            });
          }}
          globalCss={"w-full"}
        />
        <SingleSelectDropdown
          listData={priorityList}
          feildName="displayName"
          showSerch={false}
          inputName="Priority"
          showTip={false}
          selectedOptionDependency={"name"}
          selectedOption={extraFilters?.priority}
          handleClick={(data) => {
            setExtraFilters((prev) => {
              return { ...prev, priority: data?.name };
            });
          }}
          globalCss={"w-full"}
        />

        <div className="flex gap-2">
          <Button
            className="font-manrope"
            size="sm"
            variant="outlined"
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
          <Button
            className="font-manrope drop-shadow-none"
            size="sm"
            variant="outlined"
            color="red"
            onClick={() => {
              setExtraFilters(() => {
                return { projectId: "", status: "", priority: "" };
              });
            }}
          >
            Clear
          </Button>
        </div>
      </div>
    </SideDrawer>
  );
};

export default ListFilter;
