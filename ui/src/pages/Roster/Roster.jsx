import React, { useState } from 'react';
import { Users, Calendar, AlertCircle, CheckCircle, Clock, Phone, MapPin, User } from 'lucide-react';

const Roster = () => {
  const [selectedDate, setSelectedDate] = useState('2024-10-31');

  // Sample client data
  const client = {
    id: 1,
    name: "TechCorp Industries",
    branch: "Downtown Branch",
    contactPerson: "John Smith",
    contactPhone: "+1 234-567-8900",
    requirements: [
      {
        shift: "Morning Shift",
        time: "6:00 AM - 2:00 PM",
        roles: [
          { role: "Supervisor", required: 1 },
          { role: "Security Guard", required: 2 },
          { role: "Cleaning Staff", required: 2 }
        ]
      },
      {
        shift: "Night Shift",
        time: "10:00 PM - 6:00 AM",
        roles: [
          { role: "Supervisor", required: 1 },
          { role: "Security Guard", required: 2 },
          { role: "Cleaning Staff", required: 2 }
        ]
      }
    ],
    dailyData: {
      '2024-10-31': [
        {
          shift: "Morning Shift",
          roles: [
            { role: "Supervisor", required: 1, assigned: 1, employees: ["Sarah Johnson"] },
            { role: "Security Guard", required: 2, assigned: 2, employees: ["Mike Davis", "Tom Wilson"] },
            { role: "Cleaning Staff", required: 2, assigned: 1, employees: ["Anna Brown"], onLeave: ["Lisa Garcia"], replacement: null }
          ]
        },
        {
          shift: "Night Shift",
          roles: [
            { role: "Supervisor", required: 1, assigned: 1, employees: ["Robert Taylor"], extended: true },
            { role: "Security Guard", required: 2, assigned: 2, employees: ["James Miller", "David Lee"] },
            { role: "Cleaning Staff", required: 2, assigned: 2, employees: ["Emma White", "Olivia Martin"] }
          ]
        }
      ],
      '2024-11-01': [
        {
          shift: "Morning Shift",
          roles: [
            { role: "Supervisor", required: 1, assigned: 1, employees: ["Sarah Johnson"] },
            { role: "Security Guard", required: 2, assigned: 1, employees: ["Mike Davis"], shortage: 1 },
            { role: "Cleaning Staff", required: 2, assigned: 2, employees: ["Anna Brown", "Jessica Lee"] }
          ]
        },
        {
          shift: "Night Shift",
          roles: [
            { role: "Supervisor", required: 1, assigned: 1, employees: ["Robert Taylor"] },
            { role: "Security Guard", required: 2, assigned: 2, employees: ["James Miller", "David Lee"] },
            { role: "Cleaning Staff", required: 2, assigned: 2, employees: ["Emma White", "Olivia Martin"] }
          ]
        }
      ],
      '2024-11-02': [
        {
          shift: "Morning Shift",
          roles: [
            { role: "Supervisor", required: 1, assigned: 1, employees: ["Sarah Johnson"] },
            { role: "Security Guard", required: 2, assigned: 2, employees: ["Mike Davis", "Tom Wilson"] },
            { role: "Cleaning Staff", required: 2, assigned: 2, employees: ["Anna Brown", "Lisa Garcia"] }
          ]
        },
        {
          shift: "Night Shift",
          roles: [
            { role: "Supervisor", required: 1, assigned: 0, onLeave: ["Robert Taylor"], replacement: "Temp - Mark Stevens" },
            { role: "Security Guard", required: 2, assigned: 2, employees: ["James Miller", "David Lee"] },
            { role: "Cleaning Staff", required: 2, assigned: 2, employees: ["Emma White", "Olivia Martin"] }
          ]
        }
      ]
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add empty cells for days before the first day of month
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateForData = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDateStatus = (date) => {
    if (!date) return null;
    const dateStr = formatDateForData(date);
    const dayData = client.dailyData[dateStr];
    
    if (!dayData) return 'no-data';
    
    const hasShortage = dayData.some(shift => 
      shift.roles.some(role => role.assigned < role.required)
    );
    
    return hasShortage ? 'shortage' : 'fulfilled';
  };

  const currentDate = new Date(selectedDate);
  const monthDays = getDaysInMonth(currentDate);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dailyData = client.dailyData[selectedDate] || [];

  const RequirementRow = ({ requirement }) => {
    const isFulfilled = requirement.assigned >= requirement.required;
    const hasLeave = requirement.onLeave && requirement.onLeave.length > 0;
    
    return (
      <div className="bg-white rounded border border-gray-200 p-3 mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <span className="font-semibold text-gray-800 text-sm mr-2">{requirement.role}</span>
            {isFulfilled ? (
              <CheckCircle size={16} className="text-green-600" />
            ) : (
              <AlertCircle size={16} className="text-red-600" />
            )}
          </div>
          <div className="text-sm">
            <span className={`font-bold ${isFulfilled ? 'text-green-600' : 'text-red-600'}`}>
              {requirement.assigned}
            </span>
            <span className="text-gray-500">/{requirement.required}</span>
          </div>
        </div>
        
        {requirement.employees && requirement.employees.length > 0 && (
          <div className="mb-2">
            <div className="flex flex-wrap gap-1">
              {requirement.employees.map((emp, idx) => (
                <span key={idx} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">
                  {emp}
                  {requirement.extended && idx === 0 && (
                    <span className="ml-1 text-orange-600" title="Extended Shift">
                      <Clock size={10} className="inline" />
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {hasLeave && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
            <div className="text-xs text-yellow-800 mb-1 font-semibold">On Leave:</div>
            <div className="flex flex-wrap gap-1 mb-1">
              {requirement.onLeave.map((emp, idx) => (
                <span key={idx} className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs">
                  {emp}
                </span>
              ))}
            </div>
            {requirement.replacement ? (
              <div className="text-xs text-green-700">
                ✓ Replacement: {requirement.replacement}
              </div>
            ) : (
              <div className="text-xs text-red-700">
                ⚠ No replacement assigned
              </div>
            )}
          </div>
        )}
        
        {requirement.shortage && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
            ⚠ Shortage: {requirement.shortage} employee{requirement.shortage > 1 ? 's' : ''} needed
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Client Staffing Management</h1>
          <p className="text-gray-600">Real-time workforce status and requirement tracking</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Side - Client Info & Requirements */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6 pb-4 border-b-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{client.name}</h2>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <MapPin size={16} className="mr-2 text-blue-600" />
                  <span className="font-medium mr-2">Branch:</span>
                  <span>{client.branch}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <User size={16} className="mr-2 text-blue-600" />
                  <span className="font-medium mr-2">Contact Person:</span>
                  <span>{client.contactPerson}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone size={16} className="mr-2 text-blue-600" />
                  <span className="font-medium mr-2">Phone:</span>
                  <span>{client.contactPhone}</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mb-4">Staffing Requirements</h3>
            
            {client.requirements.map((req, idx) => (
              <div key={idx} className="mb-4 bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h4 className="font-bold text-gray-800">{req.shift}</h4>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <Clock size={14} className="mr-1" />
                      {req.time}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {req.roles.map((role, roleIdx) => (
                    <div key={roleIdx} className="flex justify-between items-center bg-white p-2 rounded border border-gray-200">
                      <span className="text-sm font-medium text-gray-700">{role.role}</span>
                      <span className="text-sm font-bold text-blue-600">{role.required} Required</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Right Side - Calendar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Select Date</h3>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-xl font-bold text-gray-700">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs font-bold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((date, idx) => {
                if (!date) {
                  return <div key={idx} className="aspect-square"></div>;
                }
                
                const dateStr = formatDateForData(date);
                const status = getDateStatus(date);
                const isSelected = dateStr === selectedDate;
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(dateStr)}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm font-medium transition-all
                      ${isSelected ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
                      ${status === 'fulfilled' && !isSelected ? 'bg-green-100 text-green-700 hover:bg-green-200' : ''}
                      ${status === 'shortage' && !isSelected ? 'bg-red-100 text-red-700 hover:bg-red-200' : ''}
                      ${status === 'no-data' && !isSelected ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' : ''}
                      ${isSelected ? 'text-blue-700' : ''}
                    `}
                  >
                    <span>{date.getDate()}</span>
                    {status === 'fulfilled' && <CheckCircle size={12} className="mt-1" />}
                    {status === 'shortage' && <AlertCircle size={12} className="mt-1" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-around text-xs">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 rounded mr-1"></div>
                <span className="text-gray-600">Fully Staffed</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-100 rounded mr-1"></div>
                <span className="text-gray-600">Shortage</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 rounded mr-1"></div>
                <span className="text-gray-600">No Data</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom - Date-wise Data */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b-2 border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              Staffing Status - {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </h3>
          </div>

          {dailyData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {dailyData.map((shift, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-300">
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{shift.shift}</h4>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <Clock size={14} className="mr-1" />
                        {client.requirements.find(r => r.shift === shift.shift)?.time}
                      </p>
                    </div>
                  </div>
                  
                  {shift.roles.map((role, roleIdx) => (
                    <RequirementRow key={roleIdx} requirement={role} />
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar size={48} className="mx-auto mb-3 text-gray-400" />
              <p className="text-lg">No staffing data available for this date</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roster;