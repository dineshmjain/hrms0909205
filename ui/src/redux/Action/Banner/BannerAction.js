import { createAsyncThunk } from "@reduxjs/toolkit";
import { BannerGetApi } from "../../../apis/Banner/Banner";


export const BannerGetListAction = createAsyncThunk(
  "BannerGet",
  async (bannerGetCredentials, { rejectWithValue }) => {
    try {
      const data = await BannerGetApi(bannerGetCredentials);
      console.log("Banner Success -->", data);
      return data;
    } catch (error) {
      console.log("Banner create Error -->", error);
      return rejectWithValue(
        error?.response || error || { message: "Unknown error occurred" }
      );
    }
  }
);