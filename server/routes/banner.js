import { Router } from 'express'
import * as banner from '../controllers/banner/banner.js';
import * as apiResponse  from '../helper/apiResponse.js';
import * as user from '../controllers/user/user.js'
import * as auth from '../controllers/auth/auth.js';
import * as image from '../controllers/image/image.js'
import fs from "fs";
import path from "path";
import {fileURLToPath} from 'url';
import {celebrate} from 'celebrate';
import {validation} from '../helper/validationSchema.js';
const router = Router()


// router.use((request,response,next)=>{
//     console.log('\nbranch middleware');
//     console.log(request.originalUrl)
//     request.body.endpoint = request.originalUrl
//     console.log('-------------------------------------------------------');
//     return next();
//  })

router.post('/add',
    // celebrate(validation.addBanner),
    (request, response, next) => {
        const rootDir = process.cwd();
        const folderPath = `/assets/images/banner`;
        const fullFolderPath = path.join(rootDir,folderPath);
        request.body.folderPath = fullFolderPath
        if (!fs.existsSync(fullFolderPath)) {
            fs.mkdirSync(fullFolderPath, { recursive: true });
        }
        request.body.dbfolderPath = `/images/banner/`
        return next()
    },
    auth.isAuth,
    user.isUserValid,
    image.uploadImage,
    banner.addBanner,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Banner added successfully")
    }
)


router.post('/get',
    auth.isAuth,
    user.isUserValid,
    banner.getBanner
)


router.post('/update/order',
    auth.isAuth,
    user.isUserValid,
    banner.updateBannerOrder,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Banner order updated successfully")
    }
)

router.post('/delete',
    auth.isAuth,
    user.isUserValid,
    banner.isBannerValid,
    banner.deleteBanner,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Banner Deleted successfully")
    }
)

router.post('/update',
    auth.isAuth,
    user.isUserValid,
    banner.isBannerValid,
    (request,response,next)=>{
        if (request.files?.file === undefined || request.files?.file === null || !request.files.file) {
            request.body.skip=true
            return next()
        }
        return next()
    },
    banner.update,
    // banner.deleteBanner,
    (request, response, next) => {
        const rootDir = process.cwd();
        const folderPath = `/assets/images/banner`;
        const fullFolderPath = path.join(rootDir,folderPath);
        request.body.folderPath = fullFolderPath
        if (!fs.existsSync(fullFolderPath)) {
            fs.mkdirSync(fullFolderPath, { recursive: true });
        }
        request.body.dbfolderPath = `/images/banner/`
        return next()
    },
    image.uploadImage,
    // banner.addBanner,
    banner.updateBanner,
    (request, response, next) => {
        return apiResponse.successResponse(response, "Banner updated successfully")
    }
)

export default router;
