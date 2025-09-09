import React from "react";
import TooltipMaterial from "../../TooltipMaterial/TooltipMaterial";
import { IoPersonAddSharp } from "react-icons/io5";
import CircleList from "../../DetailsListItems/CircleList";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const AssignedTo = ({
  data,
  idx,
  subData,
  subIdx,
  setAssignedData,
  projectData,
}) => {
  const isSubTask = subIdx !== undefined;
  const { error } = useSelector((state) => state.error);
  const acutalData = isSubTask ? subData : data;

  return (
    <div className="flex gap-1 items-center justify-end w-full ">
      <CircleList dataList={acutalData?.assignedTo ?? []} />
      <TooltipMaterial content="Assign Employee">
        <div
          onClick={() => {
            if (
              isSubTask
                ? data?.assignedTo?.length > 0
                : projectData?.assignedTo?.length > 0
            ) {
              setAssignedData(
                isSubTask ? { subIdx: subIdx, idx: idx } : { idx: idx }
              );
            } else {
              toast.error(
                `Please select employees in ${isSubTask ? `task` : `project`}`
              );
            }
          }}
          className={`w-8 h-8 maxsm:w-7 maxsm:h-7  flex items-center justify-center hover:z-10 rounded-full border-2 prevent-modal-open   border-gray-100 font-semibold bg-gray-800 text-white cursor-pointer 
            ${
              error?.[
                isSubTask ? `assignedTo-${idx}-${subIdx}` : `assignedTo-${idx}`
              ] &&
              `border-red-600 border-2 border-box animate-pulse bg-red-500
`
            }
`}
        >
          <IoPersonAddSharp className="w-4 h-4 maxsm:w-3 maxsm:h-3" />
        </div>
      </TooltipMaterial>
    </div>
  );
};

export default React.memo(AssignedTo);
