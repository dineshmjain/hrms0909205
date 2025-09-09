import jsonwebtoken from "jsonwebtoken";
// import * as apiResponse from "../../helper/apiResponse.js";


// Generate a new JWT token
export function generateToken(payload, secretKey, expiresIn) {
  return jsonwebtoken.sign(payload, secretKey, { expiresIn, algorithm: 'HS256'});
}

// Verify and decode a JWT token
export async function verifyToken(token, secretKey) {
  try {
    return jsonwebtoken.verify(token, secretKey);
  } catch (err) {
    return err;
  }
}