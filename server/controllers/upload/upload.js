import moment from 'moment';
import * as apiResponse from '../../helper/apiResponse.js';
import { logger } from '../../helper/logger.js';
import path from 'path';
import fs from 'fs';



export const uploadAttachment = async (request, response,next) => {
    try {
        const ALLOWED_DOCUMENT_MIME_TYPES = [
            "application/pdf",
            "application/msword",                                // .doc
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
            "application/vnd.ms-excel",                          // .xls
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
            "application/vnd.ms-powerpoint",                     // .ppt
            "application/vnd.openxmlformats-officedocument.presentationml.presentation", // .pptx
            "text/plain",                                         // .txt
            "text/csv",                                           // .csv
        ];
        

        if (!request.files || Object.keys(request.files).length === 0) {
            return apiResponse.validationError(response,'No files attached,please add attachment files.')
        }

        let files = request.files?.file;

        
        
        // Ensure `files` is an array for consistent processing
        if (!Array.isArray(files)) {
            files = [files]; // Convert single file into an array
        }

        // Ensure the assets directory exists assets/organisation/files
        // const folderPath = `assets/organisation/${parentFolderPath}/${subFolderPath}`;
        // const folderPath = `assets/organisation/orgId${orgId}/SoftWareId${+SoftWareId}/userId${+userId}`;
        const folderPath = `assets/task/attachment`;
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        let uploadedFiles = [];

        // Process each file
        for (const file of files) {
            const type = file.mimetype;
            if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(type)) {
                return apiResponse.validationError(response, `File type ${type} is not allowed.`);
            }
            const extension = path.extname(file.name);
            const fileName = `${request.body.user._id}_${moment().format('YYYYMMDDHHmmss')}${extension}`;

            await file.mv(`${folderPath}/${fileName}`);

            const filePath = `/attachment/${fileName}`;
            uploadedFiles.push({ filePath });
        }

        request.body.attachmentPath=uploadedFiles 
      
        return next()
        // return apiResponse.successResponseWithData(
        //     response, 
        //     'Files uploaded successfully', 
        //     { files: uploadedFiles }
        // );

    } catch (error) {
        console.error("Error in uploadAttachment controller:", error);
        return apiResponse.somethingResponse(response, error?.message);
    }

};


export const uploadImages= async (request, response,next) => {
    try {
        const ALLOWED_IMAGE_MIME_TYPES = [
            "image/png",    // .png
            "image/jpeg",   // .jpeg, .jpg
            "image/jpg",    // .jpg
            "image/gif",    // .gif
            "image/webp",   // .webp
            "image/svg+xml" // .svg
        ];

        if (!request.files || Object.keys(request.files).length === 0) {
            return apiResponse.validationError(response,'No files attached,please add attachment files.')
        }

        let files = request.files?.file;

        
        
        // Ensure `files` is an array for consistent processing
        if (!Array.isArray(files)) {
            files = [files]; // Convert single file into an array
        }

    
        const folderPath = `assets/hrms/image`;
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        let uploadedFiles = [];

        // Process each file
        for (const file of files) {
            const type = file.mimetype;
            if (!ALLOWED_IMAGE_MIME_TYPES.includes(type)) {
                return apiResponse.validationError(response, `File type ${type} is not allowed.`);
            }
            const extension = path.extname(file.name);
            const fileName = `${request.body.user._id}_${moment().format('YYYYMMDDHHmmss')}${extension}`;

            await file.mv(`${folderPath}/${fileName}`);

            // const filePath = `/image/${fileName}`;
            const filePath=`/api/v1/attendance/image/${fileName}`;
            uploadedFiles.push({ filePath });
        }
        request.body.imagePath=uploadedFiles 
        return next()
    } catch (error) {
        console.error("Error in uploadImages controller:", error);
        return apiResponse.somethingResponse(response, error?.message);
    }
};


export const uploadAudio= async (request, response,next) => {
    try {
        const ALLOWED_AUDIO_MIME_TYPES = [
            "audio/mpeg",     // .mp3
            "audio/wav",      // .wav (common)
            "audio/x-wav",    // .wav (variation)
            "audio/wave",     // .wav (some systems use this MIME type)
            "audio/ogg",      // .ogg
            "audio/webm",     // .webm
            "audio/x-aac",    // .aac
            "audio/mp4",      // .m4a
            "audio/flac"      // .flac
        ];

        if (!request.files || Object.keys(request.files).length === 0) {
            return apiResponse.validationError(response,'No files attached,please add attachment files.')
        }

        let files = request.files?.file;

        
        
        // Ensure `files` is an array for consistent processing
        if (!Array.isArray(files)) {
            files = [files]; // Convert single file into an array
        }

    
        const folderPath = `assets/task/audio`;
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        let uploadedFiles = [];

        // Process each file
        for (const file of files) {
            const type = file.mimetype;
            if (!ALLOWED_AUDIO_MIME_TYPES.includes(type)) {
                return apiResponse.validationError(response, `File type ${type} is not allowed.`);
            }
            const extension = path.extname(file.name);
            const fileName = `${request.body.user._id}_${moment().format('YYYYMMDDHHmmss')}${extension}`;

            await file.mv(`${folderPath}/${fileName}`);

            const filePath = `/audio/${fileName}`;
            uploadedFiles.push({ filePath });
        }
        request.body.audioPath=uploadedFiles 
        return next()
    } catch (error) {
        console.error("Error in uploadAudio controller:", error);
        return apiResponse.somethingResponse(response, error?.message);
    }
};

// upload videos
export const uploadVideo= async (request, response,next) => {
    try {
        const ALLOWED_VIDEO_MIME_TYPES = [
            "video/mp4",        // .mp4
            "video/mpeg",       // .mpeg, .mpg
            "video/quicktime",  // .mov
            "video/x-msvideo",  // .avi
            "video/x-matroska", // .mkv
            "video/webm",       // .webm
            "video/ogg",        // .ogv
            "application/x-mpegURL", // .m3u8 (HLS)
            "video/3gpp",       // .3gp
            "video/3gpp2" ,      // .3g2
            "video/3gpp",     // .3gp - used in older Android/iOS recordings
            "video/3gpp2",    // .3g2 - similar to .3gp, used by CDMA networks
            "application/x-mpegURL" // .m3u8 - for HLS streaming playlists
        ];
        

        if (!request.files || Object.keys(request.files).length === 0) {
            return apiResponse.validationError(response,'No files attached,please add attachment files.')
        }

        let files = request.files?.file;

        
        
        // Ensure `files` is an array for consistent processing
        if (!Array.isArray(files)) {
            files = [files]; // Convert single file into an array
        }

    
        const folderPath = `assets/task/video`;
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        let uploadedFiles = [];

        // Process each file
        for (const file of files) {
            const type = file.mimetype;
            if (!ALLOWED_VIDEO_MIME_TYPES.includes(type)) {
                return apiResponse.validationError(response, `File type ${type} is not allowed.`);
            }
            const extension = path.extname(file.name);
            const fileName = `${request.body.user._id}_${moment().format('YYYYMMDDHHmmss')}${extension}`;

            await file.mv(`${folderPath}/${fileName}`);

            const filePath = `/video/${fileName}`;
            uploadedFiles.push({ filePath });
        }
        request.body.videoPath=uploadedFiles 
        return next()
    } catch (error) {
        console.error("Error in uploadVideo controller:", error);
        return apiResponse.somethingResponse(response, error?.message);
    }
};
