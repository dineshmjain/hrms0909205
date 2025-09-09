import React, { useEffect, useRef, useState } from "react";
import Modal from "../../../Components/Modal/Modal";
import { BiCalendarEdit, BiCommentDetail } from "react-icons/bi";
import Comments from "../../../Components/CommentSection/Comments";
import {
  RiAttachmentLine,
  RiImageEditLine,
  RiProgress6Line,
} from "react-icons/ri";
import { FaFontAwesomeFlag } from "react-icons/fa";
import { FaPersonWalking } from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  IoCalendarNumberOutline,
  IoLocationSharp,
  IoPersonAddSharp,
} from "react-icons/io5";
import { MdOutlineAddCircleOutline } from "react-icons/md";
import {
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import SubtaskTable from "../../../Components/TaskTable/SubtaskTable";
import { GetModuleByName } from "../../../Components/TaskTable/Columns/GetModuleByName";
import { IoIosHourglass } from "react-icons/io";
import { HiQrCode } from "react-icons/hi2";
import { LuScanText } from "react-icons/lu";
import { getProjectListApi } from "../../../apis/project/project";
import { toast } from "react-hot-toast";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const DetailedView = ({
  taskData,
  setTaskData,
  handleTaskChange,
  taskIdx,
  subTask,
  subTaskIdx,
  handleTaskUpdate,
  setCommentTaskId,
  setAssignedData,
  projectData,
  handleSubTaskChange,
  handleSubtaskUpdate,
  handleAddSubTask,
  handleRemoveSubTask,
  modules,
  loadingSubtask,
  setLoadingSubtask,
  handleGetShowSubtask,
  type,
}) => {
  const temp = subTask?._id
    ? { taskId: taskData?._id, subTaskId: subTask?._id }
    : { taskId: taskData?._id };
  const [detailCommentId, setDetailCommentId] = useState({
    ...temp,
  });
  const ExtraFeilds = {
    attachables: {
      name: "Attachables",
      icon: <RiImageEditLine className="w-4 h-4" />,
    },
    attachDocument: {
      name: "Attach Doc",
      icon: <RiAttachmentLine className="w-4 h-4" />,
    },
    taskRecognition: {
      name: "Task Recognition",
      icon: <LuScanText className="w-4 h-4" />,
      defaultValue: [],
    },
    checkPoints: {
      name: "Location",
      icon: <IoLocationSharp className="w-4 h-4" />,
    },

    taskQr: {
      name: "Task Qr Code",
      icon: <HiQrCode className="w-4 h-4" />,
    },
  };
  const error = useSelector((state) => state?.error?.error);
  const nav = useNavigate();
  const feilds = {
    status: {
      name: "Status",
      icon: <RiProgress6Line className="w-4 h-4" />,
    },
    priority: {
      name: "Priority",
      icon: <FaFontAwesomeFlag className="w-4 h-4" />,
    },
    assignedTo: {
      name: "Assign",
      icon: <IoPersonAddSharp className="w-4 h-4" />,
    },
    startDate: {
      name: "Start date",
      icon: <IoCalendarNumberOutline className="w-5 h-5" />,
    },
    endDate: {
      name: "End date",
      icon: <IoCalendarNumberOutline className="w-5 h-5" />,
    },
    taskType: {
      name: "Task type",
      icon: <BiCalendarEdit className="w-5 h-5" />,
    },
    dueBy: {
      name: "Due by",
      icon: <IoIosHourglass className="w-5 h-5" />,
    },
    taskRecognition: {
      name: "Task Recognition",
      icon: <LuScanText className="w-4 h-4" />,
    },
  };

  const route = [
    {
      name: taskData?.projectName || projectData?.name,
      link: () => {
        if (!projectData || type != "list") return setTaskData(null);
        return nav("../edit", {
          state: { selectedProject: { ...projectData } },
        });
      },
    },
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

  useEffect(() => {
    // check if it is saved task or not and check if subtask list exist only then call for subtask data
    if (
      taskData?._id &&
      (!taskData?.subTaskData || taskData?.subTaskData.length === 0)
    ) {
      setLoadingSubtask(true);
      const timeout = setTimeout(() => {
        handleGetShowSubtask();
      }, 500); // Adjust the delay time as needed

      return () => clearTimeout(timeout); // Cleanup timeout on unmount or dependency change
    }
  }, []);
  const handleSetCommentId = () => {
    let data =
      subTask != undefined
        ? {
            taskId: taskData?._id,
            subTaskId: subTask?._id,
          }
        : {
            taskId: taskData?._id,
          };

    setDetailCommentId(data);
  };

  useEffect(() => {
    handleSetCommentId();
  }, []);
  const isSubTask = subTaskIdx !== undefined;

  return (
    <Modal
      heading={`Task Details`}
      onClose={() => setTaskData(null)}
      route={route}
      customCss={`w-[90vw] h-[90vh] maxsm:w-[90vw] bg-gray-100 relative  maxsm:max-w-[90vw]`}
      contentParentCss={` maxsm:max-w-[100%]`}
    >
      <div className="flex w-full flex-wrap gap-4 h-full relative ">
        <div className="flex flex-col gap-2 flex-1 detailsPage  ">
          <div className="flex items-center gap-2">
            <input
              className="w-fit maxsm:w-full bg-transparent hover:bg-gray-400 px-4 p-1 rounded-md font-semibold text-lg outline-none focus:bg-gray-400 "
              type="text"
              placeholder="Task Name"
              value={isSubTask ? subTask?.name : taskData?.name}
              name="name"
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
            />

            <div
              className="p-1 hover:bg-gray-400 rounded-md cursor-pointer h-fit"
              onClick={() => handleSetCommentId()}
            >
              <BiCommentDetail className="w-5 h-5  " />
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,300px)] gap-6 maxsm:gap-3 p-4">
            {Object?.entries(isSubTask ? subTask : taskData)?.map(
              ([key, value], idx) => {
                if (feilds?.[key]) {
                  return (
                    <div
                      className="flex gap-2 w-[300px] justify-between items-center"
                      key={idx}
                    >
                      <span className="font-semibold flex gap-2 items-center text-gray-700">
                        {" "}
                        {feilds?.[key]?.icon}
                        {feilds?.[key]?.name}
                      </span>
                      <GetModuleByName
                        moduleName={key}
                        details={value}
                        task={taskData}
                        taskIdx={taskIdx}
                        subTask={subTask}
                        subTaskIdx={subTaskIdx}
                        handleChange={
                          isSubTask ? handleSubTaskChange : handleTaskChange
                        }
                        handleUpdate={
                          isSubTask ? handleSubtaskUpdate : handleTaskUpdate
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

            <div className="flex gap-2 w-[250px] justify-between cursor-pointer ">
              <Menu>
                <MenuHandler>
                  <span className="font-semibold flex gap-2 items-center text-gray-500 hover:text-gray-600">
                    {" "}
                    <MdOutlineAddCircleOutline className="w-5 h-5" />
                    Add Feild{" "}
                  </span>
                </MenuHandler>

                <MenuList className="bg-gray-100 text-gray-900 flex flex-col gap-2 font-manrope">
                  {Object?.entries(ExtraFeilds)?.map(([key, value], iIdx) => {
                    return (
                      <MenuItem
                        key={iIdx}
                        className="p-1"
                        onClick={() => {
                          console.log(value);

                          let e = {
                            target: { name: key, value: value?.defaultValue },
                          };
                          isSubTask
                            ? handleSubTaskChange(e, taskIdx, subTaskIdx)
                            : handleTaskChange(e, taskIdx);
                        }}
                      >
                        <div className="font-semibold flex gap-2 items-center text-gray-800">
                          {" "}
                          {value.icon}
                          {value.name}
                        </div>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </Menu>
            </div>
          </div>

          <textarea
            name="description"
            id=""
            value={isSubTask ? subTask?.description : taskData?.description}
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
            className="bg-gray-300 rounded-md px-4 p-2 placeholder-gray-700"
            placeholder="Task Description"
          ></textarea>
          {isSubTask || (
            <SubtaskTable
              task={taskData}
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
          )}
        </div>
        <div className="w-[400px] h-full  bg-white rounded-md  sticky top-0 right-0 p-2 px-4 flex items-center flex-col gap-1 maxmd:hidden">
          {detailCommentId ? (
            <>
              <div className="font-semibold text-center flex gap-1">
                Comments (
                <span className=" max-w-[15ch] text-center truncate">
                  {getTaskNameById(
                    detailCommentId?.subTaskId ?? detailCommentId?.taskId
                  )}
                </span>
                )
              </div>

              <Comments task={detailCommentId} />
            </>
          ) : (
            <span className="text-gray-600 font-semibold self-center">
              Save the task to use comment
            </span>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DetailedView;
