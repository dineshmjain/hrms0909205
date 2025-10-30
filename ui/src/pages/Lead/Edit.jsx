import React, { useState, useMemo } from 'react';
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
  Plus,
  Users,
  Activity,
  Briefcase,
  UserCheck,
  Pencil,
  X,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Save,
  ChevronDown,
  ChevronUp,
  History,
  TrendingDown,
  AlertCircle,
  Trash2,
  Calculator,
  DollarSign,
  Target,
  CalendarPlus,
  UserPlus
} from 'lucide-react';

// Price List Data
const PRICE_LIST = [
  {
    designationName: "Supervisor",
    priceData: {
      daily: [
        { gender: "male", cityLimit: 100, outCityLimit: 130, dayShift: 100, nightShift: 118, outCityDayShift: 130, outCityNightShift: 200 },
        { gender: "female", cityLimit: 102, outCityLimit: 132, dayShift: 102, nightShift: 120, outCityDayShift: 132, outCityNightShift: 202 }
      ],
      monthly: [
        { gender: "male", cityLimit: 3000, outCityLimit: 3900, dayShift: 3000, nightShift: 3540, outCityDayShift: 3900, outCityNightShift: 6000 },
        { gender: "female", cityLimit: 3002, outCityLimit: 3902, dayShift: 3002, nightShift: 3542, outCityDayShift: 3902, outCityNightShift: 6002 }
      ],
      yearly: [
        { gender: "male", cityLimit: 36500, outCityLimit: 47450, dayShift: 36500, nightShift: 43070, outCityDayShift: 47450, outCityNightShift: 73000 },
        { gender: "female", cityLimit: 36502, outCityLimit: 47452, dayShift: 36502, nightShift: 43072, outCityDayShift: 47452, outCityNightShift: 73002 }
      ]
    }
  },
  {
    designationName: "Security Guard",
    priceData: {
      daily: [
        { gender: "male", cityLimit: 80, outCityLimit: 104, dayShift: 80, nightShift: 94, outCityDayShift: 104, outCityNightShift: 160 },
        { gender: "female", cityLimit: 82, outCityLimit: 106, dayShift: 82, nightShift: 96, outCityDayShift: 106, outCityNightShift: 162 }
      ],
      monthly: [
        { gender: "male", cityLimit: 2400, outCityLimit: 3120, dayShift: 2400, nightShift: 2832, outCityDayShift: 3120, outCityNightShift: 4800 },
        { gender: "female", cityLimit: 2402, outCityLimit: 3122, dayShift: 2402, nightShift: 2834, outCityDayShift: 3122, outCityNightShift: 4802 }
      ],
      yearly: [
        { gender: "male", cityLimit: 29200, outCityLimit: 37960, dayShift: 29200, nightShift: 34456, outCityDayShift: 37960, outCityNightShift: 58400 },
        { gender: "female", cityLimit: 29202, outCityLimit: 37962, dayShift: 29202, nightShift: 34458, outCityDayShift: 37962, outCityNightShift: 58402 }
      ]
    }
  }
];

// Reusable Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className={`p-3 ${color} rounded-lg`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Input Field Component
const InputField = ({ label, type = 'text', value, onChange, placeholder, required, error }) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {error && (
      <div className="flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3 text-red-500" />
        <p className="text-xs text-red-500">{error}</p>
      </div>
    )}
  </div>
);

// Textarea Field Component
const TextareaField = ({ label, value, onChange, placeholder, rows = 3, required, error }) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    />
    {error && (
      <div className="flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3 text-red-500" />
        <p className="text-xs text-red-500">{error}</p>
      </div>
    )}
  </div>
);

