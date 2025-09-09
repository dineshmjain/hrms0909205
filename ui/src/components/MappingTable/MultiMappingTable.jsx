import React, { useEffect, useMemo, useRef, useState } from "react";
import { DepartmentGetAction } from "../../redux/Action/Department/DepartmentAction";
import { DesignationGetAction } from "../../redux/Action/Designation/DesignationAction";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
import { SubOrgListAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import MultiSelectDropdown from "../MultiSelectDropdown/MultiSelectDropdown";
import {
  MultiAssignmentAction,
  MultiUnAssignmentAction,
} from "../../redux/Action/Assignment/assignmentAction";
import { useCheckEnabledModule } from "../../hooks/useCheckEnabledModule";

const MultiMappingTable = ({ page, state }) => {
  const subOrgList = useSelector((state) => state?.subOrgs?.subOrgs);
  const checkModules = useCheckEnabledModule();
  const branchList = useSelector((state) => state?.branch?.branchList);
  const departmentList = useSelector(
    (state) => state?.department?.departmentList
  );
  const designationList = useSelector(
    (state) => state?.designation?.designationList
  );
  let initialData = useRef({});
  const [selectedData, setSelectedData] = useState({
    branch: [],
    department: [],
    designation: [],
    subOrg: [],
  });

  const dispatch = useDispatch();
  const pageData = useMemo(() => {
    return {
      subOrg: {
        mappingData: ["department", "designation"],
      },
      branch: {
        mappingData: ["department", "designation"],
      },
      department: {
        mappingData: ["subOrg", "branch", "designation"],
      },
      designation: {
        mappingData: ["subOrg", "branch", "department"],
      },
    };
  }, []);

  const [selectedPageData, setSelectedPageData] = useState(
    pageData?.[page] || null
  );

  const actionList = {
    department: { data: departmentList, action: DepartmentGetAction },
    designation: { data: designationList, action: DesignationGetAction },
    branch: { data: branchList, action: BranchGetAction },
    subOrg: { data: subOrgList, action: SubOrgListAction },
  };

  const mapAssignedData = (data, name) => {
    let selectedOptions = [];

    data?.forEach((single) => {
      if (single?.assigned) {
        selectedOptions?.push(single?._id);
      }
    });
    initialData.current[name] = selectedOptions;
    setSelectedData((prev) => {
      return { ...prev, [name]: selectedOptions };
    });
  };

  // const handleChange = (e, data, dropdown) => {
  //   let { checked } = e?.target;
  //   setSelectedData((prev) => {
  //     let temp = { ...prev };
  //     let selectedTemp = checked
  //       ? [...temp?.[dropdown], data?._id]
  //       : [...temp?.[dropdown]?.filter((res) => res != data?._id)];
  //     return { ...temp, [dropdown]: selectedTemp };
  //   });
  // };
  const getMappedDiff = (name) => {
    const initial = initialData?.current?.[name] || [];
    const selected = selectedData?.[name] || [];

    const map = selected.filter((id) => !initial.includes(id));
    const unmap = initial.filter((id) => !selected.includes(id));

    return { map, unmap };
  };

  const handleSave = async () => {
    let feildName = `${page}Id`;

    // we are sending all the moudules when any thing is newly mapped
    // but we are sending only the element that is unmapped
    let mapped = {};
    let unMapped = {};
    let selected = {};
    selectedPageData?.mappingData?.forEach((moduleName) => {
      // let name = `${moduleName}s`;
      let { map, unmap } = getMappedDiff(moduleName);
      if (selectedData?.[moduleName]?.length) {
        selected[moduleName] = selectedData?.[moduleName];
      }
      if (map?.length) {
        mapped[moduleName] = map;
      }
      if (unmap?.length) {
        unMapped[moduleName] = unmap;
      }
    });

    try {
      if (Object.keys(mapped)?.length > 0) {
        /// check if any new element was mapped only then send selected obj
        let req = {
          type: page,
          body: { [feildName]: state?._id, ...selected },
        };
        await dispatch(MultiAssignmentAction(req));
      }
      if (Object.keys(unMapped)?.length > 0) {
        let req = {
          type: page,
          body: { [feildName]: state?._id, ...unMapped },
        };
        await dispatch(MultiUnAssignmentAction(req)); // replace this with unmap action once added
      }
      initialData.current = selectedData;
    } catch (error) {
      console.log("error");
    }
  };

  useEffect(() => {
    setSelectedPageData(pageData?.[page] || null);
  }, [page]);

  // dispatch required actions
  useEffect(() => {
    if (!selectedPageData) return;
    selectedPageData?.mappingData?.forEach((item) => {
      if (!actionList?.[item]) return;
      let feildName = `${page}Id`;
      let reqbody = {
        mapedData: item,
        category: "all",
        [feildName]: state?._id,
      };
      dispatch(actionList?.[item]?.action(reqbody))?.then(({ payload }) => {
        if (payload?.status == 200) {
          mapAssignedData(payload?.data, item);
        }
      });
    });
  }, [selectedPageData]);

  if (!selectedPageData) return <></>;

  console.log(selectedData);

  return (
    <div className="flex flex-col gap-4 sm:mt-2 flex-1">
      <div className="flex justify-between items-center gap-5">
        <span className="font-semibold  sm:text-lg text-md text-gray-700 ">
          Map{" "}
          <span className="text-gray-700 capitalize">
            {selectedPageData?.mappingData?.join(" , ")}
          </span>{" "}
          to <span className="text-gray-700">{state?.name}</span>
        </span>
        <button
          className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm hover:text-primary "
          onClick={handleSave}
        >
          Save
        </button>
      </div>

      <div className="flex flex-wrap gap-4 ">
        {selectedPageData?.mappingData?.map((dropdown, idx) => {
          let selectedSubData = actionList?.[dropdown];

          if (dropdown == "subOrg") {
            if (!checkModules("suborganization", "r")) {
              return <></>;
            }
          }

          return (
            <MultiSelectDropdown
              key={idx}
              data={selectedSubData?.data}
              InputName={`Select ${
                dropdown == "subOrg" ? "Organization" : dropdown
              } `}
              Dependency={"_id"}
              selectedData={selectedData?.[dropdown]}
              setSelectedData={setSelectedData}
              setFieldName={dropdown}
            />
          );
        })}
      </div>
    </div>
  );
};

export default React.memo(MultiMappingTable);
