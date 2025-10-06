// import React, { useState } from 'react';
// import { Plus, Edit, Save, X, History, Users, DollarSign, TrendingUp, Eye, Search, Filter, Download, Upload, AlertTriangle, Check, Clock, User } from 'lucide-react';

// const List = () => {
//   const [activeTab, setActiveTab] = useState('pricing');
//   const [selectedCategory, setSelectedCategory] = useState('securityGuards');
//   const [editingCell, setEditingCell] = useState(null);
//   const [showHistory, setShowHistory] = useState(false);
//   const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterPeriod, setFilterPeriod] = useState('all');
//   const [showBulkEdit, setShowBulkEdit] = useState(false);

//   // Current Price Database - Admin can edit these
//   const [priceList, setPriceList] = useState({
//     securityGuards: {
//       male: {
//         cityLimit: {
//           basic: { day: 500, night: 567, rotating: 533 },
//           trained: { day: 600, night: 667, rotating: 633 },
//           armed: { day: 733, night: 833, rotating: 783 },
//           exServiceman: { day: 833, night: 933, rotating: 883 }
//         },
//         outOfCity: {
//           basic: { day: 567, night: 633, rotating: 600 },
//           trained: { day: 667, night: 733, rotating: 700 },
//           armed: { day: 800, night: 900, rotating: 850 },
//           exServiceman: { day: 900, night: 1000, rotating: 950 }
//         }
//       },
//       female: {
//         cityLimit: {
//           basic: { day: 533, night: 600, rotating: 567 },
//           trained: { day: 633, night: 700, rotating: 667 }
//         },
//         outOfCity: {
//           basic: { day: 600, night: 667, rotating: 633 },
//           trained: { day: 700, night: 767, rotating: 733 }
//         }
//       }
//     },
//     supervisors: {
//       male: {
//         cityLimit: {
//           basic: { day: 733, night: 833, rotating: 783 },
//           experienced: { day: 933, night: 1033, rotating: 983 },
//           certified: { day: 1067, night: 1167, rotating: 1117 }
//         },
//         outOfCity: {
//           basic: { day: 833, night: 933, rotating: 883 },
//           experienced: { day: 1033, night: 1133, rotating: 1083 },
//           certified: { day: 1167, night: 1267, rotating: 1217 }
//         }
//       },
//       female: {
//         cityLimit: {
//           basic: { day: 767, night: 867, rotating: 817 },
//           experienced: { day: 967, night: 1067, rotating: 1017 }
//         },
//         outOfCity: {
//           basic: { day: 867, night: 967, rotating: 917 },
//           experienced: { day: 1067, night: 1167, rotating: 1117 }
//         }
//       }
//     },
//     housekeeping: {
//       male: {
//         cityLimit: {
//           basic: { day: 400, night: 467, rotating: 433 },
//           skilled: { day: 500, night: 567, rotating: 533 }
//         },
//         outOfCity: {
//           basic: { day: 467, night: 533, rotating: 500 },
//           skilled: { day: 567, night: 633, rotating: 600 }
//         }
//       },
//       female: {
//         cityLimit: {
//           basic: { day: 417, night: 483, rotating: 450 },
//           skilled: { day: 517, night: 583, rotating: 550 }
//         },
//         outOfCity: {
//           basic: { day: 483, night: 550, rotating: 517 },
//           skilled: { day: 583, night: 650, rotating: 617 }
//         }
//       }
//     },
//     facilityManagement: {
//       male: {
//         cityLimit: {
//           basic: { day: 600, night: 667, rotating: 633 },
//           technical: { day: 733, night: 800, rotating: 767 }
//         },
//         outOfCity: {
//           basic: { day: 667, night: 733, rotating: 700 },
//           technical: { day: 800, night: 867, rotating: 833 }
//         }
//       },
//       female: {
//         cityLimit: {
//           basic: { day: 617, night: 683, rotating: 650 },
//           technical: { day: 750, night: 817, rotating: 783 }
//         },
//         outOfCity: {
//           basic: { day: 683, night: 750, rotating: 717 },
//           technical: { day: 817, night: 883, rotating: 850 }
//         }
//       }
//     }
//   });

//   // Price History Database
//   const [priceHistory] = useState([
//     {
//       id: 1,
//       category: 'Security Guards',
//       type: 'Male - City Limit - Basic - Day',
//       oldPrice: 480,
//       newPrice: 500,
//       changeType: 'increase',
//       changeAmount: 20,
//       changePercentage: 4.17,
//       updatedBy: 'Admin User',
//       updatedOn: '2024-09-15 14:30:00',
//       reason: 'Annual increment adjustment',
//       effectiveFrom: '2024-10-01',
//       fieldOfficersNotified: true
//     },
//     {
//       id: 2,
//       category: 'Supervisors',
//       type: 'Female - Out of City - Experienced - Night',
//       oldPrice: 1150,
//       newPrice: 1167,
//       changeType: 'increase',
//       changeAmount: 17,
//       changePercentage: 1.48,
//       updatedBy: 'Admin User',
//       updatedOn: '2024-09-12 11:15:00',
//       reason: 'Market rate adjustment',
//       effectiveFrom: '2024-09-15',
//       fieldOfficersNotified: true
//     },
//     {
//       id: 3,
//       category: 'Housekeeping',
//       type: 'Male - City Limit - Skilled - Rotating',
//       oldPrice: 550,
//       newPrice: 533,
//       changeType: 'decrease',
//       changeAmount: -17,
//       changePercentage: -3.09,
//       updatedBy: 'Admin User',
//       updatedOn: '2024-09-10 09:45:00',
//       reason: 'Competitive pricing strategy',
//       effectiveFrom: '2024-09-12',
//       fieldOfficersNotified: true
//     },
//     {
//       id: 4,
//       category: 'Security Guards',
//       type: 'Male - City Limit - Armed - Night',
//       oldPrice: 800,
//       newPrice: 833,
//       changeType: 'increase',
//       changeAmount: 33,
//       changePercentage: 4.13,
//       updatedBy: 'Admin User',
//       updatedOn: '2024-09-08 16:20:00',
//       reason: 'Enhanced security requirements',
//       effectiveFrom: '2024-09-10',
//       fieldOfficersNotified: true
//     },
//     {
//       id: 5,
//       category: 'Facility Management',
//       type: 'Female - Out of City - Technical - Day',
//       oldPrice: 800,
//       newPrice: 817,
//       changeType: 'increase',
//       changeAmount: 17,
//       changePercentage: 2.13,
//       updatedBy: 'Admin User',
//       updatedOn: '2024-09-05 13:10:00',
//       reason: 'Skill-based increment',
//       effectiveFrom: '2024-09-07',
//       fieldOfficersNotified: true
//     }
//   ]);

