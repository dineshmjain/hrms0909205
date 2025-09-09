import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientBranchAddApi, clientBranchListApi } from "../../../apis/Client/ClientBranch";


export const clientBranchListAction = createAsyncThunk('clientBranchList', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await clientBranchListApi(userCredentials);
        console.log('client branch List Successs -->', data)
        return data;
    } catch (error) {
        console.log('client branch List Error -->', error.message)
        throw rejectWithValue(error);
    }
});


export const clientBranchCreateAction = createAsyncThunk('BranchCreate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await clientBranchAddApi(userCredentials);
        console.log('ClientBranchCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('ClientBranchCreate Error -->', error.message)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
});