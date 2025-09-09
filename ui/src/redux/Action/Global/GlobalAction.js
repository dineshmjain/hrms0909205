import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAddressTypes, typeOfIndustryApi } from "../../../apis/Global/Global";
export const getTypeOfIndustyAction = createAsyncThunk('industryTypes', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await typeOfIndustryApi(userCredentials);
        console.log('industry type List Successs -->', data)
        return data;
    } catch (error) {
        console.log('industry type List Error -->', error.message)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const getAddressTypesAction = createAsyncThunk('addressTypes', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await getAddressTypes(userCredentials);
        console.log('address type List Successs -->', data)
        return data;
    } catch (error) {
        console.log('address type List Error -->', error.message)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});