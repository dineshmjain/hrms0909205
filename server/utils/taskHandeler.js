import { UserLogs } from "../models/user/userlogs.js";
import {updateUserDetails} from "../models/user/user.js";
import { addAttendenceData, addEmployeeAttendenceStats,updateEmployeeAttendence, updateAttendeceApproval, getEmployeeStats,addEmployeeAttendenceStats2} from "../models/attendence/attendence.js";
import { isCheckinWithinBranch, getBranchOne, createBranchLogs} from "../models/branch/branch.js"
import {logger} from "../helper/logger.js"

export const taskMap = {
    'user-logs': async (message) => {
        const body = JSON.parse(message);
        console.log(body.orgDetails._id)
        const userLogs = new UserLogs()
            .writeData(body);
 
    },
    'user-update': async (message) => {
        const body = JSON.parse(message);
        logger.debug("listening on user update topic")
        await updateUserDetails(body,body)
    },
    'attendance-update': async (message) => {
        try{
        const body = JSON.parse(message);
        logger.debug("listening on attendance update topic")
        await addAttendenceData(body)
        }catch(error){
            logger.error("Error while adding attendance data",error.me)
        }
    },
    'attendance-stats': async (message) => {
        try {
            const body = JSON.parse(message);
            logger.debug("listening on attendance stats topic")
            body.checkExisting = await getEmployeeStats(body)
            // await addEmployeeAttendenceStats(body);
            await addEmployeeAttendenceStats2(body);
        } catch (error) {
            logger.error("Error while processing attendance stats", error.toString());
        }
    },
    'attendance-approvals': async (message) => {
        try {
            const body = JSON.parse(message);
            logger.debug("listening on attendance approvals topic")
            body.branchRadius = await getBranchOne(body)
            body.branchDetails = await isCheckinWithinBranch(body)
            await updateAttendeceApproval(body)
            await updateEmployeeAttendence(body)
        } catch (error) {
            logger.error("Error while processing attendance approvals", error.toString());
        }
    },
    'branch-logs': async (message) => {
        try {
            const body = JSON.parse(message);
            logger.debug("listening on branch logs topic")
            await createBranchLogs(body)
        } catch (error) {
            logger.error("Error while processing branch Logs", error.toString());
        }
    }
};
