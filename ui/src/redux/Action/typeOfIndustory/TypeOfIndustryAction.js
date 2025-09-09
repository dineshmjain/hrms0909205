import { createAsyncThunk } from "@reduxjs/toolkit";
import { typeOfIndustryApi } from "../../../apis/Global/Global";

export const GetTypeOfIndustry= createAsyncThunk('IndustryType', async (typeDetails) => {
    console.log(typeDetails)
    try {
        const data = await typeOfIndustryApi(typeDetails);
        console.log('type Successs -->', data)
        return data;
    } catch (error) {
        console.log('type Error -->', error)
        throw error;
    }
});