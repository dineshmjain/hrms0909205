import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Header from '../../../components/header/Header'
import { Button } from '@material-tailwind/react'
import { useCheckEnabledModule } from '../../../hooks/useCheckEnabledModule';
import {
  Building2,
  History,
  Plus,
  Search,
  Settings,
  TrendingUp,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Calendar,
  Users,
  MapPin,
  Clock,
  Building,
  GitBranch
} from 'lucide-react';
import BasePrice from './BasePrice';
import PriceDetailsModal from './PriceDetailsModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getStandardPrice } from '../../../apis/Quotation/Price';
import { QuotationStandardPriceList } from '../../../redux/Action/Quotation/Price';
import moment from 'moment';
import SingleSelectDropdown from '../../../components/SingleSelectDropdown/SingleSelectDropdown';

// import BranchManagement from './BranchManagement'
import { useNavigate } from 'react-router-dom';
import BasePriceBranch from './BasePriceBranch';
import { SubOrgListAction } from '../../../redux/Action/SubOrgAction/SubOrgAction';
import { BranchGetAction } from '../../../redux/Action/Branch/BranchAction';

const BranchManagement = () => {
  const checkModules = useCheckEnabledModule();
  const dispatch = useDispatch();
  const { quotationPriceList } = useSelector((state) => state?.quotation);

  // Add selectors for SubOrg and Branch data
  const { designationList, loading: designationLoading } = useSelector((state) => state?.designation || {});
  const { subOrgs, loading: subOrgLoading } = useSelector((state) => state?.subOrgs || {});
  const {
    branchList,
    loading: branchLoading,
    totalRecord,
    pageNo,
    limit,
  } = useSelector((state) => state.branch);
  // Track initial load and prevent duplicate calls
  const hasInitialLoaded = useRef(false);
  const lastFetchedDate = useRef(null);
  const isLoadingRef = useRef(false);
  console.log(subOrgs, 's')

  // State Management
  const [activeTab, setActiveTab] = useState('pricing');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [basePriceDetails, setBasePriceDetails] = useState({});
  const [selectedPriceData, setSelectedPriceData] = useState(null);
  const navigate = useNavigate();

  // NEW: Add state for SubOrg and Branch selections
  const [selectedSubOrg, setSelectedSubOrg] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedDesignation, setSelectedDesignation] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [effectiveDateFilter, setEffectiveDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [sortBy, setSortBy] = useState('designationName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: '', max: '' });

  // Loading states
  const [loading, setLoading] = useState(false);

  // NEW: Load SubOrg, Branch, and Designation lists
  useEffect(() => {
    // Load SubOrg list
    // dispatch(SubOrgGetAction()); // Replace with your actual SubOrg action

    // Load Branch list
    // dispatch(BranchGetAction()); // Replace with your actual Branch action

    // Load Designation list
    // dispatch(DesignationGetAction()); // Already exists
  }, [dispatch]);
  useEffect(() => {
    console.log(selectedSubOrg, 'dsdsdsdsds')
    if (selectedSubOrg?._id) {
      getBranchList({ page: 1, limit: 10 });
    }
  }, [selectedSubOrg]);
  const getBranchList = (params) => {
    let updatedParams = {
      mapedData: "branch",
      orgLevel: true,
      ...params,
    };

    if (checkMoudles("suborganization", "r")) {
      updatedParams = { ...updatedParams, subOrgId: selectedSubOrg?._id };
    }
    dispatch(BranchGetAction(updatedParams));
  };

  // NEW: Filter branches based on selected SubOrg
  // const filteredBranchList = useMemo(() => {
  //   if (!selectedSubOrg || !branchList) return branchList || [];
  //   return branchList.filter(branch => branch.subOrgId === selectedSubOrg._id);
  // }, [selectedSubOrg, branchList]);

  // FIXED: Stable getPriceList function with proper dependency management
  const getPriceList = useCallback(async (dateToFetch, filters = {}) => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) {
      console.log('Already loading, skipping API call');
      return;
    }

    // Create cache key including filters
    const cacheKey = `${dateToFetch}-${JSON.stringify(filters)}`;
    if (lastFetchedDate.current === cacheKey) {
      console.log('Already fetched data for this date and filters, skipping API call');
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);

      console.log('Fetching price list for date and filters:', dateToFetch, filters);

      await dispatch(QuotationStandardPriceList({
        limit: 100,
        page: 1,
        date: dateToFetch,
        ...filters // Include SubOrg, Branch, Designation filters
      }));

      lastFetchedDate.current = cacheKey;
    } catch (error) {
      console.error('Error fetching price list:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [dispatch]);

  // FIXED: Initialize data - fetch only once on component mount
  useEffect(() => {
    if (!hasInitialLoaded.current) {
      hasInitialLoaded.current = true;
      const initialDate = new Date().toISOString().split('T')[0];
      setEffectiveDateFilter(initialDate);
      getPriceList(initialDate);
    }
  }, [getPriceList]);
  const checkMoudles = useCheckEnabledModule();
  useEffect(() => {
    if (checkMoudles("suborganization", "r")) {
      getSubOrgList();
    }
  }, [dispatch])
  const getSubOrgList = () => {
    const updatedParams = {};
    dispatch(SubOrgListAction(updatedParams));
  };

  // FIXED: Handle filter changes (date, SubOrg, Branch, Designation)
  useEffect(() => {
    if (!hasInitialLoaded.current) return;

    const filters = {};
    if (selectedSubOrg) filters.subOrgId = selectedSubOrg._id;
    if (selectedBranch) filters.branchId = selectedBranch._id;
    if (selectedDesignation) filters.designationId = selectedDesignation._id;

    const timeoutId = setTimeout(() => {
      getPriceList(effectiveDateFilter, filters);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [effectiveDateFilter, selectedSubOrg, selectedBranch, selectedDesignation, getPriceList]);

  // FIXED: Manual refresh function that forces a reload
  const handleRefresh = useCallback(() => {
    // Reset the last fetched date to force a reload
    lastFetchedDate.current = null;
    isLoadingRef.current = false;

    const filters = {};
    if (selectedSubOrg) filters.subOrgId = selectedSubOrg._id;
    if (selectedBranch) filters.branchId = selectedBranch._id;
    if (selectedDesignation) filters.designationId = selectedDesignation._id;

    getPriceList(effectiveDateFilter, filters);
  }, [effectiveDateFilter, selectedSubOrg, selectedBranch, selectedDesignation, getPriceList]);

  // NEW: Handle SubOrg selection change
  const handleSubOrgChange = useCallback((subOrg) => {
    setSelectedSubOrg(subOrg);
    setSelectedBranch(null); // Reset branch when SubOrg changes
  }, []);

  // Process and filter data (no changes needed here)
  const processedData = useMemo(() => {
    if (!quotationPriceList || !Array.isArray(quotationPriceList)) return [];

    let data = [];

    if (showAllHistory) {
      // Keep your existing history logic, just update the data structure access
      quotationPriceList.forEach(priceDoc => {
        const { history, _id: docId, designationId, designationName } = priceDoc;
        if (history && Array.isArray(history)) {
          history.forEach((historyEntry) => {
            data.push({
              _id: historyEntry.k,
              docId: docId,
              designationId: designationId,
              designationName: designationName,
              priceData: historyEntry.v?.priceData || historyEntry.v, // Handle nested priceData
              effectiveFrom: historyEntry.v?.effectiveFrom,
              source: historyEntry.v?.source || 'base',
              branchInfo: historyEntry.v?.branchInfo,
              isLatest: false,
              historyId: historyEntry.k
            });
          });
        }
      });
    } else {
      // Map current data structure
      data = quotationPriceList.map(priceDoc => {
        return {
          _id: priceDoc._id || priceDoc.priceId,
          docId: priceDoc._id || priceDoc.baseQuotePriceId,
          designationId: priceDoc.designationId,
          designationName: priceDoc.designationName,
          priceData: priceDoc.priceData, // Direct access to priceData
          effectiveFrom: priceDoc.effectiveFrom,
          source: priceDoc.source || 'base',
          branchInfo: priceDoc.branchInfo,
          isLatest: true,
          historyId: null
        };
      });
    }

    // Keep all your existing filters (search, price range, etc.)
    // ... existing filter code stays the same ...

    return data;
  }, [quotationPriceList, showAllHistory, searchTerm, priceRangeFilter, sortBy, sortOrder]);
  // Helper functions (no changes needed)
  const getMinMaxPrice = (priceArray) => {
    if (!priceArray || !Array.isArray(priceArray)) return { min: 0, max: 0 };

    const values = [];
    priceArray.forEach(genderObj => {
      Object.entries(genderObj).forEach(([key, val]) => {
        if (key !== 'gender' && typeof val === 'number' && val > 0) {
          values.push(val);
        }
      });
    });

    return {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
    };
  };

  // Add this new helper function:
  const getGenderValue = (priceArray, gender, field) => {
    if (!priceArray || !Array.isArray(priceArray)) return 0;
    const genderObj = priceArray.find(p => p.gender === gender);
    return genderObj?.[field] || 0;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // FIXED: Reset filters function with stable callback
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    const todayDate = new Date().toISOString().split('T')[0];
    setEffectiveDateFilter(todayDate);
    setShowAllHistory(false);
    setPriceRangeFilter({ min: '', max: '' });
    setSortBy('designationName');
    setSortOrder('asc');
    // NEW: Reset selections
    setSelectedSubOrg(null);
    setSelectedBranch(null);
    setSelectedDesignation(null);
  }, []);

  const exportData = () => {
    const csvContent = [
      ['Designation', 'SubOrg', 'Branch', 'Daily Min', 'Daily Max', 'Monthly Min', 'Monthly Max', 'Yearly Min', 'Yearly Max', 'Effective From'],
      ...processedData.map(item => {
        const daily = getMinMaxPrice(item.daily);
        const monthly = getMinMaxPrice(item.monthly);
        const yearly = getMinMaxPrice(item.yearly);
        return [
          item.designationName,
          selectedSubOrg?.name || 'All',
          selectedBranch?.name || 'All',
          daily.min,
          daily.max,
          monthly.min,
          monthly.max,
          yearly.min,
          yearly.max,
          moment(item.effectiveFrom).format('DD-MM-YYYY')
        ];
      })
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `branch-price-list-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Statistics (no changes needed)
  const stats = useMemo(() => {
    const uniqueDesignations = new Set(processedData.map(item => item.designationId)).size;
    const totalRecords = processedData.length;
    const futureRecords = processedData.filter(item =>
      new Date(item.effectiveFrom) > new Date()
    ).length;
    const recentUpdates = processedData.filter(item =>
      moment(item.modifiedAt || item.createdAt).isAfter(moment().subtract(7, 'days'))
    ).length;

    return {
      uniqueDesignations,
      totalRecords,
      futureRecords,
      recentUpdates
    };
  }, [processedData]);

  // FIXED: Date input handler to prevent unnecessary updates
  const handleDateChange = useCallback((e) => {
    const newDate = e.target.value;
    if (newDate !== effectiveDateFilter) {
      setEffectiveDateFilter(newDate);
    }
  }, [effectiveDateFilter]);

  const PricingOverviewTab = () => (
    <div className="space-y-6">
      {/* Enhanced Filter Controls with SubOrg and Branch */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters & Controls
            </h4>
            <div className="flex gap-2">
              <button
                onClick={resetFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Reset All
              </button>
              <button
                onClick={exportData}
                className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1 text-sm"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* NEW: Enhanced filters grid with SubOrg and Branch */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {/* SubOrg Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Building className="h-4 w-4 mr-1" />
                Sub Organization
              </label>
              <SingleSelectDropdown
                feildName='name'
                listData={subOrgs || []}
                inputName='Select Organization'
                hideLabel
                customLabelCss={'p-2 border border-gray-300 rounded-lg text-sm'}
                handleClick={handleSubOrgChange}
                selectedOptionDependency={'_id'}
                selectedOption={selectedSubOrg?._id}
              />
              {subOrgLoading && <span className="text-xs text-blue-600">Loading...</span>}
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <GitBranch className="h-4 w-4 mr-1" />
                Branch
              </label>
              <SingleSelectDropdown
                feildName='name'
                listData={branchList}
                inputName={'Select Branch'}
                hideLabel
                customLabelCss={'p-2 border border-gray-300 rounded-lg text-sm'}
                handleClick={(branch) => setSelectedBranch(branch)}
                selectedOptionDependency={'_id'}
                selectedOption={selectedBranch?._id}
                disabled={!selectedSubOrg}
              />
              {branchLoading && <span className="text-xs text-blue-600">Loading...</span>}
            </div>

            {/* Designation Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Designation
              </label>
              <SingleSelectDropdown
                feildName='name'
                listData={designationList || []}
                inputName='Select Designation'
                hideLabel
                customLabelCss={'p-2 border border-gray-300 rounded-lg text-sm'}
                handleClick={(designation) => setSelectedDesignation(designation)}
                selectedOptionDependency={'_id'}
                selectedOption={selectedDesignation?._id}
              />
              {designationLoading && <span className="text-xs text-blue-600">Loading...</span>}
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveDateFilter}
                onChange={handleDateChange}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Price Range (₹)
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRangeFilter.min}
                  onChange={(e) => setPriceRangeFilter(prev => ({ ...prev, min: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRangeFilter.max}
                  onChange={(e) => setPriceRangeFilter(prev => ({ ...prev, max: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                View Options
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showAllHistory}
                    onChange={(e) => setShowAllHistory(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Show all history</span>
                </label>
                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200 disabled:opacity-50 flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Status Info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border-l-4 border-blue-500">
            <div className="flex flex-wrap gap-4">
              <span>
                <strong>Showing:</strong> {processedData.length} records
              </span>
              <span>
                <strong>Date:</strong> {moment(effectiveDateFilter).format('DD MMM YYYY')}
              </span>
              {selectedSubOrg && (
                <span>
                  <strong>SubOrg:</strong> {selectedSubOrg.name}
                </span>
              )}
              {selectedBranch && (
                <span>
                  <strong>Branch:</strong> {selectedBranch.name}
                </span>
              )}
              {selectedDesignation && (
                <span>
                  <strong>Designation:</strong> {selectedDesignation.name}
                </span>
              )}
              {loading && <span className="text-blue-600">• Loading...</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Designations</p>
              <p className="text-xl font-semibold text-gray-900">{stats.uniqueDesignations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Future Prices</p>
              <p className="text-xl font-semibold text-gray-900">{stats.futureRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Recent Updates</p>
              <p className="text-xl font-semibold text-gray-900">{stats.recentUpdates}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Branch Price Management</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage pricing by Sub Organization, Branch, and Designation
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                console.log('Add Branch Price click', { selectedSubOrg, selectedBranch, selectedDesignation });
                setShowPriceModal(true);
                setBasePriceDetails({});
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            // disabled={!selectedSubOrg || !selectedBranch || !selectedDesignation}
            >
              <Plus className="h-4 w-4" />
              Add Branch Price
            </button>

            <button
              onClick={() => navigate('/quotation/priceconfigure/list')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Base Prices
            </button>
          </div>
        </div>

        {/* Selection Status */}
        {(!selectedSubOrg || !selectedBranch || !selectedDesignation) && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Please select Sub Organization, Branch, and Designation to manage branch-specific prices.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search designations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Enhanced Table - This would be similar to your original table but with branch-specific data */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Sub Organization
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Branch
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Daily Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monthly Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Yearly Price
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Effective From
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedData.map((data, i) => {
                const daily = getMinMaxPrice(data.priceData?.daily);
                const monthly = getMinMaxPrice(data.priceData?.monthly);
                const yearly = getMinMaxPrice(data.priceData?.yearly);

                const effectiveDate = new Date(data.effectiveFrom);
                const currentDate = new Date();
                const effective = new Date(effectiveDate.toDateString());
                const today = new Date(currentDate.toDateString());
                const isFuture = effective > today;
                const isPast = effective < today;
                const isCurrentlyActive = effective.getTime() === today.getTime();

                return (
                  <tr
                    key={`${data.designationId}-${data.historyId || data._id}-${i}`}
                    className={`hover:bg-gray-50 transition-colors ${isFuture ? 'bg-yellow-50' : ''}`}
                  >
                    {/* Sub Organization Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-blue-600" />
                        <div className="font-medium text-gray-900">
                          {data.branchInfo?.subOrgId ?
                            (subOrgs?.find(s => s._id === data.branchInfo.subOrgId)?.name || 'Unknown SubOrg')
                            : 'All SubOrgs'}
                        </div>
                      </div>
                    </td>

                    {/* Branch Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <GitBranch className="h-4 w-4 mr-2 text-green-600" />
                        <div className="font-medium text-gray-900">
                          {data.branchInfo?.branchId ?
                            (branchList?.find(b => b._id === data.branchInfo.branchId)?.name || 'Unknown Branch')
                            : 'All Branches'}
                        </div>
                      </div>
                    </td>

                    {/* Designation Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">
                          {data.designationName || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {data.designationId?.slice(-8)}
                        </div>
                      </div>
                    </td>

                    {/* Daily Price Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {daily.min === daily.max
                            ? formatCurrency(daily.min)
                            : `${formatCurrency(daily.min)} - ${formatCurrency(daily.max)}`
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          M: {getGenderValue(data.priceData?.daily, 'male', 'cityLimit')} |
                          F: {getGenderValue(data.priceData?.daily, 'female', 'cityLimit')}
                        </div>
                      </div>
                    </td>

                    {/* Monthly Price Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {monthly.min === monthly.max
                            ? formatCurrency(monthly.min)
                            : `${formatCurrency(monthly.min)} - ${formatCurrency(monthly.max)}`
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          M: {getGenderValue(data.priceData?.monthly, 'male', 'cityLimit')} |
                          F: {getGenderValue(data.priceData?.monthly, 'female', 'cityLimit')}
                        </div>
                      </div>
                    </td>

                    {/* Yearly Price Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {yearly.min === yearly.max
                            ? formatCurrency(yearly.min)
                            : `${formatCurrency(yearly.min)} - ${formatCurrency(yearly.max)}`
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          M: {getGenderValue(data.priceData?.yearly, 'male', 'cityLimit')} |
                          F: {getGenderValue(data.priceData?.yearly, 'female', 'cityLimit')}
                        </div>
                      </div>
                    </td>

                    {/* Effective From Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {moment(data.effectiveFrom).format('DD MMM YYYY')}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {moment(data.effectiveFrom).fromNow()}
                        </div>
                      </div>
                    </td>

                    {/* Status Column with all badges */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {data.isLatest && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Latest
                          </span>
                        )}
                        {isFuture && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Future
                          </span>
                        )}
                        {isPast && !data.isLatest && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Past
                          </span>
                        )}
                        {isCurrentlyActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Active
                          </span>
                        )}
                        {data.source === 'branch' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            Branch Price
                          </span>
                        )}
                        {data.source === 'base' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Base Price
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <Button
                          color='blue'
                          variant='outlined'
                          size="sm"
                          onClick={() => {
                            setShowPriceModal(true);
                            setBasePriceDetails({
                              ...data,
                              docId: data.docId,
                              historyId: data.historyId,
                              subOrgId: data.branchInfo?.subOrgId || selectedSubOrg?._id,
                              branchId: data.branchInfo?.branchId || selectedBranch?._id,
                              isBranchPrice: data.source === 'branch',
                              // Transform priceData back to the format your modal expects
                              daily: data.priceData?.daily ? {
                                male: data.priceData.daily.find(p => p.gender === 'male') || {},
                                female: data.priceData.daily.find(p => p.gender === 'female') || {}
                              } : {},
                              monthly: data.priceData?.monthly ? {
                                male: data.priceData.monthly.find(p => p.gender === 'male') || {},
                                female: data.priceData.monthly.find(p => p.gender === 'female') || {}
                              } : {},
                              yearly: data.priceData?.yearly ? {
                                male: data.priceData.yearly.find(p => p.gender === 'male') || {},
                                female: data.priceData.yearly.find(p => p.gender === 'female') || {}
                              } : {}
                            });
                          }}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          {data.isLatest ? 'Edit' : 'View'}
                        </Button>

                        <Button
                          color='green'
                          variant='outlined'
                          size="sm"
                          onClick={() => {
                            setSelectedPriceData({
                              ...data,
                              subOrgName: data.branchInfo?.subOrgId ?
                                (subOrgs?.find(s => s._id === data.branchInfo.subOrgId)?.name || 'Unknown')
                                : 'All',
                              branchName: data.branchInfo?.branchId ?
                                (branchList?.find(b => b._id === data.branchInfo.branchId)?.name || 'Unknown')
                                : 'All',
                              isBranchPrice: data.source === 'branch'
                            });
                            setShowDetailsModal(true);
                          }}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Details
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {processedData?.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">
                {loading ? 'Loading branch price data...' :
                  selectedSubOrg && selectedBranch && selectedDesignation
                    ? 'No branch-specific prices found for the selected criteria'
                    : 'Please select Sub Organization, Branch, and Designation to view prices'
                }
              </div>
              {!loading && searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 underline mt-2"
                >
                  Clear search
                </button>
              )}
              {selectedSubOrg && selectedBranch && selectedDesignation && !loading && (
                <button
                  onClick={() => { setShowPriceModal(true); setBasePriceDetails({}) }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mt-4 inline-flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Create Branch Price
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 p-4 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Building2 className="h-6 w-6 mr-2" />
              Branch Price Management
            </h1>
            <p className="text-gray-600 mt-1">Manage pricing structures by Sub Organization, Branch, and Designation</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => navigate('/quotation/priceconfigure/list')}
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-gray-600 hover:text-gray-900"
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Base Pricing
            </button>
            <button
              className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-white text-blue-600 shadow-sm"
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Branch Management
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <PricingOverviewTab />

      {/* Enhanced Modals with branch context */}
      <BasePriceBranch
        showPriceModal={showPriceModal}
        setShowPriceModal={setShowPriceModal}
        basePriceDetails={{
          ...basePriceDetails,
          isBranchPrice: true,
          subOrgId: selectedSubOrg?._id,
          branchId: selectedBranch?._id,
          subOrgName: selectedSubOrg?.name,
          branchName: selectedBranch?.name
        }}
        getPriceList={handleRefresh}
      />

      <PriceDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        priceData={{
          ...selectedPriceData,
          isBranchPrice: true
        }}
      />
    </div>
  );
};

export default BranchManagement;