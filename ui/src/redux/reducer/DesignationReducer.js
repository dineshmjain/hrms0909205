import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';
import { DesignationClientListAction, DesignationCreateAction, DesignationEditAction, DesignationGetAction, DesignationGetAssignedAction, DesignationStatusUpdateAction } from '../Action/Designation/DesignationAction';
const initialState = {
    designationList: [],
    loading: false,
    status: 'idle',
    error: '',
    errorMessage: '',
    totalRecord: 0,
    designationBranchDepartemnt: [],
    designationCreate: {},

    pageNo: 1,
    limit: 10,
};

// A utility function to check if designationList is already populated
const shouldFetchBranches = (state) => {
    // Only fetch if there is no data or the status is not 'success'
    return !state.designationList.length && state.status !== 'loading';
};

const DesignationReducer = createSlice({
    name: 'designation',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DesignationGetAction.pending, (state,action) => {
                state.pageNo = action?.meta?.arg?.page || 1;
                state.limit = action?.meta?.arg?.limit || 10;
                state.loading = true;
                state.status = 'loading';
                state.error = '';
            })
            .addCase(DesignationGetAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.designationList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
                state.totalRecord = action.payload?.totalRecord
                console.log('Department list:', action.payload.data);
                // toast.success(action.payload.message || 'Branch data loaded successfully!');
            })
            .addCase(DesignationGetAction.rejected, (state, action) => {
                toast.dismiss();
                console.log('Action failed:', action);
                state.status = 'failed';
                state.error = action.error.message;
                state.designationList = []
                state.loading = false;
                console.log('desigantion Error rejected-->', action.error);

                // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
            })
        builder
            .addCase(DesignationGetAssignedAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DesignationGetAssignedAction.fulfilled, (state, action) => {
                console.log('Full payload de:', action.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.designationBranchDepartemnt = action?.payload?.data; // Ensure this is the correct path to the data
                console.log('Designation list:', action.payload.data);
                // toast.success(action.payload.message);
            })
            .addCase(DesignationGetAssignedAction.rejected, (state, action) => {
                state.status = 'error';
                state.error = '';
                state.loading = false;
                state.designationBranchDepartemnt = []; // Ensure this is the correct path to the data

            })
        //create designation
        builder
            .addCase(DesignationCreateAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DesignationCreateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action?.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.designationCreate = action?.payload || {}; // Ensure this is the correct path to the data
                console.log('Desg Create :', action);
                toast.success(action.payload.message);
            })
            .addCase(DesignationCreateAction.rejected, (state, action) => {

                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Deg Create Error:', backendError?.validation?.body);

                toast.error(validationMessage);
            })
        builder
            .addCase(DesignationEditAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DesignationEditAction.fulfilled, (state, action) => {
                console.log('Full payload:', action?.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.designationCreate = action?.payload || {}; // Ensure this is the correct path to the data
                console.log('Desg Create :', action);
                toast.success(action.payload.message);
            })
            .addCase(DesignationEditAction.rejected, (state, action) => {

                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Deg Create Error:', backendError?.validation?.body);

                toast.error(validationMessage);
            })
        //designation status update
        builder
            .addCase(DesignationStatusUpdateAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(DesignationStatusUpdateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action?.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.createDepartmet = action?.payload || {}; // Ensure this is the correct path to the data
                console.log('Department status:', action);
                toast.success(action.payload.message);
            })
            .addCase(DesignationStatusUpdateAction.rejected, (state, action) => {

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
            .addCase(DesignationClientListAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
                // if (!shouldFetchBranches(state)) return
                state.designationList = [];
                state.loading = true;
                state.error = '';
            })
            .addCase(DesignationClientListAction.fulfilled, (state, action) => {
                state.error = '';
                state.loading = false;
                state.designationList = action.payload?.data || []; // Ensure correct path to data and handle empty cases


            })
            .addCase(DesignationClientListAction.rejected, (state, action) => {

                state.designationList = [];
                state.error = action.error.message;
                state.loading = false;

                // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
            })

    }
});

export default DesignationReducer.reducer;
