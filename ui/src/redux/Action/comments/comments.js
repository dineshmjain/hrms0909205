import { createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { addComment, addCommentWithFile, deleteComment, editComment, getCommentList } from "../../../apis/Comments/comments";


export const CommentListAction = createAsyncThunk('CommentList', async (userCredentials) => {
    try {
        const data = await getCommentList(userCredentials);
        console.log('Comment list Successs -->', data)
        return data;
    } catch (error) {
        console.log('Comment List Error -->', error)
        throw error;
    }
});
export const CommentCreateAction = createAsyncThunk('CommentCreate', async (userCredentials) => {
    try {
        const data = await addCommentWithFile(userCredentials);
        toast.success("Comment Created");
        console.log('Comment Create Successs -->', data)
        return data;
    } catch (error) {
        console.log('Comment Create Error -->', error)
        throw error;
    }
});

export const CommentDeleteAction = createAsyncThunk('CommentDelete', async (userCredentials) => {
    try {
        const data = await deleteComment(userCredentials);
        toast.success("Comment Deleted");
        console.log('Comment Delete Successs -->', data)
        return data;
    } catch (error) {
        console.log('Comment Delete Error -->', error)
        throw error;
    }
}
);

export const CommentEditAction = createAsyncThunk('CommentEdit', async (userCredentials) => {
    try {
        const data = await editComment(userCredentials);
        toast.success("Comment Edited");
        console.log('Comment Edit Successs -->', data)
        return data;
    } catch (error) {
        console.log('Comment Edit Error -->', error)
        throw error;
    }
}
);