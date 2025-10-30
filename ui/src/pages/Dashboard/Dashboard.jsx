import React, { useState, useEffect, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Typography } from '@material-tailwind/react';

// 🌀 Lazy-loaded dashboards for performance
const AdminDashboard = React.lazy(() => import('./RoleDashboards/AdminDashboard'));
const SecurityGuardDashboard = React.lazy(() => import('./RoleDashboards/SecurityGuardDashboard'));
const ManagerDashboard = React.lazy(() => import('./RoleDashboards/ManagerDashboard'));
const SupervisorDashboard = React.lazy(() => import('./RoleDashboards/SupervisorDashboard'));
const HRDashboard = React.lazy(() => import('./RoleDashboards/HRDashboard'));
const ClientDashboard = React.lazy(() => import('./RoleDashboards/ClientDashboard'));
const NurseDashboard = React.lazy(() => import('./RoleDashboards/NurseDashboard'));
const ReceptionistDashboard = React.lazy(() => import('./RoleDashboards/ReceptionistDashboard'));
const MaintenanceDashboard = React.lazy(() => import('./RoleDashboards/MaintenanceDashboard'));
const FieldOfficerDashboard = React.lazy(() => import('./RoleDashboards/FieldOfficerDashboard'));

// 🧭 Role → Component mapping
const roleComponents = {
  admin: AdminDashboard,
  'super admin': AdminDashboard,

  manager: ManagerDashboard,
  'branch manager': ManagerDashboard,
  'area manager': ManagerDashboard,

  supervisor: SupervisorDashboard,
  'team leader': SupervisorDashboard,

  'security guard': SecurityGuardDashboard,
  guard: SecurityGuardDashboard,
  'security officer': SecurityGuardDashboard,

  'field officer': FieldOfficerDashboard,
  'field supervisor': FieldOfficerDashboard,
  'operations officer': FieldOfficerDashboard,

  hr: HRDashboard,
  'hr manager': HRDashboard,
  'human resource': HRDashboard,

  client: ClientDashboard,
  'client admin': ClientDashboard,

  nurse: NurseDashboard,
  'staff nurse': NurseDashboard,
  'head nurse': NurseDashboard,

  receptionist: ReceptionistDashboard,
  'front desk': ReceptionistDashboard,

  maintenance: MaintenanceDashboard,
  technician: MaintenanceDashboard,
  housekeeping: MaintenanceDashboard,
};

// 🧩 Dev-only role switcher
const RoleSwitcher = ({ currentRole, onChange }) => {
  const roles = Object.keys(roleComponents);
  return (
    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
        🧪 Test Mode - Switch Role:
      </Typography>
      <div className="flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role}
            onClick={() => onChange(role)}
            className={`px-3 py-1 text-xs rounded-full border transition ${
              currentRole === role
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
            }`}
          >
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [userRole, setUserRole] = useState('admin');
  const [loading, setLoading] = useState(true);
  const { user } = useSelector((state) => state.user || {});

  const isDevMode = true; // set to false in production

  useEffect(() => {
    let isMounted = true;

    const determineRole = () => {
      const testRole = localStorage.getItem('testRole');
      let detectedRole = 'admin';

      if (testRole) {
        detectedRole = testRole;
      } else if (user?.roleName) {
        detectedRole = user.roleName.toLowerCase();
      } else if (user?.roleDetails?.length) {
        detectedRole = user.roleDetails[0]?.name?.toLowerCase();
      } else if (user?.modules?.length) {
        const moduleNames = user.modules.map((m) => m.name.toLowerCase());
        if (moduleNames.includes('hr')) detectedRole = 'hr';
        else if (moduleNames.includes('security')) detectedRole = 'security guard';
        else if (moduleNames.includes('client')) detectedRole = 'client';
        else if (moduleNames.includes('manager')) detectedRole = 'manager';
      }

      if (isMounted) {
        setUserRole(detectedRole);
        setTimeout(() => setLoading(false), 800);
      }
    };

    setLoading(true);
    determineRole();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleRoleChange = (newRole) => {
    setLoading(true);
    localStorage.setItem('testRole', newRole);
    setUserRole(newRole);
    setTimeout(() => setLoading(false), 600);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] p-8">
        <div className="relative">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-500 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-gray-700 text-xl font-semibold mb-2">Loading Dashboard...</p>
          <p className="text-gray-500 text-sm">Setting up your personalized workspace</p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const SelectedDashboard = roleComponents[userRole] || AdminDashboard;

  return (
    <div className="p-6">
      <header className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Dashboard
        </Typography>
        <Typography color="gray">Welcome back! Here's what's happening in your organization.</Typography>

        {isDevMode && (
          <RoleSwitcher currentRole={userRole} onChange={handleRoleChange} />
        )}
      </header>

      <Suspense
        fallback={
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        }
      >
        <SelectedDashboard />
      </Suspense>
    </div>
  );
};

export default Dashboard;
