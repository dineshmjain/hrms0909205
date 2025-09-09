import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import {
  FaUsers,
  FaPhone,
  FaCalendarCheck,
  FaConciergeBell,
  FaKey,
  FaEnvelope,
  FaBell,
  FaClipboardList,
} from "react-icons/fa";
import MetricCard from "../../../components/Dashboard/MetricCard";
import QuickActions from "../../../components/Dashboard/QuickActions";
import RecentActivity from "../../../components/Dashboard/RecentActivity";
import TaskSummary from "../../../components/Dashboard/TaskSummary";
import { useNavigate } from "react-router-dom";

const ReceptionistDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState({
    todayCheckIns: 15,
    todayCheckOuts: 12,
    pendingRequests: 7,
    occupancyRate: 85,
    tasks: { pending: 6, inProgress: 3, completed: 18, overdue: 1 },
  });

  const quickActions = [
    {
      label: "Check In Guest",
      icon: FaKey,
      color: "blue",
      onClick: () => navigate("/reception/checkin"),
    },
    {
      label: "Guest Services",
      icon: FaConciergeBell,
      color: "green",
      onClick: () => navigate("/reception/services"),
    },
    {
      label: "Reservations",
      icon: FaCalendarCheck,
      color: "purple",
      onClick: () => navigate("/reception/reservations"),
    },
    {
      label: "Messages",
      icon: FaEnvelope,
      color: "orange",
      onClick: () => navigate("/reception/messages"),
    },
  ];

  const recentActivities = [
    {
      user: "Guest Services",
      action: "Room service request processed",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      status: "success",
      avatar: null,
    },
    {
      user: "Front Desk",
      action: "Guest checked in to Room 312",
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      status: "success",
      avatar: null,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h4" color="blue-gray" className="font-bold">
            Reception Dashboard
          </Typography>
          <Typography variant="small" color="gray">
            Guest services and front desk operations
          </Typography>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Today's Check-ins"
          value={dashboardData.todayCheckIns}
          icon={FaKey}
          color="blue"
        />
        <MetricCard
          title="Today's Check-outs"
          value={dashboardData.todayCheckOuts}
          icon={FaUsers}
          color="green"
        />
        <MetricCard
          title="Pending Requests"
          value={dashboardData.pendingRequests}
          icon={FaBell}
          color="orange"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${dashboardData.occupancyRate}%`}
          icon={FaConciergeBell}
          color="purple"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <RecentActivity
            title="Front Desk Activities"
            activities={recentActivities}
            maxItems={6}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions title="Reception Actions" actions={quickActions} />

          <TaskSummary
            title="Service Tasks"
            tasks={dashboardData.tasks}
            onTaskClick={(taskType) =>
              navigate(`/reception/tasks?status=${taskType}`)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
