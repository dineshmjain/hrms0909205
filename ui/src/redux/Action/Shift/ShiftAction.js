import { createAsyncThunk } from "@reduxjs/toolkit";
import { createShiftByDateApi, getShiftByDateApi, ShiftActivateApi, ShiftCreateApi, ShiftGetApi, ShiftUpdateApi, swapShiftByDateApi, updateShiftByDateApi } from "../../../apis/Shift/Shift";

export const ShiftCreateAction = createAsyncThunk('shiftCreate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await ShiftCreateApi(userCredentials);
        console.log('ShiftCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('ShiftCreate Error -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const ShiftGetAction= createAsyncThunk('shiftList', async (shiftDetails) => {   
    console.log(shiftDetails)
    try {
        const data = await ShiftGetApi(shiftDetails);
        console.log('ShiftGet Successs -->', data)
        return data;
    } catch (error) {
        console.log('ShiftGet Error -->', error)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const ShiftUpdateAction = createAsyncThunk('shiftUpdate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await ShiftUpdateApi(userCredentials);
        console.log('ShiftUpdate Successs -->', data)
        return data;
    } catch (error) {
        console.log('ShiftUpdate Error -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const ShiftCreatebyDateAction = createAsyncThunk('shiftByDateCreate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await createShiftByDateApi(userCredentials);
        console.log('Shift Update by Date Successs -->', data)
        return data;
    } catch (error) {
        console.log('Shift Update by Date -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const ShiftUpdatebyDateAction = createAsyncThunk('shiftByDateUpdate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await updateShiftByDateApi(userCredentials);
        console.log('Shift Update by Date Successs -->', data)
        return data;
    } catch (error) {
        console.log('Shift Update by Date -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const ShiftListbyDateAction = createAsyncThunk('shiftByDateList', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        
        const data = await getShiftByDateApi(userCredentials);
        console.log('Shift Update by Date Successs -->', data)
        return data;
    } catch (error) {
        console.log('Shift Update by Date -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const ShiftSwapbyDateAction = createAsyncThunk('shiftByDateSwap', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        
        const data = await swapShiftByDateApi(userCredentials);
        console.log('Shift Swap by Date Successs -->', data)
        return data;
    } catch (error) {
        console.log('Shift Swap by Date -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const ShiftActivateAction = createAsyncThunk('ShiftActivate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await ShiftActivateApi(userCredentials);
        console.log('ShiftActivateAction Successs -->', data)
        return data;
    } catch (error) {
        console.log('ShiftUShiftActivateAction pdate Error -->',error, error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});

