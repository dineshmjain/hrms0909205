import * as express from 'express';
import  * as language from '../controllers/language/language.js'
import * as apiResponse from '../helper/apiResponse.js'
const router = express.Router();

// DOWNLOAD SELECTED LANGUAGE
router.get('/download', language.downloadSelectedLanguage)

// UPDATE SELECTED LANGUAGE
router.post('/upload', 
    language.uploadSelectedLanguage,
    (request, response, next)=>{
        return apiResponse.successResponse(response, "File uploaded successfully!")
    }
)

export default router;