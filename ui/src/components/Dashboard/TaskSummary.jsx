
import React from 'react';
import { Card, CardBody, Typography, Chip } from '@material-tailwind/react';

const TaskSummary = ({ 
  title = "Task Summary", 
  tasks = { pending: 0, inProgress: 0, completed: 0, overdue: 0 },
  onTaskClick = null 
}) => {
  const totalTasks = Object.values(tasks).reduce((sum, count) => sum + count, 0);

  const taskTypes = [
    { key: 'pending', label: 'Pending', color: 'gray', count: tasks.pending },
    { key: 'inProgress', label: 'In Progress', color: 'blue', count: tasks.inProgress },
    { key: 'completed', label: 'Completed', color: 'green', count: tasks.completed },
    { key: 'overdue', label: 'Overdue', color: 'red', count: tasks.overdue }
  ];

  return (
    <Card>
      <CardBody className="p-4">
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" color="blue-gray">
            {title}
          </Typography>
          <Typography variant="small" color="gray">
            Total: {totalTasks}
          </Typography>
        </div>
        
        <div className="space-y-3">
          {taskTypes.map((taskType) => (
            <div 
              key={taskType.key}
              className={`flex justify-between items-center p-2 rounded-lg ${
                onTaskClick ? 'cursor-pointer hover:bg-gray-50' : ''
              }`}
              onClick={() => onTaskClick && onTaskClick(taskType.key)}
            >
              <Typography variant="small" color="blue-gray">
                {taskType.label}
              </Typography>
              <Chip
                value={taskType.count}
                color={taskType.color}
                size="sm"
                className="rounded-full"
              />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default TaskSummary;
