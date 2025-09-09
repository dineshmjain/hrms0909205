
import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { 
  FaUsers, 
  FaClipboardList, 
  FaMapMarkerAlt, 
  FaExclamationTriangle,
  FaRoute,
  FaCheckCircle,
  FaEye,
  FaClipboardCheck
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import RecentActivity from '../../../components/Dashboard/RecentActivity';
import AttendanceWidget from '../../../components/Dashboard/AttendanceWidget';
import TaskSummary from '../../../components/Dashboard/TaskSummary';
import { useNavigate } from 'react-router-dom';

const SupervisorDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    teamMembers: 12,
    activePatrols: 3,
    incidentsToday: 1,
    completedRounds: 15,
    attendance: { present: 11, total: 12, late: 0, absent: 1 },
    tasks: { pending: 8, inProgress: 5, completed: 20, overdue: 1 }
  });

  const quickActions = [
    {
      label: 'Monitor Team',
      icon: FaEye,
      color: 'blue',
      onClick: () => navigate('/monitoring/team')
    },
    {
      label: 'Assign Patrol',
      icon: FaRoute,
      color: 'green',
      onClick: () => navigate('/patrol/assign')
    },
    {
      label: 'Review Reports',
      icon: FaClipboardCheck,
      color: 'purple',
      onClick: () => navigate('/reports/daily')
    },
    {
      label: 'Check Incidents',
      icon: FaExclamationTriangle,
      color: 'red',
      onClick: () => navigate('/incidents')
    }
  ];

  const recentActivities = [
    {
      user: 'Guard Smith',
      action: 'Completed perimeter check at Site B',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Guard Johnson',
      action: 'Reported suspicious activity',
      timestamp: new Date(Date.now() - 35 * 60 * 1000),
      status: 'pending',
      avatar: null
    },
    {
      user: 'Guard Davis',
      action: 'Started night shift patrol',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
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
            Supervisor Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            Monitor and coordinate field operations
          </Typography>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Team Members"
          value={dashboardData.teamMembers}
          icon={FaUsers}
          color="blue"
          onClick={() => navigate('/team/overview')}
        />
        <MetricCard
          title="Active Patrols"
          value={dashboardData.activePatrols}
          icon={FaMapMarkerAlt}
          color="green"
          onClick={() => navigate('/patrol/active')}
        />
        <MetricCard
          title="Incidents Today"
          value={dashboardData.incidentsToday}
          icon={FaExclamationTriangle}
          color={dashboardData.incidentsToday > 0 ? 'red' : 'green'}
          onClick={() => navigate('/incidents/today')}
        />
        <MetricCard
          title="Completed Rounds"
          value={dashboardData.completedRounds}
          icon={FaCheckCircle}
          color="purple"
          subtitle="Today"
          onClick={() => navigate('/rounds/completed')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceWidget
            title="Team Attendance"
            present={dashboardData.attendance.present}
            total={dashboardData.attendance.total}
            late={dashboardData.attendance.late}
            absent={dashboardData.attendance.absent}
          />
          
          <RecentActivity 
            title="Field Operations"
            activities={recentActivities}
            maxItems={6}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions 
            title="Supervisor Actions"
            actions={quickActions}
          />
          
          <TaskSummary 
            title="Field Tasks"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) => navigate(`/tasks?supervisor=me&status=${taskType}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default SupervisorDashboard;
