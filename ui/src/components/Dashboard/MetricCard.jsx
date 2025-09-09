
import React from 'react';
import { Card, CardBody, Typography } from '@material-tailwind/react';

const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = 'blue', 
  trend = null,
  subtitle = null,
  onClick = null 
}) => {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    red: 'bg-red-500 text-white',
    orange: 'bg-orange-500 text-white',
    purple: 'bg-purple-500 text-white',
    indigo: 'bg-indigo-500 text-white',
    teal: 'bg-teal-500 text-white',
    pink: 'bg-pink-500 text-white'
  };

  return (
    <Card 
      className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <CardBody className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Typography variant="small" color="gray" className="font-medium mb-1">
              {title}
            </Typography>
            <Typography variant="h4" color="blue-gray" className="font-bold">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="small" color="gray" className="mt-1">
                {subtitle}
              </Typography>
            )}
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${
                trend.type === 'increase' ? 'text-green-600' : 
                trend.type === 'decrease' ? 'text-red-600' : 'text-gray-600'
              }`}>
                <span>{trend.value}</span>
                <span className="ml-1">{trend.label}</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default MetricCard;
