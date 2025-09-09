import express from 'express';
import * as auth from '../controllers/auth/auth.js';
import * as user from '../controllers/user/user.js';
import * as holidaysController from '../controllers/holidays/holidays.js'
import * as apiResponse  from '../helper/apiResponse.js';
const router=express.Router()


//create holiday
router.post('/create',
    auth.isAuth,
    user.isUserValid,
    holidaysController.createHoliday
)

router.post('/update',
    auth.isAuth,
    user.isUserValid,
    holidaysController.updateHoliday
)

//get holidays based on orgId and year and Month
router.post('/get',
    auth.isAuth,
    user.isUserValid,
    holidaysController.getHolidays,
    (request,response) => {
        return apiResponse.responseWithPagination(response,"Found sucessfully",request.body.holidayDetails)
    }
)

//activate and deactivate holiday
router.post('/activate/deactivate',
    auth.isAuth,
    user.isUserValid,
    holidaysController.activateDeactivateHolidays
)

//assign holidays to branch/department/designation
router.post('/assign',
    auth.isAuth,
    user.isUserValid,
    holidaysController.assignHolidays
)

//assign holidays to branchwise,departmentwise.designationwise
router.post('/assign/brnch/dept/desg',
    auth.isAuth,
    user.isUserValid,
    holidaysController.checkingValidations,
    holidaysController.assignBranchWiseOrDeptOrDesgHolidays
)

// Unmap holidays from branchwise, departmentwise, designationwise
router.post('/unmap/brnch/dept/desg',
    auth.isAuth,
    user.isUserValid,
    holidaysController.unmapBranchWiseOrDeptOrDesgHolidays
);

//get holidays on branch or dept or desg level
router.post('/get/filter', 
auth.isAuth, 
user.isUserValid, 
holidaysController.getHolidaysOnBranchOrDeptOrDesg);

// Update holidays on branch, department, or designation level
router.post('/update/levelwise', 
auth.isAuth, 
user.isUserValid, 
holidaysController.updateHolidaysOnBranchOrDeptOrDesg);



//get holidays based on branch/department/designation
router.post('/get/branch/dept/desg',
    auth.isAuth,
    user.isUserValid,
    holidaysController.getHolidaysOnBranchDeptDesg
)

//activate/deactivate holidays based on branch/department/designation
router.post('/update/branch/dept/desg',
    auth.isAuth,
    user.isUserValid,
    holidaysController.updateHolidaysOnBranchDeptDesg
)

export default router;