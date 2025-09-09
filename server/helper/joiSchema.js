import Joi from "joi";


export const nameSchema = Joi.string().trim().required().min(1);
export const descriptionSchema = Joi.string().trim().required().min(1);
export const numOneToTenSchema = Joi.number().required().min(1).max(100);
export const requiredSchema = Joi.required();
export const locationSchema = Joi.required();

