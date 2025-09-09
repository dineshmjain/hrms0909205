import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../components/Modal/TaskModal";
import { BiCalendarEdit, BiCommentDetail } from "react-icons/bi";
import Comments from "../../../components/CommentSection/Comments";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "@material-tailwind/react";
import { GetModuleByName } from "../../../components/TaskTable/Columns/GetModuleByName";
import { useNavigate } from "react-router-dom";
import AssignSidebar from "../../../components/TaskTable/AssignSidebar";
import { BiChevronDown, BiChevronRight } from "react-icons/bi"; // Add this import
import TooltipMaterial from "../../../components/TooltipMaterial/TooltipMaterial";

// import {
//   addError,
//   removeError,
// } from "../../redux/reducer/ErrorReducer";
import {
  SubTaskListAction,
  TaskCreateAction,
  TaskUpdateAction,
} from "../../../redux/Action/task/taskAction";
import moment from "moment";
import BasicSubtaskTable from "../../../Components/TaskTable/BasicSubtaskTable";
import FeildDetails, { feilds, requiredFeilds } from "./FeildDetails";
import { camelCaseToText } from "../../../constants/reusableFun";

const dontUpdateOnChange = [
  "assignedTo",
  "subTaskData",
  "name",
  "startDate",
  "endDate",
  "startTime",
  "description",
  "endTime",
  "times"
]; //feilds to be ignored for change on update cause thier update is manage by thier own component

const groupOrder = {
  basic: {
    Name: "Basic",
  },
  dueBy: {
    Name: "Due By",
  },
  assignment: {
    Name: "Assignment",
  },
  taskEndType: {
    Name: "Task Completion",
  },
  times: {
    Name: "Time & Designation",
    hasCustomComponent: true,
  },
  checkpoints: {
    Name: "CheckPoints",
  },
};

