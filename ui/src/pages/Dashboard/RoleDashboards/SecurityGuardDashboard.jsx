
import React, { useState, useEffect } from 'react';
import { Typography, Button, Card, CardBody } from '@material-tailwind/react';
import { 
  FaMapMarkerAlt, 
  FaClipboardCheck, 
  FaClock, 
  FaExclamationTriangle,
  FaCamera,
  FaRoute,
  FaShieldAlt
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import TaskSummary from '../../../components/Dashboard/TaskSummary';
import { useNavigate } from 'react-router-dom';

const SecurityGuardDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dashboardData, setDashboardData] = useState({
    todayShift: { start: '08:00', end: '20:00', location: 'Corporate Office Building' },
    completedRounds: 3,
    totalRounds: 8,
    incidents: 0,
    tasks: { pending: 2, inProgress: 1, completed: 5, overdue: 0 }
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      label: 'Check In/Out',
      icon: FaClock,
      color: 'blue',
      variant: 'filled',
      onClick: () => navigate('/attendance/checkin')
    },
    {
      label: 'Report Incident',
      icon: FaExclamationTriangle,
      color: 'red',
      onClick: () => navigate('/incident/report')
    },
    {
      label: 'Start Round',
      icon: FaRoute,
      color: 'green',
      onClick: () => navigate('/patrol/start')
    },
    {
      label: 'Take Photo',
      icon: FaCamera,
      color: 'purple',
      onClick: () => navigate('/media/capture')
    }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" color="blue-gray" className="font-bold">
            Security Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            {dashboardData.todayShift.location}
          </Typography>
        </div>
        <div className="text-right">
          <Typography variant="h5" color="blue-gray" className="font-mono">
            {formatTime(currentTime)}
          </Typography>
          <Typography variant="small" color="gray">
            Shift: {dashboardData.todayShift.start} - {dashboardData.todayShift.end}
          </Typography>
        </div>
      </div>

      {/* Current Shift Status */}
      <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h6" className="text-white mb-2">
                Current Shift Status
              </Typography>
              <Typography variant="small" className="text-blue-100">
                Location: {dashboardData.todayShift.location}
              </Typography>
            </div>
            <FaShieldAlt className="h-12 w-12 text-blue-200" />
          </div>
        </CardBody>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Rounds Completed"
          value={`${dashboardData.completedRounds}/${dashboardData.totalRounds}`}
          icon={FaClipboardCheck}
          color="green"
          subtitle="Today's progress"
        />
        <MetricCard
          title="Current Location"
          value="Checkpoint A"
          icon={FaMapMarkerAlt}
          color="blue"
          subtitle="Last scanned"
        />
        <MetricCard
          title="Incidents Today"
          value={dashboardData.incidents}
          icon={FaExclamationTriangle}
          color={dashboardData.incidents > 0 ? 'red' : 'green'}
          subtitle="All clear"
        />
        <MetricCard
          title="Shift Hours"
          value="4.5 hrs"
          icon={FaClock}
          color="purple"
          subtitle="Remaining"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <QuickActions 
            title="Security Actions"
            actions={quickActions}
          />
          
          {/* Patrol Schedule */}
          <Card>
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Today's Patrol Schedule
              </Typography>
              <div className="space-y-3">
                {[
                  { time: '09:00', location: 'Main Entrance', status: 'completed' },
                  { time: '11:00', location: 'Parking Area', status: 'completed' },
                  { time: '13:00', location: 'Building Perimeter', status: 'completed' },
                  { time: '15:00', location: 'Emergency Exits', status: 'pending' },
                  { time: '17:00', location: 'Server Room', status: 'pending' }
                ].map((patrol, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        patrol.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <div>
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {patrol.time}
                        </Typography>
                        <Typography variant="small" color="gray">
                          {patrol.location}
                        </Typography>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      patrol.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {patrol.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <TaskSummary 
            title="My Tasks"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) => navigate(`/tasks?status=${taskType}`)}
          />

          {/* Emergency Contacts */}
          <Card>
            <CardBody className="p-4">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Emergency Contacts
              </Typography>
              <div className="space-y-3">
                <Button 
                  variant="outlined" 
                  color="red" 
                  size="sm" 
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <FaExclamationTriangle className="h-4 w-4" />
                  Emergency - 911
                </Button>
                <Button 
                  variant="outlined" 
                  color="blue" 
                  size="sm" 
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <FaShieldAlt className="h-4 w-4" />
                  Security Control
                </Button>
                <Button 
                  variant="outlined" 
                  color="gray" 
                  size="sm" 
                  fullWidth
                  className="flex items-center justify-center gap-2"
                >
                  <FaClock className="h-4 w-4" />
                  Supervisor
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SecurityGuardDashboard;
