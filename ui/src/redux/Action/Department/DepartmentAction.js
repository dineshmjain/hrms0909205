import { createAsyncThunk } from "@reduxjs/toolkit";
import { DepartmentCreateApi, DepartmentGetApi, DepartmentAssignment, DepartmentEditApi, DepartmentBranchGetAllApi, DepartmentGetAssigned, DepartmentStatusUpdateApi, departmentClientListApi } from "../../../apis/Department/Department";

export const DepartmentCreateAction = createAsyncThunk(
    'Department/Create',
    async (departmentData, { rejectWithValue }) => {
        console.log(departmentData, 'd')
        try {

            const response = await DepartmentCreateApi(departmentData); // ONLY pass departmentData
            console.log('DepartmentCreate Success -->', response);
            return response;
        } catch (error) {
            console.log(error)
            //   console.error('DepartmentCreate Error -->', error);
            return rejectWithValue(error || { message: 'Unknown error occurred' });
        }
    }
);

export const DepartmentGetAction = createAsyncThunk('DepartmentList', async (department, { rejectWithValue }) => {
    console.log(department)
    try {
        const data = await DepartmentGetApi(department);
        console.log('DepartmentGet Successs -->', data)
        return data;
    } catch (error) {
        console.log('DepartmentGet Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const DepartmentEditAction = createAsyncThunk('DepartmentEdit', async (department, { rejectWithValue }) => {
    console.log(department, 'update')
    try {
        const data = await DepartmentEditApi(department);
        console.log('DepartmentEdit Successs -->', data)
        return data;
    } catch (error) {
        console.log('DepartmentEdit Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const DepartmentBranchGetApiAction = createAsyncThunk('DepartmentBranchList', async (department, { rejectWithValue }) => {
    console.log(department, 'recived Data')
    try {
        const data = await DepartmentBranchGetAllApi(department);
        console.log('DepartmentEdit Successs -->', data)
        return data;
    } catch (error) {
        console.log('DepartmentEdit Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const DepartmentAssignmentAction = createAsyncThunk('DepartmentBranchList', async (department, { rejectWithValue }) => {
    console.log(department, 'recived Data')
    try {
        const data = await DepartmentAssignment(department);
        console.log('DepartmentAssigniment Successs -->', data)
        return data;
    } catch (error) {
        console.log('DepartmentAssigniment Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});


export const DepartmentGetAssignedAction = createAsyncThunk('DepartmentAssignedBranch', async (department, { rejectWithValue }) => {
    console.log(department, '======================recived assigned dep Data')
    try {
        const data = await DepartmentGetAssigned(department);
        console.log('DepartmentAssigned Successs -->', data)
        return data;
    } catch (error) {
        console.log('DepartmentAssigned Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const DepartmentStatusUpdateAction = createAsyncThunk('DepartmentStatus', async (departmentDetails, { rejectWithValue }) => {
    console.log(departmentDetails)
    try {
        const data = await DepartmentStatusUpdateApi(departmentDetails);
        console.log('DepartmentStatus Successs -->', data)
        return data;
    } catch (error) {
        console.log('DepartmentStatus Error -->', error)
        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});


export const DepartmentClientListAction = createAsyncThunk('DepartmentClientList   ', async (empDetails, { rejectWithValue }) => {
    try {
        const data = await departmentClientListApi(empDetails); // Pass the parameters to the API function
        console.log('DepartmentList Success -->', data);

        return data;
    } catch (error) {
        console.log('DepartmentList Error -->', error);

        return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});