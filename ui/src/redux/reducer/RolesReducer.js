import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';
import { RoleCreateAction, RoleGetAction } from '../Action/Roles/RoleAction';


const initialState = {
   rolesList: [],
   loading: false,
   status: 'idle',
   error: '',
   errorMessage: '',
   roleCreate:[]
};



const RolesReducer = createSlice({
    name: 'roles',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(RoleGetAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
               
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(RoleGetAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.rolesList = action.payload.data || []; // Ensure correct path to data and handle empty cases
                console.log('Role list:', action.payload.data);
                // toast.success(action.payload.message || 'Role data loaded successfully!');
            })
            .addCase(RoleGetAction.rejected, (state, action) => {
                toast.dismiss();
                state.status = 'failed';
                state.loading = false;

                // Safe access to validation message
                const backendError = action.error?.response?.data || action.payload || action.error;
                const validationMessage = backendError?.validation?.body?.message || backendError?.message || 'Something went wrong';

                state.error = validationMessage;
                console.log('Role List  Error:', backendError);

                toast.error(validationMessage);            // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
            })
             builder
            .addCase(RoleCreateAction.pending, (state) => {
                state.status = 'loading';
                state.error = false;
                state.loading = true;
            })
            .addCase(RoleCreateAction.fulfilled, (state, action) => {
                state.status = 'success';
                state.error = false;
                state.loading = false;
                state.roleCreate=action.payload;
                console.log('RoleCreateAction Error fulfilled-->', action.payload)
                toast.success(action.payload.message);
            })
            .addCase(RoleCreateAction.rejected, (state, action) => {
                toast.dismiss();
                console.log(action,'failed')
                state.status = 'failed';
                state.error = action.error.message;
                state.loading = false;
                console.log('RoleCreateAction Error rejected-->', action.error)

                toast.error(action.error.message|| 'Create Branch failed. Please try again.');
            })

    }
});

export default RolesReducer.reducer;
