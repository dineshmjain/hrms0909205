import axiosInstance from "../../config/axiosInstance";


export const clientBranchListApi = async (reqbody) => {
    try {
        const response = await axiosInstance.post(`client/branch/list`, reqbody);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const clientBranchAddApi = async (reqbody) => {
    try {
        const response = await axiosInstance.post(`client/branch/add`, reqbody);
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error.response.data || error.message;
    }
};
export const ClientGetBranchRequirementApi = async (clientGetRequirements) => {
  try {
    console.log(
      clientGetRequirements,
      "<==========sent to api"
    );
    const response = await axiosInstance.post(
      `settings/client/report/time`,
      clientGetRequirements
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }
};

export const updateClientRequirementById =async(clientRequirement)=>{
    try {
    console.log(
      clientRequirement,
      "<==========sent to api"
    );
    const response = await axiosInstance.post(
      `settings/client/report/time`,
      clientRequirement
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response.data || error.message;
  }

}
