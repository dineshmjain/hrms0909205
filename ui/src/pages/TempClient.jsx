import React, { useState } from 'react';
import { Plus, User, MapPin, Clock, Users, FileText, MessageCircle, Mail, CheckCircle, Calendar, Phone, ShoppingCart, Star, X } from 'lucide-react';

const TempClient = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showPriceList, setShowPriceList] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showActiveClients, setShowActiveClients] = useState(false);
  const [showPOList, setShowPOList] = useState(false);
  const [showVisitsToday, setShowVisitsToday] = useState(false);
  const [showMonthlyTarget, setShowMonthlyTarget] = useState(false);
  const [showScheduleOptions, setShowScheduleOptions] = useState(false);

  // Helper functions
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
      case 'active':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1);
  };

  // Data arrays
  const clients = [
    { 
      id: 1, 
      name: 'Tech Corp Ltd', 
      location: 'Sector 5, Gurgaon', 
      status: 'pending', 
      lastVisit: '2024-09-10',
      contact: 'Rajesh Kumar - HR Manager',
      phone: '+91 9876543210',
      isActive: true,
      contractValue: 167000,
      startDate: '2024-01-15'
    },
    { 
      id: 2, 
      name: 'Manufacturing Inc', 
      location: 'Industrial Area, Noida', 
      status: 'po_received', 
      lastVisit: '2024-09-12',
      contact: 'Priya Sharma - Operations Head',
      phone: '+91 9876543211',
      isActive: true,
      contractValue: 245000,
      poNumber: 'PO-2024-001',
      poValue: 240000,
      poDate: '2024-09-12'
    },
    { 
      id: 3, 
      name: 'Retail Chain', 
      location: 'Mall Road, Delhi', 
      status: 'negotiating', 
      lastVisit: '2024-09-14',
      contact: 'Amit Singh - Store Manager',
      phone: '+91 9876543212',
      isActive: false,
      contractValue: 189000
    },
    {
      id: 4,
      name: 'Office Complex',
      location: 'Cyber City, Gurgaon',
      status: 'active',
      lastVisit: '2024-09-15',
      contact: 'Meera Gupta - Facility Manager',
      phone: '+91 9876543213',
      isActive: true,
      contractValue: 320000,
      startDate: '2024-02-01'
    }
  ];

  const todayVisits = [
    {
      id: 1,
      clientName: 'Tech Corp Ltd',
      time: '10:00 AM',
      purpose: 'Contract Renewal Discussion',
      status: 'completed',
      outcome: 'Positive response, quotation requested',
      contactPerson: 'Rajesh Kumar',
      location: 'Sector 5, Gurgaon'
    },
    {
      id: 2,
      clientName: 'New Prospect - IT Park',
      time: '2:00 PM',
      purpose: 'Initial Requirements Assessment',
      status: 'scheduled',
      outcome: '',
      contactPerson: 'Ankita Verma',
      location: 'Sector 18, Noida'
    },
    {
      id: 3,
      clientName: 'Manufacturing Inc',
      time: '4:30 PM',
      purpose: 'Service Quality Review',
      status: 'completed',
      outcome: 'Discussed additional housekeeping staff requirement',
      contactPerson: 'Priya Sharma',
      location: 'Industrial Area, Noida'
    }
  ];

  const monthlyTargets = [
    {
      month: 'September 2024',
      target: 500000,
      achieved: 425000,
      balance: 75000,
      newClientsTarget: 5,
      newClientsAchieved: 3,
      quotationsTarget: 15,
      quotationsAchieved: 12,
      conversionsTarget: 8,
      conversionsAchieved: 6
    },
    {
      month: 'August 2024',
      target: 480000,
      achieved: 520000,
      balance: -40000,
      newClientsTarget: 4,
      newClientsAchieved: 6,
      quotationsTarget: 12,
      quotationsAchieved: 14,
      conversionsTarget: 7,
      conversionsAchieved: 8
    }
  ];

  // Price List Database
  const priceList = {
    securityGuards: {
      male: {
        cityLimit: {
          basic: { day: 15000, night: 17000, rotating: 16000 },
          trained: { day: 18000, night: 20000, rotating: 19000 }
        },
        outOfCity: {
          basic: { day: 17000, night: 19000, rotating: 18000 },
          trained: { day: 20000, night: 22000, rotating: 21000 }
        }
      },
      female: {
        cityLimit: {
          basic: { day: 16000, night: 18000, rotating: 17000 },
          trained: { day: 19000, night: 21000, rotating: 20000 }
        },
        outOfCity: {
          basic: { day: 18000, night: 20000, rotating: 19000 },
          trained: { day: 21000, night: 23000, rotating: 22000 }
        }
      }
    },
    supervisors: {
      male: {
        cityLimit: {
          basic: { day: 22000, night: 25000, rotating: 23500 },
          experienced: { day: 28000, night: 31000, rotating: 29500 }
        },
        outOfCity: {
          basic: { day: 25000, night: 28000, rotating: 26500 },
          experienced: { day: 31000, night: 34000, rotating: 32500 }
        }
      },
      female: {
        cityLimit: {
          basic: { day: 23000, night: 26000, rotating: 24500 },
          experienced: { day: 29000, night: 32000, rotating: 30500 }
        },
        outOfCity: {
          basic: { day: 26000, night: 29000, rotating: 27500 },
          experienced: { day: 32000, night: 35000, rotating: 33500 }
        }
      }
    },
    housekeeping: {
      male: {
        cityLimit: {
          basic: { day: 12000, night: 14000, rotating: 13000 },
          skilled: { day: 15000, night: 17000, rotating: 16000 }
        },
        outOfCity: {
          basic: { day: 14000, night: 16000, rotating: 15000 },
          skilled: { day: 17000, night: 19000, rotating: 18000 }
        }
      },
      female: {
        cityLimit: {
          basic: { day: 12500, night: 14500, rotating: 13500 },
          skilled: { day: 15500, night: 17500, rotating: 16500 }
        },
        outOfCity: {
          basic: { day: 14500, night: 16500, rotating: 15500 },
          skilled: { day: 17500, night: 19500, rotating: 18500 }
        }
      }
    }
  };

  const DashboardTab = () => (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowActiveClients(true)}
          className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-left hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Active Clients</p>
              <p className="text-2xl font-bold text-blue-800">4</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </button>
        <button 
          onClick={() => setShowPOList(true)}
          className="bg-green-50 p-4 rounded-lg border border-green-200 text-left hover:bg-green-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">POs Received</p>
              <p className="text-2xl font-bold text-green-800">1</p>
            </div>
            <ShoppingCart className="h-8 w-8 text-green-500" />
          </div>
        </button>
        <button 
          onClick={() => setShowVisitsToday(true)}
          className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 text-left hover:bg-yellow-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Visits Today</p>
              <p className="text-2xl font-bold text-yellow-800">3</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </button>
        <button 
          onClick={() => setShowMonthlyTarget(true)}
          className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-left hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Monthly Target</p>
              <p className="text-2xl font-bold text-purple-800">85%</p>
            </div>
            <Star className="h-8 w-8 text-purple-500" />
          </div>
        </button>
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
          <button 
            onClick={() => setShowScheduleOptions(true)}
            className="flex items-center justify-center space-x-2 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
          >
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
          ← Back
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
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">₹{service.rate?.toLocaleString()}/month</p>
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
        >
          Generate Quotation
        </button>
      </div>
    </div>
  );

  // Modal Components
  const ActiveClientsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Active Clients</h3>
            <button onClick={() => setShowActiveClients(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {clients.filter(client => client.isActive).map((client) => (
            <div key={client.id} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-gray-800">{client.name}</h4>
              <p className="text-sm text-gray-600">{client.location}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-green-600">₹{client.contractValue.toLocaleString()}/month</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClasses(client.status)}`}>
                  {formatStatus(client.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const POListModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Purchase Orders Received</h3>
            <button onClick={() => setShowPOList(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {clients.filter(client => client.status === 'po_received').map((client) => (
            <div key={client.id} className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-gray-800">{client.name}</h4>
              <p className="text-sm text-gray-600">{client.location}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold text-green-600">₹{client.poValue?.toLocaleString()}</span>
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                  {client.poNumber}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const VisitsTodayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Today's Visits</h3>
            <button onClick={() => setShowVisitsToday(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {todayVisits.map((visit) => (
            <div key={visit.id} className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-gray-800">{visit.clientName}</h4>
                <span className="font-semibold text-yellow-600">{visit.time}</span>
              </div>
              <p className="text-sm text-gray-600">{visit.purpose}</p>
              <p className="text-xs text-gray-500">Contact: {visit.contactPerson}</p>
              {visit.outcome && (
                <p className="text-sm text-green-600 mt-2">Outcome: {visit.outcome}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const MonthlyTargetModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Targets</h3>
            <button onClick={() => setShowMonthlyTarget(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          {monthlyTargets.map((target, index) => (
            <div key={index} className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-gray-800">{target.month}</h4>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="font-bold text-purple-600">₹{target.target.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Achieved</p>
                  <p className="font-bold text-green-600">₹{target.achieved.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ScheduleOptionsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Schedule Visit Options</h3>
            <button onClick={() => setShowScheduleOptions(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Quick Schedule</h4>
            <div className="space-y-2">
              <button className="w-full bg-white p-3 rounded-lg text-left hover:bg-blue-100 transition-colors">
                <p className="font-medium text-gray-800">Follow-up Visits</p>
                <p className="text-sm text-gray-600">Schedule follow-ups for pending quotations</p>
              </button>
              <button className="w-full bg-white p-3 rounded-lg text-left hover:bg-blue-100 transition-colors">
                <p className="font-medium text-gray-800">Contract Renewals</p>
                <p className="text-sm text-gray-600">Clients with contracts expiring soon</p>
              </button>
            </div>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => setShowScheduleOptions(false)} className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Custom Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const QuotationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Quotation</h3>
            <button onClick={() => setShowQuotation(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-center mb-4">
            <h4 className="font-bold text-lg">{selectedClient?.name || 'Tech Corp Ltd'}</h4>
            <p className="text-sm text-gray-500">Valid till: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-bold">
              <span>Total Monthly Cost:</span>
              <span>₹1,67,000</span>
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
        </div>
      </div>
    </div>
  );

  const NegotiationModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Negotiation Tracker</h3>
            <button onClick={() => setShowNegotiation(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="text-center">
            <h4 className="font-bold text-lg">{selectedClient?.name || 'Client'}</h4>
            <p className="text-sm text-gray-500">Negotiation in Progress</p>
          </div>
          <div className="space-y-3">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="font-medium text-sm text-blue-800">Original Quote</p>
              <p className="text-xl font-bold text-blue-900">₹1,67,000/month</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="font-medium text-sm text-orange-800">Client Counter Offer</p>
              <p className="text-xl font-bold text-orange-900">₹1,45,000/month</p>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="counter-offer" className="block text-sm font-medium text-gray-700">Your Counter Offer</label>
            <input 
              id="counter-offer"
              type="number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Enter revised amount"
              defaultValue="155000"
            />
          </div>
          <div className="flex space-x-2">
            <button className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors">
              Accept Offer
            </button>
            <button className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
              Send Counter
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const ClientRequisitionForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Client Requisition Form</h3>
            <button onClick={() => setShowClientForm(false)} className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3">Company Information</h4>
            <div className="space-y-3">
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Company Name" />
              <textarea className="w-full p-3 border border-gray-300 rounded-lg h-20" placeholder="Complete Address"></textarea>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="font-semibold text-green-800 mb-3">Contact Information</h4>
            <div className="space-y-3">
              <input type="text" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Contact Person Name" />
              <input type="tel" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="+91 9876543210" />
              <input type="email" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="contact@company.com" />
            </div>
          </div>
          <div className="flex space-x-3">
            <button onClick={() => setShowClientForm(false)} className="flex-1 bg-gray-100 text-gray-600 py-3 px-4 rounded-lg font-medium">
              Cancel
            </button>
            <button className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium">
              Save & Schedule Visit
            </button>
          </div>
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

    const getCurrentRate = () => {
      return priceList[selectedCategory]?.[selectedGender]?.[selectedLocation]?.[selectedSkill]?.[selectedShift] || 0;
    };

    const getSkillOptions = () => {
      const skills = priceList[selectedCategory]?.[selectedGender]?.[selectedLocation] || {};
      return Object.keys(skills);
    };

    const addService = () => {
      const rate = getCurrentRate();
      if (rate) {
        const service = {
          type: selectedCategory.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
          gender: selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1),
          location: selectedLocation === 'cityLimit' ? 'City Limit' : 'Out of City',
          skill: selectedSkill.charAt(0).toUpperCase() + selectedSkill.slice(1),
          shift: selectedShift.charAt(0).toUpperCase() + selectedShift.slice(1),
          rate: rate,
          quantity: quantity,
          total: rate * quantity
        };
        setSelectedServices([...selectedServices, service]);
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Staff Price List</h3>
              <button onClick={() => setShowPriceList(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Staff Category</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                <option value="securityGuards">Security Guards</option>
                <option value="supervisors">Supervisors</option>
                <option value="housekeeping">Housekeeping Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSelectedGender('male')} className={`p-3 rounded-lg border text-sm font-medium ${selectedGender === 'male' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  Male
                </button>
                <button onClick={() => setSelectedGender('female')} className={`p-3 rounded-lg border text-sm font-medium ${selectedGender === 'female' ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  Female
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSelectedLocation('cityLimit')} className={`p-3 rounded-lg border text-sm font-medium ${selectedLocation === 'cityLimit' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  City Limit
                </button>
                <button onClick={() => setSelectedLocation('outOfCity')} className={`p-3 rounded-lg border text-sm font-medium ${selectedLocation === 'outOfCity' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  Out of City
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
              <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg">
                {getSkillOptions().map(skill => (
                  <option key={skill} value={skill}>{skill.charAt(0).toUpperCase() + skill.slice(1)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setSelectedShift('day')} className={`p-2 rounded-lg border text-sm font-medium ${selectedShift === 'day' ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  Day
                </button>
                <button onClick={() => setSelectedShift('night')} className={`p-2 rounded-lg border text-sm font-medium ${selectedShift === 'night' ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  Night
                </button>
                <button onClick={() => setSelectedShift('rotating')} className={`p-2 rounded-lg border text-sm font-medium ${selectedShift === 'rotating' ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-700'}`}>
                  Rotating
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
              <div className="flex items-center space-x-3">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full">-</button>
                <span className="font-semibold text-lg w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="bg-gray-200 text-gray-700 w-10 h-10 rounded-full">+</button>
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total Cost:</span>
                <span className="text-xl font-bold text-blue-800">₹{(getCurrentRate() * quantity).toLocaleString()}</span>
              </div>
            </div>
            <button onClick={addService} className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              Add to Requirements
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-md mx-auto bg-gray-100 min-h-screen">
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

      <div className="pb-20">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'clients' && <ClientsTab />}
        {activeTab === 'requirements' && selectedClient && <RequirementsTab />}
      </div>

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

      {showActiveClients && <ActiveClientsModal />}
      {showPOList && <POListModal />}
      {showVisitsToday && <VisitsTodayModal />}
      {showMonthlyTarget && <MonthlyTargetModal />}
      {showScheduleOptions && <ScheduleOptionsModal />}
      {showQuotation && <QuotationModal />}
      {showNegotiation && <NegotiationModal />}
      {showClientForm && <ClientRequisitionForm />}
      {showPriceList && <PriceListModal />}
    </div>
  );
};

export default TempClient;






