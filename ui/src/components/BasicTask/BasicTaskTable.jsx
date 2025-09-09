import React, { useRef, useState } from "react";
import CircleList from "../DetailsListItems/CircleList";
import { MdDelete } from "react-icons/md";
import { usePrompt } from "../../context/PromptProvider";
import { BiCommentDetail } from "react-icons/bi";
import { useSelector } from "react-redux";
import BasicTaskModal from "../../pages/Tasks/DetailedView/BasicTaskModal";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import CommentSection from "../CommentSection/CommentSection";
import { TaskDeleteAction } from "../../redux/Action/task/taskAction";
import { camelCaseToText } from "../../constants/reusableFun";
import { Chip } from "@material-tailwind/react";
import Table from "../Table/Table";

const BasicTaskTable = ({
  taskList,
  setTaskList,
  modules,
  selectedProject,
  onDataChange,
}) => {
  const location = useLocation();
  const pageName = location.pathname.split("/")[1];
  const { loading, totalRecord, limit, pageNo } = useSelector(
    (state) => state?.task
  );


  const [selectedTaskIdx, setSelectedTaskIdx] = useState(-1);
  const [commentTaskId, setCommentTaskId] = useState("");
  const { showPrompt, hidePrompt } = usePrompt();
  const dispatch = useDispatch();
  const labels = {
    name: {
      DisplayName: `${camelCaseToText(pageName)} Name`,
    },
    assignToUserId: {
      DisplayName: "Assigned To",
      type: "function",
      data: (data, idx) => {
        return (
          <div className="flex items-center justify-center  ">
            <CircleList dataList={data?.assignToUserId || []} />
          </div>
        );
      },
    },
    status: {
      DisplayName: "Status",
      type: "chip",
      colorData: {
        pending: "#fde047",
        inProgress: "#ffa500",
        completed: "#008000",
      },
    },
    priority: {
      DisplayName: "Priority",
      type: "chip",
      colorData: { high: "#cc2b2b", medium: "#0f27af", low: "#808080" },
    },

    endDate: {
      DisplayName: "Due By",
      type: "time",
      format: "DD MMM YYYY hh:mm A",
    },
    createdAt: {
      DisplayName: "Created at",
      type: "time",
      format: "DD MMM YYYY hh:mm A",
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx, subData, subIdx) => {
        return (
          <div className="flex justify-center items-center gap-2" key={idx}>
            <div className="flex justify-center items-center gap-2" key={idx}>
              <Chip
                color={data?.isActive ? "green" : "red"}
                variant="ghost"
                value={data?.isActive ? "Active" : "Inactive"}
                className="cursor-pointer font-poppins"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTask(idx);
                }}
              />
            </div>
          </div>
        );
      },
    },
  };
  const handleRemoveTaskFromUi = (taskIdx) => {
    setTaskList((prev) => {
      let temp = prev?.filter((_, idx) => idx != taskIdx);
      return [...temp];
    });
  };

  const handleRemoveTask = (taskIdx) => {
    let task = taskList?.[taskIdx];
    showPrompt({
      heading: `Are You Sure?`,
      message: (
        <span>
          {" "}
          You want to Deactivate <b>{task?.name}</b> ?
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

  const actions = [
    // {
    //   title: "delete",
    //   text: <MdDelete className="w-5 h-5 text-red-600" />,
    //   onClick: (data, idx) => {
    //     handleRemoveTask(idx);
    //   },
    // },
    {
      title: "show comments",
      text: <BiCommentDetail className="w-5 h-5 text-gray-600" />,
      onClick: (data, idx) => {
        setCommentTaskId({ taskId: data?._id });
      },
    },
  ];

  const handleRowClick = (data, idx) => {
    setSelectedTaskIdx(idx);
  };

  return (
    <div className={`flex flex-col gap-2 w-full`}>
      <CommentSection
        task={commentTaskId}
        setTask={setCommentTaskId}
        // bringToFront={true}
      />
      {selectedTaskIdx >= 0 && (
        <BasicTaskModal
          taskData={taskList?.[selectedTaskIdx]}
          setTaskData={setSelectedTaskIdx}
          modules={modules}
          setCommentTaskId={setCommentTaskId}
          projectData={selectedProject}
          pageName={pageName}
          type="update"
        />
      )}
      <Table
        tableJson={taskList ?? []}
        labels={labels}
        hideSlNo
        actions={actions}
        pagination={true}
        isLoading={loading}
        onRowClick={handleRowClick}
        paginationProps={{
          totalRecord,
          limit,
          pageNo,
          onDataChange,
        }}
      />
    </div>
  );
};

export default BasicTaskTable;