//   const formatCategoryName = (category) => {
//     const names = {
//       securityGuards: 'Security Guards',
//       supervisors: 'Supervisors',
//       housekeeping: 'Housekeeping Staff',
//       facilityManagement: 'Facility Management'
//     };
//     return names[category] || category;
//   };

//   const formatSkillName = (skill) => {
//     const names = {
//       basic: 'Basic',
//       trained: 'Trained',
//       armed: 'Armed',
//       exServiceman: 'Ex-Serviceman',
//       experienced: 'Experienced',
//       certified: 'Certified',
//       skilled: 'Skilled',
//       technical: 'Technical'
//     };
//     return names[skill] || skill;
//   };

//   const updatePrice = (category, gender, location, skill, shift, newPrice) => {
//     setPriceList(prev => ({
//       ...prev,
//       [category]: {
//         ...prev[category],
//         [gender]: {
//           ...prev[category][gender],
//           [location]: {
//             ...prev[category][gender][location],
//             [skill]: {
//               ...prev[category][gender][location][skill],
//               [shift]: parseInt(newPrice)
//             }
//           }
//         }
//       }
//     }));
//   };

//   const handleCellEdit = (category, gender, location, skill, shift, currentValue) => {
//     const cellId = `${category}-${gender}-${location}-${skill}-${shift}`;
//     if (editingCell === cellId) {
//       setEditingCell(null);
//     } else {
//       setEditingCell(cellId);
//     }
//   };

//   const renderPriceCell = (category, gender, location, skill, shift, value) => {
//     const cellId = `${category}-${gender}-${location}-${skill}-${shift}`;
//     const isEditing = editingCell === cellId;

