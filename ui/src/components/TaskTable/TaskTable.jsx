import React, { memo, useCallback, useEffect, useState } from "react";

import { Button } from "@material-tailwind/react";

import AssignSidebar from "./AssignSidebar";
import CommentSection from "../CommentSection/CommentSection";
import {
  SubTaskUpdateAction,
  TaskDeleteAction,
  TaskUpdateAction,
} from "../../Store/Actions/task/task";
import { useDispatch, useSelector } from "react-redux";
import { usePrompt } from "../../Context/PromptProvider";
import { useLoading } from "../../Context/LoadingProvider";
import { useNavigate } from "react-router-dom";
import TaskRow from "./TaskRow";
import Loader from "../Loader/Loader";
import NotFound from "../NotFound/NotFound";
import { addError, removeError } from "../../Store/Reducers/error/ErrorReducer";

const TaskTable = ({
  taskList,
  hideAddTask = false,
  handleValidateAll,
  handleValidateTask,
  handleAssignNewTask,
  handleAssignNewSubTask,
  setTaskList,
  modules,
  projectData,
  handleSubTaskValidate,
  type = "create",
  handleRemoveTask,
  setCommentTaskId
}) => {

 
  const updateOnChange = ["priority", "status", "dueBy"]; //feilds to be updpated while it being changed
  // project data for listing page as every task has thier own project data
  const [projectData2, setProjectData2] = useState(null);
  const requiredFeilds = {
    task: ["assignedTo", "startDate", "endDate", "name"],
    subTask: ["assignedTo", "taskType", "name", "dueBy"],
  }; //feilds required to create a new task
  const dontUpdateOnChange = ["assignedTo", "subTaskData"]; //feilds to be ignored for change on update
  const { error } = useSelector((state) => state?.error);
  const [assignedData, setAssignedData] = useState({});
  const [taskUpdatedFeildData, setTaskUpdatedFeildData] = useState([]); //to track the feilds that are updated in all the tasks
  const { showLoading, hideLoading } = useLoading();
  const isTaskLoading = useSelector((state) => state?.task?.fetching);
  const dispatch = useDispatch();

  const initialTaskData = {
    name: "Task 1",
    startDate: "",
    endDate: "",
    description: "",
    assignedTo: [],
    status: "pending",
    priority: "high",
    subTaskData: [],
  };

  // const handleSubTaskValidate = (taskData, type, taskIdx) => {
  //   let isSubmittable = true;
  //   let errors = {};
  //   requiredFeilds?.[type]?.forEach((feild) => {
  //     if (taskData[feild] instanceof Array) {
  //       if (taskData[feild]?.length == 0) {
  //         isSubmittable = false;
  //       }
  //     } else if (!taskData[feild]) {
  //       isSubmittable = false;
  //     }

  //     // if(!isSubmittable){
  //     //   errors[`${type}-${taskIdx}-${feild}`] = "This feild is required";
  //     // }
  //     // else{
  //     //   if(error?.[`${type}-${taskIdx}-${feild}`]){
  //     //     delete errors[`${type}-${taskIdx}-${feild}`]
  //     //   }
  //     // }
  //   });
  //   dispatch(addError(errors));
  //   return isSubmittable;
  // };

  

  const handleTaskChange = (e, taskIdx) => {
    const { name, value } = e?.target;

    // if already on server (has task id) then addto updated feild so we can called update api later
    if (
      taskList[taskIdx]?._id &&
      !taskUpdatedFeildData?.includes(`${name}-${taskIdx}`) &&
      !dontUpdateOnChange?.includes(name)
    ) {
      setTaskUpdatedFeildData([...taskUpdatedFeildData, `${name}-${taskIdx}`]);
    }

    setTaskList((prev) => {
      let temp = [...prev];
      let selectedTask = { ...temp[taskIdx], [name]: value };
      temp?.splice(taskIdx, 1, selectedTask);
      // if a not on server (doesnt have task id) then check if all the required feilds is are filled and add it to the server
      if (type == "update" && !selectedTask?._id) {
        if (handleValidateTask(selectedTask, taskIdx)) {
          showLoading("saving...");
          handleAssignNewTask(selectedTask, taskIdx);
        }
      }
      return [...temp];
    });

    // remove if any error
    if (error?.[`${name}-${taskIdx}`]) {
      dispatch(removeError(`${name}-${taskIdx}`));
    }
  };


  const handleSubtaskUpdateFirst = (e, idx, subIdx) => {
    let { name, value } = e?.target;
    let taskId = taskList[idx]?.subTaskData?.[subIdx]?._id;

    return new Promise((resolve, reject) => {
      let reqbody = {
        taskId: taskList[idx]?.subTaskData?.[subIdx]?.taskId,
        [name]: value,
      };
      dispatch(SubTaskUpdateAction({ query: taskId, reqbody })).then(
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

  const handleUpdateFirst = (e, idx) => {
    let { name, value } = e?.target;
    let taskId = taskList[idx]?._id;

    return new Promise((resolve, reject) => {
      let reqbody = {
        // projectId: taskList[idx]?.projectId,
        [name]: value,
      };
      dispatch(TaskUpdateAction({ query: taskId, reqbody })).then(
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
        // projectId: taskList[idx]?.projectId,
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
      
      {/** task Assign sie bar */}
      {!assignedData?.hasOwnProperty("subIdx") && (
        <AssignSidebar
          assignedData={assignedData}
          type={"task"}
          setAssignedData={setAssignedData}
          pageType={taskList?.[assignedData?.idx]?._id ? "update" : "create"}
          parentData={
            type == "list" ? projectData2?.assignedTo : projectData?.assignedTo
          }
          handleSubTaskChange={handleTaskChange}
          handleUpdate={handleUpdateFirst}
          selectedList={taskList[assignedData?.idx]?.assignedTo}
        />
      )}

      {isTaskLoading ? (
        <Loader />
      ) : taskList?.length == 0 && type == "update" ? (
        <NotFound name={"Task"} />
      ) : (
        taskList?.map((task, taskIdx) => {
          return (
            <TaskRow
              task={task}
              taskIdx={taskIdx}
              handleTaskChange={handleTaskChange}
              handleTaskUpdate={handleTaskUpdate}
              handleRemoveTask={handleRemoveTask}
              setCommentTaskId={setCommentTaskId}
              setAssignedData={setAssignedData}
              projectData={type == "list" ? projectData2 : projectData}
              type={type}
              modules={modules}
              setTaskList={setTaskList}
              assignedData={assignedData}
              handleSubTaskValidate={handleSubTaskValidate}
              handleAssignNewSubTask={handleAssignNewSubTask}
              handleAssignNewTask={handleAssignNewTask}
              handleValidateTask={handleValidateTask}
              handleSubtaskUpdateFirst={handleSubtaskUpdateFirst}
              setProjectData={type == "list" && setProjectData2}
            />
          );
        })
      )}
      {!hideAddTask && (
        <Button
          className="w-fit self-end rounded-md bg-gray-800 font-manrope"
          onClick={() => {
            if (handleValidateAll()) {
              setTaskList((prev) => [
                ...prev,
                { ...initialTaskData, name: `Task ${taskList?.length + 1}` },
              ]);
            }
          }}
        >
          Add Task
        </Button>
      )}
    </div>
  );
};

export default memo(TaskTable);
