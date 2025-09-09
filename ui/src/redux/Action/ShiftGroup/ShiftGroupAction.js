import { createAsyncThunk } from "@reduxjs/toolkit";
import { ShiftGroupCreateApi,ShiftGroupGetApi } from "../../../apis/ShiftGroup/ShiftGroup";


export const ShiftGroupCreateAction = createAsyncThunk('shiftGroupCreate', async (payload, { rejectWithValue }) => {
    try {
        const data = await ShiftGroupCreateApi(payload);
        console.log('ShiftGroupCreate Successs -->', data)
        return data;
    } catch (error) {
        return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
});
export const ShiftGroupGetAction= createAsyncThunk(
    'shiftGroupList',
     async (shiftGroupDetails , { rejectWithValue }) => {
    try {
        const data = await ShiftGroupGetApi(shiftGroupDetails);
        console.log('ShiftGroupGet Successs -->', data)
        return data;
    } catch (error) {
        return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
});