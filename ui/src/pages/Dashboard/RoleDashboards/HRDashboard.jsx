
import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { 
  FaUsers, 
  FaUserPlus, 
  FaCalendarAlt, 
  FaFileAlt,
  FaBriefcase,
  FaGraduationCap,
  FaChartPie,
  FaAward
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import RecentActivity from '../../../components/Dashboard/RecentActivity';
import TaskSummary from '../../../components/Dashboard/TaskSummary';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 150,
    newHires: 5,
    pendingLeaves: 8,
    openPositions: 3,
    tasks: { pending: 15, inProgress: 10, completed: 25, overdue: 2 }
  });

  const quickActions = [
    {
      label: 'Add Employee',
      icon: FaUserPlus,
      color: 'blue',
      onClick: () => navigate('/user/add')
    },
    {
      label: 'Leave Requests',
      icon: FaCalendarAlt,
      color: 'green',
      onClick: () => navigate('/leave/requests')
    },
    {
      label: 'Recruitment',
      icon: FaBriefcase,
      color: 'purple',
      onClick: () => navigate('/recruitment')
    },
    {
      label: 'Training',
      icon: FaGraduationCap,
      color: 'orange',
      onClick: () => navigate('/training')
    }
  ];

  const recentActivities = [
    {
      user: 'John Smith',
      action: 'Leave request approved',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Sarah Johnson',
      action: 'New employee onboarding completed',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Mike Wilson',
      action: 'Training session scheduled',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      status: 'pending',
      avatar: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" color="blue-gray" className="font-bold">
            HR Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            Manage human resources and employee lifecycle
          </Typography>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Employees"
          value={dashboardData.totalEmployees}
          icon={FaUsers}
          color="blue"
          trend={{ type: 'increase', value: '+5', label: 'this month' }}
          onClick={() => navigate('/user')}
        />
        <MetricCard
          title="New Hires"
          value={dashboardData.newHires}
          icon={FaUserPlus}
          color="green"
          subtitle="This month"
          onClick={() => navigate('/user?filter=new')}
        />
        <MetricCard
          title="Pending Leaves"
          value={dashboardData.pendingLeaves}
          icon={FaCalendarAlt}
          color="orange"
          onClick={() => navigate('/leave/pending')}
        />
        <MetricCard
          title="Open Positions"
          value={dashboardData.openPositions}
          icon={FaBriefcase}
          color="purple"
          onClick={() => navigate('/recruitment/open')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity 
            title="HR Activities"
            activities={recentActivities}
            maxItems={6}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions 
            title="HR Actions"
            actions={quickActions}
          />
          
          <TaskSummary 
            title="HR Tasks"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) => navigate(`/tasks?department=hr&status=${taskType}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
