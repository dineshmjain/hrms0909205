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
        profileImage:1
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
        joinDate:1
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
    "createdDate",
    "modifiedDate"
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
    "modifiedDate"
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


export const defaultDesignations = [
    "Supervisor",
    "Field Officer",
    "Security Guard",
    "Cleaning Staff",
    "Sales Executive",
    "HR Executive",
    "Shift Incharge",
    "Billing Assistant",
    "Operations Manager",
    'echnical Security Executive',
    "Admin"
]

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