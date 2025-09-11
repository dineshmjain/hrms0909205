import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Button, 
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Textarea,
  Select,
  Option,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Progress
} from '@material-tailwind/react';
import { 
  FaExclamationTriangle, 
  FaGraduationCap, 
  FaBullhorn,
  FaTools,
  FaAward,
  FaSiren,
  FaFileAlt,
  FaCalendarCheck,
  FaComment,
  FaBox,
  FaStar,
  FaPhone,
  FaEnvelope,
  FaBell
} from 'react-icons/fa';
import { 
  MdNotifications, 
  MdEmergency, 
  MdInventory,
  MdSchool,
  MdWarning
} from 'react-icons/md';

const AdditionalFunctions = () => {
  const [incidents, setIncidents] = useState([]);
  const [trainingSessions, setTrainingSessions] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [performanceReviews, setPerformanceReviews] = useState([]);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  
  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const [activeTab, setActiveTab] = useState('incidents');

  const [incidentForm, setIncidentForm] = useState({
    type: 'theft',
    location: '',
    description: '',
    severity: 'medium',
    involvedPersons: '',
    immediateAction: '',
    followUpRequired: false,
    reportedBy: 'Field Officer',
    photos: []
  });

  const [emergencyForm, setEmergencyForm] = useState({
    type: 'medical',
    priority: 'high',
    location: '',
    description: '',
    contactAuthorities: false,
    escalateTo: 'admin'
  });

  // Mock data initialization
  useEffect(() => {
    setIncidents([
      {
        id: '1',
        type: 'theft',
        location: 'ABC Corporate - Parking Area',
        description: 'Attempted vehicle theft reported by visitor',
        severity: 'high',
        reportDate: '2024-09-10',
        reportTime: '14:30',
        status: 'investigating',
        reportedBy: 'Field Officer John',
        assignedTo: 'Security Supervisor',
        followUpActions: ['Review CCTV footage', 'File police report', 'Increase patrol frequency']
      },
      {
        id: '2',
        type: 'medical',
        location: 'XYZ Manufacturing - Factory Floor',
        description: 'Employee slip and fall incident, minor injury',
        severity: 'medium',
        reportDate: '2024-09-09',
        reportTime: '11:15',
        status: 'resolved',
        reportedBy: 'Field Officer Sarah',
        immediateAction: 'First aid provided, area secured'
      }
    ]);

    setTrainingSessions([
      {
        id: '1',
        title: 'Emergency Response Protocols',
        type: 'mandatory',
        date: '2024-09-15',
        time: '10:00',
        duration: '2 hours',
        location: 'Training Room A',
        trainer: 'Safety Officer',
        capacity: 20,
        enrolled: 15,
        status: 'scheduled',
        topics: ['Fire Safety', 'Evacuation Procedures', 'First Aid']
      },
      {
        id: '2',
        title: 'Customer Service Training',
        type: 'optional',
        date: '2024-09-18',
        time: '14:00',
        duration: '3 hours',
        location: 'Conference Hall',
        trainer: 'HR Manager',
        capacity: 25,
        enrolled: 12,
        status: 'scheduled',
        topics: ['Communication Skills', 'Conflict Resolution', 'Professional Behavior']
      }
    ]);

    setCommunications([
      {
        id: '1',
        type: 'circular',
        title: 'New Uniform Policy - Effective October 1st',
        content: 'All security personnel must wear the new standardized uniform from October 1st. Please collect your uniforms from the office.',
        sentDate: '2024-09-10',
        sentTo: 'All Staff',
        priority: 'medium',
        status: 'sent',
        readBy: 85 // percentage
      },
      {
        id: '2',
        type: 'notice',
        title: 'Shift Schedule Changes - Week of September 16th',
        content: 'Due to client requirements, there will be temporary schedule changes for the week of September 16th. Please check the updated roster.',
        sentDate: '2024-09-08',
        sentTo: 'ABC Corporate Team',
        priority: 'high',
        status: 'sent',
        readBy: 92
      }
    ]);

    setInventory([
      {
        id: '1',
        item: 'Walkie-Talkies',
        category: 'Communication',
        totalStock: 50,
        issued: 35,
        available: 15,
        clientAllocation: {
          'ABC Corporate': 12,
          'XYZ Manufacturing': 15,
          'DEF Mall': 8
        },
        condition: 'good',
        lastUpdated: '2024-09-10'
      },
      {
        id: '2',
        item: 'Security Uniforms',
        category: 'Apparel',
        totalStock: 100,
        issued: 85,
        available: 15,
        condition: 'good',
        sizes: { 'S': 5, 'M': 25, 'L': 30, 'XL': 25, 'XXL': 15 },
        lastUpdated: '2024-09-05'
      },
      {
        id: '3',
        item: 'Flashlights',
        category: 'Equipment',
        totalStock: 40,
        issued: 38,
        available: 2,
        batteryStatus: 'needs_replacement',
        condition: 'fair',
        lastUpdated: '2024-09-08'
      }
    ]);

    setPerformanceReviews([
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        reviewPeriod: 'Q3 2024',
        overallRating: 4.2,
        categories: {
          punctuality: 4.5,
          performance: 4.0,
          teamwork: 4.0,
          initiative: 4.5,
          clientFeedback: 4.0
        },
        strengths: ['Excellent attendance', 'Strong leadership skills', 'Good client relations'],
        improvements: ['Needs to improve report writing', 'Could be more proactive in training juniors'],
        goals: ['Complete advanced security training', 'Mentor new recruits'],
        reviewDate: '2024-09-10',
        reviewedBy: 'Field Officer Manager',
        status: 'completed'
      }
    ]);

    setEmergencyAlerts([
      {
        id: '1',
        type: 'security_breach',
        priority: 'critical',
        location: 'ABC Corporate - Main Entrance',
        description: 'Unauthorized access detected in restricted area',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'active',
        respondedBy: [],
        escalatedTo: 'Admin'
      }
    ]);
  }, []);

  const reportIncident = () => {
    const newIncident = {
      id: Date.now().toString(),
      ...incidentForm,
      reportDate: new Date().toISOString().split('T')[0],
      reportTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'investigating',
      followUpActions: []
    };

    setIncidents([newIncident, ...incidents]);
    setShowIncidentModal(false);
    setIncidentForm({
      type: 'theft',
      location: '',
      description: '',
      severity: 'medium',
      involvedPersons: '',
      immediateAction: '',
      followUpRequired: false,
      reportedBy: 'Field Officer',
      photos: []
    });
  };

  const scheduleTraining = () => {
    const newTraining = {
      id: Date.now().toString(),
      title: 'New Training Session',
      type: 'mandatory',
      date: '2024-09-20',
      time: '10:00',
      duration: '2 hours',
      location: 'Training Room',
      trainer: 'Field Officer',
      capacity: 20,
      enrolled: 0,
      status: 'scheduled',
      topics: []
    };

    setTrainingSessions([newTraining, ...trainingSessions]);
    setShowTrainingModal(false);
  };

  const sendCommunication = () => {
    const newCommunication = {
      id: Date.now().toString(),
      type: 'notice',
      title: 'New Communication',
      content: 'Communication content...',
      sentDate: new Date().toISOString().split('T')[0],
      sentTo: 'All Staff',
      priority: 'medium',
      status: 'sent',
      readBy: 0
    };

    setCommunications([newCommunication, ...communications]);
    setShowCommunicationModal(false);
  };

  const triggerEmergency = () => {
    const newEmergency = {
      id: Date.now().toString(),
      ...emergencyForm,
      timestamp: new Date().toISOString(),
      status: 'active',
      respondedBy: [],
      escalatedTo: emergencyForm.escalateTo
    };

    setEmergencyAlerts([newEmergency, ...emergencyAlerts]);
    setShowEmergencyModal(false);
    setEmergencyForm({
      type: 'medical',
      priority: 'high',
      location: '',
      description: '',
      contactAuthorities: false,
      escalateTo: 'admin'
    });

    // In real implementation, this would trigger actual emergency notifications
    alert('Emergency alert has been triggered and escalated!');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': case 'completed': return 'green';
      case 'investigating': case 'scheduled': case 'active': return 'blue';
      case 'critical': case 'high': return 'red';
      case 'pending': return 'orange';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'blue';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const IncidentsView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Incident Reports
        </Typography>
        <Button
          color="red"
          size="sm"
          onClick={() => setShowIncidentModal(true)}
          className="flex items-center gap-2"
        >
          <FaExclamationTriangle className="h-4 w-4" />
          Report Incident
        </Button>
      </div>

      {incidents.map((incident) => (
        <Card key={incident.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray" className="flex items-center gap-2">
                  <FaExclamationTriangle className="h-5 w-5" />
                  {incident.type.charAt(0).toUpperCase() + incident.type.slice(1)} Incident
                </Typography>
                <Typography variant="small" color="gray">
                  {incident.location} • {incident.reportDate} at {incident.reportTime}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Chip value={incident.severity} color={getPriorityColor(incident.severity)} size="sm" />
                <Chip value={incident.status} color={getStatusColor(incident.status)} size="sm" />
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                Description:
              </Typography>
              <Typography variant="small" color="gray">
                {incident.description}
              </Typography>
            </div>

            {incident.immediateAction && (
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                  Immediate Action Taken:
                </Typography>
                <Typography variant="small" color="gray">
                  {incident.immediateAction}
                </Typography>
              </div>
            )}

            {incident.followUpActions && incident.followUpActions.length > 0 && (
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                  Follow-up Actions:
                </Typography>
                <div className="space-y-1">
                  {incident.followUpActions.map((action, index) => (
                    <Typography key={index} variant="small" color="gray">
                      • {action}
                    </Typography>
                  ))}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const TrainingView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Training & Drills
        </Typography>
        <Button
          color="blue"
          size="sm"
          onClick={() => setShowTrainingModal(true)}
          className="flex items-center gap-2"
        >
          <FaGraduationCap className="h-4 w-4" />
          Schedule Training
        </Button>
      </div>

      {trainingSessions.map((training) => (
        <Card key={training.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {training.title}
                </Typography>
                <Typography variant="small" color="gray">
                  📅 {training.date} at {training.time} • 🕒 {training.duration}
                </Typography>
                <Typography variant="small" color="gray">
                  📍 {training.location} • 👨‍🏫 {training.trainer}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Chip 
                  value={training.type} 
                  color={training.type === 'mandatory' ? 'red' : 'blue'} 
                  size="sm" 
                />
                <Chip value={training.status} color={getStatusColor(training.status)} size="sm" />
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Enrollment: {training.enrolled}/{training.capacity}
              </Typography>
              <Progress 
                value={(training.enrolled / training.capacity) * 100} 
                color="blue" 
                className="mt-1"
              />
            </div>

            {training.topics && training.topics.length > 0 && (
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                  Topics Covered:
                </Typography>
                <div className="flex flex-wrap gap-1">
                  {training.topics.map((topic, index) => (
                    <Chip key={index} value={topic} size="sm" color="green" />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outlined" color="blue">
                View Details
              </Button>
              <Button size="sm" color="green">
                Manage Enrollment
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const CommunicationView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Communications & Notices
        </Typography>
        <Button
          color="blue"
          size="sm"
          onClick={() => setShowCommunicationModal(true)}
          className="flex items-center gap-2"
        >
          <FaBullhorn className="h-4 w-4" />
          Send Notice
        </Button>
      </div>

      {communications.map((comm) => (
        <Card key={comm.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {comm.title}
                </Typography>
                <Typography variant="small" color="gray">
                  📤 Sent on {comm.sentDate} to {comm.sentTo}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Chip value={comm.type} color="blue" size="sm" />
                <Chip value={comm.priority} color={getPriorityColor(comm.priority)} size="sm" />
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="gray">
                {comm.content}
              </Typography>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Typography variant="small" color="blue-gray">
                  Read by: {comm.readBy}%
                </Typography>
                <Progress value={comm.readBy} color="green" className="w-20" />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outlined" color="blue">
                  View Analytics
                </Button>
                <Button size="sm" color="green">
                  Resend
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const InventoryView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Inventory & Equipment
        </Typography>
        <Button
          color="blue"
          size="sm"
          onClick={() => setShowInventoryModal(true)}
          className="flex items-center gap-2"
        >
          <FaBox className="h-4 w-4" />
          Update Inventory
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item) => (
          <Card key={item.id} className="border">
            <CardBody className="p-4">
              <div className="flex justify-between items-center mb-3">
                <Typography variant="h6" color="blue-gray">
                  {item.item}
                </Typography>
                <Chip 
                  value={item.condition} 
                  color={item.condition === 'good' ? 'green' : item.condition === 'fair' ? 'orange' : 'red'} 
                  size="sm" 
                />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Total Stock:</Typography>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {item.totalStock}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Issued:</Typography>
                  <Typography variant="small" color="red">
                    {item.issued}
                  </Typography>
                </div>
                <div className="flex justify-between">
                  <Typography variant="small" color="gray">Available:</Typography>
                  <Typography variant="small" color="green">
                    {item.available}
                  </Typography>
                </div>
              </div>

              <div className="mb-3">
                <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                  Stock Level:
                </Typography>
                <Progress 
                  value={(item.issued / item.totalStock) * 100} 
                  color={item.available < 5 ? 'red' : item.available < 10 ? 'orange' : 'green'}
                />
              </div>

              {item.available < 5 && (
                <div className="p-2 bg-red-50 rounded-lg mb-3">
                  <Typography variant="small" color="red" className="font-medium">
                    ⚠️ Low Stock Alert
                  </Typography>
                </div>
              )}

              <div className="flex gap-2">
                <Button size="sm" variant="outlined" color="blue">
                  View Details
                </Button>
                <Button size="sm" color="green">
                  Issue/Return
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const EmergencyView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Emergency Escalation
        </Typography>
        <Button
          color="red"
          size="sm"
          onClick={() => setShowEmergencyModal(true)}
          className="flex items-center gap-2"
        >
          <FaSiren className="h-4 w-4" />
          Trigger Emergency
        </Button>
      </div>

      {emergencyAlerts.length > 0 && (
        <div className="space-y-4">
          {emergencyAlerts.map((alert) => (
            <Card key={alert.id} className="border border-red-200 bg-red-50">
              <CardBody className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <Typography variant="h6" color="red" className="flex items-center gap-2">
                      <FaSiren className="h-5 w-5" />
                      {alert.type.replace('_', ' ').toUpperCase()} ALERT
                    </Typography>
                    <Typography variant="small" color="gray">
                      📍 {alert.location}
                    </Typography>
                    <Typography variant="small" color="gray">
                      🕐 {new Date(alert.timestamp).toLocaleString()}
                    </Typography>
                  </div>
                  <div className="flex gap-2">
                    <Chip value={alert.priority} color={getPriorityColor(alert.priority)} size="sm" />
                    <Chip value={alert.status} color={getStatusColor(alert.status)} size="sm" />
                  </div>
                </div>

                <div className="mb-4">
                  <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                    Description:
                  </Typography>
                  <Typography variant="small" color="gray">
                    {alert.description}
                  </Typography>
                </div>

                <div className="flex gap-4 mb-4">
                  <Typography variant="small" color="blue-gray">
                    Escalated to: <strong>{alert.escalatedTo}</strong>
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    Response team: <strong>{alert.respondedBy.length || 0} members</strong>
                  </Typography>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" color="green">
                    Mark as Resolved
                  </Button>
                  <Button size="sm" variant="outlined" color="blue">
                    Add Response
                  </Button>
                  <Button size="sm" variant="outlined" color="red">
                    Escalate Further
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {emergencyAlerts.length === 0 && (
        <Card className="border">
          <CardBody className="p-6 text-center">
            <FaCheck className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <Typography variant="h6" color="green">
              No Active Emergency Alerts
            </Typography>
            <Typography variant="small" color="gray">
              All systems are functioning normally
            </Typography>
          </CardBody>
        </Card>
      )}
    </div>
  );

  // Modal components (simplified for brevity)
  const IncidentModal = () => (
    <Dialog open={showIncidentModal} handler={() => setShowIncidentModal(false)} size="lg">
      <DialogHeader>Report Incident</DialogHeader>
      <DialogBody className="space-y-4">
        <Select label="Incident Type" value={incidentForm.type} onChange={(value) => setIncidentForm({...incidentForm, type: value})}>
          <Option value="theft">Theft</Option>
          <Option value="medical">Medical Emergency</Option>
          <Option value="fight">Fight/Altercation</Option>
          <Option value="fire">Fire/Safety</Option>
        </Select>
        <Input label="Location" value={incidentForm.location} onChange={(e) => setIncidentForm({...incidentForm, location: e.target.value})} />
        <Textarea label="Description" value={incidentForm.description} onChange={(e) => setIncidentForm({...incidentForm, description: e.target.value})} />
        <Select label="Severity" value={incidentForm.severity} onChange={(value) => setIncidentForm({...incidentForm, severity: value})}>
          <Option value="low">Low</Option>
          <Option value="medium">Medium</Option>
          <Option value="high">High</Option>
          <Option value="critical">Critical</Option>
        </Select>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowIncidentModal(false)}>Cancel</Button>
        <Button color="red" onClick={reportIncident}>Report Incident</Button>
      </DialogFooter>
    </Dialog>
  );

  const EmergencyModal = () => (
    <Dialog open={showEmergencyModal} handler={() => setShowEmergencyModal(false)}>
      <DialogHeader>Emergency Escalation</DialogHeader>
      <DialogBody className="space-y-4">
        <Select label="Emergency Type" value={emergencyForm.type} onChange={(value) => setEmergencyForm({...emergencyForm, type: value})}>
          <Option value="medical">Medical Emergency</Option>
          <Option value="fire">Fire Emergency</Option>
          <Option value="security_breach">Security Breach</Option>
          <Option value="natural_disaster">Natural Disaster</Option>
        </Select>
        <Select label="Priority" value={emergencyForm.priority} onChange={(value) => setEmergencyForm({...emergencyForm, priority: value})}>
          <Option value="critical">Critical</Option>
          <Option value="high">High</Option>
          <Option value="medium">Medium</Option>
        </Select>
        <Input label="Location" value={emergencyForm.location} onChange={(e) => setEmergencyForm({...emergencyForm, location: e.target.value})} />
        <Textarea label="Description" value={emergencyForm.description} onChange={(e) => setEmergencyForm({...emergencyForm, description: e.target.value})} />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowEmergencyModal(false)}>Cancel</Button>
        <Button color="red" onClick={triggerEmergency}>Trigger Emergency</Button>
      </DialogFooter>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500 text-white rounded-xl">
              <MdNotifications className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Additional Functions
              </Typography>
              <Typography color="gray" className="font-normal">
                Incident reporting, training, communication, inventory, and emergency management
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab}>
        <TabsHeader className="grid grid-cols-2 md:grid-cols-5 gap-1">
          <Tab value="incidents" onClick={() => setActiveTab('incidents')}>
            <div className="flex flex-col items-center gap-1">
              <FaExclamationTriangle className="h-4 w-4" />
              <span className="text-xs">Incidents</span>
            </div>
          </Tab>
          <Tab value="training" onClick={() => setActiveTab('training')}>
            <div className="flex flex-col items-center gap-1">
              <FaGraduationCap className="h-4 w-4" />
              <span className="text-xs">Training</span>
            </div>
          </Tab>
          <Tab value="communication" onClick={() => setActiveTab('communication')}>
            <div className="flex flex-col items-center gap-1">
              <FaBullhorn className="h-4 w-4" />
              <span className="text-xs">Communication</span>
            </div>
          </Tab>
          <Tab value="inventory" onClick={() => setActiveTab('inventory')}>
            <div className="flex flex-col items-center gap-1">
              <FaTools className="h-4 w-4" />
              <span className="text-xs">Inventory</span>
            </div>
          </Tab>
          <Tab value="emergency" onClick={() => setActiveTab('emergency')}>
            <div className="flex flex-col items-center gap-1">
              <FaSiren className="h-4 w-4" />
              <span className="text-xs">Emergency</span>
            </div>
          </Tab>
        </TabsHeader>
        
        <TabsBody>
          <TabPanel value="incidents"><IncidentsView /></TabPanel>
          <TabPanel value="training"><TrainingView /></TabPanel>
          <TabPanel value="communication"><CommunicationView /></TabPanel>
          <TabPanel value="inventory"><InventoryView /></TabPanel>
          <TabPanel value="emergency"><EmergencyView /></TabPanel>
        </TabsBody>
      </Tabs>

      {/* Modals */}
      <IncidentModal />
      <EmergencyModal />
    </div>
  );
};

export default AdditionalFunctions;