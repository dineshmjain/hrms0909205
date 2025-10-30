import React, { useState, useEffect } from 'react';
import { Clock, Plus, Edit, Trash2, X } from 'lucide-react';

const Shift = ({ formData, handleInputChange, setFormData }) => {
  // Mock data - Replace with actual API data
  const clients = [
    { id: 1, name: "ABC Corporation" },
    { id: 2, name: "XYZ Industries" },
    { id: 3, name: "Tech Solutions Ltd" },
  ];

  const clientBranchesMap = {
    1: [
      { id: 11, name: "ABC - Mumbai Branch" },
      { id: 12, name: "ABC - Delhi Branch" },
      { id: 13, name: "ABC - Bangalore Branch" },
    ],
    2: [
      { id: 21, name: "XYZ - Pune Branch" },
      { id: 22, name: "XYZ - Chennai Branch" },
    ],
    3: [
      { id: 31, name: "Tech - Hyderabad Branch" },
      { id: 32, name: "Tech - Kolkata Branch" },
      { id: 33, name: "Tech - Gurgaon Branch" },
    ],
  };

  // State management
  const [shifts, setShifts] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isReportingRequired, setIsReportingRequired] = useState(false);
  const [reportingMinsBefore, setReportingMinsBefore] = useState('');
  const [editingShiftId, setEditingShiftId] = useState(null);

  // Filter states
  const [filterClient, setFilterClient] = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  // Get available branches based on selected client
  const availableBranches = selectedClientId ? clientBranchesMap[selectedClientId] || [] : [];
  const hasSingleBranch = availableBranches.length === 1;

  // Auto-select single branch when client is selected
  useEffect(() => {
    if (selectedClientId && hasSingleBranch && availableBranches.length > 0) {
      setSelectedBranches([availableBranches[0].id]);
    }
  }, [selectedClientId]);

  // Handle branch selection (multi-select)
  const handleBranchSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    setSelectedBranches(selected);
  };

  // Remove branch from selection
  const removeBranch = (branchId) => {
    setSelectedBranches(prev => prev.filter(id => id !== branchId));
  };

  // Add or Update Shift
  const handleAddShift = () => {
    if (!selectedClientId || selectedBranches.length === 0 || !shiftName || !startTime || !endTime) {
      alert('Please fill all required fields');
      return;
    }

    if (isReportingRequired && !reportingMinsBefore) {
      alert('Please enter reporting time in minutes');
      return;
    }

    const clientName = clients.find(c => c.id === parseInt(selectedClientId))?.name;
    const branchNames = availableBranches
      .filter(b => selectedBranches.includes(b.id))
      .map(b => b.name);

    const shiftData = {
      id: editingShiftId || Date.now(),
      clientId: selectedClientId,
      clientName,
      branchIds: selectedBranches,
      branchNames,
      shiftName,
      startTime,
      endTime,
      isReportingRequired,
      reportingMinsBefore: isReportingRequired ? reportingMinsBefore : null,
    };

    if (editingShiftId) {
      // Update existing shift
      setShifts(prev => prev.map(s => s.id === editingShiftId ? shiftData : s));
      setEditingShiftId(null);
    } else {
      // Add new shift
      setShifts(prev => [...prev, shiftData]);
    }

    // Reset form
    resetForm();
  };

  // Reset form
  const resetForm = () => {
    setSelectedClientId('');
    setSelectedBranches([]);
    setShiftName('');
    setStartTime('');
    setEndTime('');
    setIsReportingRequired(false);
    setReportingMinsBefore('');
    setEditingShiftId(null);
  };

  // Edit shift
  const handleEditShift = (shift) => {
    setSelectedClientId(shift.clientId.toString());
    setSelectedBranches(shift.branchIds);
    setShiftName(shift.shiftName);
    setStartTime(shift.startTime);
    setEndTime(shift.endTime);
    setIsReportingRequired(shift.isReportingRequired);
    setReportingMinsBefore(shift.reportingMinsBefore || '');
    setEditingShiftId(shift.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete shift
  const handleDeleteShift = (shiftId) => {
    if (window.confirm('Are you sure you want to delete this shift?')) {
      setShifts(prev => prev.filter(s => s.id !== shiftId));
    }
  };

  // Filter shifts
  const filteredShifts = shifts.filter(shift => {
    const matchClient = !filterClient || shift.clientId === parseInt(filterClient);
    const matchBranch = !filterBranch || shift.branchIds.includes(parseInt(filterBranch));
    return matchClient && matchBranch;
  });

  // Get branches for filter dropdown
  const filterBranches = filterClient ? clientBranchesMap[filterClient] || [] : [];

  return (
    <div className="space-y-6">
      
      {/* Shift Form */}
      <div className=" rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          {editingShiftId ? 'Edit Shift' : 'Add Shift'}
        </h3>

        {/* Client Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Client *
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => {
                setSelectedClientId(e.target.value);
                setSelectedBranches([]); // Reset branches when client changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Choose a client</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Multi-Select Dropdown - Only show if client has more than 1 branch */}
          {selectedClientId && !hasSingleBranch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Branches * (Multi-select)
              </label>
              <select
                multiple
                value={selectedBranches.map(String)}
                onChange={handleBranchSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white min-h-[120px]"
              >
                {availableBranches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple branches
              </p>
              {selectedBranches.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedBranches.map(branchId => {
                    const branch = availableBranches.find(b => b.id === branchId);
                    return branch ? (
                      <span
                        key={branchId}
                        className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                      >
                        {branch.name}
                        <button
                          onClick={() => removeBranch(branchId)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                          type="button"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          )}

          {/* Show selected single branch info */}
          {selectedClientId && hasSingleBranch && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch (Auto-selected)
              </label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700">
                {availableBranches[0]?.name}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                This client has only one branch
              </p>
            </div>
          )}
        </div>

        {/* Shift Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shift Name *
            </label>
            <input
              type="text"
              value={shiftName}
              onChange={(e) => setShiftName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="e.g., Morning Shift"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time *
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time *
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        {/* Reporting Time */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isReportingRequired}
              onChange={(e) => setIsReportingRequired(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Is Reporting Time Required?
            </span>
          </label>

          {isReportingRequired && (
            <div className="mt-3 ml-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minutes Before Shift Start *
              </label>
              <input
                type="number"
                value={reportingMinsBefore}
                onChange={(e) => setReportingMinsBefore(e.target.value)}
                className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="e.g., 15"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Staff must report {reportingMinsBefore || '___'} minutes before shift starts
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          {editingShiftId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAddShift}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
          >
            <Plus className="w-5 h-5" />
            {editingShiftId ? 'Update Shift' : 'Add Shift'}
          </button>
        </div>
      </div>

      {/* Shift List with Filters */}
      {shifts.length > 0 && (
        <div className="rounded-lg border border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Shifts List ({filteredShifts.length})
            </h3>
            
            {/* Filters */}
            <div className="flex gap-3">
              <div>
                <select
                  value={filterClient}
                  onChange={(e) => {
                    setFilterClient(e.target.value);
                    setFilterBranch(''); // Reset branch filter
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                >
                  <option value="">All Clients</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name}
                    </option>
                  ))}
                </select>
              </div>

              {filterClient && (
                <div>
                  <select
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                  >
                    <option value="">All Branches</option>
                    {filterBranches.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {(filterClient || filterBranch) && (
                <button
                  onClick={() => {
                    setFilterClient('');
                    setFilterBranch('');
                  }}
                  className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm flex items-center gap-1"
                  title="Clear Filters"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Shifts Table */}
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Branches</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Shift Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Timing</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Reporting Time</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {shift.clientName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="max-w-xs">
                        {shift.branchNames.map((name, idx) => (
                          <span
                            key={idx}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {shift.shiftName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {shift.startTime} - {shift.endTime}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {shift.isReportingRequired 
                        ? `${shift.reportingMinsBefore} mins before` 
                        : 'Not Required'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditShift(shift)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="Edit Shift"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteShift(shift.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete Shift"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredShifts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No shifts found matching the selected filters
              </div>
            )}
          </div>
        </div>
      )}

      {shifts.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          No shifts added yet. Start by adding your first shift above.
        </div>
      )}
    </div>
  );
};

export default Shift;