import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';
import { ShiftCreateAction, ShiftCreatebyDateAction, ShiftGetAction, ShiftListbyDateAction, ShiftUpdateAction } from '../Action/Shift/ShiftAction';
import { ShiftGroupCreateAction, ShiftGroupGetAction } from '../Action/ShiftGroup/ShiftGroupAction';


const initialState = {
    shiftList: [],
    shiftGroupList: [],
    loading: false,
    status: 'idle',
    error: '',
    errorMessage: '',
    shift: {},
    shiftByDates: [],
    nextPage: false,
    shiftPattern: {}

};

// A utility function to check if shift is already populated


const ShiftReducer = createSlice({
    name: 'shift',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ShiftGetAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data

                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(ShiftGetAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.shiftList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
                state.totalRecord = action.payload?.totalRecord
                console.log('Shift list:', action.payload.data);
                // toast.success(action.payload.message || 'Shift data loaded successfully!');
            })
            .addCase(ShiftGetAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Shift List  Error:', backendError?.validation?.body);
                state.shiftList = []
                toast.error(validationMessage);
            })
        builder
            .addCase(ShiftCreateAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(ShiftCreateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.shift = action.payload?.data || []; // Ensure correct path to data and handle empty cases
                toast.success(action.payload.message || 'Shift data loaded successfully!');
            })
            .addCase(ShiftCreateAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;
                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';
                state.error = validationMessage;
                console.log('Shift List  Error:', backendError?.validation?.body)
                toast.error(validationMessage);
            });
        // shift create by Date
        builder
            .addCase(ShiftCreatebyDateAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data

                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(ShiftCreatebyDateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                // state.c = action.payload?.data || []; // Ensure correct path to data and handle empty cases

                // toast.success(action.payload.message || 'Shift data loaded successfully!');
            })
            .addCase(ShiftCreatebyDateAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Shift List  Error:', backendError?.validation?.body);

                toast.error(validationMessage);
            });
        //get shift by Date
        builder
            .addCase(ShiftListbyDateAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data

                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(ShiftListbyDateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.shiftByDates = { data: action.payload?.data || [], references: action.payload?.references || [] }; // Ensure correct path to data and handle empty cases
                state.totalRecord = action.payload?.totalRecord
                // state.nextPage = action.payload?.nextPage || false;
                // state.c = action.payload?.data || []; // Ensure correct path to data and handle empty cases

                // toast.success(action.payload.message || 'Shift data loaded successfully!');
            })
            .addCase(ShiftListbyDateAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Shift List  Error:', backendError?.validation?.body);

                toast.error(validationMessage);
            });
        builder
            .addCase(ShiftUpdateAction.pending, (state, action) => {
                state.error = false;
                state.pageNo = action?.meta?.arg?.page || 1
                state.limit = action?.meta?.arg?.limit || 10
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(ShiftUpdateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.shift = action?.payload || []; // Ensure this is the correct path to the data
                console.log(action.payload.message, "what i sthe statatus");
                toast.success(action.payload.message);
            })
            .addCase(ShiftUpdateAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;
                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';
                state.error = validationMessage;
                toast.error(validationMessage);
            })
        builder
            .addCase(ShiftGroupCreateAction.pending, (state, action) => {
                state.error = false;
                state.pageNo = action?.meta?.arg?.page || 1
                state.limit = action?.meta?.arg?.limit || 10
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(ShiftGroupCreateAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Check the structure of the payload
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.shiftPattern = action?.payload || []; // Ensure this is the correct path to the data
                console.log(action.payload.message, "what i sthe statatus");
                toast.success(action.payload.message);
            })
            .addCase(ShiftGroupCreateAction.rejected, (state, action) => {
                const isOverlapHandled = action.payload?.data?.message === 'Handle Overlapping Shifts';

                if (!isOverlapHandled) {
                    toast.dismiss();
                    state.status = 'failed';
                    state.loading = false;

                    const backendError = action.error?.response?.data || action.payload || action.error;
                    const validationMessage =
                        backendError?.validation?.body?.message ||
                        backendError?.message ||
                        'Something went wrong';

                    state.error = validationMessage;
                    toast.error(validationMessage);
                } else {
                    state.status = 'failed';
                    state.loading = false;
                    state.error = null;
                }
            })
        builder
            .addCase(ShiftGroupGetAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(ShiftGroupGetAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.shiftGroupList = action.payload?.data.map(res => res.patterns) || []; // Ensure correct path to data and handle empty cases
                state.totalRecord = action.payload?.totalRecord
                // toast.success(action.payload.message || 'Shift data loaded successfully!');
            })
            .addCase(ShiftGroupGetAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';
                state.error = validationMessage;
                toast.error(validationMessage);
            })
    }
});

export default ShiftReducer.reducer;
