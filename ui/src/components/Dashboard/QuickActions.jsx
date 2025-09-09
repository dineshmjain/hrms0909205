
import React from 'react';
import { Card, CardBody, Typography, Button } from '@material-tailwind/react';

const QuickActions = ({ title = "Quick Actions", actions = [] }) => {
  return (
    <Card>
      <CardBody className="p-4">
        <Typography variant="h6" color="blue-gray" className="mb-4">
          {title}
        </Typography>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'outlined'}
              color={action.color || 'blue'}
              size="sm"
              className="flex items-center justify-center gap-2 p-3"
              onClick={action.onClick}
            >
              {action.icon && <action.icon className="h-4 w-4" />}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default QuickActions;
