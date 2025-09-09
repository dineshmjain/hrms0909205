import {Router} from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as upload from '../controllers/upload/upload.js';
import * as apiResponse from '../helper/apiResponse.js';
import * as user from '../controllers/user/user.js';
const router= Router()



// uploading documents files

router.post('/attachment',
    auth.isAuth,
    user.isUserValid,
    upload.uploadAttachment,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "uploaded  successfully!",  request.body.attachmentPath)
    }
)

// uploading images
router.post('/image',
    auth.isAuth,
     user.isUserValid,
    upload.uploadImages,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "uploaded  successfully!",  request.body.imagePath)
    }
)

// upload audio
router.post('/audio',
    auth.isAuth,
    user.isUserValid,
    upload.uploadAudio,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "uploaded  successfully!",  request.body.audioPath)
    }
)


// upload video
router.post('/video',
    auth.isAuth,
     user.isUserValid,
    upload.uploadVideo,
    (request, response) => {
        return apiResponse.successResponseWithData(response, "uploaded  successfully!", request.body.videoPath)
    }
)


export default router;