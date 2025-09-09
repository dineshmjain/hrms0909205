import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { addTaskApi, getTaskListApi, updateTaskApi } from "../../../apis/task/task";
import { getSubTaskListApi, updateSubtaskApi } from "../../../apis/task/subtask";


export const TaskListAction = createAsyncThunk('TaskList', async (userCredentials) => {
    try {
        const data = await getTaskListApi(userCredentials);
        console.log('Task list Successs -->', data)
        return data;
    } catch (error) {
        console.log('Task List Error -->', error)
        throw error;
    }
});

export const TaskCreateAction = createAsyncThunk('TaskCreate', async (userCredentials, { rejectWithValue }) => {
    try {
        const data = await addTaskApi(userCredentials);
        toast.success("Task Created");
        console.log('Task Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('Task Create Error -->', error)
        throw error
    }
});
export const TaskUpdateAction = createAsyncThunk('TaskUpdate', async (userCredentials) => {
    try {
        const data = await updateTaskApi(userCredentials);
        toast.success("Task Updated");
        console.log('Task Update Successs -->', data)
        return data;
    } catch (error) {
        console.log('Task Update Error -->', error)
        throw error;
    }
});

export const TaskDeleteAction = createAsyncThunk('TaskDelete', async (userCredentials) => {
    try {
        let body = {
            query: userCredentials._id,
            reqbody: { isActive: false, projectId: userCredentials?.projectId }
        }
        const data = await updateTaskApi(body);
        toast.success("Task deleted Successfully");
        return data;
    } catch (error) {
        console.log("Task Delete Error -->", error);
        throw error;
    }
});
export const SubTaskListAction = createAsyncThunk('SubTaskList', async (userCredentials) => {
    try {
        const data = await getSubTaskListApi(userCredentials);
        console.log('SubTask list Successs -->', data)
        return data;
    } catch (error) {
        console.log('SubTask List Error -->', error)
        throw error;
    }
});

export const SubTaskUpdateAction = createAsyncThunk('SubTaskUpdate', async (userCredentials) => {
    try {
        const data = await updateSubtaskApi(userCredentials);
        // toast.success("Subtask Updated");
        console.log('Subtask Update Successs -->', data)
        return data;
    } catch (error) {
        console.log('Subtask Update Error -->', error)
        throw error;
    }
});

export const SubTaskDeleteAction = createAsyncThunk('SubTaskDelete', async (userCredentials) => {
    try {
        let body = {
            query: userCredentials._id,
            reqbody: { isActive: false, taskId: userCredentials?.taskId }
        }
        const data = await updateSubtaskApi(body);
        toast.success("Subtask deleted Successfully");
        return data;
    } catch (error) {
        console.log("Subtask Delete Error -->", error);
        throw error;
    }
});