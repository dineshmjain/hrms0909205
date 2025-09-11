import React, { useState, useEffect, useRef } from 'react';
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
  Switch,
  Select,
  Option
} from '@material-tailwind/react';
import { 
  FaMapMarkerAlt, 
  FaDrawPolygon, 
  FaRoute, 
  FaExclamationTriangle,
  FaCheck,
  FaClock,
  FaPlus,
  FaEdit,
  FaEye
} from 'react-icons/fa';
import { MdLocationOn, MdMap, MdNotifications, MdTimer } from 'react-icons/md';

const GeofencingCheckpoints = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [geofences, setGeofences] = useState([]);
  const [checkpoints, setCheckpoints] = useState([]);
  const [employeeAssignments, setEmployeeAssignments] = useState({});
  const [patrolData, setPatrolData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showGeofenceModal, setShowGeofenceModal] = useState(false);
  const [showCheckpointModal, setShowCheckpointModal] = useState(false);
  const mapRef = useRef(null);

  // Mock data initialization
  useEffect(() => {
    setClients([
      { id: '1', name: 'ABC Corporate Tower', location: 'Downtown' },
      { id: '2', name: 'XYZ Manufacturing', location: 'Industrial Area' },
      { id: '3', name: 'DEF Shopping Mall', location: 'City Center' }
    ]);

    setGeofences([
      {
        id: '1',
        clientId: '1',
        name: 'Main Building Perimeter',
        coordinates: [
          { lat: 40.7589, lng: -73.9851 },
          { lat: 40.7590, lng: -73.9850 },
          { lat: 40.7588, lng: -73.9849 },
          { lat: 40.7587, lng: -73.9850 }
        ],
        isActive: true
      }
    ]);

    setCheckpoints([
      {
        id: '1',
        name: 'Main Entrance',
        clientId: '1',
        location: { lat: 40.7589, lng: -73.9851 },
        activities: ['Check-in', 'ID Verification', 'Log Entry'],
        requiredInterval: 30, // minutes
        isActive: true
      },
      {
        id: '2',
        name: 'Parking Area',
        clientId: '1',
        location: { lat: 40.7588, lng: -73.9850 },
        activities: ['Patrol', 'Vehicle Check', 'Security Scan'],
        requiredInterval: 60,
        isActive: true
      }
    ]);

    setEmployeeAssignments({
      '1': {
        morning: ['emp1', 'emp2'],
        evening: ['emp2', 'emp3'],
        night: ['emp3', 'emp4']
      }
    });

    setPatrolData([
      {
        id: '1',
        checkpointId: '1',
        employeeId: 'emp1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        status: 'completed',
        location: { lat: 40.7589, lng: -73.9851 },
        notes: 'All clear, no incidents'
      },
      {
        id: '2',
        checkpointId: '2',
        employeeId: 'emp1',
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        status: 'missed',
        expectedTime: new Date(Date.now() - 1800000).toISOString()
      }
    ]);

    setAlerts([
      {
        id: '1',
        type: 'checkpoint_missed',
        checkpointId: '2',
        employeeId: 'emp1',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        message: 'Checkpoint "Parking Area" missed by John Doe',
        severity: 'high',
        isRead: false
      }
    ]);
  }, []);

  const createGeofence = (geofenceData) => {
    const newGeofence = {
      id: Date.now().toString(),
      clientId: selectedClient,
      ...geofenceData,
      isActive: true
    };
    setGeofences([...geofences, newGeofence]);
    setShowGeofenceModal(false);
  };

  const createCheckpoint = (checkpointData) => {
    const newCheckpoint = {
      id: Date.now().toString(),
      clientId: selectedClient,
      ...checkpointData,
      isActive: true
    };
    setCheckpoints([...checkpoints, newCheckpoint]);
    setShowCheckpointModal(false);
  };

  const assignEmployeeToCheckpoint = (checkpointId, employeeId, shift) => {
    const currentAssignments = employeeAssignments[checkpointId] || {};
    const shiftAssignments = currentAssignments[shift] || [];
    
    setEmployeeAssignments({
      ...employeeAssignments,
      [checkpointId]: {
        ...currentAssignments,
        [shift]: [...shiftAssignments, employeeId]
      }
    });
  };

  const checkMissedCheckpoints = () => {
    const now = new Date();
    const newAlerts = [];

    checkpoints.forEach(checkpoint => {
      const lastCheckIn = patrolData
        .filter(p => p.checkpointId === checkpoint.id && p.status === 'completed')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

      if (lastCheckIn) {
        const timeSinceLastCheck = (now - new Date(lastCheckIn.timestamp)) / (1000 * 60);
        if (timeSinceLastCheck > checkpoint.requiredInterval) {
          newAlerts.push({
            id: Date.now().toString() + Math.random(),
            type: 'checkpoint_overdue',
            checkpointId: checkpoint.id,
            timestamp: now.toISOString(),
            message: `Checkpoint "${checkpoint.name}" is overdue for patrol`,
            severity: 'medium',
            isRead: false
          });
        }
      }
    });

    setAlerts([...alerts, ...newAlerts]);
  };

  const getClientGeofences = (clientId) => {
    return geofences.filter(g => g.clientId === clientId);
  };

  const getClientCheckpoints = (clientId) => {
    return checkpoints.filter(c => c.clientId === clientId);
  };

  const GeofenceModal = () => (
    <Dialog open={showGeofenceModal} handler={() => setShowGeofenceModal(false)} size="lg">
      <DialogHeader>Create Geofence Polygon</DialogHeader>
      <DialogBody className="space-y-4">
        <Input label="Geofence Name" />
        <Typography color="gray" className="text-sm">
          Click on the map below to draw polygon points. The geofence will automatically close when you finish.
        </Typography>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <Typography color="gray">
            Interactive Map Component
            <br />
            (Google Maps integration would go here)
          </Typography>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Coordinates (JSON)" />
          <Select label="Alert Type">
            <Option>Entry Alert</Option>
            <Option>Exit Alert</Option>
            <Option>Both</Option>
          </Select>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowGeofenceModal(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => createGeofence({})}>
          Create Geofence
        </Button>
      </DialogFooter>
    </Dialog>
  );

  const CheckpointModal = () => (
    <Dialog open={showCheckpointModal} handler={() => setShowCheckpointModal(false)}>
      <DialogHeader>Create Checkpoint</DialogHeader>
      <DialogBody className="space-y-4">
        <Input label="Checkpoint Name" />
        <Input label="Description" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Latitude" type="number" step="any" />
          <Input label="Longitude" type="number" step="any" />
        </div>
        <Input label="Required Activities (comma separated)" />
        <Input label="Check Interval (minutes)" type="number" />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowCheckpointModal(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => createCheckpoint({})}>
          Create Checkpoint
        </Button>
      </DialogFooter>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500 text-white rounded-xl">
                <MdMap className="h-6 w-6" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  Geofencing & Checkpoints
                </Typography>
                <Typography color="gray" className="font-normal">
                  Draw geofences, create checkpoints, assign employees, and monitor patrols
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                color="purple"
                variant="outlined"
                className="flex items-center gap-2"
                onClick={() => setShowGeofenceModal(true)}
              >
                <FaDrawPolygon className="h-4 w-4" />
                Draw Geofence
              </Button>
              <Button
                color="blue"
                className="flex items-center gap-2"
                onClick={() => setShowCheckpointModal(true)}
              >
                <FaPlus className="h-4 w-4" />
                Add Checkpoint
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Client Selection */}
      <Card>
        <CardBody className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Select Client
          </Typography>
          <Select 
            label="Choose Client"
            value={selectedClient}
            onChange={(value) => setSelectedClient(value)}
          >
            {clients.map((client) => (
              <Option key={client.id} value={client.id}>
                {client.name} - {client.location}
              </Option>
            ))}
          </Select>
        </CardBody>
      </Card>

      {selectedClient && (
        <>
          {/* Geofences & Checkpoints Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Geofences */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Client Geofences
                </Typography>
                
                <div className="space-y-3">
                  {getClientGeofences(selectedClient).map((geofence) => (
                    <div key={geofence.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {geofence.name}
                        </Typography>
                        <Switch checked={geofence.isActive} />
                      </div>
                      <Typography variant="small" color="gray">
                        {geofence.coordinates.length} vertices defined
                      </Typography>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outlined" color="blue">
                          <FaEdit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outlined" color="green">
                          <FaEye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {getClientGeofences(selectedClient).length === 0 && (
                    <div className="text-center py-8">
                      <FaDrawPolygon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <Typography color="gray">
                        No geofences defined for this client
                      </Typography>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Checkpoints */}
            <Card>
              <CardBody className="p-6">
                <Typography variant="h6" color="blue-gray" className="mb-4">
                  Security Checkpoints
                </Typography>
                
                <div className="space-y-3">
                  {getClientCheckpoints(selectedClient).map((checkpoint) => (
                    <div key={checkpoint.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <Typography variant="small" color="blue-gray" className="font-medium">
                          {checkpoint.name}
                        </Typography>
                        <Switch checked={checkpoint.isActive} />
                      </div>
                      
                      <div className="space-y-1">
                        <Typography variant="small" color="gray">
                          Check every {checkpoint.requiredInterval} minutes
                        </Typography>
                        <Typography variant="small" color="gray">
                          Activities: {checkpoint.activities.join(', ')}
                        </Typography>
                      </div>

                      <div className="flex gap-1 mt-2">
                        {checkpoint.activities.map((activity, index) => (
                          <Chip key={index} value={activity} size="sm" color="blue" />
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  {getClientCheckpoints(selectedClient).length === 0 && (
                    <div className="text-center py-8">
                      <FaMapMarkerAlt className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <Typography color="gray">
                        No checkpoints defined for this client
                      </Typography>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Patrol Monitoring */}
          <Card>
            <CardBody className="p-6">
              <Typography variant="h6" color="blue-gray" className="mb-4">
                Patrol Monitoring
              </Typography>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border border-green-200">
                  <CardBody className="p-4 text-center">
                    <FaCheck className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <Typography variant="h4" color="green" className="font-bold">
                      {patrolData.filter(p => p.status === 'completed').length}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Completed Today
                    </Typography>
                  </CardBody>
                </Card>

                <Card className="border border-red-200">
                  <CardBody className="p-4 text-center">
                    <FaExclamationTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                    <Typography variant="h4" color="red" className="font-bold">
                      {patrolData.filter(p => p.status === 'missed').length}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Missed Checkpoints
                    </Typography>
                  </CardBody>
                </Card>

                <Card className="border border-orange-200">
                  <CardBody className="p-4 text-center">
                    <FaClock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <Typography variant="h4" color="orange" className="font-bold">
                      {alerts.filter(a => !a.isRead).length}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Active Alerts
                    </Typography>
                  </CardBody>
                </Card>
              </div>

              {/* Recent Patrol Activity */}
              <div className="space-y-3">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Recent Patrol Activity:
                </Typography>
                
                {patrolData.map((patrol) => {
                  const checkpoint = checkpoints.find(c => c.id === patrol.checkpointId);
                  return (
                    <div key={patrol.id} className={`p-3 rounded-lg border-l-4 ${
                      patrol.status === 'completed' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
                    }`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <Typography variant="small" color="blue-gray" className="font-medium">
                            {checkpoint?.name}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {new Date(patrol.timestamp).toLocaleString()}
                          </Typography>
                          {patrol.notes && (
                            <Typography variant="small" color="gray">
                              Notes: {patrol.notes}
                            </Typography>
                          )}
                        </div>
                        <Chip
                          value={patrol.status}
                          color={patrol.status === 'completed' ? 'green' : 'red'}
                          size="sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Alerts System */}
          {alerts.filter(a => !a.isRead).length > 0 && (
            <Card className="border border-red-200">
              <CardBody className="p-6">
                <Typography variant="h6" color="red" className="mb-4">
                  Active Alerts
                </Typography>
                
                <div className="space-y-3">
                  {alerts.filter(a => !a.isRead).map((alert) => (
                    <div key={alert.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <Typography variant="small" color="red" className="font-medium">
                            {alert.message}
                          </Typography>
                          <Typography variant="small" color="gray">
                            {new Date(alert.timestamp).toLocaleString()}
                          </Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <Chip
                            value={alert.severity}
                            color={alert.severity === 'high' ? 'red' : 'orange'}
                            size="sm"
                          />
                          <Button size="sm" color="red">
                            Mark Read
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}

      {/* Modals */}
      <GeofenceModal />
      <CheckpointModal />
    </div>
  );
};

export default GeofencingCheckpoints;