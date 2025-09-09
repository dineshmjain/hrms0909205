import React, { useEffect, useState } from "react";
import Name from "./Columns/Name";
import AssignedTo from "./Columns/AssignedTo";
import SideDrawer from "../Drawer/SideDrawer";
import TaskType from "./Columns/TaskType";
import DueBy from "./Columns/DueBy";
import Priority from "./Columns/Priority";
import Status from "./Columns/Status";
import { Button } from "@material-tailwind/react";
import Actions from "./Columns/Actions";
import { BsThreeDotsVertical } from "react-icons/bs";

import AssignSidebar from "./AssignSidebar";
import { toast } from "react-hot-toast";
import CommentSection from "../CommentSection/CommentSection";
import {
  TaskDeleteAction,
  TaskUpdateAction,
} from "../../Store/Actions/task/task";
import { useDispatch, useSelector } from "react-redux";
import { usePrompt } from "../../Context/PromptProvider";
import { BiCommentDetail } from "react-icons/bi";
import { useLoading } from "../../Context/LoadingProvider";
import { useNavigate } from "react-router-dom";
import { getProjectListApi } from "../../apis/project/project";
import TaskRowNew from "./TaskRowNew";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound";
import { addTask, updateTask } from "../../Store/Reducers/Task/TaskReducer";

