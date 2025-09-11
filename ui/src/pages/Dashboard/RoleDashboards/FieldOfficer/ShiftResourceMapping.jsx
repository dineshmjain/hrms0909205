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
  Switch,
  IconButton
} from '@material-tailwind/react';
import { 
  FaClock, 
  FaUsers, 
  FaUserPlus, 
  FaEdit, 
  FaTrash,
  FaExchangeAlt,
  FaSave,
  FaPlus
} from 'react-icons/fa';
import { MdSchedule, MdPeople, MdSwapHoriz } from 'react-icons/md';

const ShiftResourceMapping = () => {
  const [shifts, setShifts] = useState([]);
  const [customShifts, setCustomShifts] = useState([]);
  const [staffAssignments, setStaffAssignments] = useState({});
  const [organizationPool, setOrganizationPool] = useState([]);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [replacementData, setReplacementData] = useState({});
  const [overtimeRecords, setOvertimeRecords] = useState([]);

  // Mock data initialization
  useEffect(() => {
    // Default shifts
    setShifts([
      { id: '1', name: 'Morning', startTime: '06:00', endTime: '14:00', type: 'standard' },
      { id: '2', name: 'Evening', startTime: '14:00', endTime: '22:00', type: 'standard' },
      { id: '3', name: 'Night', startTime: '22:00', endTime: '06:00', type: 'standard' }
    ]);

    // Organization pool
    setOrganizationPool([
      { 
        id: '1', name: 'John Doe', role: 'Security Guard', 
        experience: '3 years', available: true, currentShift: 'Morning',
        skills: ['Armed Security', 'CCTV Monitoring']
      },
      { 
        id: '2', name: 'Jane Smith', role: 'Security Guard', 
        experience: '2 years', available: true, currentShift: 'Evening',
        skills: ['Customer Service', 'Emergency Response']
      },
      { 
        id: '3', name: 'Mike Johnson', role: 'Supervisor', 
        experience: '5 years', available: true, currentShift: 'Morning',
        skills: ['Team Management', 'Incident Handling']
      },
      { 
        id: '4', name: 'Sarah Wilson', role: 'Security Guard', 
        experience: '1 year', available: false, currentShift: 'Night',
        skills: ['Basic Security', 'Report Writing']
      }
    ]);

    // Initial assignments
    setStaffAssignments({
      '1': ['1', '3'], // Morning: John, Mike
      '2': ['2'], // Evening: Jane
      '3': ['4'] // Night: Sarah
    });

    // Overtime records
    setOvertimeRecords([
      { id: '1', staffId: '1', date: '2024-09-10', hours: 2, reason: 'Staff shortage' },
      { id: '2', staffId: '2', date: '2024-09-09', hours: 4, reason: 'Emergency coverage' }
    ]);
  }, []);

  const handleCreateShift = (shiftData) => {
    const newShift = {
      id: Date.now().toString(),
      ...shiftData,
      type: 'custom'
    };
    setShifts([...shifts, newShift]);
    setShowShiftModal(false);
  };

  const handleStaffAssignment = (shiftId, staffId, action) => {
    const currentAssignments = staffAssignments[shiftId] || [];
    
    if (action === 'add') {
      setStaffAssignments({
        ...staffAssignments,
        [shiftId]: [...currentAssignments, staffId]
      });
    } else if (action === 'remove') {
      setStaffAssignments({
        ...staffAssignments,
        [shiftId]: currentAssignments.filter(id => id !== staffId)
      });
    }
  };

  const handleReplacement = (absentStaffId, replacementStaffId, shiftId) => {
    const currentAssignments = staffAssignments[shiftId] || [];
    const updatedAssignments = currentAssignments.map(id => 
      id === absentStaffId ? replacementStaffId : id
    );
    
    setStaffAssignments({
      ...staffAssignments,
      [shiftId]: updatedAssignments
    });

    // Log replacement
    console.log(`Replaced ${absentStaffId} with ${replacementStaffId} in shift ${shiftId}`);
    setShowReplacementModal(false);
  };

  const calculateOvertime = (staffId, extraHours, reason) => {
    const newOvertimeRecord = {
      id: Date.now().toString(),
      staffId,
      date: new Date().toISOString().split('T')[0],
      hours: extraHours,
      reason
    };
    
    setOvertimeRecords([...overtimeRecords, newOvertimeRecord]);
  };

  const getStaffByShift = (shiftId) => {
    const assignedStaffIds = staffAssignments[shiftId] || [];
    return assignedStaffIds.map(staffId => 
      organizationPool.find(staff => staff.id === staffId)
    ).filter(Boolean);
  };

  const getAvailableStaff = () => {
    return organizationPool.filter(staff => staff.available);
  };

  const ShiftModal = () => (
    <Dialog open={showShiftModal} handler={() => setShowShiftModal(false)}>
      <DialogHeader>Create Custom Shift</DialogHeader>
      <DialogBody className="space-y-4">
        <Input label="Shift Name" />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Time" type="time" />
          <Input label="End Time" type="time" />
        </div>
        <Input label="Description" />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowShiftModal(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={() => handleCreateShift({})}>
          Create Shift
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
              <div className="p-3 bg-green-500 text-white rounded-xl">
                <MdSchedule className="h-6 w-6" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  Shift & Resource Mapping
                </Typography>
                <Typography color="gray" className="font-normal">
                  Define shifts, map staff, handle replacements, and track overtime
                </Typography>
              </div>
            </div>
            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() => setShowShiftModal(true)}
            >
              <FaPlus className="h-4 w-4" />
              Create Custom Shift
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Shift Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shift Definitions */}
        <Card>
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Shift Definitions
            </Typography>
            
            <div className="space-y-4">
              {shifts.map((shift) => (
                <div key={shift.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <Typography variant="h6" color="blue-gray">
                      {shift.name}
                    </Typography>
                    <div className="flex items-center gap-2">
                      <Chip
                        value={shift.type}
                        color={shift.type === 'standard' ? 'blue' : 'purple'}
                        size="sm"
                      />
                      {shift.type === 'custom' && (
                        <IconButton size="sm" color="red" variant="text">
                          <FaTrash className="h-3 w-3" />
                        </IconButton>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{shift.startTime} - {shift.endTime}</span>
                    <span>•</span>
                    <span>{getStaffByShift(shift.id).length} Staff Assigned</span>
                  </div>

                  <div className="mt-3">
                    <Typography variant="small" color="gray" className="mb-2">
                      Assigned Staff:
                    </Typography>
                    <div className="flex flex-wrap gap-2">
                      {getStaffByShift(shift.id).map((staff) => (
                        <div key={staff.id} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                          <Typography variant="small" color="blue-gray">
                            {staff.name}
                          </Typography>
                          <IconButton
                            size="sm"
                            color="red"
                            variant="text"
                            onClick={() => handleStaffAssignment(shift.id, staff.id, 'remove')}
                          >
                            <FaTrash className="h-3 w-3" />
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Staff Pool */}
        <Card>
          <CardBody className="p-6">
            <Typography variant="h6" color="blue-gray" className="mb-4">
              Available Staff Pool
            </Typography>
            
            <div className="space-y-3">
              {getAvailableStaff().map((staff) => (
                <div key={staff.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {staff.name}
                      </Typography>
                      <Typography variant="small" color="gray">
                        {staff.role} • {staff.experience}
                      </Typography>
                      <div className="flex gap-1 mt-2">
                        {staff.skills.map((skill, index) => (
                          <Chip key={index} value={skill} size="sm" color="green" />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Typography variant="small" color="gray">
                        Current: {staff.currentShift}
                      </Typography>
                      <Select size="sm" label="Assign to">
                        {shifts.map((shift) => (
                          <Option
                            key={shift.id}
                            value={shift.id}
                            onClick={() => handleStaffAssignment(shift.id, staff.id, 'add')}
                          >
                            {shift.name}
                          </Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Replacement Logic */}
      <Card>
        <CardBody className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Replacement Management
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border">
              <CardBody className="p-4 text-center">
                <MdSwapHoriz className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Quick Replace
                </Typography>
                <Typography variant="small" color="gray" className="mb-4">
                  Replace absent staff immediately
                </Typography>
                <Button
                  size="sm"
                  color="blue"
                  onClick={() => setShowReplacementModal(true)}
                >
                  Find Replacement
                </Button>
              </CardBody>
            </Card>

            <Card className="border">
              <CardBody className="p-4 text-center">
                <FaClock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Overtime Tracking
                </Typography>
                <Typography variant="small" color="gray" className="mb-4">
                  Track extra hours worked
                </Typography>
                <Typography variant="h4" color="orange" className="font-bold">
                  {overtimeRecords.reduce((sum, record) => sum + record.hours, 0)}h
                </Typography>
              </CardBody>
            </Card>

            <Card className="border">
              <CardBody className="p-4 text-center">
                <FaUsers className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <Typography variant="h6" color="blue-gray" className="mb-2">
                  Available Backup
                </Typography>
                <Typography variant="small" color="gray" className="mb-4">
                  Staff ready for replacement
                </Typography>
                <Typography variant="h4" color="green" className="font-bold">
                  {getAvailableStaff().length}
                </Typography>
              </CardBody>
            </Card>
          </div>

          {/* Recent Replacements */}
          <div className="mt-6">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Recent Overtime Records
            </Typography>
            <div className="space-y-2">
              {overtimeRecords.map((record) => {
                const staff = organizationPool.find(s => s.id === record.staffId);
                return (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {staff?.name}
                      </Typography>
                      <Typography variant="small" color="gray">
                        {record.reason} • {record.date}
                      </Typography>
                    </div>
                    <Chip
                      value={`${record.hours}h overtime`}
                      color="orange"
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Modals */}
      <ShiftModal />

      {/* Replacement Modal */}
      <Dialog open={showReplacementModal} handler={() => setShowReplacementModal(false)}>
        <DialogHeader>Find Staff Replacement</DialogHeader>
        <DialogBody className="space-y-4">
          <Select label="Select Absent Staff">
            {organizationPool.map((staff) => (
              <Option key={staff.id} value={staff.id}>
                {staff.name} - {staff.currentShift}
              </Option>
            ))}
          </Select>
          
          <Select label="Select Replacement">
            {getAvailableStaff().map((staff) => (
              <Option key={staff.id} value={staff.id}>
                {staff.name} - {staff.role}
              </Option>
            ))}
          </Select>

          <Input label="Reason for Replacement" />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={() => setShowReplacementModal(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={() => handleReplacement('', '', '')}>
            Confirm Replacement
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default ShiftResourceMapping;