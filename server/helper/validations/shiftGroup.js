import { Joi } from "celebrate";
import { ObjectId } from "mongodb";

export const getCurrentDay = {
  body: Joi.object().keys({
    // shiftGroupId:Joi.string().required().messages({'string.base': 'shiftGroupId must be string', 'any.required': 'shiftGroupId is required',}).pattern(/^[a-f\d]{24}$/i).message('shiftGroupId must be a valid ObjectId')
  }),
};


export const addAttendance = {
    body: Joi.object().required().keys({
        type: Joi.string().valid('checkIn', 'checkOut').required(),
        transactionDate: Joi.string().isoDate().required(),
        location: Joi.object({
            city: Joi.string(),
            state: Joi.string(),
            country: Joi.string(),
            pincode: Joi.string().pattern(/^\d{6}$/),
            lat: Joi.number(),
            lng: Joi.number(),
            address: Joi.string()
        }).required(),
        imgFile: Joi.any().optional()
    })
}