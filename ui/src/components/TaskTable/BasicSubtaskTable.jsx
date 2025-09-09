import React from "react";
import Table from "../Table/Table";
import CircleList from "../DetailsListItems/CircleList";
import { MdDelete } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import { Button } from "@material-tailwind/react";

const BasicSubtaskTable = ({
  taskIdx,
  modules,
  task,
  handleSubTaskChange,
  handleSubtaskUpdate,
  setAssignedData,
  handleAddSubTask,
  handleRemoveSubTask,
  setCommentTaskId,
  setSelectedTaskData,
  isLoading,
}) => {
  const actions = [
    {
      title: "delete",
      text: <MdDelete className="w-5 h-5 text-red-600" />,
      onClick: (data, idx, subData, subIdx) => {
        // handleRemoveTask(idx);
      },
    },
    {
      title: "show comments",
      text: <BiCommentDetail className="w-5 h-5 text-gray-600" />,
      onClick: (data, idx) => {
        setCommentTaskId({ taskId: data?._id });
      },
    },
  ];
  const labels = {
    name: {
      DisplayName: "Task Name",
    },
    assignToUserId: {
      DisplayName: "Assigned To",
      type: "function",
      data: (data, idx) => {
        return (
          <div className="flex items-center justify-center  ">
            <CircleList dataList={data?.assignToUserId} />
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
      format: "DD MMM YYYY",
    },
    createdAt: {
      DisplayName: "Created at",
      type: "date",
    },
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <Table
        tableJson={task?.subTaskData || []}
        labels={labels}
        hideSlNo
        showFilter={false}
        pagination={false}
        actions={actions}
      />
      <div className="flex items-center justify-start w-full p-2 ">
        <button className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm hover:text-primary" onClick={() => {}}>Add Subtask</button>
      </div>
    </div>
  );
};

export default BasicSubtaskTable;
