import React, { useEffect, useState, useMemo } from "react";
import Table from "../../components/Table/Table";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Chip, Typography } from "@material-tailwind/react";
import { 
  MdDelete, 
  MdModeEditOutline, 
  MdVisibility,
  MdSearch,
  MdFilterList,
  MdFileDownload,
  MdAdd,
  MdUpload,
  MdBusiness,
  MdPeople,
  MdCheckCircle,
  MdCancel
} from "react-icons/md";
import { toast } from "react-toastify";

import Loader from "../Loader/Loader";
import { usePrompt } from "../../context/PromptProvider";
import { clientListAction, ClientStatusUpdateAction } from "../../redux/Action/Client/ClientAction";

const List = ({ state }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showPrompt, hidePrompt } = usePrompt();

  // Local state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Redux state
  const { clientList, loading, error, totalRecord, pageNo, limit } =
    useSelector((state) => state.client);

  // Get unique business types for filter
  const businessTypes = useMemo(() => {
    if (!clientList || !Array.isArray(clientList)) return [];
    const types = [...new Set(clientList.map(client => client.type).filter(Boolean))];
    return types;
  }, [clientList]);

  // CLIENT-SIDE FILTERING - Apply filters to the data
  const filteredClientList = useMemo(() => {
    if (!clientList || !Array.isArray(clientList)) return [];

    let filtered = [...clientList];

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(client => {
        if (statusFilter === "active") return client.isActive === true;
        if (statusFilter === "inactive") return client.isActive === false;
        return true;
      });
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter(client => client.type === typeFilter);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(client => {
        return (
          client.name?.toLowerCase().includes(searchLower) ||
          client.type?.toLowerCase().includes(searchLower) ||
          client.email?.toLowerCase().includes(searchLower) ||
          client.phone?.toLowerCase().includes(searchLower) ||
          client.mobile?.toLowerCase().includes(searchLower) ||
          client.nickName?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [clientList, statusFilter, typeFilter, searchTerm]);

  // Statistics based on FILTERED data
  const stats = useMemo(() => {
    if (!filteredClientList || !Array.isArray(filteredClientList)) {
      return { total: 0, active: 0, inactive: 0 };
    }
    return {
      total: filteredClientList.length,
      active: filteredClientList.filter(c => c.isActive === true).length,
      inactive: filteredClientList.filter(c => c.isActive === false).length,
    };
  }, [filteredClientList]);

  const getClientList = (params) => {
    dispatch(clientListAction({ ...params, clientId: state?._id }));
  };

  useEffect(() => {
    getClientList({ page: 1, limit: 100 }); // Fetch more records for client-side filtering
  }, []);

  // Navigation functions
  const addButton = () => navigate("/client/add");
  const editButton = (data) => {
    if (data.isActive === false) {
      toast.error("Cannot Edit. Please Activate First");
      return;
    }
    navigate("/client/edit", { state: data });
  };
  const viewButton = (data) => navigate("/client/view", { state: data });
  const importButton = () => navigate("/client/import");

  // Export to CSV
  const exportToCSV = () => {
    if (!filteredClientList || filteredClientList.length === 0) {
      toast.warning("No data to export");
      return;
    }

    const headers = [
      'Client ID',
      'Client Name',
      'Nick Name',
      'Business Type',
      'Status',
      'Created By',
      'Created Date',
      'Modified Date'
    ];

    const rows = filteredClientList.map(client => [
      client.clientId || client._id || '',
      client.name || '',
      client.nickName || '',
      client.type || '',
      client.isActive ? 'Active' : 'Inactive',
      `${client.createdBy?.firstName || ''} ${client.createdBy?.lastName || ''}`,
      new Date(client.createdDate).toLocaleDateString('en-IN'),
      new Date(client.modifiedDate).toLocaleDateString('en-IN')
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success("Exported successfully");
  };

  const confirmUpdate = (data) => {
    if (!data) return;
    const payload = {
      clientId: data.clientId,
      status: !data.isActive,
    };
    dispatch(ClientStatusUpdateAction(payload))
      .then(() => {
        getClientList({ page: pageNo, limit: limit });
        toast.success(`Client ${!data.isActive ? 'activated' : 'deactivated'} successfully`);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Status update failed");
      });
    hidePrompt();
  };

  const handleShowPrompt = (data) => {
    showPrompt({
      heading: "Are you sure?",
      message: (
        <span>
          Are you sure you want to{" "}
          <b className="font-bold text-gray-700">
            {data?.isActive ? `Deactivate` : `Activate`}
          </b>{" "}
          the client <b className="font-bold text-gray-700">{data.name}</b>?
        </span>
      ),
      buttons: [
        {
          label: "Yes",
          type: 1,
          onClick: () => {
            confirmUpdate(data);
          },
        },
        {
          label: "No",
          type: 0,
          onClick: () => {
            return hidePrompt();
          },
        },
      ],
    });
  };

  // Define table actions
  const actions = [
    {
      title: "View",
      text: <MdVisibility className="w-5 h-5" />,
      onClick: (client) => viewButton(client),
    },
    {
      title: "Edit",
      text: <MdModeEditOutline className="w-5 h-5" />,
      onClick: (client) => editButton(client),
    },
  ];

  const labels = {
    name: {
      DisplayName: "Client Name",
      type: "function",
      data: (data, idx) => {
        return (
          <div className="flex items-center gap-2" key={idx}>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <MdBusiness className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{data.name}</p>
              <p className="text-xs text-gray-500">{data.nickName || data.clientId || data._id}</p>
            </div>
          </div>
        );
      },
    },
    type: {
      DisplayName: "Business Type",
      type: "function",
      data: (data, idx) => {
        return (
          <Chip
            key={idx}
            variant="ghost"
            color="blue"
            value={data.type || "N/A"}
            className="font-medium"
          />
        );
      },
    },
    firstName: {
      DisplayName: "Created By",
      type: "function",
      data: (data, idx) => {
        return (
          <div key={idx}>
            <p className="font-medium text-gray-900">
              {data.createdBy?.firstName} {data.createdBy?.lastName}
            </p>
          </div>
        );
      },
    },
    isActive: {
      DisplayName: "Status",
      type: "function",
      data: (data, idx) => {
        return (
          <div className="flex justify-center items-center gap-2" key={idx}>
            <Chip
              color={data?.isActive ? "green" : "red"}
              variant="ghost"
              value={data?.isActive ? "Active" : "Inactive"}
              icon={data?.isActive ? <MdCheckCircle /> : <MdCancel />}
              className="cursor-pointer font-medium"
              onClick={(e) => {
                e.stopPropagation();
                handleShowPrompt(data);
              }}
            />
          </div>
        );
      },
    },
    createdDate: {
      DisplayName: "Created Date",
      type: "time",
      format: "DD-MM-YYYY",
    },
    modifiedDate: {
      DisplayName: "Last Modified",
      type: "time",
      format: "DD-MM-YYYY HH:mm A",
    },
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full">
      {/* Header Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Typography className="text-gray-900 font-semibold text-[20px] flex items-center gap-2">
              <MdBusiness className="w-6 h-6 text-blue-600" />
              Client Management
            </Typography>
            <Typography className="text-[#6c6c6c] font-medium text-[14px] mt-1">
              Manage and track all your clients
            </Typography>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              className="flex h-10 items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-green-600 shadow-none text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-medium"
              onClick={exportToCSV}
            >
              <MdFileDownload className="w-5 h-5" />
              Export
            </button>
            <button
              className="flex h-10 items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-purple-600 shadow-none text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
              onClick={importButton}
            >
              <MdUpload className="w-5 h-5" />
              Import
            </button>
            <button
              className="flex h-10 items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-blue-600 shadow-none text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
              onClick={addButton}
            >
              <MdAdd className="w-5 h-5" />
              Add Client
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <MdBusiness className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MdCheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inactive Clients</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.inactive}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <MdCancel className="w-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Clients
            </label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Type
            </label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              {businessTypes.map((type, idx) => (
                <option key={idx} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filters Display */}
        {(statusFilter !== "all" || typeFilter !== "all" || searchTerm) && (
          <div className="mt-4 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
            {searchTerm && (
              <Chip
                variant="ghost"
                color="blue"
                value={`Search: "${searchTerm}"`}
                onClose={() => setSearchTerm("")}
                className="cursor-pointer"
              />
            )}
            {statusFilter !== "all" && (
              <Chip
                variant="ghost"
                color="blue"
                value={`Status: ${statusFilter === 'active' ? 'Active' : 'Inactive'}`}
                onClose={() => setStatusFilter("all")}
                className="cursor-pointer"
              />
            )}
            {typeFilter !== "all" && (
              <Chip
                variant="ghost"
                color="blue"
                value={`Type: ${typeFilter}`}
                onClose={() => setTypeFilter("all")}
                className="cursor-pointer"
              />
            )}
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 hover:text-blue-800 underline font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing <strong>{filteredClientList.length}</strong> of <strong>{clientList?.length || 0}</strong> clients
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <Table
          tableName="Client"
          tableJson={filteredClientList}
          labels={labels}
          onRowClick={viewButton}
          isLoading={loading}
          actions={actions}
          paginationProps={{
            totalRecord: filteredClientList.length,
            pageNo: 1,
            limit: filteredClientList.length,
            onDataChange: () => {},
          }}
        />
      </div>
    </div>
  );
};

export default List;