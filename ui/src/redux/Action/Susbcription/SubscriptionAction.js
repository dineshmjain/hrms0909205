import { createAsyncThunk } from "@reduxjs/toolkit";
import { PlansGetActiveListApi } from "../../../apis/Subscription/Subscription";


export const PlansGetActiveListAction = createAsyncThunk(
  "PlansGetActiveList",
  async (plansGet, { rejectWithValue }) => {
    try {
      const data = await PlansGetActiveListApi(plansGet);
      console.log("Plans get Success -->", data);
      return data;
    } catch (error) {
      console.log("Plans Get Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);