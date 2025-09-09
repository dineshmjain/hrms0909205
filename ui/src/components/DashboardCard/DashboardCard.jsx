import React from "react";
import {
  FaClipboardList,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaUserCheck,
  FaRegClock,
  FaBuilding,
} from "react-icons/fa";
import DashboardCard from "../../components/DashboardCard/MiniCard";

const DashboardUI = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-full mx-auto">
      
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Attendance */}
          <DashboardCard
            title="Attendance"
            icon={<FaClipboardList />}
            color="bg-blue-600"
            data={{
              label: "Present / Total Attendance",
              present: 120,
              total: 150,
            }}
            items={[
              [
                {
                  label: "Absent",
                  value: 30,
                  icon: <FaTimesCircle />,
                  color: "text-red-500",
                },
                {
                  label: "On Time",
                  value: 105,
                  icon: <FaUserCheck />,
                  color: "text-green-600",
                },
              ],
              [
                {
                  label: "Late In",
                  value: 15,
                  icon: <FaRegClock />,
                  color: "text-yellow-500",
                },
                {
                  label: "Early Out",
                  value: 6,
                  icon: <FaRegClock />,
                  color: "text-orange-500",
                },
              ],
            ]}
          />

          {/* Leave */}
          <DashboardCard
            title="Leave"
            icon={<FaCalendarAlt />}
            color="bg-green-500"
            data={{ label: "Total Leave Requests", value: 34 }}
            items={[
              [
                {
                  label: "Approved",
                  value: 20,
                  icon: <FaCheckCircle />,
                  color: "text-green-600",
                },
                {
                  label: "Rejected",
                  value: 8,
                  icon: <FaTimesCircle />,
                  color: "text-red-600",
                },
              ],
              [
                {
                  label: "Pending",
                  value: 6,
                  icon: <FaHourglassHalf />,
                  color: "text-yellow-500",
                },
              ],
            ]}
          />

          {/* Shift */}
          <DashboardCard
            title="Shift"
            icon={<FaClock />}
            color="bg-cyan-500"
            data={{ label: "Total Shifts", value: 8 }}
            items={[
              [
                {
                  label: "Active Shifts",
                  value: 5,
                  icon: <FaCheckCircle />,
                  color: "text-green-500",
                },
                {
                  label: "Inactive Shifts",
                  value: 3,
                  icon: <FaTimesCircle />,
                  color: "text-red-500",
                },
              ],
            ]}
          />

          {/* Branch Attendance */}
          <DashboardCard
            title="Branch Attendance"
            icon={<FaBuilding />}
            color="bg-purple-600"
            data={{
              label: "Branch-wise Attendance Summary",
              value: "4",
            }}
            items={[
              [
                {
                  label: "Absent",
                  value: 30,
                  icon: <FaTimesCircle />,
                  color: "text-red-500",
                },
                {
                  label: "On Time",
                  value: 105,
                  icon: <FaUserCheck />,
                  color: "text-green-600",
                },
              ],
              [
                {
                  label: "Late In",
                  value: 8,
                  icon: <FaRegClock />,
                  color: "text-yellow-500",
                },
                {
                  label: "Early Out",
                  value: 7,
                  icon: <FaRegClock />,
                  color: "text-orange-500",
                },
              ],
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardUI;
