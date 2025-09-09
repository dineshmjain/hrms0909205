import { createAsyncThunk } from "@reduxjs/toolkit";

import { DesignationListApi, DesignationCreateApi, DesignationEditApi, DesignationGetAssigned, DesignationStatusUpdateApi, designationClientListApi } from "../../../apis/Designation/Designation";



export const DesignationCreateAction = createAsyncThunk('DesignationCreate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await DesignationCreateApi(userCredentials);
        console.log('DesignationCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('DesignationCreate Error -->', error.message)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
});
export const DesignationGetAction = createAsyncThunk('DesignationList', async (designation, { rejectWithValue }) => {
    console.log(designation)
    try {
        const data = await DesignationListApi(designation);
        console.log('DesignationList Successs -->', data)
        return data;
    } catch (error) {
        console.log('DesignationList Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const DesignationEditAction = createAsyncThunk('DesignationEdit', async (designation, { rejectWithValue }) => {
    console.log(designation)
    try {
        const data = await DesignationEditApi(designation);
        console.log('DesignationList Successs -->', data)
        return data;
    } catch (error) {
        console.log('DesignationList Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});


export const DesignationGetAssignedAction = createAsyncThunk('DesignationAssignedBranchDep', async (department, { rejectWithValue }) => {
    console.log(department, '===================================recived assigned dep Data')
    try {
        const data = await DesignationGetAssigned(department);
        console.log('Designation Assigned Successs -->', data)
        return data;
    } catch (error) {
        console.log('Designation Assigned Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});

export const DesignationStatusUpdateAction = createAsyncThunk('designationStatus', async (designationDetails, { rejectWithValue }) => {
    console.log(designationDetails)
    try {
        const data = await DesignationStatusUpdateApi(designationDetails);
        console.log('designationStatus Successs -->', data)
        return data;
    } catch (error) {
        console.log('designationStatus Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});


export const DesignationClientListAction = createAsyncThunk('DesignationClientList   ', async (empDetails, { rejectWithValue }) => {
    try {
        const data = await designationClientListApi(empDetails); // Pass the parameters to the API function
        console.log('DesignationList Success -->', data);

        return data;
    } catch (error) {
        console.log('DesignationList Error -->', error);

        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});