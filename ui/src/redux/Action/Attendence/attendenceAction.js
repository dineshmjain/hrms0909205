import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addAttendenceApi,
  getMonthlyUserAttendance,
  GetShiftDetails,
  getSingleDayUserAttendance,
  getAttendanceReportApi,
  getAttendanceMonthLogsApi,
  getAttendanceApprovals,
  getAttendanceshiftMonthLogsApi,
  getAttendanceDayApprovalsApi,
} from "../../../apis/Attendence/attendenceApi";

export const AddAttendenceAction = createAsyncThunk(
  "addAttendence",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await addAttendenceApi(userCredentials);
      console.log("addAttendence Successs -->", data);
      return data;
    } catch (error) {
      console.log("addAttendence Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
    s;
  }
);
export const GetCurrentDayAction = createAsyncThunk(
  "GetCurrentDay",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await GetShiftDetails(userCredentials);
      console.log("GetCurrentDay Successs -->", data);
      return data;
    } catch (error) {
      console.log("GetCurrentDay Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const GetMonthlyUserAttendenceAction = createAsyncThunk(
  "GetMonthlyUserAttendence",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await getMonthlyUserAttendance(userCredentials);
      console.log("GetMonthlyUserAttendance Successs -->", data);
      return data;
    } catch (error) {
      console.log("GetMonthlyUserAttendance Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);

export const GetSingleDayAttendanceAction = createAsyncThunk(
  "getSingleDayAttendance",
  async (reqbody, { rejectWithValue }) => {
    console.log(reqbody, "<--- reqbody");
    try {
      const data = await getSingleDayUserAttendance(reqbody);
      console.log("Get single day attendance Successs -->", data);
      return data;
    } catch (error) {
      console.log("Get single day attendance Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const getAttendanceReportAction = createAsyncThunk(
  "attendanceReport/list",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await getAttendanceReportApi(filters);
      console.log("Attendance Report Success -->", data);
      return data;
    } catch (error) {
      console.log("Attendance Report Error -->", error);
      return rejectWithValue(error);
    }
  }
);
export const getMonthLogsAction = createAsyncThunk(
  "attendance/monthlogs",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await getAttendanceMonthLogsApi(filters);
      console.log("Attendance MonthLogs Success -->", data);
      return data;
    } catch (error) {
      console.log("Attendance MonthLogs Error -->", error);
      return rejectWithValue(error);
    }
  }
);
export const getUserShiftLogsAction = createAsyncThunk(
  "attendance/DayShiftLogs",
  async (filters, { rejectWithValue }) => {
    try {
      const data = await getAttendanceshiftMonthLogsApi(filters);
      console.log("Attendance DayandshiftLogs Success -->", data);
      return data;
    } catch (error) {
      console.log("Attendance DayandshiftLogs Error -->", error);
      return rejectWithValue(error);
    }
  }
);

export const AttendanceApprovalGetActions = createAsyncThunk(
  "attendanceApprovals",
  async (approvalData, { rejectWithValue }) => {
    try {
      const data = await getAttendanceApprovals(approvalData);
      console.log("Attendance Approvals Success -->", data);
      return data;
    } catch (error) {
      console.log("Attendance Approvals Error -->", error);
      return rejectWithValue(error);
    }
  }
);
export const AttendanceDayApprovalActions = createAsyncThunk(
  "attendanceDayApprovals",
  async (approvalData, { rejectWithValue }) => {
    try {
      const data = await getAttendanceDayApprovalsApi(approvalData);
      console.log("Attendance Day Approvals Success -->", data);
      return data;
    } catch (error) {
      console.log("Attendance DayApprovals Error -->", error);
      return rejectWithValue(error);
    }
  }
);
