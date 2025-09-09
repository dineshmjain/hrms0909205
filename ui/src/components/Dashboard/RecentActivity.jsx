
import React from 'react';
import { Card, CardBody, Typography, Avatar } from '@material-tailwind/react';
import moment from 'moment';

const RecentActivity = ({ title = "Recent Activity", activities = [], maxItems = 5 }) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <Card>
      <CardBody className="p-4">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          {title}
        </Typography>
        <div className="space-y-3">
          {displayActivities.length > 0 ? (
            displayActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <Avatar
                  src={activity.avatar || '/default-avatar.png'}
                  alt={activity.user}
                  size="sm"
                  className="mt-1"
                />
                <div className="flex-1">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {activity.user}
                  </Typography>
                  <Typography variant="small" color="gray" className="mt-1">
                    {activity.action}
                  </Typography>
                  <Typography variant="small" color="gray" className="mt-1 text-xs">
                    {moment(activity.timestamp).fromNow()}
                  </Typography>
                </div>
                {activity.status && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    activity.status === 'success' ? 'bg-green-100 text-green-800' :
                    activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    activity.status === 'error' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {activity.status}
                  </span>
                )}
              </div>
            ))
          ) : (
            <Typography variant="small" color="gray" className="text-center py-4">
              No recent activity
            </Typography>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default RecentActivity;
