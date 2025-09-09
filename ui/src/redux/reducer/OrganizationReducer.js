// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';
import { OrganizationCreateAction } from '../Action/Oraganization/OrganizationAction';


const initialState = {
    organizationCreate: '',
    status: 'idle',
    error: false,
    errorMessage: ''
};

const OrganizationReducer = createSlice({
    name: 'organizationCreate',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(OrganizationCreateAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(OrganizationCreateAction.fulfilled, (state, action) => {
                state.status = 'success';
                state.error = false;
                state.loading = false;
                state.organizationCreate = action.payload;
                console.log('OrganizationCreateAction Error fulfilled-->', action.payload)
                // toast.success(action.payload.message);
            })
            .addCase(OrganizationCreateAction.rejected, (state, action) => {

                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Failed to create organization.';

                state.error = validationMessage;
                console.log('Org create Error:', backendError?.validation?.body);

                toast.error(validationMessage);
            })

    }
});

export default OrganizationReducer.reducer;
