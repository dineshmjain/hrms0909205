import { combineReducers, configureStore } from "@reduxjs/toolkit";
import BranchReducer from '../reducer/BranchReducer'
import SubOrgReducer from '../reducer/SubOrgReducer'
import GlobalReducer from '../reducer/GlobalReducer'
import DepartmentReducer from '../reducer/DepartmentReducer'
import DesignationReducer from '../reducer/DesignationReducer'
import AttendanceReducer from '../reducer/AttendenceReducer'
import ShiftReducer from '../reducer/ShiftReducer'
import UserReducer from '../reducer/UserReducer'
import EmployeeReducer from '../reducer/EmployeeReducer'
import RoleReducer from '../reducer/RolesReducer'
import OrganizationReducer from '../reducer/OrganizationReducer'
import IndustryReducer from '../reducer/IndusturyReducer'
import SetupModeReducer from '../reducer/SetupModeReducer'
import AssignmentReducer from '../reducer/AssignmentReducer'
import DashboardReducer from '../reducer/DashboardReducer'
import ClientReducer from '../reducer/ClientReducer'
import ClientBranchReducer from '../reducer/ClientBranchReducer'
import TaskReducer from '../reducer/TaskReducer'
import ProjectReducer from '../reducer/projectReducer'
import commentReducer from '../reducer/commentReducer'
import errorReducer from '../reducer/ErrorReducer'
import checkpointReducer from '../reducer/CheckpointReducer'
import PageLoaderReducer from '../reducer/PageLoaderReducer'
import LeaveReducer from '../reducer/LeaveReducer'
import HolidayReducer from '../reducer/HolidayReducer'
import BannerReducer from "../reducer/BannerReducer";

const appReducer = combineReducers({
  branch: BranchReducer,
  subOrgs: SubOrgReducer,
  global: GlobalReducer,
  department: DepartmentReducer,
  designation: DesignationReducer,
  attendence: AttendanceReducer,
  shift: ShiftReducer,
  user: UserReducer,
  employee: EmployeeReducer,
  roles: RoleReducer,
  organization: OrganizationReducer,
  typeOfIndustury: IndustryReducer,
  setupMode: SetupModeReducer,
  assignedData: AssignmentReducer,
  dashboard: DashboardReducer,
  client:ClientReducer,
  clientBranch:ClientBranchReducer,
  task:TaskReducer,
  project:ProjectReducer,
  comments:commentReducer,
  error:errorReducer,
  checkpoint:checkpointReducer,
  pageLoader:PageLoaderReducer,
  leave:LeaveReducer,
  holidays: HolidayReducer,
  banner: BannerReducer,
  //  login:LoginReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined; 
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

