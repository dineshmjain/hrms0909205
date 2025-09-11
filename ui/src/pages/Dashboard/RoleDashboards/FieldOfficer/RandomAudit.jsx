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
  Textarea,
  Checkbox,
  Rating
} from '@material-tailwind/react';
import { 
  FaShieldAlt, 
  FaSearch, 
  FaUsers, 
  FaClipboardCheck, 
  FaTshirt,
  FaTools,
  FaCamera,
  FaFileAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';
import { MdLocationOn, MdSecurity, MdAssignment } from 'react-icons/md';

const RandomAudit = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [currentAudit, setCurrentAudit] = useState(null);
  const [auditHistory, setAuditHistory] = useState([]);
  const [showAuditModal, setShowAuditModal] = useState(false);
  const [auditForm, setAuditForm] = useState({
    clientId: '',
    auditType: 'surprise',
    findings: {
      headcount: { expected: 0, actual: 0, status: 'pending' },
      staffPresence: { verified: [], missing: [], status: 'pending' },
      uniformCompliance: { compliant: [], nonCompliant: [], status: 'pending' },
      documentation: { complete: true, issues: [], status: 'pending' },
      equipment: { items: [], status: 'pending' }
    },
    photos: [],
    overallRating: 0,
    recommendations: '',
    notes: ''
  });

  // Mock data initialization
  useEffect(() => {
    setClients([
      { 
        id: '1', 
        name: 'ABC Corporate Tower', 
        location: 'Downtown',
        allocatedStaff: 12,
        currentShift: 'Morning',
        lastAudit: '2024-09-05'
      },
      { 
        id: '2', 
        name: 'XYZ Manufacturing', 
        location: 'Industrial Area',
        allocatedStaff: 16,
        currentShift: 'Day',
        lastAudit: '2024-09-03'
      },
      { 
        id: '3', 
        name: 'DEF Shopping Mall', 
        location: 'City Center',
        allocatedStaff: 20,
        currentShift: 'Evening',
        lastAudit: '2024-09-01'
      }
    ]);

    setAuditHistory([
      {
        id: '1',
        clientId: '1',
        clientName: 'ABC Corporate Tower',
        date: '2024-09-05',
        time: '14:30',
        type: 'surprise',
        overallScore: 8.5,
        status: 'completed',
        findings: {
          headcount: { expected: 12, actual: 11, status: 'failed' },
          uniformCompliance: { rating: 9, status: 'passed' },
          documentation: { rating: 8, status: 'passed' },
          equipment: { rating: 7, status: 'warning' }
        },
        recommendations: 'Improve headcount accuracy, check equipment inventory',
        officerName: 'Field Officer John'
      },
      {
        id: '2',
        clientId: '2',
        date: '2024-09-03',
        time: '11:15',
        type: 'scheduled',
        overallScore: 9.2,
        status: 'completed',
        findings: {
          headcount: { expected: 16, actual: 16, status: 'passed' },
          uniformCompliance: { rating: 9.5, status: 'passed' },
          documentation: { rating: 9, status: 'passed' },
          equipment: { rating: 9, status: 'passed' }
        },
        recommendations: 'Excellent performance, maintain standards',
        officerName: 'Field Officer Sarah'
      }
    ]);
  }, []);

  const startNewAudit = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    setCurrentAudit({
      id: Date.now().toString(),
      clientId,
      clientName: client.name,
      startTime: new Date().toISOString(),
      status: 'in_progress'
    });
    
    setAuditForm({
      ...auditForm,
      clientId,
      findings: {
        ...auditForm.findings,
        headcount: { 
          expected: client.allocatedStaff, 
          actual: 0, 
          status: 'pending' 
        }
      }
    });
    
    setShowAuditModal(true);
  };

  const completeAudit = () => {
    const newAudit = {
      id: currentAudit.id,
      clientId: auditForm.clientId,
      clientName: clients.find(c => c.id === auditForm.clientId)?.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: auditForm.auditType,
      overallScore: auditForm.overallRating,
      status: 'completed',
      findings: auditForm.findings,
      recommendations: auditForm.recommendations,
      notes: auditForm.notes,
      photos: auditForm.photos,
      officerName: 'Current Officer'
    };

    setAuditHistory([newAudit, ...auditHistory]);
    setCurrentAudit(null);
    setShowAuditModal(false);
    
    // Reset form
    setAuditForm({
      clientId: '',
      auditType: 'surprise',
      findings: {
        headcount: { expected: 0, actual: 0, status: 'pending' },
        staffPresence: { verified: [], missing: [], status: 'pending' },
        uniformCompliance: { compliant: [], nonCompliant: [], status: 'pending' },
        documentation: { complete: true, issues: [], status: 'pending' },
        equipment: { items: [], status: 'pending' }
      },
      photos: [],
      overallRating: 0,
      recommendations: '',
      notes: ''
    });
  };

  const updateAuditFinding = (category, data) => {
    setAuditForm({
      ...auditForm,
      findings: {
        ...auditForm.findings,
        [category]: { ...auditForm.findings[category], ...data }
      }
    });
  };

  const getAuditStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'green';
      case 'failed': return 'red';
      case 'warning': return 'orange';
      default: return 'gray';
    }
  };

  const AuditModal = () => (
    <Dialog open={showAuditModal} handler={() => setShowAuditModal(false)} size="xl">
      <DialogHeader>
        Conduct Client Audit - {clients.find(c => c.id === auditForm.clientId)?.name}
      </DialogHeader>
      <DialogBody className="space-y-6 max-h-96 overflow-y-auto">
        {/* Headcount Verification */}
        <Card className="border">
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
              <FaUsers className="h-5 w-5" />
              Headcount Verification
            </Typography>
            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Expected Staff" 
                value={auditForm.findings.headcount.expected}
                disabled
              />
              <Input 
                label="Actual Staff Present" 
                type="number"
                value={auditForm.findings.headcount.actual}
                onChange={(e) => updateAuditFinding('headcount', { 
                  actual: parseInt(e.target.value) || 0,
                  status: parseInt(e.target.value) === auditForm.findings.headcount.expected ? 'passed' : 'failed'
                })}
              />
            </div>
            <div className="mt-2">
              <Chip 
                value={auditForm.findings.headcount.status}
                color={getAuditStatusColor(auditForm.findings.headcount.status)}
                size="sm"
              />
            </div>
          </CardBody>
        </Card>

        {/* Staff Presence Verification */}
        <Card className="border">
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
              <FaClipboardCheck className="h-5 w-5" />
              Staff Presence (Biometric/GPS)
            </Typography>
            <div className="space-y-2">
              <Button color="blue" variant="outlined" size="sm">
                Scan Biometric
              </Button>
              <Button color="green" variant="outlined" size="sm">
                Verify GPS Location
              </Button>
              <Textarea 
                label="Staff Verification Notes"
                onChange={(e) => updateAuditFinding('staffPresence', { notes: e.target.value })}
              />
            </div>
          </CardBody>
        </Card>

        {/* Uniform & Grooming Compliance */}
        <Card className="border">
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
              <FaTshirt className="h-5 w-5" />
              Uniform & Grooming Compliance
            </Typography>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2">
                    Compliance Rating:
                  </Typography>
                  <Rating value={4} onChange={(value) => updateAuditFinding('uniformCompliance', { rating: value })} />
                </div>
                <div>
                  <Typography variant="small" color="blue-gray" className="mb-2">
                    Issues Found:
                  </Typography>
                  <div className="space-y-1">
                    <Checkbox label="Incomplete uniform" />
                    <Checkbox label="Poor grooming" />
                    <Checkbox label="Missing name badge" />
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Documentation Check */}
        <Card className="border">
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
              <FaFileAlt className="h-5 w-5" />
              Documentation & Bookkeeping
            </Typography>
            <div className="space-y-2">
              <Checkbox 
                label="Daily logs complete" 
                onChange={(e) => updateAuditFinding('documentation', { dailyLogs: e.target.checked })}
              />
              <Checkbox 
                label="Incident reports up to date"
                onChange={(e) => updateAuditFinding('documentation', { incidentReports: e.target.checked })}
              />
              <Checkbox 
                label="Equipment logs maintained"
                onChange={(e) => updateAuditFinding('documentation', { equipmentLogs: e.target.checked })}
              />
              <Textarea label="Documentation Issues" />
            </div>
          </CardBody>
        </Card>

        {/* Equipment Check */}
        <Card className="border">
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
              <FaTools className="h-5 w-5" />
              Equipment Check
            </Typography>
            <div className="space-y-2">
              <Checkbox label="Walkie-talkies functional" />
              <Checkbox label="Torches/Flashlights working" />
              <Checkbox label="Security batons present" />
              <Checkbox label="First aid kits stocked" />
              <Checkbox label="CCTV equipment operational" />
              <Textarea label="Equipment Issues/Missing Items" />
            </div>
          </CardBody>
        </Card>

        {/* Photo Documentation */}
        <Card className="border">
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-3 flex items-center gap-2">
              <FaCamera className="h-5 w-5" />
              Photo Documentation
            </Typography>
            <Button color="blue" variant="outlined" size="sm" className="mr-2">
              Capture Photos
            </Button>
            <Typography variant="small" color="gray">
              {auditForm.photos.length} photos captured
            </Typography>
          </CardBody>
        </Card>

        {/* Overall Assessment */}
        <Card className="border">
          <CardBody className="p-4">
            <Typography variant="h6" color="blue-gray" className="mb-3">
              Overall Assessment
            </Typography>
            <div className="space-y-4">
              <div>
                <Typography variant="small" color="blue-gray" className="mb-2">
                  Overall Rating:
                </Typography>
                <Rating 
                  value={auditForm.overallRating} 
                  onChange={(value) => setAuditForm({...auditForm, overallRating: value})} 
                />
              </div>
              <Textarea 
                label="Recommendations"
                value={auditForm.recommendations}
                onChange={(e) => setAuditForm({...auditForm, recommendations: e.target.value})}
              />
              <Textarea 
                label="Additional Notes"
                value={auditForm.notes}
                onChange={(e) => setAuditForm({...auditForm, notes: e.target.value})}
              />
            </div>
          </CardBody>
        </Card>
      </DialogBody>
      <DialogFooter className="space-x-2">
        <Button variant="text" onClick={() => setShowAuditModal(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={completeAudit}>
          Complete Audit
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
              <div className="p-3 bg-red-500 text-white rounded-xl">
                <MdSecurity className="h-6 w-6" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  Random Audit Management
                </Typography>
                <Typography color="gray" className="font-normal">
                  Conduct surprise visits and comprehensive security audits
                </Typography>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-500 text-white rounded-lg">
                  <MdLocationOn className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Typography variant="h6" color="blue-gray">
                    {client.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {client.location}
                  </Typography>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <Typography variant="small" color="gray">
                  Allocated Staff: {client.allocatedStaff}
                </Typography>
                <Typography variant="small" color="gray">
                  Current Shift: {client.currentShift}
                </Typography>
                <Typography variant="small" color="gray">
                  Last Audit: {client.lastAudit}
                </Typography>
              </div>

              <Button
                color="red"
                size="sm"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => startNewAudit(client.id)}
              >
                <FaSearch className="h-4 w-4" />
                Start Surprise Audit
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Audit Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-green-200">
          <CardBody className="p-4 text-center">
            <FaCheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <Typography variant="h4" color="green" className="font-bold">
              {auditHistory.filter(audit => audit.overallScore >= 8).length}
            </Typography>
            <Typography variant="small" color="gray">
              Passed Audits
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-red-200">
          <CardBody className="p-4 text-center">
            <FaTimesCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <Typography variant="h4" color="red" className="font-bold">
              {auditHistory.filter(audit => audit.overallScore < 6).length}
            </Typography>
            <Typography variant="small" color="gray">
              Failed Audits
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-orange-200">
          <CardBody className="p-4 text-center">
            <FaExclamationTriangle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <Typography variant="h4" color="orange" className="font-bold">
              {auditHistory.filter(audit => audit.overallScore >= 6 && audit.overallScore < 8).length}
            </Typography>
            <Typography variant="small" color="gray">
              Needs Improvement
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-200">
          <CardBody className="p-4 text-center">
            <FaShieldAlt className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <Typography variant="h4" color="blue" className="font-bold">
              {auditHistory.length}
            </Typography>
            <Typography variant="small" color="gray">
              Total Audits
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Audit History */}
      <Card>
        <CardBody className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Audit History
          </Typography>
          
          <div className="space-y-4">
            {auditHistory.map((audit) => (
              <Card key={audit.id} className="border">
                <CardBody className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <Typography variant="h6" color="blue-gray">
                        {audit.clientName}
                      </Typography>
                      <Typography variant="small" color="gray">
                        {audit.date} at {audit.time} • {audit.type} audit
                      </Typography>
                      <Typography variant="small" color="gray">
                        Conducted by: {audit.officerName}
                      </Typography>
                    </div>
                    <div className="text-right">
                      <Typography variant="h5" color={audit.overallScore >= 8 ? 'green' : audit.overallScore >= 6 ? 'orange' : 'red'} className="font-bold">
                        {audit.overallScore}/10
                      </Typography>
                      <Chip
                        value={audit.overallScore >= 8 ? 'Excellent' : audit.overallScore >= 6 ? 'Needs Improvement' : 'Failed'}
                        color={audit.overallScore >= 8 ? 'green' : audit.overallScore >= 6 ? 'orange' : 'red'}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <Typography variant="small" color="gray">Headcount</Typography>
                      <Chip
                        value={audit.findings.headcount.status}
                        color={getAuditStatusColor(audit.findings.headcount.status)}
                        size="sm"
                      />
                    </div>
                    <div className="text-center">
                      <Typography variant="small" color="gray">Uniform</Typography>
                      <Chip
                        value={audit.findings.uniformCompliance.status}
                        color={getAuditStatusColor(audit.findings.uniformCompliance.status)}
                        size="sm"
                      />
                    </div>
                    <div className="text-center">
                      <Typography variant="small" color="gray">Documentation</Typography>
                      <Chip
                        value={audit.findings.documentation.status}
                        color={getAuditStatusColor(audit.findings.documentation.status)}
                        size="sm"
                      />
                    </div>
                    <div className="text-center">
                      <Typography variant="small" color="gray">Equipment</Typography>
                      <Chip
                        value={audit.findings.equipment.status}
                        color={getAuditStatusColor(audit.findings.equipment.status)}
                        size="sm"
                      />
                    </div>
                  </div>

                  <Typography variant="small" color="gray">
                    <strong>Recommendations:</strong> {audit.recommendations}
                  </Typography>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Audit Modal */}
      <AuditModal />
    </div>
  );
};

export default RandomAudit;