// Select Field Component
const SelectField = ({ label, value, onChange, options, required, error }) => (
  <div className="flex-1">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
        error ? 'border-red-500 bg-red-50' : 'border-gray-300'
      }`}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// Schedule Visit Form Component
const ScheduleVisitForm = ({ onSave, onClose, leadName }) => {
  const [formData, setFormData] = useState({
    visitType: 'Site Visit',
    visitDate: '',
    visitTime: '',
    duration: '1 hour',
    purpose: '',
    attendees: '',
    notes: '',
    nextAction: ''
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.visitDate) newErrors.visitDate = 'Visit date is required';
    if (!formData.visitTime) newErrors.visitTime = 'Visit time is required';
    if (!formData.purpose.trim()) newErrors.purpose = 'Purpose is required';
    if (!formData.attendees.trim()) newErrors.attendees = 'At least one attendee is required';
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      const visitDateTime = new Date(`${formData.visitDate}T${formData.visitTime}`).toISOString();
      const visitData = {
        _id: `visit_${Date.now()}`,
        visitDate: visitDateTime,
        visitType: formData.visitType,
        status: 'scheduled',
        purpose: formData.purpose,
        attendees: formData.attendees.split(',').map(a => a.trim()),
        outcome: '',
        nextAction: formData.nextAction,
        notes: formData.notes,
        createdBy: { firstName: 'Current', lastName: 'User' },
        duration: formData.duration
      };
      onSave(visitData);
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <CalendarPlus className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Schedule New Visit</h3>
        </div>
        <p className="text-sm text-gray-600">Planning a visit for <span className="font-semibold">{leadName}</span></p>
      </div>

      {/* Visit Type & Date/Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Visit Type"
          value={formData.visitType}
          onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
          options={[
            { value: 'Site Visit', label: 'Site Visit' },
            { value: 'Initial Meeting', label: 'Initial Meeting' },
            { value: 'Quotation Presentation', label: 'Quotation Presentation' },
            { value: 'Negotiation Meeting', label: 'Negotiation Meeting' },
            { value: 'Contract Finalization', label: 'Contract Finalization' },
            { value: 'Follow-up', label: 'Follow-up' },
            { value: 'Other', label: 'Other' }
          ]}
          required
        />
        <SelectField
          label="Expected Duration"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          options={[
            { value: '30 minutes', label: '30 minutes' },
            { value: '1 hour', label: '1 hour' },
            { value: '1.5 hours', label: '1.5 hours' },
            { value: '2 hours', label: '2 hours' },
            { value: '3 hours', label: '3 hours' },
            { value: 'Half day', label: 'Half day' },
            { value: 'Full day', label: 'Full day' }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Visit Date"
          type="date"
          value={formData.visitDate}
          onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
          required
          error={errors.visitDate}
        />
        <InputField
          label="Visit Time"
          type="time"
          value={formData.visitTime}
          onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
          required
          error={errors.visitTime}
        />
      </div>

      {/* Purpose */}
      <TextareaField
        label="Purpose of Visit"
        value={formData.purpose}
        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
        placeholder="Describe the main purpose and objectives of this visit..."
        rows={3}
        required
        error={errors.purpose}
      />

      {/* Attendees */}
      <div>
        <InputField
          label="Attendees"
          value={formData.attendees}
          onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
          placeholder="e.g., John Doe - Manager, Jane Smith - Sales (comma-separated)"
          required
          error={errors.attendees}
        />
        <p className="text-xs text-gray-500 mt-1 ml-1">Separate multiple attendees with commas</p>
      </div>

      {/* Notes */}
      <TextareaField
        label="Additional Notes"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        placeholder="Any additional information, preparation needed, or special requirements..."
        rows={3}
      />

      {/* Next Action */}
      <InputField
        label="Planned Next Action"
        value={formData.nextAction}
        onChange={(e) => setFormData({ ...formData, nextAction: e.target.value })}
        placeholder="What should happen after this visit?"
      />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
        >
          <Save className="h-4 w-4" />
          Schedule Visit
        </button>
      </div>
    </div>
  );
};

// New Quotation Form Component
const NewQuotationForm = ({ onSave, onClose, leadId }) => {
  const [subscriptionType, setSubscriptionType] = useState('daily');
  const [quotationDate, setQuotationDate] = useState(new Date().toISOString().split('T')[0]);
  const [comment, setComment] = useState('');
  const [requirements, setRequirements] = useState([{
    id: Date.now(),
    designationName: 'Security Guard',
    gender: 'male',
    noOfPositions: 1,
    shiftType: 'day',
    limits: 'city',
    price: 0
  }]);

  const getPrice = (designation, gender, subscription, shiftType, limits) => {
    const priceEntry = PRICE_LIST.find(p => p.designationName === designation);
    if (!priceEntry) return 0;

    const subscriptionData = priceEntry.priceData[subscription];
    if (!subscriptionData) return 0;

    const genderData = subscriptionData.find(d => d.gender === gender);
    if (!genderData) return 0;

    let priceKey;
    if (limits === 'city') {
      priceKey = shiftType === 'day' ? 'dayShift' : 'nightShift';
    } else {
      priceKey = shiftType === 'day' ? 'outCityDayShift' : 'outCityNightShift';
    }

    return genderData[priceKey] || 0;
  };

  const updateRequirement = (id, field, value) => {
    setRequirements(prev => prev.map(req => {
      if (req.id === id) {
        const updated = { ...req, [field]: value };
        if (['designationName', 'gender', 'shiftType', 'limits'].includes(field) || field === 'noOfPositions') {
          updated.price = getPrice(
            field === 'designationName' ? value : updated.designationName,
            field === 'gender' ? value : updated.gender,
            subscriptionType,
            field === 'shiftType' ? value : updated.shiftType,
            field === 'limits' ? value : updated.limits
          );
        }
        return updated;
      }
      return req;
    }));
  };

  const addRequirement = () => {
    setRequirements(prev => [...prev, {
      id: Date.now(),
      designationName: 'Security Guard',
      gender: 'male',
      noOfPositions: 1,
      shiftType: 'day',
      limits: 'city',
      price: getPrice('Security Guard', 'male', subscriptionType, 'day', 'city')
    }]);
  };

  const removeRequirement = (id) => {
    if (requirements.length > 1) {
      setRequirements(prev => prev.filter(req => req.id !== id));
    }
  };

  const handleSubscriptionChange = (newType) => {
    setSubscriptionType(newType);
    setRequirements(prev => prev.map(req => ({
      ...req,
      price: getPrice(req.designationName, req.gender, newType, req.shiftType, req.limits)
    })));
  };

  const totalAmount = useMemo(() => {
    return requirements.reduce((sum, req) => sum + (req.price * req.noOfPositions), 0);
  }, [requirements]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSave = () => {
    const quotationData = {
      _id: `new_${Date.now()}`,
      subscriptionType: subscriptionType.charAt(0).toUpperCase() + subscriptionType.slice(1),
      quotationDate: quotationDate,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      negotation: [{
        _id: `neg_${Date.now()}`,
        round: 1,
        quotationDate: quotationDate,
        requirements: requirements.map(req => ({
          designationName: req.designationName,
          noOfPositions: parseInt(req.noOfPositions),
          gender: req.gender,
          price: req.price,
          limits: req.limits,
          shiftType: req.shiftType
        })),
        comment: comment || 'New quotation generated',
        createdAt: new Date().toISOString(),
        createdByName: { firstName: 'Current', lastName: 'User' }
      }]
    };

    onSave(quotationData);
    onClose();
  };

  return (
    <div className="space-y-5">
      {/* Header Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-1">
          <Calculator className="h-5 w-5 text-blue-600" />
          <h3 className="text-base font-semibold text-gray-900">Generate New Quotation</h3>
        </div>
        <p className="text-sm text-gray-600">Prices are automatically calculated based on your selections</p>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Subscription Type"
          value={subscriptionType}
          onChange={(e) => handleSubscriptionChange(e.target.value)}
          options={[
            { value: 'daily', label: 'Daily' },
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' }
          ]}
          required
        />
        <InputField
          label="Quotation Date"
          type="date"
          value={quotationDate}
          onChange={(e) => setQuotationDate(e.target.value)}
          required
        />
      </div>

      {/* Requirements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-gray-600" />
            Position Requirements
          </h4>
          <button
            onClick={addRequirement}
            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Position
          </button>
        </div>

        {requirements.map((req, index) => (
          <div key={req.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Position #{index + 1}</span>
              {requirements.length > 1 && (
                <button
                  onClick={() => removeRequirement(req.id)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <SelectField
                label="Designation"
                value={req.designationName}
                onChange={(e) => updateRequirement(req.id, 'designationName', e.target.value)}
                options={PRICE_LIST.map(p => ({ value: p.designationName, label: p.designationName }))}
                required
              />
              <SelectField
                label="Gender"
                value={req.gender}
                onChange={(e) => updateRequirement(req.id, 'gender', e.target.value)}
                options={[
                  { value: 'male', label: 'Male' },
                  { value: 'female', label: 'Female' }
                ]}
                required
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Positions <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={req.noOfPositions}
                  onChange={(e) => updateRequirement(req.id, 'noOfPositions', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <SelectField
                label="Shift Type"
                value={req.shiftType}
                onChange={(e) => updateRequirement(req.id, 'shiftType', e.target.value)}
                options={[
                  { value: 'day', label: 'Day Shift' },
                  { value: 'night', label: 'Night Shift' }
                ]}
                required
              />
              <SelectField
                label="Location Limits"
                value={req.limits}
                onChange={(e) => updateRequirement(req.id, 'limits', e.target.value)}
                options={[
                  { value: 'city', label: 'Within City' },
                  { value: 'outcity', label: 'Out of City' }
                ]}
                required
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per Position
                </label>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">{formatCurrency(req.price)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-300 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {req.noOfPositions} × {formatCurrency(req.price)}
              </span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(req.price * req.noOfPositions)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Total Summary */}
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700 mb-0.5">Quotation Total</p>
            <p className="text-xs text-gray-500">{requirements.length} position(s) • {subscriptionType} subscription</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-900">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <TextareaField
        label="Comments / Notes"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add any additional notes or comments about this quotation..."
        rows={3}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={requirements.length === 0 || totalAmount === 0}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
        >
          <Save className="h-4 w-4" />
          Generate Quotation
        </button>
      </div>
    </div>
  );
};

// Edit Lead Form Component
const EditLeadForm = ({ lead, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    companyName: lead.companyName,
    companyAddress: lead.companyAddress,
    contactPerson: lead.contactPerson,
    mobile: lead.mobile,
    contactPersonDesignation: lead.contactPersonDesignation,
    contactPersonEmail: lead.contactPersonEmail,
    status: lead.status,
    subOrgName: lead.subOrgName
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.mobile.match(/^\d{10}$/)) newErrors.mobile = 'Valid 10-digit mobile required';
    if (!formData.contactPersonEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.contactPersonEmail = 'Valid email is required';
    }
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSave(formData);
      onClose();
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Company Name"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
          error={errors.companyName}
        />
        <InputField
          label="Sub Organization"
          value={formData.subOrgName}
          onChange={(e) => setFormData({ ...formData, subOrgName: e.target.value })}
        />
      </div>

      <InputField
        label="Company Address"
        value={formData.companyAddress}
        onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Contact Person"
          value={formData.contactPerson}
          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          required
          error={errors.contactPerson}
        />
        <InputField
          label="Designation"
          value={formData.contactPersonDesignation}
          onChange={(e) => setFormData({ ...formData, contactPersonDesignation: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Mobile"
          value={formData.mobile}
          onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
          required
          error={errors.mobile}
        />
        <InputField
          label="Email"
          type="email"
          value={formData.contactPersonEmail}
          onChange={(e) => setFormData({ ...formData, contactPersonEmail: e.target.value })}
          required
          error={errors.contactPersonEmail}
        />
      </div>

      <SelectField
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        options={[
          { value: 'Pending', label: 'Pending' },
          { value: 'Negotiation', label: 'Negotiation' },
          { value: 'Accepted', label: 'Accepted' },
          { value: 'Rejected', label: 'Rejected' }
        ]}
        required
      />

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>
    </div>
  );
};

// Main Component
const Edit = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewQuotationModal, setShowNewQuotationModal] = useState(false);
  const [showScheduleVisitModal, setShowScheduleVisitModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expandedQuotations, setExpandedQuotations] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Lead data
  const [lead, setLead] = useState({
    _id: '68db5d59d852c16e3b603515',
    companyName: 'PR Groups',
    companyAddress: 'Rajaji Puram, Lucknow, UP - 226017',
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
  });

  const [quotations, setQuotations] = useState([
    {
      _id: "68db7dbe3e1c71ec80578d7b",
      subscriptionType: "Daily",
      quotationDate: "2025-09-30",
      createdAt: "2025-09-30T06:50:38.404Z",
      status: "Pending",
      negotation: [
        {
          _id: "68db7dbe3e1c71ec80578d7c",
          round: 1,
          quotationDate: "2025-09-30",
          requirements: [
            { designationName: "Security Guard", noOfPositions: 2, gender: "male", price: 25000, limits: "city", shiftType: "day" },
            { designationName: "Security Guard", noOfPositions: 2, gender: "female", price: 25000, limits: "city", shiftType: "day" }
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
            { designationName: "Security Guard", noOfPositions: 2, gender: "male", price: 23000, limits: "city", shiftType: "day" },
            { designationName: "Security Guard", noOfPositions: 2, gender: "female", price: 23000, limits: "city", shiftType: "day" }
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
            { designationName: "Security Guard", noOfPositions: 3, gender: "male", price: 23000, limits: "city", shiftType: "day" },
            { designationName: "Security Guard", noOfPositions: 1, gender: "female", price: 23000, limits: "city", shiftType: "day" }
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
      negotation: [
        {
          _id: "68dc8faa4f2e81fc91689e8d",
          round: 1,
          quotationDate: "2025-10-01",
          requirements: [
            { designationName: "Supervisor", noOfPositions: 1, gender: "male", price: 35000, limits: "city", shiftType: "day" },
            { designationName: "Security Guard", noOfPositions: 5, gender: "male", price: 22000, limits: "city", shiftType: "day" }
          ],
          comment: "Monthly subscription package approved by client",
          createdAt: "2025-10-01T09:20:15.416Z",
          createdByName: { firstName: "Ram", lastName: "Kumar" }
        }
      ]
    }
  ]);

  const [visits, setVisits] = useState([
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
  ]);

  // Utility functions
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

  const exportToCSV = (data, filename) => {
    const csvContent = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleExportQuotations = () => {
    const headers = ['Quotation Date', 'Type', 'Status', 'Rounds', 'Total Amount'];
    const rows = quotations.map(q => {
      const lastRound = q.negotation[q.negotation.length - 1];
      const total = calculateQuotationTotal(lastRound.requirements);
      return [
        q.quotationDate,
        q.subscriptionType,
        q.status,
        q.negotation.length,
        total
      ];
    });
    exportToCSV([headers, ...rows], `quotations_${lead.companyName}_${new Date().toISOString()}.csv`);
  };

  // Filter and sort logic
  const filteredQuotations = useMemo(() => {
    let filtered = quotations;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(q =>
        q.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.quotationDate);
      const dateB = new Date(b.quotationDate);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [quotations, statusFilter, searchTerm, sortOrder]);

  const filteredVisits = useMemo(() => {
    let filtered = visits;

    if (searchTerm) {
      filtered = filtered.filter(v =>
        v.visitType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.purpose.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.visitDate);
      const dateB = new Date(b.visitDate);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [visits, searchTerm, sortOrder]);

  const toggleQuotationExpand = (id) => {
    setExpandedQuotations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
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

  const handleSaveLead = (updatedData) => {
    setLead({ ...lead, ...updatedData, modifiedDate: new Date().toISOString() });
    alert('Lead updated successfully!');
  };

  const handleSaveQuotation = (newQuotation) => {
    setQuotations(prev => [newQuotation, ...prev]);
    alert('Quotation generated successfully!');
  };

  const handleSaveVisit = (newVisit) => {
    setVisits(prev => [newVisit, ...prev]);
    alert('Visit scheduled successfully!');
  };

  return (
    <div className="flex flex-col gap-6 p-4 w-full min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between flex-wrap gap-4">
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
          <button
            onClick={() => setShowEditModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
          >
            <Pencil className="h-4 w-4" />
            Edit Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lead Status"
          value={
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[lead.status]?.color}`}>
              <StatusIcon className="h-4 w-4" />
              {statusConfig[lead.status]?.label}
            </span>
          }
          icon={Activity}
          color="bg-blue-600"
        />
        <StatCard
          title="Total Quotations"
          value={quotations.length}
          subtitle={`${quotations.filter(q => q.status === 'Accepted').length} accepted`}
          icon={FileText}
          color="bg-green-600"
        />
        <StatCard
          title="Negotiation Rounds"
          value={totalNegotiations}
          subtitle="Across all quotations"
          icon={MessageSquare}
          color="bg-orange-600"
        />
        <StatCard
          title="Total Visits"
          value={visits.length}
          subtitle={`${visits.filter(v => v.status === 'completed').length} completed`}
          icon={Users}
          color="bg-purple-600"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'quotations', label: `Quotations & Negotiations (${quotations.length})` },
              { id: 'visits', label: `Visits & Status (${visits.length})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  Company Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Company Name</p>
                      <p className="font-medium text-gray-900">{lead.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{lead.companyAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Sub Organization</p>
                      <p className="font-medium text-gray-900">{lead.subOrgName}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Contact Person</p>
                      <p className="font-medium text-gray-900">{lead.contactPerson}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Briefcase className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium text-gray-900">{lead.contactPersonDesignation}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Mobile</p>
                      <p className="font-medium text-gray-900">{lead.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{lead.contactPersonEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Lead Tracking
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Created Date</p>
                      <p className="font-medium text-gray-900">{formatDate(lead.createdDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Last Modified</p>
                      <p className="font-medium text-gray-900">{formatDate(lead.modifiedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Created By</p>
                      <p className="font-medium text-gray-900">
                        {lead.createdByName?.firstName} {lead.createdByName?.lastName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Activity className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div className="flex-1">
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
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search quotations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
                      showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                  </button>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                    Sort
                  </button>
                  <button
                    onClick={handleExportQuotations}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </button>
                  <button 
                    onClick={() => setShowNewQuotationModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                </div>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SelectField
                      label="Status Filter"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      options={[
                        { value: 'all', label: 'All Statuses' },
                        { value: 'Pending', label: 'Pending' },
                        { value: 'Negotiation', label: 'Negotiation' },
                        { value: 'Accepted', label: 'Accepted' },
                        { value: 'Rejected', label: 'Rejected' }
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* Quotations List */}
              <div className="space-y-6">
                {filteredQuotations.map((quotation, qIdx) => {
                  const isExpanded = expandedQuotations[quotation._id];
                  const lastRound = quotation.negotation[quotation.negotation.length - 1];
                  const latestTotal = calculateQuotationTotal(lastRound.requirements);

                  return (
                    <div key={quotation._id} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="text-xl font-bold text-gray-900">Quotation #{qIdx + 1}</h4>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusConfig[quotation.status]?.color}`}>
                              {statusConfig[quotation.status]?.label}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {quotation.subscriptionType}
                            </span>
                            <span className="text-lg font-bold text-green-600">{formatCurrency(latestTotal)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {formatDate(quotation.quotationDate)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <History className="h-4 w-4" />
                              {quotation.negotation?.length || 0} Rounds
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleQuotationExpand(quotation._id)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-colors"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            {isExpanded ? 'Collapse' : 'Expand'}
                          </button>
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            <Eye className="h-4 w-4" />
                            View
                          </button>
                          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
                            <Download className="h-4 w-4" />
                            PDF
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="space-y-4 mt-6 pt-6 border-t border-gray-200">
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
                              <div key={negotiation._id} className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start mb-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-bold text-sm">
                                        R{negotiation.round}
                                      </div>
                                      <h6 className="text-lg font-semibold text-gray-900">Round {negotiation.round}</h6>
                                      {priceDifference !== 0 && (
                                        <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded ${
                                          priceDifference < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                          {priceDifference < 0 ? (
                                            <>
                                              <TrendingDown className="h-3 w-3" />
                                              {formatCurrency(Math.abs(priceDifference))} saved
                                            </>
                                          ) : (
                                            <>
                                              <TrendingUp className="h-3 w-3" />
                                              {formatCurrency(Math.abs(priceDifference))} increase
                                            </>
                                          )}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2 flex-wrap">
                                      <span className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {formatDate(negotiation.quotationDate)}
                                      </span>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <User className="h-4 w-4" />
                                        {negotiation.createdByName?.firstName} {negotiation.createdByName?.lastName}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
                                    <p className="text-xs text-gray-500">Total Amount</p>
                                  </div>
                                </div>

                                <div className="overflow-x-auto mb-4">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-white">
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
                                        <tr key={rIdx} className="hover:bg-gray-50">
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
                                    <tfoot className="bg-blue-50">
                                      <tr>
                                        <td colSpan="6" className="px-4 py-2 text-right text-sm font-semibold text-gray-900">
                                          Round Total:
                                        </td>
                                        <td className="px-4 py-2 text-right text-sm font-bold text-blue-900">
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
                      )}
                    </div>
                  );
                })}

                {filteredQuotations.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No quotations found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === 'visits' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search visits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                    Sort
                  </button>
                  <button 
                    onClick={() => setShowScheduleVisitModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Schedule Visit
                  </button>
                </div>
              </div>

              {/* Timeline */}
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                <div className="space-y-6">
                  {filteredVisits.map((visit) => (
                    <div key={visit._id} className="relative pl-16">
                      <div className={`absolute left-6 w-5 h-5 rounded-full border-4 border-white ${
                        visit.status === 'completed' ? 'bg-green-500' :
                        visit.status === 'scheduled' ? 'bg-blue-500' :
                        visit.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>

                      <div className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h4 className="text-lg font-semibold text-gray-900">{visit.visitType}</h4>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${visitStatusConfig[visit.status]?.color}`}>
                                {visitStatusConfig[visit.status]?.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
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
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Purpose</p>
                            <p className="text-sm text-gray-900">{visit.purpose}</p>
                          </div>
                          {visit.outcome && (
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs text-gray-500 mb-1 font-medium">Outcome</p>
                              <p className="text-sm text-gray-900">{visit.outcome}</p>
                            </div>
                          )}
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <p className="text-xs text-gray-500 mb-2 font-medium">Attendees</p>
                          <div className="flex flex-wrap gap-2">
                            {visit.attendees.map((attendee, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-white text-blue-700 rounded text-xs border border-blue-200">
                                <Users className="h-3 w-3" />
                                {attendee}
                              </span>
                            ))}
                          </div>
                        </div>

                        {visit.notes && (
                          <div className="bg-purple-50 p-3 rounded-lg mb-4 border-l-4 border-purple-400">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Notes</p>
                            <p className="text-sm text-gray-700">{visit.notes}</p>
                          </div>
                        )}

                        {visit.nextAction && (
                          <div className="bg-yellow-50 p-3 rounded-lg mb-4 border-l-4 border-yellow-400">
                            <p className="text-xs text-gray-500 mb-1 font-medium">Next Action</p>
                            <p className="text-sm text-gray-900 font-medium">{visit.nextAction}</p>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 flex-wrap gap-3">
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Logged by {visit.createdBy.firstName} {visit.createdBy.lastName}
                          </div>
                          <div className="flex gap-2">
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs transition-colors">
                              <Eye className="h-3 w-3" />
                              View Details
                            </button>
                            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-xs transition-colors">
                              <Pencil className="h-3 w-3" />
                              Edit
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredVisits.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No visits found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Lead Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Lead Information"
        size="lg"
      >
        <EditLeadForm
          lead={lead}
          onSave={handleSaveLead}
          onClose={() => setShowEditModal(false)}
        />
      </Modal>

      {/* New Quotation Modal */}
      <Modal
        isOpen={showNewQuotationModal}
        onClose={() => setShowNewQuotationModal(false)}
        title="Generate New Quotation"
        size="xl"
      >
        <NewQuotationForm
          leadId={lead._id}
          onSave={handleSaveQuotation}
          onClose={() => setShowNewQuotationModal(false)}
        />
      </Modal>

      {/* Schedule Visit Modal */}
      <Modal
        isOpen={showScheduleVisitModal}
        onClose={() => setShowScheduleVisitModal(false)}
        title="Schedule New Visit"
        size="lg"
      >
        <ScheduleVisitForm
          leadName={lead.companyName}
          onSave={handleSaveVisit}
          onClose={() => setShowScheduleVisitModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Edit;