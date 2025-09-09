import express  from 'express'
import notificationPath from './notification.js'
import authPath from './auth.js'
import userPath from './user.js'
import branchPath from './branch.js'
import organizationPath from './organization.js'
import departmentPath from './departmnet.js'
import designationPath from './designation.js'
import assignmentPath  from './assignment.js'
import globlePath from './globle.js'
import languagePath  from './language.js'
import shiftPath from './shift.js'
import leavePath from './leave.js'
import leadPath from './lead.js'
import meetingPath from './meeting.js'
import leavePolicyPath from './leavePolicy.js'
import shiftGroupPath from './shiftGroup.js'
import modulePath from './modules.js'
import rolePath from './role.js'
import mapping from './mapping.js'
import employeeAttendance from './attendence.js'
import holidays from './holidays.js'
import client from './client.js'
import clientBranch from './clientBranch.js'
import quotePrice from './quotePrice.js';
import upload from './uploadFiles.js'
import dashoardPath from './dashboard.js';
import bannerPath from './banner.js';
import emergency from './emergency.js';
import settingPath from './settings.js';
import biometricPath from './biometric.js'
const app = express()

/**
 * for health check after ci pipeline job done
 */
app.get(
    "/health",
    (req,res) => {
        return res.status(200).json({
            success:true,
            status: "OK",
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
        })
    }
)

app.use('/auth',authPath)
app.use('/attendance',employeeAttendance) // this one for employee attendance check in /checkout
app.use('/assignment',assignmentPath)
app.use('/branch',branchPath)
app.use('/client',client)
// app.use('/clientBranch',clientBranch)
app.use('/department',departmentPath)
app.use('/designation',designationPath)
app.use('/globle',globlePath)
app.use('/holiday',holidays)
app.use('/leave',leavePath)
app.use('/lead',leadPath)
app.use('/lead/meeting',meetingPath)
app.use('/leave/policy', leavePolicyPath)
app.use('/language', languagePath)
app.use('/map',mapping) // this one for mapping branch/departement/desigination
app.use('/module',modulePath)
app.use('/notification', notificationPath)
app.use('/organization',organizationPath)
app.use('/quote',quotePrice)
app.use('/role',rolePath)
app.use('/shift',shiftPath)
app.use('/shiftGroup',shiftGroupPath)
app.use('/user',userPath)
app.use('/upload',upload)
app.use('/dashboard',dashoardPath)
app.use('/banner',bannerPath)
app.use('/emergency',emergency)
app.use('/settings',settingPath)
app.use('/biometric',biometricPath)


export default app