import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  LeavePolicyCreateAction,
  LeavePolicyGetAction,
  LeavePolicyUpdateAction,
  LeavePolicyStatusUpdateAction,
  LeaveRequestGetAction,
  LeaveRequestApproveRejectAction,
  LeaveBalanceUserAction,
  LeavePolicyNameGetAction,
} from "../Action/Leave/LeaveAction";

const initialState = {
  PolicyList: [],
  RequestList: [],
  loading: false,
  error: false,
  errorMessage: "",
  // pageNo: 1,
  // limit: 10,
  leaveCreate: {},
  leaveUpdate: {},
  approveReject: [],
  leaveHistoryList: [],
  leaveBalance: {},
  LeavePolicyNameList: [],
};

const LeaveReducer = createSlice({
  name: "leave",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //leave policy Add New----------------------------------------------------------------------
    builder
      .addCase(LeavePolicyCreateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(LeavePolicyCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.leaveCreate = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("Desg Create :", action);
        toast.success(action.payload.message);
      })
      .addCase(LeavePolicyCreateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.data.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
    //leave policy Edit New----------------------------------------------------------------------
    builder
      .addCase(LeavePolicyUpdateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(LeavePolicyUpdateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.leaveUpdate = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("Desg Create :", action);
        toast.success(action.payload.message);
      })
      .addCase(LeavePolicyUpdateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.data.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
    //leave policy Get list----------------------------------------------------------------------
    builder
      .addCase(LeavePolicyGetAction.pending, (state, action) => {
        state.error = false;
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(LeavePolicyGetAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.PolicyList = action.payload?.data?.data || [];

        state.totalRecord = action.payload?.data?.totalRecord;
        // toast.success(action.payload.message);
      })
      .addCase(LeavePolicyGetAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        state.PolicyList = [];
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
    //leave policy Activate/Deactivate----------------------------------------------------------------------
    builder
      .addCase(LeavePolicyStatusUpdateAction.pending, (state, action) => {
        state.error = false;
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(LeavePolicyStatusUpdateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.leaveCreate = action?.payload || []; // Ensure this is the correct path to the data
        console.log(action.payload.message, "what i sthe statatus");
        toast.success(action.payload.message);
      })
      .addCase(LeavePolicyStatusUpdateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
    //leave request Get list----------------------------------------------------------------------
    builder
      .addCase(LeaveRequestGetAction.pending, (state, action) => {
        state.error = false;
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(LeaveRequestGetAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.RequestList = action?.payload.data.data || []; // Ensure this is the correct path to the data
        state.totalRecord = action.payload?.data.totalRecord;
        // toast.success(action.payload.message);s
      })
      .addCase(LeaveRequestGetAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        state.RequestList = [];
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
    //leave request Approve/Reject----------------------------------------------------------------------
    builder
      .addCase(LeaveRequestApproveRejectAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(LeaveRequestApproveRejectAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.approveReject = action?.payload || {};
        toast.success(action.payload.message);
      })
      .addCase(LeaveRequestApproveRejectAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
    builder
      .addCase(LeaveBalanceUserAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(LeaveBalanceUserAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.leaveBalance = action?.payload.data || {};
        // toast.success(action.payload.message);
      })
      .addCase(LeaveBalanceUserAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        state.leaveBalance = [];
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      })
      .addCase(LeavePolicyNameGetAction.pending, (state, action) => {
        state.error = false;
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(LeavePolicyNameGetAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.LeavePolicyNameList = action?.payload.data || []; // Ensure this is the correct path to the data
        state.totalRecord = action.payload?.data.totalRecord;
        // toast.success(action.payload.message);
      })
      .addCase(LeavePolicyNameGetAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        state.LeavePolicyNameList = [];
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
  },
});
export default LeaveReducer.reducer;
