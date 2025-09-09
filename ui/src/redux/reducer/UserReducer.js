// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import { loginApi, registerApi, sendOTPApi, verifyOTPApi } from "../../apis/Auth/Auth";
import { getUserByToken, login, register, sendOTP, verifyOTP } from "../Action/Auth/AuthAction";

const initialState = {
  user: {},
  modules: null,
  status: "idle",
  error: false,
  errorMessage: "",
};



const UserReducer = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserByToken.pending, (state) => {
      state.status = "loading";
      state.error = false;
    })
      .addCase(getUserByToken.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload?.data || {};
        state.modules = action.payload?.data.modules;
      })
      .addCase(getUserByToken.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'success';
        state.user = action.payload?.data || {};
        state.modules = action.payload?.data?.modules;
        const token = action.payload?.data?.token;
        if (action.payload?.rememberMe) {
          localStorage.setItem('token', token);
        } else {
          sessionStorage.setItem('token', token);
        }

        toast.success(action.payload?.message || 'Login successful');
      })
      .addCase(login.rejected, (state, action) => {
        toast.dismiss();
        state.status = 'failed';
        state.loading = false;

        // Safe access to validation message
        console.log('Login Error:', action?.response);
        const backendError = action.error?.response?.data || action.payload || action.error;
        const validationMessage = backendError?.message || backendError?.validation?.body?.message || 'Something went wrong';

        state.error = validationMessage;


        toast.error(validationMessage);
      })
    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "success";
        state.error = "";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        // Safe access to validation message
        console.log('Login Error:', action?.error);
        const backendError = action.error?.response?.data || action.payload || action.error;
        const validationMessage = backendError?.validation?.body?.message
          || (!backendError?.validation && backendError?.message)
          || 'Something went wrong';
        state.error = validationMessage;
        toast.error(validationMessage);
      })
      .addCase(verifyOTP.pending, (state) => {
        state.status = "loading";
        state.error = false;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        state.error = "";
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.payload || "OTP Failed");
        // state.errorMessage = action.payload || 'Registration failed. Please try again.';
      })
      .addCase(sendOTP.pending, (state) => {
        state.status = "loading";
        state.error = false;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.status = "success";
        state.user = action.payload;
        state.error = "";
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        toast.error(action.payload || "OTP Failed");
        // state.errorMessage = action.payload || 'Registration failed. Please try again.';
      });
  },
});

export default UserReducer.reducer;
