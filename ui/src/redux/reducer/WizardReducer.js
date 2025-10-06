// src/features/user/userSlice.js
import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { GetStructureAction } from "../Action/Wizard/WizardAction";
import { GetOrganizationAction } from "../Action/Wizard/WizardAction"; // import your action
import { GetBranchCreationAction } from "../Action/Wizard/WizardAction";
import { GetAllWizardAction } from "../Action/Wizard/WizardAction";
import { OtCreateAction, OtUpdateAction } from "../Action/Wizard/WizardAction";

const initialState = {
  structure: null,
  organization: null,
  branch: null,
  wizard: null,
  status: "idle",
  error: false,
  errorMessage: "",
  otCreation: null,
  otUpdate: null,
};

const WizardReducer = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔹 Structure Actions
      .addCase(GetStructureAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
      })
      .addCase(GetStructureAction.fulfilled, (state, action) => {
        state.status = "success";
        state.structure = action.payload?.data || null; // "branch" | "organization" | "group"
        toast.success("Structure fetched successfully");
      })
      .addCase(GetStructureAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = true;

        const backendError =
          action.payload || action.error?.response?.data || action.error;
        const validationMessage =
          backendError?.message || "Failed to fetch structure";

        state.errorMessage = validationMessage;
        toast.error(validationMessage);
      })

      //  Organization Actions
      .addCase(GetOrganizationAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
      })
      .addCase(GetOrganizationAction.fulfilled, (state, action) => {
        state.status = "success";
        state.organization = action.payload?.data || null;
        toast.success("Organization fetched successfully");
      })
      .addCase(GetOrganizationAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = true;

        const backendError =
          action.payload || action.error?.response?.data || action.error;
        const validationMessage =
          backendError?.message || "Failed to fetch organization";

        state.errorMessage = validationMessage;
        toast.error(validationMessage);
      })

      // Branch Actions
      .addCase(GetBranchCreationAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
      })
      .addCase(GetBranchCreationAction.fulfilled, (state, action) => {
        state.status = "success";
        state.branch = action.payload?.data || null;
        toast.success("Branch fetched successfully");
      })
      .addCase(GetBranchCreationAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = true;

        const backendError =
          action.payload || action.error?.response?.data || action.error;
        const validationMessage =
          backendError?.message || "Failed to fetch Branch";

        state.errorMessage = validationMessage;
        toast.error(validationMessage);
      })
      // Wizard Actions
      .addCase(GetAllWizardAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
      })
      .addCase(GetAllWizardAction.fulfilled, (state, action) => {
        state.status = "success";
        state.wizard = action.payload?.data || null;
        toast.success("Wizard fetched successfully");
      })
      .addCase(GetAllWizardAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = true;

        const backendError =
          action.payload || action.error?.response?.data || action.error;
        const validationMessage =
          backendError?.message || "Failed to fetch Wizard ";

        state.errorMessage = validationMessage;
        toast.error(validationMessage);
      })
      // OT Creation Actions
      .addCase(OtCreateAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(OtCreateAction.fulfilled, (state, action) => {
        state.status = "success";
        state.otCreation = action.payload?.data || null;
        toast.success("OT Created successfully");
      })
      .addCase(OtCreateAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = true;
        const backendError =
          action.payload || action.error?.response?.data || action.error;
        const validationMessage =
          backendError?.message || "Failed to create OT";
        state.errorMessage = validationMessage;
        toast.error(validationMessage);
      })
      .addCase(OtUpdateAction.pending, (state) => {
        state.status = "loading";
      })
      .addCase(OtUpdateAction.fulfilled, (state, action) => {
        state.status = "success";
        state.otUpdate = action.payload?.data || null;
        toast.success("OT Updated successfully");
      })
      .addCase(OtUpdateAction.rejected, (state, action) => {
        state.status = "failed";
        state.error = true;
        const backendError =
          action.payload || action.error?.response?.data || action.error;
        const validationMessage =
          backendError?.message || "Failed to update OT";
        state.errorMessage = validationMessage;
        toast.error(validationMessage);
      });
  },
});

export default WizardReducer.reducer;
