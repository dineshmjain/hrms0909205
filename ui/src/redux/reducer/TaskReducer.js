import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { SubTaskListAction, SubTaskUpdateAction, TaskCreateAction, TaskDeleteAction, TaskListAction, TaskUpdateAction } from "../Action/task/taskAction";
import moment from "moment";

const initialState = {
    task: [],
    totalRecord: 0,
    pageNo: 1,
    limit: 10,
    loading: false,
    error: null,
};


const TaskInitialData = {
    name: "Task 1",
    startDate: "",
    endDate: "",
    description: "Task description",
    assignedTo: [],
    status: "pending",
    priority: "high",
    subTaskData: [
        {
            name: "Sub task #1",
            description: "Task description",
            assignedTo: [],
            dueBy: "",
            priority: "high",
            taskType: "oneTime",
            status: "pending",
        },
    ],
}

const SubtaskInitialData = {
    name: "Sub task #1",
    assignedTo: [],
    dueBy: "",
    priority: "high",
    description: "description",
    taskType: "oneTime",
    status: "pending",
}


const taskReducer = createSlice({
    name: "task",
    initialState,
    reducers: {
        emptyTask: (state) => {
            state.task = [];
        },
        addTask: (state, action) => {
            state.task.push(TaskInitialData);
        },
        updateTask: (state, action) => {
            const { idx, changes } = action.payload;

            state.task[idx] = {
                ...state.task[idx], // Preserve existing fields
                ...changes, // Apply only changed fields
            }

        },
        deleteTask: (state, action) => {
            state.task = state.task.filter((task, index) => index !== action.payload);
        },

    },
    extraReducers: (builder) => {
        builder.addCase(TaskListAction.pending, (state, action) => {
            state.pageNo = action?.meta?.arg?.page || 1
            state.limit = action?.meta?.arg?.limit || 10

            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(TaskListAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            let temp = action.payload?.data?.data?.map((task) => {
                let assignedTo = task?.assignToUserId?.map((member) => {
                    let { userId, ...rest } = member;
                    return { ...rest, type: "emp", _id: member?.userId };
                });
                let endDate = moment(task?.endDate).format("YYYY-MM-DD");
                let startDate = moment(task?.startDate).format("YYYY-MM-DD");
                return { ...task, assignedTo, endDate, startDate };
            });
            // console.log(temp);
            state.totalRecord = action?.payload?.data?.totalRecord || 0
            state.task = temp;
            state.loading = false;
        });
        builder.addCase(TaskListAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Store error message
            toast.error(`Error loading task: ${state.error}`); // Display error toast
        });
        builder.addCase(TaskCreateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(TaskCreateAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(TaskCreateAction.rejected, (state, action) => {
            console.log(action.error);
            state.loading = false;
            state.error = action.error.message; // Store error message
            toast.error(`Error creating task: ${state.error}`); // Display error toast
        });
        builder.addCase(TaskUpdateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(TaskUpdateAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(TaskUpdateAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Store error message
            toast.error(`Error updating task: ${state.error}`); // Display error toast
        });
        builder.addCase(TaskDeleteAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(TaskDeleteAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(TaskDeleteAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Store error message
            toast.error(`Error delete task: ${state.error}`); // Display error toast
        });
        builder.addCase(SubTaskListAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(SubTaskListAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(SubTaskListAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Store error message
            toast.error(`Error fetching subtask: ${state.error}`); // Display error toast
        });
        builder.addCase(SubTaskUpdateAction.pending, (state) => {
            state.loading = true;
            state.error = null; // Reset error on new request
        });
        builder.addCase(SubTaskUpdateAction.fulfilled, (state, action) => {
            // console.log(action?.payload);
            state.loading = false;
        });
        builder.addCase(SubTaskUpdateAction.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message; // Store error message
            toast.error(`Error updating subtask: ${state.error}`); // Display error toast
        });
    }
})

export const { addTask, emptyTask, updateTask, deleteTask } = taskReducer.actions;

export default taskReducer.reducer;