import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LeadGetAction } from '../../redux/Action/Leads/LeadAction';
import { SubOrgListAction } from '../../redux/Action/SubOrgAction/SubOrgAction';
import SingleSelectDropdown from '../../components/SingleSelectDropdown/SingleSelectDropdown';
import { useCheckEnabledModule } from '../../hooks/useCheckEnabledModule';
import { BranchGetAction } from '../../redux/Action/Branch/BranchAction';

const List = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkModules = useCheckEnabledModule()
  // Redux state
  const { leadList, loading, totalRecord, currentPage: apiPage } = useSelector((state) => state?.leads || {});
  const { subOrgs } = useSelector((state) => state?.subOrgs || {});
  const { branchList } = useSelector((state) => state?.branch || {});
  const tem = useSelector((state) => state?.branch)
  console.log(tem, 'leadList')
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subOrgFilter, setSubOrgFilter] = useState(null);
  const [branchFilter, setBranchFilter] = useState(null);
  const [sortBy, setSortBy] = useState('createdDate');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch data on mount and when filters change
  useEffect(() => {
    if (checkModules('suborganization', 'r')) {
      getSubOrgList();
    } else {

      getBranchList();
    }
  }, []);

  useEffect(() => {
    getLeadList();
  }, [currentPage, itemsPerPage, statusFilter, subOrgFilter, branchFilter, searchTerm]);

  const getSubOrgList = () => {
    dispatch(SubOrgListAction({}));
  };
  useEffect(() => {
    getBranchList()
  }, [subOrgFilter?._id])
  const getBranchList = () => {
    const params = {

    }
    if (subOrgFilter?._id) {
      params.subOrgId = subOrgFilter?._id
    }
    dispatch(BranchGetAction({ ...params }));
  };

  const getLeadList = () => {
    const params = {
      page: currentPage,
      limit: itemsPerPage,
    };

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    if (subOrgFilter) {
      params.subOrgId = subOrgFilter._id;
    }

    if (branchFilter) {
      params.branchId = branchFilter._id;
    }

    if (searchTerm) {
      params.search = searchTerm;
    }

    dispatch(LeadGetAction(params));
  };

  // Format date helpers
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateRelative = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  // Status configuration
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock
    },
    converted: {
      label: 'Converted',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle
    },
    rejected: {
      label: 'Rejected',
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    },
    Negotiation: {
      label: 'Negotiation',
      color: 'bg-blue-100 text-blue-800',
      icon: TrendingUp
    }
  };

  // Statistics
  const stats = useMemo(() => {
    if (!leadList || !Array.isArray(leadList)) {
      return { total: 0, pending: 0, converted: 0, rejected: 0 };
    }
    return {
      total: totalRecord || leadList.length,
      pending: leadList.filter(l => l.status === 'pending').length,
      converted: leadList.filter(l => l.status === 'converted').length,
      rejected: leadList.filter(l => l.status === 'rejected').length
    };
  }, [leadList, totalRecord]);

  // Calculate pagination
  const totalPages = Math.ceil((totalRecord || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalRecord || 0);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(parseInt(value));
    setCurrentPage(1);
  };

  // Export to CSV
  const exportToCSV = () => {
    if (!leadList || leadList.length === 0) return;

    const headers = ['Company Name', 'Address', 'Contact Person', 'Designation', 'Mobile', 'Email', 'Status', 'Sub Organization', 'Branch', 'Created By', 'Created Date', 'Modified Date'];
    const rows = leadList.map(lead => [
      lead.companyName,
      lead.companayAddress,
      lead.person,
      lead.designation,
      lead.mobile,
      lead.email,
      lead.status,
      lead.subOrgName || subOrgs?.find(s => s._id === lead.subOrgId)?.name || 'N/A',
      branchList?.find(b => b._id === lead.branchId)?.name || 'N/A',
      `${lead.createdByName?.firstName} ${lead.createdByName?.lastName}`,
      formatDate(lead.createdDate),
      formatDate(lead.modifiedDate)
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSubOrgFilter(null);
    setBranchFilter(null);
    setCurrentPage(1);
  };

  const addButton = () => navigate('/leads/add');
  const editButton = (lead) => navigate('/leads/edit', { state: lead });
  const viewButton = (lead) => navigate('/leads/edit', { state: lead });

  return (
    <div className="flex flex-col gap-6 p-4 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              Lead Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and track your business leads</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={addButton}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Converted</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.converted}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by company, contact person, email, or mobile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sub Organization Filter */}
          <div>
            <SingleSelectDropdown
              feildName='name'
              listData={subOrgs || []}
              inputName='All Sub Organizations'
              hideLabel
              customLabelCss={'p-2 border border-gray-300 rounded-lg text-sm'}
              handleClick={(subOrg) => setSubOrgFilter(subOrg)}
              selectedOptionDependency={'_id'}
              selectedOption={subOrgFilter?._id}
            />
          </div>

          {/* Branch Filter */}
          <div>
            <SingleSelectDropdown
              feildName='name'
              listData={branchList || []}
              inputName='All branchList'
              hideLabel
              customLabelCss={'p-2 border border-gray-300 rounded-lg text-sm'}
              handleClick={(branch) => setBranchFilter(branch)}
              selectedOptionDependency={'_id'}
              selectedOption={branchFilter?._id}
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="converted">Converted</option>
              <option value="rejected">Rejected</option>
              <option value="Negotiation">Negotiation</option>
            </select>
          </div>

          {/* Sort and Reset */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdDate">Sort by Date</option>
              <option value="companyName">Sort by Company</option>
              <option value="status">Sort by Status</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <strong>{startIndex}</strong> to <strong>{endIndex}</strong> of <strong>{totalRecord || 0}</strong> leads
            {(subOrgFilter || branchFilter) && (
              <span className="ml-2 text-blue-600">
                {subOrgFilter && `• Sub Org: ${subOrgFilter.name}`}
                {branchFilter && `• Branch: ${branchFilter.name}`}
              </span>
            )}
          </div>
          {(searchTerm || statusFilter !== 'all' || subOrgFilter || branchFilter) && (
            <button
              onClick={resetFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading leads...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sub Org / Branch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact Person
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Created By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leadList && leadList.length > 0 ? (
                  leadList.map((lead) => {
                    const StatusIcon = statusConfig[lead.status]?.icon || Clock;
                    return (
                      <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">
                                {lead.companyName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {lead.companyAddress}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-gray-900">
                                {lead.subOrgName || subOrgs?.find(s => s._id === lead.subOrgId)?.name || 'N/A'}
                              </span>
                            </div>
                            {lead.branchId && (
                              <div className="flex items-center gap-2 ml-6">
                                <MapPin className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-600">
                                  {branchList?.find(b => b._id === lead.branchId)?.name || 'N/A'}
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-gray-900">
                                {lead.person}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500 ml-6">
                              {lead.designation}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Phone className="h-3 w-3 text-gray-400" />
                              {lead.mobile}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <Mail className="h-3 w-3 text-gray-400" />
                              {lead.contactPersonEmail}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[lead.status]?.color}`}>
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig[lead.status]?.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {lead.createdByName?.firstName?.charAt(0)}{lead.createdByName?.lastName?.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {lead.createdByName?.firstName} {lead.createdByName?.lastName}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="text-xs text-gray-500">Created:</div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(lead.createdDate)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDateRelative(lead.createdDate)}
                            </div>
                            {lead.modifiedDate !== lead.createdDate && (
                              <>
                                <div className="text-xs text-gray-500 mt-1">Modified:</div>
                                <div className="text-xs text-gray-700">
                                  {formatDate(lead.modifiedDate)}
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => viewButton(lead)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => editButton(lead)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Lead"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this lead?')) {
                                  // Add your delete logic here
                                  console.log('Delete lead:', lead._id);
                                }
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Lead"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No leads found</p>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="text-blue-600 hover:text-blue-800 underline mt-2"
                        >
                          Clear search
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-sm text-gray-600">entries</span>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>

              <div className="flex gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>

                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded-lg text-sm ${currentPage === page
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'border-gray-300 hover:bg-gray-50'
                          }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2">...</span>;
                  }
                  return null;
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;