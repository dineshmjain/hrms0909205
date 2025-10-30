// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { useDispatch } from 'react-redux';
// import { Clock, ChevronLeft, ChevronRight, Search, Filter, X } from 'lucide-react';
// import toast from 'react-hot-toast';
// import axiosInstance from '../../../config/axiosInstance';

// const AdvancedRequirementsTable = ({ clientId, branchId,clientMappedId }) => {
//     const dispatch = useDispatch();
    
//     // State management
//     const [requirements, setRequirements] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [hasNextPage, setHasNextPage] = useState(false);
//     const [totalItems, setTotalItems] = useState(0);
    
//     // Filter state
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedShift, setSelectedShift] = useState('');
//     const [selectedGender, setSelectedGender] = useState('');
//     const [selectedStatus, setSelectedStatus] = useState('');
//     const [showFilters, setShowFilters] = useState(false);
    
//     const itemsPerPage = 10;

//     // Fetch requirements from API
//     const fetchRequirements = useCallback(async (page = 1) => {
//         if (!clientId || !branchId) return;
        
//         setLoading(true);
//         try {
//             // Replace with your actual Redux action
//              const response = await axiosInstance.post("/client/branch/requirements/list", {
//                 "limit": itemsPerPage,
//                 "page": currentPage,
//                 "orgId": clientMappedId, branchId: branchId, clientId: clientId
//             }).then((res) => res?.data);
//     console.log("interma")

//             if (response.status === 200) {
//                 setRequirements(response.data || []);
//                 setHasNextPage(response.nextPage || false);
//                 setTotalItems(response.currentPageItemsCount || 0);
//             }
//         } catch (error) {
//             toast.error('Failed to fetch requirements');
//             console.error('Error fetching requirements:', error);
//             setRequirements([]);
//         } finally {
//             setLoading(false);
//         }
//     }, [dispatch, clientId,clientMappedId, branchId]);

//     // Initial fetch and refetch on page change
//     useEffect(() => {
//         fetchRequirements(currentPage);
//     }, [currentPage, fetchRequirements]);

//     // Get unique filter options from data
//     const filterOptions = useMemo(() => {
//         const shifts = [...new Set(requirements.map(r => r.shiftDetails?.name).filter(Boolean))];
//         const genders = [...new Set(requirements.map(r => r.gender).filter(Boolean))];
        
//         return {
//             shifts: shifts.map(s => ({ value: s, label: s })),
//             genders: genders.map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) })),
//             statuses: [
//                 { value: 'not_assigned', label: 'Not Assigned' },
//                 { value: 'partially_assigned', label: 'Partially Assigned' },
//                 { value: 'fully_assigned', label: 'Fully Assigned' }
//             ]
//         };
//     }, [requirements]);

//     // Filter requirements based on search and filters
//     const filteredRequirements = useMemo(() => {
//         return requirements.filter(req => {
//             // Search filter
//             const matchesSearch = searchTerm === '' || 
//                 req.shiftDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 req.designationDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());

//             // Shift filter
//             const matchesShift = selectedShift === '' || req.shiftDetails?.name === selectedShift;

//             // Gender filter
//             const matchesGender = selectedGender === '' || req.gender === selectedGender;

//             // Status filter
//             let matchesStatus = true;
//             if (selectedStatus === 'not_assigned') {
//                 matchesStatus = req.assignedCount === 0;
//             } else if (selectedStatus === 'partially_assigned') {
//                 matchesStatus = req.assignedCount > 0 && req.assignedCount < req.requiredCount;
//             } else if (selectedStatus === 'fully_assigned') {
//                 matchesStatus = req.assignedCount >= req.requiredCount;
//             }

//             return matchesSearch && matchesShift && matchesGender && matchesStatus;
//         });
//     }, [requirements, searchTerm, selectedShift, selectedGender, selectedStatus]);

//     // Pagination handlers
//     const handleNextPage = useCallback(() => {
//         if (hasNextPage) {
//             setCurrentPage(prev => prev + 1);
//         }
//     }, [hasNextPage]);

