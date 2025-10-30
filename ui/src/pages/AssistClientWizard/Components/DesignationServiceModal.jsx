import React, { useState, useEffect } from 'react';
import { X, Shield, AlertCircle, CheckCircle, Loader2, Search } from 'lucide-react';

import toast from 'react-hot-toast';
import axiosInstance from '../../../config/axiosInstance';

const DesignationServiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesignations, setSelectedDesignations] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchDesignations();
    }
  }, [isOpen]);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/designation/get/asService");
      const allDesignations = response?.data?.data || [];
      setDesignations(allDesignations);
      
      // Pre-select designations that are already service designations
      const serviceDesignations = allDesignations
        .filter(d => d.isService)
        .map(d => d._id);
      setSelectedDesignations(serviceDesignations);
    } catch (error) {
      console.error('Error fetching designations:', error);
      toast.error('Failed to load designations');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleDesignation = (designationId) => {
    setSelectedDesignations(prev => {
      if (prev.includes(designationId)) {
        return prev.filter(id => id !== designationId);
      } else {
        return [...prev, designationId];
      }
    });
  };

const handleSave = async () => {
  if (selectedDesignations.length === 0) {
    toast.error("Please select at least one designation");
    return;
  }

  setSaving(true);
  try {
    for (const designation of designations) {
      const shouldBeService = selectedDesignations.includes(designation._id);

      // Only send update if there's a change
      if (designation.isService !== shouldBeService) {
        try {
          await axiosInstance.post("/designation/update/asService", {
            designationId: designation._id,
            isService: shouldBeService,
          });

        //   toast.success(
        //     `${designation.name} ${shouldBeService ? "enabled" : "disabled"}`
        //   );
        } catch (error) {
          console.error("Error updating:", designation.name, error);
          toast.error(`Failed to update ${designation.name}`);
        }
      }
    }

    // Refresh list after all updates
    await fetchDesignations();

    toast.success("All selected designations updated successfully!");
    onSuccess();
    onClose();
  } catch (error) {
    console.error("Error updating designations:", error);
    toast.error("Failed to update some designations");
  } finally {
    setSaving(false);
  }
};


  const filteredDesignations = designations.filter(designation => {
    if (!searchQuery) return true;
    return designation.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Enable Service Designations
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Select designations that will be available for client requirements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            disabled={saving}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 m-6 rounded">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-800">Service Designations Required</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You must enable at least one designation as a service before creating client requirements. 
                These designations will be available when assigning employees to clients.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search designations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-gray-600 mt-2">
              Found {filteredDesignations.length} designation{filteredDesignations.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Designations List */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : filteredDesignations.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No designations found matching your search' : 'No designations available'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredDesignations.map((designation) => {
                const isSelected = selectedDesignations.includes(designation._id);
                return (
                  <div
                    key={designation._id}
                    onClick={() => handleToggleDesignation(designation._id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-blue-600' : 'bg-gray-200'
                        }`}>
                          <Shield className={`w-5 h-5 ${
                            isSelected ? 'text-white' : 'text-gray-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{designation.name}</p>
                          {designation.description && (
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                              {designation.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-blue-600' : 'bg-gray-200 border border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Summary */}
        {selectedDesignations.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
            <p className="text-sm font-medium text-gray-700">
              <span className="text-blue-600 font-bold">{selectedDesignations.length}</span> designation{selectedDesignations.length !== 1 ? 's' : ''} selected
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold shadow-md disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || selectedDesignations.length === 0}
              className={`px-6 py-3 rounded-lg transition-all font-semibold shadow-md flex items-center gap-2 ${
                saving || selectedDesignations.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Enable Selected ({selectedDesignations.length})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignationServiceModal;