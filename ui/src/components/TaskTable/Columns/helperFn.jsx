import Actions from "./Actions";
import AssignedTo from "./AssignedTo";
import DueBy from "./DueBy";
import Name from "./Name";
import Priority from "./Priority";
import Status from "./Status";
import TaskType from "./TaskType";

// Component Mapping
const moduleComponents = {
  name: Name,
  assigned: AssignedTo,
  taskType: TaskType,
  dueBy: DueBy,
  priority: Priority,
  status: Status,
  actions: Actions,
};

const getModuleByName = (
  moduleName,
  details,
  task,
  taskIdx,
  subTask,
  subTaskIdx,
  handleChange,
  handleUpdate,
  setAssignedData,
  handleAddSubTask,
  handleRemoveSubTask,
  handleShowComments
) => {
  const ModuleComponent = moduleComponents[moduleName];

  if (!ModuleComponent) return <></>; // Return null if no matching component

  return (
    <ModuleComponent
      data={task}
      idx={taskIdx}
      subData={subTask}
      subIdx={subTaskIdx}
      details={details}
      handleChange={handleChange}
      handleUpdate={handleUpdate}
      setAssignedData={setAssignedData}
      handleAddSubTask={handleAddSubTask}
      handleRemoveSubTask={handleRemoveSubTask}
      handleShowComments={handleShowComments}
    />
  );
};

export { getModuleByName };
