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
  GitBranch,
  Home,
  Info
} from 'lucide-react';
import BasePrice from './BasePrice';
import PriceDetailsModal from './PriceDetailsModal';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getStandardPrice } from '../../../apis/Quotation/Price';
import { QuotationStandardPriceList } from '../../../redux/Action/Quotation/Price';
import moment from 'moment';

import BranchManagement from './BranchManagement'
import { useNavigate } from 'react-router-dom';

const List = () => {
  const checkModules = useCheckEnabledModule();
  const dispatch = useDispatch();
  const { quotationPriceList } = useSelector((state) => state?.quotation);
  const navigate = useNavigate()
  
  // Track initial load to prevent duplicate calls
  const hasInitialLoaded = useRef(false);
  const lastFetchedDate = useRef(null);

  // State Management
  const [activeTab, setActiveTab] = useState('pricing');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [basePriceDetails, setBasePriceDetails] = useState({});
  const [selectedPriceData, setSelectedPriceData] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [effectiveDateFilter, setEffectiveDateFilter] = useState(new Date().toISOString().split('T')[0]);
  const [sourceFilter, setSourceFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [sortBy, setSortBy] = useState('designationName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: '', max: '' });
  const [adjustmentTypeFilter, setAdjustmentTypeFilter] = useState('all');

  // Loading states
  const [loading, setLoading] = useState(false);

  // Centralized getPriceList function
  const getPriceList = useCallback(async (date = effectiveDateFilter) => {
    try {
      setLoading(true);
      await dispatch(QuotationStandardPriceList({ 
        limit: 100, 
        page: 1,
        date: date
      }));
      lastFetchedDate.current = date;
    } catch (error) {
      console.error('Error fetching price list:', error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, effectiveDateFilter]);

  // Initialize data - fetch only once on component mount
  useEffect(() => {
    if (!hasInitialLoaded.current) {
      hasInitialLoaded.current = true;
      lastFetchedDate.current = effectiveDateFilter;
      getPriceList(effectiveDateFilter);
    }
  }, []);

  // Handle effective date filter changes with debouncing
  useEffect(() => {
    if (!hasInitialLoaded.current) return;
    
    if (lastFetchedDate.current === effectiveDateFilter) return;

    const timeoutId = setTimeout(() => {
      getPriceList(effectiveDateFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [effectiveDateFilter, getPriceList]);

  // Manual refresh function
  const handleRefresh = useCallback(() => {
    getPriceList(effectiveDateFilter);
  }, [getPriceList, effectiveDateFilter]);

  // Helper function to get price values from array structure
  const getPriceFromArray = (priceArray, gender, priceType = 'cityLimit') => {
    if (!Array.isArray(priceArray)) return 0;
    const genderData = priceArray.find(item => item.gender === gender);
    return genderData ? (genderData[priceType] || 0) : 0;
  };

  // Helper function to get min/max from array structure
  const getMinMaxFromArray = (priceArray) => {
    if (!Array.isArray(priceArray)) return { min: 0, max: 0 };
    
    let values = [];
    priceArray.forEach(item => {
      if (item.cityLimit) values.push(item.cityLimit);
      if (item.outCityLimit) values.push(item.outCityLimit);
      if (item.dayShift) values.push(item.dayShift);
      if (item.nightShift) values.push(item.nightShift);
    });
    
    return {
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
    };
  };

  // Process and filter data based on API structure
  const processedData = useMemo(() => {
    if (!quotationPriceList || !Array.isArray(quotationPriceList)) return [];

    let data = quotationPriceList.map(item => ({
      ...item,
      _id: item.baseQuotePriceId || item._id,
      dailyPrices: getMinMaxFromArray(item.priceData?.daily),
      monthlyPrices: getMinMaxFromArray(item.priceData?.monthly),
      yearlyPrices: getMinMaxFromArray(item.priceData?.yearly),
      adjustmentType: item.priceData?.adjustment?.type || 'N/A',
      adjustmentValue: item.priceData?.adjustment?.value || 0,
      historyCount: item.history?.length || 0
    }));

    // Apply filters
    data = data.filter(item => {
      // Search filter
      if (searchTerm && !item.designationName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Source filter
      if (sourceFilter !== 'all' && item.source !== sourceFilter) {
        return false;
      }

      // Branch filter
      if (branchFilter !== 'all') {
        if (branchFilter === 'base' && item.source !== 'base') return false;
        if (branchFilter !== 'base' && item.branchInfo?.branchId !== branchFilter) return false;
      }

      // Adjustment type filter
      if (adjustmentTypeFilter !== 'all' && item.adjustmentType !== adjustmentTypeFilter) {
        return false;
      }

      // Price range filter
      if (priceRangeFilter.min || priceRangeFilter.max) {
        const dailyMin = item.dailyPrices.min;
        const dailyMax = item.dailyPrices.max;

        if (priceRangeFilter.min && dailyMin < parseInt(priceRangeFilter.min)) return false;
        if (priceRangeFilter.max && dailyMax > parseInt(priceRangeFilter.max)) return false;
      }

      return true;
    });

    // Apply sorting
    data.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'designationName':
          aValue = a.designationName || '';
          bValue = b.designationName || '';
          break;
        case 'effectiveFrom':
          aValue = new Date(a.effectiveFrom);
          bValue = new Date(b.effectiveFrom);
          break;
        case 'dailyPrice':
          aValue = a.dailyPrices.min || 0;
          bValue = b.dailyPrices.min || 0;
          break;
        case 'source':
          aValue = a.source || '';
          bValue = b.source || '';
          break;
        case 'adjustmentValue':
          aValue = a.adjustmentValue || 0;
          bValue = b.adjustmentValue || 0;
          break;
        default:
          aValue = a[sortBy] || '';
          bValue = b[sortBy] || '';
      }

      if (sortOrder === 'desc') {
        return aValue < bValue ? 1 : -1;
      }
      return aValue > bValue ? 1 : -1;
    });

    return data;
  }, [quotationPriceList, searchTerm, sourceFilter, branchFilter, adjustmentTypeFilter, priceRangeFilter, sortBy, sortOrder]);

  // Get unique branches for filter dropdown
  const availableBranches = useMemo(() => {
    const branches = new Set();
    quotationPriceList?.forEach(item => {
      if (item.branchInfo?.branchId) {
        branches.add(item.branchInfo.branchId);
      }
    });
    return Array.from(branches);
  }, [quotationPriceList]);

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

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setEffectiveDateFilter(new Date().toISOString().split('T')[0]);
    setSourceFilter('all');
    setBranchFilter('all');
    setAdjustmentTypeFilter('all');
    setPriceRangeFilter({ min: '', max: '' });
    setSortBy('designationName');
    setSortOrder('asc');
  }, []);

  const exportData = () => {
    const csvContent = [
      ['Designation', 'Source', 'Adjustment Type', 'Adjustment Value', 'Daily Min', 'Daily Max', 'Monthly Min', 'Monthly Max', 'Yearly Min', 'Yearly Max', 'Effective From', 'History Count'],
      ...processedData.map(item => [
        item.designationName,
        item.source,
        item.adjustmentType,
        item.adjustmentValue,
        item.dailyPrices.min,
        item.dailyPrices.max,
        item.monthlyPrices.min,
        item.monthlyPrices.max,
        item.yearlyPrices.min,
        item.yearlyPrices.max,
        moment(item.effectiveFrom).format('DD-MM-YYYY'),
        item.historyCount
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price-list-${moment().format('YYYY-MM-DD')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Enhanced statistics calculation
  const stats = useMemo(() => {
    const totalRecords = processedData.length;
    const basePrices = processedData.filter(item => item.source === 'base').length;
    const branchPrices = processedData.filter(item => item.source === 'branch').length;
    const uniqueDesignations = new Set(processedData.map(item => item.designationId)).size;
    const uniqueBranches = new Set(
      processedData
        .filter(item => item.branchInfo?.branchId)
        .map(item => item.branchInfo.branchId)
    ).size;
    const percentageAdjustments = processedData.filter(item => item.adjustmentType === 'percentage').length;
    const fixedAdjustments = processedData.filter(item => item.adjustmentType === 'fixed').length;

    return {
      totalRecords,
      basePrices,
      branchPrices,
      uniqueDesignations,
      uniqueBranches,
      percentageAdjustments,
      fixedAdjustments
    };
  }, [processedData]);

  const PricingOverviewTab = () => (
    <div className="space-y-6">
      {/* Enhanced Filter Controls */}
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveDateFilter}
                onChange={(e) => setEffectiveDateFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Source Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Source
              </label>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="base">Base Prices</option>
                <option value="branch">Branch Prices</option>
              </select>
            </div>

            {/* Branch Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Branch
              </label>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Branches</option>
                <option value="base">Base Only</option>
                {availableBranches.map(branchId => (
                  <option key={branchId} value={branchId}>
                    Branch: {branchId.slice(-6)}
                  </option>
                ))}
              </select>
            </div>

            {/* Adjustment Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adjustment Type
              </label>
              <select
                value={adjustmentTypeFilter}
                onChange={(e) => setAdjustmentTypeFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
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

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="designationName">Designation Name</option>
                <option value="effectiveFrom">Effective Date</option>
                <option value="dailyPrice">Daily Price</option>
                <option value="source">Source Type</option>
                <option value="adjustmentValue">Adjustment Value</option>
              </select>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Showing {processedData.length} prices effective as of {moment(effectiveDateFilter).format('DD MMM YYYY')}
            {sourceFilter !== 'all' && ` • Filtered by: ${sourceFilter} prices`}
            {branchFilter !== 'all' && ` • Branch: ${branchFilter}`}
            {adjustmentTypeFilter !== 'all' && ` • Adjustment: ${adjustmentTypeFilter}`}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl font-semibold text-gray-900">{stats.totalRecords}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Home className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Base</p>
              <p className="text-xl font-semibold text-gray-900">{stats.basePrices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <GitBranch className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Branch</p>
              <p className="text-xl font-semibold text-gray-900">{stats.branchPrices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Users className="h-5 w-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Roles</p>
              <p className="text-xl font-semibold text-gray-900">{stats.uniqueDesignations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Building2 className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Branches</p>
              <p className="text-xl font-semibold text-gray-900">{stats.uniqueBranches}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-pink-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-pink-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">% Adj</p>
              <p className="text-xl font-semibold text-gray-900">{stats.percentageAdjustments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Info className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Fixed Adj</p>
              <p className="text-xl font-semibold text-gray-900">{stats.fixedAdjustments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Price Management</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {setShowPriceModal(true); setBasePriceDetails({})}}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Prices
            </button>
            <button
              onClick={() => navigate('/quotation/priceconfigure/branchPrice')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Branch Settings
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

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

        {/* Enhanced Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('designationName')}
                >
                  Designation {sortBy === 'designationName' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('source')}
                >
                  Source {sortBy === 'source' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Adjustment
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('dailyPrice')}
                >
                  Daily Rate {sortBy === 'dailyPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Monthly Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Yearly Rate
                </th>
                <th 
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('effectiveFrom')}
                >
                  Effective Date {sortBy === 'effectiveFrom' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {processedData.map((data, i) => {
                const effectiveDate = new Date(data.effectiveFrom);
                const currentDate = new Date();
                const effective = new Date(effectiveDate.toDateString());
                const today = new Date(currentDate.toDateString());

                const isFuture = effective > today;
                const isCurrentlyActive = effective.getTime() === today.getTime();

                return (
                  <tr
                    key={`${data.designationId}-${data.priceId}-${i}`}
                    className={`hover:bg-gray-50 transition-colors ${
                      isFuture ? 'bg-yellow-50' : ''
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <div className="font-medium text-gray-900">
                          {data?.designationName || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {data.designationId?.slice(-6)}
                        </div>
                        {data.historyCount > 0 && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 mt-1">
                            <History className="h-3 w-3" />
                            {data.historyCount} versions
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        data.source === 'base' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {data.source === 'base' ? (
                          <>
                            <Home className="h-3 w-3 mr-1" />
                            Base
                          </>
                        ) : (
                          <>
                            <GitBranch className="h-3 w-3 mr-1" />
                            Branch
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          data.adjustmentType === 'percentage'
                            ? 'bg-green-100 text-green-800'
                            : data.adjustmentType === 'fixed'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {data.adjustmentType === 'percentage' && `${data.adjustmentValue}%`}
                          {data.adjustmentType === 'fixed' && `₹${data.adjustmentValue}`}
                          {data.adjustmentType === 'N/A' && 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {data.dailyPrices.min === data.dailyPrices.max 
                            ? formatCurrency(data.dailyPrices.min) 
                            : `${formatCurrency(data.dailyPrices.min)} - ${formatCurrency(data.dailyPrices.max)}`
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          M: {getPriceFromArray(data.priceData?.daily, 'male', 'cityLimit')} | 
                          F: {getPriceFromArray(data.priceData?.daily, 'female', 'cityLimit')}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {data.monthlyPrices.min === data.monthlyPrices.max 
                            ? formatCurrency(data.monthlyPrices.min) 
                            : `${formatCurrency(data.monthlyPrices.min)} - ${formatCurrency(data.monthlyPrices.max)}`
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          M: {getPriceFromArray(data.priceData?.monthly, 'male', 'cityLimit')} | 
                          F: {getPriceFromArray(data.priceData?.monthly, 'female', 'cityLimit')}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {data.yearlyPrices.min === data.yearlyPrices.max 
                            ? formatCurrency(data.yearlyPrices.min) 
                            : `${formatCurrency(data.yearlyPrices.min)} - ${formatCurrency(data.yearlyPrices.max)}`
                          }
                        </div>
                        <div className="text-gray-500 text-xs">
                          M: {getPriceFromArray(data.priceData?.yearly, 'male', 'cityLimit')} | 
                          F: {getPriceFromArray(data.priceData?.yearly, 'female', 'cityLimit')}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {moment(data?.effectiveFrom).format('DD MMM YYYY')}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {moment(data?.effectiveFrom).fromNow()}
                        </div>
                        {isCurrentlyActive && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                            Active
                          </span>
                        )}
                        {isFuture && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 mt-1">
                            Future
                          </span>
                        )}
                      </div>
                    </td>
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
                              docId: data.baseQuotePriceId,
                              historyId: data.priceId
                            });
                          }}
                          className="flex items-center gap-1"
                        >
                          <Edit className="h-3 w-3" />
                          Edit
                        </Button>
                        
                        <Button 
                          color='green' 
                          variant='outlined' 
                          size="sm"
                          onClick={() => {
                            setSelectedPriceData(data);
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
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-500">
                {loading ? 'Loading price data...' : 'No price data found'}
              </div>
              {!loading && searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-800 underline mt-2"
                >
                  Clear search
                </button>
              )}
              {!loading && (sourceFilter !== 'all' || branchFilter !== 'all' || adjustmentTypeFilter !== 'all') && (
                <button
                  onClick={resetFilters}
                  className="text-blue-600 hover:text-blue-800 underline mt-2 ml-4"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Enhanced Price Breakdown Summary */}
        {processedData.length > 0 && (
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900">Price Summary</h4>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-100 rounded border border-blue-300"></div>
                  <span>Base: {stats.basePrices}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-purple-100 rounded border border-purple-300"></div>
                  <span>Branch: {stats.branchPrices}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-600">Daily Price Range</div>
                <div className="text-gray-900">
                  ₹{Math.min(...processedData.map(item => item.dailyPrices.min))} - 
                  ₹{Math.max(...processedData.map(item => item.dailyPrices.max))}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Monthly Price Range</div>
                <div className="text-gray-900">
                  ₹{Math.min(...processedData.map(item => item.monthlyPrices.min))} - 
                  ₹{Math.max(...processedData.map(item => item.monthlyPrices.max))}
                </div>
              </div>
              <div>
                <div className="font-medium text-gray-600">Yearly Price Range</div>
                <div className="text-gray-900">
                  ₹{Math.min(...processedData.map(item => item.yearlyPrices.min))} - 
                  ₹{Math.max(...processedData.map(item => item.yearlyPrices.max))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const BranchManagementTab = () => (
    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
      <BranchManagement
        quotationPriceList={quotationPriceList}
        onRefresh={handleRefresh}
        loading={loading}
      />
    </div>
  );
  
  return (
    <div className="flex flex-col gap-6 p-4 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Price Management</h1>
            <p className="text-gray-600 mt-1">Manage pricing structures and adjustments across organization and branches</p>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'pricing'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Pricing Overview
            </button>
            <button
              onClick={() => navigate('/quotation/priceconfigure/branchprice')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'branches'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Branch Management
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Alert */}
      {quotationPriceList && quotationPriceList.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Price Data Summary
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Showing {stats.totalRecords} total price records: 
                  <span className="font-medium"> {stats.basePrices} base prices</span> and 
                  <span className="font-medium"> {stats.branchPrices} branch-specific prices</span> 
                  across {stats.uniqueDesignations} designations and {stats.uniqueBranches} branches.
                </p>
                <p className="mt-1">
                  Adjustments: <span className="font-medium">{stats.percentageAdjustments} percentage</span>, 
                  <span className="font-medium"> {stats.fixedAdjustments} fixed</span>
                </p>
                <p className="mt-1">
                  Effective as of: <span className="font-medium">{moment(effectiveDateFilter).format('DD MMM YYYY')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {activeTab === 'pricing' ? <PricingOverviewTab /> : <BranchManagementTab />}

      {/* Modals */}
      <BasePrice 
        showPriceModal={showPriceModal} 
        setShowPriceModal={setShowPriceModal} 
        basePriceDetails={basePriceDetails} 
        getPriceList={handleRefresh}
      />

      <PriceDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        priceData={selectedPriceData}
      />
    </div>
  );
};

export default List;