import React, { useState, useEffect } from 'react';
import { Card, CardBody, Typography, Button, Tabs, TabsHeader, Tab, TabsBody, TabPanel } from '@material-tailwind/react';
import { 
  FaUsers, 
  FaMapMarkerAlt, 
  FaClipboardList, 
  FaUserPlus, 
  FaMoneyBillWave, 
  FaChartLine,
  FaShieldAlt,
  FaExclamationTriangle,
  FaGraduationCap,
  FaBullhorn,
  FaTools,
  FaAward
} from 'react-icons/fa';
import { 
  MdDashboard, 
  MdLocationOn, 
  MdPeople, 
  MdSchedule, 
  MdSecurity,
  MdAssignmentTurnedIn,
  MdPersonAdd,
  MdAccountBalance,
  MdReport,
  MdNotifications
} from 'react-icons/md';
import MetricCard from '../../../components/Dashboard/MetricCard';
import QuickActions from '../../../components/Dashboard/QuickActions';

// Import Field Officer modules
import ClientPOManagement from './FieldOfficer/ClientPOManagement';
import ShiftResourceMapping from './FieldOfficer/ShiftResourceMapping';
import GeofencingCheckpoints from './FieldOfficer/GeofencingCheckpoints';
import RandomAudit from './FieldOfficer/RandomAudit';
import EmployeeOnboarding from './FieldOfficer/EmployeeOnboarding';
import EmployeeLifecycle from './FieldOfficer/EmployeeLifecycle';
import FieldOfficerAttendance from './FieldOfficer/FieldOfficerAttendance';
import FinanceManagement from './FieldOfficer/FinanceManagement';
import ReportsModule from './FieldOfficer/ReportsModule';
import AdditionalFunctions from './FieldOfficer/AdditionalFunctions';

const FieldOfficerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [dashboardData, setDashboardData] = useState({
    totalClients: 12,
    activeShifts: 8,
    onDutyStaff: 145,
    pendingAudits: 3,
    totalCheckpoints: 24,
    completedAudits: 18,
    pendingOnboarding: 5,
    monthlyPayroll: 325000
  });

  // Mock data for demonstration
  useEffect(() => {
    // In real implementation, fetch data from API
    // fetchFieldOfficerData();
  }, []);

  const tabsData = [
    {
      label: 'Overview',
      value: 'overview',
      icon: MdDashboard
    },
    {
      label: 'Client & PO',
      value: 'client-po',
      icon: MdPeople
    },
    {
      label: 'Shifts & Resources',
      value: 'shifts',
      icon: MdSchedule
    },
    {
      label: 'Geofencing',
      value: 'geofencing',
      icon: MdLocationOn
    },
    {
      label: 'Audits',
      value: 'audits',
      icon: MdSecurity
    },
    {
      label: 'Onboarding',
      value: 'onboarding',
      icon: MdPersonAdd
    },
    {
      label: 'Employee Lifecycle',
      value: 'lifecycle',
      icon: FaUsers
    },
    {
      label: 'Attendance',
      value: 'attendance',
      icon: MdAssignmentTurnedIn
    },
    {
      label: 'Finance',
      value: 'finance',
      icon: MdAccountBalance
    },
    {
      label: 'Reports',
      value: 'reports',
      icon: MdReport
    },
    {
      label: 'Additional',
      value: 'additional',
      icon: MdNotifications
    }
  ];

  const quickActions = [
    {
      label: 'Quick Audit',
      icon: FaShieldAlt,
      color: 'blue',
      variant: 'filled',
      onClick: () => setActiveTab('audits')
    },
    {
      label: 'Emergency Alert',
      icon: FaExclamationTriangle,
      color: 'red',
      variant: 'filled',
      onClick: () => setActiveTab('additional')
    },
    {
      label: 'Mark Attendance',
      icon: FaClipboardList,
      color: 'green',
      variant: 'filled',
      onClick: () => setActiveTab('attendance')
    },
    {
      label: 'Add Employee',
      icon: FaUserPlus,
      color: 'purple',
      variant: 'outlined',
      onClick: () => setActiveTab('onboarding')
    },
    {
      label: 'Salary Payment',
      icon: FaMoneyBillWave,
      color: 'orange',
      variant: 'outlined',
      onClick: () => setActiveTab('finance')
    },
    {
      label: 'View Reports',
      icon: FaChartLine,
      color: 'teal',
      variant: 'outlined',
      onClick: () => setActiveTab('reports')
    }
  ];

  const OverviewContent = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Clients"
          value={dashboardData.totalClients}
          icon={MdPeople}
          color="blue"
          trend={{ type: 'increase', value: '+2', label: 'this month' }}
          onClick={() => setActiveTab('client-po')}
        />
        <MetricCard
          title="Active Shifts"
          value={dashboardData.activeShifts}
          icon={MdSchedule}
          color="green"
          trend={{ type: 'stable', value: '0', label: 'no change' }}
          onClick={() => setActiveTab('shifts')}
        />
        <MetricCard
          title="On Duty Staff"
          value={dashboardData.onDutyStaff}
          icon={FaUsers}
          color="purple"
          trend={{ type: 'increase', value: '+12', label: 'today' }}
          onClick={() => setActiveTab('lifecycle')}
        />
        <MetricCard
          title="Pending Audits"
          value={dashboardData.pendingAudits}
          icon={MdSecurity}
          color="orange"
          trend={{ type: 'decrease', value: '-2', label: 'this week' }}
          onClick={() => setActiveTab('audits')}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions title="Field Officer Quick Actions" actions={quickActions} />
        </div>
        
        {/* Recent Activities */}
        <Card>
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Recent Activities
            </Typography>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-500 text-white rounded-full">
                  <FaShieldAlt className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Audit completed at ABC Corp
                  </Typography>
                  <Typography variant="small" color="gray">
                    2 hours ago
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-500 text-white rounded-full">
                  <FaUserPlus className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    New employee onboarded
                  </Typography>
                  <Typography variant="small" color="gray">
                    4 hours ago
                  </Typography>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                <div className="p-2 bg-orange-500 text-white rounded-full">
                  <FaMapMarkerAlt className="h-3 w-3" />
                </div>
                <div className="flex-1">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Checkpoint missed alert
                  </Typography>
                  <Typography variant="small" color="gray">
                    6 hours ago
                  </Typography>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Additional Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-teal-500 text-white rounded-lg">
                <FaMapMarkerAlt className="h-5 w-5" />
              </div>
              <Typography variant="h6" color="blue-gray">
                Checkpoints Status
              </Typography>
            </div>
            <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
              {dashboardData.totalCheckpoints}
            </Typography>
            <Typography variant="small" color="gray">
              Total active checkpoints across all clients
            </Typography>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-indigo-500 text-white rounded-lg">
                <FaAward className="h-5 w-5" />
              </div>
              <Typography variant="h6" color="blue-gray">
                Completed Audits
              </Typography>
            </div>
            <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
              {dashboardData.completedAudits}
            </Typography>
            <Typography variant="small" color="gray">
              Audits completed this month
            </Typography>
          </CardBody>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-pink-500 text-white rounded-lg">
                <FaGraduationCap className="h-5 w-5" />
              </div>
              <Typography variant="h6" color="blue-gray">
                Pending Onboarding
              </Typography>
            </div>
            <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
              {dashboardData.pendingOnboarding}
            </Typography>
            <Typography variant="small" color="gray">
              Candidates awaiting approval
            </Typography>
          </CardBody>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Field Officer Dashboard
        </Typography>
        <Typography color="gray" className="font-normal">
          Manage field operations, staff allocation, audits, and on-ground activities.
        </Typography>
      </div>

      <Tabs value={activeTab} className="w-full">
        <TabsHeader className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-11 gap-1 bg-gray-100 p-1">
          {tabsData.map(({ label, value, icon: Icon }) => (
            <Tab 
              key={value} 
              value={value}
              className="py-2 px-1 text-xs font-medium"
              onClick={() => setActiveTab(value)}
            >
              <div className="flex flex-col items-center gap-1">
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </div>
            </Tab>
          ))}
        </TabsHeader>
        
        <TabsBody className="mt-6">
          <TabPanel value="overview" className="p-0">
            <OverviewContent />
          </TabPanel>
          
          <TabPanel value="client-po" className="p-0">
            <ClientPOManagement />
          </TabPanel>
          
          <TabPanel value="shifts" className="p-0">
            <ShiftResourceMapping />
          </TabPanel>
          
          <TabPanel value="geofencing" className="p-0">
            <GeofencingCheckpoints />
          </TabPanel>
          
          <TabPanel value="audits" className="p-0">
            <RandomAudit />
          </TabPanel>
          
          <TabPanel value="onboarding" className="p-0">
            <EmployeeOnboarding />
          </TabPanel>
          
          <TabPanel value="lifecycle" className="p-0">
            <EmployeeLifecycle />
          </TabPanel>
          
          <TabPanel value="attendance" className="p-0">
            <FieldOfficerAttendance />
          </TabPanel>
          
          <TabPanel value="finance" className="p-0">
            <FinanceManagement />
          </TabPanel>
          
          <TabPanel value="reports" className="p-0">
            <ReportsModule />
          </TabPanel>
          
          <TabPanel value="additional" className="p-0">
            <AdditionalFunctions />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default FieldOfficerDashboard;