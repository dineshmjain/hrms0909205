import React, { useState } from 'react';
import {
  Building2,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Eye,
  // Edit,
  Plus,
  Users,
  Activity,
  Briefcase,
  UserCheck,
  Pencil
} from 'lucide-react';

const Edit = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Dummy lead data
  const lead = {
    _id: '68db5d59d852c16e3b603515',
    companyName: 'PR Groups',
    companayAddress: 'Rajaji Puram, Lucknow, UP - 226017',
    contactPerson: 'Ashwath Kumar',
    mobile: '7896457941',
    contactPersonDesignation: 'Manager - Operations',
    contactPersonEmail: 'ashwath@prgroup.com',
    status: 'Negotiation',
    subOrgName: 'North Region Office',
    branchId: '6863662d1dae9e9594f332b4',
    createdDate: '2025-09-26T06:08:41.011Z',
    modifiedDate: '2025-10-03T10:15:30.000Z',
    createdByName: {
      firstName: 'Ram',
      lastName: 'Kumar'
    }
  };

  // Real API structure quotations data
  const quotations = [
    {
      _id: "68db7dbe3e1c71ec80578d7b",
      orgId: "686366071dae9e9594f3329b",
      leadId: "68db5d59d852c16e3b603515",
      subscriptionType: "Daily",
      quotationDate: "2025-09-30",
      createdAt: "2025-09-30T06:50:38.404Z",
      status: "Pending",
      isActive: true,
      negotation: [
        {
          _id: "68db7dbe3e1c71ec80578d7c",
          round: 1,
          quotationDate: "2025-09-30",
          requirements: [
            {
              designationId: "68662bc2ef10b3efbe851f49",
              designationName: "Security Guard",
              noOfPositions: 2,
              gender: "male",
              price: 25000,
              limits: "city",
              shiftType: "day"
            },
            {
              designationId: "68662bc2ef10b3efbe851f49",
              designationName: "Security Guard",
              noOfPositions: 2,
              gender: "female",
              price: 25000,
              limits: "city",
              shiftType: "day"
            }
          ],
          comment: "Initial quotation with standard pricing",
          createdAt: "2025-09-30T06:50:38.416Z",
          createdByName: { firstName: "Srija", lastName: "Reddy" }
        },
        {
          _id: "68db7ddf3e1c71ec80578d7d",
          round: 2,
          quotationDate: "2025-10-02",
          requirements: [
            {
              designationId: "68662bc2ef10b3efbe851f49",
              designationName: "Security Guard",
              noOfPositions: 2,
              gender: "male",
              price: 23000,
              limits: "city",
              shiftType: "day"
            },
            {
              designationId: "68662bc2ef10b3efbe851f49",
              designationName: "Security Guard",
              noOfPositions: 2,
              gender: "female",
              price: 23000,
              limits: "city",
              shiftType: "day"
            }
          ],
          comment: "Revised pricing after client negotiation - 8% discount applied",
          createdAt: "2025-10-02T10:30:00.000Z",
          createdByName: { firstName: "Srija", lastName: "Reddy" }
        },
        {
          _id: "68db7e003e1c71ec80578d7e",
          round: 3,
          quotationDate: "2025-10-03",
          requirements: [
            {
              designationId: "68662bc2ef10b3efbe851f49",
              designationName: "Security Guard",
              noOfPositions: 3,
              gender: "male",
              price: 23000,
              limits: "city",
              shiftType: "day"
            },
            {
              designationId: "68662bc2ef10b3efbe851f49",
              designationName: "Security Guard",
              noOfPositions: 1,
              gender: "female",
              price: 23000,
              limits: "city",
              shiftType: "day"
            }
          ],
          comment: "Final revision - Client increased male positions and reduced female positions",
          createdAt: "2025-10-03T14:15:00.000Z",
          createdByName: { firstName: "Srija", lastName: "Reddy" }
        }
      ]
    },
    {
      _id: "68dc8faa4f2e81fc91689e8c",
      subscriptionType: "Monthly",
      quotationDate: "2025-10-01",
      createdAt: "2025-10-01T09:20:15.404Z",
      status: "Accepted",
      isActive: true,
      negotation: [
        {
          _id: "68dc8faa4f2e81fc91689e8d",
          round: 1,
          quotationDate: "2025-10-01",
          requirements: [
            {
              designationId: "68662bc2ef10b3efbe851f48",
              designationName: "Supervisor",
              noOfPositions: 1,
              gender: "male",
              price: 35000,
              limits: "city",
              shiftType: "day"
            },
            {
              designationId: "68662bc2ef10b3efbe851f49",
              designationName: "Security Guard",
              noOfPositions: 5,
              gender: "male",
              price: 22000,
              limits: "city",
              shiftType: "day"
            }
          ],
          comment: "Monthly subscription package approved by client",
          createdAt: "2025-10-01T09:20:15.416Z",
          createdByName: { firstName: "Ram", lastName: "Kumar" }
        }
      ]
    }
  ];

  // Mock visits data
  const visits = [
    {
      _id: '1',
      visitDate: '2025-09-28T10:00:00.000Z',
      visitType: 'Initial Meeting',
      status: 'completed',
      purpose: 'Requirement discussion and site visit',
      attendees: ['Ashwath Kumar - Manager', 'Ram Kumar - Sales'],
      outcome: 'Positive response, client needs 4 security guards',
      nextAction: 'Prepare quotation for daily subscription',
      notes: 'Client requires security personnel for day shift only. Budget discussed: ₹20-25k per position',
      createdBy: { firstName: 'Ram', lastName: 'Kumar' },
      duration: '2 hours'
    },
    {
      _id: '2',
      visitDate: '2025-09-30T14:00:00.000Z',
      visitType: 'Quotation Presentation',
      status: 'completed',
      purpose: 'Present initial quotation and discuss terms',
      attendees: ['Ashwath Kumar - Manager', 'Ram Kumar - Sales', 'Srija Reddy - Sales'],
      outcome: 'Client requested 8% discount on pricing',
      nextAction: 'Revise quotation with management approval',
      notes: 'Client impressed with our services. Requested price revision due to budget constraints',
      createdBy: { firstName: 'Srija', lastName: 'Reddy' },
      duration: '1.5 hours'
    },
    {
      _id: '3',
      visitDate: '2025-10-02T11:00:00.000Z',
      visitType: 'Negotiation Meeting',
      status: 'completed',
      purpose: 'Present revised quotation and finalize terms',
      attendees: ['Ashwath Kumar - Manager', 'Srija Reddy - Sales'],
      outcome: 'Client accepted revised pricing but changed position requirements',
      nextAction: 'Prepare final quotation with updated positions',
      notes: 'Client now wants 3 male and 1 female guard instead of 2+2. Same pricing accepted',
      createdBy: { firstName: 'Srija', lastName: 'Reddy' },
      duration: '2 hours'
    },
    {
      _id: '4',
      visitDate: '2025-10-05T10:00:00.000Z',
      visitType: 'Contract Finalization',
      status: 'scheduled',
      purpose: 'Final agreement signing and documentation',
      attendees: ['Ashwath Kumar - Manager', 'Ram Kumar - Sales'],
      outcome: '',
      nextAction: 'Get contract signed and onboard security personnel',
      notes: 'Scheduled for final contract signing and deployment date discussion',
      createdBy: { firstName: 'Ram', lastName: 'Kumar' },
      duration: '1 hour'
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateQuotationTotal = (requirements) => {
    return requirements.reduce((total, req) => total + (req.price * req.noOfPositions), 0);
  };

  const statusConfig = {
    Pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    Negotiation: { label: 'Negotiation', color: 'bg-blue-100 text-blue-800', icon: TrendingUp },
    Accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    Rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle }
  };

  const visitStatusConfig = {
    scheduled: { label: 'Scheduled', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
    rescheduled: { label: 'Rescheduled', color: 'bg-yellow-100 text-yellow-800' }
  };

  const StatusIcon = statusConfig[lead.status]?.icon || Clock;
  const totalNegotiations = quotations.reduce((sum, quot) => sum + (quot.negotation?.length || 0), 0);

  return (
    <div className="flex flex-col gap-6 p-4 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                {lead.companyName}
              </h1>
              <p className="text-gray-600 mt-1">Lead Details & Activity Timeline</p>
            </div>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Edit Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Lead Status</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[lead.status]?.color}`}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig[lead.status]?.label}
              </span>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Quotations</p>
              <p className="text-3xl font-bold text-gray-900">{quotations.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {quotations.filter(q => q.status === 'Accepted').length} accepted
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Negotiation Rounds</p>
              <p className="text-3xl font-bold text-gray-900">{totalNegotiations}</p>
              <p className="text-xs text-gray-500 mt-1">Across all quotations</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Total Visits</p>
              <p className="text-3xl font-bold text-gray-900">{visits.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                {visits.filter(v => v.status === 'completed').length} completed
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('quotations')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'quotations'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Quotations & Negotiations ({quotations.length})
            </button>
            <button
              onClick={() => setActiveTab('visits')}
              className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'visits'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Visits & Status ({visits.length})
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Company Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium text-gray-900">{lead.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{lead.companayAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Sub Organization</p>
                      <p className="font-medium text-gray-900">{lead.subOrgName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium text-gray-900">{lead.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium text-gray-900">{lead.contactPersonDesignation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium text-gray-900">{lead.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{lead.contactPersonEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Lead Tracking
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Created Date</p>
                      <p className="font-medium text-gray-900">{formatDate(lead.createdDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Last Modified</p>
                      <p className="font-medium text-gray-900">{formatDate(lead.modifiedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Created By</p>
                      <p className="font-medium text-gray-900">
                        {lead.createdByName?.firstName} {lead.createdByName?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">Current Status</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[lead.status]?.color}`}>
                        {statusConfig[lead.status]?.label}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quotations Tab */}
          {activeTab === 'quotations' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Quotations & Negotiations</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Quotation
                </button>
              </div>

              <div className="space-y-6">
                {quotations.map((quotation, qIdx) => (
                  <div key={quotation._id} className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                    <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-300">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-gray-900">Quotation #{qIdx + 1}</h4>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[quotation.status]?.color}`}>
                            {statusConfig[quotation.status]?.label}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {quotation.subscriptionType}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Date: {formatDate(quotation.quotationDate)}</span>
                          <span>•</span>
                          <span>Rounds: {quotation.negotation?.length || 0}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-md font-semibold text-gray-900 flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                        Negotiation History ({quotation.negotation?.length || 0} Rounds)
                      </h5>

                      {quotation.negotation && quotation.negotation.map((negotiation, nIdx) => {
                        const totalAmount = calculateQuotationTotal(negotiation.requirements);
                        const previousNegotiation = nIdx > 0 ? quotation.negotation[nIdx - 1] : null;
                        const previousTotal = previousNegotiation ? calculateQuotationTotal(previousNegotiation.requirements) : 0;
                        const priceDifference = previousTotal > 0 ? totalAmount - previousTotal : 0;

                        return (
                          <div key={negotiation._id} className="bg-white p-5 rounded-lg border border-gray-200">
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                                    R{negotiation.round}
                                  </div>
                                  <h6 className="text-lg font-semibold text-gray-900">Round {negotiation.round}</h6>
                                  {priceDifference !== 0 && (
                                    <span className={`text-xs font-medium ${priceDifference < 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {priceDifference < 0 ? '↓' : '↑'} {formatCurrency(Math.abs(priceDifference))}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                  <span>Date: {formatDate(negotiation.quotationDate)}</span>
                                  <span>•</span>
                                  <span>By: {negotiation.createdByName?.firstName} {negotiation.createdByName?.lastName}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                                <p className="text-xs text-gray-500">Total Amount</p>
                              </div>
                            </div>

                            <div className="overflow-x-auto mb-4">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Designation</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Gender</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Positions</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Shift</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Limits</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Price/Position</th>
                                    <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Total</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {negotiation.requirements.map((req, rIdx) => (
                                    <tr key={rIdx}>
                                      <td className="px-4 py-2 text-sm text-gray-900">
                                        <div className="flex items-center gap-2">
                                          <UserCheck className="h-4 w-4 text-blue-600" />
                                          {req.designationName}
                                        </div>
                                      </td>
                                      <td className="px-4 py-2 text-sm text-gray-600 capitalize">{req.gender}</td>
                                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{req.noOfPositions}</td>
                                      <td className="px-4 py-2 text-sm text-gray-600 capitalize">{req.shiftType}</td>
                                      <td className="px-4 py-2 text-sm text-gray-600 capitalize">{req.limits}</td>
                                      <td className="px-4 py-2 text-sm text-right text-gray-900">{formatCurrency(req.price)}</td>
                                      <td className="px-4 py-2 text-sm text-right font-semibold text-gray-900">
                                        {formatCurrency(req.price * req.noOfPositions)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-gray-50">
                                  <tr>
                                    <td colSpan="6" className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                                      Round Total:
                                    </td>
                                    <td className="px-4 py-2 text-right text-sm font-bold text-gray-900">
                                      {formatCurrency(totalAmount)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>

                            {negotiation.comment && (
                              <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                <p className="text-sm text-gray-700">
                                  <strong className="text-gray-900">Comment:</strong> {negotiation.comment}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Visit History & Status Updates</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Schedule Visit
                </button>
              </div>

              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {visits.map((visit) => (
                    <div key={visit._id} className="relative pl-16">
                      <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                        visit.status === 'completed' ? 'bg-green-500' :
                        visit.status === 'scheduled' ? 'bg-blue-500' :
                        visit.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>

                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold text-gray-900">{visit.visitType}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${visitStatusConfig[visit.status]?.color}`}>
                                {visitStatusConfig[visit.status]?.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDateTime(visit.visitDate)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {visit.duration}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="bg-white p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">Purpose</p>
                            <p className="text-sm text-gray-900">{visit.purpose}</p>
                          </div>
                          {visit.outcome && (
                            <div className="bg-white p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1">Outcome</p>
                              <p className="text-sm text-gray-900">{visit.outcome}</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-3 rounded-lg mb-4">
                          <p className="text-xs text-gray-500 mb-2">Attendees</p>
                          <div className="flex flex-wrap gap-2">
                            {visit.attendees.map((attendee, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                <Users className="h-3 w-3" />
                                {attendee}
                              </span>
                            ))}
                          </div>
                        </div>

                        {visit.notes && (
                          <div className="bg-blue-50 p-3 rounded-lg mb-4">
                            <p className="text-xs text-gray-500 mb-1">Notes</p>
                            <p className="text-sm text-gray-700">{visit.notes}</p>
                          </div>
                        )}

                        {visit.nextAction && (
                          <div className="bg-yellow-50 p-3 rounded-lg mb-4 border-l-4 border-yellow-400">
                            <p className="text-xs text-gray-500 mb-1">Next Action</p>
                            <p className="text-sm text-gray-900 font-medium">{visit.nextAction}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-500">
                            Logged by {visit.createdBy.firstName} {visit.createdBy.lastName}
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs">
                              <Eye className="h-3 w-3" />
                              View Details
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs">
                              <Pencil className="h-3 w-3" />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Edit;