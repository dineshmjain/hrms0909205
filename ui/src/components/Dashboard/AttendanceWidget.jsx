
import React from 'react';
import { Card, CardBody, Typography, Progress } from '@material-tailwind/react';

const AttendanceWidget = ({ 
  title = "Today's Attendance", 
  present = 0, 
  total = 0, 
  late = 0, 
  absent = 0,
  showBreakdown = true 
}) => {
  const presentPercentage = total > 0 ? Math.round((present / total) * 100) : 0;
  const latePercentage = total > 0 ? Math.round((late / total) * 100) : 0;
  const absentPercentage = total > 0 ? Math.round((absent / total) * 100) : 0;

  return (
    <Card>
      <CardBody className="p-4">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          {title}
        </Typography>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Typography variant="small" color="gray">
              Present
            </Typography>
            <Typography variant="small" color="blue-gray" className="font-medium">
              {present}/{total} ({presentPercentage}%)
            </Typography>
          </div>
          <Progress value={presentPercentage} color="green" className="h-2" />
        </div>

        {showBreakdown && (
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-green-50 rounded">
              <Typography variant="h6" color="green" className="font-bold">
                {present}
              </Typography>
              <Typography variant="small" color="gray">
                Present
              </Typography>
            </div>
            <div className="p-2 bg-orange-50 rounded">
              <Typography variant="h6" color="orange" className="font-bold">
                {late}
              </Typography>
              <Typography variant="small" color="gray">
                Late
              </Typography>
            </div>
            <div className="p-2 bg-red-50 rounded">
              <Typography variant="h6" color="red" className="font-bold">
                {absent}
              </Typography>
              <Typography variant="small" color="gray">
                Absent
              </Typography>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default AttendanceWidget;
