import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    error: {
    },
}

const errorReducer = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setError: (state, action) => {
            state.error = { ...action.payload };
        },
        addError: (state, action) => {
            state.error = { ...state.error, ...action.payload };
        },
        emptyError: (state, action) => {
            state.error = {};
        },
        removeError: (state, action) => {
            delete state.error[action.payload];
        }

    },

})


export const { addError, removeError, emptyError } = errorReducer.actions;
export default errorReducer.reducer    