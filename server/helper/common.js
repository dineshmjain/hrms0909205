import path from 'path';
import xlsx from 'xlsx';
import {fileURLToPath} from 'url';
import xls from 'xlsjs';
import { ObjectId } from 'mongodb';
import bcrypt from "bcryptjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function generateOTP() {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export const convertExcelToJSON  = (file, filePath) => {
try {
    const fileExtension = file?.split('.')?.slice(-1)[0];

    // Load the Excel file
    // const readCmd = fileExtension == 'xls' ? xls.readFile(file.data, {type : "buffer"}) : xlsx.readFile(file.data, {type : "buffer"})
    const workbook = xlsx.readFile(filePath);
    
    // Get the first sheet
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    
    // Convert the sheet to JSON
    const data = xlsx.utils.sheet_to_json(sheet);
    
    // Output the JSON data
    return data;
} catch (error) {
    throw error
}
}

export const generateHashPassword = async() =>{
    try {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) throw err;
            // Hash the password using the generated salt
            bcrypt.hash(user.password, salt, (err, hash) => {
              if (err) throw err;
              // Replace the plain text password with the hashed password
              user.password = hash;
          
              // Now you can store the user object in MongoDB
              // For example:
              // db.collection('users').insertOne(user);
              // or
              // db.collection('users').updateOne({ username: user.username }, { $set: user }, { upsert: true });
            });
          });
    }
    catch (error) {
     throw error
    }
}

export const getDeviceTokens = (devices = {}) =>{
    try {
        const deviceTokens = [Object.values(devices).filter(fd => fd.isActive == true).sort((a,b) => new Date(b.createdAt.$date) - new Date(a.createdAt.$date))[0].deviceToken]|| [];
        return deviceTokens;
    }
    catch (error) {
     throw error
    }
}