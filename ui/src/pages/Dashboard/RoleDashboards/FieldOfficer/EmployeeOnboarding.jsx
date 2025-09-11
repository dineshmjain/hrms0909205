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
  Progress,
  Stepper,
  Step,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel
} from '@material-tailwind/react';
import { 
  FaUserPlus, 
  FaFileUpload, 
  FaCalendarAlt, 
  FaCheck, 
  FaTimes,
  FaClock,
  FaEye,
  FaEdit,
  FaDownload,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';
import { MdPersonAdd, MdAssignment, MdSchedule } from 'react-icons/md';

const EmployeeOnboarding = () => {
  const [candidates, setCandidates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewSchedule, setInterviewSchedule] = useState([]);
  const [newCandidate, setNewCandidate] = useState({
    personalDetails: {
      name: '',
      email: '',
      phone: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      emergencyContact: {
        name: '',
        phone: '',
        relation: ''
      }
    },
    documents: {
      resume: null,
      idProof: null,
      addressProof: null,
      educationCerts: [],
      experience: []
    },
    skillset: {
      primaryRole: '',
      experience: '',
      skills: [],
      certifications: [],
      languages: []
    },
    evaluation: {
      interview: {
        date: '',
        time: '',
        interviewer: '',
        status: 'pending'
      },
      scores: {
        technical: 0,
        communication: 0,
        attitude: 0,
        overall: 0
      },
      feedback: ''
    }
  });

  const [activeTab, setActiveTab] = useState('pipeline');

  // Mock data initialization
  useEffect(() => {
    setCandidates([
      {
        id: '1',
        personalDetails: {
          name: 'Alice Johnson',
          email: 'alice@email.com',
          phone: '+1-555-0123',
          address: '123 Main St, City',
          dateOfBirth: '1990-05-15',
          gender: 'Female',
          emergencyContact: {
            name: 'Bob Johnson',
            phone: '+1-555-0124',
            relation: 'Spouse'
          }
        },
        skillset: {
          primaryRole: 'Security Guard',
          experience: '3 years',
          skills: ['CCTV Monitoring', 'Emergency Response', 'Report Writing'],
          certifications: ['Security License', 'First Aid'],
          languages: ['English', 'Spanish']
        },
        status: 'pending_interview',
        appliedDate: '2024-09-10',
        stage: 'interview_scheduled',
        evaluation: {
          interview: {
            date: '2024-09-15',
            time: '10:00',
            interviewer: 'Manager John',
            status: 'scheduled'
          }
        }
      },
      {
        id: '2',
        personalDetails: {
          name: 'David Chen',
          email: 'david@email.com',
          phone: '+1-555-0125',
          dateOfBirth: '1988-03-22',
          gender: 'Male'
        },
        skillset: {
          primaryRole: 'Supervisor',
          experience: '5 years',
          skills: ['Team Management', 'Crisis Management', 'Training'],
          certifications: ['Management Certificate', 'Security License']
        },
        status: 'approved',
        appliedDate: '2024-09-05',
        stage: 'completed',
        evaluation: {
          scores: {
            technical: 8,
            communication: 9,
            attitude: 9,
            overall: 8.7
          },
          feedback: 'Excellent candidate with strong leadership skills'
        }
      },
      {
        id: '3',
        personalDetails: {
          name: 'Sarah Miller',
          email: 'sarah@email.com',
          phone: '+1-555-0126'
        },
        skillset: {
          primaryRole: 'Security Guard',
          experience: '1 year',
          skills: ['Basic Security', 'Customer Service']
        },
        status: 'rejected',
        appliedDate: '2024-09-08',
        stage: 'evaluation_complete',
        evaluation: {
          scores: {
            technical: 5,
            communication: 6,
            attitude: 7,
            overall: 6
          },
          feedback: 'Needs more experience for current requirements'
        }
      }
    ]);

    setInterviewSchedule([
      {
        id: '1',
        candidateId: '1',
        candidateName: 'Alice Johnson',
        date: '2024-09-15',
        time: '10:00',
        interviewer: 'Manager John',
        type: 'Technical Interview',
        status: 'scheduled'
      },
      {
        id: '2',
        candidateId: '4',
        candidateName: 'Mike Wilson',
        date: '2024-09-16',
        time: '14:00',
        interviewer: 'HR Manager',
        type: 'HR Interview',
        status: 'scheduled'
      }
    ]);
  }, []);

  const handleAddCandidate = () => {
    const candidateId = Date.now().toString();
    const candidate = {
      id: candidateId,
      ...newCandidate,
      status: 'pending_review',
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'document_review'
    };

    setCandidates([candidate, ...candidates]);
    setShowAddModal(false);
    
    // Reset form
    setNewCandidate({
      personalDetails: {
        name: '', email: '', phone: '', address: '', dateOfBirth: '', gender: '',
        emergencyContact: { name: '', phone: '', relation: '' }
      },
      documents: { resume: null, idProof: null, addressProof: null, educationCerts: [], experience: [] },
      skillset: { primaryRole: '', experience: '', skills: [], certifications: [], languages: [] },
      evaluation: { interview: { date: '', time: '', interviewer: '', status: 'pending' }, scores: { technical: 0, communication: 0, attitude: 0, overall: 0 }, feedback: '' }
    });
  };

  const scheduleInterview = (candidateId, interviewData) => {
    const newInterview = {
      id: Date.now().toString(),
      candidateId,
      candidateName: candidates.find(c => c.id === candidateId)?.personalDetails.name,
      ...interviewData,
      status: 'scheduled'
    };

    setInterviewSchedule([...interviewSchedule, newInterview]);
    
    // Update candidate status
    setCandidates(candidates.map(c => 
      c.id === candidateId 
        ? { ...c, status: 'pending_interview', stage: 'interview_scheduled' }
        : c
    ));
  };

  const updateCandidateStatus = (candidateId, status, evaluation = null) => {
    setCandidates(candidates.map(c => 
      c.id === candidateId 
        ? { 
            ...c, 
            status, 
            stage: status === 'approved' ? 'completed' : status === 'rejected' ? 'evaluation_complete' : c.stage,
            evaluation: evaluation ? { ...c.evaluation, ...evaluation } : c.evaluation
          }
        : c
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending_interview': return 'orange';
      case 'pending_review': return 'blue';
      default: return 'gray';
    }
  };

  const getStageProgress = (stage) => {
    switch (stage) {
      case 'document_review': return 25;
      case 'interview_scheduled': return 50;
      case 'evaluation_complete': return 75;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const PipelineView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border border-blue-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="blue" className="font-bold">
              {candidates.filter(c => c.status === 'pending_review').length}
            </Typography>
            <Typography variant="small" color="gray">
              Pending Review
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-orange-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="orange" className="font-bold">
              {candidates.filter(c => c.status === 'pending_interview').length}
            </Typography>
            <Typography variant="small" color="gray">
              Interview Scheduled
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-green-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="green" className="font-bold">
              {candidates.filter(c => c.status === 'approved').length}
            </Typography>
            <Typography variant="small" color="gray">
              Approved
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-red-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="red" className="font-bold">
              {candidates.filter(c => c.status === 'rejected').length}
            </Typography>
            <Typography variant="small" color="gray">
              Rejected
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="border hover:shadow-lg transition-shadow">
            <CardBody className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <Typography variant="h6" color="blue-gray">
                    {candidate.personalDetails.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    {candidate.skillset.primaryRole} • {candidate.skillset.experience}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Applied: {candidate.appliedDate}
                  </Typography>
                </div>
                <div className="text-right">
                  <Chip
                    value={candidate.status.replace('_', ' ')}
                    color={getStatusColor(candidate.status)}
                    size="sm"
                  />
                  <Typography variant="small" color="gray" className="mt-2">
                    Progress: {getStageProgress(candidate.stage)}%
                  </Typography>
                  <Progress 
                    value={getStageProgress(candidate.stage)} 
                    color="blue" 
                    className="mt-1"
                    size="sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Contact Info:
                  </Typography>
                  <Typography variant="small" color="gray">
                    📧 {candidate.personalDetails.email}
                  </Typography>
                  <Typography variant="small" color="gray">
                    📱 {candidate.personalDetails.phone}
                  </Typography>
                </div>
                
                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Skills:
                  </Typography>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate.skillset.skills?.slice(0, 3).map((skill, index) => (
                      <Chip key={index} value={skill} size="sm" color="blue" />
                    ))}
                  </div>
                </div>

                <div>
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Certifications:
                  </Typography>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {candidate.skillset.certifications?.slice(0, 2).map((cert, index) => (
                      <Chip key={index} value={cert} size="sm" color="green" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outlined" 
                  color="blue"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <FaEye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                
                {candidate.status === 'pending_review' && (
                  <Button 
                    size="sm" 
                    color="orange"
                    onClick={() => scheduleInterview(candidate.id, {
                      date: '2024-09-20',
                      time: '10:00',
                      interviewer: 'Field Officer',
                      type: 'Technical Interview'
                    })}
                  >
                    <FaCalendarAlt className="h-3 w-3 mr-1" />
                    Schedule Interview
                  </Button>
                )}
                
                {candidate.status === 'pending_interview' && (
                  <>
                    <Button 
                      size="sm" 
                      color="green"
                      onClick={() => updateCandidateStatus(candidate.id, 'approved')}
                    >
                      <FaCheck className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                    <Button 
                      size="sm" 
                      color="red"
                      onClick={() => updateCandidateStatus(candidate.id, 'rejected')}
                    >
                      <FaTimes className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );

  const InterviewScheduleView = () => (
    <div className="space-y-4">
      {interviewSchedule.map((interview) => (
        <Card key={interview.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {interview.candidateName}
                </Typography>
                <Typography variant="small" color="gray">
                  {interview.type}
                </Typography>
                <Typography variant="small" color="gray">
                  📅 {interview.date} at {interview.time}
                </Typography>
                <Typography variant="small" color="gray">
                  👤 Interviewer: {interview.interviewer}
                </Typography>
              </div>
              <div className="flex gap-2">
                <Button size="sm" color="blue" variant="outlined">
                  <FaEdit className="h-3 w-3" />
                </Button>
                <Button size="sm" color="green">
                  Start Interview
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const AddCandidateModal = () => (
    <Dialog open={showAddModal} handler={() => setShowAddModal(false)} size="lg">
      <DialogHeader>Add New Candidate</DialogHeader>
      <DialogBody className="space-y-4 max-h-96 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Full Name" 
            value={newCandidate.personalDetails.name}
            onChange={(e) => setNewCandidate({
              ...newCandidate,
              personalDetails: { ...newCandidate.personalDetails, name: e.target.value }
            })}
          />
          <Input 
            label="Email" 
            type="email"
            value={newCandidate.personalDetails.email}
            onChange={(e) => setNewCandidate({
              ...newCandidate,
              personalDetails: { ...newCandidate.personalDetails, email: e.target.value }
            })}
          />
          <Input 
            label="Phone" 
            value={newCandidate.personalDetails.phone}
            onChange={(e) => setNewCandidate({
              ...newCandidate,
              personalDetails: { ...newCandidate.personalDetails, phone: e.target.value }
            })}
          />
          <Input 
            label="Date of Birth" 
            type="date"
            value={newCandidate.personalDetails.dateOfBirth}
            onChange={(e) => setNewCandidate({
              ...newCandidate,
              personalDetails: { ...newCandidate.personalDetails, dateOfBirth: e.target.value }
            })}
          />
        </div>
        
        <Textarea 
          label="Address"
          value={newCandidate.personalDetails.address}
          onChange={(e) => setNewCandidate({
            ...newCandidate,
            personalDetails: { ...newCandidate.personalDetails, address: e.target.value }
          })}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select 
            label="Primary Role"
            value={newCandidate.skillset.primaryRole}
            onChange={(value) => setNewCandidate({
              ...newCandidate,
              skillset: { ...newCandidate.skillset, primaryRole: value }
            })}
          >
            <Option value="Security Guard">Security Guard</Option>
            <Option value="Supervisor">Supervisor</Option>
            <Option value="Team Leader">Team Leader</Option>
          </Select>
          
          <Input 
            label="Years of Experience"
            value={newCandidate.skillset.experience}
            onChange={(e) => setNewCandidate({
              ...newCandidate,
              skillset: { ...newCandidate.skillset, experience: e.target.value }
            })}
          />
        </div>

        <Input label="Skills (comma separated)" />
        <Input label="Certifications (comma separated)" />
        
        <div className="space-y-2">
          <Typography variant="small" color="blue-gray" className="font-medium">
            Document Upload:
          </Typography>
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" variant="outlined" color="blue">
              <FaFileUpload className="h-3 w-3 mr-1" />
              Upload Resume
            </Button>
            <Button size="sm" variant="outlined" color="blue">
              <FaFileUpload className="h-3 w-3 mr-1" />
              Upload ID Proof
            </Button>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowAddModal(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={handleAddCandidate}>
          Add Candidate
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
              <div className="p-3 bg-indigo-500 text-white rounded-xl">
                <MdPersonAdd className="h-6 w-6" />
              </div>
              <div>
                <Typography variant="h5" color="blue-gray" className="font-bold">
                  Employee Onboarding
                </Typography>
                <Typography color="gray" className="font-normal">
                  Manage candidates, schedule interviews, and approve new hires
                </Typography>
              </div>
            </div>
            <Button
              color="indigo"
              className="flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <FaUserPlus className="h-4 w-4" />
              Add New Candidate
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab}>
        <TabsHeader>
          <Tab value="pipeline" onClick={() => setActiveTab('pipeline')}>
            Candidate Pipeline
          </Tab>
          <Tab value="interviews" onClick={() => setActiveTab('interviews')}>
            Interview Schedule
          </Tab>
        </TabsHeader>
        
        <TabsBody>
          <TabPanel value="pipeline">
            <PipelineView />
          </TabPanel>
          <TabPanel value="interviews">
            <InterviewScheduleView />
          </TabPanel>
        </TabsBody>
      </Tabs>

      {/* Add Candidate Modal */}
      <AddCandidateModal />
    </div>
  );
};

export default EmployeeOnboarding;