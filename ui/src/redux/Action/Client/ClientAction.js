import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientCreateApi, clientUpdateApi, clientListApi, clientUpdateKYCApi, clientOwnerCreateApi, clientOwnerGetApi, clientKYCCreateApi, clientKYCGetApi, clientOwnerEditApi, clientKYCEditApi, clientExcelBlukUpload, clientSampleFileDownload, clientDepartments, clientDesignations ,ClientBranchStatusUpdateApi,ClientStatusUpdateApi, ClientEmergencyContactsGetApi, ClientEmergencyContactsAddApi, ClientEmergencyContactsEditApi, ClientDefaultSettingsListApi, ClientDefaultSettingsAddApi, clientListEmpWiseApi, clientListFeildOfficerApi} from "../../../apis/Client/Client";


export const clientCreateAction = createAsyncThunk('clientCreate', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await clientCreateApi(userCredentials);
        console.log('client Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Create Error -->', error.message)
       throw rejectWithValue(error);
    }
});
export const clientListAction= createAsyncThunk('clientList', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientListApi(clientDetails);
        console.log('client Get Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Get Error -->', error)
       throw rejectWithValue(error);
    }
});
export const clientListEmpWiseAction= createAsyncThunk('clientList', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientListEmpWiseApi(clientDetails);
        console.log('client Get Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Get Error -->', error)
       throw rejectWithValue(error);
    }
});

export const clientEditAction = createAsyncThunk('clientEdit', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientUpdateApi(clientDetails);
        console.log('client Edit Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Edit Error -->', error)
       throw rejectWithValue(error);
    }
});
export const clientUpdateKYCAction = createAsyncThunk('clientKYC', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientUpdateKYCApi(clientDetails);
        console.log('client Edit KYC Successs -->', data)
        return data;
    } catch (error) {
        console.log('client EditKYC Error -->', error)
       throw rejectWithValue(error);
    }
});
export const clientOwnerCreateAction = createAsyncThunk('clientOwnerCreate', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await clientOwnerCreateApi(userCredentials);
        console.log('client Owner Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Owner Create Error -->', error.message)
       throw rejectWithValue(error);
    }
});

export const clientOwnerEditAction = createAsyncThunk('clientOwnerEdit', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await clientOwnerEditApi(userCredentials);
        console.log('client Owner Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Owner Create Error -->', error.message)
       throw rejectWithValue(error);
    }
});
export const clientOwnerGetAction = createAsyncThunk('clientOwnerGet', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await clientOwnerGetApi(userCredentials);
        console.log('client Owner Get Successs -->', data)
        return data;
    } catch (error) 
    {
        console.log('client Owner Get Error -->', error.message)
        throw rejectWithValue(error);
    }
});
export const clientKYCCreateAction = createAsyncThunk('clientKYCCreate', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await clientKYCCreateApi(userCredentials);
        console.log('client KYC Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('client KYC Create Error -->', error.message)
       throw rejectWithValue(error);
    }
});
export const clientKycGetAction = createAsyncThunk('clientKycGet', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await clientKYCGetApi(userCredentials);
        console.log('client KYC Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('client KYC Create Error -->', error.message)
       throw rejectWithValue(error);
    }
});
export const clientKycEditAction = createAsyncThunk('clientKycEdit', async(userCredentials,{rejectWithValue}) => {
    console.log(userCredentials)
    try {
        const data = await clientKYCEditApi(userCredentials);
        console.log('client KYC Edit Successs -->', data)
        return data;
    } catch (error) {
        console.log('client KYC Edit Error -->', error.message)
       throw rejectWithValue(error);
    }
});
export const clientBulkUploadAction= createAsyncThunk('clientBulkUpload', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientExcelBlukUpload(clientDetails);
        console.log('client Bulk Upload Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Bulk Upload Error -->', error)
       throw rejectWithValue(error);
    }
});

export const clientSampleFormatAction= createAsyncThunk('clientSampleFormat', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientSampleFileDownload(clientDetails);
        console.log('clientSampleFormat Upload Successs -->', data)
        return data;
    } catch (error) {
        console.log('clientSampleFormat Upload Error -->', error)
       throw rejectWithValue(error);
    }
});

export const clientDepartmentAction= createAsyncThunk('clientDepartment', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientDepartments(clientDetails);
        console.log('clientDepartment Upload Successs -->', data)
        return data;
    } catch (error) {
        console.log('clientSampleFormat Upload Error -->', error)
       throw rejectWithValue(error);
    }
});

export const clientDesignationAction= createAsyncThunk('clientDesignation', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientDesignations(clientDetails);
        console.log('clientDesignation Upload Successs -->', data)
        return data;
    } catch (error) {
        console.log('clientDesignation Upload Error -->', error)
       throw rejectWithValue(error);
    }
});
export const ClientStatusUpdateAction = createAsyncThunk('ClienthStatus', async (clientDetails,{ rejectWithValue }) => {
    console.log(clientDetails) 
    try {
        const data = await ClientStatusUpdateApi(clientDetails);
        console.log('Client Status Successs -->', data)
        return data;
    } catch (error) {
        console.log('Client Status Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 

export const ClientBranchStatusUpdateAction = createAsyncThunk('ClientBranchStatus', async (clientbranchDetails,{ rejectWithValue }) => {
    console.log(clientbranchDetails)
    try {
        const data = await ClientBranchStatusUpdateApi(clientbranchDetails);
        console.log('Client BranchStatus Successs -->', data)
        return data;
    } catch (error) {
        console.log('Client BranchStatus Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 
export const ClientEmergencyContactsAction = createAsyncThunk('ClientContacts', async (clientemergencynumbers,{ rejectWithValue }) => {
    console.log(clientemergencynumbers)
    try {
        const data = await ClientEmergencyContactsGetApi(clientemergencynumbers);
        console.log('Client EmergencyContacts Successs -->', data)
        return data;
    } catch (error) {
        console.log('Client EmergencyContacts Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 
export const ClientEmergencyContactsAddAction = createAsyncThunk('ClientContactsAdd', async (clientemergencynumbersadd,{ rejectWithValue }) => {
    console.log(clientemergencynumbersadd)
    try {
        const data = await ClientEmergencyContactsAddApi(clientemergencynumbersadd);
        console.log('Client EmergencyContactsAdd Successs -->', data)
        return data;
    } catch (error) {
        console.log('Client EmergencyContactsAdd Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 
export const ClientEmergencyContactsEditAction = createAsyncThunk('ClientContactsEdit', async (clientemergencynumbersedit,{ rejectWithValue }) => {
    console.log(clientemergencynumbersedit)
    try {
        const data = await ClientEmergencyContactsEditApi(clientemergencynumbersedit);
        console.log('Client EmergencyContactsEdit Successs -->', data)
        return data;
    } catch (error) {
        console.log('Client EmergencyContactsEdit Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 
export const ClientDefaultSettingsListAction = createAsyncThunk('ClientSettingsList', async (clientsettingslist,{ rejectWithValue }) => {
    console.log(clientsettingslist)
    try {
        const data = await ClientDefaultSettingsListApi(clientsettingslist);
        console.log('Client Setting List Successs -->', data)
        return data;
    } catch (error) {
        console.log('Client Setting List Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 
export const ClientDefaultSettingsAddAction = createAsyncThunk('ClientSettingsadd', async (clientsettingsadd,{ rejectWithValue }) => {
    console.log(clientsettingsadd)
    try {
        const data = await ClientDefaultSettingsAddApi(clientsettingsadd);
        console.log('Client Setting Add Successs -->', data)
        return data;
    } catch (error) {
        console.log('Client Setting Add Error -->', error)
        return rejectWithValue(error || { message: 'Unknown error occurred' });
    }
}); 
export const clientListwithFeildOfficerAction= createAsyncThunk('clientListwithFeildOfficer', async (clientDetails,{rejectWithValue}) => {
    console.log(clientDetails)
    try {
        const data = await clientListFeildOfficerApi(clientDetails);
        console.log('client Get Successs -->', data)
        return data;
    } catch (error) {
        console.log('client Get Error -->', error)
       throw rejectWithValue(error);
    }
});