//     const handlePrevPage = useCallback(() => {
//         if (currentPage > 1) {
//             setCurrentPage(prev => prev - 1);
//         }
//     }, [currentPage]);

//     // Clear all filters
//     const clearFilters = useCallback(() => {
//         setSearchTerm('');
//         setSelectedShift('');
//         setSelectedGender('');
//         setSelectedStatus('');
//     }, []);

//     // Check if any filter is active
//     const hasActiveFilters = searchTerm || selectedShift || selectedGender || selectedStatus;

//     // Utility functions
//     const getGenderBadgeColor = (gender) => {
//         switch (gender?.toLowerCase()) {
//             case 'male':
//                 return 'bg-blue-100 text-blue-800';
//             case 'female':
//                 return 'bg-pink-100 text-pink-800';
//             default:
//                 return 'bg-gray-100 text-gray-800';
//         }
//     };

//     const getAssignmentStatusColor = (required, assigned) => {
//         if (!required) return 'bg-gray-100 text-gray-800';
//         if (assigned === 0) return 'bg-red-100 text-red-800';
//         if (assigned < required) return 'bg-yellow-100 text-yellow-800';
//         return 'bg-green-100 text-green-800';
//     };

//     const getAssignmentStatusText = (required, assigned) => {
//         if (assigned === 0) return 'Not Assigned';
//         if (assigned < required) return 'Partially Assigned';
//         return 'Fully Assigned';
//     };

//     if (loading && requirements.length === 0) {
//         return (
//             <div className="bg-white p-6 border border-gray-100 rounded-lg shadow-sm">
//                 <div className="flex items-center justify-center py-12">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-white border border-gray-100 rounded-lg shadow-sm">
//             {/* Header */}
//             <div className="flex items-center justify-between p-6 border-b border-gray-100">
//                 <div className="flex items-center gap-2">
//                     <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
//                         <Clock className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <h3 className="text-lg font-bold text-gray-800">Branch Requirements</h3>
//                 </div>

//                 {/* Search and Filter Toggle */}
//                 <div className="flex items-center gap-3">
//                     {/* Search */}
//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                         <input
//                             type="text"
//                             placeholder="Search shift or designation..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
//                         />
//                     </div>

//                     {/* Filter Toggle */}
//                     <button
//                         onClick={() => setShowFilters(!showFilters)}
//                         className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
//                             showFilters || hasActiveFilters
//                                 ? 'border-blue-500 bg-blue-50 text-blue-700'
//                                 : 'border-gray-300 hover:bg-gray-50'
//                         }`}
//                     >
//                         <Filter className="w-5 h-5" />
//                         Filters
//                         {hasActiveFilters && (
//                             <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                                 {[searchTerm, selectedShift, selectedGender, selectedStatus].filter(Boolean).length}
//                             </span>
//                         )}
//                     </button>
//                 </div>
//             </div>

//             {/* Filter Panel */}
//             {showFilters && (
//                 <div className="p-6 bg-gray-50 border-b border-gray-200">
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         {/* Shift Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
//                             <select
//                                 value={selectedShift}
//                                 onChange={(e) => setSelectedShift(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">All Shifts</option>
//                                 {filterOptions.shifts.map(option => (
//                                     <option key={option.value} value={option.value}>
//                                         {option.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Gender Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
//                             <select
//                                 value={selectedGender}
//                                 onChange={(e) => setSelectedGender(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">All Genders</option>
//                                 {filterOptions.genders.map(option => (
//                                     <option key={option.value} value={option.value}>
//                                         {option.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Status Filter */}
//                         <div>
//                             <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
//                             <select
//                                 value={selectedStatus}
//                                 onChange={(e) => setSelectedStatus(e.target.value)}
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">All Statuses</option>
//                                 {filterOptions.statuses.map(option => (
//                                     <option key={option.value} value={option.value}>
//                                         {option.label}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>

