import * as apiResponse from '../../helper/apiResponse.js'
import { ObjectId } from 'mongodb'
import * as bannerModel from '../../models/banner/banner.js'


export const addBanner = async (request, response, next) => {
    try {
        let body = request.body
        bannerModel.addBanner(body).then(res => {
            if (res.status) {
                // return apiResponse.successResponse(response, "Banner Image Added Successfully")
                return next()
            }
            else return apiResponse.notFoundResponse(response, "Cannot add Banner Image")
        }).catch(error => {
            return apiResponse.somethingResponse(error)
        })
    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Images not found")
    }
}


export const getBanner = async (request, response, next) => {
    try {
        let body = request.body
        bannerModel.getBanner(body).then(res => {
            if (res.data && res.data.length > 0) {
                return apiResponse.successResponseWithData(response, "Banner Image fetched Successfully", res.data)
                // return next()
            }
            else return apiResponse.notFoundResponse(response, "Unable to fetch Banner Image")
        }).catch(error => {
            return apiResponse.somethingResponse(error)
        })
    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Image not found")
    }
}


export const updateBannerOrder = async (request, response, next) => {
    try {
        let body = request.body
        let promises = []
        for(let i = 0; i < body.bannerIds.length; i++) {
            let bannerId = body.bannerIds[i]
            promises.push(bannerModel.updateBannerOrder({bannerId : bannerId, orderNo : i + 1}))
        }
        Promise.all(promises).then(result => {
            for(let res of result) {
                if(!res.status) throw new Error("unable to update order")
            }
        }).catch(error => {
            return apiResponse.somethingResponse(response, error.message)
        })

        return next()
    } catch (error) {
        console.log(error)
        return apiResponse.somethingResponse(response, "Image not found")
    }
}

export const update = async(request, response, next) => {
    try {
        const body = request.body;
        if (
            body.title == null &&
            body.time == null && 
            body.description == null &&
            body.startDate == null &&
            body.endDate == null
        )return next()
        bannerModel.update(request.body).then(res => {
            if(!res.status) throw {} 

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to update banner paramters")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const updateBanner = async(request, response, next) => {
    try {
        if (request.files?.file === undefined || request.files?.file === null || !request.files.file) {
           return next()
        }
        bannerModel.updateBannerImage(request.body).then(res => {
            if(!res.status) throw {} 

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to delete banner image")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const isBannerValid = async(request, response, next) => {
    try {
        if(!request.body.bannerId) return apiResponse.validationErrorWithData(response, "Banner ID is required", { bannerId: "Banner ID is required" })
        bannerModel.isBannerValid(request.body).then(res => {
            if(!res.status) return apiResponse.notFoundResponse(response, "Invalid Banner ID!")

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to delete banner image")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}

export const deleteBanner=async(request, response, next) => {
    try {
        // if (request.files?.file === undefined || request.files?.file === null || !request.files.file) {
        //    return next()
        // }
        bannerModel.deleteBannerImage(request.body).then(res => {
            if(!res.status) throw {} 

            return next()
        }).catch(error => {
            return apiResponse.somethingResponse(response, "Unable to delete banner image")
        })
    }
    catch (error) {
        return apiResponse.somethingResponse(response, error.message)
    }
}
