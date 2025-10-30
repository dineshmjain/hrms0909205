import { createSlice } from "@reduxjs/toolkit";
import {
  SalaryComponentsGetAction,
  SalaryComponentCreateAction,
  SalaryComponentToggleAction,
  SalaryComponentUpdateAction,
  SalaryTemplatesGetAction,
  SalaryTemplateGetOneAction,
  SalaryTemplateCreateAction,
  SalaryTemplatePreviewAction,
} from "../Action/Salary/SalaryAction";
import toast from "react-hot-toast";

const baseState = {
  list: [],
  loading: false,
  status: "idle",
  error: "",
  totalRecord: 0,
  pageNo: 1,
  limit: 10,
};

const initialState = {
  components: { ...baseState },   // normal
  statutory: { ...baseState },    // statutory
  all: { ...baseState },          // all components
  templates: { ...baseState },    // salary templates
  create: {
    loading: false,
    status: "idle",
    error: "",
    created: null,
  },
  createTemplate: {
    loading: false,
    status: "idle",
    error: "",
    created: null,
  },
  preview: {
    loading: false,
    status: "idle",
    error: "",
    result: null,
  },
  template: {          
    loading: false,
    status: "idle",
    error: "",
    data: null,
  },
};

const SalaryReducer = createSlice({
  name: "salary",
  initialState,
  reducers: {
    resetCreateState: (state) => {
      state.create = {
        loading: false,
        status: "idle",
        error: "",
        created: null,
      };
    },
    resetCreateTemplateState: (state) => {
      state.createTemplate = {
        loading: false,
        status: "idle",
        error: "",
        created: null,
      };
    },
    resetPreviewState: (state) => {
      state.preview = {
        loading: false,
        status: "idle",
        error: "",
        result: null,
      };
    },
  },
  extraReducers: (builder) => {
    // ------- COMPONENTS: GET -------
    builder
      .addCase(SalaryComponentsGetAction.pending, (state, action) => {
        const category = action.meta.arg?.category || "normal";
        let target =
          category === "statutory"
            ? state.statutory
            : category === "all"
            ? state.all
            : state.components;

        target.pageNo = action?.meta?.arg?.page || 1;
        target.limit = action?.meta?.arg?.limit || 10;
        target.loading = true;
        target.status = "loading";
        target.error = "";
        target.list = [];
      })
      .addCase(SalaryComponentsGetAction.fulfilled, (state, action) => {
        const category = action.meta.arg?.category || "normal";
        let target =
          category === "statutory"
            ? state.statutory
            : category === "all"
            ? state.all
            : state.components;

        target.status = "success";
        target.loading = false;
        target.error = "";
        target.list = action.payload?.data || [];
        target.totalRecord = action.payload?.totalRecord || 0;
      })
      .addCase(SalaryComponentsGetAction.rejected, (state, action) => {
        const category = action.meta.arg?.category || "normal";
        let target =
          category === "statutory"
            ? state.statutory
            : category === "all"
            ? state.all
            : state.components;

        target.status = "failed";
        target.loading = false;
        target.list = [];
        target.error =
          action.error?.message || "Failed to fetch salary components";
        toast.error(target.error);
      });

    // ------- COMPONENTS: TOGGLE -------
    builder
      .addCase(SalaryComponentToggleAction.pending, (state) => {
        // Optionally set a loading flag if needed
      })
      .addCase(SalaryComponentToggleAction.fulfilled, (state, action) => {
        toast.success(action.payload?.message || "Component status updated!");
        // Optionally update state if needed (e.g., refetch list)
      })
      .addCase(SalaryComponentToggleAction.rejected, (state, action) => {
        toast.error(action.error?.message || "Failed to update component status");
      });

    // ------- COMPONENTS: UPDATE -------
    builder
      .addCase(SalaryComponentUpdateAction.pending, (state) => {
        // optional loading state
      })
      .addCase(SalaryComponentUpdateAction.fulfilled, (state, action) => {
        toast.success(action.payload?.message || "Component updated successfully!");
        const updated = action.payload?.data;
        if (updated?._id) {
          // Patch all slices (components, statutory, all)
          [state.components, state.statutory, state.all].forEach((slice) => {
            slice.list = slice.list.map((c) =>
              c._id === updated._id ? { ...c, ...updated } : c
            );
          });
        }
      })
      .addCase(SalaryComponentUpdateAction.rejected, (state, action) => {
        toast.error(action.error?.message || "Failed to update component");
      });

    // ------- COMPONENTS: CREATE -------
    builder
      .addCase(SalaryComponentCreateAction.pending, (state) => {
        state.create.loading = true;
        state.create.status = "loading";
        state.create.error = "";
        state.create.created = null;
      })
      .addCase(SalaryComponentCreateAction.fulfilled, (state, action) => {
        state.create.loading = false;
        state.create.status = "success";
        state.create.error = "";
        state.create.created = action.payload?.data || null;
        toast.success(
          action.payload?.message || "Component created successfully!"
        );
      })
      .addCase(SalaryComponentCreateAction.rejected, (state, action) => {
        state.create.loading = false;
        state.create.status = "failed";
        state.create.created = null;
        state.create.error =
          action.error?.message || "Failed to create salary component";
        console.log("SalaryComponentCreate Error", action);
        toast.error(state.create.error);
      });

    // ------- TEMPLATES: GET -------
    builder
      .addCase(SalaryTemplatesGetAction.pending, (state, action) => {
        state.templates.pageNo = action?.meta?.arg?.page || 1;
        state.templates.limit = action?.meta?.arg?.limit || 10;
        state.templates.loading = true;
        state.templates.status = "loading";
        state.templates.error = "";
        state.templates.list = [];
      })
      .addCase(SalaryTemplatesGetAction.fulfilled, (state, action) => {
        state.templates.status = "success";
        state.templates.loading = false;
        state.templates.error = "";
        state.templates.list = action.payload?.data || [];
        state.templates.totalRecord = action.payload?.totalRecord || 0;
      })
      .addCase(SalaryTemplatesGetAction.rejected, (state, action) => {
        state.templates.status = "failed";
        state.templates.loading = false;
        state.templates.list = [];
        state.templates.error =
          action.error?.message || "Failed to fetch salary templates";
        toast.error(state.templates.error);
      });
    
    // ------- TEMPLATE: GET ONE -------
    builder
      .addCase(SalaryTemplateGetOneAction.pending, (state) => {
        state.template.loading = true;
        state.template.status = "loading";
        state.template.error = "";
        state.template.data = null;
      })
      .addCase(SalaryTemplateGetOneAction.fulfilled, (state, action) => {
        state.template.loading = false;
        state.template.status = "success";
        state.template.error = "";
        state.template.data = action.payload?.data || null;
      })
      .addCase(SalaryTemplateGetOneAction.rejected, (state, action) => {
        state.template.loading = false;
        state.template.status = "failed";
        state.template.error =
          action.error?.message || "Failed to fetch salary template";
        toast.error(state.template.error);
      });

    // ------- TEMPLATES: CREATE -------
    builder
      .addCase(SalaryTemplateCreateAction.pending, (state) => {
        state.createTemplate.loading = true;
        state.createTemplate.status = "loading";
        state.createTemplate.error = "";
        state.createTemplate.created = null;
      })
      .addCase(SalaryTemplateCreateAction.fulfilled, (state, action) => {
        state.createTemplate.loading = false;
        state.createTemplate.status = "success";
        state.createTemplate.error = "";
        state.createTemplate.created = action.payload?.data || null;
        toast.success(
          action.payload?.message || "Template created successfully!"
        );
      })
      .addCase(SalaryTemplateCreateAction.rejected, (state, action) => {
        state.createTemplate.loading = false;
        state.createTemplate.status = "failed";
        state.createTemplate.created = null;
        state.createTemplate.error =
          action.error?.message || "Failed to create salary template";
        console.log("SalaryTemplateCreate Error", action);
        toast.error(state.createTemplate.error);
      });

    // ------- TEMPLATE PREVIEW -------
    builder
      .addCase(SalaryTemplatePreviewAction.pending, (state) => {
        state.preview.loading = true;
        state.preview.status = "loading";
        state.preview.error = "";
        state.preview.result = null;
      })
      .addCase(SalaryTemplatePreviewAction.fulfilled, (state, action) => {
        state.preview.loading = false;
        state.preview.status = "success";
        state.preview.error = "";
        state.preview.result = action.payload?.data || null;
      })
      .addCase(SalaryTemplatePreviewAction.rejected, (state, action) => {
        state.preview.loading = false;
        state.preview.status = "failed";
        state.preview.result = null;
        state.preview.error =
          action.error?.message || "Failed to preview salary template";
        toast.error(state.preview.error);
      });
  },
});

export const {
  resetCreateState,
  resetCreateTemplateState,
  resetPreviewState,
} = SalaryReducer.actions;

export default SalaryReducer.reducer;
