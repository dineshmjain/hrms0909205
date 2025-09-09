import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';

import { DepartmentGetAction, DepartmentGetAssignedAction, DepartmentCreateAction, DepartmentEditAction, DepartmentStatusUpdateAction, DepartmentClientListAction } from '../Action/Department/DepartmentAction';


const initialState = {
    departmentList: [],
    loading: false,
    status: 'idle',
    error: '',
    errorMessage: '',
    totalRecord: 0,
    assignedBranchDepartments: [],
    createDepartmet: {},
    pageNo: 1,
    limit: 10,
};

// A utility function to check if departmentList is already populated
const shouldFetchBranches = (state) => {
    // Only fetch if there is no data or the status is not 'success'
    return !state.departmentList.length && state.status !== 'loading';
};

const DepartmentReducer = createSlice({
    name: 'departmentList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DepartmentGetAction.pending, (state, action) => {
                state.pageNo = action?.meta?.arg?.page || 1
                state.limit = action?.meta?.arg?.limit || 10
                state.departmentList = [];
                state.loading = true;
                state.status = 'loading';
                state.error = '';
            })
            .addCase(DepartmentGetAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.departmentList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
                state.totalRecord = action.payload?.totalRecord
                console.log('dept list:', action.payload.data);
                // toast.success(action.payload.message || 'Branch data loaded successfully!');
            })
            .addCase(DepartmentGetAction.rejected, (state, action) => {
                toast.dismiss();
                console.log('Action failed:', action);
                state.status = 'failed';
                state.departmentList = [];
                state.error = action.error.message;
                state.loading = false;
                console.log('Department Error rejected-->', action.error);

                // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
            })
        //assigned department list
        builder
            .addCase(DepartmentGetAssignedAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DepartmentGetAssignedAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.assignedBranchDepartments = action.payload.data; // Ensure this is the correct path to the data
                console.log('Department list:', action.payload.data);
                // toast.success(action.payload.message);
            })
            .addCase(DepartmentGetAssignedAction.rejected, (state, action) => {

                state.status = 'error';
                state.error = '';
                state.loading = false;
                state.assignedBranchDepartments = []; // Ensure this is the correct path to the data
            })

        //create department
        builder
            .addCase(DepartmentCreateAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DepartmentCreateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action?.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.createDepartmet = action?.payload || {}; // Ensure this is the correct path to the data
                console.log('Department list:', action);
                toast.success(action.payload.message);
            })
            .addCase(DepartmentCreateAction.rejected, (state, action) => {

                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Dep Create Error:', backendError?.validation?.body);

                toast.error(validationMessage);
            })
        //edit department
        builder
            .addCase(DepartmentEditAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DepartmentEditAction.fulfilled, (state, action) => {
                console.log('Full payload:', action?.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.createDepartmet = action?.payload || {}; // Ensure this is the correct path to the data
                console.log('Department list:', action);
                toast.success(action.payload.message);
            })
            .addCase(DepartmentEditAction.rejected, (state, action) => {

                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Dep Create Error:', backendError?.validation?.body);

                toast.error(validationMessage);
            })
        //department update status
        builder
            .addCase(DepartmentStatusUpdateAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DepartmentStatusUpdateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action?.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.createDepartmet = action?.payload || {}; // Ensure this is the correct path to the data
                console.log('Department status:', action);
                toast.success(action.payload.message);
            })
            .addCase(DepartmentStatusUpdateAction.rejected, (state, action) => {

                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Department status:', backendError?.validation?.body);

                toast.error(validationMessage);
            })
        builder
            .addCase(DepartmentClientListAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
                // if (!shouldFetchBranches(state)) return
                state.departmentList = [];
                state.loading = true;
                state.error = '';
            })
            .addCase(DepartmentClientListAction.fulfilled, (state, action) => {
                state.error = '';
                state.loading = false;
                state.departmentList = action.payload?.data || []; // Ensure correct path to data and handle empty cases


            })
            .addCase(DepartmentClientListAction.rejected, (state, action) => {

                state.departmentList = [];
                state.error = action.error.message;
                state.loading = false;

                // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
            })
    }
});

export default DepartmentReducer.reducer;
