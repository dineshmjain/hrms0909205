import { createAsyncThunk } from "@reduxjs/toolkit";
import { subOrgAddApi, subOrgEditAPi, subOrgListApi } from "../../../apis/Organization/Organization";


export const SubOrgCreateAction = createAsyncThunk(
  'subOrgs/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await subOrgAddApi(formData)
      console.log('SubOrg Create Successs -->', response)
      return response.data;
    } catch (err) {
      console.error('SubOrg Create Error:', err);
      return rejectWithValue(err?.response?.data || { message: 'Unknown error occurred' });
    }
  }
);
export const SubOrgListAction = createAsyncThunk('SubOrgList', async (userCredentials, { rejectWithValue }) => {
  console.log(userCredentials)
  try {
    const data = await subOrgListApi(userCredentials);
    console.log('SubOrg List Successs -->', data)
    return data;
  } catch (error) {
    throw rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
  }
});
export const SubOrgEditAction = createAsyncThunk('SubOrgEdit', async (userCredentials, { rejectWithValue }) => {
  console.log(userCredentials)
  try {
    const data = await subOrgEditAPi(userCredentials);
    console.log('SubOrg Edit Successs -->', data)
    return data;
  } catch (error) {
    throw rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
  }
});