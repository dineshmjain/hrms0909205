import { createAsyncThunk } from "@reduxjs/toolkit";
import { createRoleApi, getRoleApi } from "../../../apis/Role/Role";

export const RoleCreateAction = createAsyncThunk('RoleCreate', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await createRoleApi(userCredentials);
        console.log('RoleCreate Successs -->', data)
        return data;
    } catch (error) {
        console.log('RoleCreate Error -->', error.message)
         return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
    }
});
export const RoleGetAction = createAsyncThunk('RolesGet', async (userCredentials, { rejectWithValue }) => {
    console.log(userCredentials)
    try {
        const data = await getRoleApi(userCredentials);
        console.log('RoleGet Successs -->', data)
        return data;
    } catch (error) {
        console.log('RoleGet Error -->', error.message)
         return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
});
// export const RoleGetAction= createAsyncThunk('RoleList', async (RoleDetails) => {
//     console.log(RoleDetails)
//     try {
//         const data = await (RoleDetails);
//         console.log('RoleGet Successs -->', data)
//         return data;
//     } catch (error) {
//         console.log('RoleGet Error -->', error)
//          return rejectWithValue(error?.response?.data || { message: 'Unknown error occurred' });
//     }
// });