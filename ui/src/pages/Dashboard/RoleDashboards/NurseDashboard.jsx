
import React, { useState } from 'react';
import { Typography } from '@material-tailwind/react';
import { 
  FaUserMd, 
  FaBed, 
  FaClipboardList, 
  FaHeartbeat,
  FaPills,
  FaStethoscope,
  FaAmbulance,
  FaClock
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import RecentActivity from '../../../components/Dashboard/RecentActivity';
import TaskSummary from '../../../components/Dashboard/TaskSummary';
import { useNavigate } from 'react-router-dom';

const NurseDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    assignedPatients: 12,
    criticalPatients: 2,
    medicationsDue: 5,
    shiftHours: 8,
    tasks: { pending: 8, inProgress: 4, completed: 15, overdue: 1 }
  });

  const quickActions = [
    {
      label: 'Patient Rounds',
      icon: FaStethoscope,
      color: 'blue',
      onClick: () => navigate('/nursing/rounds')
    },
    {
      label: 'Medications',
      icon: FaPills,
      color: 'green',
      onClick: () => navigate('/nursing/medications')
    },
    {
      label: 'Emergency',
      icon: FaAmbulance,
      color: 'red',
      onClick: () => navigate('/nursing/emergency')
    },
    {
      label: 'Shift Notes',
      icon: FaClipboardList,
      color: 'purple',
      onClick: () => navigate('/nursing/notes')
    }
  ];

  const recentActivities = [
    {
      user: 'Patient Care',
      action: 'Medication administered to Room 204',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Vital Signs',
      action: 'Blood pressure check completed',
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
            Nursing Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            Patient care and medical task management
          </Typography>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assigned Patients"
          value={dashboardData.assignedPatients}
          icon={FaBed}
          color="blue"
        />
        <MetricCard
          title="Critical Patients"
          value={dashboardData.criticalPatients}
          icon={FaHeartbeat}
          color="red"
        />
        <MetricCard
          title="Medications Due"
          value={dashboardData.medicationsDue}
          icon={FaPills}
          color="orange"
        />
        <MetricCard
          title="Shift Hours"
          value={`${dashboardData.shiftHours}h`}
          icon={FaClock}
          color="purple"
          subtitle="Remaining"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity 
            title="Patient Care Activities"
            activities={recentActivities}
            maxItems={6}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions 
            title="Nursing Actions"
            actions={quickActions}
          />
          
          <TaskSummary 
            title="Medical Tasks"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) => navigate(`/nursing/tasks?status=${taskType}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
