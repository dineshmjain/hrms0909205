export const role = {
    ADMIN : "Admin"
}


export const allPermissions = ['c', 'r', 'u', 'd']

export const shiftTypes = {
    pattern : "pattern",
    weekDayWise : "weekDayWise",
    weekly : "weekly",
    monthlyWeekWise : "monthlyWeekWise",
    monthly : "monthly"
}


export const userGetTypeProjection = {
    "personal" : {
        name:1,
        email:1,
        mobile:1,
        gender:1,
        dateOfBirth:1,
        profileImage:1,
        bloodGroup:1,
        qualification:1,
        salaryConfig:1,
        emergencyNumber:1,
        guardianNumber:1,
        guardianName:1,
        martialStatus:1

    },
    "address" : {
        address:1,
        permanentAddress : 1,
        presentAddress : 1,
        isPermanentSame: 1
    },
    "password" : {
        password : 1
    },
    "official" : {
        role : 1,
        assignmentId : 1,
        joinDate:1,
        workTimingType:1,
        shiftIds:1,
        employeeId:1,
    }
}

export const KYC_Entities = [
  "Individual",
  "Sole Proprietorship",
  "Partnership Firm",
  "Limited Liability Partnership (LLP)",
  "Private Limited Company",
  "Public Limited Company",
  "Trust",
  "Hindu Undivided Family (HUF)",
  "Society",
  "Club",
  "Association",
  "Non-Governmental Organization (NGO)",
  "Government Body",
  "Public Sector Unit (PSU)",
  "Foreign Individual",
  "Foreign Company",
  "NRI (Non-Resident Indian)"
]

export const hierarchy = ['subOrg', 'branch', 'department', 'designation']

export const adminRoleId = "664c35da666ff634cae895dd"
export const userRoleId = "6747ea1ced5f3591438fc4b8"


export const defaultShifts = [
  {
      name:'Morning Shift',
      startTime:'06:00',
      endTime:'14:00',
      bgColor:"#fff3a3",
      textColor:"#000000",
  },
  {
      name:'Evening Shift',
      startTime:'14:00',
      endTime:'22:00',
      bgColor:"#fac7a7",
      textColor:"#000000",
  },
  {
      name:'Night Shift',
      startTime:'22:00',
      endTime:'06:00',
      bgColor:"#9daefc",
      textColor:"#000000",
  },
]

export const attendanceApprovalStatus = {
    pending:null,
    approved:true,
    rejected:false
//     true: "approved",
//   false: "rejected",
//   null: "pending"
}

export const attendanceApprovalStatusBits = {
    // pending:null,
    // approved:true,
    // rejected:false
    true: "approved",
  false: "rejected",
  null: "pending"
}


export const allowed_user_params = [
    "name",
    "mobile",
    "email",
    "gender",
    "dateOfBirth",
    "bloodGroup",
    "qualification",
    "employeeId",
    "salaryConfig",
    "emergencyNumber",
    "guardianNumber",
    "guardianName",
    "isActive",
    "createdByName",
    "assignmentId",
    "joinDate",
    "clientAssigned",
    "organization",
    "branch",
    "department",
    "designation",
    "clientBranch",
    "workTiming",
    "createdDate",
    "modifiedDate",
    "employeeId"
]

export const allowed_org_params = [
    "name",
    "orgTypeId",
    "parentOrg",
    "isActive",
    "createdByName",
    "type",
    "modifiedDate",
    "assigned"
]

export const allowed_branch_params = [
    "_id",
    "orgId",
    "name",
    "isActive",
    "createdDate",
    "createdBy",
    "address",
    "geoLocation",
    "geoJson",
    "subOrgId",
    "radius",
    "modifiedDate",
    "startTime",
    "endTime",
    "maxIn",
    "minOut",
    "weekOff",
    "salaryCycle",
    "financialYear"
]
export const allowed_department_params=[
    "_id",
    "name",
    "orgId",
    "global",
    "isActive",
    "createdDate",
    "createdBy",
    "createdByName",
    "assigned",
    "modifiedDate"
]


export const allowed_designation_params=[
    "_id",
    "name",
    "orgId",
    "global",
    "isActive",
    "createdDate",
    "createdBy",
    "createdByName",
    "assigned",
    "modifiedDate",
    "roles"
]


export const defaultDepartments = [
    "Human Resources",
    "Sales & Marketing",
    "Accounts & Billing",
    "Field Services",
    "Cleaning Services",
    "Security Services",
    "Technical & Maintenance",
    'Monitoring & Surveillance Department',
    'Incident Response & Investigation Department',
    'Logistics & Uniform Management Department'
]


