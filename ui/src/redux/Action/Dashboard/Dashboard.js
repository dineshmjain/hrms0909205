import { createAsyncThunk } from "@reduxjs/toolkit";
import { getOverAllDashboard } from "../../../apis/Dashboard/Dashboard";

export const getOverAllDashboardAction = createAsyncThunk('dashboard/overAll', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const response = await getOverAllDashboard(userCredentials);
        console.log('dashboard overall Successs -->', response)
        return response?.data;
    } catch (error) {
        console.log('dashboard overall Error -->', error.message)
       throw rejectWithValue(error);
    }
});