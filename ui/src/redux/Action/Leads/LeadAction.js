import { createAsyncThunk } from "@reduxjs/toolkit";
import { LeadCreateApi, LeadsGetApi } from "../../../apis/Leads/Leads";

export const LeadCreateAction = createAsyncThunk(
  "LeadCreate",
  async (policyCreateCredentials, { rejectWithValue }) => {
    try {
      const data = await LeadCreateApi(policyCreateCredentials);
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

export const LeadGetAction = createAsyncThunk(
  "LeadGet",
  async (userCreditails, { rejectWithValue }) => {
    try {
      const data = await LeadsGetApi(userCreditails);
      console.log("Leads List Success -->", data);
      return data;
    } catch (error) {
      console.log("Lead List  Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);