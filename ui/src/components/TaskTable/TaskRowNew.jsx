import React, { useState, useEffect } from "react";
import { BiCommentDetail } from "react-icons/bi";
import CircleList from "../DetailsListItems/CircleList";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import { IoPersonAddSharp } from "react-icons/io5";
import Priority from "./Columns/Priority";
import Status from "./Columns/Status";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import SubtaskTable from "./SubtaskTable";
import { deleteTask, updateTask } from "../../Store/Reducers/Task/TaskReducer";
import { useDispatch } from "react-redux";

const TaskRowNew = ({
  key,
  task,
  taskIdx,
  handleTaskChange,
  handleTaskUpdate,
  handleRemoveTask,
  handleAddSubTask,
  handleRemoveSubTask,
  handleGotoProject,
  getModuleByName,
  setCommentTaskId,
  setAssignedData,
  projectData,
  error,
  type,
  modules,
}) => {
  const dispatch = useDispatch();

  // Local state for task details
  const [localTask, setLocalTask] = useState(task);
  const [changedFields, setChangedFields] = useState({});
  const [updateTimeout, setUpdateTimeout] = useState(null);

  useEffect(()=>{
    console.log("i was reneres",taskIdx+1);
    
  })
  useEffect(()=>{
    setLocalTask(task)
  },[task])
  // Handles input changes and updates local state
  const handleLocalChange = (e) => {
    const { name, value } = e.target;

    setLocalTask((prev) => ({
      ...prev,
      [name]: value,
    }));

    setChangedFields((prev) => ({
      ...prev,
      [name]: value, // Track changed fields
    }));

    // Delay the update to Redux to prevent excessive dispatches
    if (updateTimeout) clearTimeout(updateTimeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    if (Object.keys(changedFields).length === 0) return;

    const updateTimeout = setTimeout(() => {
      dispatch(
        updateTask({
          idx: taskIdx,
          changes: changedFields, // Send only changed fields
        })
      );

      setChangedFields({}); // Reset changed fields after update
    }, 1000); // 1 sec delay before Redux update

    return () => clearTimeout(updateTimeout);
  }, [changedFields, dispatch]);

  return (
    <div className="flex flex-col gap-2 p-2 bg-gray-300 rounded-md w-full relative">
      <div className="flex flex-wrap gap-2 justify-between w-full items-center pr-4">
        <input
          className="w-fit bg-transparent hover:bg-gray-400 px-4 p-1 rounded-md font-semibold text-lg outline-none"
          type="text"
          placeholder="Task Name"
          value={localTask?.name}
          name="name"
          onChange={handleLocalChange}
        />
        <div className="flex flex-wrap gap-2 items-center justify-end">
          <div
            className="p-1 hover:bg-gray-400 rounded-md cursor-pointer"
            onClick={() => setCommentTaskId(localTask?._id)}
          >
            <BiCommentDetail className="w-5 h-5" />
          </div>
          <div className="flex">
            <CircleList dataList={localTask?.assignedTo} />
            <TooltipMaterial content="Assign Employee">
              <div
                onClick={() => {
                  if (projectData?.assignedTo?.length > 0) {
                    setAssignedData({ idx: taskIdx });
                  } else {
                    toast.error("Please select employees in project");
                  }
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-100 bg-gray-800 text-white cursor-pointer"
              >
                <IoPersonAddSharp className="w-4 h-4" />
              </div>
            </TooltipMaterial>
          </div>
          <Priority
            subData={localTask}
            handleSubTaskChange={handleLocalChange}
            idx={taskIdx}
          />
          <Status
            subData={localTask}
            handleSubTaskChange={handleLocalChange}
            idx={taskIdx}
          />
          <input
            value={localTask?.startDate}
            onChange={handleLocalChange}
            type="date"
            name="startDate"
            min={projectData?.startDate}
            max={projectData?.endDate}
            className="px-2 hover:bg-gray-400 bg-gray-300 rounded-md"
          />
          <input
            value={localTask?.endDate}
            onChange={handleLocalChange}
            type="date"
            name="endDate"
            min={projectData?.startDate}
            max={projectData?.endDate}
            className="px-2 hover:bg-gray-400 bg-gray-300 rounded-md"
          />
          <div className="absolute right-2 top-4">
            <Menu>
              <MenuHandler>
                <div className="w-4 h-4 cursor-pointer">
                  <BsThreeDotsVertical className="w-4 h-4" />
                </div>
              </MenuHandler>
              <MenuList className="p-0 font-medium text-gray-900">
                <MenuItem
                  onClick={() => {
                    if (type === "update") {
                      return DeleteOnServer(taskIdx);
                    }
                    dispatch(deleteTask(taskIdx));
                  }}
                >
                  <span className="flex items-center gap-2">
                    <MdDelete className="w-4 h-4 text-red-700" />
                    Delete Task
                  </span>
                </MenuItem>
                {!projectData && (
                  <MenuItem
                    onClick={() => handleGotoProject(localTask?.projectId)}
                  >
                    <span className="flex items-center gap-2">
                      Show in project
                    </span>
                  </MenuItem>
                )}
              </MenuList>
            </Menu>
          </div>
        </div>
      </div>
      <textarea
        name="description"
        value={localTask?.description}
        onChange={handleLocalChange}
        className="bg-gray-400 rounded-md px-4 p-2 placeholder-gray-700"
        placeholder="Task Description"
      ></textarea>
      {type !== "update" && (
        <SubtaskTable
          task={localTask}
          modules={modules}
          taskIdx={taskIdx}
          getModuleByName={getModuleByName}
        />
      )}
    </div>
  );
};

export default React.memo(TaskRowNew);
