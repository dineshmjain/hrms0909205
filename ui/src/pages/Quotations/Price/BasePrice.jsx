import { Dialog } from '@material-tailwind/react';
import { Save, X } from 'lucide-react';
import React, { useState } from 'react'

const BasePrice = ({showPriceModal,setShowPriceModal}) => {
    const [formData, setFormData] = useState(
     {}
    );

     const [activeTab, setActiveTab] = useState('pricing');
      const [selectedBranch, setSelectedBranch] = useState('all');

      const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
      const [showHistoryModal, setShowHistoryModal] = useState(false);
      const [editingPrice, setEditingPrice] = useState(null);
      const [searchTerm, setSearchTerm] = useState('');
      const [filterCategory, setFilterCategory] = useState('all');
    
      // Base pricing structure with daily, monthly, and yearly rates
      const [basePricing, setBasePricing] = useState({
        securityGuards: {
          male: {
            cityLimit: {
              basic: { 
                day: 500, 
                night: 567, 
                rotating: 533,
                monthly: 15000,  // 500 * 30
                yearly: 180000   // 500 * 365 (approx)
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
   
    

    // Update derived rates when day rate changes
    // useEffect(() => {
    //   if (formData.day) {
    //     const derivedRates = calculateDerivedRates(parseInt(formData.day));
    //     setFormData(prev => ({
    //       ...prev,
    //       monthly: derivedRates.monthly,
    //       yearly: derivedRates.yearly
    //     }));
    //   }
    // }, [formData.day]);

    const handleSave = () => {
      if (editingPrice) {
        // Update existing price
        const updatedPricing = { ...basePricing };
        updatedPricing[editingPrice.category][editingPrice.gender][editingPrice.location][editingPrice.skill] = {
          day: parseInt(formData.day),
          night: parseInt(formData.night),
          rotating: parseInt(formData.rotating),
          monthly: parseInt(formData.monthly),
          yearly: parseInt(formData.yearly)
        };
        setBasePricing(updatedPricing);
        
        // Add to history
        const historyEntry = {
          id: `HIST${Date.now()}`,
          branch: 'Base Pricing',
          category: formatCategoryName(editingPrice.category),
          changeType: 'Base Price Update',
          value: 'Updated',
          effectiveDate: new Date().toISOString().split('T')[0],
          createdBy: 'Current Admin',
          reason: 'Manual price update',
          timestamp: new Date().toISOString()
        };
        setPriceHistory([historyEntry, ...priceHistory]);
      }
      setShowPriceModal(false);
      setEditingPrice(null);
    };

    return (
        <Dialog open={showPriceModal} handler={()=>{setShowPriceModal(false)}} size='md'>
     
        <div className="bg-white rounded-lg  w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPrice ? 'Edit Price' : 'Add New Price'}
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

          <div className="p-6 space-y-4">
            {editingPrice && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Price Details</h4>
                <p className="text-sm text-gray-600">Category: {formatCategoryName(editingPrice.category)}</p>
                <p className="text-sm text-gray-600">Gender: {editingPrice.gender}</p>
                <p className="text-sm text-gray-600">Location: {editingPrice.location === 'cityLimit' ? 'City Limit' : 'Out of City'}</p>
                <p className="text-sm text-gray-600">Skill: {editingPrice.skill}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day Shift Rate (₹) *</label>
              <input
                type="number"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter day shift rate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Night Shift Rate (₹)</label>
              <input
                type="number"
                value={formData.night}
                onChange={(e) => setFormData({ ...formData, night: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter night shift rate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rotating Shift Rate (₹)</label>
              <input
                type="number"
                value={formData.rotating}
                onChange={(e) => setFormData({ ...formData, rotating: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter rotating shift rate"
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Calculated Rates</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Monthly Rate:</span>
                  <span className="font-medium">₹{formData.monthly ? formData.monthly.toLocaleString() : 0}</span>
                </div>
                <div className="flex justify-between text-sm text-blue-700">
                  <span>Yearly Rate:</span>
                  <span className="font-medium">₹{formData.yearly ? formData.yearly.toLocaleString() : 0}</span>
                </div>
                <div className="text-xs text-blue-600 mt-2">
                  <p>Monthly rate calculated as Day Rate × 30 days</p>
                  <p>Yearly rate calculated as Day Rate × 365 days</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Manual Override</h4>
              <p className="text-sm text-yellow-700 mb-2">
                You can manually override the calculated rates if needed:
              </p>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-yellow-700 mb-1">Monthly Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.monthly}
                    onChange={(e) => setFormData({ ...formData, monthly: e.target.value })}
                    className="w-full p-2 border border-yellow-300 rounded focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-yellow-700 mb-1">Yearly Rate (₹)</label>
                  <input
                    type="number"
                    value={formData.yearly}
                    onChange={(e) => setFormData({ ...formData, yearly: e.target.value })}
                    className="w-full p-2 border border-yellow-300 rounded focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-3">
            <button
              onClick={() => {
                setShowPriceModal(false);
                setEditingPrice(null);
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!formData.day}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
   
      </Dialog>
    );
  };

export default BasePrice