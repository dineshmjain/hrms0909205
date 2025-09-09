import Actions from "./Actions";
import AssignedTo from "./AssignedTo";
import AssignmentType from "./AssignmentType";
import checkpoints from "./checkpoints";
import Designation from "./Designation";
import DueBy from "./DueBy";
import EndDate from "./EndDate";
import EndTime from "./EndTime";
import Gps from "./Gps";
import Name from "./Name";
import Priority from "./Priority";
import StartDate from "./StartDate";
import StartTime from "./StartTime";
import Status from "./Status";
import TaskCompleteType from "./TaskCompleteType";
import TaskRecognition from "./TaskRecognisition";
import TaskType from "./TaskType";
import Times from "./Times";

// Component Mapping
const moduleComponents = {
  name: Name,
  assignedTo: AssignedTo,
  taskType: TaskType,
  dueBy: DueBy,
  priority: Priority,
  status: Status,
  actions: Actions,
  startDate: StartDate,
  startTime: StartTime,
  endTime: EndTime,
  assignmentType: AssignmentType,
  endDate: EndDate,
  taskRecognition: TaskRecognition,
  taskEndType: TaskCompleteType,
  GPSLocation: Gps,
  checkpointIds: checkpoints,
  times: Times,
  
};

export const GetModuleByName = ({
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
  timesIdx,
  handleRemoveSubTask,
  handleShowComments,
  projectData,
}) => {
  const ModuleComponent = moduleComponents[moduleName];

  if (!ModuleComponent) return <></>; // Return null if no matching component

  return (
    <ModuleComponent
      data={task}
      idx={taskIdx}
      subData={subTask}
      subIdx={subTaskIdx}
      details={details} // can be removed later  ( modules)
      handleChange={handleChange}
      handleUpdate={handleUpdate}
      setAssignedData={setAssignedData}
      handleAddSubTask={handleAddSubTask}
      handleRemoveSubTask={handleRemoveSubTask}
      handleShowComments={handleShowComments}
      timesIdx={timesIdx}
      projectData={projectData}
    />
  );
};
