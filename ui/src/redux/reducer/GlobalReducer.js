import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';
import { getAddressTypesAction, getTypeOfIndustyAction } from '../Action/Global/GlobalAction';


const initialState = {
   typeOfIndustries: [],
   addressTypes:[],
   loading: false,
   status: 'idle',
   error: '',
   errorMessage: '',
   totalRecord:0,
  
};

// A utility function to check if typeOfIndustries is already populated
const shouldFetchtypeOfIndustries = (state) => {
   // Only fetch if there is no data or the status is not 'success'
   return !state.typeOfIndustries.length && state.status !== 'loading';
};

const GlobalReducer = createSlice({
    name: 'golbals',
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        //type Of industry 
        builder
            .addCase(getTypeOfIndustyAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
                if (!shouldFetchtypeOfIndustries(state)) return;
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(getTypeOfIndustyAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.typeOfIndustries = action.payload?.data || []; // Ensure correct path to data and handle empty cases
                state.totalRecord=action.payload?.totalRecord
                console.log('Industry Type list:', action.payload.data);
                // toast.success(action.payload.message || 'Industry Type data loaded successfully!');
            })
            .addCase(getTypeOfIndustyAction.rejected, (state, action) => {
                toast.dismiss();
                console.log('Action failed:', action);
                state.status = 'failed';
                state.error = action.error.message;
                state.loading = false;
                console.log('BranchGetAction Error rejected-->', action.error);

                // toast.error(action.error.message || 'Failed to load Industry Type data. Please try again.');
            });
//address Types
            builder
            .addCase(getAddressTypesAction.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
                if (!shouldFetchtypeOfIndustries(state)) return;
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(getAddressTypesAction.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.addressTypes = action.payload?.data || []; // Ensure correct path to data and handle empty cases
                state.totalRecord=action.payload?.totalRecord
                console.log('Address Type list:', action.payload.data);
                // toast.success(action.payload.message || 'Industry Type data loaded successfully!');
            })
            .addCase(getAddressTypesAction.rejected, (state, action) => {
                toast.dismiss();
                console.log('Action failed:', action);
                state.status = 'failed';
                state.error = action.error.message;
                state.loading = false;
                console.log('AddressGetAction Error rejected-->', action.error);

                // toast.error(action.error.message || 'Failed to load Industry Type data. Please try again.');
            });
    
    }
});

export default GlobalReducer.reducer;
