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
  FaExchangeAlt, 
  FaUserMinus, 
  FaGraduationCap, 
  FaClock,
  FaCheck,
  FaFileAlt,
  FaHistory,
  FaUser,
  FaCalendarCheck
} from 'react-icons/fa';
import { MdSwapHoriz, MdPerson, MdBusiness } from 'react-icons/md';

const EmployeeLifecycle = () => {
  const [employees, setEmployees] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [resignations, setResignations] = useState([]);
  const [probations, setProbations] = useState([]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showResignationModal, setShowResignationModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('transfers');

  const [transferForm, setTransferForm] = useState({
    employeeId: '',
    fromClient: '',
    toClient: '',
    fromRole: '',
    toRole: '',
    effectiveDate: '',
    reason: '',
    approvalRequired: true,
    status: 'pending'
  });

  const [resignationForm, setResignationForm] = useState({
    employeeId: '',
    resignationType: 'resignation',
    lastWorkingDay: '',
    reason: '',
    noticePeriod: '30',
    clearanceStatus: 'pending',
    exitInterview: {
      scheduled: false,
      date: '',
      feedback: ''
    }
  });

  // Mock data initialization
  useEffect(() => {
    setEmployees([
      {
        id: '1',
        name: 'John Doe',
        currentClient: 'ABC Corporate',
        currentRole: 'Security Guard',
        joinDate: '2023-01-15',
        status: 'active',
        probationStatus: 'confirmed'
      },
      {
        id: '2',
        name: 'Jane Smith',
        currentClient: 'XYZ Manufacturing',
        currentRole: 'Supervisor',
        joinDate: '2023-06-01',
        status: 'active',
        probationStatus: 'probation'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        currentClient: 'DEF Mall',
        currentRole: 'Team Leader',
        joinDate: '2022-11-20',
        status: 'active',
        probationStatus: 'confirmed'
      }
    ]);

    setTransfers([
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        fromClient: 'ABC Corporate',
        toClient: 'XYZ Manufacturing',
        fromRole: 'Security Guard',
        toRole: 'Senior Security Guard',
        requestDate: '2024-09-10',
        effectiveDate: '2024-09-15',
        reason: 'Career advancement opportunity',
        status: 'approved',
        approvedBy: 'Manager Smith'
      },
      {
        id: '2',
        employeeId: '2',
        employeeName: 'Jane Smith',
        fromClient: 'XYZ Manufacturing',
        toClient: 'DEF Mall',
        fromRole: 'Supervisor',
        toRole: 'Supervisor',
        requestDate: '2024-09-08',
        effectiveDate: '2024-09-20',
        reason: 'Location preference',
        status: 'pending',
        requestedBy: 'Field Officer'
      }
    ]);

    setResignations([
      {
        id: '1',
        employeeId: '3',
        employeeName: 'Mike Johnson',
        resignationType: 'resignation',
        submitDate: '2024-09-05',
        lastWorkingDay: '2024-10-05',
        reason: 'Better opportunity elsewhere',
        noticePeriod: '30',
        clearanceStatus: 'in_progress',
        exitInterview: {
          scheduled: true,
          date: '2024-10-03',
          feedback: ''
        },
        status: 'accepted'
      }
    ]);

    setProbations([
      {
        id: '1',
        employeeId: '2',
        employeeName: 'Jane Smith',
        startDate: '2023-06-01',
        endDate: '2023-12-01',
        duration: 6,
        currentStatus: 'probation',
        evaluations: [
          {
            date: '2023-08-01',
            rating: 7,
            feedback: 'Good progress, needs improvement in communication'
          },
          {
            date: '2023-10-01',
            rating: 8,
            feedback: 'Significant improvement, on track for confirmation'
          }
        ],
        finalDecision: 'pending'
      }
    ]);
  }, []);

  const handleTransferRequest = () => {
    const newTransfer = {
      id: Date.now().toString(),
      ...transferForm,
      employeeName: employees.find(e => e.id === transferForm.employeeId)?.name,
      requestDate: new Date().toISOString().split('T')[0],
      requestedBy: 'Field Officer',
      status: 'pending'
    };

    setTransfers([newTransfer, ...transfers]);
    setShowTransferModal(false);
    setTransferForm({
      employeeId: '',
      fromClient: '',
      toClient: '',
      fromRole: '',
      toRole: '',
      effectiveDate: '',
      reason: '',
      approvalRequired: true,
      status: 'pending'
    });
  };

  const handleResignation = () => {
    const newResignation = {
      id: Date.now().toString(),
      ...resignationForm,
      employeeName: employees.find(e => e.id === resignationForm.employeeId)?.name,
      submitDate: new Date().toISOString().split('T')[0],
      status: 'submitted'
    };

    setResignations([newResignation, ...resignations]);
    setShowResignationModal(false);
    setResignationForm({
      employeeId: '',
      resignationType: 'resignation',
      lastWorkingDay: '',
      reason: '',
      noticePeriod: '30',
      clearanceStatus: 'pending',
      exitInterview: {
        scheduled: false,
        date: '',
        feedback: ''
      }
    });
  };

  const updateTransferStatus = (transferId, status, approvedBy = '') => {
    setTransfers(transfers.map(t => 
      t.id === transferId 
        ? { ...t, status, approvedBy, processedDate: new Date().toISOString().split('T')[0] }
        : t
    ));
  };

  const confirmProbation = (probationId, decision, feedback) => {
    setProbations(probations.map(p => 
      p.id === probationId 
        ? { ...p, finalDecision: decision, finalFeedback: feedback, confirmationDate: new Date().toISOString().split('T')[0] }
        : p
    ));

    // Update employee status
    const probation = probations.find(p => p.id === probationId);
    if (probation) {
      setEmployees(employees.map(e => 
        e.id === probation.employeeId 
          ? { ...e, probationStatus: decision === 'confirmed' ? 'confirmed' : 'terminated' }
          : e
      ));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': case 'confirmed': case 'accepted': return 'green';
      case 'rejected': case 'terminated': return 'red';
      case 'pending': case 'probation': return 'orange';
      case 'in_progress': return 'blue';
      default: return 'gray';
    }
  };

  const TransfersView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Employee Transfers
        </Typography>
        <Button
          color="blue"
          size="sm"
          onClick={() => setShowTransferModal(true)}
          className="flex items-center gap-2"
        >
          <FaExchangeAlt className="h-4 w-4" />
          Request Transfer
        </Button>
      </div>

      {transfers.map((transfer) => (
        <Card key={transfer.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {transfer.employeeName}
                </Typography>
                <Typography variant="small" color="gray">
                  {transfer.fromRole} → {transfer.toRole}
                </Typography>
                <Typography variant="small" color="gray">
                  {transfer.fromClient} → {transfer.toClient}
                </Typography>
              </div>
              <Chip
                value={transfer.status}
                color={getStatusColor(transfer.status)}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Request Date:
                </Typography>
                <Typography variant="small" color="gray">
                  {transfer.requestDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Effective Date:
                </Typography>
                <Typography variant="small" color="gray">
                  {transfer.effectiveDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Requested By:
                </Typography>
                <Typography variant="small" color="gray">
                  {transfer.requestedBy}
                </Typography>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Reason:
              </Typography>
              <Typography variant="small" color="gray">
                {transfer.reason}
              </Typography>
            </div>

            {transfer.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  color="green"
                  onClick={() => updateTransferStatus(transfer.id, 'approved', 'Field Officer')}
                >
                  <FaCheck className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  color="red"
                  onClick={() => updateTransferStatus(transfer.id, 'rejected', 'Field Officer')}
                >
                  Reject
                </Button>
              </div>
            )}

            {transfer.approvedBy && (
              <Typography variant="small" color="gray" className="mt-2">
                Approved by: {transfer.approvedBy}
              </Typography>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const ResignationsView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Resignations & Terminations
        </Typography>
        <Button
          color="red"
          size="sm"
          onClick={() => setShowResignationModal(true)}
          className="flex items-center gap-2"
        >
          <FaUserMinus className="h-4 w-4" />
          Process Resignation
        </Button>
      </div>

      {resignations.map((resignation) => (
        <Card key={resignation.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {resignation.employeeName}
                </Typography>
                <Typography variant="small" color="gray">
                  {resignation.resignationType === 'resignation' ? 'Voluntary Resignation' : 'Termination'}
                </Typography>
              </div>
              <Chip
                value={resignation.status}
                color={getStatusColor(resignation.status)}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Submit Date:
                </Typography>
                <Typography variant="small" color="gray">
                  {resignation.submitDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Last Working Day:
                </Typography>
                <Typography variant="small" color="gray">
                  {resignation.lastWorkingDay}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Notice Period:
                </Typography>
                <Typography variant="small" color="gray">
                  {resignation.noticePeriod} days
                </Typography>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Reason:
              </Typography>
              <Typography variant="small" color="gray">
                {resignation.reason}
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Clearance Status:
                </Typography>
                <Chip
                  value={resignation.clearanceStatus}
                  color={getStatusColor(resignation.clearanceStatus)}
                  size="sm"
                />
              </div>
              
              {resignation.exitInterview.scheduled && (
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Exit Interview:
                  </Typography>
                  <Typography variant="small" color="gray">
                    📅 {resignation.exitInterview.date}
                  </Typography>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const ProbationsView = () => (
    <div className="space-y-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">
        Probation Tracking
      </Typography>

      {probations.map((probation) => (
        <Card key={probation.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {probation.employeeName}
                </Typography>
                <Typography variant="small" color="gray">
                  Probation Period: {probation.duration} months
                </Typography>
              </div>
              <Chip
                value={probation.currentStatus}
                color={getStatusColor(probation.currentStatus)}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Start Date:
                </Typography>
                <Typography variant="small" color="gray">
                  {probation.startDate}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  End Date:
                </Typography>
                <Typography variant="small" color="gray">
                  {probation.endDate}
                </Typography>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                Probation Progress:
              </Typography>
              <Progress 
                value={75} 
                color="blue" 
                className="mb-2"
              />
              <Typography variant="small" color="gray">
                75% Complete
              </Typography>
            </div>

            {/* Evaluations */}
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                Evaluations:
              </Typography>
              <div className="space-y-2">
                {probation.evaluations.map((evaluation, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <Typography variant="small" color="blue-gray" className="font-medium">
                        {evaluation.date}
                      </Typography>
                      <Typography variant="small" color={evaluation.rating >= 8 ? 'green' : evaluation.rating >= 6 ? 'orange' : 'red'} className="font-bold">
                        {evaluation.rating}/10
                      </Typography>
                    </div>
                    <Typography variant="small" color="gray">
                      {evaluation.feedback}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {probation.finalDecision === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  color="green"
                  onClick={() => confirmProbation(probation.id, 'confirmed', 'Successfully completed probation')}
                >
                  <FaCheck className="h-3 w-3 mr-1" />
                  Confirm Employment
                </Button>
                <Button 
                  size="sm" 
                  color="red"
                  onClick={() => confirmProbation(probation.id, 'terminated', 'Did not meet probation requirements')}
                >
                  Terminate
                </Button>
              </div>
            )}

            {probation.finalDecision !== 'pending' && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Final Decision: {probation.finalDecision}
                </Typography>
                {probation.finalFeedback && (
                  <Typography variant="small" color="gray">
                    {probation.finalFeedback}
                  </Typography>
                )}
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );

  // Transfer Modal
  const TransferModal = () => (
    <Dialog open={showTransferModal} handler={() => setShowTransferModal(false)}>
      <DialogHeader>Employee Transfer Request</DialogHeader>
      <DialogBody className="space-y-4">
        <Select 
          label="Select Employee"
          value={transferForm.employeeId}
          onChange={(value) => {
            const employee = employees.find(e => e.id === value);
            setTransferForm({
              ...transferForm,
              employeeId: value,
              fromClient: employee?.currentClient || '',
              fromRole: employee?.currentRole || ''
            });
          }}
        >
          {employees.filter(e => e.status === 'active').map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name} - {employee.currentRole}
            </Option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="From Client" 
            value={transferForm.fromClient}
            disabled
          />
          <Input 
            label="To Client"
            value={transferForm.toClient}
            onChange={(e) => setTransferForm({...transferForm, toClient: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="From Role" 
            value={transferForm.fromRole}
            disabled
          />
          <Input 
            label="To Role"
            value={transferForm.toRole}
            onChange={(e) => setTransferForm({...transferForm, toRole: e.target.value})}
          />
        </div>

        <Input 
          label="Effective Date" 
          type="date"
          value={transferForm.effectiveDate}
          onChange={(e) => setTransferForm({...transferForm, effectiveDate: e.target.value})}
        />

        <Textarea 
          label="Reason for Transfer"
          value={transferForm.reason}
          onChange={(e) => setTransferForm({...transferForm, reason: e.target.value})}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowTransferModal(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleTransferRequest}>
          Submit Request
        </Button>
      </DialogFooter>
    </Dialog>
  );

  // Resignation Modal
  const ResignationModal = () => (
    <Dialog open={showResignationModal} handler={() => setShowResignationModal(false)}>
      <DialogHeader>Process Resignation/Termination</DialogHeader>
      <DialogBody className="space-y-4">
        <Select 
          label="Select Employee"
          value={resignationForm.employeeId}
          onChange={(value) => setResignationForm({...resignationForm, employeeId: value})}
        >
          {employees.filter(e => e.status === 'active').map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name} - {employee.currentRole}
            </Option>
          ))}
        </Select>

        <Select 
          label="Type"
          value={resignationForm.resignationType}
          onChange={(value) => setResignationForm({...resignationForm, resignationType: value})}
        >
          <Option value="resignation">Voluntary Resignation</Option>
          <Option value="termination">Termination</Option>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Last Working Day" 
            type="date"
            value={resignationForm.lastWorkingDay}
            onChange={(e) => setResignationForm({...resignationForm, lastWorkingDay: e.target.value})}
          />
          <Input 
            label="Notice Period (days)"
            type="number"
            value={resignationForm.noticePeriod}
            onChange={(e) => setResignationForm({...resignationForm, noticePeriod: e.target.value})}
          />
        </div>

        <Textarea 
          label="Reason"
          value={resignationForm.reason}
          onChange={(e) => setResignationForm({...resignationForm, reason: e.target.value})}
        />

        <Input 
          label="Exit Interview Date" 
          type="date"
          value={resignationForm.exitInterview.date}
          onChange={(e) => setResignationForm({
            ...resignationForm,
            exitInterview: {
              ...resignationForm.exitInterview,
              date: e.target.value,
              scheduled: true
            }
          })}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowResignationModal(false)}>
          Cancel
        </Button>
        <Button color="red" onClick={handleResignation}>
          Process
        </Button>
      </DialogFooter>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-teal-500 text-white rounded-xl">
              <MdSwapHoriz className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Employee Lifecycle Management
              </Typography>
              <Typography color="gray" className="font-normal">
                Handle transfers, resignations, and probation confirmations
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-blue-200">
          <CardBody className="p-4 text-center">
            <FaExchangeAlt className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <Typography variant="h4" color="blue" className="font-bold">
              {transfers.length}
            </Typography>
            <Typography variant="small" color="gray">
              Transfers Processed
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-red-200">
          <CardBody className="p-4 text-center">
            <FaUserMinus className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <Typography variant="h4" color="red" className="font-bold">
              {resignations.length}
            </Typography>
            <Typography variant="small" color="gray">
              Resignations/Terminations
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-orange-200">
          <CardBody className="p-4 text-center">
            <FaClock className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <Typography variant="h4" color="orange" className="font-bold">
              {probations.filter(p => p.currentStatus === 'probation').length}
            </Typography>
            <Typography variant="small" color="gray">
              On Probation
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-green-200">
          <CardBody className="p-4 text-center">
            <FaGraduationCap className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <Typography variant="h4" color="green" className="font-bold">
              {employees.filter(e => e.probationStatus === 'confirmed').length}
            </Typography>
            <Typography variant="small" color="gray">
              Confirmed Employees
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab}>
        <TabsHeader>
          <Tab value="transfers" onClick={() => setActiveTab('transfers')}>
            Transfers
          </Tab>
          <Tab value="resignations" onClick={() => setActiveTab('resignations')}>
            Resignations
          </Tab>
          <Tab value="probations" onClick={() => setActiveTab('probations')}>
            Probations
          </Tab>
        </TabsHeader>
        
        <TabsBody>
          <TabPanel value="transfers">
            <TransfersView />
          </TabPanel>
          <TabPanel value="resignations">
            <ResignationsView />
          </TabPanel>
          <TabPanel value="probations">
            <ProbationsView />
          </TabPanel>
        </TabsBody>
      </Tabs>

      {/* Modals */}
      <TransferModal />
      <ResignationModal />
    </div>
  );
};

export default EmployeeLifecycle;