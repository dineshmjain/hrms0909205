import { FaTasks, FaUserTie } from "react-icons/fa";
import {
  FaBuildingUser,
  FaBusinessTime,
  FaListCheck,
  FaCalendar,
} from "react-icons/fa6";
import { HiSquare2Stack } from "react-icons/hi2";
import { MdDashboard, MdSecurity } from "react-icons/md";
import { RxDotFilled } from "react-icons/rx";
import { BsPersonWalking } from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import { TbLayoutDashboard } from "react-icons/tb";
import SvgDashboard from "../assets/svgs/Dashboard";
import SvgDashboardSelected from "../assets/svgs/DashboardSelected";
import SvgMaster from "../assets/svgs/Master";
import SvgMasterSelected from "../assets/svgs/MasterSelected";
import SvgShift from "../assets/svgs/Shift";
import SvgShiftSelected from "../assets/svgs/ShiftSelected";
import SvgEmployee from "../assets/svgs/Employee";
import SvgEmployeeSelected from "../assets/svgs/EmployeeSelected";
import SvgLeave from "../assets/svgs/Leave";
import SvgLeaveSelected from "../assets/svgs/LeaveSelected";
import SvgAttendance from "../assets/svgs/Attendance";
import SvgAttendanceSelected from "../assets/svgs/AttendanceSelected";
import SvgHoliday from "../assets/svgs/Holiday";
import SvgHolidaySelected from "../assets/svgs/HolidaySelected";
import SvgClient from "../assets/svgs/Client";
import SvgClientSelected from "../assets/svgs/ClientSelected";
import { MdOutlineSettings } from "react-icons/md";
import SvgSecuirty from '../assets/svgs/secuirtyManagement'
import SvgSecuirtySelected from '../assets/svgs/secuirtyManagementSelected'
import SvgBiometric from '../assets/svgs/Biometric'
import SvgBiometricSelected from '../assets/svgs/BiomerticSelected'
const routes = [
  {
    id: "dashboard",
    title: "Dashboard",
    name: "dashboard",
    parent: true,
    icon: <SvgDashboard />,
    iconSelected: <SvgDashboardSelected />,
    link: "dashboard",
  },
  {
    id: "master",
    title: "Master",
    name: "master",
    parent: true,
    link: "",
    icon: <SvgMaster />,
    iconSelected: <SvgMasterSelected />,
    child: [
      {
        id: "subOrg",
        title: "Organization",
        name: "suborganization",
        link: "suborganization",
        icon: <RxDotFilled />,
      },
      {
        id: "branch",
        title: "Branch",
        name: "branch",
        link: "branch",
        icon: <RxDotFilled />,
      },
      {
        id: "department",
        title: "Department",
        name: "department",
        link: "department",
        icon: <RxDotFilled />,
      },
      {
        id: "designation",
        title: "Designation",
        name: "designation",
        link: "designation",
        icon: <RxDotFilled />,
      },
      {
        id: "roles",
        title: "Roles",
        name: "roles",
        link: "roles",
        icon: <RxDotFilled />,
      },
    ],
  },
  {
    id: "shiftMaster",
    title: "Shift",
    name: "shiftMaster",
    parent: true,
    link: "",
    icon: <SvgShift className="" />,
    iconSelected: <SvgShiftSelected />,
    child: [
      {
        id: "shift",
        title: "Master",
        name: "shift",
        link: "shift",
        icon: <RxDotFilled />,
      },
      {
        id: "shiftGroup",
        title: "Patterns",
        name: "shiftgroup",
        link: "shiftgroup",
        icon: <RxDotFilled />,
      },
      {
        id: "dutyroaster",
        title: "Roster",
        name: "dutyroaster",
        link: "dutyroaster",
        icon: <RxDotFilled />,
      },
    ],
  },
  //  {
  //     id: "client",
  //     title: "Client",
  //     name: "client",
  //     parent: true,
  //     icon: <FaBuildingUser className="w-5 h-5" />,
  //     link: "client"
  // },

  {
    id: "clientMaster",
    title: "Client",
    name: "clientMaster",
    parent: true,
    link: "",
    icon: <SvgClient />,
    iconSelected: <SvgClientSelected />,
    child: [
      {
        id: "client",
        title: "Client List",
        name: "client",
        link: "client",
        icon: <RxDotFilled />,
      },
      {
        id: "assignemployee",
        title: "Assign Employee",
        name: "assignemployee",
        link: "assignemployee",
        icon: <RxDotFilled />,
      },
    ],
  },
  {
    id: "user",
    title: "Employee",
    name: "user",
    parent: true,
    icon: <SvgEmployee />,
    iconSelected: <SvgEmployeeSelected />,
    link: "user",
  },

  {
    id: "attendanceMaster",
    title: "Attendance Master",
    name: "attendance",
    parent: true,
    link: "",
    icon: <SvgAttendance />,
    iconSelected: <SvgAttendanceSelected />,
    child: [
      {
        id: "monthlyreports",
        title: "Month Wise Attendance",
        name: "attendance",
        link: "attendance",
        icon: <RxDotFilled />,
      },

      {
        id: "dailyreports",
        title: "Day Wise Attendance",
        name: "dailyreports",
        link: "daylogs",
        icon: <RxDotFilled />,
      },
      {
        id: "attendanceapproval",
        title: "Approvals",
        name: "attendanceapproval",
        link: "attendanceapproval",
        icon: <RxDotFilled />,
      },
      {
        id: "branchradiussetting",
        title: "Geo Fencing",
        name: "branchradiussetting",
        link: "branchradiussetting",
        icon: <RxDotFilled />,
      },
    ],
  },

  {
    id: "leavemaster",
    title: "Leave",
    name: "leavemaster",
    parent: true,
    link: "",
    icon: <SvgLeave />,
    iconSelected: <SvgLeaveSelected />,
    child: [
      {
        id: "policy",
        title: "Policy",
        name: "policy",
        link: "policy",
        icon: <RxDotFilled />,
      },
      {
        id: "request",
        title: "Request & Approvals",
        name: "request",
        link: "request",
        icon: <RxDotFilled />,
      },
    ],
  },

  {
    id: "holidays",
    title: "Holidays",
    name: "holidays",
    parent: true,
    icon: <SvgHoliday />,
    iconSelected: <SvgHolidaySelected />,
    link: "holidays",
  },
  {
    id: "holidays",
    title: "Banners",
    name: "holidays",
    parent: true,
    icon: <SvgHoliday />,
    iconSelected: <SvgHolidaySelected />,
    link: "banners",
  },
  // {
  //   id: "attendance",
  //   title: "Attendance",
  //   name: "attendance",
  //   parent: true,
  //   icon: <FaListCheck className="w-5 h-5" />,
  //   link: "attendance",
  // },

  {
    id: "gaurdMananagement",
    title: "Guard Management",
    name: "gaurdMananagement",
    parent: true,
    link: "",
    icon: <SvgSecuirty />,
    iconSelected: <SvgSecuirtySelected />,
    child: [
      {
        id: "patrolling",
        title: "Patrolling",
        name: "patrolling",
        link: "patrolling",
        icon: <BsPersonWalking />,
      },
      {
        id: "checkpoint",
        title: "Checkpoint",
        name: "checkpoint",
        link: "checkpoint",
        icon: <IoLocationSharp />,
      },
    ],
  },
  // {
  //   id: "client",
  //   title: "Client",
  //   name: "client",
  //   parent: true,
  //   icon: <FaBuildingUser className="w-5 h-5" />,
  //   link: "client",
  // },
  {
    id: "leads",
    title: "Leads",
    name: "lead",
    link: "",
    parent: true,
    icon: <FaUserTie className="w-5 h-5" />,

    child: [
      {
        id: "lead",
        title: "Leads",
        name: "lead",
        link: "lead",
        icon: <RxDotFilled />,
      },
      {
        id: "meeting",
        title: "Meetings",
        name: "lead",
        link: "meetings",
        icon: <RxDotFilled />,
      },
      {
        id: "quotation",
        title: "Quotation",
        name: "lead",
        link: "quotations",
        icon: <RxDotFilled />,
      },
    ],
  },
  {
    id: "biometrics",
    title: "biometrics",
    name: "biometric",
    parent: true,
    link: "biometrics",
    icon: <SvgBiometric className="w-5 h-5" />,
    iconSelected: <SvgBiometricSelected className="w-5 h-5" />,
    child: [
      {
        id: "biometricareas",
        title: "areas",
        name: "biometricareas",
        link: "/areas",
        icon: <BsPersonWalking />,
      },
      {
        id: "devices",
        title: "Devices",
        name: "devices",
        link: "/devices",
        icon: <BsPersonWalking />,
      },



    ],
  }
];
const OldRoutes = [
  {
    id: "dashboard",
    title: "Dasboard",
    name: "dasboard",
    parent: true,
    icon: <MdDashboard className="h-5 w-5" />,
    link: "/dashboard",
  },
  {
    id: "master",
    title: "Master",
    name: "master",
    parent: true,

    icon: <HiSquare2Stack className="h-5 w-5" />,
    child: [
      {
        id: "subOrg",
        title: "Sub Organization",
        name: "suborganization",
        link: "/suborganization",
        icon: "dot",
      },
      {
        id: "branch",
        title: "Branch",
        name: "branch",
        link: "/branch",
        icon: "dot",
      },
      {
        id: "department",
        title: "Department",
        name: "department",
        link: "/department",
        icon: "dot",
      },
      {
        id: "designation",
        title: "Designation",
        name: "designation",
        link: "/designation",
        icon: "dot",
      },
      {
        id: "roles",
        title: "Roles",
        name: "roles",
        link: "/roles",
        icon: "dot",
      },
    ],
  },
  {
    id: "shiftMaster",
    title: "Shift Master",
    name: "shiftMaster",
    parent: true,
    icon: <FaBusinessTime className="w-5 h-5" />,
    child: [
      {
        id: "shift",
        title: "Shift",
        name: "shift",
        link: "/shift",
        icon: "dot",
      },
      {
        id: "shiftGroup",
        title: "Shift Group",
        name: "shiftgroup",
        link: "/shiftgroup",
        icon: "dot",
      },
    ],
  },
  //  {
  //     id: "client",
  //     title: "Client",
  //     name: "client",
  //     parent: true,
  //     icon: <FaBuildingUser className="w-5 h-5" />,
  //     link: "/client"
  // },
  // {
  //   id: "attendance",
  //   title: "Attendance Reports",
  //   name: "attendance",
  //   parent: true,
  //   icon: <FaListCheck className="w-5 h-5" />,
  //   link: "/attendance",
  // },
  {
    id: "user",
    title: "User",
    name: "user",
    parent: true,
    icon: <FaUserTie className="w-5 h-5" />,
    link: "/user",
  },
  {
    id: "client",
    title: "Client",
    name: "client",
    parent: true,
    icon: <FaUserTie className="w-5 h-5" />,
    link: "/client",
  },
  {
    id: "attendence",
    title: "attendence",
    name: "attendence",
    parent: true,
    icon: <FaCalendar className="w-5 h-5" />,
    link: "/attendence",
  },

  {
    id: "leads",
    title: "Leads",
    name: "lead",
    parent: true,
    icon: <FaUserTie className="w-5 h-5" />,

    child: [
      {
        id: "lead",
        title: "Leads",
        name: "lead",
        link: "/lead",
        icon: "dot",
      },
      {
        id: "meeting",
        title: "Meetings",
        name: "lead",
        link: "/meetings",
        icon: "dot",
      },
      {
        id: "quotation",
        title: "Quotation",
        name: "lead",
        link: "/quotations",
        icon: "dot",
      },
    ],
  },
];

export { routes, OldRoutes };
