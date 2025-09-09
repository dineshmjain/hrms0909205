import React, { useCallback, useEffect, useState } from "react";
import BasicTaskTable from "../BasicTask/BasicTaskTable";
import { useDispatch, useSelector } from "react-redux";
import { usePrompt } from "../../Context/PromptProvider";
import { TaskDeleteAction } from "../../redux/Action/task/taskAction";
import { toast } from "react-hot-toast";
import CommentSection from "../CommentSection/CommentSection";

const MainTaskTable = ({ ...data }) => {
  const [commentTaskId, setCommentTaskId] = useState("");
  const { showPrompt, hidePrompt } = usePrompt();
  const dispatch = useDispatch();

  const {
    taskList,
    setTaskList,
    handleValidateAll,
    handleValidateTask,
    handleAssignNewTask,
    handleAssignNewSubTask,
    modules,
    projectData,
    handleSubTaskValidate,
    type = "create",
  } = data;

  const handleRemoveTaskFromUi = (taskIdx) => {
    setTaskList((prev) => {
      let temp = prev?.filter((_, idx) => idx != taskIdx);
      return [...temp];
    });
  };

  const handleRemoveTask = (taskIdx) => {

    if (!taskList?.[taskIdx]?._id) return handleRemoveTaskFromUi(taskIdx);
    let task = taskList?.[taskIdx];
    showPrompt({
      heading: `Are You Sure?`,
      message: (
        <span>
          {" "}
          You want to delete <b>{task?.name}</b> ?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            dispatch(
              TaskDeleteAction({
                _id: task?._id,
                projectId: task?.projectId,
              })
            )?.then(({ payload }) => {
              if (payload?.status == "200") {
                handleRemoveTaskFromUi(taskIdx);
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

  return (
    <div className="flex flex-col w-full">
      <CommentSection
        task={commentTaskId}
        setTask={setCommentTaskId}
        bringToFront={true}
      />

      <BasicTaskTable
        taskList={taskList}
        setTaskList={setTaskList}
        handleRemoveTask={handleRemoveTask}
        setCommentTaskId={setCommentTaskId}
        modules={modules}
        type="update"
      />
    </div>
  );
};

export default MainTaskTable;
