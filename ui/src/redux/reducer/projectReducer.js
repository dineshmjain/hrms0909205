import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { ProjectCreateAction, ProjectDeleteAction, ProjectListAction, ProjectUpdateAction } from "../Action/project/project";

const initialState = {
    project: [],
    loading: false,
    error: null,
};


const projectReducer = createSlice({
    name: "project",
    initialState,
    reducers: {
        emptyProjectList: (state, action) => {
            state.project = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(ProjectListAction.pending, (state) => {
            state.project = []
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(ProjectListAction.fulfilled, (state, action) => {
            // console.log(action?.payload);

            state.project = action.payload?.data;
            state.loading = false;
        });
        builder.addCase(ProjectListAction.rejected, (state, action) => {
            state.project = []
            state.error = action.error.message; // Store error message
            toast.error(`Error fetching project: ${state.error}`); // Display error toast
        });
        builder.addCase(ProjectCreateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(ProjectCreateAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(ProjectCreateAction.rejected, (state, action) => {
            state.error = action.error.message; // Store error message
            toast.error(`Error creating project: ${state.error}`); // Display error toast
        });
        builder.addCase(ProjectUpdateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(ProjectUpdateAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(ProjectUpdateAction.rejected, (state, action) => {
            state.error = action.error.message; // Store error message
            toast.error(`Error updating project: ${state.error}`); // Display error toast
        });
        builder.addCase(ProjectDeleteAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(ProjectDeleteAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(ProjectDeleteAction.rejected, (state, action) => {
            state.error = action.error.message; // Store error message
            toast.error(`Error Deleting project: ${state.error}`); // Display error toast
        });
    }
})

export const { emptyProjectList } = projectReducer.actions;

export default projectReducer.reducer;