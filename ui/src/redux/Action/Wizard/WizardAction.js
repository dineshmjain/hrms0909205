import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  getStructureApi,
  getOrganizationApi,
  getBranchCreationApi,
  getWizardApi,
  OtCreateApi,
  OtUpdateApi,
} from "../../../apis/Wiard/WizardApi";

export const GetStructureAction = createAsyncThunk(
  "GetStructure",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await getStructureApi(userCredentials);
      console.log("Get Structure Successs -->", data);
      return data;
    } catch (error) {
      console.log("Get Structure Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const GetOrganizationAction = createAsyncThunk(
  "getOrganizationApi",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await getOrganizationApi(userCredentials);
      console.log("Get Organization Create Successs -->", data);
      return data;
    } catch (error) {
      console.log("Get Organization Create Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const GetBranchCreationAction = createAsyncThunk(
  "getBranchCreationApi",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await getBranchCreationApi(userCredentials);
      console.log("Get Branch Create Successs -->", data);
      return data;
    } catch (error) {
      console.log("Get Branch Create Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const GetAllWizardAction = createAsyncThunk(
  "getWizardApi",
  async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials);
    try {
      const data = await getWizardApi(userCredentials);
      console.log("Get Wizard Successs -->", data);
      return data;
    } catch (error) {
      console.log("Get Wizard Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const OtCreateAction = createAsyncThunk(
  "OtCreateApi",
  async (userCredentials, { rejectWithValue }) => {
    console.log("User Credentials in Action:", userCredentials);
    try {
      const data = await OtCreateApi(userCredentials);
      console.log("OT Create Success -->", data);
      return data;
    } catch (error) {
      console.log("OT Create Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
export const OtUpdateAction = createAsyncThunk(
  "OtUpdateApi",
  async (userCredentials, { rejectWithValue }) => {
    console.log("User Credentials in Action:", userCredentials);
    try {
      const data = await OtUpdateApi(userCredentials);
      console.log("OT Update Success -->", data);
      return data;
    } catch (error) {
      console.log("OT Update Error -->", error.message);
      return rejectWithValue(
        error?.response?.data || { message: "Unknown error occurred" }
      );
    }
  }
);