//                         {/* Clear Filters */}
//                         <div className="flex items-end">
//                             <button
//                                 onClick={clearFilters}
//                                 disabled={!hasActiveFilters}
//                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//                             >
//                                 <X className="w-4 h-4" />
//                                 Clear Filters
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Table */}
//             <div className="overflow-x-auto relative">
//                 <table className="w-full">
//                     <thead>
//                         <tr className="bg-gray-50 border-b border-gray-200">
//                             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Shift</th>
//                             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Designation</th>
//                             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gender</th>
//                             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Required</th>
//                             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assigned</th>
//                             <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
//                         </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                         {filteredRequirements.length === 0 ? (
//                             <tr>
//                                 <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
//                                     {hasActiveFilters ? (
//                                         <>
//                                             <p className="text-lg">No requirements match your filters</p>
//                                             <button
//                                                 onClick={clearFilters}
//                                                 className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
//                                             >
//                                                 Clear filters to see all requirements
//                                             </button>
//                                         </>
//                                     ) : (
//                                         <>
//                                             <p className="text-lg">No requirements found</p>
//                                             <p className="text-sm mt-2">Add requirements to see them here</p>
//                                         </>
//                                     )}
//                                 </td>
//                             </tr>
//                         ) : (
//                             filteredRequirements.map((req) => (
//                                 <tr key={req._id} className="hover:bg-gray-50 transition-colors">
//                                     <td className="px-6 py-4 text-sm text-gray-900 font-medium">
//                                         {req.shiftDetails?.name || 'N/A'}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm text-gray-900">
//                                         {req.designationDetails?.name || 'N/A'}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getGenderBadgeColor(req.gender)}`}>
//                                             {req.gender || 'N/A'}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
//                                         {req.requiredCount ?? 'N/A'}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
//                                         {req.assignedCount}
//                                     </td>
//                                     <td className="px-6 py-4 text-sm">
//                                         <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAssignmentStatusColor(req.requiredCount, req.assignedCount)}`}>
//                                             {getAssignmentStatusText(req.requiredCount, req.assignedCount)}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))
//                         )}
//                     </tbody>
//                 </table>

//                 {/* Loading overlay */}
//                 {loading && (
//                     <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                     </div>
//                 )}
//             </div>

//             {/* Pagination */}
//             {requirements.length > 0 && (
//                 <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
//                     <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-700">
//                             Page <span className="font-medium">{currentPage}</span>
//                         </span>
//                         <span className="text-sm text-gray-500">
//                             ({filteredRequirements.length} of {totalItems} items)
//                         </span>
//                     </div>

//                     <div className="flex items-center gap-2">
//                         <button
//                             onClick={handlePrevPage}
//                             disabled={currentPage === 1 || loading}
//                             className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
//                         >
//                             <ChevronLeft className="w-5 h-5" />
//                             <span className="text-sm font-medium">Previous</span>
//                         </button>
                        
