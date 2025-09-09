
import { createAsyncThunk } from "@reduxjs/toolkit";
import { uploadMediaApi } from "../../../apis/Media/mediaApi";


export const MediaUploadAction = createAsyncThunk('MediaUpload', async (userCredentials) => {
    try {
        const data = await uploadMediaApi(userCredentials);
        console.log('Media Upload Successs -->', data)
        return data;
    } catch (error) {
        console.log('Media Upload Error -->', error)
        throw error;
    }
});