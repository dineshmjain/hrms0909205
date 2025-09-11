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
  TabPanel
} from '@material-tailwind/react';
import { 
  FaMoneyBillWave, 
  FaHandHoldingUsd, 
  FaFileInvoiceDollar,
  FaCheck,
  FaTimes,
  FaDownload,
  FaEye,
  FaPlus
} from 'react-icons/fa';
import { MdAccountBalance, MdPayments, MdReceipt } from 'react-icons/md';

const FinanceManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [loansAdvances, setLoansAdvances] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeTab, setActiveTab] = useState('salaries');

  const [paymentForm, setPaymentForm] = useState({
    employeeId: '',
    paymentType: 'salary',
    amount: '',
    paymentMode: 'bank_transfer',
    reference: '',
    notes: '',
    deductions: {
      pf: 0,
      esi: 0,
      tax: 0,
      other: 0
    }
  });

  const [loanForm, setLoanForm] = useState({
    employeeId: '',
    type: 'loan',
    amount: '',
    reason: '',
    repaymentPeriod: '',
    monthlyDeduction: '',
    approvalStatus: 'pending',
    guarantor: ''
  });

  // Mock data initialization
  useEffect(() => {
    setEmployees([
      {
        id: '1',
        name: 'John Doe',
        role: 'Security Guard',
        client: 'ABC Corporate',
        basicSalary: 25000,
        allowances: 5000,
        lastPaidDate: '2024-08-31',
        pendingAmount: 0,
        totalEarned: 250000
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'Supervisor',
        client: 'XYZ Manufacturing',
        basicSalary: 35000,
        allowances: 7000,
        lastPaidDate: '2024-08-31',
        pendingAmount: 0,
        totalEarned: 420000
      },
      {
        id: '3',
        name: 'Mike Johnson',
        role: 'Team Leader',
        client: 'DEF Mall',
        basicSalary: 30000,
        allowances: 6000,
        lastPaidDate: '2024-08-31',
        pendingAmount: 15000,
        totalEarned: 180000
      }
    ]);

    setSalaryPayments([
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        month: '2024-09',
        basicSalary: 25000,
        allowances: 5000,
        grossSalary: 30000,
        deductions: {
          pf: 1800,
          esi: 450,
          tax: 2000,
          other: 0
        },
        netSalary: 25750,
        paymentDate: '2024-09-05',
        paymentMode: 'bank_transfer',
        status: 'paid',
        reference: 'TXN123456789'
      },
      {
        id: '2',
        employeeId: '2',
        employeeName: 'Jane Smith',
        month: '2024-09',
        basicSalary: 35000,
        allowances: 7000,
        grossSalary: 42000,
        deductions: {
          pf: 2520,
          esi: 630,
          tax: 3500,
          other: 0
        },
        netSalary: 35350,
        paymentDate: '2024-09-05',
        paymentMode: 'bank_transfer',
        status: 'paid',
        reference: 'TXN123456790'
      },
      {
        id: '3',
        employeeId: '3',
        employeeName: 'Mike Johnson',
        month: '2024-09',
        basicSalary: 30000,
        allowances: 6000,
        grossSalary: 36000,
        deductions: {
          pf: 2160,
          esi: 540,
          tax: 2500,
          other: 0
        },
        netSalary: 30800,
        status: 'pending',
        reference: ''
      }
    ]);

    setLoansAdvances([
      {
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        type: 'advance',
        amount: 10000,
        reason: 'Medical emergency',
        requestDate: '2024-09-01',
        approvalDate: '2024-09-02',
        status: 'approved',
        outstandingAmount: 7000,
        monthlyDeduction: 1000,
        repaymentPeriod: '10 months'
      },
      {
        id: '2',
        employeeId: '2',
        employeeName: 'Jane Smith',
        type: 'loan',
        amount: 50000,
        reason: 'Home renovation',
        requestDate: '2024-08-15',
        approvalDate: '2024-08-20',
        status: 'approved',
        outstandingAmount: 45000,
        monthlyDeduction: 2500,
        repaymentPeriod: '20 months'
      },
      {
        id: '3',
        employeeId: '3',
        employeeName: 'Mike Johnson',
        type: 'advance',
        amount: 15000,
        reason: 'Personal emergency',
        requestDate: '2024-09-10',
        status: 'pending',
        outstandingAmount: 15000,
        monthlyDeduction: 1500,
        repaymentPeriod: '10 months'
      }
    ]);
  }, []);

  const processSalaryPayment = () => {
    const employee = employees.find(e => e.id === paymentForm.employeeId);
    const grossSalary = employee.basicSalary + employee.allowances;
    const totalDeductions = Object.values(paymentForm.deductions).reduce((sum, val) => sum + Number(val), 0);
    const netSalary = grossSalary - totalDeductions;

    const newPayment = {
      id: Date.now().toString(),
      employeeId: paymentForm.employeeId,
      employeeName: employee.name,
      month: new Date().toISOString().slice(0, 7),
      basicSalary: employee.basicSalary,
      allowances: employee.allowances,
      grossSalary,
      deductions: paymentForm.deductions,
      netSalary,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: paymentForm.paymentMode,
      status: 'paid',
      reference: `TXN${Date.now()}`,
      notes: paymentForm.notes
    };

    setSalaryPayments([newPayment, ...salaryPayments]);
    setShowPaymentModal(false);
    setPaymentForm({
      employeeId: '',
      paymentType: 'salary',
      amount: '',
      paymentMode: 'bank_transfer',
      reference: '',
      notes: '',
      deductions: { pf: 0, esi: 0, tax: 0, other: 0 }
    });
  };

  const processLoanRequest = () => {
    const employee = employees.find(e => e.id === loanForm.employeeId);
    
    const newLoanAdvance = {
      id: Date.now().toString(),
      employeeId: loanForm.employeeId,
      employeeName: employee.name,
      type: loanForm.type,
      amount: Number(loanForm.amount),
      reason: loanForm.reason,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'approved',
      approvalDate: new Date().toISOString().split('T')[0],
      outstandingAmount: Number(loanForm.amount),
      monthlyDeduction: Number(loanForm.monthlyDeduction),
      repaymentPeriod: loanForm.repaymentPeriod,
      guarantor: loanForm.guarantor
    };

    setLoansAdvances([newLoanAdvance, ...loansAdvances]);
    setShowLoanModal(false);
    setLoanForm({
      employeeId: '',
      type: 'loan',
      amount: '',
      reason: '',
      repaymentPeriod: '',
      monthlyDeduction: '',
      approvalStatus: 'pending',
      guarantor: ''
    });
  };

  const generatePaymentAcknowledgment = (paymentId) => {
    // In real implementation, this would generate and download a PDF
    console.log('Generating payment acknowledgment for payment ID:', paymentId);
    alert('Payment acknowledgment generated and downloaded!');
  };

  const updateLoanStatus = (loanId, status) => {
    setLoansAdvances(loansAdvances.map(loan =>
      loan.id === loanId ? { ...loan, status, approvalDate: status === 'approved' ? new Date().toISOString().split('T')[0] : null } : loan
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': case 'approved': return 'green';
      case 'pending': return 'orange';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const SalariesView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Salary Payments
        </Typography>
        <Button
          color="green"
          size="sm"
          onClick={() => setShowPaymentModal(true)}
          className="flex items-center gap-2"
        >
          <FaMoneyBillWave className="h-4 w-4" />
          Process Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-green-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="green" className="font-bold">
              ₹{salaryPayments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.netSalary, 0).toLocaleString()}
            </Typography>
            <Typography variant="small" color="gray">
              Total Paid This Month
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-orange-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="orange" className="font-bold">
              ₹{salaryPayments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.grossSalary, 0).toLocaleString()}
            </Typography>
            <Typography variant="small" color="gray">
              Pending Payments
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-blue-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="blue" className="font-bold">
              {salaryPayments.length}
            </Typography>
            <Typography variant="small" color="gray">
              Total Transactions
            </Typography>
          </CardBody>
        </Card>
      </div>

      {salaryPayments.map((payment) => (
        <Card key={payment.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {payment.employeeName}
                </Typography>
                <Typography variant="small" color="gray">
                  Month: {payment.month}
                </Typography>
                {payment.paymentDate && (
                  <Typography variant="small" color="gray">
                    Payment Date: {payment.paymentDate}
                  </Typography>
                )}
              </div>
              <Chip
                value={payment.status}
                color={getStatusColor(payment.status)}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Basic Salary:
                </Typography>
                <Typography variant="small" color="gray">
                  ₹{payment.basicSalary.toLocaleString()}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Allowances:
                </Typography>
                <Typography variant="small" color="gray">
                  ₹{payment.allowances.toLocaleString()}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Gross Salary:
                </Typography>
                <Typography variant="small" color="gray">
                  ₹{payment.grossSalary.toLocaleString()}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Net Salary:
                </Typography>
                <Typography variant="small" color="green" className="font-bold">
                  ₹{payment.netSalary?.toLocaleString() || payment.grossSalary?.toLocaleString()}
                </Typography>
              </div>
            </div>

            {payment.deductions && (
              <div className="mb-4">
                <Typography variant="small" color="blue-gray" className="font-medium mb-2">
                  Deductions:
                </Typography>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Typography variant="small" color="gray">
                    PF: ₹{payment.deductions.pf.toLocaleString()}
                  </Typography>
                  <Typography variant="small" color="gray">
                    ESI: ₹{payment.deductions.esi.toLocaleString()}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Tax: ₹{payment.deductions.tax.toLocaleString()}
                  </Typography>
                  <Typography variant="small" color="gray">
                    Other: ₹{payment.deductions.other.toLocaleString()}
                  </Typography>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" variant="outlined" color="blue">
                <FaEye className="h-3 w-3 mr-1" />
                View Details
              </Button>
              {payment.status === 'paid' && (
                <Button 
                  size="sm" 
                  color="green"
                  onClick={() => generatePaymentAcknowledgment(payment.id)}
                >
                  <FaDownload className="h-3 w-3 mr-1" />
                  Download Receipt
                </Button>
              )}
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const LoansAdvancesView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Typography variant="h6" color="blue-gray">
          Loans & Advances
        </Typography>
        <Button
          color="blue"
          size="sm"
          onClick={() => setShowLoanModal(true)}
          className="flex items-center gap-2"
        >
          <FaPlus className="h-4 w-4" />
          Process Loan/Advance
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border border-blue-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="blue" className="font-bold">
              ₹{loansAdvances.filter(l => l.status === 'approved').reduce((sum, l) => sum + l.outstandingAmount, 0).toLocaleString()}
            </Typography>
            <Typography variant="small" color="gray">
              Total Outstanding
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-green-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="green" className="font-bold">
              {loansAdvances.filter(l => l.status === 'approved').length}
            </Typography>
            <Typography variant="small" color="gray">
              Active Loans/Advances
            </Typography>
          </CardBody>
        </Card>

        <Card className="border border-orange-200">
          <CardBody className="p-4 text-center">
            <Typography variant="h4" color="orange" className="font-bold">
              {loansAdvances.filter(l => l.status === 'pending').length}
            </Typography>
            <Typography variant="small" color="gray">
              Pending Approvals
            </Typography>
          </CardBody>
        </Card>
      </div>

      {loansAdvances.map((loan) => (
        <Card key={loan.id} className="border">
          <CardBody className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Typography variant="h6" color="blue-gray">
                  {loan.employeeName}
                </Typography>
                <Typography variant="small" color="gray">
                  Type: {loan.type.charAt(0).toUpperCase() + loan.type.slice(1)}
                </Typography>
                <Typography variant="small" color="gray">
                  Request Date: {loan.requestDate}
                </Typography>
              </div>
              <Chip
                value={loan.status}
                color={getStatusColor(loan.status)}
                size="sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Amount:
                </Typography>
                <Typography variant="small" color="gray">
                  ₹{loan.amount.toLocaleString()}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Outstanding:
                </Typography>
                <Typography variant="small" color="red">
                  ₹{loan.outstandingAmount.toLocaleString()}
                </Typography>
              </div>
              <div>
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Monthly Deduction:
                </Typography>
                <Typography variant="small" color="gray">
                  ₹{loan.monthlyDeduction.toLocaleString()}
                </Typography>
              </div>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium mb-1">
                Reason:
              </Typography>
              <Typography variant="small" color="gray">
                {loan.reason}
              </Typography>
            </div>

            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">
                Repayment Period: {loan.repaymentPeriod}
              </Typography>
            </div>

            {loan.status === 'pending' && (
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  color="green"
                  onClick={() => updateLoanStatus(loan.id, 'approved')}
                >
                  <FaCheck className="h-3 w-3 mr-1" />
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  color="red"
                  onClick={() => updateLoanStatus(loan.id, 'rejected')}
                >
                  <FaTimes className="h-3 w-3 mr-1" />
                  Reject
                </Button>
              </div>
            )}

            {loan.status === 'approved' && (
              <div className="p-3 bg-green-50 rounded-lg">
                <Typography variant="small" color="green" className="font-medium">
                  ✓ Approved on {loan.approvalDate}
                </Typography>
              </div>
            )}
          </CardBody>
        </Card>
      ))}
    </div>
  );

  const PaymentModal = () => (
    <Dialog open={showPaymentModal} handler={() => setShowPaymentModal(false)} size="lg">
      <DialogHeader>Process Salary Payment</DialogHeader>
      <DialogBody className="space-y-4 max-h-96 overflow-y-auto">
        <Select 
          label="Select Employee"
          value={paymentForm.employeeId}
          onChange={(value) => setPaymentForm({...paymentForm, employeeId: value})}
        >
          {employees.map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name} - ₹{(employee.basicSalary + employee.allowances).toLocaleString()}
            </Option>
          ))}
        </Select>

        <Select 
          label="Payment Mode"
          value={paymentForm.paymentMode}
          onChange={(value) => setPaymentForm({...paymentForm, paymentMode: value})}
        >
          <Option value="bank_transfer">Bank Transfer</Option>
          <Option value="cash">Cash</Option>
          <Option value="cheque">Cheque</Option>
          <Option value="upi">UPI</Option>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="PF Deduction"
            type="number"
            value={paymentForm.deductions.pf}
            onChange={(e) => setPaymentForm({
              ...paymentForm,
              deductions: { ...paymentForm.deductions, pf: Number(e.target.value) }
            })}
          />
          <Input 
            label="ESI Deduction"
            type="number"
            value={paymentForm.deductions.esi}
            onChange={(e) => setPaymentForm({
              ...paymentForm,
              deductions: { ...paymentForm.deductions, esi: Number(e.target.value) }
            })}
          />
          <Input 
            label="Tax Deduction"
            type="number"
            value={paymentForm.deductions.tax}
            onChange={(e) => setPaymentForm({
              ...paymentForm,
              deductions: { ...paymentForm.deductions, tax: Number(e.target.value) }
            })}
          />
          <Input 
            label="Other Deductions"
            type="number"
            value={paymentForm.deductions.other}
            onChange={(e) => setPaymentForm({
              ...paymentForm,
              deductions: { ...paymentForm.deductions, other: Number(e.target.value) }
            })}
          />
        </div>

        <Textarea 
          label="Payment Notes"
          value={paymentForm.notes}
          onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowPaymentModal(false)}>
          Cancel
        </Button>
        <Button color="green" onClick={processSalaryPayment}>
          Process Payment
        </Button>
      </DialogFooter>
    </Dialog>
  );

  const LoanModal = () => (
    <Dialog open={showLoanModal} handler={() => setShowLoanModal(false)}>
      <DialogHeader>Process Loan/Advance Request</DialogHeader>
      <DialogBody className="space-y-4">
        <Select 
          label="Select Employee"
          value={loanForm.employeeId}
          onChange={(value) => setLoanForm({...loanForm, employeeId: value})}
        >
          {employees.map((employee) => (
            <Option key={employee.id} value={employee.id}>
              {employee.name} - {employee.role}
            </Option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Select 
            label="Type"
            value={loanForm.type}
            onChange={(value) => setLoanForm({...loanForm, type: value})}
          >
            <Option value="loan">Loan</Option>
            <Option value="advance">Advance</Option>
          </Select>
          <Input 
            label="Amount"
            type="number"
            value={loanForm.amount}
            onChange={(e) => setLoanForm({...loanForm, amount: e.target.value})}
          />
        </div>

        <Textarea 
          label="Reason"
          value={loanForm.reason}
          onChange={(e) => setLoanForm({...loanForm, reason: e.target.value})}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Repayment Period"
            value={loanForm.repaymentPeriod}
            onChange={(e) => setLoanForm({...loanForm, repaymentPeriod: e.target.value})}
          />
          <Input 
            label="Monthly Deduction"
            type="number"
            value={loanForm.monthlyDeduction}
            onChange={(e) => setLoanForm({...loanForm, monthlyDeduction: e.target.value})}
          />
        </div>

        <Input 
          label="Guarantor (if applicable)"
          value={loanForm.guarantor}
          onChange={(e) => setLoanForm({...loanForm, guarantor: e.target.value})}
        />
      </DialogBody>
      <DialogFooter>
        <Button variant="text" onClick={() => setShowLoanModal(false)}>
          Cancel
        </Button>
        <Button color="blue" onClick={processLoanRequest}>
          Process Request
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
            <div className="p-3 bg-green-500 text-white rounded-xl">
              <MdAccountBalance className="h-6 w-6" />
            </div>
            <div>
              <Typography variant="h5" color="blue-gray" className="font-bold">
                Finance Management
              </Typography>
              <Typography color="gray" className="font-normal">
                Handle salary payments, loans, advances, and financial tracking
              </Typography>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab}>
        <TabsHeader>
          <Tab value="salaries" onClick={() => setActiveTab('salaries')}>
            <div className="flex items-center gap-2">
              <FaMoneyBillWave className="h-4 w-4" />
              Salary Payments
            </div>
          </Tab>
          <Tab value="loans" onClick={() => setActiveTab('loans')}>
            <div className="flex items-center gap-2">
              <FaHandHoldingUsd className="h-4 w-4" />
              Loans & Advances
            </div>
          </Tab>
        </TabsHeader>
        
        <TabsBody>
          <TabPanel value="salaries">
            <SalariesView />
          </TabPanel>
          <TabPanel value="loans">
            <LoansAdvancesView />
          </TabPanel>
        </TabsBody>
      </Tabs>

      {/* Modals */}
      <PaymentModal />
      <LoanModal />
    </div>
  );
};

export default FinanceManagement;