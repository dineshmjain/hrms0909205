import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUserDetails, loginApi, registerApi, sendOTPApi, verifyOTPApi } from "../../../apis/Auth/Auth";


export const getUserByToken = createAsyncThunk(
  "user/getUserByToken",
  async (reqbody, { rejectWithValue }) => {
    try {
      const data = await getUserDetails({ module: "keyvalue" });
      return data;
    } catch (error) {
      console.log(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'user/login',
  async ({ body, rememberMe }, {rejectWithValue}) => {

    try {
      const data = await loginApi(body);

      return { ...data, rememberMe };
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error);
    }
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (userDetails, { rejectWithValue }) => {
    try {
      const data = await registerApi(userDetails);
      return data;
    } catch (error) {
      // commited by Mohit
       return rejectWithValue(error);
      // if(error.error){
      //   return rejectWithValue(error.validation.body.message);
      // }
      // else{
      //   return rejectWithValue(error.message) 
      // }
    }
     // commited by Mohit
  }
);
export const verifyOTP = createAsyncThunk(
  "user/verifyOTP",
  async (userDetails, { rejectWithValue }) => {
    try {
      const data = await verifyOTPApi(userDetails);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const sendOTP = createAsyncThunk(
  "user/sendOTP",
  async (userDetails, { rejectWithValue }) => {
    try {
      const data = await sendOTPApi(userDetails);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);