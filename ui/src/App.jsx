import React, { lazy, Suspense, useEffect } from "react";

import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./index.css";
import Loader from "./pages/Loader/Loader";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUserByToken } from "./redux/Action/Auth/AuthAction";
import {
  enterSetupMode,
  exitSetupMode,
} from "./redux/reducer/SetupModeReducer";
import ProtectedRoute from "./layouts/ProtectedRoutes";
import DutyRoaster from "./pages/DutyRoaster/DutyRoaster";
import "react-datepicker/dist/react-datepicker.css";

const SetupPage = lazy(() => import("./layouts/Setup"));
const SubOrgIndex = lazy(() => import("./pages/SubOrg/Index"));
const AuthIndex = lazy(() => import("./pages/Auth/Index"));
const BranchIndex = lazy(() => import("./pages/Branch/Index"));
const DashboardIndex = lazy(() => import("./pages/Dashboard/Index"));
const DepartmentIndex = lazy(() => import("./pages/Department/Index"));
const Layout = lazy(() => import("./layouts/Layout"));
const DesignationIndex = lazy(() => import("./pages/Designation/Index"));
const ClientIndex = lazy(() => import("./pages/Client/Index"));
const AssignEmployee = lazy(() => import("./pages/AssignEmployee/Index"));
const ShiftIndex = lazy(() => import("./pages/Shift/Index"));
const ShiftGroupIndex = lazy(() => import("./pages/ShiftGroup/Index"));
const LeadIndex = lazy(() => import("./pages/Lead/Index"));
const QuotationIndex = lazy(() => import("./pages/Quotations/Index"));
const MeetingsIndex = lazy(() => import("./pages/Meetings/Index"));
const AttendanceIndex = lazy(() => import("./pages/Attendence/Reports/Index"));
const UserIndex = lazy(() => import("./pages/User/Index"));
const LeaveIndex = lazy(() => import("./pages/Leave/Policy/Index"));
const LeaveRequestIndex = lazy(() => import("./pages/Leave/Request/Index"));
const LeaveHistoryIndex = lazy(() => import("./pages/Leave/History/Index"));
const AttendanceApprovals = lazy(() => import("./pages/Attendence/Approvals/Index"));
const NotFound = lazy(() => import("./pages/Notfound/NotFound"));
const RolesIndex = lazy(() => import("./pages/Roles/Index"));
const TasksIndex = lazy(() => import("./pages/Tasks/Index"));
const CheckPointIndex = lazy(() => import("./pages/Checkpoint/Index"));
const HolidayIndex = lazy(() => import("./pages/Holiday/Index"));
const BannerIndex = lazy(() => import("./pages/Banners/Index"));
const SettingIndex = lazy(() => import("./pages/settings/index"));
const AttendenceReportIndex = lazy(() =>
  import("./pages/Attendence/AttendenceReport/Index")
);
const AttendanceRoprtMonthIndex = lazy(() => import('./pages/Attendence/AttendenceReport/MonthLogs'))
const BranchRadiusSettingIndex = lazy(() => import("./pages/Attendence/BranchRadiusSetting/Index"))
import { LoadScript, LoadScriptNext } from "@react-google-maps/api";
import BranchRadiusSetting from "./pages/Attendence/BranchRadiusSetting/BranchRadiusSetting";
import Profile from "./pages/Profile/Profile";
const BiometricIndex = lazy(() => import('./pages/Biometrics/Index'))
const googleMapsApiKey = import.meta.env.VITE_MAPAPI;
const GOOGLE_MAP_LIBRARIES = ["places"];
const App = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const setupMode = useSelector((state) => state.setupMode);

  const dispatch = useDispatch();
  useEffect(() => {
    let token =
      localStorage.getItem("token") ?? sessionStorage.getItem("token");

    if (
      !token &&
      location.pathname !== "/auth/login" &&
      location.pathname !== "/auth/sign-up"
    ) {
      navigate("/auth/login");
    }
  }, []);

  useEffect(() => {
    if (!user?._id) {
      dispatch(getUserByToken());
    }

    if (user?.pending && !setupMode?.active) {
      console.log("User pending status:", user?.pending);
      if (user?.pending?.organization == false) {
        dispatch(exitSetupMode());
        return navigate("/auth/org");
      }
      // let isPending = Object.values(user?.pending).some(
      //   (value) => value === false
      // );
      if (user?.pending?.organization == true && user?.pending?.suborganization == false) {
        dispatch(exitSetupMode());
        return navigate("/setup/suborganization");
      }
      else if (user?.pending?.organization == true && user?.pending?.branch == false) {
        dispatch(exitSetupMode());
        return navigate("/setup/branch");
      }


    }
  }, [user]);

  return (
    <Suspense fallback={<Loader />}>
      <LoadScriptNext
        googleMapsApiKey={googleMapsApiKey}
        libraries={GOOGLE_MAP_LIBRARIES}
        scriptOptions={{
          async: true,
          defer: true,
        }}
      >
        <Routes>
          <Route element={<AuthIndex />} path="/auth/*" />
          <Route element={<SetupPage />} path="/setup/*" />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
            path="/*"
          >
            {/* <Route
              path="/*"
              element={<Navigate to="dashboard" replace={true} />}
            /> */}
            <Route element={<SubOrgIndex />} path="suborganization/*" />
            <Route element={<DashboardIndex />} path="dashboard/*" />
            <Route element={<BranchIndex />} path="branch/*" />
            <Route element={<DepartmentIndex />} path="department/*" />
            <Route element={<DesignationIndex />} path="designation/*" />
            <Route element={<ShiftIndex />} path="shift/*" />
            <Route element={<ShiftGroupIndex />} path="shiftgroup/*" />
            <Route element={<ShiftGroupIndex />} path="designation/*" />
            <Route element={<AssignEmployee />} path="assignEmployee/*" />
            <Route element={<ClientIndex />} path="client/*" />
            <Route element={<LeadIndex />} path="lead/*" />
            <Route element={<MeetingsIndex />} path="meetings/*" />
            <Route element={<QuotationIndex />} path="quotations/*" />
            {/* <Route element={<AttendenceReportIndex />} path="attendance/*" /> */}
            <Route element={<UserIndex />} path="user/*" />
            <Route element={<LeaveIndex />} path="policy/*" />
            <Route element={<LeaveRequestIndex />} path="request/*" />
            <Route element={<LeaveHistoryIndex />} path="history/*" />
            <Route element={<RolesIndex />} path="roles/*" />
            <Route element={<DutyRoaster />} path="dutyroaster/*" />
            <Route element={<CheckPointIndex />} path="checkpoint/*" />
            <Route element={<AttendenceReportIndex />} path="attendance/*" />
            <Route element={<BranchRadiusSettingIndex />} path="branchradiussetting/*" />
            <Route element={<AttendanceApprovals />} path="attendanceapproval/*" />
            <Route element={<AttendanceRoprtMonthIndex />} path="daylogs/*" />

            <Route element={<HolidayIndex />} path="holidays/*" />
            <Route element={<BannerIndex />} path="banners/*" />
            <Route element={<SettingIndex />} path="settings/*" />

            <Route
              element={<TasksIndex pageName={"patrolling"} />}
              path="patrolling/*"
            />
            <Route path="Profile" element={<Profile />} />
            <Route element={<BiometricIndex />} path="biometrics/*" />
          </Route>
          <Route path="/:everythingElse" element={<NotFound />} />
        </Routes>
      </LoadScriptNext>
    </Suspense>
  );
};

export default App;
