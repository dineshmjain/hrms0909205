import React, { useEffect, useMemo, useState } from "react";
import SingleSelectDropdown from "../SingleSelectDropdown/SingleSelectDropdown";
import Table from "../Table/Table";
import { useSelector } from "react-redux";
import { Switch } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import {
  AddAssignmentAction,
  AssignedModulesAction,
  RemoveAssignmentAction,
} from "../../redux/Action/Assignment/assignmentAction";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction";

const MappingTable = ({ state, tab, pageName, title }) => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedId, setSeletecId] = useState("");
  const dispatch = useDispatch();
  const { branchList } = useSelector((state) => state.branch);
  const { departmentList } = useSelector((state) => state.department);
  const dataList = useSelector((state) => state?.assignedData?.dataList);
  const loading = useSelector((state) => state?.assignedData?.loading);

  const isDesignation = useMemo(() => {
    return tab === "designation" || pageName === "designation";
  }, [tab, pageName]);
  // it helps defining if we are in branch page or tab by which we know we have t load dept list for dropdown and vice-a-versa
  const isBranchPageOrTab = useMemo(() => {
    return tab === "branch" || pageName === "branch";
  }, []);

  const labels = {
    name: { DisplayName: "Name" },
    assign: {
      DisplayName: "Assigned",
      type: "function",
      data: (data, idx) => (
        <Switch
          circleProps={{ className: "ml-5" }}
          checked={data?.assigned}
          color="green"
          onChange={(e) => {
            handleSwitchClick(data, e);
          }}
        />
      ),
    },
  };

  const handleSwitchClick = (data, e) => {
    let primaryId = `${tab}Id`;
    let secoundaryId = `${pageName}Id`;
    let type = isDesignation ? `designation` : `department`;
    let body = {
      [primaryId]: data?._id,
      [secoundaryId]: state?._id,
    };
    if (isDesignation) {
      let ternaryId = isBranchPageOrTab ? `departmentId` : `branchId`;
      body = { ...body, [ternaryId]: selectedId };
    }
    return e?.target?.checked
      ? handleMap({ type, body })
      : handleUnMap({ type, body });
  };

  const handleMap = (data) => {
    dispatch(AddAssignmentAction(data))?.then(({ payload }) => {
      if (payload?.status == 200) {
        getMappingData();
      }
    });
  };

  const handleUnMap = (data) => {
    dispatch(RemoveAssignmentAction(data))?.then(({ payload }) => {
      if (payload?.status == 200) {
        getMappingData();
      }
    });
  };

  const getMappingData = () => {
    let idName = `${pageName}Id`;
    let body = {
      call: tab,
      [idName]: state?._id,
      category: selectedFilter,
      mapedData: tab,
    };
    if (isDesignation) {
      let secoundaryId = isBranchPageOrTab ? "departmentId" : "branchId";
      body = { ...body, [secoundaryId]: selectedId };
      return dispatch(AssignedModulesAction(body));
    } else {
      dispatch(AssignedModulesAction(body));
    }
  };

  useEffect(() => {
    if (isDesignation) {
      let IdName = `${pageName}Id`;
      const updatedParams = {
        mapedData: isBranchPageOrTab ? "department" : "branch",
        category: "assigned",
        [IdName]: state?._id,
      };
      if (!isBranchPageOrTab) {
        dispatch(BranchGetAction(updatedParams))?.then(({ payload }) => {
          setSeletecId(() => payload?.data?.[0]?._id || "");
        });
      } else {
        dispatch(DepartmentGetAction(updatedParams))?.then(({ payload }) => {
          setSeletecId(() => payload?.data?.[0]?._id || "");
        });
      }
    }
  }, []);

  useEffect(() => {
    getMappingData();
  }, [selectedFilter, selectedId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="font-semibold text-lg text-gray-800 ">{title}</div>
      {/* <Header
        subHeaderLabel={false}
        headerLabel={title}
        isButton={false}
        isSubTab={true}
      /> */}

      <div className="flex justify-between flex-wrap gap-4 ">
        <div className="flex items-start justify-start ">
          {["all", "assigned", "unassigned"].map((value, idx) => {
            let rounded =
              idx == 0 ? "rounded-s-lg" : idx == 2 ? "rounded-e-lg" : "";
            return (
              <div key={idx} className="w-full">
                <input
                  type="radio"
                  name="tab"
                  id={value}
                  value={value}
                  checked={selectedFilter === value}
                  onChange={() => setSelectedFilter(value)}
                  className="hidden peer"
                />
                <label
                  htmlFor={value}
                  className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 
        hover:bg-gray-300  peer-checked:bg-primaryLight cursor-pointer peer-checked:text-pop 
          capitalize ${rounded}`}
                >
                  {value}
                </label>
              </div>
            );
          })}
        </div>

        {isDesignation && (
          <SingleSelectDropdown
            hideLabel
            inputName={isBranchPageOrTab ? "Department" : "Branch"}
            selectedOption={selectedId}
            handleClick={(data) => setSeletecId(() => data?._id)}
            selectedOptionDependency="_id"
            feildName="name"
            listData={isBranchPageOrTab ? departmentList : branchList}
          />
        )}
      </div>

      <Table
        tableJson={isDesignation ? (selectedId ? dataList : []) : dataList}
        labels={labels}
        isLoading={loading}
      />
    </div>
  );
};

export default MappingTable;
