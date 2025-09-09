import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { CommentCreateAction, CommentDeleteAction, CommentEditAction, CommentListAction } from "../Action/comments/comments";

const initialState = {
    comments: [],
    loading: false,
    error: null,
};


const commentReducer = createSlice({
    name: "comments",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(CommentListAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(CommentListAction.fulfilled, (state, action) => {
            // console.log(action?.payload);

            state.comments = action.payload?.data?.data;
            state.loading = false;
        });
        builder.addCase(CommentListAction.rejected, (state, action) => {
            state.error = action.error.message; // Store error message
            state.comments = [];
        });
        builder.addCase(CommentCreateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(CommentCreateAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(CommentCreateAction.rejected, (state, action) => {
            state.error = action.error.message; // Store error message
            toast.error(`Error creating Comment: ${state.error}`); // Display error toast
        });
        builder.addCase(CommentDeleteAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(CommentDeleteAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(CommentDeleteAction.rejected, (state, action) => {
            state.error = action.error.message; // Store error message
            toast.error(`Error deleting Comment: ${state.error}`); // Display error toast
        });
        builder.addCase(CommentEditAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(CommentEditAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(CommentEditAction.rejected, (state, action) => {
            state.error = action.error.message; // Store error message
            toast.error(`Error editing Comment: ${state.error}`); // Display error toast
        });

    }
})

export default commentReducer.reducer;