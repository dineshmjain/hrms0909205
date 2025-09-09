import jsonwebtoken from "jsonwebtoken";
import * as apiResponse from "../../helper/apiResponse.js";


// Generate a new JWT token
export function generateToken(payload, secretKey, expiresIn) {
  return jsonwebtoken.sign(payload, secretKey, { expiresIn });
}

// Verify and decode a JWT token
export async function verifyToken(token, secretKey) {
  try {
    return jsonwebtoken.verify(token, secretKey);
  } catch (err) {
    return err;
  }
}
// export async function verifyTokenRequest(request,response,next) {
//   try {
//     let token = request.headers['authorization']?.split("Bearer ")[1]
//     if(!token) return apiResponse.unauthorizedResponse(response,"Unauthorized.")
//     request.body.jwtJson = jsonwebtoken.verify(token, secretKey);
//     return next()
//   } catch (err) {
//     console.log(err)
//     return apiResponse.unauthorizedResponse(response,"Unauthorized.")
//   }
// }