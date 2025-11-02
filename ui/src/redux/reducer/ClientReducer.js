import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import toast from "react-hot-toast";
import {
  clientBulkUploadAction,
  clientCreateAction,
  clientDepartmentAction,
  clientDesignationAction,
  clientEditAction,
  clientListAction,
  clientUpdateKYCAction,
  clientOwnerCreateAction,
  clientOwnerEditAction,
  clientOwnerGetAction,
  clientSampleFormatAction,
  ClientBranchStatusUpdateAction,
  ClientStatusUpdateAction,
  ClientEmergencyContactsAction,
  ClientEmergencyContactsAddAction,
  ClientEmergencyContactsEditAction,
  ClientDefaultSettingsListAction,
  ClientDefaultSettingsAddAction,
  clientListEmpWiseAction,
  clientListwithFeildOfficerAction
} from "../Action/Client/ClientAction";
const initialState = {
  clientList: [],
  clientEmpWise: [],
  loading: false,
  status: "idle",
  error: "",
  errorMessage: "",
  totalRecord: 0,
  pageNo: 1,
  limit: 10,
  clientBranchDepartemnt: [],
  clientCreate: {},
  clientBulkCreate: [],
  ownerDetails: {},
  clientDepartments: [],
  clientDesignations: [],
  clientEmergencyContactList: [],
  clientDefaultSettings: []
};

