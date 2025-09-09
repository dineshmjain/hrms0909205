import axiosInstance from "../../config/axiosInstance";
import { getParamsFromObject, removeEmptyStrings } from "../../constants/reusableFun";

export const BranchCreateApi = async (userCredentials) => {
    try {
        const response = await axiosInstance.post("branch/add", userCredentials);
        console.log(response.data);
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const BranchGetApi = async (branchDetails) => {
    const {orgIds,...rest}=branchDetails

    console.log('final Params',rest)
    const params = getParamsFromObject(removeEmptyStrings({...rest,subOrgId:orgIds ? orgIds :branchDetails?.subOrgId }) ??{})
    console.log('final Params',params)
    try {
        const response = await axiosInstance.post(`branch/list${params}`)
        // const response = await axiosInstance.post('branch/list', branchDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};

// export const BranchGetApi = async (branchDetails) => {
//     try {
//         const response = await axiosInstance.post(`branch/list?limit=${branchDetails?.limit}&page=${branchDetails?.page}`, branchDetails);
//         console.log(response.data)
//         console.log(response?.data.length,'api called')
//         return response.data;
//     } catch (error) {
//         throw error.response.data || error.message;
//     }
// };
export const BranchEditApi = async (branchDetails) => {
    try {
        const response = await axiosInstance.post(`branch/edit/${branchDetails?.id}`, { ...branchDetails });
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error)
        throw error.response.data || error.message;
    }
};


export const BranchStatusUpdateApi = async (branchDetails) => {
    try {
        console.log(branchDetails, "<=========================================sent to api")
        const response = await axiosInstance.post(`branch/update/status`, branchDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error)
        throw error.response.data || error.message;
    }
};

export const branchKYCCreateApi = async (branchDetails) => {



    try {
        console.log(branchDetails, "<=========================================sent to api")
        const response = await axiosInstance.post(`client/add/kyc`, branchDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error)
        throw error.response.data || error.message;
    }
}

export const branchKYCGetApi =async (branchDetails)=>{
  
   console.log(branchDetails,"<=========================================sent to api")

     try {
     
        const response = await axiosInstance.post(`client/get/kyc`,branchDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {

        console.log(error)
        throw error.response.data || error.message;
    }
}

export const branchRadiusGetApi = async (branchDetails) => {
    try {
        const response = await axiosInstance.post(`branch/radius/get`, branchDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}

export const branchRadiusUpdateApi = async (branchDetails) => {
    try {
        const response = await axiosInstance.post(`branch/radius/update`, branchDetails);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
}