export const defaultDesignations = {
  "Supervisor": {
    "68be930f815aaca574812742": ["c", "r", "u", "d"], // Field Officer
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"], // Security
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"], // Manager
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]  // HR
  },
  "Field Officer": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"], // Supervisor
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"], // Security
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"], // Manager
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]  // HR
  },
  "Security Guard": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"], // Supervisor
    "68be930f815aaca574812742": ["c", "r", "u", "d"], // Field Officer
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"], // Manager
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]  // HR
  },
  "Cleaning Staff": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"],
    "68be930f815aaca574812742": ["c", "r", "u", "d"],
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"],
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"],
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]
  },
  "Sales Executive": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"],
    "68be930f815aaca574812742": ["c", "r", "u", "d"],
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"],
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"],
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]
  },
  "HR Executive": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"],
    "68be930f815aaca574812742": ["c", "r", "u", "d"],
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"],
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"]
  },
  "Shift Incharge": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"],
    "68be930f815aaca574812742": ["c", "r", "u", "d"],
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"],
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"],
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]
  },
  "Billing Assistant": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"],
    "68be930f815aaca574812742": ["c", "r", "u", "d"],
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"],
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"],
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]
  },
  "Operations Manager": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"],
    "68be930f815aaca574812742": ["c", "r", "u", "d"],
    "6889bb586fa77c48302a3fdd": ["c", "r", "u", "d"],
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]
  },
  "Technical Security Executive": {
    "6889bb7a6fa77c48302a3fde": ["c", "r", "u", "d"],
    "68be930f815aaca574812742": ["c", "r", "u", "d"],
    "6889bb316fa77c48302a3fdc": ["c", "r", "u", "d"],
    "6889bb126fa77c48302a3fdb": ["c", "r", "u", "d"]
  },
  "Admin": {}
};


export const defaultGraceTime = 60 // in minutes

export const welcomeNotification = {
    title : "Welcome to Easy Pagar Enterprise",
    description: `We are pleased to have you on board. Explore our features and customize your profile.
    Need help? Please contact us on support@wbtechindia.com
    We look forward to supporting you.`
    // ,
    // image : "https://wbtechindia.com/apis/masterportal/images/promotions/Image_20231121130905.png"
} 

export const attendanceNotification = (type, message = "") => ({
    title : message,
    description: `Your ${type} attendance has been marked successfully.`,
})

export const approvalBits = [
    "isLocationMatch",
    "isBranchMatch",
    "isShiftMatch",
    "isTimeMatch",
    "isClientMatch",
    "isExtended"
]

export const SoftwareID = 17

export const onlyViewDaysAfterExpiry = 15

export const planExpiryMessage = "Subscription Expired!...Please buy a new Plan"

export const defaultSalaryComponents = [
  // --- Earnings ---
  { name: "basic pay", category: "earning", isStatutory: false },
  { name: "dearness allowance (da)", category: "earning", isStatutory: false },
  { name: "basic pay + dearness allowance (da)", category: "earning", isStatutory: false },
  { name: "house rent allowance (hra)", category: "earning", isStatutory: false },
  { name: "conveyance allowance", category: "earning", isStatutory: false },
  { name: "special allowance", category: "earning", isStatutory: false },
  { name: "bonus", category: "earning", isStatutory: false },

  // --- Deductions ---
  { name: "unpaid leave deduction", category: "deduction", isStatutory: false },
  { name: "loan/advance recovery", category: "deduction", isStatutory: false },

  // --- Statutory ---
  {
    name: "employee provident fund (epf)",
    category: "deduction",
    isStatutory: true,
    statutoryDetails: {
      contribution: { employee: 0.12, employer: 0.12 },
      limit: 15000,
      note: "Both employee and employer contribute 12% up to ₹15,000"
    },
  },
  {
    name: "employee state insurance (esi)",
    category: "deduction",
    isStatutory: true,
    statutoryDetails: {
      contribution: { employee: 0.0075, employer: 0.0325 },
      limit: 21000,
      note: "Applicable if gross salary ≤ ₹21,000"
    },
  },
  {
    name: "tax deducted at source (tds)",
    category: "deduction",
    isStatutory: true,
    statutoryDetails: {
      contribution: { employee: null, employer: 0 },
      limit: null,
      note: "As per income tax slab"
    },
  },
  {
    name: "professional tax",
    category: "deduction",
    isStatutory: true,
    statutoryDetails: {
      contribution: { employee: null, employer: 0 },
      limit: null,
      note: "As per state rules"
    },
  },
  {
    name: "labour welfare fund (lwf)",
    category: "deduction",
    isStatutory: true,
    statutoryDetails: {
      contribution: { employee: null, employer: null },
      limit: null,
      note: "As per state rules"
    },
  },
];
