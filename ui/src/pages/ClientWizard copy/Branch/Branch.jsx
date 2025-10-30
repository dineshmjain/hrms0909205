import { Building, CheckCircle, UserPlus, Trash2, Edit2 } from 'lucide-react';
import React, { useState } from 'react';

const Branch = ({ formData, handleInputChange, setFormData, isSave }) => {
  // Mock data
  const branches = [
    { id: 1, name: "Head Office - Mumbai" },
    { id: 2, name: "Branch Office - Delhi" },
    { id: 3, name: "Regional Office - Bangalore" },
  ];

  const employees = [
    { id: 1, name: "John Doe - Field Officer" },
    { id: 2, name: "Jane Smith - Senior Officer" },
    { id: 3, name: "Mike Johnson - Field Supervisor" },
  ];

  // State management
  const [clientBranches, setClientBranches] = useState([]);
  const [isAddingBranch, setIsAddingBranch] = useState(false);
  const [editingBranchIndex, setEditingBranchIndex] = useState(null);

  // Add new branch - NO VALIDATION
  const handleAddBranch = () => {
    const newBranch = {
      id: Date.now(),
      branchName: formData.branchName,
      contractDate: formData.contractDate,
      ownerName: formData.ownerName,
      designation: formData.designation,
      contactMobile: formData.contactMobile,
      contactEmail: formData.contactEmail,
      gstNumber: formData.gstNumber,
      panNumber: formData.panNumber,
      landmark: formData.landmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      registeredAddress: formData.registeredAddress,
      selectedBranch: formData.selectedBranch,
      selectedEmployee: formData.selectedEmployee,
    };

    if (editingBranchIndex !== null) {
      const updatedBranches = [...clientBranches];
      updatedBranches[editingBranchIndex] = newBranch;
      setClientBranches(updatedBranches);
      setEditingBranchIndex(null);
    } else {
      setClientBranches((prev) => [...prev, newBranch]);
    }

    // Reset only branch-specific fields
    setFormData((prev) => ({
      ...prev,
      branchName: "",
      ownerName: "",
      designation: "",
      contactMobile: "",
      contactEmail: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      selectedBranch: "",
      selectedEmployee: "",
    }));
    setIsAddingBranch(false);
  };

  // Edit branch
  const handleEditBranch = (index) => {
    const branch = clientBranches[index];
    setFormData((prev) => ({
      ...prev,
      branchName: branch.branchName,
      contractDate: branch.contractDate,
      ownerName: branch.ownerName,
      designation: branch.designation,
      contactMobile: branch.contactMobile,
      contactEmail: branch.contactEmail,
      gstNumber: branch.gstNumber,
      panNumber: branch.panNumber,
      landmark: branch.landmark,
      city: branch.city,
      state: branch.state,
      pincode: branch.pincode,
      registeredAddress: branch.registeredAddress,
      selectedBranch: branch.selectedBranch,
      selectedEmployee: branch.selectedEmployee,
    }));
    setEditingBranchIndex(index);
    setIsAddingBranch(true);
  };

  // Delete branch
  const handleDeleteBranch = (index) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      setClientBranches((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Cancel branch mode
  const handleCancelBranch = () => {
    setIsAddingBranch(false);
    setEditingBranchIndex(null);
    setFormData((prev) => ({
      ...prev,
      branchName: "",
      ownerName: "",
      designation: "",
      contactMobile: "",
      contactEmail: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      selectedBranch: "",
      selectedEmployee: "",
    }));
  };

  // Reset entire form
  const handleAddNewClient = () => {
    setFormData({
      companyName: "",
      contractDate: "",
      branchName: "",
      ownerName: "",
      designation: "",
      contactMobile: "",
      contactEmail: "",
      gstNumber: "",
      panNumber: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      registeredAddress: "",
      selectedBranch: "",
      selectedEmployee: "",
      shifts: [],
    });
    setClientBranches([]);
    setIsAddingBranch(false);
    setEditingBranchIndex(null);
  };

  return (
    <div className="space-y-6">
      {/* Show Client Info Banner when adding branch */}
      {isAddingBranch && formData.companyName && (
        <div className=" border-l-4 border-blue-600 p-4 rounded-lg">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-semibold text-blue-800">Adding Branch For:</p>
              <p className="text-lg font-bold text-blue-900">{formData.companyName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Client Details */}
      <div className="rounded-lg p-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-primary" />
          {isAddingBranch ? (editingBranchIndex !== null ? "Edit Branch Details" : "Add Branch Details") : "Client Details"}
        </h3>

        <div className="">
          {/* Show Company Name only when NOT adding branch */}
          {!isAddingBranch && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Organization Name *
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Date *
                </label>
                <input
                  type="date"
                  value={formData.contractDate || ""}
                  onChange={(e) => handleInputChange("contractDate", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>
          )}

          {/* Show Branch Name only when adding branch */}
          {isAddingBranch && (
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch Name *
              </label>
              <input
                type="text"
                value={formData.branchName || ""}
                onChange={(e) => handleInputChange("branchName", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Enter branch name"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Owner/Incharge Name *
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleInputChange("ownerName", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter owner/incharge name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation *
            </label>
            <input
              type="text"
              value={formData.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter designation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.contactMobile}
              onChange={(e) => handleInputChange("contactMobile", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter contact number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ID *
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleInputChange("contactEmail", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>

      {/* Section 2: KYC Details */}
      <div className="rounded-lg p-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          KYC Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Number *
            </label>
            <input
              type="text"
              value={formData.gstNumber}
              onChange={(e) => handleInputChange("gstNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter GST number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PAN Number *
            </label>
            <input
              type="text"
              value={formData.panNumber}
              onChange={(e) => handleInputChange("panNumber", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter PAN number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registered Address
            </label>
            <textarea
              value={formData.registeredAddress || ""}
              onChange={(e) => handleInputChange("registeredAddress", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter registered address"
              rows="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landmark
            </label>
            <input
              type="text"
              value={formData.landmark || ""}
              onChange={(e) => handleInputChange("landmark", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter landmark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter city"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              value={formData.state || ""}
              onChange={(e) => handleInputChange("state", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter state"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              value={formData.pincode || ""}
              onChange={(e) => handleInputChange("pincode", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 bg-white"
              placeholder="Enter pincode"
              maxLength="6"
            />
          </div>
        </div>
      </div>

      {/* Section 3: Assign Field Officer */}
      <div className="rounded-lg p-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-purple-600" />
          Assign Field Officer
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Branch *
            </label>
            <select
              value={formData.selectedBranch}
              onChange={(e) => handleInputChange("selectedBranch", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">Choose a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee *
            </label>
            <select
              value={formData.selectedEmployee}
              onChange={(e) => handleInputChange("selectedEmployee", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="">Choose an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Display Added Branches in Table Format */}
      {clientBranches.length > 0 && (
        <div className="rounded-lg border border-gray-200 p-4 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Added Branches ({clientBranches.length})</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Branch Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Incharge</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Designation</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Contact</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">City</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clientBranches.map((branch, index) => (
                  <tr key={branch.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{branch.branchName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{branch.ownerName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{branch.designation}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{branch.contactMobile}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{branch.contactEmail || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{branch.city || '-'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEditBranch(index)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                          title="Edit Branch"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBranch(index)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                          title="Delete Branch"
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

      {/* Action Buttons */}
      {isSave && (
        <div className="flex flex-wrap gap-3 justify-center pt-4">
          {isAddingBranch ? (
            <>
              <button
                onClick={handleCancelBranch}
                className="flex items-center gap-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all font-medium shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBranch}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-md"
              >
                <Building className="w-5 h-5" />
                {editingBranchIndex !== null ? "Update Branch" : "Save Branch"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleAddNewClient}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-md"
              >
                <UserPlus className="w-5 h-5" />
                Add New Client
              </button>

              <button
                onClick={() => setIsAddingBranch(true)}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium shadow-md"
              >
                <Building className="w-5 h-5" />
                Add More Branches
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Branch;