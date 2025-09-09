import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';
import { GetTypeOfIndustry } from '../Action/typeOfIndustory/TypeOfIndustryAction';


const initialState = {
   typeList: [],
   loading: false,
   status: 'idle',
   error: '',
   errorMessage: ''
};

// A utility function to check if typeList is already populated
const shouldFetchIndustryType = (state) => {
   // Only fetch if there is no data or the status is not 'success'
   return !state.typeList.length && state.status !== 'loading';
};

const IndustryReducer = createSlice({
    name: 'typeList',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(GetTypeOfIndustry.pending, (state) => {
                // Avoid redundant calls by checking the status and existing data
                if (!shouldFetchIndustryType(state)) return;
                state.status = 'loading';
                state.error = '';
                state.loading = true;
            })
            .addCase(GetTypeOfIndustry.fulfilled, (state, action) => {
                console.log('Full payload:', action.payload); // Debug the payload structure
                state.status = 'success';
                state.error = '';
                state.loading = false;
                state.typeList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
                console.log('Branch list:', action.payload.data);
                // toast.success(action.payload.message || 'Branch data loaded successfully!');
            })
            .addCase(GetTypeOfIndustry.rejected, (state, action) => {
                toast.dismiss();
                console.log('Action failed:', action);
                state.status = 'failed';
                state.error = action.error.message;
                state.loading = false;
                console.log('Ind Error rejected-->', action.error);

                // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
            });
    }
});

export default IndustryReducer.reducer;