const TaskTableNew = ({
  taskList,
  hideAddTask = false,
  handleAssignNewTask,
  setTaskList,
  error,
  setError,
  modules,
  projectData,
  type = "create",
}) => {
  const updateOnChange = ["priority", "status"];
  const requiredFeilds = ["assignedTo", "startDate", "endDate", "name"];
  const [isOpen, setIsOpen] = useState(false);
  const [commentTaskId, setCommentTaskId] = useState("");
  const [assignedData, setAssignedData] = useState({});
  const [taskUpdatedFeildData, setTaskUpdatedFeildData] = useState([]);
  const { showPrompt, hidePrompt } = usePrompt();
  const { showLoading, hideLoading } = useLoading();
  const isTaskLoading = useSelector((state) => state?.task?.fetching);
  const nav = useNavigate();
  const dispatch = useDispatch();
  const initialSubTaskData = {
    name: "Sub task #1",
    assignedTo: [],
    dueBy: "",
    priority: "high",
    description: "description",
    taskType: "oneTime",
    status: "pending",
  };
  const initialTaskData = {
    name: "Task 1",
    startDate: "",
    endDate: "",
    description: "Task description",
    assignedTo: [],
    status: "pending",
    priority: "high",
    subTaskData: [
      {
        name: "Sub task #1",
        description: "Task description",
        assignedTo: [],
        dueBy: "",
        priority: "high",
        taskType: "oneTime",
        status: "pending",
      },
    ],
  };

  const handleCheckIfSubmittable = (taskData) => {
    let isSubmittable = true;
    requiredFeilds?.forEach((feild) => {
      if (taskData[feild] instanceof Array) {
        if (taskData[feild]?.length == 0) {
          isSubmittable = false;
        }
      } else if (!taskData[feild]) {
        isSubmittable = false;
      }
      // console.log(feild, taskData[feild]);
    });
    return isSubmittable;
  };

  const handleSubTaskChange = (e, taskIdx, subTaskIdx) => {
    let { name, value } = e?.target;
    // console.log("----->", name, value, taskIdx, subTaskIdx);

    setTaskList((prev) => {
      let temp = [...prev];
      let task = { ...temp?.[taskIdx] };
      let subTasks = [...task?.subTaskData];
      let subTask = { ...subTasks[subTaskIdx], [name]: value };
      // console.log("subtask", subTask);
      subTasks.splice(subTaskIdx, 1, subTask);
      task = { ...task, subTaskData: subTasks };
      temp?.splice(taskIdx, 1, task);
      // console.log("temp", temp);
      return [...temp];
    });
  };

  const handleRemoveTask = (taskIdx) => {
    setTaskList((prev) => {
      let temp = [...prev];
      temp?.splice(taskIdx, 1);
      return [...temp];
    });
  };

  const DeleteOnServer = async (taskIdx) => {
    showPrompt({
      heading: `Are You Sure?`,
      message: `You want to delete ${taskList[taskIdx]?.name}?`,
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            dispatch(
              TaskDeleteAction({
                _id: taskList?.[taskIdx]?._id,
                projectId: taskList?.[taskIdx]?.projectId,
              })
            )?.then(({ payload }) => {
              if (payload?.status == 200) {
                handleRemoveTask(taskIdx);
              } else {
                toast.error("Error Deleting Task");
              }
            });
            hidePrompt();
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

  const handleAddSubTask = (taskIdx) => {
    setTaskList((prev) => {
      let temp = [...prev];
      let selectedTask = {
        ...temp[taskIdx],
        subTaskData: [...temp[taskIdx]?.subTaskData, { ...initialSubTaskData }],
      };
      temp?.splice(taskIdx, 1, selectedTask);
      return [...temp];
    });
  };
  const handleRemoveSubTask = (taskIdx, subTaskIdx) => {
    setTaskList((prev) => {
      let temp = [...prev];
      let selectedTask = { ...temp[taskIdx] };
      let subTaskList = selectedTask?.subTaskData;
      if (subTaskList?.length == 1) {
        subTaskList?.splice(subTaskIdx, 1, initialSubTaskData);
      } else {
        subTaskList?.splice(subTaskIdx, 1);
      }
      selectedTask = { ...selectedTask, subTaskData: [...subTaskList] };
      temp?.splice(taskIdx, 1, selectedTask);
      return [...temp];
    });
  };

  const handleTaskChange = (e, taskIdx) => {
    const { name, value } = e?.target;

    // if already on server (has task id) then addto updated feild so we can called update api later
    if (
      taskList[taskIdx]?._id &&
      !taskUpdatedFeildData?.includes(`${name}-${taskIdx}`)
    ) {
      setTaskUpdatedFeildData([...taskUpdatedFeildData, `${name}-${taskIdx}`]);
    }

    dispatch(updateTask({ idx: taskIdx, changes: { [name]: value } }));

    
    // setTaskList((prev) => {
    //   let temp = [...prev];
    //   let selectedTask = { ...temp[taskIdx], [name]: value };
    //   temp?.splice(taskIdx, 1, selectedTask);
    //   // if a not on server (doesnt have task id) then check if all the required feilds is are filled and added it to the server
    //   if (type == "update" && !selectedTask?._id) {
    //     if (handleCheckIfSubmittable(selectedTask)) {
    //       showLoading("saving...");
    //       handleAssignNewTask(selectedTask, taskIdx);
    //     }
    //   }
    //   return [...temp];
    // });

    // remove if any error
    if (error?.[`task-${taskIdx}-${name}`]) {
      setError((prev) => {
        let temp = { ...prev };
        delete temp[`task-${taskIdx}-${name}`];
        return { ...temp };
      });
    }
  };

  const handleUpdateFirst = (e, idx) => {
    let { name, value } = e?.target;

    return new Promise((resolve, reject) => {
      let reqbody = {
        projectId: taskList[idx]?.projectId,
        [name]: value,
      };
      dispatch(TaskUpdateAction({ query: taskList[idx]?._id, reqbody })).then(
        ({ payload }) => {
          if (payload?.status == 200) {
            resolve(true);
          } else {
            reject(false);
          }
        }
      );
    });
  };
  const handleTaskUpdate = (e, idx) => {
    let { name, value } = e?.target;
    
    if (taskUpdatedFeildData?.includes(`${name}-${idx}`)) {
      let reqbody = {
        projectId: taskList[idx]?.projectId,
        [name]: value,
      };
      dispatch(TaskUpdateAction({ query: taskList[idx]?._id, reqbody }))?.then(
        () => {
          setTaskUpdatedFeildData((prev) => {
            return prev.filter((data) => data != `${name}-${idx}`);
          });
        }
      );
    }
  };

  const handleGotoProject = async (projectId) => {
    try {
      const data = await getProjectListApi({
        projectId,
      });
      if (data?.data?.length >= 1) {
        nav("../edit", { state: { selectedProject: data?.data[0] } });
      } else {
        toast.error("Project not found");
      }
    } catch (error) {
      toast.error("Error finding project");
    }
  };

  const getModuleByName = (
    moduleName,
    details,
    task,
    taskIdx,
    subTask,
    subTaskIdx
  ) => {
    switch (moduleName) {
      case "name":
        return (
          <Name
            data={task}
            idx={taskIdx}
            subData={subTask}
            subIdx={subTaskIdx}
            details={details}
            handleShowComments={setCommentTaskId}
            handleSubTaskChange={handleSubTaskChange}
          />
        );
      case "assigned":
        return (
          <AssignedTo
            data={task}
            idx={taskIdx}
            subData={subTask}
            subIdx={subTaskIdx}
            details={details}
            setAssignedData={setAssignedData}
            handleSubTaskChange={handleSubTaskChange}
          />
        );
      case "taskType":
        return (
          <TaskType
            data={task}
            idx={taskIdx}
            subData={subTask}
            subIdx={subTaskIdx}
            details={details}
            
            handleSubTaskChange={handleSubTaskChange}
          />
        );
      case "dueBy":
        return (
          <DueBy
            data={task}
            idx={taskIdx}
            subData={subTask}
            subIdx={subTaskIdx}
            details={details}
            
            handleSubTaskChange={handleSubTaskChange}
          />
        );
      case "priority":
        return (
          <Priority
            data={task}
            idx={taskIdx}
            subData={subTask}
            subIdx={subTaskIdx}
            details={details}
            
            handleSubTaskChange={handleSubTaskChange}
          />
        );
      case "status":
        return (
          <Status
            data={task}
            idx={taskIdx}
            subData={subTask}
            subIdx={subTaskIdx}
            details={details}
            
            handleSubTaskChange={handleSubTaskChange}
          />
        );
      case "actions":
        return (
          <Actions
            data={task}
            idx={taskIdx}
            subData={subTask}
            subIdx={subTaskIdx}
            details={details}
            
            handleAddSubTask={handleAddSubTask}
            handleRemoveSubTask={handleRemoveSubTask}
          />
        );
    }
  };
  console.log(taskList);

  useEffect(() => {
    taskUpdatedFeildData?.forEach((FeildName) => {
      let [feild, idx] = FeildName.split("-");
      if (updateOnChange?.includes(feild)) {
        let e = {
          target: {
            name: feild,
            value: taskList[idx]?.[feild],
          },
        };
        handleTaskUpdate(e, idx);
      }
    });
  }, [taskUpdatedFeildData]);
  return (
    <div className="flex flex-col gap-4 w-full">
      <CommentSection taskId={commentTaskId} setTaskId={setCommentTaskId} />
      {/** task Assign sie bar */}
      {!assignedData?.hasOwnProperty("subIdx") && (
        <AssignSidebar
          assignedData={assignedData}
          type={"task"}
          setAssignedData={setAssignedData}
          pageType={taskList?.[assignedData?.idx]?._id ? "update" : "create"}
          parentData={projectData?.assignedTo}
          handleSubTaskChange={handleTaskChange}
          handleUpdate={handleUpdateFirst}
          selectedList={taskList[assignedData?.idx]?.assignedTo}
        />
      )}
      {/* /** sub task Assign sie bar */}
      {assignedData?.hasOwnProperty("subIdx") && (
        <AssignSidebar
          assignedData={assignedData}
          type={"subtask"}
          setAssignedData={setAssignedData}
          pageType={
            //check if _id exist to know if we are creating or updating
            taskList?.[assignedData?.idx]?.subTaskData?.[assignedData?.subIdx]
              ?._id
              ? "update"
              : "create"
          }
          parentData={taskList[assignedData?.idx]?.assignedTo}
          handleSubTaskChange={handleSubTaskChange}
          selectedList={
            taskList[assignedData?.idx]?.subTaskData[assignedData?.subIdx]
              ?.assignedTo
          }
        />
      )}
      {isTaskLoading ? (
        <Loader />
      ) : taskList?.length == 0 && type == "update" ? (
        <NotFound name={"Task"} />
      ) : (
        taskList?.map((task, taskIdx) => {
          return (
            <TaskRowNew
              key={taskIdx}
              task={task}
              taskIdx={taskIdx}
              handleTaskChange={handleTaskChange}
              handleTaskUpdate={handleTaskUpdate}
              handleRemoveTask={handleRemoveTask}
              handleAddSubTask={handleAddSubTask}
              handleRemoveSubTask={handleRemoveSubTask}
              setCommentTaskId={setCommentTaskId}
              setAssignedData={setAssignedData}
              projectData={projectData}
              error={error}
              type={type}
              modules={modules}
              getModuleByName={getModuleByName}
              handleGotoProject={handleGotoProject}
            />
          );
        })
      )}
      {!hideAddTask && (
        <Button
          className="w-fit self-end rounded-md bg-gray-800 font-manrope"
          onClick={() => {
            dispatch(addTask());
            // setTaskList((prev) => [
            //   ...prev,
            //   { ...initialTaskData, name: `Task ${taskList?.length + 1}` },
            // ]);
          }}
        >
          Add Task
        </Button>
      )}
    </div>
  );
};

export default TaskTableNew;
