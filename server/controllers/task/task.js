import axios from 'axios';
import * as apiResponse from '../../helper/apiResponse.js';

export const addPatrollingTask = async (request, response, next) => {
    try {
        const taskUrl = `${process.env.TASK_URL}/project/add`

        request.body.reqBody = {
            name: "Patrolling",
            description: "Patrolling Description",
            branchId: request.body.insertedBranchId,
        }

        await axios.post(taskUrl, request.body.reqBody, {
            headers: {
                Authorization: `Bearer ${request.body.token}`
            }
        }).then(res => {
            if (res.status == 200) return next()
            else throw {}
        }).catch(error => {
            return apiResponse.notFoundResponse(response, error.response.data.message)
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}