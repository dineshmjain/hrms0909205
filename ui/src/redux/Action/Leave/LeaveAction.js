import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  LeavePolicyCreateApi,
  LeavePolicyGetApi,
  LeavePolicyUpdateApi,
  LeaveRequestGetApi,
  LeavePolicyStatusApi,
  LeaveRequestApproveRejectCreateApi,
  LeaveBalanceUserCreateApi,
  LeavePolicyNameGetApi,
} from "../../../apis/Leave/Leave";

export const LeavePolicyCreateAction = createAsyncThunk(
  "LeavePolicyCreate",
  async (policyCreateCredentials, { rejectWithValue }) => {
    try {
      const data = await LeavePolicyCreateApi(policyCreateCredentials);
      console.log("Leave Policy Success -->", data);
      return data;
    } catch (error) {
      console.log("Leave Policy create Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);
export const LeavePolicyUpdateAction = createAsyncThunk(
  "LeavePolicyUpdate",
  async (policyUpdateCredentials, { rejectWithValue }) => {
    try {
      const data = await LeavePolicyUpdateApi(policyUpdateCredentials);
      console.log("Leave Policy Success -->", data);
      return data;
    } catch (error) {
      console.log("Leave Policy update Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);
export const LeavePolicyGetAction = createAsyncThunk(
  "LeavePolicyGet",
  async (policyGetCredentials, { rejectWithValue }) => {
    try {
      const data = await LeavePolicyGetApi(policyGetCredentials);
      console.log("Leave Policy Success -->", data);
      return data;
    } catch (error) {
      console.log("Leave Policy create Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);
export const LeavePolicyStatusUpdateAction = createAsyncThunk(
  "LeavePolicy",
  async (PolicyDetails, { rejectWithValue }) => {
    console.log(PolicyDetails);
    try {
      const data = await LeavePolicyStatusApi(PolicyDetails);
      console.log("LeavePolicy Successs -->", data);
      return data;
    } catch (error) {
      console.log("LeavePolicy Error -->", error);
      return rejectWithValue(error || { message: "Unknown error occurred" });
    }
  }
);

export const LeaveRequestGetAction = createAsyncThunk(
  "LeaveRequestGet",
  async (requestGetCredentials, { rejectWithValue }) => {
    try {
      const data = await LeaveRequestGetApi(requestGetCredentials);
      console.log("Leave Policy Success -->", data);
      return data;
    } catch (error) {
      console.log("Leave Policy create Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);
export const LeaveRequestApproveRejectAction = createAsyncThunk(
  "LeaveRequestApproveReject",
  async (requestApproveReject, { rejectWithValue }) => {
    try {
      const data = await LeaveRequestApproveRejectCreateApi(
        requestApproveReject
      );
      console.log("Leave Request Success -->", data);
      return data;
    } catch (error) {
      console.log("Leave Request App Rej Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);
export const LeaveBalanceUserAction = createAsyncThunk(
  "LeaveBalanceUser",
  async (requestLeaveBalance, { rejectWithValue }) => {
    try {
      const data = await LeaveBalanceUserCreateApi(requestLeaveBalance);
      console.log("Leave Balance Success -->", data);
      return data;
    } catch (error) {
      console.log("Leave Balance App Rej Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);
export const LeavePolicyNameGetAction = createAsyncThunk(
  "LeavePolicyNameGet",
  async (policyGetCredentials, { rejectWithValue }) => {
    try {
      const data = await LeavePolicyNameGetApi(policyGetCredentials);
      console.log("Leave Policy Name Success -->", data);
      return data;
    } catch (error) {
      console.log("Leave Policy  Name create Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);
