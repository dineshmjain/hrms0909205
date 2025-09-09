import { createAsyncThunk } from "@reduxjs/toolkit";
import { add , groupAdd , singleOrg} from "../../../apis/Organization/Organization";

export const OrganizationCreateAction = createAsyncThunk('OrganizationCreate', async (userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await add(userCredentials);
        console.log('OrganizationCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('OrganizationCreate Error -->', error.message)
        return rejectWithValue(error);
    }
});
export const OrganizationGroupCreateAction = createAsyncThunk('OrganizationFroupCreate', async (userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await groupAdd(userCredentials);
        console.log('OrganizationGroupCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('OrganizationGroupCreate Error -->', error.message)
        return rejectWithValue(error);
    }
});
export const OrganizationDefaultCreateAction = createAsyncThunk('OrganizationSingleCreate', async (userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await singleOrg(userCredentials);
        console.log('OrganizationSingleCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('OrganizationSingleCreate Error -->', error.message)
        return rejectWithValue(error);
    }
});