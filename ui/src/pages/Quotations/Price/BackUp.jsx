import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Users, 
  MapPin, 
  Clock, 
  DollarSign, 
  Plus, 
  Edit3, 
  Save, 
  X, 
  History, 
  Building2,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Calculator
} from 'lucide-react';

const List = () => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [designationOptions, setDesignationOptions] = useState({});
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);

  // Designation options for each category
  useEffect(() => {
    setDesignationOptions({
      securityGuards: ['Basic', 'Trained', 'Armed', 'Ex-Serviceman'],
      supervisors: ['Basic', 'Experienced', 'Certified'],
      housekeeping: ['Basic', 'Skilled'],
      facilityManagement: ['Basic', 'Technical']
    });
  }, []);

  // Base pricing structure with daily, monthly, and yearly rates
  const [basePricing, setBasePricing] = useState({
    securityGuards: {
      male: {
        cityLimit: {
          basic: { 
            day: 500, 
            night: 567, 
            rotating: 533,
            monthly: 15000,
            yearly: 180000
          },
          trained: { 
            day: 600, 
            night: 667, 
            rotating: 633,
            monthly: 18000,
            yearly: 216000
          },
          armed: { 
            day: 733, 
            night: 833, 
            rotating: 783,
            monthly: 21990,
            yearly: 267545
          },
          exServiceman: { 
            day: 833, 
            night: 933, 
            rotating: 883,
            monthly: 24990,
            yearly: 304045
          }
        },
        outOfCity: {
          basic: { 
            day: 567, 
            night: 633, 
            rotating: 600,
            monthly: 17010,
            yearly: 206955
          },
          trained: { 
            day: 667, 
            night: 733, 
            rotating: 700,
            monthly: 20010,
            yearly: 243455
          },
          armed: { 
            day: 800, 
            night: 900, 
            rotating: 850,
            monthly: 24000,
            yearly: 292000
          },
          exServiceman: { 
            day: 900, 
            night: 1000, 
            rotating: 950,
            monthly: 27000,
            yearly: 328500
          }
        }
      },
      female: {
        cityLimit: {
          basic: { 
            day: 533, 
            night: 600, 
            rotating: 567,
            monthly: 15990,
            yearly: 194545
          },
          trained: { 
            day: 633, 
            night: 700, 
            rotating: 667,
            monthly: 18990,
            yearly: 231045
          }
        },
        outOfCity: {
          basic: { 
            day: 600, 
            night: 667, 
            rotating: 633,
            monthly: 18000,
            yearly: 219000
          },
          trained: { 
            day: 700, 
            night: 767, 
            rotating: 733,
            monthly: 21000,
            yearly: 255500
          }
        }
      }
    },
    supervisors: {
      male: {
        cityLimit: {
          basic: { 
            day: 733, 
            night: 833, 
            rotating: 783,
            monthly: 21990,
            yearly: 267545
          },
          experienced: { 
            day: 933, 
            night: 1033, 
            rotating: 983,
            monthly: 27990,
            yearly: 340545
          },
          certified: { 
            day: 1067, 
            night: 1167, 
            rotating: 1117,
            monthly: 32010,
            yearly: 389455
          }
        },
        outOfCity: {
          basic: { 
            day: 833, 
            night: 933, 
            rotating: 883,
            monthly: 24990,
            yearly: 304045
          },
          experienced: { 
            day: 1033, 
            night: 1133, 
            rotating: 1083,
            monthly: 30990,
            yearly: 377045
          },
          certified: { 
            day: 1167, 
            night: 1267, 
            rotating: 1217,
            monthly: 35010,
            yearly: 425955
          }
        }
      },
      female: {
        cityLimit: {
          basic: { 
            day: 767, 
            night: 867, 
            rotating: 817,
            monthly: 23010,
            yearly: 279955
          },
          experienced: { 
            day: 967, 
            night: 1067, 
            rotating: 1017,
            monthly: 29010,
            yearly: 352955
          }
        },
        outOfCity: {
          basic: { 
            day: 867, 
            night: 967, 
            rotating: 917,
            monthly: 26010,
            yearly: 316455
          },
          experienced: { 
            day: 1067, 
            night: 1167, 
            rotating: 1117,
            monthly: 32010,
            yearly: 389455
          }
        }
      }
    },
    housekeeping: {
      male: {
        cityLimit: {
          basic: { 
            day: 400, 
            night: 467, 
            rotating: 433,
            monthly: 12000,
            yearly: 146000
          },
          skilled: { 
            day: 500, 
            night: 567, 
            rotating: 533,
            monthly: 15000,
            yearly: 182500
          }
        },
        outOfCity: {
          basic: { 
            day: 467, 
            night: 533, 
            rotating: 500,
            monthly: 14010,
            yearly: 170455
          },
          skilled: { 
            day: 567, 
            night: 633, 
            rotating: 600,
            monthly: 17010,
            yearly: 206955
          }
        }
      },
      female: {
        cityLimit: {
          basic: { 
            day: 417, 
            night: 483, 
            rotating: 450,
            monthly: 12510,
            yearly: 152205
          },
          skilled: { 
            day: 517, 
            night: 583, 
            rotating: 550,
            monthly: 15510,
            yearly: 188705
          }
        },
        outOfCity: {
          basic: { 
            day: 483, 
            night: 550, 
            rotating: 517,
            monthly: 14490,
            yearly: 176295
          },
          skilled: { 
            day: 583, 
            night: 650, 
            rotating: 617,
            monthly: 17490,
            yearly: 212795
          }
        }
      }
    },
    facilityManagement: {
      male: {
        cityLimit: {
          basic: { 
            day: 600, 
            night: 667, 
            rotating: 633,
            monthly: 18000,
            yearly: 219000
          },
          technical: { 
            day: 733, 
            night: 800, 
            rotating: 767,
            monthly: 21990,
            yearly: 267545
          }
        },
        outOfCity: {
          basic: { 
            day: 667, 
            night: 733, 
            rotating: 700,
            monthly: 20010,
            yearly: 243455
          },
          technical: { 
            day: 800, 
            night: 867, 
            rotating: 833,
            monthly: 24000,
            yearly: 292000
          }
        }
      },
      female: {
        cityLimit: {
          basic: { 
            day: 617, 
            night: 683, 
            rotating: 650,
            monthly: 18510,
            yearly: 225205
          },
          technical: { 
            day: 750, 
            night: 817, 
            rotating: 783,
            monthly: 22500,
            yearly: 273750
          }
        },
        outOfCity: {
          basic: { 
            day: 683, 
            night: 750, 
            rotating: 717,
            monthly: 20490,
            yearly: 249295
          },
          technical: { 
            day: 817, 
            night: 883, 
            rotating: 850,
            monthly: 24510,
            yearly: 298205
          }
        }
      }
    }
  });

  // Calculate monthly and yearly rates from daily rate
  const calculateDerivedRates = (dayRate) => {
    return {
      monthly: Math.round(dayRate * 30),
      yearly: Math.round(dayRate * 365)
    };
  };

  // Branches data
  const [branches, setBranches] = useState([
    { 
      id: 'BR001', 
      name: 'Mumbai Central', 
      location: 'Mumbai, Maharashtra',
      status: 'active',
      adjustments: [],
      lastUpdated: '2024-09-15'
    },
    { 
      id: 'BR002', 
      name: 'Delhi NCR', 
      location: 'Gurgaon, Haryana',
      status: 'active',
      adjustments: [
        {
          id: 'ADJ001',
          category: 'securityGuards',
          adjustmentType: 'percentage',
          value: 10,
          effectiveDate: '2024-09-01',
          createdBy: 'Admin',
          reason: 'Market rate adjustment'
        }
      ],
      lastUpdated: '2024-09-10'
    },
    { 
      id: 'BR003', 
      name: 'Bangalore Tech Hub', 
      location: 'Bangalore, Karnataka',
      status: 'active',
      adjustments: [],
      lastUpdated: '2024-09-12'
    },
    { 
      id: 'BR004', 
      name: 'Chennai Operations', 
      location: 'Chennai, Tamil Nadu',
      status: 'active',
      adjustments: [
        {
          id: 'ADJ002',
          category: 'housekeeping',
          adjustmentType: 'fixed',
          value: -50,
          effectiveDate: '2024-08-15',
          createdBy: 'Admin',
          reason: 'Regional cost optimization'
        }
      ],
      lastUpdated: '2024-09-08'
    }
  ]);

  // Price history
  const [priceHistory, setPriceHistory] = useState([
    {
      id: 'HIST001',
      branch: 'Delhi NCR',
      category: 'Security Guards',
      changeType: 'Percentage Increase',
      value: '+10%',
      effectiveDate: '2024-09-01',
      createdBy: 'John Admin',
      reason: 'Market rate adjustment',
      timestamp: '2024-09-01 14:30:00'
    },
    {
      id: 'HIST002',
      branch: 'Chennai Operations',
      category: 'Housekeeping',
      changeType: 'Fixed Decrease',
      value: '-₹50',
      effectiveDate: '2024-08-15',
      createdBy: 'Sarah Manager',
      reason: 'Regional cost optimization',
      timestamp: '2024-08-15 10:15:00'
    },
    {
      id: 'HIST003',
      branch: 'Mumbai Central',
      category: 'All Categories',
      changeType: 'Base Price Update',
      value: 'Multiple',
      effectiveDate: '2024-08-01',
      createdBy: 'Admin System',
      reason: 'Annual price revision',
      timestamp: '2024-08-01 09:00:00'
    }
  ]);

  // Calculate effective price with adjustments
  const getEffectivePrice = (basePrice, branchAdjustments, category) => {
    if (!branchAdjustments || branchAdjustments.length === 0) return basePrice;
    
    const applicableAdjustment = branchAdjustments.find(adj => 
      adj.category === category || adj.category === 'all'
    );
    
    if (!applicableAdjustment) return basePrice;
    
    if (applicableAdjustment.adjustmentType === 'percentage') {
      return Math.round(basePrice * (1 + applicableAdjustment.value / 100));
    } else {
      return Math.max(0, basePrice + applicableAdjustment.value);
    }
  };

  // Format category name
  const formatCategoryName = (category) => {
    return category
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Pricing Overview Tab
  const PricingOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
    

      {/* Control Panel */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Price Management</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowPriceModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Price
            </button>
            <button
              onClick={() => setShowAdjustmentModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Branch Adjustments
            </button>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              View History
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by category, designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Branches</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="securityGuards">Security Guards</option>
            <option value="supervisors">Supervisors</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="facilityManagement">Facility Management</option>
          </select>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yearly Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(basePricing).map(([category, categoryData]) => 
                Object.entries(categoryData).map(([gender, genderData]) =>
                  Object.entries(genderData).map(([location, locationData]) =>
                    Object.entries(locationData).map(([designation, rates]) => {
                      const branchData = selectedBranch === 'all' ? null : branches.find(b => b.id === selectedBranch);
                      const effectiveDayRate = getEffectivePrice(rates.day, branchData?.adjustments, category);
                      const effectiveMonthlyRate = getEffectivePrice(rates.monthly, branchData?.adjustments, category);
                      const effectiveYearlyRate = getEffectivePrice(rates.yearly, branchData?.adjustments, category);
                      
                      // Filter logic
                      if (filterCategory !== 'all' && category !== filterCategory) return null;
                      if (searchTerm && !formatCategoryName(category).toLowerCase().includes(searchTerm.toLowerCase()) &&
                          !designation.toLowerCase().includes(searchTerm.toLowerCase())) return null;

                      return (
                        <tr key={`${category}-${gender}-${location}-${designation}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {formatCategoryName(category)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 capitalize">{gender}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {location === 'cityLimit' ? 'In City' : 'Out of City'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500 capitalize">{designation}</td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ₹{effectiveDayRate}
                            {effectiveDayRate !== rates.day && (
                              <span className="text-xs text-gray-400 block">Base: ₹{rates.day}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ₹{effectiveMonthlyRate.toLocaleString()}
                            {effectiveMonthlyRate !== rates.monthly && (
                              <span className="text-xs text-gray-400 block">Base: ₹{rates.monthly.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            ₹{effectiveYearlyRate.toLocaleString()}
                            {effectiveYearlyRate !== rates.yearly && (
                              <span className="text-xs text-gray-400 block">Base: ₹{rates.yearly.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            <button
                              onClick={() => {
                                setEditingPrice({ category, gender, location, designation, rates });
                                setShowPriceModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Branch Management Tab
  const BranchManagementTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Branch Management</h3>
          <button
            onClick={() => setShowAdjustmentModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Adjustment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map(branch => (
            <div key={branch.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{branch.name}</h4>
                  <p className="text-sm text-gray-500">{branch.location}</p>
                  <p className="text-xs text-gray-400">ID: {branch.id}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  branch.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {branch.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Adjustments:</span>
                  <span className="font-medium">{branch.adjustments.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Updated:</span>
                  <span className="font-medium">{branch.lastUpdated}</span>
                </div>
              </div>

              {branch.adjustments.length > 0 && (
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-medium text-gray-700">Active Adjustments:</p>
                  {branch.adjustments.map(adj => (
                    <div key={adj.id} className="bg-gray-50 p-2 rounded text-xs">
                      <div className="flex justify-between">
                        <span className="font-medium">{formatCategoryName(adj.category)}</span>
                        <span className={`font-bold ${adj.value > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {adj.adjustmentType === 'percentage' ? `${adj.value > 0 ? '+' : ''}${adj.value}%` : `${adj.value > 0 ? '+' : ''}₹${Math.abs(adj.value)}`}
                        </span>
                      </div>
                      <p className="text-gray-500">Effective: {adj.effectiveDate}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Set selected branch and open adjustment modal
                    setSelectedBranch(branch.id);
                    setShowAdjustmentModal(true);
                  }}
                  className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded text-sm font-medium hover:bg-blue-200 transition-colors"
                >
                  Adjust Prices
                </button>
                <button
                  onClick={() => {
                    setSelectedBranch(branch.id);
                    setShowHistoryModal(true);
                  }}
                  className="bg-gray-100 text-gray-700 p-2 rounded hover:bg-gray-200 transition-colors"
                >
                  <History className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Price Update Modal
 const PriceUpdateModal = () => {
    const [formStep, setFormStep] = useState(1); // 1: Basic info, 2: Adjustment settings
    const [formData, setFormData] = useState({
      category: editingPrice?.category || '',
      gender: editingPrice?.gender || 'male',
      location: editingPrice?.location || 'cityLimit',
      designation: editingPrice?.designation || '',
      basePrice: editingPrice?.rates?.day || '',
      nightRate: editingPrice?.rates?.night || '',
      rotatingRate: editingPrice?.rates?.rotating || '',
      monthlyRate: editingPrice?.rates?.monthly || '',
      yearlyRate: editingPrice?.rates?.yearly || '',
      adjustmentType: 'percentage',
      adjustmentValue: '',
      nightAdjustment: 15, // Default percentage for night shift
      rotatingAdjustment: 10, // Default percentage for rotating shift
      locationAdjustment: 12, // Default percentage for out of city
      genderAdjustment: 8, // Default percentage for female
      applyToAll: false,
      applyToAllShifts: false,
      applyToAllGenders: false,
      applyToAllLocations: false
    });

    // Calculate derived rates when base price or adjustments change
    useEffect(() => {
      if (formData.basePrice) {
        const base = parseInt(formData.basePrice);
        const derivedRates = calculateDerivedRates(base);
        
        // Calculate rates based on adjustments
        const nightRate = Math.round(base * (1 + parseInt(formData.nightAdjustment || 0) / 100));
        const rotatingRate = Math.round(base * (1 + parseInt(formData.rotatingAdjustment || 0) / 100));
        const monthlyRate = Math.round(derivedRates.monthly);
        const yearlyRate = Math.round(derivedRates.yearly);
        
        setFormData(prev => ({
          ...prev,
          nightRate,
          rotatingRate,
          monthlyRate,
          yearlyRate
        }));
      }
    }, [formData.basePrice, formData.nightAdjustment, formData.rotatingAdjustment]);

    // Calculate location-based rates
    const calculateLocationRates = (baseRate, location) => {
      if (location === 'outOfCity') {
        return Math.round(baseRate * (1 + parseInt(formData.locationAdjustment || 0) / 100));
      }
      return baseRate;
    };

    // Calculate gender-based rates
    const calculateGenderRates = (baseRate, gender) => {
      if (gender === 'female') {
        return Math.round(baseRate * (1 + parseInt(formData.genderAdjustment || 0) / 100));
      }
      return baseRate;
    };

    const handleSave = () => {
      // Create the new price structure with all calculated rates
      const baseRate = parseInt(formData.basePrice);
      
      const newPrice = {
        day: baseRate,
        night: parseInt(formData.nightRate),
        rotating: parseInt(formData.rotatingRate),
        monthly: parseInt(formData.monthlyRate),
        yearly: parseInt(formData.yearlyRate)
      };

      // Update pricing structure
      const updatedPricing = { ...basePricing };
      
      // If applying to all categories
      if (formData.applyToAll) {
        Object.keys(updatedPricing).forEach(category => {
          Object.keys(updatedPricing[category]).forEach(gender => {
            Object.keys(updatedPricing[category][gender]).forEach(location => {
              Object.keys(updatedPricing[category][gender][location]).forEach(designation => {
                // Apply location and gender adjustments
                let adjustedPrice = { ...newPrice };
                
                // Apply location adjustment
                if (location === 'outOfCity') {
                  Object.keys(adjustedPrice).forEach(key => {
                    adjustedPrice[key] = calculateLocationRates(adjustedPrice[key], location);
                  });
                }
                
                // Apply gender adjustment
                if (gender === 'female') {
                  Object.keys(adjustedPrice).forEach(key => {
                    adjustedPrice[key] = calculateGenderRates(adjustedPrice[key], gender);
                  });
                }
                
                updatedPricing[category][gender][location][designation] = adjustedPrice;
              });
            });
          });
        });
      } else {
        // Apply to specific category
        if (!updatedPricing[formData.category]) {
          updatedPricing[formData.category] = {};
        }
        
        // Apply to all genders if selected
        const genders = formData.applyToAllGenders 
          ? ['male', 'female'] 
          : [formData.gender];
        
        genders.forEach(gender => {
          if (!updatedPricing[formData.category][gender]) {
            updatedPricing[formData.category][gender] = {};
          }
          
          // Apply to all locations if selected
          const locations = formData.applyToAllLocations 
            ? ['cityLimit', 'outOfCity'] 
            : [formData.location];
          
          locations.forEach(location => {
            if (!updatedPricing[formData.category][gender][location]) {
              updatedPricing[formData.category][gender][location] = {};
            }
            
            // Apply to all designations if selected or specific one
            const designations = formData.applyToAll 
              ? Object.keys(updatedPricing[formData.category][gender][location])
              : [formData.designation];
            
            designations.forEach(designation => {
              // Apply location and gender adjustments
              let adjustedPrice = { ...newPrice };
              
              // Apply location adjustment
              if (location === 'outOfCity') {
                Object.keys(adjustedPrice).forEach(key => {
                  adjustedPrice[key] = calculateLocationRates(adjustedPrice[key], location);
                });
              }
              
              // Apply gender adjustment
              if (gender === 'female') {
                Object.keys(adjustedPrice).forEach(key => {
                  adjustedPrice[key] = calculateGenderRates(adjustedPrice[key], gender);
                });
              }
              
              updatedPricing[formData.category][gender][location][designation] = adjustedPrice;
            });
          });
        });
      }

      setBasePricing(updatedPricing);
      
      // Add to history
      const historyEntry = {
        id: `HIST${Date.now()}`,
        branch: 'Base Pricing',
        category: formData.applyToAll ? 'All Categories' : formatCategoryName(formData.category),
        changeType: 'Base Price Update',
        value: 'Updated',
        effectiveDate: new Date().toISOString().split('T')[0],
        createdBy: 'Current Admin',
        reason: 'Manual price update',
        timestamp: new Date().toISOString()
      };
      setPriceHistory([historyEntry, ...priceHistory]);

      setShowPriceModal(false);
      setEditingPrice(null);
    };

    const renderBasicInfoStep = () => (
      <div className="space-y-4">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value, designation: '' })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select Category</option>
            <option value="securityGuards">Security Guards</option>
            <option value="supervisors">Supervisors</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="facilityManagement">Facility Management</option>
          </select>
        </div>

        {/* Designation Selection */}
        {formData.category && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Designation *</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDesignationDropdown(!showDesignationDropdown)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
              >
                {formData.designation ? formData.designation.charAt(0).toUpperCase() + formData.designation.slice(1) : 'Select Designation'}
                {showDesignationDropdown ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              {showDesignationDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {designationOptions[formData.category]?.map((option) => (
                    <div
                      key={option}
                      className="p-3 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setFormData({ ...formData, designation: option.toLowerCase() });
                        setShowDesignationDropdown(false);
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Base Price Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Base Price (Daily) *</label>
          <input
            type="number"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter base daily rate"
            required
          />
        </div>

        {/* Gender and Location Selection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="cityLimit">In City</option>
              <option value="outOfCity">Out of City</option>
            </select>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-end pt-4">
          <button
            onClick={() => setFormStep(2)}
            // disabled={!formData.category || !formData.designation || !formData.basePrice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    );

    const renderAdjustmentStep = () => (
      <div className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Rate Calculations
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-blue-700">Base Daily Rate:</p>
              <p className="font-medium">₹{formData.basePrice || 0}</p>
            </div>
            <div>
              <p className="text-blue-700">Monthly Rate:</p>
              <p className="font-medium">₹{formData.monthlyRate ? formData.monthlyRate.toLocaleString() : 0}</p>
            </div>
            <div>
              <p className="text-blue-700">Yearly Rate:</p>
              <p className="font-medium">₹{formData.yearlyRate ? formData.yearlyRate.toLocaleString() : 0}</p>
            </div>
            <div>
              <p className="text-blue-700">Night Shift Rate:</p>
              <p className="font-medium">₹{formData.nightRate || 0}</p>
            </div>
          </div>
        </div>

        {/* Adjustment Settings */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Adjustment Settings</h4>
          
          {/* Shift Adjustments */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Shift Adjustments</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Night Shift (%)</label>
                <input
                  type="number"
                  value={formData.nightAdjustment}
                  onChange={(e) => setFormData({ ...formData, nightAdjustment: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 15"
                />
                <p className="text-xs text-gray-500 mt-1">+{formData.nightAdjustment}% of base rate</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rotating Shift (%)</label>
                <input
                  type="number"
                  value={formData.rotatingAdjustment}
                  onChange={(e) => setFormData({ ...formData, rotatingAdjustment: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 10"
                />
                <p className="text-xs text-gray-500 mt-1">+{formData.rotatingAdjustment}% of base rate</p>
              </div>
            </div>
          </div>

          {/* Location and Gender Adjustments */}
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Location & Gender Adjustments</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Out of City (%)</label>
                <input
                  type="number"
                  value={formData.locationAdjustment}
                  onChange={(e) => setFormData({ ...formData, locationAdjustment: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 12"
                />
                <p className="text-xs text-gray-500 mt-1">+{formData.locationAdjustment}% for out of city</p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Female Staff (%)</label>
                <input
                  type="number"
                  value={formData.genderAdjustment}
                  onChange={(e) => setFormData({ ...formData, genderAdjustment: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., 8"
                />
                <p className="text-xs text-gray-500 mt-1">+{formData.genderAdjustment}% for female staff</p>
              </div>
            </div>
          </div>

          {/* Apply To Options */}
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.applyToAll}
                onChange={(e) => setFormData({ ...formData, applyToAll: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Apply to all categories</span>
            </label>
            
            {!formData.applyToAll && (
              <>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.applyToAllGenders}
                    onChange={(e) => setFormData({ ...formData, applyToAllGenders: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Apply to all genders</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.applyToAllLocations}
                    onChange={(e) => setFormData({ ...formData, applyToAllLocations: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Apply to all locations</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.applyToAllShifts}
                    onChange={(e) => setFormData({ ...formData, applyToAllShifts: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Apply to all shifts</span>
                </label>
              </>
            )}
          </div>
        </div>

        {/* Calculated Rates Preview */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-medium text-green-800 mb-2">Final Rates Preview</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-green-700">Daily Rate:</p>
              <p className="font-medium">₹{formData.basePrice || 0}</p>
            </div>
            <div>
              <p className="text-green-700">Night Shift:</p>
              <p className="font-medium">₹{formData.nightRate || 0}</p>
            </div>
            <div>
              <p className="text-green-700">Rotating Shift:</p>
              <p className="font-medium">₹{formData.rotatingRate || 0}</p>
            </div>
            <div>
              <p className="text-green-700">Monthly Rate:</p>
              <p className="font-medium">₹{formData.monthlyRate ? formData.monthlyRate.toLocaleString() : 0}</p>
            </div>
            <div>
              <p className="text-green-700">Yearly Rate:</p>
              <p className="font-medium">₹{formData.yearlyRate ? formData.yearlyRate.toLocaleString() : 0}</p>
            </div>
            <div>
              <p className="text-green-700">Out of City:</p>
              <p className="font-medium">₹{calculateLocationRates(parseInt(formData.basePrice || 0), 'outOfCity')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <button
            onClick={() => setFormStep(1)}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <ChevronUp className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleSave}
            disabled={!formData.basePrice}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4" />
            {editingPrice ? 'Update Price' : 'Add Price'}
          </button>
        </div>
      </div>
    );

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPrice ? 'Edit Price' : 'Add New Price'}
                <span className="text-sm font-normal text-gray-500 ml-2">
                  Step {formStep} of 2
                </span>
              </h3>
              <button
                onClick={() => {
                  setShowPriceModal(false);
                  setEditingPrice(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {formStep === 1 ? renderBasicInfoStep() : renderAdjustmentStep()}
          </div>
        </div>
      </div>
    );
  };

  // Branch Price Adjustment Modal
  const BranchAdjustmentModal = () => {
    const [adjustmentData, setAdjustmentData] = useState({
      branchId: selectedBranch === 'all' ? '' : selectedBranch,
      category: 'all',
      adjustmentType: 'percentage',
      value: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      reason: ''
    });

    const handleSave = () => {
      const selectedBranchData = branches.find(b => b.id === adjustmentData.branchId);
      if (!selectedBranchData) return;

      const newAdjustment = {
        id: `ADJ${Date.now()}`,
        category: adjustmentData.category,
        adjustmentType: adjustmentData.adjustmentType,
        value: parseFloat(adjustmentData.value),
        effectiveDate: adjustmentData.effectiveDate,
        createdBy: 'Current Admin',
        reason: adjustmentData.reason
      };

      // Update branches
      const updatedBranches = branches.map(branch => {
        if (branch.id === adjustmentData.branchId) {
          return {
            ...branch,
            adjustments: [...branch.adjustments, newAdjustment],
            lastUpdated: new Date().toISOString().split('T')[0]
          };
        }
        return branch;
      });
      setBranches(updatedBranches);

      // Add to history
      const historyEntry = {
        id: `HIST${Date.now()}`,
        branch: selectedBranchData.name,
        category: adjustmentData.category === 'all' ? 'All Categories' : formatCategoryName(adjustmentData.category),
        changeType: adjustmentData.adjustmentType === 'percentage' ? 
          (adjustmentData.value > 0 ? 'Percentage Increase' : 'Percentage Decrease') : 
          (adjustmentData.value > 0 ? 'Fixed Increase' : 'Fixed Decrease'),
        value: adjustmentData.adjustmentType === 'percentage' ? 
          `${adjustmentData.value > 0 ? '+' : ''}${adjustmentData.value}%` : 
          `${adjustmentData.value > 0 ? '+' : ''}₹${Math.abs(adjustmentData.value)}`,
        effectiveDate: adjustmentData.effectiveDate,
        createdBy: 'Current Admin',
        reason: adjustmentData.reason,
        timestamp: new Date().toISOString()
      };
      setPriceHistory([historyEntry, ...priceHistory]);

      setShowAdjustmentModal(false);
      setAdjustmentData({
        branchId: '',
        category: 'all',
        adjustmentType: 'percentage',
        value: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: ''
      });
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Branch Price Adjustment</h3>
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Branch *</label>
              <select
                value={adjustmentData.branchId}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, branchId: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a branch</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={adjustmentData.category}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, category: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="securityGuards">Security Guards</option>
                <option value="supervisors">Supervisors</option>
                <option value="housekeeping">Housekeeping</option>
                <option value="facilityManagement">Facility Management</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adjustment Type *</label>
                <select
                  value={adjustmentData.adjustmentType}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, adjustmentType: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value * {adjustmentData.adjustmentType === 'percentage' ? '(%)' : '(₹)'}
                </label>
                <input
                  type="number"
                  step={adjustmentData.adjustmentType === 'percentage' ? '0.1' : '1'}
                  value={adjustmentData.value}
                  onChange={(e) => setAdjustmentData({ ...adjustmentData, value: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={adjustmentData.adjustmentType === 'percentage' ? 'e.g., 10 or -5' : 'e.g., 100 or -50'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Effective Date *</label>
              <input
                type="date"
                value={adjustmentData.effectiveDate}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, effectiveDate: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Adjustment</label>
              <textarea
                value={adjustmentData.reason}
                onChange={(e) => setAdjustmentData({ ...adjustmentData, reason: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Enter reason for this price adjustment..."
              />
            </div>

            {/* Preview */}
            {adjustmentData.value && adjustmentData.branchId && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Preview Adjustment</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><span className="font-medium">Branch:</span> {branches.find(b => b.id === adjustmentData.branchId)?.name}</p>
                  <p><span className="font-medium">Category:</span> {adjustmentData.category === 'all' ? 'All Categories' : formatCategoryName(adjustmentData.category)}</p>
                  <p><span className="font-medium">Adjustment:</span> 
                    <span className={`font-bold ml-1 ${parseFloat(adjustmentData.value) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {adjustmentData.adjustmentType === 'percentage' ? 
                        `${parseFloat(adjustmentData.value) > 0 ? '+' : ''}${adjustmentData.value}%` : 
                        `${parseFloat(adjustmentData.value) > 0 ? '+' : ''}₹${Math.abs(parseFloat(adjustmentData.value))}`}
                    </span>
                  </p>
                  <p><span className="font-medium">Example:</span> ₹500/day → ₹{
                    adjustmentData.adjustmentType === 'percentage' ? 
                      Math.round(500 * (1 + parseFloat(adjustmentData.value || 0) / 100)) :
                      Math.max(0, 500 + parseFloat(adjustmentData.value || 0))
                  }/day</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => setShowAdjustmentModal(false)}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!adjustmentData.branchId || !adjustmentData.value}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              Apply Adjustment
            </button>
          </div>
        </div>
      </div>
    );
  };

  // History Modal
  const HistoryModal = () => {
    const filteredHistory = selectedBranch === 'all' ? 
      priceHistory : 
      priceHistory.filter(entry => {
        const branch = branches.find(b => b.id === selectedBranch);
        return branch && entry.branch === branch.name;
      });

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Price Change History
                {selectedBranch !== 'all' && ` - ${branches.find(b => b.id === selectedBranch)?.name}`}
              </h3>
              <div className="flex items-center gap-3">
                <button className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </button>
                <button
                  onClick={() => setShowHistoryModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map(entry => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div>
                          <p className="font-medium">{entry.effectiveDate}</p>
                          <p className="text-xs text-gray-500">{new Date(entry.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{entry.branch}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{entry.category}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          entry.changeType.includes('Increase') ? 'bg-green-100 text-green-800' :
                          entry.changeType.includes('Decrease') ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {entry.changeType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        <span className={
                          entry.value.includes('+') ? 'text-green-600' :
                          entry.value.includes('-') ? 'text-red-600' :
                          'text-gray-900'
                        }>
                          {entry.value}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{entry.createdBy}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{entry.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 p-2 w-full h-full">   
      {/* Navigation */}
    
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'pricing' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Pricing Overview
          </button>
          <button
            onClick={() => setActiveTab('branches')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'branches' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Branch Management
          </button>
        </div>

        {/* Content */}
        {activeTab === 'pricing' && <PricingOverviewTab />}
        {activeTab === 'branches' && <BranchManagementTab />}

        {/* Modals */}
        {showPriceModal && <PriceUpdateModal />}
        {showAdjustmentModal && <BranchAdjustmentModal />}
        {showHistoryModal && <HistoryModal />}
  
    </div>
  )
}
export default List