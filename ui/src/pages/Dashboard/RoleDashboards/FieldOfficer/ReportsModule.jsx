import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Typography, 
  Button, 
  Select, 
  Option,
  Input,
  Tabs,
  TabsHeader,
  Tab,
  TabsBody,
  TabPanel,
  Chip
} from '@material-tailwind/react';
import { 
  FaFileAlt, 
  FaDownload, 
  FaEye, 
  FaCalendarAlt,
  FaChartBar,
  FaUsers,
  FaClipboardList,
  FaMoneyBillWave,
  FaShieldAlt
} from 'react-icons/fa';
import { MdReport, MdAnalytics, MdFileDownload } from 'react-icons/md';

const ReportsModule = () => {
  const [selectedReportType, setSelectedReportType] = useState('attendance');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [reportHistory, setReportHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');

  const reportTypes = [
    {
      id: 'attendance',
      name: 'Staff Attendance Report',
      icon: FaUsers,
      description: 'Daily, weekly, or monthly attendance summary',
      filters: ['dateRange', 'client', 'employee']
    },
    {
      id: 'leave',
      name: 'Leave Report',
      icon: FaCalendarAlt,
      description: 'Leave applications, approvals, and balances',
      filters: ['dateRange', 'employee', 'status']
    },
    {
      id: 'finance',
      name: 'Finance & Salary Report',
      icon: FaMoneyBillWave,
      description: 'Salary payments, loans, advances tracking',
      filters: ['dateRange', 'employee', 'paymentStatus']
    },
    {
      id: 'audit',
      name: 'Audit History Report',
      icon: FaShieldAlt,
      description: 'Security audits and compliance reports',
      filters: ['dateRange', 'client', 'auditType']
    },
    {
      id: 'allocation',
      name: 'Staff Allocation Report',
      icon: FaClipboardList,
      description: 'Current vs actual staff presence by client',
      filters: ['client', 'shift']
    },
    {
      id: 'officer_activity',
      name: 'Officer Activity Report',
      icon: FaChartBar,
      description: 'Field officer activities and performance',
      filters: ['dateRange', 'activityType']
    }
  ];

  const clients = [
    { id: '1', name: 'ABC Corporate Tower' },
    { id: '2', name: 'XYZ Manufacturing Plant' },
    { id: '3', name: 'DEF Shopping Mall' }
  ];

  const employees = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Mike Johnson' }
  ];

  useEffect(() => {
    // Set default date range to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    setDateRange({
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0]
    });

    // Mock report history
    setReportHistory([
      {
        id: '1',
        type: 'attendance',
        name: 'Staff Attendance Report - September 2024',
        generatedDate: '2024-09-10',
        generatedBy: 'Field Officer',
        status: 'completed',
        downloadUrl: '#',
        parameters: {
          dateRange: '2024-09-01 to 2024-09-30',
          client: 'All Clients',
          format: 'PDF'
        }
      },
      {
        id: '2',
        type: 'finance',
        name: 'Salary Payment Report - August 2024',
        generatedDate: '2024-09-05',
        generatedBy: 'Field Officer',
        status: 'completed',
        downloadUrl: '#',
        parameters: {
          dateRange: '2024-08-01 to 2024-08-31',
          format: 'Excel'
        }
      },
      {
        id: '3',
        type: 'audit',
        name: 'Security Audit Summary',
        generatedDate: '2024-09-08',
        generatedBy: 'Field Officer',
        status: 'processing',
        parameters: {
          dateRange: '2024-08-01 to 2024-09-08',
          client: 'ABC Corporate Tower',
          format: 'PDF'
        }
      }
    ]);
  }, []);

  const generateReport = (format) => {
    const selectedReport = reportTypes.find(r => r.id === selectedReportType);
    
    const reportData = {
      id: Date.now().toString(),
      type: selectedReportType,
      name: `${selectedReport.name} - ${new Date().toLocaleDateString()}`,
      generatedDate: new Date().toISOString().split('T')[0],
      generatedBy: 'Field Officer',
      status: 'processing',
      parameters: {
        dateRange: `${dateRange.from} to ${dateRange.to}`,
        client: selectedClient ? clients.find(c => c.id === selectedClient)?.name || 'All Clients' : 'All Clients',
        employee: selectedEmployee ? employees.find(e => e.id === selectedEmployee)?.name || 'All Employees' : 'All Employees',
        format: format
      }
    };

    setReportHistory([reportData, ...reportHistory]);

    // Simulate report processing
    setTimeout(() => {
      setReportHistory(prev => prev.map(report => 
        report.id === reportData.id 
          ? { ...report, status: 'completed', downloadUrl: '#' }
          : report
      ));
    }, 3000);

    alert(`Report generation started! You'll receive a notification when it's ready.`);
  };

  const downloadReport = (reportId, format) => {
    // In real implementation, this would trigger actual file download
    console.log(`Downloading report ${reportId} in ${format} format`);
    alert(`Downloading report in ${format} format...`);
  };

  const getReportIcon = (type) => {
    const reportType = reportTypes.find(r => r.id === type);
    const Icon = reportType?.icon || FaFileAlt;
    return <Icon className="h-5 w-5" />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'processing': return 'orange';
      case 'failed': return 'red';
      default: return 'gray';
    }
  };

  const GenerateReportView = () => (
    <div className="space-y-6">
      {/* Report Type Selection */}
      <Card>
        <CardBody className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Select Report Type
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <Card 
                  key={report.id} 
                  className={`cursor-pointer border-2 transition-all ${
                    selectedReportType === report.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedReportType(report.id)}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        selectedReportType === report.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                          {report.name}
                        </Typography>
                        <Typography variant="small" color="gray">
                          {report.description}
                        </Typography>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Report Filters */}
      <Card>
        <CardBody className="p-6">
          <Typography variant="h6" color="blue-gray" className="mb-4">
            Report Parameters
          </Typography>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Date Range:
              </Typography>
              <Input 
                label="From Date"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              />
              <Input 
                label="To Date"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              />
            </div>

            {/* Client Filter */}
            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Client:
              </Typography>
              <Select 
                label="Select Client (Optional)"
                value={selectedClient}
                onChange={(value) => setSelectedClient(value)}
              >
                <Option value="">All Clients</Option>
                {clients.map((client) => (
                  <Option key={client.id} value={client.id}>
                    {client.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Employee Filter */}
            <div className="space-y-2">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Employee:
              </Typography>
              <Select 
                label="Select Employee (Optional)"
                value={selectedEmployee}
                onChange={(value) => setSelectedEmployee(value)}
              >
                <Option value="">All Employees</Option>
                {employees.map((employee) => (
                  <Option key={employee.id} value={employee.id}>
                    {employee.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>

          {/* Generate Buttons */}
          <div className="flex gap-3 mt-6">
            <Button 
              color="blue" 
              className="flex items-center gap-2"
              onClick={() => generateReport('PDF')}
            >
              <MdFileDownload className="h-4 w-4" />
              Generate PDF
            </Button>
            <Button 
              color="green" 
              variant="outlined"
              className="flex items-center gap-2"
              onClick={() => generateReport('Excel')}
            >
              <MdFileDownload className="h-4 w-4" />
              Generate Excel
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const ReportHistoryView = () => (
    <div className="space-y-4">
      <Typography variant="h6" color="blue-gray" className="mb-4">
        Report History
      </Typography>

      {reportHistory.map((report) => (
        <Card key={report.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  {getReportIcon(report.type)}
                </div>
                <div>
                  <Typography variant="h6" color="blue-gray">
                    {report.name}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Generated on {report.generatedDate} by {report.generatedBy}
                  </Typography>
                </div>
              </div>
              <Chip
                value={report.status}
                color={getStatusColor(report.status)}
                size="sm"
              />
            </div>

            <div className="space-y-2 mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Parameters:
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                <span>📅 {report.parameters.dateRange}</span>
                <span>🏢 {report.parameters.client}</span>
                <span>📄 {report.parameters.format}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outlined" 
                color="blue"
                disabled={report.status !== 'completed'}
              >
                <FaEye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              
              <Button 
                size="sm" 
                color="green"
                onClick={() => downloadReport(report.id, report.parameters.format)}
                disabled={report.status !== 'completed'}
              >
                <FaDownload className="h-3 w-3 mr-1" />
                Download
              </Button>

              {report.status === 'processing' && (
                <div className="flex items-center gap-2 ml-4">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-500 border-t-transparent"></div>
                  <Typography variant="small" color="orange">
                    Processing...
                  </Typography>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardBody className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500 text-white rounded-xl">
              <MdReport className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Reports Module
              </Typography>
              <Typography color="gray" className="font-normal">
                Generate comprehensive reports with Excel/PDF export options
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-blue-200">
          <CardBody className="p-4 text-center">
            <MdAnalytics className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <Typography variant="h4" color="blue" className="font-bold">
              {reportHistory.length}
            </Typography>
            <Typography variant="small" color="gray">
              Total Reports
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-green-200">
          <CardBody className="p-4 text-center">
            <FaFileAlt className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <Typography variant="h4" color="green" className="font-bold">
              {reportHistory.filter(r => r.status === 'completed').length}
            </Typography>
            <Typography variant="small" color="gray">
              Completed
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-orange-200">
          <CardBody className="p-4 text-center">
            <FaChartBar className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <Typography variant="h4" color="orange" className="font-bold">
              {reportHistory.filter(r => r.status === 'processing').length}
            </Typography>
            <Typography variant="small" color="gray">
              Processing
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-purple-200">
          <CardBody className="p-4 text-center">
            <FaDownload className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <Typography variant="h4" color="purple" className="font-bold">
              {reportTypes.length}
            </Typography>
            <Typography variant="small" color="gray">
              Report Types
            </Typography>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab}>
        <TabsHeader>
          <Tab value="generate" onClick={() => setActiveTab('generate')}>
            <div className="flex items-center gap-2">
              <FaFileAlt className="h-4 w-4" />
              Generate Report
            </div>
          </Tab>
          <Tab value="history" onClick={() => setActiveTab('history')}>
            <div className="flex items-center gap-2">
              <FaChartBar className="h-4 w-4" />
              Report History
            </div>
          </Tab>
        </TabsHeader>
        
        <TabsBody>
          <TabPanel value="generate">
            <GenerateReportView />
          </TabPanel>
          <TabPanel value="history">
            <ReportHistoryView />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default ReportsModule;