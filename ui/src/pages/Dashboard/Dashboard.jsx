import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Typography } from '@material-tailwind/react';

// Import role-specific dashboards
import AdminDashboard from './RoleDashboards/AdminDashboard';
import SecurityGuardDashboard from './RoleDashboards/SecurityGuardDashboard';
import ManagerDashboard from './RoleDashboards/ManagerDashboard';
import SupervisorDashboard from './RoleDashboards/SupervisorDashboard';
import HRDashboard from './RoleDashboards/HRDashboard';
import ClientDashboard from './RoleDashboards/ClientDashboard';
import NurseDashboard from './RoleDashboards/NurseDashboard';
import ReceptionistDashboard from './RoleDashboards/ReceptionistDashboard';
import MaintenanceDashboard from './RoleDashboards/MaintenanceDashboard';
import FieldOfficerDashboard from './RoleDashboards/FieldOfficerDashboard';

const Dashboard = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});

  // Get user data from Redux store
  const { user } = useSelector((state) => state.user || {});

  useEffect(() => {
    let isMounted = true;
    
    const loadDashboard = () => {
      if (!isMounted) return;
      
      // Debug information
      // const modules = JSON.parse(localStorage.getItem('modules') || '[]');
      const modules = user?.modules
      // const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const userData = user
      const token = localStorage.getItem('token');
      const testRole = localStorage.getItem('testRole');

      setDebugInfo({
        hasModules: modules.length > 0,
        hasUserData: Object.keys(userData).length > 0,
        hasToken: !!token,
        hasTestRole: !!testRole,
        moduleCount: modules.length,
        userDataKeys: Object.keys(userData)
      });

      // Check for test role first (for development/testing)
      if (testRole) {
        console.log('Using test role:', testRole);
        if (isMounted) {
          setUserRole(testRole);
          setTimeout(() => {
            if (isMounted) setLoading(false);
          }, 1000);
        }
        return;
      }

      // Determine role based on modules or user role
      let role = 'admin'; // Default role for demo

      if (userData.roleDetails && userData.roleDetails.length > 0) {
        const primaryRole = userData.roleDetails[0].name.toLowerCase();
        role = primaryRole;
      } else if (modules.length > 0) {
        // Determine role based on available modules
        const moduleNames = modules.map(m => m.name.toLowerCase());

        if (moduleNames.includes('user management') && moduleNames.includes('organization')) {
          role = 'admin';
        } else if (moduleNames.includes('security')) {
          role = 'security guard';
        } else if (moduleNames.includes('hr')) {
          role = 'hr';
        } else if (moduleNames.includes('client')) {
          role = 'client';
        } else if (moduleNames.includes('manager')) {
          role = 'manager';
        } else if (moduleNames.includes('supervisor')) {
          role = 'supervisor';
        }
      }
           role=user?.roleName?.toLowerCase() || 'admin'
      // else{
          console.log('Detected user role:', role,user?.roleName);
   
      // }

    
      
      if (isMounted) {
        setUserRole(role);
        setTimeout(() => {
          if (isMounted) setLoading(false);
        }, 1000);
      }
    };

    // Set initial loading state
    setLoading(true);
    
    // Load dashboard data
    loadDashboard();
    
    return () => {
      isMounted = false;
    };
  }, [user]);

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
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Role selector for testing (only show in development)
  const isDevMode = window.location.hostname === 'localhost' || window.location.hostname.includes('replit');

  const handleRoleChange = (newRole) => {
    setLoading(true);
    localStorage.setItem('testRole', newRole);
    setUserRole(newRole);
    
    // Ensure loading state is visible for role switching
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Typography variant="h4" color="blue-gray" className="mb-2">
          Dashboard
        </Typography>
        <Typography color="gray" className="font-normal">
          Welcome back! Here's what's happening in your organization.
        </Typography>

        {/* Debug Information */}
        {/* {isDevMode && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
              🔧 Debug Info:
            </Typography>
            <div className="text-xs text-gray-600">
              <p>Current Role: <strong>{userRole}</strong></p>
              <p>Has Token: {debugInfo.hasToken ? '✅' : '❌'}</p>
              <p>Has Modules: {debugInfo.hasModules ? '✅' : '❌'} ({debugInfo.moduleCount})</p>
              <p>Has User Data: {debugInfo.hasUserData ? '✅' : '❌'}</p>
              <p>Has Test Role: {debugInfo.hasTestRole ? '✅' : '❌'}</p>
            </div>
          </div>
        )} */}

        {/* Role Selector for Testing */}
        {isDevMode && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold">
              🧪 Test Mode - Switch Role:
            </Typography>
            <div className="flex flex-wrap gap-2">
              {['admin', 'hr', 'manager', 'supervisor', 'security guard', 'field officer', 'client', 'nurse', 'receptionist', 'maintenance'].map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`px-3 py-1 text-xs rounded-full border ${
                    userRole === role 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-blue-600 border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {(() => {
        switch (userRole) {
          case 'admin':
          case 'super admin':
            return <AdminDashboard />;
          case 'manager':
          case 'branch manager':
          case 'area manager':
            return <ManagerDashboard />;
          case 'supervisor':
          case 'team leader':
            return <SupervisorDashboard />;
          case 'security guard':
          case 'guard':
          case 'security officer':
            return <SecurityGuardDashboard />;
          case 'field officer':
          case 'field supervisor':
          case 'operations officer':
            return <FieldOfficerDashboard />;
          case 'hr':
          case 'hr manager':
          case 'human resource':
            return <HRDashboard />;
          case 'client':
          case 'client admin':
            return <ClientDashboard />;
          case 'nurse':
          case 'staff nurse':
          case 'head nurse':
            return <NurseDashboard />;
          case 'receptionist':
          case 'front desk':
            return <ReceptionistDashboard />;
          case 'maintenance':
          case 'technician':
          case 'housekeeping':
            return <MaintenanceDashboard />;
          default:
            return <AdminDashboard />; // Fallback to admin dashboard
        }
      })()}
    </div>
  );
};

export default Dashboard;