//                         <button
//                             onClick={handleNextPage}
//                             disabled={!hasNextPage || loading}
//                             className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
//                         >
//                             <span className="text-sm font-medium">Next</span>
//                             <ChevronRight className="w-5 h-5" />
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AdvancedRequirementsTable;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Clock, Edit2, Check, X, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosInstance from '../../../config/axiosInstance';
import { EmployeeGetAction, EmployeeGetActionForFilter } from '../../../redux/Action/Employee/EmployeeAction';
import { removeEmptyStrings } from '../../../constants/reusableFun';
import { useSelector } from 'react-redux';


 const AdvanceRequirementsandCheckpoints = ({ clientId, branchId, clientMappedId, isAdd, setIsAdd, values }) => {
    const dispatch = useDispatch();
    
    // State management
    const [requirements, setRequirements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    
    // Edit state
    const [editingId, setEditingId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [editValue, setEditValue] = useState('');
    
    // Modal state
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedRequirement, setSelectedRequirement] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    
    // Filter state
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedShift, setSelectedShift] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    
    const { employeeList } = useSelector((state) => state?.employee);
    
    const [desgId, setDesgId] = useState();
    const [gender, setGender] = useState('male');
    
    const itemsPerPage = 10;

    // Fetch requirements from API
    const fetchRequirements = useCallback(async (page = 1) => {
        if (!clientId || !branchId) return;
        
        setLoading(true);
        try {
            const response = await axiosInstance.post("/client/branch/requirements/list", {
                "limit": itemsPerPage,
                "page": page,
                "orgId": clientMappedId,
                "branchId": branchId,
                "clientId": clientId
            });

            if (response?.data?.status === 200) {
                setRequirements(response.data.data || []);
                setHasNextPage(response.data.nextPage || false);
                setTotalItems(response.data.currentPageItemsCount || 0);
            }
        } catch (error) {
            toast.error('Failed to fetch requirements');
            console.error('Error fetching requirements:', error);
            setRequirements([]);
        } finally {
            setLoading(false);
            if (setIsAdd) setIsAdd(false);
        }
    }, [clientId, clientMappedId, branchId, setIsAdd]);

    // Initial fetch and refetch on dependencies
    useEffect(() => {
        fetchRequirements(currentPage);
    }, [currentPage, fetchRequirements]);

    // Refetch when isAdd changes to true
    useEffect(() => {
        if (isAdd === true) {
            fetchRequirements(currentPage);
        }
    }, [isAdd]);

    // Fetch employees when modal opens
    useEffect(() => {
        if (selectedRequirement && values) {
            dispatch(EmployeeGetAction(removeEmptyStrings({
                orgIds: values?.subOrgId ? [values.subOrgId] : [],
                branchIds: values?.branchId ? [values.branchId] : [],
                designationIds: desgId ? [desgId] : [],
            })));
        }
    }, [selectedRequirement, desgId, values, dispatch]);

    // Get unique filter options
    const filterOptions = useMemo(() => {
        const shifts = [...new Set(requirements.map(r => r.shiftDetails?.name).filter(Boolean))];
        const genders = [...new Set(requirements.map(r => r.gender).filter(Boolean))];
        
        return {
            shifts: shifts.map(s => ({ value: s, label: s })),
            genders: genders.map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }))
        };
    }, [requirements]);

    // Filter requirements
    const filteredRequirements = useMemo(() => {
        return requirements.filter(req => {
            const matchesSearch = searchTerm === '' || 
                req.shiftDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.designationDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesShift = selectedShift === '' || req.shiftDetails?.name === selectedShift;
            const matchesGender = selectedGender === '' || req.gender === selectedGender;

            return matchesSearch && matchesShift && matchesGender;
        });
    }, [requirements, searchTerm, selectedShift, selectedGender]);

    // Edit handlers
    const handleStartEdit = useCallback((req, field) => {
        setEditingId(req._id);
        setEditField(field);
        setEditValue(field === 'checkpoints' ? req.checkpoints : req.requiredCount);
    }, []);

    const handleCancelEdit = useCallback(() => {
        setEditingId(null);
        setEditField(null);
        setEditValue('');
    }, []);

    const handleSaveEdit = useCallback(async (reqId) => {
        if (!editValue || editValue.trim() === '') {
            toast.error('Value cannot be empty');
            return;
        }

        const numValue = parseInt(editValue);
        if (isNaN(numValue) || numValue <= 0) {
            toast.error('Please enter a valid positive number');
            return;
        }

        try {
            // Determine which field to update
            const updateField = editField === 'checkpoints' ? 'checkpoints' : 'requiredCount';
            
            const { data } = await axiosInstance.post("/client/branch/requirements/update", {
                "requirementId": reqId,
                "updates": {
                    [updateField]: numValue
                }
            });

            if (data?.status === "200" || data?.status === 200) {
                // Update local state
                setRequirements(prev => prev.map(req => {
                    if (req._id === reqId) {
                        return { ...req, [updateField]: numValue };
                    }
                    return req;
                }));

                toast.success(`${editField === 'checkpoints' ? 'Checkpoints' : 'Employee count'} updated successfully`);
                handleCancelEdit();
            } else {
                toast.error(data?.message || 'Failed to update');
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to update');
        }
    }, [editValue, editField, handleCancelEdit]);

    // Assignment modal handlers
    const handleOpenAssignModal = useCallback((requirement) => {
        setDesgId(requirement?.designationId);
        setGender(requirement?.gender);
        setSelectedRequirement(requirement);
        setSelectedEmployees(requirement.assignedEmployees || []);
        setIsAssignModalOpen(true);
    }, []);

    const handleCloseAssignModal = useCallback(() => {
        setIsAssignModalOpen(false);
        setSelectedRequirement(null);
        setSelectedEmployees([]);
    }, []);

    const handleEmployeeSelection = useCallback((employee) => {
        setSelectedEmployees(prev => {
            const isAlreadySelected = prev.some(emp => emp._id === employee._id);
            if (isAlreadySelected) {
                return prev.filter(emp => emp._id !== employee._id);
            } else {
                if (prev.length >= parseInt(selectedRequirement.requiredCount)) {
                    toast.error('Maximum employee limit reached');
                    return prev;
                }
                return [...prev, employee];
            }
        });
    }, [selectedRequirement]);

    const handleSaveAssignment = useCallback(async () => {
        if (selectedEmployees.length === 0) {
            toast.error('Please select at least one employee');
            return;
        }

        try {
            const payload = {
                requirementId: selectedRequirement?._id,
                employeeIds: selectedEmployees?.map((r) => r?._id)
            };

            const { data } = await axiosInstance.post('/client/branch/requirements/employees', payload);
            
            if (data?.status === 200 || data?.status === "200") {
                // Update local state
                setRequirements(prev => prev.map(req => {
                    if (req._id === selectedRequirement._id) {
                        return { 
                            ...req, 
                            assignedCount: selectedEmployees.length, 
                            assignedEmployees: selectedEmployees 
                        };
                    }
                    return req;
                }));

                toast.success(`${selectedEmployees.length} employee(s) assigned successfully`);
                handleCloseAssignModal();
            } else {
                toast.error(data?.message || 'Failed to assign employees');
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to assign employees');
        }
    }, [selectedEmployees, selectedRequirement, handleCloseAssignModal]);

    const getFilteredEmployees = useCallback(() => {
        if (!selectedRequirement || !employeeList) return [];
        
        return employeeList.filter((emp) => {
            // Add your filtering logic here based on designation and gender
            // const matchesDesignation = emp.designation?.designationId === selectedRequirement.designationId;
            // const matchesGender = emp.gender === selectedRequirement.gender;
            // return matchesDesignation && matchesGender;
            return true; // For now, return all employees
        });
    }, [selectedRequirement, employeeList]);

    // Pagination handlers
    const handleNextPage = useCallback(() => {
        if (hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    }, [hasNextPage]);

    const handlePrevPage = useCallback(() => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [currentPage]);

    const clearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedShift('');
        setSelectedGender('');
    }, []);

    const hasActiveFilters = searchTerm || selectedShift || selectedGender;

    if (loading && requirements.length === 0) {
        return (
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Header with Search and Filters */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-semibold text-gray-800">Added Requirements</h4>
                    
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-48"
                            />
                        </div>

                        {/* Filter Toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-3 py-2 border rounded-lg transition-colors flex items-center gap-2 text-sm ${
                                showFilters || hasActiveFilters
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:bg-gray-50'
                            }`}
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                            {hasActiveFilters && (
                                <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {[searchTerm, selectedShift, selectedGender].filter(Boolean).length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Shift</label>
                            <select
                                value={selectedShift}
                                onChange={(e) => setSelectedShift(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Shifts</option>
                                {filterOptions.shifts.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Gender</label>
                            <select
                                value={selectedGender}
                                onChange={(e) => setSelectedGender(e.target.value)}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Genders</option>
                                {filterOptions.genders.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                disabled={!hasActiveFilters}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Shift
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Checkpoints
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Designation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gender
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee Count
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assigned
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredRequirements.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                    {hasActiveFilters ? (
                                        <>
                                            <p className="text-lg">No requirements match your filters</p>
                                            <button
                                                onClick={clearFilters}
                                                className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                Clear filters
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-lg">No requirements found</p>
                                    )}
                                </td>
                            </tr>
                        ) : (
                            filteredRequirements.map((req) => (
                                <tr key={req._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {req?.shiftDetails?.name || 'N/A'}
                                    </td>
                                    
                                    {/* Editable Checkpoints */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingId === req._id && editField === 'checkpoints' ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-20 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(req._id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Save"
                                                >
                                                    <Check className="w-4 h-4" type='button' />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>{req.checkpoints || 0}</span>
                                                <button
                                                    onClick={() => handleStartEdit(req, 'checkpoints')}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit Checkpoints"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {req.designationDetails?.name || 'N/A'}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                                        {req.gender || 'N/A'}
                                    </td>
                                    
                                    {/* Editable Employee Count */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingId === req._id && editField === 'employeeCount' ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-20 px-2 py-1 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(req._id)}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Save"
                                                >
                                                    <Check className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Cancel"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <span>{req.requiredCount || 0}</span>
                                                <button
                                                    onClick={() => handleStartEdit(req, 'employeeCount')}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit Employee Count"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            req.assignedCount > 0
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {req.assignedCount || 0} / {req.requiredCount || 0}
                                        </span>
                                    </td>
                                    
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button
                                            type="button"
                                            onClick={() => handleOpenAssignModal(req)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                                        >
                                            Assign
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {requirements.length > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                    <div className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> - {filteredRequirements.length} of {totalItems} items
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1 || loading}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm">Previous</span>
                        </button>
                        
                        <button
                            onClick={handleNextPage}
                            disabled={!hasNextPage || loading}
                            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
                        >
                            <span className="text-sm">Next</span>
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Assignment Modal */}
            {isAssignModalOpen && selectedRequirement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assign Employees</h2>
                                <p className="text-sm text-gray-600 mt-1">
                                    {selectedRequirement.shiftDetails?.name} - {selectedRequirement.designationDetails?.name} ({selectedRequirement.gender})
                                </p>
                            </div>
                            <button
                                onClick={handleCloseAssignModal}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Selection Info */}
                        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-900">
                                    Selected: {selectedEmployees.length} / {selectedRequirement.requiredCount}
                                </span>
                                {selectedEmployees.length >= parseInt(selectedRequirement.requiredCount) && (
                                    <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">
                                        Maximum limit reached
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Employee List */}
                        <div className="p-6 overflow-y-auto flex-1">
                            {getFilteredEmployees().length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <p>No employees found matching the criteria</p>
                                    <p className="text-sm mt-2">
                                        Designation: {selectedRequirement.designationDetails?.name}, Gender: {selectedRequirement.gender}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-3">
                                    {getFilteredEmployees().map((employee) => {
                                        const isSelected = selectedEmployees.some(emp => emp._id === employee._id);
                                        const isDisabled = !isSelected && selectedEmployees.length >= parseInt(selectedRequirement.requiredCount);
                                        
                                        return (
                                            <div
                                                key={employee._id}
                                                onClick={() => !isDisabled && handleEmployeeSelection(employee)}
                                                className={`
                                                    p-4 border-2 rounded-lg cursor-pointer transition-all
                                                    ${isSelected 
                                                        ? 'border-blue-500 bg-blue-50' 
                                                        : isDisabled
                                                            ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                                                    }
                                                `}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                            w-10 h-10 rounded-full flex items-center justify-center font-bold text-white
                                                            ${isSelected ? 'bg-blue-600' : 'bg-gray-400'}
                                                        `}>
                                                            {employee.name?.firstName.charAt(0)}{ employee.name?.lastName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{employee?.name.firstName}{employee?.name.lastName}</p>
                                                            <p className="text-sm text-gray-600">
                                                                {employee._id} • {employee.designation?.designationName}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {isSelected && (
                                                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
                            <button
                                onClick={handleCloseAssignModal}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveAssignment}
                                disabled={selectedEmployees.length === 0}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save Assignment ({selectedEmployees.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && requirements.length > 0 && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            )}
        </div>
    );
};

export default AdvanceRequirementsandCheckpoints;