import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Button, 
  Select, 
  Option, 
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Chip,
  Progress
} from '@material-tailwind/react';
import { 
  FaBuilding, 
  FaUsers, 
  FaUserTie, 
  FaSave, 
  FaCheck, 
  FaExclamationTriangle,
  FaPlus,
  FaEdit
} from 'react-icons/fa';
import { MdAdd, MdPeople, MdAssignment } from 'react-icons/md';

const ClientPOManagement = () => {
  const [selectedClient, setSelectedClient] = useState('');
  const [clients, setClients] = useState([]);
  const [poRequirements, setPORequirements] = useState(null);
  const [resourceAllocation, setResourceAllocation] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [showAllocationModal, setShowAllocationModal] = useState(false);
  const [organizationPool, setOrganizationPool] = useState([]);

  // Mock data - In real implementation, this would come from API
  useEffect(() => {
    // Fetch clients
    setClients([
      {
        id: '1',
        name: 'ABC Corporate Tower',
        location: 'Downtown Business District',
        contractValue: 250000,
        status: 'active'
      },
      {
        id: '2', 
        name: 'XYZ Manufacturing Plant',
        location: 'Industrial Area',
        contractValue: 180000,
        status: 'active'
      },
      {
        id: '3',
        name: 'DEF Shopping Mall',
        location: 'City Center',
        contractValue: 320000,
        status: 'pending'
      }
    ]);

    // Mock organization pool
    setOrganizationPool([
      { id: '1', name: 'John Doe', role: 'Security Guard', gender: 'Male', experience: '3 years', available: true },
      { id: '2', name: 'Jane Smith', role: 'Security Guard', gender: 'Female', experience: '2 years', available: true },
      { id: '3', name: 'Mike Johnson', role: 'Supervisor', gender: 'Male', experience: '5 years', available: true },
      { id: '4', name: 'Sarah Wilson', role: 'Security Guard', gender: 'Female', experience: '1 year', available: true },
      { id: '5', name: 'Tom Brown', role: 'Team Leader', gender: 'Male', experience: '4 years', available: false }
    ]);
  }, []);

  const fetchPORequirements = (clientId) => {
    // Mock PO requirements - In real implementation, fetch from API
    const mockRequirements = {
      '1': {
        totalStaff: 12,
        maleRequired: 8,
        femaleRequired: 4,
        shifts: ['Morning', 'Evening', 'Night'],
        roles: {
          'Security Guard': 8,
          'Supervisor': 2,
          'Team Leader': 2
        },
        specialRequirements: ['Armed guards preferred', 'Minimum 2 years experience']
      },
      '2': {
        totalStaff: 16,
        maleRequired: 12,
        femaleRequired: 4,
        shifts: ['Day', 'Night'],
        roles: {
          'Security Guard': 12,
          'Supervisor': 2,
          'Team Leader': 2
        },
        specialRequirements: ['Industrial safety training required']
      },
      '3': {
        totalStaff: 20,
        maleRequired: 12,
        femaleRequired: 8,
        shifts: ['Morning', 'Afternoon', 'Evening'],
        roles: {
          'Security Guard': 14,
          'Supervisor': 3,
          'Team Leader': 3
        },
        specialRequirements: ['Customer service training', 'Retail experience preferred']
      }
    };

    setPORequirements(mockRequirements[clientId] || null);
    setResourceAllocation({});
    setValidationErrors({});
  };

  const handleClientSelect = (clientId) => {
    setSelectedClient(clientId);
    fetchPORequirements(clientId);
  };

  const validateAllocation = () => {
    if (!poRequirements) return false;

    const errors = {};
    const allocation = resourceAllocation;

    // Check total staff allocation
    const allocatedTotal = Object.values(allocation).reduce((sum, shift) => {
      return sum + (shift.staff ? shift.staff.length : 0);
    }, 0);

    if (allocatedTotal !== poRequirements.totalStaff) {
      errors.totalStaff = `Required: ${poRequirements.totalStaff}, Allocated: ${allocatedTotal}`;
    }

    // Check gender distribution
    let allocatedMale = 0, allocatedFemale = 0;
    Object.values(allocation).forEach(shift => {
      if (shift.staff) {
        shift.staff.forEach(staffId => {
          const staff = organizationPool.find(s => s.id === staffId);
          if (staff) {
            if (staff.gender === 'Male') allocatedMale++;
            else allocatedFemale++;
          }
        });
      }
    });

    if (allocatedMale < poRequirements.maleRequired) {
      errors.maleStaff = `Required: ${poRequirements.maleRequired}, Allocated: ${allocatedMale}`;
    }
    if (allocatedFemale < poRequirements.femaleRequired) {
      errors.femaleStaff = `Required: ${poRequirements.femaleRequired}, Allocated: ${allocatedFemale}`;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const saveClientShiftRequirements = () => {
    if (validateAllocation()) {
      // In real implementation, save to API
      console.log('Saving client-wise shift + staff requirements:', {
        clientId: selectedClient,
        requirements: poRequirements,
        allocation: resourceAllocation
      });
      
      // Show success message
      alert('Client shift and staff requirements saved successfully!');
    }
  };

  const getSelectedClient = () => {
    return clients.find(c => c.id === selectedClient);
  };

  const getAllocationProgress = () => {
    if (!poRequirements) return 0;
    
    const allocatedTotal = Object.values(resourceAllocation).reduce((sum, shift) => {
      return sum + (shift.staff ? shift.staff.length : 0);
    }, 0);
    
    return Math.round((allocatedTotal / poRequirements.totalStaff) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 text-white rounded-xl">
              <FaBuilding className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Client & PO Management
              </Typography>
              <Typography color="gray" className="font-normal">
                Select clients, fetch PO requirements, and allocate resources
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Client Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Select Client
            </Typography>
            
            <Select 
              label="Choose Client"
              value={selectedClient}
              onChange={(value) => handleClientSelect(value)}
            >
              {clients.map((client) => (
                <Option key={client.id} value={client.id}>
                  <div className="flex justify-between items-center w-full">
                    <span>{client.name}</span>
                    <Chip
                      value={client.status}
                      color={client.status === 'active' ? 'green' : 'orange'}
                      size="sm"
                    />
                  </div>
                </Option>
              ))}
            </Select>

            {selectedClient && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Selected Client Details:
                </Typography>
                <div className="mt-2 space-y-1">
                  <Typography variant="small" color="gray">
                    <strong>Name:</strong> {getSelectedClient()?.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    <strong>Location:</strong> {getSelectedClient()?.location}
                  </Typography>
                  <Typography variant="small" color="gray">
                    <strong>Contract Value:</strong> ${getSelectedClient()?.contractValue?.toLocaleString()}
                  </Typography>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* PO Requirements */}
        <Card>
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              PO Requirements
            </Typography>
            
            {!selectedClient ? (
              <div className="text-center py-8">
                <FaExclamationTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <Typography color="gray">
                  Please select a client to view PO requirements
                </Typography>
              </div>
            ) : poRequirements ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <Typography variant="small" color="green" className="font-medium">
                      Total Staff Required
                    </Typography>
                    <Typography variant="h4" color="green" className="font-bold">
                      {poRequirements.totalStaff}
                    </Typography>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Typography variant="small" color="purple" className="font-medium">
                      Gender Distribution
                    </Typography>
                    <Typography variant="small" color="purple">
                      Male: {poRequirements.maleRequired} | Female: {poRequirements.femaleRequired}
                    </Typography>
                  </div>
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                    Required Shifts:
                  </Typography>
                  <div className="flex flex-wrap gap-2">
                    {poRequirements.shifts.map((shift) => (
                      <Chip key={shift} value={shift} color="blue" size="sm" />
                    ))}
                  </div>
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                    Role Requirements:
                  </Typography>
                  {Object.entries(poRequirements.roles).map(([role, count]) => (
                    <div key={role} className="flex justify-between items-center py-1">
                      <Typography variant="small" color="gray">{role}</Typography>
                      <Chip value={count.toString()} color="indigo" size="sm" />
                    </div>
                  ))}
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                    Special Requirements:
                  </Typography>
                  {poRequirements.specialRequirements.map((req, index) => (
                    <Typography key={index} variant="small" color="gray" className="mb-1">
                      • {req}
                    </Typography>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Typography color="gray">
                  Loading PO requirements...
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Resource Allocation */}
      {poRequirements && (
        <Card>
          <CardBody className="p-6">
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h6" color="blue-gray">
                Resource Allocation
              </Typography>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Typography variant="small" color="gray">Progress:</Typography>
                  <div className="w-32">
                    <Progress 
                      value={getAllocationProgress()} 
                      color="blue"
                      className="h-2"
                    />
                  </div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    {getAllocationProgress()}%
                  </Typography>
                </div>
                <Button
                  size="sm"
                  color="blue"
                  className="flex items-center gap-2"
                  onClick={() => setShowAllocationModal(true)}
                >
                  <MdAdd className="h-4 w-4" />
                  Allocate Resources
                </Button>
              </div>
            </div>

            {/* Validation Errors */}
            {Object.keys(validationErrors).length > 0 && (
              <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <Typography variant="small" color="red" className="font-medium mb-2">
                  Validation Errors:
                </Typography>
                {Object.entries(validationErrors).map(([key, error]) => (
                  <Typography key={key} variant="small" color="red" className="mb-1">
                    • {error}
                  </Typography>
                ))}
              </div>
            )}

            {/* Allocation Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {poRequirements.shifts.map((shift) => (
                <Card key={shift} className="border">
                  <CardBody className="p-4">
                    <Typography variant="h6" color="blue-gray" className="mb-3">
                      {shift} Shift
                    </Typography>
                    
                    <div className="space-y-2">
                      <Typography variant="small" color="gray">
                        Allocated Staff: {resourceAllocation[shift]?.staff?.length || 0}
                      </Typography>
                      
                      {resourceAllocation[shift]?.staff?.length > 0 && (
                        <div className="space-y-1">
                          {resourceAllocation[shift].staff.map((staffId) => {
                            const staff = organizationPool.find(s => s.id === staffId);
                            return (
                              <div key={staffId} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                                <div className={`w-2 h-2 rounded-full ${staff?.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                                <Typography variant="small" className="flex-1">
                                  {staff?.name} - {staff?.role}
                                </Typography>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Button
                color="green"
                className="flex items-center gap-2"
                onClick={saveClientShiftRequirements}
                disabled={Object.keys(validationErrors).length > 0}
              >
                <FaSave className="h-4 w-4" />
                Save Requirements
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Resource Allocation Modal */}
      <Dialog 
        open={showAllocationModal} 
        handler={() => setShowAllocationModal(false)}
        size="lg"
      >
        <DialogHeader>
          <Typography variant="h5" color="blue-gray">
            Allocate Staff Resources
          </Typography>
        </DialogHeader>
        <DialogBody className="space-y-4 max-h-96 overflow-y-auto">
          <Typography color="gray" className="mb-4">
            Select staff members from the organization pool and assign them to shifts.
          </Typography>
          
          {/* Available Staff Pool */}
          <div className="space-y-2">
            <Typography variant="h6" color="blue-gray">Available Staff</Typography>
            {organizationPool.filter(staff => staff.available).map((staff) => (
              <div key={staff.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${staff.gender === 'Male' ? 'bg-blue-500' : 'bg-pink-500'}`}></div>
                  <div>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {staff.name}
                    </Typography>
                    <Typography variant="small" color="gray">
                      {staff.role} • {staff.experience} • {staff.gender}
                    </Typography>
                  </div>
                </div>
                <Button size="sm" color="blue" variant="outlined">
                  Assign
                </Button>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button variant="outlined" onClick={() => setShowAllocationModal(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={() => setShowAllocationModal(false)}>
            Apply Allocation
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ClientPOManagement;