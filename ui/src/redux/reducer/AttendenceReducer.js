// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  AddAttendenceAction,
  AttendanceApprovalGetActions,
  GetMonthlyUserAttendenceAction,
  GetSingleDayAttendanceAction,
  getAttendanceReportAction,
  getMonthLogsAction,
  getUserShiftLogsAction,
  AttendanceDayApprovalActions,
} from "../Action/Attendence/attendenceAction";

const initialState = {
  attendence: {
    monthlyList: [],
    singleDay: null,
    shiftList: [],
    attendanceapprovalList: [],
  },
  report: {
    list: [],
    totalRecord: 0,
  },
  approval: {
    list: [],
    totalRecord: 0,
  },
  loading: false,
  error: "",
  punching: false, // loading status for chewcking in and out
  approvalList:  [],
  pageNo: 1,
  limit: 10,
  userDateMonthWiseLogs:[]
};

const parseMonthlyData = (data) => {
  let temp = data?.map((atten) => {
    return {
      ...atten,
      checkIn: atten?.checkIn?.time,
      checkOut: atten?.checkOut?.time,
    };
  });
  return temp;
};

const AttendenceReducer = createSlice({
  name: "attendence",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AddAttendenceAction.pending, (state) => {
        state.error = false;
        state.punching = true;
      })
      .addCase(AddAttendenceAction.fulfilled, (state, action) => {
        state.error = false;
        state.punching = false;
        console.log("Attendence added -->", action.payload);
        toast.success(action?.payload?.message);
      })
      .addCase(AddAttendenceAction.rejected, (state, action) => {
        toast.dismiss();
        state.error = action?.error?.message;
        state.punching = false;
        console.log("Attendence rejected-->", action.error);

        toast.error(
          action?.error?.message || "Attendence Failed. Please try again."
        );
      })
      .addCase(GetMonthlyUserAttendenceAction.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(GetMonthlyUserAttendenceAction.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        state.attendence.monthlyList = parseMonthlyData(action.payload.data);
      })
      .addCase(GetMonthlyUserAttendenceAction.rejected, (state, action) => {
        state.error = action?.error?.message;
        state.loading = false;
        console.log("Attendence list error -->", action.error);
        state.attendence.monthlyList = [];

        toast.error(
          action?.error?.message || "Attendence Failed. Please try again."
        );
      })
      .addCase(GetSingleDayAttendanceAction.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(GetSingleDayAttendanceAction.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        state.attendence.singleDay = action?.payload?.data;
      })
      .addCase(GetSingleDayAttendanceAction.rejected, (state, action) => {
        state.error = action?.error?.message;
        state.loading = false;
        console.log("Attendence Log list error -->", action.error);
        state.attendence.singleDay = [];

        toast.error(
          action?.error?.message || "Attendence Failed. Please try again."
        );
      })
      .addCase(getAttendanceReportAction.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(getAttendanceReportAction.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        state.report.list = action?.payload?.data?.data || [];
        state.report.totalRecord = action?.payload?.data?.totalRecord || 0;
        toast.success(
          action?.payload?.message || "Attendance report loaded successfully"
        );
      })
      .addCase(getAttendanceReportAction.rejected, (state, action) => {
        state.error = action?.error?.message;
        state.loading = false;
        state.report.list = [];
        state.report.totalRecord = 0;
        console.log("Attendence Report error -->", action.error);
        toast.error(
          action?.error?.message || "Failed to fetch attendance report"
        );
      })
      .addCase(getMonthLogsAction.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(getMonthLogsAction.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        // Store the logs in a new state property, e.g. monthLogs
        state.monthLogs = action.payload;
      })
      .addCase(getMonthLogsAction.rejected, (state, action) => {
        state.error = action?.error?.message;
        state.loading = false;
        state.monthLogs = { data: { data: [], totalRecord: 0 } };
      })
      .addCase(getUserShiftLogsAction.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(getUserShiftLogsAction.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        // Store the logs in a new state property, e.g. monthLogs
        state.shiftList = action?.payload?.data;
      })
      .addCase(getUserShiftLogsAction.rejected, (state, action) => {
        state.error = action?.error?.message;
        state.loading = false;
        state.shiftList = { data: { data: [], totalRecord: 0 } };
      });
    builder
      .addCase(AttendanceApprovalGetActions.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(AttendanceApprovalGetActions.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload);
        state.status = "success";
        state.error = "";
        state.loading = false;

        const list = action?.payload?.data?.data || [];
        const totalRecord = action?.payload?.data?.totalRecord || 0;

        // store in both
        state.approval.list = list;
        state.approval.totalRecord = totalRecord;
        state.approvalList = list;
        state.totalRecord = totalRecord; // if still needed for old uses
      })

      .addCase(AttendanceApprovalGetActions.rejected, (state, action) => {
        state.error = action?.error?.message;
        state.loading = false;
        state.approval = { list: [], totalRecord: 0 };
        console.log("Attendance Approval error -->", action.error);
        toast.error(
          action?.error?.message || "Failed to fetch attendance approvals"
        );
      });
    builder
      .addCase(AttendanceDayApprovalActions.pending, (state) => {
        state.error = false;
        state.loading = true;
      })
      .addCase(AttendanceDayApprovalActions.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload);
        state.status = "success";
        state.error = "";
        state.loading = false;

        const list = action?.payload?.data?.data || [];
        const totalRecord = action?.payload?.data?.totalRecord || 0;

        state.attendanceapprovalList = {
          list,
          totalRecord,
        };
      })
      .addCase(AttendanceDayApprovalActions.rejected, (state, action) => {
        state.error = action?.error?.message;
        state.loading = false;
        state.attendanceapprovalList = { list: [], totalRecord: 0 }; // reset on error
        console.log("Attendance Day Approval error -->", action.error);
        toast.error(
          action?.error?.message || "Failed to approve Day attendance"
        );
      });
  },
});

export default AttendenceReducer.reducer;
