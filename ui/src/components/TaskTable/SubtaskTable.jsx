import React from "react";
import { GetModuleByName } from "./Columns/GetModuleByName";
import Skeleton from "react-loading-skeleton";

const SubtaskTable = ({
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

  const handleParentClicked = (event, subTaskIdx) => {
    if (
      event.target.closest(".prevent-modal-open") === null // Ensure elements with this class don't trigger opening of
    ) {
      setSelectedTaskData({ subIdx: subTaskIdx, idx: taskIdx });
    }
  };
  return (
    <div className="relative overflow-x-scroll w-full overflow-y-scroll   border rounded-md border-gray-500 shadow-sm  max-h-[500px] scrolls  ">
      <table className="w-full text-sm text-left  rtl:text-right text-gray-900 ">
        <thead className=" text-xs uppercase  z-20 text-center  top-0 right-0 border-b border-gray-500 bg-primary text-white">
          <tr>
            {Object?.entries(modules)?.map(([key, value], headerIdx) => {
              return (
                <th scope="col" key={headerIdx} className="hover:bg-gray-900">
                  <div className=" flex items-center px-6 py-3 text-nowrap justify-center cursor-pointer">
                    <span>{value?.DisplayName}</span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className=" bg-background  ">
          {isLoading && (
            <tr className=" text-gray-900  group text-center text-nowrap w-full h-full overflow-hidden border-gray-500 animate-pulse border-b-2">
              <td
                colSpan={10}
                className="bg-gray-400  min-h-[20px] p-4"
              >
                {" "}
              </td>
            </tr>
          )}
          {task?.subTaskData?.map((subTask, subTaskIdx) => {
            return (
              <tr
                className=" text-gray-900  group text-center text-nowrap border-b border-gray-300  bg-gray-200 hover:bg-gray-300  divide-gray-500"
                key={subTaskIdx}
                onClick={(e) => {
                  handleParentClicked(e, subTaskIdx);
                }}
              >
                {Object?.entries(modules)?.map(([key, value], headerIdx) => {
                  return (
                    <td className="p-2" key={`${key}-${subTaskIdx}`}>
                      <GetModuleByName
                        moduleName={key}
                        details={value}
                        task={task}
                        taskIdx={taskIdx}
                        subTask={subTask}
                        subTaskIdx={subTaskIdx}
                        handleChange={handleSubTaskChange}
                        handleUpdate={handleSubtaskUpdate}
                        setAssignedData={setAssignedData}
                        handleAddSubTask={handleAddSubTask}
                        handleRemoveSubTask={handleRemoveSubTask}
                        handleShowComments={setCommentTaskId}
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {task?.subTaskData?.length == 0 && (
        <div className="w-full text-center flex items-center justify-center  font-medium  p-2 gap-1 text-md">
          No sub-task found.{" "}
          <span
            className="text-blue-700 cursor-pointer hover:underline font-medium"
            onClick={() => {
              return handleAddSubTask(taskIdx);
            }}
          >
            {" "}
            Add New{" "}
          </span>
        </div>
      )}
    </div>
  );
};

export default SubtaskTable;
