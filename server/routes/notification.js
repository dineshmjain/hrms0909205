//packages
import * as express from 'express';

//controllers
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as roles from '../controllers/access/role.js';
import * as notification from '../controllers/messages/notification.js';

//helpers
import * as apiResponse from '../helper/apiResponse.js';

const router = express.Router();


router.use((request, response, next) => {
    console.log('\nnotification middleware');
    console.log(request.originalUrl)
    request.body.endpoint = request.originalUrl
    console.log('-------------------------------------------------------');
    return next();
})


router.post('/deviceToken/update',
    auth.isAuth,
    user.isUserValid,
    roles.getRoleModules,
    notification.updateDeviceToken,
    (request, response) => {
        return apiResponse.successResponse(response, "Device token updated successfully")
    }
)

router.get('/list',
    auth.isAuth,
    user.isUserValid,
    // roles.getRoleModules,
    user.updateNotificationReadTime,
    notification.list,

)

router.get('/unread/count',
    auth.isAuth,
    user.isUserValid,
    // roles.getRoleModules,
    notification.getUnreadNotificationCount

)
export default router;