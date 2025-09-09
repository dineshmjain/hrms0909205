
import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { 
  FaShieldAlt, 
  FaUsers, 
  FaClipboardList, 
  FaChartLine,
  FaFileAlt,
  FaPhone,
  FaExclamationTriangle,
  FaCheckCircle
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import RecentActivity from '../../../components/Dashboard/RecentActivity';
import AttendanceWidget from '../../../components/Dashboard/AttendanceWidget';
import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    assignedGuards: 8,
    activeShifts: 6,
    incidentsThisWeek: 2,
    complianceScore: 96,
    attendance: { present: 8, total: 8, late: 0, absent: 0 }
  });

  const quickActions = [
    {
      label: 'View Reports',
      icon: FaFileAlt,
      color: 'blue',
      onClick: () => navigate('/client/reports')
    },
    {
      label: 'Contact Security',
      icon: FaPhone,
      color: 'green',
      onClick: () => navigate('/client/contact')
    },
    {
      label: 'Service Request',
      icon: FaClipboardList,
      color: 'purple',
      onClick: () => navigate('/client/service-request')
    },
    {
      label: 'Incident History',
      icon: FaExclamationTriangle,
      color: 'orange',
      onClick: () => navigate('/client/incidents')
    }
  ];

  const recentActivities = [
    {
      user: 'Security Team',
      action: 'Completed daily security report',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Guard Captain',
      action: 'Patrol schedule updated',
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
            Client Portal
          </Typography>
          <Typography variant="small" color="gray">
            Monitor your security services and team performance
          </Typography>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assigned Guards"
          value={dashboardData.assignedGuards}
          icon={FaUsers}
          color="blue"
        />
        <MetricCard
          title="Active Shifts"
          value={dashboardData.activeShifts}
          icon={FaShieldAlt}
          color="green"
        />
        <MetricCard
          title="Incidents (Week)"
          value={dashboardData.incidentsThisWeek}
          icon={FaExclamationTriangle}
          color="orange"
        />
        <MetricCard
          title="Compliance Score"
          value={`${dashboardData.complianceScore}%`}
          icon={FaCheckCircle}
          color="purple"
          trend={{ type: 'increase', value: '+2%', label: 'this month' }}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceWidget
            title="Security Team Attendance"
            present={dashboardData.attendance.present}
            total={dashboardData.attendance.total}
            late={dashboardData.attendance.late}
            absent={dashboardData.attendance.absent}
          />
          
          <RecentActivity 
            title="Security Updates"
            activities={recentActivities}
            maxItems={5}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions 
            title="Client Actions"
            actions={quickActions}
          />
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
