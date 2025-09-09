
import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { 
  FaWrench, 
  FaTools, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaCog,
  FaClipboardList,
  FaCalendarAlt,
  FaBolt
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import RecentActivity from '../../../components/Dashboard/RecentActivity';
import TaskSummary from '../../../components/Dashboard/TaskSummary';
import { useNavigate } from 'react-router-dom';

const MaintenanceDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    urgentRepairs: 3,
    scheduledMaintenance: 8,
    completedToday: 12,
    equipmentStatus: 95,
    tasks: { pending: 10, inProgress: 7, completed: 25, overdue: 2 }
  });

  const quickActions = [
    {
      label: 'Work Orders',
      icon: FaClipboardList,
      color: 'blue',
      onClick: () => navigate('/maintenance/workorders')
    },
    {
      label: 'Equipment Check',
      icon: FaCog,
      color: 'green',
      onClick: () => navigate('/maintenance/equipment')
    },
    {
      label: 'Emergency Repair',
      icon: FaBolt,
      color: 'red',
      onClick: () => navigate('/maintenance/emergency')
    },
    {
      label: 'Schedule',
      icon: FaCalendarAlt,
      color: 'purple',
      onClick: () => navigate('/maintenance/schedule')
    }
  ];

  const recentActivities = [
    {
      user: 'Maintenance Team',
      action: 'AC unit repaired in Room 205',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Facilities',
      action: 'Elevator maintenance completed',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      status: 'success',
      avatar: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" color="blue-gray" className="font-bold">
            Maintenance Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            Facility maintenance and equipment management
          </Typography>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Urgent Repairs"
          value={dashboardData.urgentRepairs}
          icon={FaExclamationTriangle}
          color="red"
        />
        <MetricCard
          title="Scheduled Tasks"
          value={dashboardData.scheduledMaintenance}
          icon={FaCalendarAlt}
          color="blue"
        />
        <MetricCard
          title="Completed Today"
          value={dashboardData.completedToday}
          icon={FaCheckCircle}
          color="green"
        />
        <MetricCard
          title="Equipment Status"
          value={`${dashboardData.equipmentStatus}%`}
          icon={FaTools}
          color="purple"
          subtitle="Operational"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity 
            title="Maintenance Activities"
            activities={recentActivities}
            maxItems={6}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions 
            title="Maintenance Actions"
            actions={quickActions}
          />
          
          <TaskSummary 
            title="Work Orders"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) => navigate(`/maintenance/tasks?status=${taskType}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
