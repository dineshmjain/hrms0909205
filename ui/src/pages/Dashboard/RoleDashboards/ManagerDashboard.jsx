
import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { 
  FaUsers, 
  FaClipboardList, 
  FaChartLine, 
  FaExclamationCircle,
  FaUserPlus,
  FaFileAlt,
  FaCalendarAlt,
  FaBell
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import RecentActivity from '../../../components/Dashboard/RecentActivity';
import AttendanceWidget from '../../../components/Dashboard/AttendanceWidget';
import TaskSummary from '../../../components/Dashboard/TaskSummary';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    teamSize: 25,
    activeProjects: 8,
    pendingApprovals: 4,
    performanceScore: 92,
    attendance: { present: 23, total: 25, late: 1, absent: 1 },
    tasks: { pending: 12, inProgress: 18, completed: 35, overdue: 2 }
  });

  const quickActions = [
    {
      label: 'Team Schedule',
      icon: FaCalendarAlt,
      color: 'blue',
      onClick: () => navigate('/schedule/team')
    },
    {
      label: 'Approve Requests',
      icon: FaFileAlt,
      color: 'green',
      onClick: () => navigate('/approvals')
    },
    {
      label: 'Add Team Member',
      icon: FaUserPlus,
      color: 'purple',
      onClick: () => navigate('/user/add')
    },
    {
      label: 'Performance Report',
      icon: FaChartLine,
      color: 'orange',
      onClick: () => navigate('/reports/performance')
    }
  ];

  const recentActivities = [
    {
      user: 'Sarah Wilson',
      action: 'Submitted leave request for approval',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      status: 'pending',
      avatar: null
    },
    {
      user: 'Tom Anderson',
      action: 'Completed security audit report',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Lisa Brown',
      action: 'Assigned to new client project',
      timestamp: new Date(Date.now() - 120 * 60 * 1000),
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
            Manager Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            Monitor and manage your team performance
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative">
            <FaBell className="h-5 w-5 text-gray-600" />
            {dashboardData.pendingApprovals > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {dashboardData.pendingApprovals}
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Team Members"
          value={dashboardData.teamSize}
          icon={FaUsers}
          color="blue"
          onClick={() => navigate('/user?manager=me')}
        />
        <MetricCard
          title="Active Projects"
          value={dashboardData.activeProjects}
          icon={FaClipboardList}
          color="green"
          onClick={() => navigate('/projects')}
        />
        <MetricCard
          title="Pending Approvals"
          value={dashboardData.pendingApprovals}
          icon={FaExclamationCircle}
          color="orange"
          onClick={() => navigate('/approvals')}
        />
        <MetricCard
          title="Team Performance"
          value={`${dashboardData.performanceScore}%`}
          icon={FaChartLine}
          color="purple"
          trend={{ type: 'increase', value: '+3%', label: 'this month' }}
          onClick={() => navigate('/reports/performance')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceWidget
            title="Team Attendance Today"
            present={dashboardData.attendance.present}
            total={dashboardData.attendance.total}
            late={dashboardData.attendance.late}
            absent={dashboardData.attendance.absent}
          />
          
          <RecentActivity 
            title="Team Activity"
            activities={recentActivities}
            maxItems={5}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions 
            title="Manager Actions"
            actions={quickActions}
          />
          
          <TaskSummary 
            title="Team Tasks"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) => navigate(`/tasks?team=me&status=${taskType}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
