import moment from 'moment'
import * as apiResponse from './apiResponse.js'

export function isValidMobileNumber(number) {
  const pattern = /^[6789]\d{9}$/;
  return pattern.test(number);
}

export function isValidMobilewithCountryCode(number) {
    const pattern = /^\+91-\d{10}$/;
    return pattern.test(number);
  }

export function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
}

export function isPasswordValid(password) {
  // const pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~]).{8,}$/;
  const pattern = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~]).*$/;// avoiding length of characters to check only upper, lower,number&specilacahracer
  return pattern.test(password);
}

export const InputChecks = async(request,response,next) => {
    const body = request.body;
    if(body.startDate) body.FromDate = body.startDate
    if(body.endDate) body.ToDate = body.endDate

    let {VersionId,FromDate,ToDate} = body;

    // if(!isValidDate(FromDate) || !isValidDate(ToDate)) return apiResponse.validationError(response, "Please enter valid date")

    // if(VersionId == undefined) return apiResponse.notFoundResponse(response,"Please provide Version detail");
    // if(FromDate == undefined) return apiResponse.notFoundResponse(response,"Please provide Start date");
    // if(ToDate == undefined) return apiResponse.notFoundResponse(response,"Please provide End date");

    if(FromDate && ToDate && FromDate > ToDate) return apiResponse.validationError(response,"Start date should be lesser than End date")

    return next();
}

export const recursiveFeatureValidation = async() => {
    const body = request.body;
    if(body.startDate) body.FromDate = body.startDate
    if(body.endDate) body.ToDate = body.endDate

    let {VersionId,FromDate,ToDate} = body;
    // if(VersionId == undefined) return apiResponse.notFoundResponse(response,"Please provide Version detail");
    // if(FromDate == undefined) return apiResponse.notFoundResponse(response,"Please provide Start date");
    // if(ToDate == undefined) return apiResponse.notFoundResponse(response,"Please provide End date");

    if(FromDate && ToDate && FromDate > ToDate) return apiResponse.validationError(response,"Start date should be lesser than End date")

    return next();
}

export function isValidDate(dateString) {
  const date = new Date(dateString);
  
  if (isNaN(date)) {
      return false;
  }

  const [year, month, day] = dateString.split('T')[0].split('-');
  
  if (Number(year) !== date.getFullYear() || Number(month) !== date.getMonth() + 1 || Number(day) !== date.getDate()) {
      return false;
  }

  return true;
}