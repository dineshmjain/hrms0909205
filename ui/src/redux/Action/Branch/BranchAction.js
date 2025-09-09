import { createAsyncThunk } from "@reduxjs/toolkit";
import { BranchCreateApi, BranchEditApi, BranchGetApi,branchKYCCreateApi, branchKYCGetApi, branchRadiusGetApi, branchRadiusUpdateApi, BranchStatusUpdateApi } from "../../../apis/Branch/Branch";

export const BranchCreateAction = createAsyncThunk('BranchCreate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await BranchCreateApi(userCredentials);
        console.log('BranchCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchCreate Error -->', error.message)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
});
export const BranchGetAction= createAsyncThunk('BranchList', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails)
    try {
        const data = await BranchGetApi(branchDetails);
        console.log('BranchGet Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchGet Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const BranchEditAction = createAsyncThunk('BranchEdit', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails)
    try {
        const data = await BranchEditApi(branchDetails);
        console.log('BranchEdit Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchEdit Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});

export const MappedBranches = createAsyncThunk('BranchList', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails)
    try {
        const data = await BranchEditApi(branchDetails);
        console.log('BranchEdit Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchEdit Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});

export const BranchStatusUpdateAction = createAsyncThunk('BranchStatus', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails)
    try {
        const data = await BranchStatusUpdateApi(branchDetails);
        console.log('BranchStatus Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchStatus Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 

export const BranchKycCreateAction= createAsyncThunk('BranchKYCUpdate', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails)
    try {
        const data = await branchKYCCreateApi(branchDetails);
        console.log('BranchKyc Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchKyc Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
});
export const BranchKycGetAction= createAsyncThunk('BranchKYCGet', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails,"============================================bracnh Kyc ")
    try {
        const data = await branchKYCGetApi(branchDetails);
        console.log('BranchKyc Get Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchKyc Get Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
});

export const BranchRadiusGetAction = createAsyncThunk('BranchRadiusGet', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails,"============================================bracnh Radius ")
    try {
        const data = await branchRadiusGetApi(branchDetails);
        console.log('BranchRadius Get Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchRadius Get Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}
);

export const BranchRadiusUpdateAction = createAsyncThunk('BranchRadiusUpdate', async (branchDetails,{ rejectWithValue }) => {
    console.log(branchDetails,"============================================bracnh Radius ")
    try {
        const data = await branchRadiusUpdateApi(branchDetails);
        console.log('BranchRadius Update Successs -->', data)
        return data;
    } catch (error) {
        console.log('BranchRadius Update Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
});

