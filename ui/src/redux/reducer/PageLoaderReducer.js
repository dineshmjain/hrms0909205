import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    pageLoading: false
}

const PageLoaderReducer = createSlice({
    name: 'error',
    initialState,
    reducers: {
        setPageLoading: (state, action) => {

            state.pageLoading = action.payload;
        },


    },

})


export const { setPageLoading } = PageLoaderReducer.actions;
export default PageLoaderReducer.reducer    