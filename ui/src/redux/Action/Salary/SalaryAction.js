import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
  SalaryComponentsGetApi, 
  SalaryComponentCreateApi,
  SalaryComponentToggleApi,
  SalaryTemplatesGetApi,
  SalaryTemplateCreateApi,
  SalaryTemplatePreviewApi,
  SalaryComponentUpdateApi
} from "../../../apis/Salary/Salary";

// ---------- Components ----------
export const SalaryComponentsGetAction = createAsyncThunk(
  "ComponentsList",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await SalaryComponentsGetApi(payload);
      return data;
    } catch (error) {
      console.log("SalaryComponentsGet Error -->", error);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);

export const SalaryComponentCreateAction = createAsyncThunk(
  "ComponentCreate",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await SalaryComponentCreateApi(payload);
      return data;
    } catch (error) {
      console.log("SalaryComponentCreate Error -->", error);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);

export const SalaryComponentUpdateAction = createAsyncThunk(
  "ComponentUpdate",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await SalaryComponentUpdateApi(payload);
      return data;
    } catch (error) {
      console.log("SalaryComponentUpdate Error -->", error);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);

export const SalaryComponentToggleAction = createAsyncThunk(
  "ComponentToggle",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await SalaryComponentToggleApi(payload);
      return data;
    } catch (error) {
      console.log("SalaryComponentToggle Error -->", error);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);

// ---------- Templates ----------
export const SalaryTemplatesGetAction = createAsyncThunk(
  "TemplatesList",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await SalaryTemplatesGetApi(payload);
      return data;
    } catch (error) {
      console.log("SalaryTemplatesGet Error -->", error);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);

export const SalaryTemplateCreateAction = createAsyncThunk(
  "TemplateCreate",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await SalaryTemplateCreateApi(payload);
      return data;
    } catch (error) {
      console.log("SalaryTemplateCreate Error -->", error);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);

// ---------- Template Preview ----------
export const SalaryTemplatePreviewAction = createAsyncThunk(
  "TemplatePreview",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await SalaryTemplatePreviewApi(payload);
      return data;
    } catch (error) {
      console.log("SalaryTemplatePreview Error -->", error);
      return rejectWithValue(error?.response?.data || { message: "Unknown error occurred" });
    }
  }
);
