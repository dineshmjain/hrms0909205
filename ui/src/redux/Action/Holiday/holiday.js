import { createAsyncThunk } from "@reduxjs/toolkit";
import {HolidayListApi, HolidayCreateApi, HolidayEditAPi} from "../../../apis/Holiday/holiday"


export const HolidayCreateAction = createAsyncThunk(
  'holiday/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await HolidayCreateApi(formData)
    //   console.log('SubOrg Create Successs -->', response)
      return response.data;
    } catch (err) {
      console.error('SubOrg Create Error:', err);
      return rejectWithValue(err?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);

export const HolidayListAction = createAsyncThunk('HolidayList', async (userCredentials, { rejectWithValue }) => {

  try {
    const data = await HolidayListApi(userCredentials);
    return data;
  } catch (error) {
    throw rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
  }
});

export const HolidayEditAction = createAsyncThunk('HolidayEdit', async (userCredentials, { rejectWithValue }) => {
  console.log(userCredentials)
  try {
    const data = await HolidayEditAPi(userCredentials);
    console.log('SubOrg Edit Successs -->', data)
    return data;
  } catch (error) {
    throw rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
  }
});