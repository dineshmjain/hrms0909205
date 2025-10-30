import React, { useState } from 'react';
import { Target, Users, CheckCircle, X, Trash2, Edit2, UserCheck } from 'lucide-react';

const ReuirementsCheckPoints = () => {
  // Mock data
  const clients = [
    { id: 1, name: "ABC Corporation" },
    { id: 2, name: "XYZ Industries" },
    { id: 3, name: "Tech Solutions Ltd" },
  ];

  const clientBranchesMap = {
    1: [
      { id: 11, name: "ABC - Mumbai Branch" },
      { id: 12, name: "ABC - Delhi Branch" },
    ],
    2: [
      { id: 21, name: "XYZ - Pune Branch" },
    ],
    3: [
      { id: 31, name: "Tech - Hyderabad Branch" },
      { id: 32, name: "Tech - Kolkata Branch" },
    ],
  };

  const shifts = [
    { id: 1, name: "Morning Shift (6 AM - 2 PM)" },
    { id: 2, name: "Day Shift (9 AM - 5 PM)" },
    { id: 3, name: "Evening Shift (2 PM - 10 PM)" },
    { id: 4, name: "Night Shift (10 PM - 6 AM)" },
  ];

  const designations = [
    { id: 1, name: "Security Guard" },
    { id: 2, name: "Supervisor" },
    { id: 3, name: "Field Officer" },
    { id: 4, name: "Manager" },
  ];

  // Mock employees database
  const allEmployees = [
    { id: 1, name: "John Doe", designation: "Security Guard", gender: "Male", empCode: "EMP001" },
    { id: 2, name: "Jane Smith", designation: "Security Guard", gender: "Female", empCode: "EMP002" },
    { id: 3, name: "Mike Johnson", designation: "Security Guard", gender: "Male", empCode: "EMP003" },
    { id: 4, name: "Sarah Williams", designation: "Supervisor", gender: "Female", empCode: "EMP004" },
    { id: 5, name: "Robert Brown", designation: "Supervisor", gender: "Male", empCode: "EMP005" },
    { id: 6, name: "Emily Davis", designation: "Field Officer", gender: "Female", empCode: "EMP006" },
    { id: 7, name: "David Wilson", designation: "Field Officer", gender: "Male", empCode: "EMP007" },
    { id: 8, name: "Lisa Anderson", designation: "Manager", gender: "Female", empCode: "EMP008" },
    { id: 9, name: "James Martinez", designation: "Security Guard", gender: "Male", empCode: "EMP009" },
    { id: 10, name: "Maria Garcia", designation: "Security Guard", gender: "Female", empCode: "EMP010" },
  ];

  // State management
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [checkpointCount, setCheckpointCount] = useState('');
  
  const [selectedShift, setSelectedShift] = useState('');
  const [selectedDesignation, setSelectedDesignation] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  
  const [requirementRows, setRequirementRows] = useState([]);
  const [editingRowId, setEditingRowId] = useState(null);
  
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [currentAssigningRowId, setCurrentAssigningRowId] = useState(null);
  
  const [requirementsList, setRequirementsList] = useState([]);

  // Get available branches
  const availableBranches = selectedClient ? clientBranchesMap[selectedClient] || [] : [];

  // Add or update requirement row
  const handleAddOrUpdateRow = () => {
    if (!selectedClient || !selectedBranch || !checkpointCount) {
      alert('Please select client, branch and enter checkpoint count first');
      return;
    }
    
    if (!selectedShift || !selectedDesignation || !selectedGender || !employeeCount) {
      alert('Please fill all fields: shift, designation, gender and employee count');
      return;
    }

    const shiftName = shifts.find(s => s.id === parseInt(selectedShift))?.name;
    const designationName = designations.find(d => d.id === parseInt(selectedDesignation))?.name;

    if (editingRowId) {
      // Update existing row and open assignment modal
      setRequirementRows(requirementRows.map(row => 
        row.id === editingRowId 
          ? { ...row, shift: shiftName, shiftId: selectedShift, designation: designationName, 
              designationId: selectedDesignation, gender: selectedGender, employeeCount, 
              assignedEmployees: [], isAssigned: false }
          : row
      ));
      
      // Open assignment modal for the updated row
      const filtered = allEmployees.filter(emp => 
        emp.designation === designationName &&
        emp.gender === selectedGender
      );
      setFilteredEmployees(filtered);
      setSelectedEmployees([]);
      setCurrentAssigningRowId(editingRowId);
      setShowEmployeeModal(true);
      setEditingRowId(null);
    } else {
      // Create temporary row and open assignment modal
      const tempRowId = Date.now();
      const newRow = {
        id: tempRowId,
        shift: shiftName,
        shiftId: selectedShift,
        designation: designationName,
        designationId: selectedDesignation,
        gender: selectedGender,
        employeeCount,
        assignedEmployees: [],
        isAssigned: false,
      };
      
      // Add row temporarily
      setRequirementRows([...requirementRows, newRow]);
      
      // Open assignment modal
      const filtered = allEmployees.filter(emp => 
        emp.designation === designationName &&
        emp.gender === selectedGender
      );
      setFilteredEmployees(filtered);
      setSelectedEmployees([]);
      setCurrentAssigningRowId(tempRowId);
      setShowEmployeeModal(true);
    }

    // Reset form
    setSelectedShift('');
    setSelectedDesignation('');
    setSelectedGender('');
    setEmployeeCount('');
  };

  // Edit requirement row
  const handleEditRow = (row) => {
    setSelectedShift(row.shiftId);
    setSelectedDesignation(row.designationId);
    setSelectedGender(row.gender);
    setEmployeeCount(row.employeeCount);
    setEditingRowId(row.id);
  };

  // Remove requirement row
  const handleRemoveRow = (id) => {
    if (window.confirm('Are you sure you want to remove this requirement row?')) {
      setRequirementRows(requirementRows.filter(row => row.id !== id));
      if (editingRowId === id) {
        setEditingRowId(null);
        setSelectedShift('');
        setSelectedDesignation('');
        setSelectedGender('');
        setEmployeeCount('');
      }
    }
  };

  // Handle Assign button click for a row
  const handleAssignRow = (row) => {
    // Filter employees by designation and gender
    const filtered = allEmployees.filter(emp => 
      emp.designation === row.designation &&
      emp.gender === row.gender
    );

    setFilteredEmployees(filtered);
    setSelectedEmployees(row.assignedEmployees || []);
    setCurrentAssigningRowId(row.id);
    setShowEmployeeModal(true);
  };

  // Handle employee selection
  const handleEmployeeSelect = (employee) => {
    const isSelected = selectedEmployees.find(emp => emp.id === employee.id);
    const currentRow = requirementRows.find(row => row.id === currentAssigningRowId);
    
    if (isSelected) {
      setSelectedEmployees(selectedEmployees.filter(emp => emp.id !== employee.id));
    } else {
      if (selectedEmployees.length < parseInt(currentRow.employeeCount)) {
        setSelectedEmployees([...selectedEmployees, employee]);
      } else {
        alert(`You can only select ${currentRow.employeeCount} employee(s)`);
      }
    }
  };

  // Submit requirement for a row
  const handleSubmitAssignment = () => {
    const currentRow = requirementRows.find(row => row.id === currentAssigningRowId);
    
    if (selectedEmployees.length !== parseInt(currentRow.employeeCount)) {
      alert(`Please select exactly ${currentRow.employeeCount} employee(s)`);
      return;
    }

    // Update the row with assigned employees
    setRequirementRows(requirementRows.map(row => 
      row.id === currentAssigningRowId 
        ? { ...row, assignedEmployees: selectedEmployees, isAssigned: true }
        : row
    ));

    setShowEmployeeModal(false);
    setCurrentAssigningRowId(null);
    setSelectedEmployees([]);
  };

  // Cancel assignment
  const handleCancelAssignment = () => {
    const currentRow = requirementRows.find(row => row.id === currentAssigningRowId);
    
    // If the row hasn't been assigned yet (new row), remove it
    if (currentRow && !currentRow.isAssigned) {
      setRequirementRows(requirementRows.filter(row => row.id !== currentAssigningRowId));
    }
    
    setShowEmployeeModal(false);
    setCurrentAssigningRowId(null);
    setSelectedEmployees([]);
  };

  // Proceed to new client
  const handleProceedToNewClient = () => {
    const unassignedRows = requirementRows.filter(row => !row.isAssigned);
    
    if (unassignedRows.length > 0) {
      alert('Please assign employees to all requirement rows before proceeding');
      return;
    }

    if (requirementRows.length === 0) {
      alert('Please add at least one requirement row');
      return;
    }

    const clientName = clients.find(c => c.id === parseInt(selectedClient))?.name;
    const branchName = availableBranches.find(b => b.id === parseInt(selectedBranch))?.name;

    // Move current requirements to submitted list
    const newRequirements = requirementRows.map(row => ({
      id: Date.now() + Math.random(),
      clientId: selectedClient,
      clientName,
      branchId: selectedBranch,
      branchName,
      checkpointCount,
      shift: row.shift,
      designation: row.designation,
      gender: row.gender,
      employeeCount: row.employeeCount,
      assignedEmployees: row.assignedEmployees,
    }));

    setRequirementsList([...requirementsList, ...newRequirements]);

    // Reset everything for new client
    setSelectedClient('');
    setSelectedBranch('');
    setCheckpointCount('');
    setRequirementRows([]);
    setSelectedShift('');
    setSelectedDesignation('');
    setSelectedGender('');
    setEmployeeCount('');
  };

  // Delete requirement
  const handleDeleteRequirement = (id) => {
    if (window.confirm('Are you sure you want to delete this requirement?')) {
      setRequirementsList(requirementsList.filter(req => req.id !== id));
    }
  };

  return (
     <div className="space-y-6">
      
      <div className="w-full mx-auto space-y-6">
        
        {/* Main Requirements Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Add Requirements
          </h3>

          {/* Client, Branch & Checkpoint */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 pb-6 border-b">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client *
              </label>
              <select
                value={selectedClient}
                onChange={(e) => {
                  setSelectedClient(e.target.value);
                  setSelectedBranch('');
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Choose client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch *
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                disabled={!selectedClient}
              >
                <option value="">Choose branch</option>
                {availableBranches.map(branch => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Checkpoints *
              </label>
              <input
                type="number"
                value={checkpointCount}
                onChange={(e) => setCheckpointCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter count"
                min="1"
              />
            </div>
          </div>

          {/* Requirement Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shift *
              </label>
              <select
                value={selectedShift}
                onChange={(e) => setSelectedShift(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">Select shift</option>
                {shifts.map(shift => (
                  <option key={shift.id} value={shift.id}>
                    {shift.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation *
              </label>
              <select
                value={selectedDesignation}
                onChange={(e) => setSelectedDesignation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">Select designation</option>
                {designations.map(designation => (
                  <option key={designation.id} value={designation.id}>
                    {designation.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">Select</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Count *
              </label>
              <input
                type="number"
                value={employeeCount}
                onChange={(e) => setEmployeeCount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
                placeholder="Count"
                min="1"
              />
            </div>

            <div className="md:col-span-2">
              <button
                onClick={handleAddOrUpdateRow}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
              >
                {editingRowId ? 'Update & Assign' : 'Add & Assign'}
              </button>
            </div>
          </div>
        </div>

        {/* Current Requirements */}
        {requirementRows.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Current Requirements
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {clients.find(c => c.id === parseInt(selectedClient))?.name} - {availableBranches.find(b => b.id === parseInt(selectedBranch))?.name} - {checkpointCount} Checkpoints
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {requirementRows.map((row) => (
                <div
                  key={row.id}
                  className={`p-4 border-2 rounded-lg ${
                    row.isAssigned 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-orange-300 bg-orange-50'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <span className="text-xs text-gray-500">Shift</span>
                        <p className="font-medium text-gray-800">{row.shift}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Designation</span>
                        <p className="font-medium text-gray-800">{row.designation}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Gender</span>
                        <p className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          row.gender === 'Male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {row.gender}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">Count</span>
                        <p className="font-medium text-gray-800">{row.employeeCount}</p>
                      </div>
                      {row.isAssigned && (
                        <div>
                          <span className="text-xs text-gray-500">Assigned</span>
                          <div className="flex gap-1 mt-1">
                            {row.assignedEmployees.map(emp => (
                              <span
                                key={emp.id}
                                className="inline-block px-2 py-1 bg-green-600 text-white rounded text-xs"
                                title={emp.name}
                              >
                                {emp.empCode}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {!row.isAssigned && (
                        <button
                          onClick={() => handleAssignRow(row)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all font-medium text-sm"
                        >
                          Assign Now
                        </button>
                      )}
                      {row.isAssigned && (
                        <button
                          onClick={() => handleAssignRow(row)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm"
                        >
                          Reassign
                        </button>
                      )}
                      <button
                        onClick={() => handleEditRow(row)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                        title="Edit Row"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                        title="Remove Row"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <button
                onClick={handleProceedToNewClient}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-lg flex items-center gap-2"
              >
                Proceed with New Client
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        )}

        {/* Employee Selection Modal */}
        {showEmployeeModal && currentAssigningRowId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Select Employees ({selectedEmployees.length}/{requirementRows.find(r => r.id === currentAssigningRowId)?.employeeCount})
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {requirementRows.find(r => r.id === currentAssigningRowId)?.shift} - {requirementRows.find(r => r.id === currentAssigningRowId)?.designation} - {requirementRows.find(r => r.id === currentAssigningRowId)?.gender}
                  </p>
                </div>
                <button
                  onClick={handleCancelAssignment}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {filteredEmployees.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No employees found matching the selected criteria
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredEmployees.map(employee => {
                      const isSelected = selectedEmployees.find(emp => emp.id === employee.id);
                      return (
                        <div
                          key={employee.id}
                          onClick={() => handleEmployeeSelect(employee)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-purple-600 bg-purple-50' 
                              : 'border-gray-200 hover:border-purple-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                isSelected ? 'bg-purple-600' : 'bg-gray-200'
                              }`}>
                                {isSelected ? (
                                  <CheckCircle className="w-6 h-6 text-white" />
                                ) : (
                                  <UserCheck className="w-6 h-6 text-gray-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{employee.name}</p>
                                <p className="text-sm text-gray-600">{employee.empCode} - {employee.designation}</p>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              employee.gender === 'Male' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-pink-100 text-pink-800'
                            }`}>
                              {employee.gender}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelAssignment}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAssignment}
                    disabled={selectedEmployees.length !== parseInt(requirementRows.find(r => r.id === currentAssigningRowId)?.employeeCount || 0)}
                    className={`px-6 py-2 rounded-lg transition-all font-medium ${
                      selectedEmployees.length === parseInt(requirementRows.find(r => r.id === currentAssigningRowId)?.employeeCount || 0)
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Confirm Assignment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Requirements History */}
        {requirementsList.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              All Requirements History ({requirementsList.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Client</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Branch</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Checkpoints</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Shift</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Gender</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Count</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Assigned Employees</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {requirementsList.map((requirement) => (
                    <tr key={requirement.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {requirement.clientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {requirement.branchName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {requirement.checkpointCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {requirement.shift}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {requirement.designation}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          requirement.gender === 'Male' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {requirement.gender}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {requirement.employeeCount}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {requirement.assignedEmployees.map(emp => (
                            <span
                              key={emp.id}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs"
                              title={emp.name}
                            >
                              {emp.empCode}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 justify-center">
                          <button
                            onClick={() => handleDeleteRequirement(requirement.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                            title="Delete Requirement"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {requirementsList.length === 0 && requirementRows.length === 0 && (
          <div className="text-center py-12 text-gray-500 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-lg font-medium">No requirements created yet</p>
            <p className="text-sm mt-1">Fill in the form above to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReuirementsCheckPoints;