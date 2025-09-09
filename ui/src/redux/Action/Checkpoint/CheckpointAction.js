import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { createCheckPointApi, getCheckPointApi, updateCheckPointApi } from "../../../apis/checkpoint/checkpointApi";


export const checkPointListAction = createAsyncThunk('checkPointList', async (userCredentials) => {
    try {
        const data = await getCheckPointApi(userCredentials);
        console.log('checkPoint list Successs -->', data)
        return data;
    } catch (error) {
        console.log('checkPoint List Error -->', error)
        throw error;
    }
});
export const checkPointCreateAction = createAsyncThunk('checkPointCreate', async (userCredentials) => {
    try {
        const data = await createCheckPointApi(userCredentials);
        toast.success("checkPoint Created");
        console.log('checkPoint Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('checkPoint Create Error -->', error)
        throw error;
    }
});

export const checkPointupdateAction = createAsyncThunk('checkPointUpdate', async (userCredentials) => {
    try {
        const data = await updateCheckPointApi(userCredentials);
        toast.success("checkPoint updated");
        // console.log('checkPoint update Successs -->', data)
        return data;
    } catch (error) {
        // console.log('checkPoint update Error -->', error)
        throw error;
    }
}
);

