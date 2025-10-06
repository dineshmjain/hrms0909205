
import * as express from 'express';
import * as biometricAuth from '../controllers/biometric/auth.js';
import * as device from '../controllers/biometric/devices.js';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as apiResponse from '../helper/apiResponse.js';

const router = express.Router();
router.use((request, response, next) => {
    console.log('\nmessage middleware');
    console.log(request.originalUrl)
    //request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
})

router.use('/devices/get', auth.isAuth,user.isUserValid, biometricAuth.getDeviceToken, device.DeviceList, (request, response) => {
    return apiResponse.successResponse(response, "Device list retrieved successfully", {
        devices: request.body.deviceList
    });
})

router.use('/devices/add', auth.isAuth, user.isUserValid, biometricAuth.getDeviceToken, device.DeviceAdd, (request, response) => {
    return apiResponse.successResponse(response, "Device added successfully", {
        devices: request.body.deviceList
    });
})

export default router;