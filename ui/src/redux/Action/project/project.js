import { createAsyncThunk } from "@reduxjs/toolkit";
import { addProjectApi, getProjectListApi, updateProjectApi } from "../../../apis/project/project";
import { toast } from "react-hot-toast";


export const ProjectListAction = createAsyncThunk('ProjectList', async (userCredentials) => {
      try {
        const data = await getProjectListApi(userCredentials);
        console.log('Project list Successs -->', data)
        return data;
    } catch (error) {
        console.log('Project List Error -->', error)
        throw error;
    }
});
export const ProjectCreateAction = createAsyncThunk('ProjectCreate', async (userCredentials) => {
      try {
        const data = await addProjectApi(userCredentials);
        toast.success("Project Created");
        console.log('Project Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('Project Create Error -->', error)
        throw error;
    }
});
export const ProjectUpdateAction = createAsyncThunk('ProjectUpdate', async (userCredentials) => {
      try {
        const data = await updateProjectApi(userCredentials);
        toast.success("Project Updated");
        console.log('Project Update Successs -->', data)
        return data;
    } catch (error) {
        console.log('Project Update Error -->', error)
        throw error;
    }
});

export const ProjectDeleteAction = createAsyncThunk('ProjectDelete', async (userCredentials) => {
    try{
        let body = {
            projectId: userCredentials?.projectId,
            isActive: false,
        }
        const data = await updateProjectApi(body)
        toast.success("Project Deleted");
        console.log('Project Delete Successs -->', data)
        return data;
    }catch (error){
        console.log('Project Delete Error -->', error)
        throw error;
    }
});