const ClientReducer = createSlice({
  name: "client",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(clientListAction.pending, (state, action) => {
        // Avoid redundant calls by checking the status and existing data
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(clientListAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.totalRecord;
        console.log("Branch list:", action.payload.data);
        // toast.success(
        //   action.payload.message || "Branch data loaded successfully!"
        // );
      })
      .addCase(clientListAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.clientList = [];
        state.loading = false;
        console.log("desigantion Error rejected-->", action.error);

        toast.error(
          action.error.message ||
          "Failed to load branch data. Please try again."
        );
      });

    //create client
    builder
      .addCase(clientCreateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(clientCreateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientCreate = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("Desg Create :", action);
        toast.success(action.payload.message);
      })
      .addCase(clientCreateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Deg Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    //bulk upload client
    builder
      .addCase(clientBulkUploadAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(clientBulkUploadAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientBulkCreate = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("Client bulk Create :", action);
        toast.success(action.payload.message);
      })
      .addCase(clientBulkUploadAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Deg Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    //sample download fileFormat
    builder
      .addCase(clientSampleFormatAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(clientSampleFormatAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.sampleFilePath = action?.payload || {}; // Ensure this is the correct path to the data
        console.log("Client bulk Create :", action);
        toast.success("Sample File Downloaded Successfully");
      })
      .addCase(clientSampleFormatAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Failed to download File";

        state.error = validationMessage;
        console.log("sample File Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });

    //client owner get details
    builder
      .addCase(clientOwnerGetAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(clientOwnerGetAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.ownerDetails = action?.payload?.data;
        console.log("Desg Create :", action);
        toast.success(action.payload.message);
      })
      .addCase(clientOwnerGetAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Owner Get Error:", validationMessage);

        //  Don't show toast if it's just "No Data found"
        if (validationMessage !== "No Data found") {
          toast.error(validationMessage);
        }
      });
    //client owner edit

    builder
      .addCase(clientOwnerEditAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(clientOwnerEditAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.ownerDetails = action?.payload?.data;
        console.log("Desg Create :", action);
        console.log("clientOwnerEditAction toast");
        toast.success(action.payload.message);
      })
      .addCase(clientOwnerEditAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Deg Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });

    // client owner edit

    builder
      .addCase(clientEditAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(clientEditAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        // state.ownerDetails=action?.payload?.data
        // console.log("Desg Create :", action);
        console.log("clientEditAction toast");
        toast.success(action.payload.message);
      })
      .addCase(clientEditAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Deg Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    //departments
    builder
      .addCase(clientDepartmentAction.pending, (state) => {
        // Avoid redundant calls by checking the status and existing data
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(clientDepartmentAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientDepartments = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.totalRecord;
        console.log("Branch list:", action.payload.data);
        // toast.success(action.payload.message || 'Branch data loaded successfully!');
      })
      .addCase(clientDepartmentAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.clientDepartments = [];
        state.loading = false;
        console.log("desigantion Error rejected-->", action.error);

        // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
      });

    //designations
    builder
      .addCase(clientDesignationAction.pending, (state) => {
        // Avoid redundant calls by checking the status and existing data
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(clientDesignationAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientDesignations = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.totalRecord;
        console.log("Branch list:", action.payload.data);
        // toast.success(action.payload.message || 'Branch data loaded successfully!');
      })
      .addCase(clientDesignationAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.clientDesignations = [];
        state.loading = false;
        console.log("desigantion Error rejected-->", action.error);

        // toast.error(action.error.message || 'Failed to load branch data. Please try again.');
      });
    builder
      .addCase(ClientBranchStatusUpdateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(ClientBranchStatusUpdateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientCreate = action?.payload?.data || {}; // Ensure this is the correct path to the data

        toast.success(action.payload.message);
      })
      .addCase(ClientBranchStatusUpdateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    builder
      .addCase(ClientStatusUpdateAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(ClientStatusUpdateAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientCreate = action?.payload?.data || {}; // Ensure this is the correct path to the data

        toast.success(action.payload.message);
      })
      .addCase(ClientStatusUpdateAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    builder
      .addCase(ClientEmergencyContactsAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(ClientEmergencyContactsAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientEmergencyContactList = action?.payload?.data?.contacts || []; // Ensure this is the correct path to the data

        // toast.success(action.payload.message);
      })
      .addCase(ClientEmergencyContactsAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        state.clientEmergencyContactList = []
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    builder
      .addCase(ClientEmergencyContactsAddAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(ClientEmergencyContactsAddAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(ClientEmergencyContactsAddAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    builder
      .addCase(ClientEmergencyContactsEditAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(ClientEmergencyContactsEditAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(ClientEmergencyContactsEditAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    builder
      .addCase(ClientDefaultSettingsAddAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(ClientDefaultSettingsAddAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(ClientDefaultSettingsAddAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;

        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Branch Create Error:", backendError?.validation?.body);

        toast.error(validationMessage);
      });
    builder
      .addCase(ClientDefaultSettingsListAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(ClientDefaultSettingsListAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientDefaultSettings = action?.payload?.data || {}; // Ensure this is the correct path to the data

        // toast.success(action.payload.message);
      })
      .addCase(ClientDefaultSettingsListAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        state.clientDefaultSettings = {}
        // Safe access to validation message
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";

        state.error = validationMessage;
        console.log("Branch Create Error:", backendError?.validation?.body);

        // toast.error(validationMessage);
      });
    builder
      .addCase(clientListwithFeildOfficerAction.pending, (state, action) => {
        // Avoid redundant calls by checking the status and existing data
        state.pageNo = action?.meta?.arg?.page || 1;
        state.limit = action?.meta?.arg?.limit || 10;
        state.status = "loading";
        state.error = "";
        state.loading = true;
      })
      .addCase(clientListwithFeildOfficerAction.fulfilled, (state, action) => {
        console.log("Full payload:", action.payload); // Debug the payload structure
        state.status = "success";
        state.error = "";
        state.loading = false;
        state.clientList = action.payload?.data || []; // Ensure correct path to data and handle empty cases
        state.totalRecord = action.payload?.totalRecord;
        console.log("Branch list:", action.payload.data);
        // toast.success(
        //   action.payload.message || "Branch data loaded successfully!"
        // );
      })
      .addCase(clientListwithFeildOfficerAction.rejected, (state, action) => {
        toast.dismiss();
        console.log("Action failed:", action);
        state.status = "failed";
        state.error = action.error.message;
        state.clientList = [];
        state.loading = false;
        console.log("desigantion Error rejected-->", action.error);

        toast.error(
          action.error.message ||
          "Failed to load branch data. Please try again."
        );
      });
       

    builder
      .addCase(clientUpdateKYCAction.pending, (state) => {
        state.status = "loading";
        state.error = false;
        state.loading = true;
      })
      .addCase(clientUpdateKYCAction.fulfilled, (state, action) => {
        console.log("Full payload:", action?.payload); // Check the structure of the payload
        state.status = "success";
        state.error = "";
        state.loading = false;
        toast.success(action.payload.message);
      })
      .addCase(clientUpdateKYCAction.rejected, (state, action) => {
        toast.dismiss();
        state.status = "failed";
        state.loading = false;
        const backendError =
          action.error?.response?.data || action.payload || action.error;
        const validationMessage =
          backendError?.validation?.body?.message ||
          backendError?.message ||
          "Something went wrong";
        state.error = validationMessage;
        toast.error(validationMessage);
      });
  },

});
export default ClientReducer.reducer;