//     return (
//       <div className="flex items-center space-x-2">
//         {isEditing ? (
//           <div className="flex items-center space-x-1">
//             <input
//               type="number"
//               defaultValue={value}
//               className="w-16 p-1 text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500"
//               onBlur={(e) => {
//                 if (e.target.value !== value.toString()) {
//                   updatePrice(category, gender, location, skill, shift, e.target.value);
//                 }
//                 setEditingCell(null);
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                   if (e.target.value !== value.toString()) {
//                     updatePrice(category, gender, location, skill, shift, e.target.value);
//                   }
//                   setEditingCell(null);
//                 }
//                 if (e.key === 'Escape') {
//                   setEditingCell(null);
//                 }
//               }}
//               autoFocus
//             />
//             <button
//               onClick={() => setEditingCell(null)}
//               className="text-green-600 hover:text-green-800"
//             >
//               <Check className="h-3 w-3" />
//             </button>
//           </div>
//         ) : (
//           <div className="flex items-center space-x-1">
//             <span className="text-xs font-medium">₹{value}</span>
//             <button
//               onClick={() => handleCellEdit(category, gender, location, skill, shift, value)}
//               className="text-blue-600 hover:text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
//             >
//               <Edit className="h-3 w-3" />
//             </button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const PricingTab = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Price Management</h2>
//           <p className="text-gray-600">Manage daily rates for all staff categories</p>
//         </div>
//         <div className="flex space-x-3">
//           <button
//             onClick={() => setShowBulkEdit(true)}
//             className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2"
//           >
//             <Upload className="h-4 w-4" />
//             <span>Bulk Edit</span>
//           </button>
//           <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2">
//             <Download className="h-4 w-4" />
//             <span>Export Prices</span>
//           </button>
//         </div>
//       </div>

//       {/* Category Selection */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//         <div className="grid grid-cols-4 gap-3">
//           {Object.keys(priceList).map(category => (
//             <button
//               key={category}
//               onClick={() => setSelectedCategory(category)}
//               className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
//                 selectedCategory === category
//                   ? 'bg-blue-500 text-white border-blue-500'
//                   : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
//               }`}
//             >
//               {formatCategoryName(category)}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Price Tables */}
//       <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//         <div className="p-4 border-b border-gray-200">
//           <h3 className="text-lg font-semibold text-gray-900">
//             {formatCategoryName(selectedCategory)} - Daily Rates (₹)
//           </h3>
//         </div>

//         <div className="p-4 space-y-6">
//           {Object.entries(priceList[selectedCategory]).map(([gender, locationData]) => (
//             <div key={gender} className="space-y-4">
//               <h4 className="text-md font-semibold text-gray-800 capitalize">
//                 {gender} Staff
//               </h4>
              
//               {Object.entries(locationData).map(([location, skillData]) => (
//                 <div key={location} className="bg-gray-50 rounded-lg p-4">
//                   <h5 className="text-sm font-medium text-gray-700 mb-3">
//                     {location === 'cityLimit' ? 'City Limit' : 'Out of City'}
//                   </h5>
                  
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full">
//                       <thead>
//                         <tr className="border-b border-gray-200">
//                           <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">
//                             Skill Level
//                           </th>
//                           <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase">
//                             Day Shift
//                           </th>
//                           <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase">
//                             Night Shift
//                           </th>
//                           <th className="text-center py-2 px-3 text-xs font-medium text-gray-500 uppercase">
//                             Rotating Shift
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {Object.entries(skillData).map(([skill, shiftData]) => (
//                           <tr key={skill} className="border-b border-gray-100 hover:bg-white group">
//                             <td className="py-3 px-3 text-sm font-medium text-gray-900">
//                               {formatSkillName(skill)}
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               {renderPriceCell(selectedCategory, gender, location, skill, 'day', shiftData.day)}
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               {renderPriceCell(selectedCategory, gender, location, skill, 'night', shiftData.night)}
//                             </td>
//                             <td className="py-3 px-3 text-center">
//                               {renderPriceCell(selectedCategory, gender, location, skill, 'rotating', shiftData.rotating)}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   const HistoryTab = () => {
//     const filteredHistory = priceHistory.filter(item => {
//       const matchesSearch = item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                            item.reason.toLowerCase().includes(searchTerm.toLowerCase());
      
//       if (filterPeriod === 'all') return matchesSearch;
      
//       const itemDate = new Date(item.updatedOn);
//       const now = new Date();
//       const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
      
//       switch (filterPeriod) {
//         case '7days':
//           return matchesSearch && daysDiff <= 7;
//         case '30days':
//           return matchesSearch && daysDiff <= 30;
//         case '90days':
//           return matchesSearch && daysDiff <= 90;
//         default:
//           return matchesSearch;
//       }
//     });

//     return (
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Price History</h2>
//             <p className="text-gray-600">Track all price changes and updates</p>
//           </div>
//           <div className="flex space-x-3">
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2">
//               <Download className="h-4 w-4" />
//               <span>Export History</span>
//             </button>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
//           <div className="flex space-x-4">
//             <div className="flex-1">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by category, type, or reason..."
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
//             <div className="w-48">
//               <select
//                 className="w-full py-2 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 value={filterPeriod}
//                 onChange={(e) => setFilterPeriod(e.target.value)}
//               >
//                 <option value="all">All Time</option>
//                 <option value="7days">Last 7 Days</option>
//                 <option value="30days">Last 30 Days</option>
//                 <option value="90days">Last 90 Days</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* History List */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="p-4 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">
//               Recent Changes ({filteredHistory.length})
//             </h3>
//           </div>

//           <div className="divide-y divide-gray-100">
//             {filteredHistory.map((item) => (
//               <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
//                 <div className="flex justify-between items-start">
//                   <div className="flex-1">
//                     <div className="flex items-center space-x-3 mb-2">
//                       <span className="text-sm font-semibold text-gray-900">{item.category}</span>
//                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//                         item.changeType === 'increase' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {item.changeType === 'increase' ? (
//                           <TrendingUp className="h-3 w-3 mr-1" />
//                         ) : (
//                           <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
//                         )}
//                         {item.changeType === 'increase' ? '+' : ''}{item.changeAmount} ({item.changePercentage.toFixed(2)}%)
//                       </span>
//                       {item.fieldOfficersNotified && (
//                         <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                           <Check className="h-3 w-3 mr-1" />
//                           Notified
//                         </span>
//                       )}
//                     </div>
                    
//                     <p className="text-sm text-gray-600 mb-1">{item.type}</p>
//                     <p className="text-sm text-gray-500 mb-2">
//                       ₹{item.oldPrice} → ₹{item.newPrice} • {item.reason}
//                     </p>
                    
//                     <div className="flex items-center space-x-4 text-xs text-gray-500">
//                       <div className="flex items-center space-x-1">
//                         <User className="h-3 w-3" />
//                         <span>{item.updatedBy}</span>
//                       </div>
//                       <div className="flex items-center space-x-1">
//                         <Clock className="h-3 w-3" />
//                         <span>{new Date(item.updatedOn).toLocaleString()}</span>
//                       </div>
//                       <span>Effective: {new Date(item.effectiveFrom).toLocaleDateString()}</span>
//                     </div>
//                   </div>
                  
//                   <button
//                     onClick={() => setSelectedHistoryItem(item)}
//                     className="text-blue-600 hover:text-blue-800 ml-4"
//                   >
//                     <Eye className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {filteredHistory.length === 0 && (
//             <div className="p-8 text-center">
//               <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No History Found</h3>
//               <p className="text-gray-500">No price changes match your search criteria.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const AnalyticsTab = () => (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-900">Price Analytics</h2>
//         <p className="text-gray-600">Insights and trends in pricing</p>
//       </div>

//       {/* Key Metrics */}
//       <div className="grid grid-cols-4 gap-4">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <DollarSign className="h-6 w-6 text-blue-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Avg Daily Rate</p>
//               <p className="text-2xl font-bold text-gray-900">₹645</p>
//               <p className="text-xs text-green-600">+3.2% from last month</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-2 bg-green-100 rounded-lg">
//               <TrendingUp className="h-6 w-6 text-green-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Price Changes</p>
//               <p className="text-2xl font-bold text-gray-900">12</p>
//               <p className="text-xs text-gray-500">This month</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-2 bg-purple-100 rounded-lg">
//               <Users className="h-6 w-6 text-purple-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Categories</p>
//               <p className="text-2xl font-bold text-gray-900">4</p>
//               <p className="text-xs text-gray-500">Active pricing tiers</p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <div className="flex items-center">
//             <div className="p-2 bg-orange-100 rounded-lg">
//               <AlertTriangle className="h-6 w-6 text-orange-600" />
//             </div>
//             <div className="ml-4">
//               <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
//               <p className="text-2xl font-bold text-gray-900">3</p>
//               <p className="text-xs text-orange-600">Need attention</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Placeholder */}
//       <div className="grid grid-cols-2 gap-6">
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Trends by Category</h3>
//           <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
//             <p className="text-gray-500">Chart visualization would go here</p>
//           </div>
//         </div>

//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Changes</h3>
//           <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
//             <p className="text-gray-500">Chart visualization would go here</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const BulkEditModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-semibold text-gray-900">Bulk Price Update</h3>
//             <button 
//               onClick={() => setShowBulkEdit(false)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
        
//         <div className="p-6 space-y-6">
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//             <div className="flex items-start">
//               <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
//               <div>
//                 <h4 className="font-medium text-yellow-800">Bulk Update Warning</h4>
//                 <p className="text-sm text-yellow-700 mt-1">
//                   This will update multiple prices at once. All field officers will be notified of these changes.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Update Method
//               </label>
//               <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option value="percentage">Percentage Increase/Decrease</option>
//                 <option value="fixed">Fixed Amount Increase/Decrease</option>
//                 <option value="csv">Upload CSV File</option>
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Target Categories
//               </label>
//               <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option value="all">All Categories</option>
//                 <option value="securityGuards">Security Guards</option>
//                 <option value="supervisors">Supervisors</option>
//                 <option value="housekeeping">Housekeeping Staff</option>
//                 <option value="facilityManagement">Facility Management</option>
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Adjustment Value
//               </label>
//               <input
//                 type="number"
//                 placeholder="5"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Effective Date
//               </label>
//               <input
//                 type="date"
//                 className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Notification
//               </label>
//               <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
//                 <option value="immediate">Notify Immediately</option>
//                 <option value="scheduled">Schedule Notification</option>
//                 <option value="manual">Manual Notification</option>
//               </select>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Reason for Change
//             </label>
//             <textarea
//               className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
//               placeholder="Enter reason for bulk price update..."
//             ></textarea>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="font-medium text-blue-800 mb-2">Preview Changes</h4>
//             <p className="text-sm text-blue-700">
//               This will affect approximately <strong>48 price points</strong> across the selected categories.
//               Field officers will be notified via email and in-app notifications.
//             </p>
//           </div>

//           <div className="flex space-x-3 pt-4 border-t border-gray-200">
//             <button 
//               onClick={() => setShowBulkEdit(false)}
//               className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//             >
//               Cancel
//             </button>
//             <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
//               Apply Bulk Update
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const HistoryDetailModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto">
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <h3 className="text-xl font-semibold text-gray-900">Price Change Details</h3>
//             <button 
//               onClick={() => setSelectedHistoryItem(null)}
//               className="text-gray-500 hover:text-gray-700"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>
//         </div>
        
//         {selectedHistoryItem && (
//           <div className="p-6 space-y-4">
//             <div className="bg-gray-50 rounded-lg p-4">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 <div>
//                   <p className="font-medium text-gray-600">Category</p>
//                   <p className="text-gray-900">{selectedHistoryItem.category}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-600">Type</p>
//                   <p className="text-gray-900">{selectedHistoryItem.type}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-600">Old Price</p>
//                   <p className="text-gray-900">₹{selectedHistoryItem.oldPrice}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-600">New Price</p>
//                   <p className="text-gray-900">₹{selectedHistoryItem.newPrice}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-600">Change Amount</p>
//                   <p className={selectedHistoryItem.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
//                     {selectedHistoryItem.changeType === 'increase' ? '+' : ''}₹{selectedHistoryItem.changeAmount}
//                   </p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-600">Change Percentage</p>
//                   <p className={selectedHistoryItem.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}>
//                     {selectedHistoryItem.changeType === 'increase' ? '+' : ''}{selectedHistoryItem.changePercentage.toFixed(2)}%
//                   </p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-600">Updated By</p>
//                   <p className="text-gray-900">{selectedHistoryItem.updatedBy}</p>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-600">Update Date</p>
//                   <p className="text-gray-900">{new Date(selectedHistoryItem.updatedOn).toLocaleString()}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="font-medium text-gray-600">Effective From</p>
//                   <p className="text-gray-900">{new Date(selectedHistoryItem.effectiveFrom).toLocaleDateString()}</p>
//                 </div>
//                 <div className="col-span-2">
//                   <p className="font-medium text-gray-600">Reason</p>
//                   <p className="text-gray-900">{selectedHistoryItem.reason}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//               <div className="flex items-center space-x-2">
//                 <Check className="h-5 w-5 text-blue-600" />
//                 <div>
//                   <p className="font-medium text-blue-800">Field Officers Notified</p>
//                   <p className="text-sm text-blue-700">
//                     All field officers have been automatically notified of this price change via email and in-app notifications.
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <button 
//               onClick={() => setSelectedHistoryItem(null)}
//               className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-4">
//             <div className="flex items-center space-x-4">
//               <div className="bg-blue-600 p-2 rounded-lg">
//                 <DollarSign className="h-8 w-8 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">SecureForce Admin</h1>
//                 <p className="text-sm text-gray-500">Price Management Dashboard</p>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                 Online
//               </div>
//               <div className="bg-gray-100 p-2 rounded-full">
//                 <User className="h-6 w-6 text-gray-600" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Navigation Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="border-b border-gray-200 bg-white">
//           <nav className="-mb-px flex space-x-8 px-4">
//             <button
//               onClick={() => setActiveTab('pricing')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//                 activeTab === 'pricing'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <DollarSign className="h-4 w-4" />
//                 <span>Pricing Management</span>
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('history')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//                 activeTab === 'history'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <History className="h-4 w-4" />
//                 <span>Price History</span>
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('analytics')}
//               className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
//                 activeTab === 'analytics'
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <TrendingUp className="h-4 w-4" />
//                 <span>Analytics</span>
//               </div>
//             </button>
//           </nav>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {activeTab === 'pricing' && <PricingTab />}
//         {activeTab === 'history' && <HistoryTab />}
//         {activeTab === 'analytics' && <AnalyticsTab />}
//       </div>

//       {/* Modals */}
//       {showBulkEdit && <BulkEditModal />}
//       {selectedHistoryItem && <HistoryDetailModal />}
//     </div>
//   );
// };

// export default List;

import React, { useState } from 'react';
import { Plus, User, MapPin, Clock, Users, FileText, MessageCircle, Mail, CheckCircle, Calendar, Phone, ShoppingCart, Star, X, Server, ArrowLeft } from 'lucide-react';

const Temp2 = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showPriceList, setShowPriceList] = useState(false);
  const [showStaffRequirements, setShowStaffRequirements] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);

  // Price List Database with daily rates (monthly = daily * 30, yearly = daily * 365)
  const priceList = {
    securityGuards: {
      male: {
        cityLimit: {
          basic: { day: 500, night: 567, rotating: 533 },
          trained: { day: 600, night: 667, rotating: 633 },
          armed: { day: 733, night: 833, rotating: 783 },
          exServiceman: { day: 833, night: 933, rotating: 883 }
        },
        outOfCity: {
          basic: { day: 567, night: 633, rotating: 600 },
          trained: { day: 667, night: 733, rotating: 700 },
          armed: { day: 800, night: 900, rotating: 850 },
          exServiceman: { day: 900, night: 1000, rotating: 950 }
        }
      },
      female: {
        cityLimit: {
          basic: { day: 533, night: 600, rotating: 567 },
          trained: { day: 633, night: 700, rotating: 667 }
        },
        outOfCity: {
          basic: { day: 600, night: 667, rotating: 633 },
          trained: { day: 700, night: 767, rotating: 733 }
        }
      }
    },
    supervisors: {
      male: {
        cityLimit: {
          basic: { day: 733, night: 833, rotating: 783 },
          experienced: { day: 933, night: 1033, rotating: 983 },
          certified: { day: 1067, night: 1167, rotating: 1117 }
        },
        outOfCity: {
          basic: { day: 833, night: 933, rotating: 883 },
          experienced: { day: 1033, night: 1133, rotating: 1083 },
          certified: { day: 1167, night: 1267, rotating: 1217 }
        }
      },
      female: {
        cityLimit: {
          basic: { day: 767, night: 867, rotating: 817 },
          experienced: { day: 967, night: 1067, rotating: 1017 }
        },
        outOfCity: {
          basic: { day: 867, night: 967, rotating: 917 },
          experienced: { day: 1067, night: 1167, rotating: 1117 }
        }
      }
    },
    housekeeping: {
      male: {
        cityLimit: {
          basic: { day: 400, night: 467, rotating: 433 },
          skilled: { day: 500, night: 567, rotating: 533 }
        },
        outOfCity: {
          basic: { day: 467, night: 533, rotating: 500 },
          skilled: { day: 567, night: 633, rotating: 600 }
        }
      },
      female: {
        cityLimit: {
          basic: { day: 417, night: 483, rotating: 450 },
          skilled: { day: 517, night: 583, rotating: 550 }
        },
        outOfCity: {
          basic: { day: 483, night: 550, rotating: 517 },
          skilled: { day: 583, night: 650, rotating: 617 }
        }
      }
    },
    facilityManagement: {
      male: {
        cityLimit: {
          basic: { day: 600, night: 667, rotating: 633 },
          technical: { day: 733, night: 800, rotating: 767 }
        },
        outOfCity: {
          basic: { day: 667, night: 733, rotating: 700 },
          technical: { day: 800, night: 867, rotating: 833 }
        }
      },
      female: {
        cityLimit: {
          basic: { day: 617, night: 683, rotating: 650 },
          technical: { day: 750, night: 817, rotating: 783 }
        },
        outOfCity: {
          basic: { day: 683, night: 750, rotating: 717 },
          technical: { day: 817, night: 883, rotating: 850 }
        }
      }
    }
  };

  // Helper functions for status management
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'po_received':
        return 'bg-green-100 text-green-800';
      case 'negotiating':
        return 'bg-orange-100 text-orange-800';
      case 'quoted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
  };

  const clients = [
    { 
      id: 1, 
      name: 'Tech Corp Ltd', 
      location: 'Sector 5, Gurgaon', 
      status: 'pending', 
      lastVisit: '2024-09-10',
      contact: 'Rajesh Kumar - HR Manager',
      phone: '+91 9876543210'
    },
    { 
      id: 2, 
      name: 'Manufacturing Inc', 
      location: 'Industrial Area, Noida', 
      status: 'po_received', 
      lastVisit: '2024-09-12',
      contact: 'Priya Sharma - Operations Head',
      phone: '+91 9876543211'
    },
    { 
      id: 3, 
      name: 'Retail Chain', 
      location: 'Mall Road, Delhi', 
      status: 'negotiating', 
      lastVisit: '2024-09-14',
      contact: 'Amit Singh - Store Manager',
      phone: '+91 9876543212'
    }
  ];

  const DashboardTab = () => (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Active Clients</p>
              <p className="text-2xl font-bold text-blue-800">12</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">POs Received</p>
              <p className="text-2xl font-bold text-green-800">5</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Visits Today</p>
              <p className="text-2xl font-bold text-yellow-800">3</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Monthly Target</p>
              <p className="text-2xl font-bold text-purple-800">85%</p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Recent Activities</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Quotation sent to Tech Corp Ltd</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-2 bg-orange-50 rounded-lg">
            <FileText className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">PO received from Manufacturing Inc</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setShowClientForm(true)}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">Add Client</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors">
            <Calendar className="h-5 w-5" />
            <span className="text-sm font-medium">Schedule Visit</span>
          </button>
        </div>
      </div>
    </div>
  );

  const ClientsTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">Client Management</h2>
        <button 
          onClick={() => setShowClientForm(true)}
          className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {clients.map((client) => (
        <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{client.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{client.location}</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                <User className="h-4 w-4" />
                <span>{client.contact}</span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(client.status)}`}>
              {formatStatus(client.status)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
            <Clock className="h-4 w-4" />
            <span>Last visit: {client.lastVisit}</span>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => {
                setSelectedClient(client);
                setActiveTab('requirements');
              }}
              className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Requirements
            </button>
            <a 
              href={`tel:${client.phone}`}
              className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <Phone className="h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );

  const RequirementsTab = () => (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <button 
          onClick={() => setActiveTab('clients')}
          className="text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          {selectedClient?.name || 'Client'} Requirements
        </h2>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Staff Requirements</h3>
          <button 
            onClick={() => setShowPriceList(true)}
            className="bg-purple-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors"
          >
            View Price List
          </button>
        </div>
        
        <div className="text-center py-8">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Select staff requirements from our comprehensive price list</p>
          <button 
            onClick={() => setShowPriceList(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Configure Staff Requirements
          </button>
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-4">Selected Services</h3>
          <div className="space-y-3">
            {selectedServices.map((service, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{service.type} - {service.gender}</p>
                  <p className="text-xs text-gray-500">{service.skill} | {service.shift} | {service.location}</p>
                  <p className="text-xs text-gray-500">{service.duration} {service.period}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">Rs.{service.total?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Qty: {service.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
          Save Requirements
        </button>
        <button 
          onClick={() => setShowQuotation(true)}
          className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
          disabled={selectedServices.length === 0}
        >
          Generate Quotation
        </button>
      </div>
    </div>
  );

  const QuotationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Quotation</h3>
            <button 
              onClick={() => setShowQuotation(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="text-center mb-4">
            <h4 className="font-bold text-lg">{selectedClient?.name || 'Client'}</h4>
            <p className="text-sm text-gray-500">Valid till: 2024-10-15</p>
          </div>
          
          {selectedServices.length > 0 ? (
            <>
              <div className="space-y-2">
                {selectedServices.map((service, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <p className="font-medium text-sm">{service.type} - {service.gender}</p>
                        <p className="text-xs text-gray-500">{service.skill} | {service.shift} | {service.location}</p>
                        <p className="text-xs text-gray-500">{service.duration} {service.period}</p>
                      </div>
                      <p className="font-semibold">Rs.{service.total.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Qty: {service.quantity}</span>
                      <span>Rate: Rs.{service.dailyRate.toLocaleString()}/day</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-3">
                <div className="flex justify-between items-center font-bold">
                  <span>Total Cost:</span>
                  <span>Rs.{selectedServices.reduce((sum, service) => sum + service.total, 0).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </button>
                <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1">
                  <MessageCircle className="h-4 w-4" />
                  <span>WhatsApp</span>
                </button>
              </div>
              
              <button 
                onClick={() => {
                  setShowQuotation(false);
                  setShowNegotiation(true);
                }}
                className="w-full bg-orange-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Track Negotiation
              </button>
            </>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No staff requirements added yet</p>
              <p className="text-sm text-gray-400 mb-6">Please add staff requirements to generate a quotation</p>
              <button 
                onClick={() => {
                  setShowQuotation(false);
                  setShowPriceList(true);
                }}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Add Staff Requirements
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const PriceListModal = () => {
    const [selectedCategory, setSelectedCategory] = useState('securityGuards');
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedLocation, setSelectedLocation] = useState('cityLimit');
    const [selectedSkill, setSelectedSkill] = useState('basic');
    const [selectedShift, setSelectedShift] = useState('day');
    const [quantity, setQuantity] = useState(1);
    const [pricingPeriod, setPricingPeriod] = useState('monthly'); // daily, monthly, yearly - GLOBAL for all selections
    const [duration, setDuration] = useState(1); // number of days/months/years

    const addToRequirements = () => {
      const dailyRate = priceList[selectedCategory]?.[selectedGender]?.[selectedLocation]?.[selectedSkill]?.[selectedShift];
      if (dailyRate) {
        let totalRate;
        let periodLabel;
        
        switch(pricingPeriod) {
          case 'daily':
            totalRate = dailyRate * duration;
            periodLabel = duration === 1 ? 'day' : 'days';
            break;
          case 'monthly':
            totalRate = dailyRate * 30 * duration;
            periodLabel = duration === 1 ? 'month' : 'months';
            break;
          case 'yearly':
            totalRate = dailyRate * 365 * duration;
            periodLabel = duration === 1 ? 'year' : 'years';
            break;
          default:
            totalRate = dailyRate * 30;
            periodLabel = 'month';
        }

        const service = {
          type: selectedCategory.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          gender: selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1),
          location: selectedLocation === 'cityLimit' ? 'City Limit' : 'Out of City',
          skill: selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1),
          shift: selectedShift.charAt(0).toUpperCase() + selectedShift.slice(1),
          dailyRate: dailyRate,
          quantity: quantity,
          period: periodLabel,
          duration: duration,
          total: totalRate * quantity
        };
        
        // Close price list and show staff requirements
        setShowPriceList(false);
        setShowStaffRequirements(true);
        setSelectedServices([...selectedServices, service]);
      }
    };

    const getCurrentRate = () => {
      const dailyRate = priceList[selectedCategory]?.[selectedGender]?.[selectedLocation]?.[selectedSkill]?.[selectedShift] || 0;
      
      switch(pricingPeriod) {
        case 'daily':
          return dailyRate;
        case 'monthly':
          return dailyRate * 30;
        case 'yearly':
          return dailyRate * 365;
        default:
          return dailyRate * 30;
      }
    };

    const getTotalCost = () => {
      return getCurrentRate() * quantity * duration;
    };

    const getSkillOptions = () => {
      const skills = priceList[selectedCategory]?.[selectedGender]?.[selectedLocation] || {};
      return Object.keys(skills);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Staff Price List & Selection</h3>
              <button 
                onClick={() => setShowPriceList(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Global Pricing Period Selection */}
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <label className="block text-sm font-medium text-purple-800 mb-2">
                <span className="flex items-center">
                  Global Pricing Period
                  <span className="ml-2 text-xs bg-purple-200 text-purple-700 px-2 py-1 rounded">
                    Applies to all selections
                  </span>
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setPricingPeriod('daily');
                    setDuration(1);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    pricingPeriod === 'daily' 
                      ? 'bg-purple-500 text-white border-purple-500' 
                      : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  Daily Rates
                </button>
                <button
                  onClick={() => {
                    setPricingPeriod('monthly');
                    setDuration(1);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    pricingPeriod === 'monthly' 
                      ? 'bg-purple-500 text-white border-purple-500' 
                      : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  Monthly Rates
                </button>
                <button
                  onClick={() => {
                    setPricingPeriod('yearly');
                    setDuration(1);
                  }}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    pricingPeriod === 'yearly' 
                      ? 'bg-purple-500 text-white border-purple-500' 
                      : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-100'
                  }`}
                >
                  Yearly Rates
                </button>
              </div>
              <p className="text-xs text-purple-600 mt-2">
                This pricing period will be used for all staff requirements you add.
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Category</label>
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="securityGuards">Security Guards</option>
                <option value="supervisors">Supervisors</option>
                <option value="housekeeping">Housekeeping Staff</option>
                <option value="facilityManagement">Facility Management</option>
              </select>
            </div>

            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedGender('male')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedGender === 'male' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => setSelectedGender('female')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedGender === 'female' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>

            {/* Location Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setSelectedLocation('cityLimit')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedLocation === 'cityLimit' 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  City Limit
                </button>
                <button
                  onClick={() => setSelectedLocation('outOfCity')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedLocation === 'outOfCity' 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Out of City
                </button>
              </div>
            </div>

            {/* Skill Level Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
              <select 
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {getSkillOptions().map(skill => (
                  <option key={skill} value={skill}>
                    {skill.charAt(0).toUpperCase() + skill.slice(1).replace(/([A-Z])/g, ' $1')}
                  </option>
                ))}
              </select>
            </div>

            {/* Shift Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedShift('day')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedShift === 'day' 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setSelectedShift('night')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedShift === 'night' 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Night
                </button>
                <button
                  onClick={() => setSelectedShift('rotating')}
                  className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                    selectedShift === 'rotating' 
                      ? 'bg-orange-500 text-white border-orange-500' 
                      : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  Rotating
                </button>
              </div>
            </div>

            {/* Duration Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration ({pricingPeriod === 'daily' ? 'days' : pricingPeriod === 'monthly' ? 'months' : 'years'})
              </label>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="font-semibold text-lg w-12 text-center">{duration}</span>
                <button 
                  onClick={() => setDuration(duration + 1)}
                  className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity (People)</label>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="font-semibold text-lg w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Rate per person/{pricingPeriod.slice(0, -2)}:</span>
                <span className="text-lg font-bold text-blue-600">Rs.{getCurrentRate().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="text-lg font-bold text-blue-600">{duration} {pricingPeriod === 'daily' ? (duration === 1 ? 'day' : 'days') : pricingPeriod === 'monthly' ? (duration === 1 ? 'month' : 'months') : (duration === 1 ? 'year' : 'years')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="font-medium text-gray-700">Total ({quantity} person{quantity > 1 ? 's' : ''}):</span>
                <span className="text-xl font-bold text-blue-800">Rs.{getTotalCost().toLocaleString()}</span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex space-x-3">
              <button 
                onClick={addToRequirements}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Add to Requirements
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const StaffRequirementsModal = () => {
    const getPerPersonCost = (service) => {
      const dailyRate = service.dailyRate;
      
      switch(service.period) {
        case 'day':
        case 'days':
          return dailyRate * service.duration;
        case 'month':
        case 'months':
          return dailyRate * 30 * service.duration;
        case 'year':
        case 'years':
          return dailyRate * 365 * service.duration;
        default:
          return dailyRate * 30;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Staff Requirements Added</h3>
              <button 
                onClick={() => setShowStaffRequirements(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-4 space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-800">Successfully Added!</h4>
              </div>
              <p className="text-sm text-green-700">Your staff requirement has been added to the client's requirements list.</p>
            </div>

            {selectedServices.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Current Requirements ({selectedServices.length})</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedServices.map((service, index) => {
                    const perPersonCost = getPerPersonCost(service);
                    return (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="mb-2">
                          <p className="font-medium text-sm text-gray-800">{service.type} - {service.gender}</p>
                          <p className="text-xs text-gray-500">{service.skill} | {service.shift} | {service.location}</p>
                          <p className="text-xs text-gray-500">{service.duration} {service.period}</p>
                        </div>
                        
                        <div className="bg-blue-50 p-2 rounded text-xs">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Per Person Price:</span>
                            <span className="font-medium text-blue-800">Rs.{perPersonCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-600">Quantity:</span>
                            <span className="font-medium text-blue-800">{service.quantity} person{service.quantity > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-blue-200">
                            <span className="text-gray-600">Rs.{perPersonCost.toLocaleString()} × {service.quantity} =</span>
                            <span className="font-bold text-blue-900">Rs.{service.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-300 bg-white p-3 rounded">
                  <div className="flex justify-between items-center font-bold text-lg">
                    <span>Total Requirements Cost:</span>
                    <span className="text-blue-600">Rs.{selectedServices.reduce((sum, service) => sum + service.total, 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setShowStaffRequirements(false);
                  setShowPriceList(true);
                }}
                className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Add More Staff
              </button>
              <button 
                onClick={() => {
                  setShowStaffRequirements(false);
                  setShowQuotation(true);
                }}
                className="flex-1 bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Generate Quote
              </button>
            </div>

            <button 
              onClick={() => setShowStaffRequirements(false)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const NegotiationModal = () => {
    const [showCounterEdit, setShowCounterEdit] = useState(false);
    const [counterOffer, setCounterOffer] = useState(145000);
    const [negotiationNotes, setNegotiationNotes] = useState('');
    const [showRevisedQuotation, setShowRevisedQuotation] = useState(false);

    const handleAcceptOffer = () => {
      setShowNegotiation(false);
    };

    const handleEditCounterOffer = () => {
      setShowCounterEdit(true);
    };

    const CounterOfferEditScreen = () => {
      const [editableServices, setEditableServices] = useState([
        {
          id: 1,
          type: "Security Guard",
          shift: "Day (8AM-8PM)",
          quantity: 4,
          rate: 18000,
          total: 72000,
          editable: false
        },
        {
          id: 2,
          type: "Security Guard",
          shift: "Night (8PM-8AM)",
          quantity: 2,
          rate: 20000,
          total: 40000,
          editable: false
        },
        {
          id: 3,
          type: "Supervisor",
          shift: "Day (8AM-8PM)",
          quantity: 1,
          rate: 25000,
          total: 25000,
          editable: false
        },
        {
          id: 4,
          type: "Housekeeping",
          shift: "Day (8AM-6PM)",
          quantity: 2,
          rate: 15000,
          total: 30000,
          editable: false
        }
      ]);

      const [isEditing, setIsEditing] = useState(false);

      const toggleEdit = (id) => {
        setEditableServices(services => services.map(service => 
          service.id === id 
            ? { ...service, editable: !service.editable }
            : { ...service, editable: false }
        ));
      };

      const updateRate = (id, newRate) => {
        setEditableServices(services => services.map(service => 
          service.id === id 
            ? { 
                ...service, 
                rate: Number(newRate),
                total: service.quantity * Number(newRate)
              }
            : service
        ));
      };

      const updateQuantity = (id, newQuantity) => {
        setEditableServices(services => services.map(service => 
          service.id === id 
            ? { 
                ...service, 
                quantity: Number(newQuantity),
                total: Number(newQuantity) * service.rate
              }
            : service
        ));
      };

      const totalMonthlyCost = editableServices.reduce((sum, service) => sum + service.total, 0);

      return (
        <div className="p-4 space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <button 
              onClick={() => setShowCounterEdit(false)}
              className="text-blue-500 hover:text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-semibold text-gray-800">Edit Counter Offer</h3>
          </div>

          <div className="text-center mb-4">
            <h4 className="font-bold text-lg">Tech Corp Ltd</h4>
            <p className="text-sm text-gray-500">Valid till: 2024-10-15</p>
          </div>
          
          <div className="space-y-2">
            {editableServices.map((service) => (
              <div key={service.id} className="bg-gray-50 p-3 rounded-lg relative">
                {service.editable && (
                  <div className="absolute top-2 right-2">
                    <button 
                      onClick={() => toggleEdit(service.id)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                )}
                
                <div className="flex justify-between items-start mb-1">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.type}</p>
                    <p className="text-xs text-gray-500">{service.shift}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">Rs.{service.total.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-600 items-center">
                  <div>
                    {service.editable ? (
                      <div className="flex items-center space-x-2">
                        <span>Qty:</span>
                        <input
                          type="number"
                          min="1"
                          value={service.quantity}
                          onChange={(e) => updateQuantity(service.id, e.target.value)}
                          className="w-16 p-1 border border-gray-300 rounded"
                        />
                      </div>
                    ) : (
                      <span>Qty: {service.quantity}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {service.editable ? (
                      <div className="flex items-center space-x-2">
                        <span>Rate:</span>
                        <input
                          type="number"
                          value={service.rate}
                          onChange={(e) => updateRate(service.id, e.target.value)}
                          className="w-20 p-1 border border-gray-300 rounded text-right"
                        />
                        <span>/month</span>
                      </div>
                    ) : (
                      <>
                        <span>Rate: Rs.{service.rate.toLocaleString()}/month</span>
                        {isEditing && !service.editable && (
                          <button 
                            onClick={() => toggleEdit(service.id)}
                            className="text-blue-600 hover:text-blue-800 ml-2"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total Monthly Cost:</span>
              <span>Rs.{totalMonthlyCost.toLocaleString()}</span>
            </div>
            {isEditing && (
              <div className="flex justify-between items-center text-sm text-gray-600 mt-1">
                <span>Original Total: Rs.167,000</span>
                <span className={totalMonthlyCost > 167000 ? 'text-red-600' : 'text-green-600'}>
                  {totalMonthlyCost > 167000 ? '+' : ''}{((totalMonthlyCost - 167000) / 1000).toFixed(0)}K
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isEditing ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Edit Rates'}
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-1">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </button>
            <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      );
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                {showCounterEdit ? 'Edit Counter Offer' : 'Negotiation Tracker'}
              </h3>
              <button 
                onClick={() => {
                  setShowNegotiation(false);
                  setShowCounterEdit(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {showCounterEdit ? (
            <CounterOfferEditScreen />
          ) : (
            <div className="p-4 space-y-4">
              <div className="text-center">
                <h4 className="font-bold text-lg">{selectedClient?.name || 'Client'}</h4>
                <p className="text-sm text-gray-500">Negotiation in Progress</p>
              </div>
              
              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-sm text-blue-800">Original Quote</p>
                  <p className="text-xl font-bold text-blue-900">Rs.1,67,000/month</p>
                </div>
                
                <div 
                  className="bg-orange-50 p-3 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={handleEditCounterOffer}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-sm text-orange-800">Client Counter Offer</p>
                      <p className="text-xl font-bold text-orange-900">Rs.1,45,000/month</p>
                    </div>
                    <div className="text-orange-600">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 mt-1">Click to edit and generate revised quotation</p>
                  <p className="text-xs text-orange-500 mt-1">Received: Sep 14, 2024</p>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="deploy-date" className="block text-sm font-medium text-gray-700">Deploy Date</label>
                <input 
                  type='date' 
                  id="deploy-date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="negotiation-notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea 
                  id="negotiation-notes"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20" 
                  placeholder="Add negotiation notes..."
                  value={negotiationNotes}
                  onChange={(e) => setNegotiationNotes(e.target.value)}
                ></textarea>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={handleAcceptOffer}
                  className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Accept Offer
                </button>
                <button 
                  onClick={handleEditCounterOffer}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
                >
                  Send Counter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ClientRequisitionForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Client Requisition Form</h3>
            <button 
              onClick={() => setShowClientForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Company Information</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter company name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address *</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20" 
                  placeholder="Enter complete address with pincode"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">Contact Information</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person Name *</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="Enter contact person name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                <input 
                  type="text" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="e.g., HR Manager, Operations Head"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input 
                  type="tel" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="+91 9876543210"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email" 
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="contact@company.com"
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-3">Service Requirements</h4>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Services</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
                    <span className="text-sm">Security Guards</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
                    <span className="text-sm">Supervisors</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 mr-2" />
                    <span className="text-sm">Housekeeping Staff</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Working Hours</option>
                  <option value="day_only">Day Only (8AM - 8PM)</option>
                  <option value="night_only">Night Only (8PM - 8AM)</option>
                  <option value="24x7">24x7 Operations</option>
                  <option value="business_hours">Business Hours (9AM - 6PM)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t">
            <button 
              onClick={() => setShowClientForm(false)}
              className="flex-1 bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Save & Schedule Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">SecureForce HRMS</h1>
            <p className="text-sm text-gray-500">Field Officer Dashboard</p>
          </div>
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pb-20">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'requirements' && selectedClient && <RequirementsTab />}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200">
        <div className="grid grid-cols-3 gap-1 p-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('clients')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              activeTab === 'clients' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <MapPin className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Clients</span>
          </button>
          <button 
            onClick={() => setActiveTab('quotations')}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              activeTab === 'quotations' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <FileText className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Quotations</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showQuotation && <QuotationModal />}
      {showNegotiation && <NegotiationModal />}
      {showClientForm && <ClientRequisitionForm />}
      {showPriceList && <PriceListModal />}
      {showStaffRequirements && <StaffRequirementsModal />}
    </div>
  );
};

export default Temp2;