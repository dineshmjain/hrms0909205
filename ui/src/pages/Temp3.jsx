import React, { useState } from 'react';
import { Plus, User, MapPin, Clock, Users, FileText, Send, MessageCircle, Mail, Edit3, CheckCircle, Calendar, Phone } from 'lucide-react';

const Temp3 = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showNegotiation, setShowNegotiation] = useState(false);

  const clients = [
    { id: 1, name: 'Tech Corp Ltd', location: 'Sector 5, Gurgaon', status: 'pending', lastVisit: '2024-09-10' },
    { id: 2, name: 'Manufacturing Inc', location: 'Industrial Area, Noida', status: 'quoted', lastVisit: '2024-09-12' },
    { id: 3, name: 'Retail Chain', location: 'Mall Road, Delhi', status: 'negotiating', lastVisit: '2024-09-14' }
  ];

  const requirements = {
    securityGuards: { day: 4, night: 2, rotating: 1 },
    supervisors: { day: 1, night: 1, rotating: 0 },
    housekeeping: { day: 2, night: 1, rotating: 0 }
  };

  const quotationData = {
    client: 'Tech Corp Ltd',
    validTill: '2024-10-15',
    items: [
      { service: 'Security Guard', shift: 'Day (8AM-8PM)', quantity: 4, rate: 18000, amount: 72000 },
      { service: 'Security Guard', shift: 'Night (8PM-8AM)', quantity: 2, rate: 20000, amount: 40000 },
      { service: 'Supervisor', shift: 'Day (8AM-8PM)', quantity: 1, rate: 25000, amount: 25000 },
      { service: 'Housekeeping', shift: 'Day (8AM-6PM)', quantity: 2, rate: 15000, amount: 30000 }
    ]
  };

  const DashboardTab = () => (
    <div className="p-4 space-y-6">
      {/* Stats Cards */}
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
              <p className="text-green-600 text-sm font-medium">Quotations Sent</p>
              <p className="text-2xl font-bold text-green-800">8</p>
            </div>
            <FileText className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
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
            <Edit3 className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Requirements updated for Manufacturing Inc</p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setActiveTab('clients')}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span className="text-sm font-medium">New Client</span>
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
        <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {clients.map((client) => (
        <div key={client.id} className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-gray-800">{client.name}</h3>
              <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4" />
                <span>{client.location}</span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              client.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              client.status === 'quoted' ? 'bg-blue-100 text-blue-800' :
              'bg-orange-100 text-orange-800'
            }`}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
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
              View Requirements
            </button>
            <button className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Phone className="h-4 w-4" />
            </button>
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
        <h3 className="font-semibold text-gray-800 mb-4">Security Guards</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Day Shift (8AM-8PM)</span>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-500 text-white w-8 h-8 rounded-full text-sm">-</button>
              <span className="font-semibold w-8 text-center">{requirements.securityGuards.day}</span>
              <button className="bg-blue-500 text-white w-8 h-8 rounded-full text-sm">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Night Shift (8PM-8AM)</span>
            <div className="flex items-center space-x-2">
              <button className="bg-blue-500 text-white w-8 h-8 rounded-full text-sm">-</button>
              <span className="font-semibold w-8 text-center">{requirements.securityGuards.night}</span>
              <button className="bg-blue-500 text-white w-8 h-8 rounded-full text-sm">+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Supervisors</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Day Shift (8AM-8PM)</span>
            <div className="flex items-center space-x-2">
              <button className="bg-green-500 text-white w-8 h-8 rounded-full text-sm">-</button>
              <span className="font-semibold w-8 text-center">{requirements.supervisors.day}</span>
              <button className="bg-green-500 text-white w-8 h-8 rounded-full text-sm">+</button>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Night Shift (8PM-8AM)</span>
            <div className="flex items-center space-x-2">
              <button className="bg-green-500 text-white w-8 h-8 rounded-full text-sm">-</button>
              <span className="font-semibold w-8 text-center">{requirements.supervisors.night}</span>
              <button className="bg-green-500 text-white w-8 h-8 rounded-full text-sm">+</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Housekeeping Staff</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Day Shift (8AM-6PM)</span>
            <div className="flex items-center space-x-2">
              <button className="bg-purple-500 text-white w-8 h-8 rounded-full text-sm">-</button>
              <span className="font-semibold w-8 text-center">{requirements.housekeeping.day}</span>
              <button className="bg-purple-500 text-white w-8 h-8 rounded-full text-sm">+</button>
            </div>
          </div>
        </div>
      </div>

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
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="text-center mb-4">
            <h4 className="font-bold text-lg">{quotationData.client}</h4>
            <p className="text-sm text-gray-500">Valid till: {quotationData.validTill}</p>
          </div>
          
          <div className="space-y-2">
            {quotationData.items.map((item, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-medium text-sm">{item.service}</p>
                    <p className="text-xs text-gray-500">{item.shift}</p>
                  </div>
                  <p className="font-semibold">₹{item.amount.toLocaleString()}</p>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Qty: {item.quantity}</span>
                  <span>Rate: ₹{item.rate.toLocaleString()}/month</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-3">
            <div className="flex justify-between items-center font-bold">
              <span>Total Monthly Cost:</span>
              <span>₹{quotationData.items.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}</span>
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
            <button 
              onClick={() => setShowNegotiation(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div className="text-center">
            <h4 className="font-bold text-lg">Tech Corp Ltd</h4>
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
              <p className="text-xs text-orange-600 mt-1">Received: Sep 14, 2024</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Your Counter Offer</label>
            <input 
              type="number" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Enter revised amount"
              defaultValue="155000"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20" 
              placeholder="Add negotiation notes..."
            ></textarea>
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
        {activeTab === 'requirements' && <RequirementsTab />}
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
    </div>
  );
};

export default Temp3;