const BasicTaskModal = ({
  taskData,
  setTaskData,
  taskIdx,
  subTask,
  subTaskIdx,
  setCommentTaskId,
  projectData,
  handleSubTaskChange,
  handleSubtaskUpdate,
  handleAddSubTask,
  handleRemoveSubTask,
  onClose,
  modules,
  type,
  pageName,
}) => {
  const createData = {
    name: "",
    status: "pending",
    priority: "high",
    taskType: "oneTime",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    description: "",
    assignmentType: "time",
    projectId: projectData?._id,
    taskEndType: ["checkpoints"],
    subTaskData: [],
    type: pageName,
    times: [
      {
        startTime: "",
        endTime: "",
        designationId: "",
      },
    ],
    checkpointIds: [],
  };
  const initialData = taskData?._id ? taskData : createData;

  const [loadingSubtask, setLoadingSubtask] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState(false); // Add this state
  const [assignedData, setAssignedData] = useState({}); //to track the assigned data
  const [taskUpdatedFeildData, setTaskUpdatedFeildData] = useState([]); //to track the feilds that are updated in all the tasks

  // const updateOnChange = ["priority", "status", "dueBy", "taskType"];
  const dispatch = useDispatch();
  const [task, setTask] = useState(initialData);
  const temp = subTask?._id
    ? { taskId: taskData?._id, subTaskId: subTask?._id }
    : { taskId: taskData?._id };
  const [detailCommentId, setDetailCommentId] = useState({
    ...temp,
  });

  const isSubTask = subTaskIdx !== undefined;

  const error = useSelector((state) => state?.error?.error);

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

        let e = {
          target: {
            name: "subTaskData",
            value: temp,
          },
        };
        handleTaskChange(e, taskIdx);
        // setShowSubtask(true);
      }
    });
    setLoadingSubtask(false);
  };

  // routes for mode top left coner to navigate between task and subtask
  const route =
    type == "create"
      ? []
      : [
          {
            name: taskData?.name,
            link: () => {
              setTaskData({ idx: taskIdx });
            },
          },
          {
            name: subTask?.name,
            link: () => {},
          },
        ];

  const getTaskNameById = (id) => {
    let name = "";
    if (taskData?._id == id) {
      return taskData?.name;
    }
    taskData?.subTaskData?.forEach((sub) => {
      if (sub?._id == id) {
        name = sub?.name;
      }
    });
    return name;
  };

  const handleSetCommentId = (commentType) => {
    let data =
      subTask != undefined
        ? {
            taskId: taskData?._id,
            subTaskId: subTask?._id,
          }
        : {
            taskId: taskData?._id,
          };
    if (commentType == "sidebar") {
      return setCommentTaskId(data);
    }
    return setDetailCommentId(data);
  };

  const handleTaskValidate = (taskData, taskIdx) => {
    let isSubmittable = true;
    let tempErrors = {};
    requiredFeilds?.task?.forEach((feild) => {
      if (taskData?.[feild] instanceof Array) {
        if (taskData?.[feild]?.length == 0) {
          tempErrors[`${feild}-${taskIdx}`] = "This feild is required";
          isSubmittable = false;
        }
      } else if (!taskData?.[feild]) {
        tempErrors[`${feild}-${taskIdx}`] = "This feild is required";
        isSubmittable = false;
      }
      //validate assignment type
      if (taskData?.assignmentType == "time") {
        taskData?.times?.map?.((time, tidx) => {
          Object?.keys(time)?.forEach((key) => {
            if (!time?.[key]) {
              tempErrors[`${tidx}-${key}-${taskIdx}`] = "This feild is required";
              isSubmittable = false;
            }
          });
        });
      }
    });

    // dispatch(addError(tempErrors));
    console.log(tempErrors);

    return isSubmittable;
  };
  const generateRequestBody = (data) => {
    return Object.fromEntries(
      Object.entries(data).filter(([_, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0; // Keep non-empty arrays
        }
        return value !== "" && value !== null && value !== undefined;
      })
    );
  };

  const handleParse = (data, type) => {
    return new Promise((resolve, reject) => {
      let tobeParsed = data;

      try {
        let teamMembers = null;
        if (tobeParsed?.assignedTo) {
          teamMembers = tobeParsed?.assignedTo.map((member) => member._id);
        }
        let { assignedTo, ...rest } = tobeParsed;
        let reqbody = generateRequestBody({
          ...rest,
          branchId: projectData?.branchId,
          clientMappedId: projectData?.clientId,
        });
        if (teamMembers) {
          reqbody.assignToUserId = teamMembers;
        }
        resolve(reqbody);
      } catch (error) {
        reject(error);
      }
    });
  };

  const handleSaveTask = async () => {
    if (handleTaskValidate(task)) {
      let reqbody = await handleParse(task, "task");
      dispatch(TaskCreateAction(reqbody))?.then();
    }
  };

  const handleTaskChange = (e) => {
    let { name, value } = e?.target;
    if (value == null) {
      return setTask((prev) => {
        let temp = { ...prev };
        delete temp?.[name];
        return { ...temp };
      });
    }
    // if already on server (has task id) then addto updated feild so we can called update api later
    if (
      task?._id &&
      !taskUpdatedFeildData?.includes(name) &&
      !dontUpdateOnChange?.includes(name)
    ) {
      setTaskUpdatedFeildData([...taskUpdatedFeildData, name]);
    }
    setTask((prev) => {
      return { ...prev, [name]: value };
    });
    // remove if any error
    if (error?.[`${name}-${taskIdx}`]) {
      // dispatch(removeError(`${name}-${taskIdx}`));
    }
  };

  const handleUpdateFirst = (e) => {
    let { name, value } = e?.target;
    let taskId = task?._id;

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

  const handleTaskUpdate = async (e) => {
    let { name, value } = e?.target;

    if (taskUpdatedFeildData?.includes(name)) {
      let reqbody = {
        [name]: value,
      };

      await dispatch(TaskUpdateAction({ query: task?._id, reqbody }))?.then(
        () => {
          setTaskUpdatedFeildData((prev) => {
            return prev.filter((data) => data != name);
          });
        }
      );
    }
  };
  const toggleGroupCollapse = (groupKey) => {
    setCollapsedGroups((res) => ({
      ...res,
      [groupKey]: !res[groupKey],
    }));
  };

  useEffect(() => {
    if (type == "update") {
      setTimeout(() => {
        handleSetCommentId();
        handleGetShowSubtask();
      }, 500);
    }
  }, []);

  useEffect(() => {
    console.log(taskUpdatedFeildData);
    
    taskUpdatedFeildData?.forEach((FeildName) => {
      let [feild, idx] = FeildName.split("-");

      let e = {
        target: {
          name: feild,
          value: task?.[feild],
        },
      };
      handleTaskUpdate(e, idx);
    });
  }, [taskUpdatedFeildData]);

  return (
    <Modal
      heading={type == "create" ? `${pageName} Create` : `${pageName} Details`}
      onClose={() => {
        setTaskData(type == "create" ? false : -1);
        onClose();
      }}
      route={route}
      customCss={`min-w-[95vw] h-[90vh]  bg-gray-100 relative  maxsm:max-w-[95vw]`}
      contentParentCss={`  py-0 p-0 maxsm:px-0 maxsm:max-w-[95vw]`}
    >
      {!assignedData?.hasOwnProperty("subIdx") && (
        <AssignSidebar
          assignedData={assignedData}
          type={pageName}
          setAssignedData={setAssignedData}
          pageType={type}
          parentData={projectData?.assignedTo}
          handleSubTaskChange={handleTaskChange}
          selectedList={task?.assignedTo}
          limit={(pageName = "patrolling") ? 1 : null}
          handleUpdate={handleUpdateFirst}
        />
      )}
      <div className="flex h-full w-full overflow-hidden  ">
        <div className="flex flex-col gap-6 flex-1 p-4  overflow-y-auto max-md:scrolls md:border-r border-gray-300">
          <div className="flex items-center gap-2 w-full">
            <Input
              className={`bg-white  px-2 p-1 w-fit truncate rounded-md font-semibold text-xl outline-none 
                maxsm:w-full  ${
                  error?.[`name-${taskIdx}`] &&
                  `border-red-600 border-2 border-box `
                }`}
              type="text"
              placeholder={`${camelCaseToText(pageName)} Name`}
              label={`${camelCaseToText(pageName)} Name`}
              value={isSubTask ? subTask?.name : task?.name}
              name="name"
              onChange={(e) =>
                isSubTask
                  ? handleSubTaskChange(e, taskIdx, subTaskIdx)
                  : handleTaskChange(e)
              }
              onBlur={(e) => {
                if (e?.target?.value?.length > 0) {
                  isSubTask
                    ? handleSubtaskUpdate(e, taskIdx, subTaskIdx)
                    : handleTaskUpdate(e, taskIdx);
                } else {
                  // dispatch(addError({ [`name-${taskIdx}`]: "Enter a name!" }));
                }
              }}
            />

            {type == "update" && (
              <div
                className="p-2 hover:bg-gray-400 rounded-md cursor-pointer h-fit maxsm:flex hidden"
                onClick={() => {
                  handleSetCommentId("sidebar");
                }}
              >
                <BiCommentDetail className="w-5 h-5  " />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 rounded-md">
            {Object?.entries(groupOrder)?.map(
              ([groupKey, groupValue], gidx) => {
                if (pageName === "patrolling" && groupKey === "taskEndType")
                  return null;
                const isCollapsed = collapsedGroups[groupKey];

                return (
                  <div
                    className="flex flex-col w-full p-2 bg-white rounded-lg shadow"
                    key={gidx}
                  >
                    {/* Header */}
                    <div
                      className={`flex items-center justify-between cursor-pointer px-3 py-2 rounded-md text-gray-800 font-semibold text-md transition-all`}
                      onClick={() => toggleGroupCollapse(groupKey)}
                    >
                      <span className="flex-1">{groupValue?.Name}</span>
                      <TooltipMaterial
                        content={
                          isCollapsed ? "Click To View" : "Click To Hide"
                        }
                      >
                        <BiChevronRight
                          size={22}
                          className={`bg-primary text-white rounded-full transform transition-transform duration-200 hover:bg-primaryLight hover:text-primary hover:scale-125 ${
                            isCollapsed ? "rotate-0" : "rotate-90"
                          } `}
                        />
                      </TooltipMaterial>
                    </div>

                    {/* Collapsible Section */}
                    <div
                      className={`overflow-hidden transition-all duration-200 ease-in-out ${
                        isCollapsed
                          ? "max-h-0 opacity-0"
                          : "max-h-[2000px] opacity-100 mt-1 mb-2"
                      } `}
                    >
                      <div className="flex flex-wrap gap-x-6 gap-y-3 px-2 maxsm:gap-2">
                        {Object.entries(isSubTask ? subTask : task)?.map(
                          ([key, value], idx) => {
                            if (
                              feilds?.[key] &&
                              feilds?.[key]?.type === groupKey
                            ) {
                              //components like time and checkpoint might take more space and have diffrent style of diplaying data
                              return groupValue?.hasCustomComponent ? (
                                <GetModuleByName
                                  moduleName={key}
                                  details={value}
                                  task={task}
                                  taskIdx={taskIdx}
                                  subTask={subTask}
                                  subTaskIdx={subTaskIdx}
                                  handleChange={
                                    isSubTask
                                      ? handleSubTaskChange
                                      : handleTaskChange
                                  }
                                  handleUpdate={
                                    isSubTask
                                      ? handleSubtaskUpdate
                                      : handleTaskUpdate
                                  }
                                  setAssignedData={setAssignedData}
                                  handleAddSubTask={handleAddSubTask}
                                  handleRemoveSubTask={handleRemoveSubTask}
                                  handleShowComments={setCommentTaskId}
                                  projectData={projectData}
                                />
                              ) : (
                                <div
                                  className="flex gap-2 w-[300px] maxmd:w-full justify-between items-center bg-white p-1 rounded-md border-2"
                                  key={key}
                                >
                                  <FeildDetails
                                    name={key}
                                    isSubTask={isSubTask}
                                  />
                                  <GetModuleByName
                                    moduleName={key}
                                    details={value}
                                    task={task}
                                    taskIdx={taskIdx}
                                    subTask={subTask}
                                    subTaskIdx={subTaskIdx}
                                    handleChange={
                                      isSubTask
                                        ? handleSubTaskChange
                                        : handleTaskChange
                                    }
                                    handleUpdate={
                                      isSubTask
                                        ? handleSubtaskUpdate
                                        : handleTaskUpdate
                                    }
                                    setAssignedData={setAssignedData}
                                    handleAddSubTask={handleAddSubTask}
                                    handleRemoveSubTask={handleRemoveSubTask}
                                    handleShowComments={setCommentTaskId}
                                    projectData={projectData}
                                  />
                                </div>
                              );
                            }
                          }
                        )}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className=" w-full px-1 font-black text-lg rounded-md text-gray-800">
              Description
            </span>
            <textarea
              name="description"
              id=""
              value={isSubTask ? subTask?.description : task?.description}
              onChange={(e) =>
                isSubTask
                  ? handleSubTaskChange(e, taskIdx, subTaskIdx)
                  : handleTaskChange(e, taskIdx)
              }
              onBlur={(e) => {
                isSubTask
                  ? handleSubtaskUpdate(e, taskIdx, subTaskIdx)
                  : handleTaskUpdate(e, taskIdx);
              }}
              className="bg-white border-2 border-box rounded-md px-4 min-h-[100px] resize-y p-2 placeholder-gray-700"
              placeholder="Task Description"
            ></textarea>
          </div>
          {taskData?._id && !isSubTask && (
            <div className="h-full flex flex-col gap-1 px-2">
              <span className=" w-full px-1 font-black text-lg rounded-md text-gray-800">
                Subtasks
              </span>
              {/* Check if the task is saved and is not a subtask */}
              <BasicSubtaskTable
                task={task}
                modules={modules}
                taskIdx={taskIdx}
                handleSubTaskChange={handleSubTaskChange}
                handleSubtaskUpdate={handleSubtaskUpdate}
                setAssignedData={setAssignedData}
                handleAddSubTask={handleAddSubTask}
                setCommentTaskId={setDetailCommentId}
                handleRemoveSubTask={handleRemoveSubTask}
                setSelectedTaskData={setTaskData}
                isLoading={loadingSubtask}
              />
            </div>
          )}
          {type == "create" && (
            <div className="flex gap-2 items-center justify-end w-full p-2 ">
              <Button onClick={handleSaveTask}>Save</Button>
            </div>
          )}
        </div>
        <div className="w-[400px] h-full bg-white border-l rounded-md sticky top-0 p-4  maxmd:hidden  overflow-y-auto ">
          {detailCommentId?.taskId || detailCommentId?.subTaskId ? (
            <>
              <div className="font-semibold text-center flex gap-1 items-center justify-center">
                Comments (
                <span className=" max-w-[15ch] text-center truncate">
                  {getTaskNameById(
                    detailCommentId?.subTaskId ?? detailCommentId?.taskId
                  )}
                </span>
                )
              </div>
              <div className="h-[95%]">
                <Comments task={detailCommentId} />
              </div>
            </>
          ) : (
            <span className="text-gray-600 font-semibold self-center">
              Save the task to use comments
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BasicTaskModal;
