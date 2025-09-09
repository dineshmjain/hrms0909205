import React, { useEffect, useState, memo } from "react";
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
import { IoIosArrowDown } from "react-icons/io";
import { TbSubtask } from "react-icons/tb";

import { useDispatch, useSelector } from "react-redux";
import {
  SubTaskDeleteAction,
  SubTaskListAction,
  SubTaskUpdateAction,
  TaskDeleteAction,
  TaskUpdateAction,
} from "../../Store/Actions/task/task";
import moment from "moment";
import { getProjectListApi } from "../../apis/project/project";
import { useNavigate } from "react-router-dom";
import { usePrompt } from "../../Context/PromptProvider";
import AssignSidebar from "./AssignSidebar";
import ListFilter from "../../Pages/Tasks/ListPages/ListFilter";
import DetailedView from "../../Pages/Tasks/DetailedView/DetailedView";
import { addError, removeError } from "../../Store/Reducers/error/ErrorReducer";
import Chips from "../Chips/Chips";

const TaskRow = ({
  task,
  taskIdx,
  handleTaskChange,
  handleTaskUpdate,
  handleRemoveTask,
  setCommentTaskId,
  setAssignedData,
  projectData,
  setTaskList,
  type,
  modules,
  assignedData,
  handleSubTaskValidate,
  handleValidateTask,
  handleAssignNewSubTask,
  handleSubtaskUpdateFirst,
  setProjectData,
}) => {
  const [showSubtask, setShowSubtask] = useState(
    type == "create" || !task?._id
  );
  const dontUpdateOnChange = ["assignedTo", "subTaskData", "taskType"]; //feilds to be ignored for change on update
  const updateOnChange = ["priority", "status", "dueBy"]; //feilds to be updpated while it being changed
  const initialSubTaskData = {
    name: "Sub task #1",
    assignedTo: [],
    dueBy: "",
    priority: "high",
    description: "description",
    taskType: "oneTime",
    status: "pending",
  };
  const [loadingSubtask, setLoadingSubtask] = useState(false);
  const [selectedTaskData, setSelectedTaskData] = useState(null);
  const branchList = useSelector((state) => state?.branch?.branch);
  const [subTaskUpdatedFeildData, setSubTaskUpdatedFeildData] = useState([]);
  const { showPrompt, hidePrompt } = usePrompt();
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.error);
  const handleAddSubTask = (taskIdx) => {
    if (handleValidateTask(task, taskIdx)) {
      setTaskList((prev) => {
        let temp = [...prev];
        let selectedTask = {
          ...temp[taskIdx],
          subTaskData: [
            ...temp[taskIdx]?.subTaskData,
            { ...initialSubTaskData },
          ],
        };
        temp?.splice(taskIdx, 1, selectedTask);
        return [...temp];
      });
    }
  };

  const removeSubTaskFromUI = (taskIdx, subTaskIdx) => {
    setTaskList((prev) => {
      let temp = [...prev];
      let selectedTask = { ...temp[taskIdx] };
      let subTaskList = selectedTask?.subTaskData;

      subTaskList?.splice(subTaskIdx, 1);

      selectedTask = { ...selectedTask, subTaskData: [...subTaskList] };
      temp?.splice(taskIdx, 1, selectedTask);
      return [...temp];
    });
  };

  const handleValidateSubTaskValue = (idx, subIdx, feild, value) => {
    let tempErrors = {};
    let isSubmittable = true;

    if (value instanceof Array) {
      if (value?.length == 0) {
        tempErrors[`${feild}-${idx}-${subIdx}`] = "This feild is required";
        isSubmittable = false;
      }
    }
    if (value instanceof Object) {
      Object.values(value)?.forEach((value) => {
        if (!value) {
          tempErrors[`${feild}-${idx}-${subIdx}`] = "This feild is required";
          isSubmittable = false;
        }
      });
    } else if (!value) {
      tempErrors[`${feild}-${idx}-${subIdx}`] = "This feild is required";
      isSubmittable = false;
    }
    dispatch(addError(tempErrors));
    return isSubmittable;
  };

  

  const handleRemoveSubTask = (taskIdx, subTaskIdx) => {
    if (task?.subTaskData[subTaskIdx]?._id) {
      return showPrompt({
        heading: "Are You Sure?",
        message: (
          <span>
            <b>{task?.subTaskData[subTaskIdx]?.name}</b> would be deleted.{" "}
          </span>
        ),
        buttons: [
          {
            label: "Yes",
            type: 1,
            onClick: () => {
              dispatch(
                SubTaskDeleteAction({
                  _id: task?.subTaskData[subTaskIdx]?._id,
                  taskId: task?._id,
                })
              )?.then(({ payload }) => {
                if (payload?.status == 200) {
                  removeSubTaskFromUI(taskIdx, subTaskIdx);
                } else {
                  toast.error("Error Deleting Subtask");
                }
              });

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
    }
    removeSubTaskFromUI(taskIdx, subTaskIdx);
  };

  const handleSubTaskChange = (e, taskIdx, subTaskIdx) => {
    return new Promise((resolve, reject) => {
      try {
        let { name, value } = e?.target;

        if (
          task?.subTaskData?.[subTaskIdx]?._id &&
          !subTaskUpdatedFeildData?.includes(`${name}-${subTaskIdx}`) &&
          !dontUpdateOnChange?.includes(name) &&
          handleValidateSubTaskValue(taskIdx, subTaskIdx, name, value)
        ) {
          setSubTaskUpdatedFeildData((prev) => [
            ...prev,
            `${name}-${subTaskIdx}`,
          ]);
        }

        setTaskList((prev) => {
          let temp = [...prev];
          let task = { ...temp?.[taskIdx] };
          let subTasks = [...task?.subTaskData];
          let subTask = { ...subTasks[subTaskIdx], [name]: value };

          if (type == "update" && !subTask?._id) {
            if (handleSubTaskValidate(task, taskIdx, subTask, subTaskIdx)) {
              handleAssignNewSubTask(task, taskIdx, subTask, subTaskIdx);
            }
          }

          subTasks.splice(subTaskIdx, 1, subTask);
          task = { ...task, subTaskData: subTasks };
          temp?.splice(taskIdx, 1, task);

          return [...temp];
        });

        if (error?.[`${name}-${taskIdx}-${subTaskIdx}`]) {
          dispatch(removeError(`${name}-${taskIdx}-${subTaskIdx}`));
        }

        resolve({ success: true, updatedField: name, value });
      } catch (err) {
        reject(err);
      }
    });
  };

  const handleGetProjectData = async (projectId) => {
    try {
      const data = await getProjectListApi({
        projectId,
      });
      if (data?.data?.length >= 1) {
        return { ...data?.data[0] };
      } else {
        throw toast.error("Project not found");
      }
    } catch (error) {
      throw toast.error("Error finding project");
    }
  };

  const handleGotoProject = async (projectId) => {
    // check if breanch is of a client
    let isClientBranch = "";
    branchList?.forEach((branch) => {
      if (branch?._id == task?.branchId) {
        isClientBranch = branch?.clientId ?? "";
      }
    });

    const data = await handleGetProjectData(projectId);

    nav("../edit", {
      state: {
        selectedProject: { ...data, clientId: isClientBranch },
      },
    });
  };

  const handleGetShowSubtask = () => {
    if (type === "create") {
      return setShowSubtask(true);
    }
    setLoadingSubtask(true);
    dispatch(SubTaskListAction({ taskId: task?._id }))?.then(({ payload }) => {
      if (payload?.status == 200) {
        let temp = payload?.data.map((task) => {
          let assignedTo = task?.assignToUserId?.map((member) => {
            let { userId, ...rest } = member;
            return { ...rest, type: "emp", _id: member?.userId };
          });
          let dueBy = task?.dueBy;
          if (task?.taskType == "oneTime") {
            dueBy = moment(task?.dueBy).format("YYYY-MM-DD");
          }
          return { ...task, assignedTo, dueBy };
        });
        console.log(temp);

        let e = {
          target: {
            name: "subTaskData",
            value: temp,
          },
        };
        handleTaskChange(e, taskIdx);
        setShowSubtask(true);
      }
    });
    setLoadingSubtask(false);
  };

  const handleSubtaskUpdate = (e, idx, subIdx) => {
    let { name, value } = e?.target;
    // if already on server (has subtask id) then addto updated feild so we can called update api later
    if (
      task?.subTaskData?.[subIdx]?._id &&
      subTaskUpdatedFeildData?.includes(`${name}-${subIdx}`)
    ) {
      let reqbody = {
        // projectId: task?.subTaskData[subIdx]?.projectId,
        taskId: task?.subTaskData?.[subIdx]?.taskId,
        [name]: value,
      };
      if (name == "dueBy") {
        reqbody.taskType = task?.subTaskData?.[subIdx]?.taskType;
      }
      dispatch(
        SubTaskUpdateAction({
          query: task?.subTaskData[subIdx]?._id,
          reqbody,
        })
      )?.then(() => {
        setSubTaskUpdatedFeildData((prev) => {
          return prev.filter((data) => data != `${name}-${subIdx}`);
        });
      });
    }
  };

  const handleParseAndsetProjectData = (data) => {
    let assignedTo = data?.teamMembers?.map((member) => {
      let { userId, ...rest } = member;
      return { ...rest, type: "emp", _id: member?.userId };
    });
    setProjectData((prev) => {
      let temp = { ...data };
      temp.assignedTo = assignedTo;
      temp.startDate = moment(temp.startDate).format("YYYY-MM-DD");
      temp.endDate = moment(temp.endDate).format("YYYY-MM-DD");
      return { ...temp };
    });
  };

  const handleParentClicked = async (event) => {
    // Ensure the click happened on the parent, not a child

    if (event.target === event.currentTarget) {
      setSelectedTaskData({ idx: taskIdx });
      if (type == "list" && projectData?._id != task?.projectId) {
        try {
          let data = await handleGetProjectData(task?.projectId);
          setTimeout(() => {
            handleParseAndsetProjectData(data);
          }, 500);
        } catch {
          setProjectData(null);
        }
      }
    }
  };

  useEffect(() => {
    subTaskUpdatedFeildData?.forEach((FeildName) => {
      let [feild, subIdx] = FeildName.split("-");
      if (updateOnChange?.includes(feild)) {
        let e = {
          target: {
            name: feild,
            value: task?.subTaskData?.[subIdx]?.[feild],
          },
        };

        handleSubtaskUpdate(e, taskIdx, subIdx);
      }
    });
  }, [subTaskUpdatedFeildData]);

  // useEffect(() => {
  //   console.log("i was changed", taskIdx);
  // }, [
  //   task,
  //   taskIdx,
  //   handleTaskChange,
  //   // handleTaskUpdate,
  //   // handleRemoveTask,
  //   // setCommentTaskId,
  //   // setAssignedData,
  //   // projectData,
  //   // setTaskList,
  //   type,
  //   modules,
  //   // assignedData,
  //   // handleSubTaskValidate,
  //   // handleValidateTask,
  //   // handleAssignNewSubTask,
  //   // handleSubtaskUpdateFirst,
  // ]);

  return (
    <div
      className="flex flex-col gap-2 p-2  bg-gray-300 rounded-md w-full relative maxsm:text-sm "
      key={taskIdx}
    >
      {selectedTaskData && (
        <DetailedView
          taskData={task}
          taskIdx={taskIdx}
          subTask={task?.subTaskData?.[selectedTaskData?.subIdx]}
          subTaskIdx={selectedTaskData?.subIdx}
          setTaskData={setSelectedTaskData}
          handleTaskUpdate={handleTaskUpdate}
          handleTaskChange={handleTaskChange}
          setCommentTaskId={setCommentTaskId}
          setAssignedData={setAssignedData}
          projectData={projectData}
          handleSubTaskChange={handleSubTaskChange}
          handleSubtaskUpdate={handleSubtaskUpdate}
          handleAddSubTask={handleAddSubTask}
          handleRemoveSubTask={handleRemoveSubTask}
          handleGetShowSubtask={handleGetShowSubtask}
          loadingSubtask={loadingSubtask}
          type={type}
          setLoadingSubtask={setLoadingSubtask}
          modules={modules}
        />
      )}

      {/* /** sub task Assign sie bar */}
      {assignedData?.hasOwnProperty("subIdx") &&
        taskIdx == assignedData?.idx && (
          <AssignSidebar
            assignedData={assignedData}
            type={"subtask"}
            setAssignedData={setAssignedData}
            pageType={
              //check if _id exist to know if we are creating or updating
              task?.subTaskData?.[assignedData?.subIdx]?._id
                ? "update"
                : "create"
            }
            parentData={task?.assignedTo}
            handleSubTaskChange={handleSubTaskChange}
            handleUpdate={handleSubtaskUpdateFirst}
            selectedList={task?.subTaskData[assignedData?.subIdx]?.assignedTo}
          />
        )}
      <div
        className="flex flex-wrap gap-2 justify-between w-full items-center pr-4"
        onClick={handleParentClicked}
      >
        <input
          className={`w-fit maxsm:w-full bg-transparent hover:bg-gray-400 px-4 p-1 rounded-md font-semibold text-lg outline-none focus:bg-gray-400 ${
            error?.[`name-${taskIdx}`] && `border-red-600 border-2 border-box `
          }`}
          type="text"
          placeholder="Task Name"
          value={task?.name}
          name="name"
          onChange={(e) => handleTaskChange(e, taskIdx)}
          onBlur={(e) => {
            handleTaskUpdate(e, taskIdx);
          }}
        />
        <div className="flex flex-wrap gap-2 items-center justify-end">
          {type == "list" && (
            <Chips
              text={task?.projectName}
              color={`#6875F5`}
              css={`text-xs font-medium`}
            />
          )}
          <div
            className="p-1 hover:bg-gray-400 rounded-md cursor-pointer"
            onClick={() => setCommentTaskId({ taskId: task?._id })}
          >
            <BiCommentDetail className="w-5 h-5  " />
          </div>
          <div className="flex ">
            <CircleList dataList={task?.assignedTo} />
            <TooltipMaterial content="Assign Employee">
              <div
                onClick={() => {
                  if (projectData?.assignedTo?.length > 0) {
                    setAssignedData({ idx: taskIdx });
                  } else {
                    toast.error("Please select employees in project");
                  }
                }}
                className={`w-8 h-8 maxsm:w-7 maxsm:h-7  flex items-center justify-center hover:z-10 rounded-full border-2  border-gray-100 font-semibold bg-gray-800 text-white cursor-pointer ${
                  error?.[`assignedTo-${taskIdx}`] &&
                  `border-red-600 border-2 border-box animate-pulse bg-red-500
`
                }`}
              >
                <IoPersonAddSharp className="w-4 h-4 maxsm:w-3 maxsm:h-3" />
              </div>
            </TooltipMaterial>
          </div>
          <Priority
            data={task}
            handleChange={handleTaskChange}
            idx={taskIdx}
            handleUpdate={handleTaskUpdate}
            type={type}
          />
          <Status data={task} handleChange={handleTaskChange} idx={taskIdx} />

          <input
            value={task?.startDate}
            onChange={(e) => {
              if (!projectData?.startDate || !projectData?.endDate) {
                return toast.error("Select Project Date");
              }
              if (
                task?.endDate &&
                moment(task?.endDate).isBefore(e.target.value)
              ) {
                return toast.error("Start Date should be before End Date");
              }
              return handleTaskChange(e, taskIdx);
            }}
            type="date"
            name="startDate"
            min={projectData?.startDate}
            max={projectData?.endDate}
            onBlur={(e) => {
              handleTaskUpdate(e, taskIdx);
            }}
            id="from"
            placeholder="Start Date"
            className={`px-2 hover:bg-gray-400 ${
              error?.[`startDate-${taskIdx}`] &&
              `border-red-600 border-2 border-box `
            } bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] `}
          />

          <input
            value={task?.endDate}
            onChange={(e) => {
              if (!projectData?.startDate || !projectData?.endDate) {
                return toast.error("Select Project Date");
              }
              if (
                task?.startDate &&
                moment(task?.startDate).isAfter(e.target.value)
              ) {
                return toast.error("End Date should be After Start Date");
              }
              return handleTaskChange(e, taskIdx);
            }}
            type="date"
            name="endDate"
            placeholder="Start Date"
            min={projectData?.startDate}
            max={projectData?.endDate}
            onBlur={(e) => {
              handleTaskUpdate(e, taskIdx);
            }}
            id="from"
            className={`px-2 hover:bg-gray-400 ${
              error?.[`endDate-${taskIdx}`] &&
              `border-red-600 border-2 border-box `
            } bg-transparent maxsm:max-w-[200px]  rounded-md cursour-pointer maxsm:w-[130px] `}
          />
          <div
            className="absolute right-2 top-4 "
            onClick={(e) => e.stopPropagation()}
          >
            <Menu className="float-right">
              <MenuHandler>
                <div className="w-4 h-4 cursor-pointer">
                  <BsThreeDotsVertical className="w-4 h-4 cursor-pointer" />
                </div>
              </MenuHandler>

              <MenuList className="p-0 font-medium font-map text-gray-900">
                <MenuItem
                  onClick={() => {
                    handleRemoveTask(taskIdx);
                  }}
                >
                  <span className="flex items-center gap-2 ">
                    <MdDelete className="w-4 h-4 text-red-700" />
                    Delete Task
                  </span>
                </MenuItem>
                {type == "list" && (
                  <MenuItem
                    onClick={() => {
                      handleGotoProject(task?.projectId);
                    }}
                  >
                    <span className="flex items-center gap-2 ">
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
        id=""
        value={task?.description}
        onChange={(e) => handleTaskChange(e, taskIdx)}
        onBlur={(e) => {
          handleTaskUpdate(e, taskIdx);
        }}
        className="bg-gray-400 rounded-md px-4 p-2 placeholder-gray-700"
        placeholder="Task Description"
      ></textarea>

      {showSubtask ? (
        <SubtaskTable
          task={task}
          modules={modules}
          taskIdx={taskIdx}
          handleSubTaskChange={handleSubTaskChange}
          handleSubtaskUpdate={handleSubtaskUpdate}
          setAssignedData={setAssignedData}
          handleAddSubTask={handleAddSubTask}
          setCommentTaskId={setCommentTaskId}
          handleRemoveSubTask={handleRemoveSubTask}
          setSelectedTaskData={setSelectedTaskData}
        />
      ) : (
        <button
          className="bg-gray-700 text-gray-200 font-medium self-end text-sm w-fit px-2 p-1 rounded-md cursor-pointer flex gap-2 items-center"
          onClick={handleGetShowSubtask}
        >
          <TbSubtask className="w-4 h-4" />
          {loadingSubtask ? `Loading...` : `Show Subtask `}
          <IoIosArrowDown />
        </button>
      )}
    </div>
  );
};

export default memo(TaskRow);
