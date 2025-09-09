import React from "react";

const DashboardCard = ({ title, icon, data, items, color, gridLayout }) => {
  const percentage =
    data?.present && data?.total
      ? Math.round((data.present / data.total) * 100)
      : null;

  const isAttendance = title?.toLowerCase().includes("attendance");
  const layoutAsGrid = gridLayout ?? isAttendance;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full transition-transform duration-300 hover:scale-[1.02] border border-blue-100">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`p-3 rounded-xl text-white text-xl flex items-center justify-center shadow-sm ${color}`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>

      {/* Data Summary */}
      {data && (
        <>
          {percentage !== null ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700 font-semibold tracking-wide">
                  {data.label}
                </p>
                <div className="flex items-end space-x-1">
                  <span className="text-2xl font-bold text-blue-600">
                    {data.present}
                  </span>
                  <span className="text-lg text-gray-400 font-semibold">/</span>
                  <span className="text-lg font-semibold text-gray-600">
                    {data.total}
                  </span>
                </div>
              </div>
              <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div
                  className="absolute left-0 top-0 h-full bg-blue-500 rounded-full transition-all duration-700 ease-in-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-700 font-semibold tracking-wide">
                {data.label}
              </p>
              <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                <span className="text-2xl font-bold text-blue-600">
                  {data.value}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* Items */}
      <div className="mt-4 space-y-3 text-sm">
        {layoutAsGrid
          ? items.map((row, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4">
                {row.map((item, subIdx) => (
                  <div
                    key={subIdx}
                    className="flex items-center gap-3 bg-blue-50 rounded-xl border border-blue-100 px-4 py-3 rounded-md hover:bg-gray-100"
                  >
                    <div className={`text-xl ${item.color}`}>{item.icon}</div>
                    <div>
                      <div className="text-lg font-bold text-gray-900">
                        {item.value}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          : items.flat().map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between  bg-blue-50 rounded-xl border border-blue-100  px-3 py-2 rounded-md hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-base ${item.color}`}>{item.icon}</span>
                  <span className="text-sm text-gray-700 font-medium">
                    {item.label}
                  </span>
                </div>
                <div className="text-lg font-bold text-gray-900">
                  {item.value}
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default DashboardCard;
