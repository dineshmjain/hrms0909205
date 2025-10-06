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
  Home
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
  const [sourceFilter, setSourceFilter] = useState('all'); // New filter for source
  const [branchFilter, setBranchFilter] = useState('all'); // New filter for branch
  const [sortBy, setSortBy] = useState('designationName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [priceRangeFilter, setPriceRangeFilter] = useState({ min: '', max: '' });

  // Loading states
  const [loading, setLoading] = useState(false);

  // Centralized getPriceList function
  const getPriceList = useCallback(async (date = effectiveDateFilter) => {
    try {
      setLoading(true);
      await dispatch(QuotationStandardPriceList({ 
        limit: 100, 
        page: 1,
        date: moment(date).format('DD-MM-YYYY')
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
  }, []); // Empty dependency array - runs only once

  // Handle effective date filter changes with debouncing
  useEffect(() => {
    if (!hasInitialLoaded.current) return;
    
    // Skip if date hasn't actually changed
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

  // Process and filter data based on new API structure
  const processedData = useMemo(() => {
    if (!quotationPriceList || !Array.isArray(quotationPriceList)) return [];

    let data = quotationPriceList.map(item => ({
      ...item,
      // Ensure we have the correct structure
      _id: item.baseQuotePriceId || item._id,
      dailyPrices: getMinMaxFromArray(item.priceData?.daily),
      monthlyPrices: getMinMaxFromArray(item.priceData?.monthly),
      yearlyPrices: getMinMaxFromArray(item.priceData?.yearly),
    }));

    // Apply filters
    data = data.filter(item => {
      // Search filter
      if (searchTerm && !item.designationName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Source filter (base/branch)
      if (sourceFilter !== 'all' && item.source !== sourceFilter) {
        return false;
      }

      // Branch filter
      if (branchFilter !== 'all') {
        if (branchFilter === 'base' && item.source !== 'base') return false;
        if (branchFilter !== 'base' && item.branchInfo?.branchId !== branchFilter) return false;
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
  }, [quotationPriceList, searchTerm, sourceFilter, branchFilter, priceRangeFilter, sortBy, sortOrder]);

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
    setPriceRangeFilter({ min: '', max: '' });
    setSortBy('designationName');
    setSortOrder('asc');
  }, []);

  const exportData = () => {
    const csvContent = [
      ['Designation', 'Source', 'Branch ID', 'Daily Min', 'Daily Max', 'Monthly Min', 'Monthly Max', 'Yearly Min', 'Yearly Max', 'Effective From'],
      ...processedData.map(item => [
        item.designationName,
        item.source,
        item.branchInfo?.branchId || 'N/A',
        item.dailyPrices.min,
        item.dailyPrices.max,
        item.monthlyPrices.min,
        item.monthlyPrices.max,
        item.yearlyPrices.min,
        item.yearlyPrices.max,
        moment(item.effectiveFrom).format('DD-MM-YYYY')
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

    return {
      totalRecords,
      basePrices,
      branchPrices,
      uniqueDesignations,
      uniqueBranches
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              </select>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            Showing {processedData.length} prices effective as of {moment(effectiveDateFilter).format('DD MMM YYYY')}
            {sourceFilter !== 'all' && ` • Filtered by: ${sourceFilter} prices`}
            {branchFilter !== 'all' && ` • Branch: ${branchFilter}`}
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <Home className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Base Prices</p>
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
              <p className="text-sm font-medium text-gray-600">Branch Prices</p>
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
              <p className="text-sm font-medium text-gray-600">Designations</p>
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
              <p className="text-sm font-medium text-gray-600">Unique Branches</p>
              <p className="text-xl font-semibold text-gray-900">{stats.uniqueBranches}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Panel */}
     
    </div>
  );

  // Branch Management Tab Component
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
                  Effective as of: <span className="font-medium">{moment(effectiveDateFilter).format('DD MMM YYYY')}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      {/* {activeTab === 'pricing' ? <PricingOverviewTab /> : <BranchManagementTab />} */}

      {/* Modals */}
      <BasePrice 
        showPriceModal={showPriceModal} 
        setShowPriceModal={setShowPriceModal} 
        basePriceDetails={basePriceDetails} 
        getPriceList={handleRefresh}
      />

      {/* <PriceDetailsModal 
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        priceData={selectedPriceData}
      /> */}
    </div>
  );
};

export default List;