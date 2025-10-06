import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  TrendingUp, 
  Users, 
  MapPin, 
  Sun, 
  Moon, 
  Home,
  GitBranch,
  Info,
  History,
  DollarSign,
  Building2,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';
import moment from 'moment';

const PriceDetailsModal = ({ isOpen, onClose, priceData }) => {
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);

  if (!isOpen || !priceData) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getPriceRow = (data, gender) => {
    const genderData = data?.find(item => item.gender === gender);
    return genderData || {
      cityLimit: 0,
      outCityLimit: 0,
      dayShift: 0,
      nightShift: 0,
      outCityDayShift: 0,
      outCityNightShift: 0
    };
  };

  const renderCompactPriceTable = (data, period) => {
    const maleData = getPriceRow(data, 'male');
    const femaleData = getPriceRow(data, 'female');

    return (
      <div className="bg-gray-50 rounded border border-gray-200 p-3 mb-2">
        <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase">{period}</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">Male - City:</span>
            <span className="ml-1 font-medium text-gray-900">{formatCurrency(maleData.cityLimit)}</span>
          </div>
          <div>
            <span className="text-gray-500">Female - City:</span>
            <span className="ml-1 font-medium text-gray-900">{formatCurrency(femaleData.cityLimit)}</span>
          </div>
          <div>
            <span className="text-gray-500">Male - Out City:</span>
            <span className="ml-1 font-medium text-gray-900">{formatCurrency(maleData.outCityLimit)}</span>
          </div>
          <div>
            <span className="text-gray-500">Female - Out City:</span>
            <span className="ml-1 font-medium text-gray-900">{formatCurrency(femaleData.outCityLimit)}</span>
          </div>
          <div>
            <span className="text-gray-500">Day Shift:</span>
            <span className="ml-1 font-medium text-gray-900">
              {formatCurrency(maleData.dayShift)} / {formatCurrency(femaleData.dayShift)}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Night Shift:</span>
            <span className="ml-1 font-medium text-gray-900">
              {formatCurrency(maleData.nightShift)} / {formatCurrency(femaleData.nightShift)}
            </span>
          </div>
          {(maleData.outCityDayShift || femaleData.outCityDayShift) && (
            <>
              <div>
                <span className="text-gray-500">Out City Day:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {formatCurrency(maleData.outCityDayShift || 0)} / {formatCurrency(femaleData.outCityDayShift || 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Out City Night:</span>
                <span className="ml-1 font-medium text-gray-900">
                  {formatCurrency(maleData.outCityNightShift || 0)} / {formatCurrency(femaleData.outCityNightShift || 0)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderDetailedPriceTable = (data, period, icon) => {
    const maleData = getPriceRow(data, 'male');
    const femaleData = getPriceRow(data, 'female');

    return (
      <div className="bg-white rounded border border-gray-300 overflow-hidden mb-3">
        <div className="bg-gray-100 px-3 py-2 flex items-center gap-2">
          {icon}
          <h5 className="text-sm font-semibold text-gray-800">{period}</h5>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Gender</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">City Limit</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Out City</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Day Shift</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600">Night Shift</th>
                {(maleData.outCityDayShift || femaleData.outCityDayShift) && (
                  <>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Out City Day</th>
                    <th className="px-3 py-2 text-left font-medium text-gray-600">Out City Night</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-blue-50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-600" />
                    <span className="font-medium text-gray-900">Male</span>
                  </div>
                </td>
                <td className="px-3 py-2 font-semibold text-gray-900">{formatCurrency(maleData.cityLimit)}</td>
                <td className="px-3 py-2 text-gray-900">{formatCurrency(maleData.outCityLimit)}</td>
                <td className="px-3 py-2 text-gray-900">{formatCurrency(maleData.dayShift)}</td>
                <td className="px-3 py-2 text-gray-900">{formatCurrency(maleData.nightShift)}</td>
                {(maleData.outCityDayShift || femaleData.outCityDayShift) && (
                  <>
                    <td className="px-3 py-2 text-gray-900">{formatCurrency(maleData.outCityDayShift || 0)}</td>
                    <td className="px-3 py-2 text-gray-900">{formatCurrency(maleData.outCityNightShift || 0)}</td>
                  </>
                )}
              </tr>
              <tr className="bg-pink-50">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-pink-600" />
                    <span className="font-medium text-gray-900">Female</span>
                  </div>
                </td>
                <td className="px-3 py-2 font-semibold text-gray-900">{formatCurrency(femaleData.cityLimit)}</td>
                <td className="px-3 py-2 text-gray-900">{formatCurrency(femaleData.outCityLimit)}</td>
                <td className="px-3 py-2 text-gray-900">{formatCurrency(femaleData.dayShift)}</td>
                <td className="px-3 py-2 text-gray-900">{formatCurrency(femaleData.nightShift)}</td>
                {(maleData.outCityDayShift || femaleData.outCityDayShift) && (
                  <>
                    <td className="px-3 py-2 text-gray-900">{formatCurrency(femaleData.outCityDayShift || 0)}</td>
                    <td className="px-3 py-2 text-gray-900">{formatCurrency(femaleData.outCityNightShift || 0)}</td>
                  </>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPriceSection = (title, data, icon) => {
    const maleData = getPriceRow(data, 'male');
    const femaleData = getPriceRow(data, 'female');

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">City Limit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Out City</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Day Shift</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Night Shift</th>
                {(maleData.outCityDayShift || femaleData.outCityDayShift) && (
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Out City Day</th>
                )}
                {(maleData.outCityNightShift || femaleData.outCityNightShift) && (
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Out City Night</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-blue-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Male</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatCurrency(maleData.cityLimit)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(maleData.outCityLimit)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(maleData.dayShift)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(maleData.nightShift)}
                </td>
                {(maleData.outCityDayShift || femaleData.outCityDayShift) && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(maleData.outCityDayShift || 0)}
                  </td>
                )}
                {(maleData.outCityNightShift || femaleData.outCityNightShift) && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(maleData.outCityNightShift || 0)}
                  </td>
                )}
              </tr>
              <tr className="hover:bg-pink-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-pink-600 mr-2" />
                    <span className="text-sm font-medium text-gray-900">Female</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {formatCurrency(femaleData.cityLimit)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(femaleData.outCityLimit)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(femaleData.dayShift)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(femaleData.nightShift)}
                </td>
                {(maleData.outCityDayShift || femaleData.outCityDayShift) && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(femaleData.outCityDayShift || 0)}
                  </td>
                )}
                {(maleData.outCityNightShift || femaleData.outCityNightShift) && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(femaleData.outCityNightShift || 0)}
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderHistorySection = () => {
    if (!priceData.history || priceData.history.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
          <History className="h-12 w-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No price history available</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
          <span className="ml-auto text-sm text-gray-500">
            {priceData.history.length} version(s)
          </span>
        </div>
        
        <div className="space-y-3">
          {priceData.history.map((record, index) => {
            const isActive = record._id === priceData.priceId;
            const isExpanded = expandedHistoryId === record._id;
            
            return (
              <div 
                key={record._id} 
                className={`border rounded-lg overflow-hidden ${
                  isActive 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 bg-white'
                }`}
              >
                {/* Collapsed View */}
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-700 bg-gray-200 px-2 py-1 rounded">
                        Version {priceData.history.length - index}
                      </span>
                      {isActive && (
                        <span className="px-2 py-1 text-xs font-medium bg-green-600 text-white rounded">
                          Current Active
                        </span>
                      )}
                      {!isActive && index === 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-gray-400 text-white rounded">
                          Previous
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setExpandedHistoryId(isExpanded ? null : record._id)}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          View Details
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Summary Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-2">
                    <div className="bg-blue-50 rounded p-2">
                      <span className="text-gray-600 block mb-1">Effective Date</span>
                      <span className="font-semibold text-gray-900">
                        {moment(record.effectiveFrom).format('DD MMM YYYY')}
                      </span>
                    </div>
                    <div className="bg-orange-50 rounded p-2">
                      <span className="text-gray-600 block mb-1">Adjustment</span>
                      <span className="font-semibold text-gray-900">
                        {record.adjustment?.type === 'percentage' 
                          ? `${record.adjustment.value}% (${record.adjustment.type})` 
                          : `₹${record.adjustment.value} (${record.adjustment.type})`}
                      </span>
                    </div>
                    <div className="bg-green-50 rounded p-2">
                      <span className="text-gray-600 block mb-1">Created On</span>
                      <span className="font-semibold text-gray-900">
                        {moment(record.createdAt).format('DD MMM YYYY')}
                      </span>
                    </div>
                    <div className="bg-purple-50 rounded p-2">
                      <span className="text-gray-600 block mb-1">Record ID</span>
                      <span className="font-mono text-xs font-semibold text-gray-900">
                        {record._id.slice(-8)}
                      </span>
                    </div>
                  </div>

                  {/* Quick Price Preview */}
                  <div className="bg-gray-50 rounded p-2 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <span className="text-gray-600">Daily (M/F):</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatCurrency(record.daily?.[0]?.cityLimit || 0)} / 
                          {formatCurrency(record.daily?.[1]?.cityLimit || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Monthly (M/F):</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatCurrency(record.monthly?.[0]?.cityLimit || 0)} / 
                          {formatCurrency(record.monthly?.[1]?.cityLimit || 0)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Yearly (M/F):</span>
                        <span className="ml-1 font-medium text-gray-900">
                          {formatCurrency(record.yearly?.[0]?.cityLimit || 0)} / 
                          {formatCurrency(record.yearly?.[1]?.cityLimit || 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded View */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Complete Pricing Details</h4>
                    
                    {/* Daily Pricing */}
                    {record.daily && renderDetailedPriceTable(
                      record.daily,
                      'Daily Pricing',
                      <Sun className="h-4 w-4 text-yellow-600" />
                    )}

                    {/* Monthly Pricing */}
                    {record.monthly && renderDetailedPriceTable(
                      record.monthly,
                      'Monthly Pricing',
                      <Calendar className="h-4 w-4 text-blue-600" />
                    )}

                    {/* Yearly Pricing */}
                    {record.yearly && renderDetailedPriceTable(
                      record.yearly,
                      'Yearly Pricing',
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    )}

                    {/* Metadata */}
                    <div className="mt-3 bg-white rounded border border-gray-200 p-3">
                      <h5 className="text-xs font-semibold text-gray-700 mb-2">Additional Information</h5>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Created By:</span>
                          <span className="ml-1 font-mono text-gray-900">{record.createdBy?.slice(-8)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className={`ml-1 font-medium ${record.isActive ? 'text-green-600' : 'text-red-600'}`}>
                            {record.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Created At:</span>
                          <span className="ml-1 text-gray-900">
                            {moment(record.createdAt).format('DD MMM YYYY, HH:mm:ss')}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Effective From:</span>
                          <span className="ml-1 text-gray-900">
                            {moment(record.effectiveFrom).format('DD MMM YYYY')} ({moment(record.effectiveFrom).fromNow()})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {priceData.designationName}
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  Detailed Pricing Information
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-blue-800 rounded-lg p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Meta Information */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  {priceData.source === 'base' ? (
                    <Home className="h-5 w-5 text-blue-600" />
                  ) : (
                    <GitBranch className="h-5 w-5 text-purple-600" />
                  )}
                  <span className="text-xs font-medium text-gray-600">Source</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 capitalize">
                  {priceData.source}
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  <span className="text-xs font-medium text-gray-600">Effective Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {moment(priceData.effectiveFrom).format('DD MMM YYYY')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {moment(priceData.effectiveFrom).fromNow()}
                </p>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span className="text-xs font-medium text-gray-600">Adjustment</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {priceData.adjustmentType === 'percentage' 
                    ? `${priceData.adjustmentValue}%` 
                    : priceData.adjustmentType === 'fixed'
                    ? `₹${priceData.adjustmentValue}`
                    : 'N/A'}
                </p>
                <p className="text-xs text-gray-500 mt-1 capitalize">
                  {priceData.adjustmentType} adjustment
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-5 w-5 text-purple-600" />
                  <span className="text-xs font-medium text-gray-600">Record ID</span>
                </div>
                <p className="text-sm font-mono font-semibold text-gray-900">
                  {priceData.designationId?.slice(-8)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {priceData.historyCount} version(s)
                </p>
              </div>
            </div>

            {/* Branch Information (if applicable) */}
            {priceData.branchInfo && (
              <div className="bg-purple-50 rounded-lg border border-purple-200 p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Branch Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {priceData.branchInfo.subOrgId && (
                    <div>
                      <span className="text-xs text-gray-600">Sub Organization ID:</span>
                      <p className="text-sm font-mono font-medium text-gray-900">
                        {priceData.branchInfo.subOrgId}
                      </p>
                    </div>
                  )}
                  {priceData.branchInfo.branchId && (
                    <div>
                      <span className="text-xs text-gray-600">Branch ID:</span>
                      <p className="text-sm font-mono font-medium text-gray-900">
                        {priceData.branchInfo.branchId}
                      </p>
                    </div>
                  )}
                  {priceData.branchInfo.departmentId && (
                    <div>
                      <span className="text-xs text-gray-600">Department ID:</span>
                      <p className="text-sm font-mono font-medium text-gray-900">
                        {priceData.branchInfo.departmentId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Current Pricing Sections */}
            <div className="space-y-6">
              <div className="border-t-4 border-blue-500 pt-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Active Pricing</h2>
                
                {/* Daily Pricing */}
                {priceData.priceData?.daily && renderPriceSection(
                  'Daily Pricing',
                  priceData.priceData.daily,
                  <Sun className="h-5 w-5 text-yellow-600" />
                )}

                {/* Monthly Pricing */}
                {priceData.priceData?.monthly && renderPriceSection(
                  'Monthly Pricing',
                  priceData.priceData.monthly,
                  <Calendar className="h-5 w-5 text-blue-600" />
                )}

                {/* Yearly Pricing */}
                {priceData.priceData?.yearly && renderPriceSection(
                  'Yearly Pricing',
                  priceData.priceData.yearly,
                  <TrendingUp className="h-5 w-5 text-green-600" />
                )}
              </div>

              {/* Price History */}
              <div className="border-t-4 border-purple-500 pt-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Historical Versions</h2>
                {renderHistorySection()}
              </div>
            </div>

            {/* Price Comparison Summary */}
            <div className="mt-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Price Range Summary (Current)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Daily Range</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(priceData.dailyPrices?.min)} - {formatCurrency(priceData.dailyPrices?.max)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Monthly Range</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(priceData.monthlyPrices?.min)} - {formatCurrency(priceData.monthlyPrices?.max)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Yearly Range</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(priceData.yearlyPrices?.min)} - {formatCurrency(priceData.yearlyPrices?.max)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Created: {moment(priceData.createdAt).format('DD MMM YYYY, HH:mm')}
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceDetailsModal;