import { createAsyncThunk } from "@reduxjs/toolkit";
import { AddAssignment, getAssignedModules, RemoveAssignment, MultiAssignment, MultiUnAssignment } from "../../../apis/Assigned/Assigned";
import toast from "react-hot-toast";

export const AssignedModulesAction = createAsyncThunk('AssignedModules', async (assignedDetails, { rejectWithValue }) => {

    try {
        const data = await getAssignedModules(assignedDetails);
        console.log('Assigned Modules Successs -->', data)
        return data;
    } catch (error) {
        console.log('AssignedModules  Error -->', error)
        throw rejectWithValue(error)
    }
});
export const AddAssignmentAction = createAsyncThunk('AddAssignmentModules', async (assignedDetails, { rejectWithValue }) => {
    console.log(assignedDetails, 'recived Data')
    try {
        const data = await AddAssignment(assignedDetails);
        console.log('Assigniment Successs -->', data)
        toast.success(data?.message)
        return data;
    } catch (error) {
        console.log('Assigniment Error -->', error)
        toast.error(error?.message)
        throw rejectWithValue(error)
    }
});
export const RemoveAssignmentAction = createAsyncThunk('RemoveAssignmentModules', async (assignedDetails, { rejectWithValue }) => {
    console.log(assignedDetails, 'recived Data')
    try {
        const data = await RemoveAssignment(assignedDetails);
        console.log('Assigniment Successs -->', data)
        toast.success(data?.message)
        return data;
    } catch (error) {
        console.log('Assigniment Error -->', error)
        toast.error(error?.message)
        throw rejectWithValue(error)
    }
});

export const MultiAssignmentAction = createAsyncThunk('MultiAssignmentModules', async (assignedDetails, { rejectWithValue }) => {
    try {
        const data = await MultiAssignment(assignedDetails);
        console.log('Multi Assigniment Successs -->', data)
        toast.success(data?.message)
        return data;
    } catch (error) {
        console.log('Multi Assigniment Error -->', error)
        toast.error(error?.message)
        throw rejectWithValue(error)
    }
});
export const MultiUnAssignmentAction = createAsyncThunk('MultiUnAssignmentModules', async (assignedDetails, { rejectWithValue }) => {
    try {
        const data = await MultiUnAssignment(assignedDetails);
        console.log('Multi UnAssigniment Successs -->', data)
        toast.success(data?.message)
        return data;
    } catch (error) {
        console.log('Multi UnAssigniment Error -->', error)
        toast.error(error?.message)
        throw rejectWithValue(error)
    }
});

