import React, { useState, useEffect } from 'react';
import { Typography } from '@material-tailwind/react';
import { 
  FaUsers, 
  FaBuilding, 
  FaUserTie, 
  FaClipboardList, 
  FaPlus, 
  FaCog, 
  FaChartBar,
  FaUserShield
} from 'react-icons/fa';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';
import RecentActivity from '../../../components/Dashboard/RecentActivity';
import AttendanceWidget from '../../../components/Dashboard/AttendanceWidget';
import TaskSummary from '../../../components/Dashboard/TaskSummary';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../config/axiosInstance';
import { useDispatch } from 'react-redux';
import { getOverAllDashboardAction } from '../../../redux/Action/Dashboard/Dashboard';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 150,
    totalClients: 25,
    activeBranches: 12,
    pendingTasks: 8,
    attendance: { present: 142, total: 150, late: 5, absent: 3 },
    tasks: { pending: 15, inProgress: 23, completed: 45, overdue: 3 }
  });

  const [metrics, setMetrics] = useState([
    { title: 'Total Employees', value: '0', change: '0%', changeType: 'neutral' },
    { title: 'Active Branches', value: '0', change: '0', changeType: 'neutral' },
    { title: 'Total Clients', value: '0', change: '0%', changeType: 'neutral' },
    { title: 'Pending Tasks', value: '0', change: '0%', changeType: 'neutral' },
  ]);

  const [loading, setLoading] = useState(true);
const dispatch =useDispatch()
  useEffect(() => {
    fetchDashboardData();
  }, []);
const {dashboard}=useSelector((state)=>state?.dashboard)
console.log(dashboard,'dashboard')
  const fetchDashboardData = async () => {
    try {
      // Try to fetch real data first
      try {
        dispatch(getOverAllDashboardAction())
     setLoading(false)
      } catch (apiError) {
        console.warn('API not available, using mock data:', apiError.message);
      }

      // Set mock data for demonstration
      setMetrics([
        { title: 'Total Employees', value: '145', change: '+12%', changeType: 'positive' },
        { title: 'Active Branches', value: '8', change: '+2', changeType: 'positive' },
        { title: 'Total Clients', value: '23', change: '+5%', changeType: 'positive' },
        { title: 'Pending Tasks', value: '12', change: '-15%', changeType: 'negative' },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Still show mock data even if there's an error
      setMetrics([
        { title: 'Total Employees', value: '145', change: '+12%', changeType: 'positive' },
        { title: 'Active Branches', value: '8', change: '+2', changeType: 'positive' },
        { title: 'Total Clients', value: '23', change: '+5%', changeType: 'positive' },
        { title: 'Pending Tasks', value: '12', change: '-15%', changeType: 'negative' },
      ]);
      setLoading(false);
    }
  };


  const quickActions = [
    {
      label: 'Add Employee',
      icon: FaPlus,
      color: 'blue',
      onClick: () => navigate('/user/add')
    },
    {
      label: 'Add Client',
      icon: FaBuilding,
      color: 'green',
      onClick: () => navigate('/client/add')
    },
    {
      label: 'System Settings',
      icon: FaCog,
      color: 'gray',
      onClick: () => navigate('/settings')
    },
    {
      label: 'Reports',
      icon: FaChartBar,
      color: 'purple',
      onClick: () => navigate('/reports')
    }
  ];

  const activities = [
    { type: 'user', message: 'Admin dashboard loaded successfully', timestamp: 'Just now', status: 'success' },
    { type: 'system', message: 'System running normally', timestamp: '5 minutes ago', status: 'info' },
    { type: 'info', message: 'Welcome to HRMS Admin Dashboard', timestamp: '10 minutes ago', status: 'info' },
  ];

  const recentActivities = [
    {
      user: 'John Doe',
      action: 'Completed security round at Client Site A',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Jane Smith',
      action: 'New employee onboarding completed',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'success',
      avatar: null
    },
    {
      user: 'Mike Johnson',
      action: 'Late check-in reported',
      timestamp: new Date(Date.now() - 90 * 60 * 1000),
      status: 'pending',
      avatar: null
    }
  ];

  const updatedQuickActions = [
    { title: 'Add Employee', description: 'Register new employee', icon: 'user-plus', action: () => window.location.href = '/user/add' },
    { title: 'Create Branch', description: 'Add new branch location', icon: 'building', action: () => window.location.href = '/branch/add' },
    { title: 'View Reports', description: 'Attendance & analytics', icon: 'chart', action: () => window.location.href = '/reports' },
    { title: 'Manage Roles', description: 'Configure user roles', icon: 'settings', action: () => window.location.href = '/roles' },
  ];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" color="blue-gray" className="font-bold">
            Admin Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            Complete overview of your HRMS system
          </Typography>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboard?.users &&<MetricCard
          title="Total Employees"
          value={dashboard?.users?.[0]?.active}
          icon={FaUsers}
          color="blue"
          trend={{ type: 'increase', value:  `+ ${dashboard?.users?.[0]?.current}`, label: 'this month' }}
          onClick={() => navigate('/user')}
        /> }
       {dashboard?.clients && <MetricCard
          title="Active Clients"
         value={dashboard?.clients?.[0]?.active}
          icon={FaBuilding}
          color="green"
          trend={{ type: 'increase', value:  `+ ${dashboard?.clients?.[0]?.current}`, label: 'this month' }}
          onClick={() => navigate('/client')}
        />
       }
        {dashboard?.branches &&<MetricCard
          title="Branches"
        value={dashboard?.branches?.[0]?.active}
          icon={FaUserShield}
           trend={{ type: 'increase', value:  `+ ${dashboard?.branches?.[0]?.current}`, label: 'this month' }}

          color="purple"
          onClick={() => navigate('/branch')}
        />
}
        <MetricCard
          title="Pending Tasks"
          value={dashboardData.pendingTasks}
          icon={FaClipboardList}
          color="orange"
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceWidget
            title="Today's Attendance Overview"
            present={dashboardData.attendance.present}
            total={dashboardData.attendance.total}
            late={dashboardData.attendance.late}
            absent={dashboardData.attendance.absent}
          />

          <RecentActivity 
            title="Recent System Activity"
            activities={recentActivities}
            maxItems={5}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions 
            title="Admin Actions"
            actions={quickActions}
          />

          <TaskSummary 
            title="System Tasks"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) => navigate(`/tasks?status=${taskType}`)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;