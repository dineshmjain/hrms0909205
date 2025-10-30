import { promises } from 'fs';
import path from 'path';
import moment from 'moment';
import ExcelJS from 'exceljs';

import { networkInterfaces } from 'os';
import { dirname } from 'path';
import fs from 'fs';
import xlsx from 'xlsx';
import * as apiResponse  from '../helper/apiResponse.js'
import { logger } from '../helper/logger.js'
import { defaultGraceTime } from './constants.js';
import * as shiftModel from '../models/shift/shift.js';
import { getMany } from './mongo.js';
import { ObjectId } from 'mongodb';
// import "jspdf-autotable"
// import {jsPDF} from "jspdf"


const __dirname =  path.resolve(path.dirname(''))

export function getData(result) {
    let inputData = []
    if (result && result.recordsets && result.recordsets[0]) {
        inputData = result.recordsets[0]
    }
    return inputData
}

export function rowsAffected(result) {
    let inputData = []
    if (result && result.rowsAffected) {
        inputData = result.rowsAffected[0]
    }
    return inputData
}

export function generateReferralcode(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


export const getLastMonthCount = (userData) => {
    
    userData = userData.filter(u=>{
        let CreatedDatetime = moment(u.CreatedDate)
        // console.log("******CREATED DATE TIME***********");
        // console.log(CreatedDatetime);
        let lastMonthStartDate = new Date()
        lastMonthStartDate.setMonth(lastMonthStartDate.getMonth()-1)
        // console.log({lastMonthStartDate:moment(lastMonthStartDate)});
        // console.log({CreatedDatetime});
        if(CreatedDatetime>moment(lastMonthStartDate)){
            return u
        }
    });


    return userData;
}

export const getLastYearCount = (userYear) => {
     userYear = userYear.filter(u=>{
               
        let CreatedDatetime = moment(u.CreatedDate)
        let lastYearStartDate = new Date()
        
        lastYearStartDate.setYear(lastYearStartDate.getFullYear()-1)
        
        // console.log({lastYearStartDate:moment(lastYearStartDate)});
       
        if(CreatedDatetime>moment(lastYearStartDate)){
            return u
        }
    });

    return userYear;
}

export const getGraphPoints= (dataList) => {

      var dt;    
    dataList= dataList.filter(d=>d.DateBit==1)


    try {
        const points = {
            "Jan":0,
            "Feb":0,
            "Mar":0,
            "Apr":0,
            "May":0,
            "Jun":0,
            "Jul":0,
            "Aug":0,
            "Sep":0,
            "Oct":0,
            "Nov":0,
            "Dec":0
        };
        
        dataList.forEach(d => {
          const createdDate = moment(d.CreatedDate).format("DD MMM YYYY");
          const month = moment(createdDate, 'DD MMM YYYY').format('MMM');
            
          if(d.total){
            points[month] += d.smsCount
          }
          else  points[month] += 1;
        });
      
        return points;
    } catch (error) {
        console.log(dt);
        console.log(error);
        return {}
    }
    // var dt;    
    // dataList= dataList.filter(d=>d.DateBit==1)
    // try {
    //     let points={}
    //     dataList.map(d=>{
    //         let CreatedDate = moment(d.CreatedDate).format("DD MMM YYYY")
    //         points[CreatedDate] = points[CreatedDate]==undefined ? 1 : points[CreatedDate]+1
    //     })
    //     return points;
    // } catch (error) {
    //     console.log(dt);
    //     console.log(error);
    //     return {}
    // }
}

export const getAnalysisData= (data,type) => {
    try {
        return {
            type,
            count:data.filter(d=>d.DateBit==1).length,
            categories:Object.keys(getGraphPoints(data)),
            points:Object.values(getGraphPoints(data))
        }
    }catch (error) {
        console.log(error);
        return {}
    }
}

export const getDurationDates= (duration) => {
    try {
        let startDate = moment().subtract(duration*2,'days').format('YYYY-MM-DD')
        let midDate = moment().subtract(duration,'days').format('YYYY-MM-DD')
        let endDate = moment().format('YYYY-MM-DD');
        
        return {startDate, midDate,endDate}
    } catch (error) {
        console.log(error);
        return {}
    }
}

export function getCurrentDateTime(){
    let currentDate = new Date();
    return currentDate

}

export function getDiffDateTime(days){
    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate()+days)
    return currentDate

}
export function getDiffDateTimeMin(min){
    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes()+min)
    return currentDate

}

export function get24HoursPrevTime(diffDays){
    const currentUtcTime = new Date();
    const timezoneOffset = new Date().getTimezoneOffset();
    const localTime = currentUtcTime - (timezoneOffset * 60 * 1000);
    const oneDayBefore = localTime - (diffDays * 24 * 60 * 60 * 1000);
    const oneDayBeforeDate = new Date(oneDayBefore);
    return oneDayBeforeDate
}

export const getServerIP = () => {
    try {
      const nets = networkInterfaces();
      const results = {};
  
      for (const name of Object.keys(nets)) {
          for (const net of nets[name]) {
              // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
              // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
              const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
              if (net.family === familyV4Value && !net.internal) {
                  if (!results[name]) {
                      results[name] = [];
                  }
                  results[name].push(net.address);
              }
          }
      }
     
      let IP = results?.Ethernet ? results?.Ethernet :  results['Wi-Fi'] ? results['Wi-Fi'] : []
      return IP != [] ? IP[0] : ""
    } catch (error) {
         console.log(error);
         return ""
    }
}

export function getClientIP(req) {
    const forwardedFor = req.headers['x-forwarded-for'];
    if (forwardedFor) {
      const ips = forwardedFor.split(',');
      return ips[0];
    }
    return req.connection.remoteAddress;
}

// export const logRequest = async (logInfo) => {
//     try {
      
//     let ip = logInfo?.ip || ""
//     let endpoint = logInfo?.endpoint || ""
//     let queryString = logInfo?.queryString || ""
//     let body = logInfo?.body || {}
//     let activity = logInfo?.activity || false

//     const parentDirectory = path.join(__dirname, "..")
//     const logDirectory = path.join(parentDirectory, 'Logs');
  
//       try {
//         await promises.mkdir(logDirectory);
//       } catch (error) {
//         if (error.code !== 'EEXIST') {
//           throw error;
//         }
//       }
  
//         const currentDate = moment().format('YYYY-MM-DD');
//         const logFilePath = path.join(logDirectory, `${currentDate}.txt`);
//         const logMessage = `[${moment().format('HH:mm:ss')}]\nIP ADDRESS : ${ip}\nAPI_ENDPOINT: ${endpoint}\nREQUEST_BODY: ${JSON.stringify(body)}\nQUERY : ${queryString}\n\n`;

//         if(activity && activity?.ModuleKey){
//             let db = await connectToDB();
//             const collection = db.collection("Activity");
//             await collection.insertOne({ip, endpoint, ...activity, CreatedDate : getCurrentDateTime()}); 
//         }
//         await promises.appendFile(logFilePath, logMessage);

//     } catch (error) {
//       console.error('Error logging request:', error);
//     }
// };

export const findLastIndex = (array, value) => {
    for (let i = array.length - 1; i >= 0; i--) {
      if (JSON.stringify(array[i]) === JSON.stringify(value)) {
        return i; // Return the index of the last occurrence
      }
    }
    return -1; // Return -1 if the value is not found in the array
}

export const convertUtcToIst = (dateString) => {
    // Parse the UTC time string
    const utcDate = utc(dateString);
  
    // Set the time zone to IST (Indian Standard Time)
    const istDate = utcDate.clone().tz('Asia/Kolkata');
  
    // Format the date as 'YYYY-MM-DD'
    const formattedDate = istDate.format('YYYY-MM-DD');
  
    return formattedDate;
}


export const getUpdatedFields = (oldData, newData) => {
    
    let newObj = {}
    let oldObj = {}

    for(const key in newData) {
        if((Array.isArray(newData[key]) && !JSON.stringify(newData[key]) == JSON.stringify(oldData[key]) )
        ) {
           
            newObj[key] = newData[key]
            oldObj[key] = oldData[key]
        }
        else if(newData[key] != oldData[key]){
            newObj[key] = newData[key]
            oldObj[key] = oldData[key]
        }
       
    }

    return {new : newObj, old : oldObj}
}

export function isTimeDifferenceInMinutes(date1, date2,timeDiff) {
    const diffInMilliseconds = Math.abs(date2 - date1);
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    return diffInMinutes <= timeDiff; //true if timediff in min is within range of difference
}

export function convertToYYYYMMDD(incomingDate) {
    // Convert the incoming date to "YYYY-MM-DD" format using Moment.js
    const format = identifyDateFormat(incomingDate)
    const formattedDate = moment(incomingDate, format, true).format("YYYY-MM-DD");
  
    return formattedDate;
}

export function convertToDDMMYYYY(incomingDate) {
    // Convert the incoming date to "YYYY-MM-DD" format using Moment.js
    const format = identifyDateFormat(incomingDate)
    const formattedDate = moment(incomingDate, format, true).format("DD-MM-YYYY");
  
    return formattedDate;
}

export function identifyDateFormat(incomingDate) {
    const possibleFormats = [
      "YYYY-MM-DD",
      "DD-MM-YYYY",
      "MM-DD-YYYY",
      // Add more formats as needed
    ];
  
    let detectedFormat = null;
  
    for (const format of possibleFormats) {
      const parsedDate = moment(incomingDate, format, true); // Enable strict parsing
      if (parsedDate.isValid()) {
        detectedFormat = format;
        break;
      }
    }
  
    return detectedFormat;
}

//old report format
export const generateExcel = async(data, reportDetails) => {
    try {
        // Create a new workbook and add a worksheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Inventory Report');

        // Sample data for the "Excess Items" and "Short Items" tables
        const excessAndShortItemsData = data;

        // Merge cells for the main table
        worksheet.mergeCells('A1:H1');
        worksheet.getCell('A1').value = `Organization Name: ${reportDetails.orgName}`;
        worksheet.getCell('A1').font = { bold: true, size: 16 };

        worksheet.getCell('A2').value = `Godown Mismatched Items Report`;
        worksheet.getCell('A2').font = { bold: true, size: 10 };

        worksheet.getCell('A3').value = `Date: ${reportDetails.stockDate}`;
        worksheet.getCell('A3').font = { bold: true };

        worksheet.getCell('E2').value = reportDetails.godownName ? `Godown name: ${reportDetails.godownName}` : "";
        worksheet.getCell('E2').font = { bold: true };

        worksheet.getCell('A1').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('A2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('A3').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        worksheet.getCell('E2').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };


        // Merge cells for the "Excess Items" and "Short Items" sections inside the main table
        worksheet.mergeCells('A4:D4');
        worksheet.getCell('A4').value = 'Excess Items';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A4').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('A4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        worksheet.mergeCells('E4:H4');
        worksheet.getCell('E4').value = 'Short Items';
        worksheet.getCell('E4').font = { bold: true };
        worksheet.getCell('E4').alignment = { horizontal: 'center', vertical: 'middle' };
        worksheet.getCell('E4').border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };

        // Add the "Excess Items" and "Short Items" table data inside the main table
        excessAndShortItemsData.forEach((row) => {
            worksheet.addRow(row).eachCell((cell) => {
                // Apply styling for subtable cells
                cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
            });
        });

        // Set column widths to 30 for each column
        worksheet.columns.forEach((column) => {
            column.width = 20;
        });

        // Center the entire main table
        worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };

        // Save the workbook to a file
        const fileName = `Report_` + moment().format('YYYYMMDDHHmmss') + `.xlsx`;
        const filePath = path.join(__dirname, 'assets', 'report', fileName);

        try {
            await workbook.xlsx.writeFile(filePath);
            return { status: true, filePath: `/reports/${fileName}` };
          } catch (error) {
            return { status: false, error };
          }
    } catch (error) {
        return { status: false, message: error.message }
    }
}



export const generatePDF = async (exceessItems,shortItems, reportDetails) => {
    try {
        // // Sample dynamic data
        // const data = [
        //   [1, 20, "Item1", 1, 89, "Item2fwefwefweefwefwefwefwefwefwefwefwef"],
        //   [1, 40, "Item2", 1, 86, "Item2"],
        //   [1, 20, "Item3", 1, 23, "Item3"],
        //   [1, 20, "Item4", 1, 45, "Item4"],
        // ];

        // Create a new jsPDF document
        const pdfDoc = new jsPDF();

        // Title
        pdfDoc.setFontSize(18);
        pdfDoc.setFont("helvetica", "bold");
        // pdfDoc.setTextColor(0, 0, 139); //dark blue
        pdfDoc.text(`Organization Name: ${reportDetails.orgName}`, 50, 20);

        // Mismatched Item list Report
        pdfDoc.setFontSize(16);

        pdfDoc.text("Mismatched Item list Report", 10, 40);
        pdfDoc.setFontSize(12);
        pdfDoc.text(`Date : ${convertToDDMMYYYY(reportDetails.stockDate)}`, 150, 40);

        pdfDoc.setFontSize(12);
        reportDetails.godownName ? pdfDoc.text(`Godown : ${reportDetails.godownName}`, 10, 60) : undefined;



        // Set up first subtable (Excess items)
        const excessItemsData = exceessItems
        const excessItemsColumns = ["SL No", "Packets", "Item"];

        // Title row for Excess items
        pdfDoc.autoTable({
            head: [["Excess Items"]],
            startY: 70,
            margin: { horizontal: "center" }, // Center align the title
            styles: {
                fillColor: false,
                fontStyle: "bold",
                textColor: [0, 0, 0],
                align: "center",
            }, // Bold text and black color
        });

        pdfDoc.autoTable({
            head: [excessItemsColumns],
            body: excessItemsData,
            theme: "striped",
            margin: { left: 10, right: 5 },
        });

        // Set up second subtable (Short items)
        const shortItemsData = shortItems
        const shortItemsColumns = ["SL No", "Packets", "Item"];

        // Title row for Short items
        pdfDoc.autoTable({
            head: [["Short Items"]],
            startY: pdfDoc.autoTable.previous.finalY + 10,
            margin: { horizontal: "center" }, // Center align the title
            styles: { fillColor: false, fontStyle: "bold", textColor: [0, 0, 0] }, // Bold text and black color
        });

        pdfDoc.autoTable({
            head: [shortItemsColumns],
            body: shortItemsData,
            theme: "striped",
            margin: { left: 10, right: 5 },
        });

        // Save the workbook to a file
        const fileName = `PDF_` + moment().format('YYYYMMDDHHmmss') + `.pdf`;
        const filePath = path.join(__dirname, 'assets', 'pdf', fileName);

        try {
            pdfDoc.save(filePath);
            return { status: true, message: "PDF generated successfully", filePath: `/pdf/${fileName}` }
        } catch (error) {
            return { status: false, message: "Failed to generate PDF" }
        }

    } catch (error) {
        console.error(error);
        return { status: false, error: error.message }
    }
}

//set start date and end date
export const setStartAndEndDate=(params) =>{
    const { startDate, endDate } = params;

    // If only startDate is provided, use it for both startDate and endDate
    const finalStartDate = startDate || endDate;
    const finalEndDate = endDate || startDate;

    // If both are undefined, return current date for both startDate and endDate
    if (!finalStartDate || !finalEndDate) {
        const currentDate = new Date();
        return {
            startDate: new Date(currentDate.setUTCHours(0, 0, 0, 0)),   // Start of the current day
            endDate: new Date(currentDate.setUTCHours(23, 59, 59, 999)) // End of the current day
        };
    }

    // Convert the finalStartDate to Date object and set it to the start of the day
    const start = new Date(finalStartDate);
    start.setUTCHours(0, 0, 0, 0); // Start of the day

    // Convert the finalEndDate to Date object and set it to the end of the day
    const end = new Date(finalEndDate);
    end.setUTCHours(23, 59, 59, 999); // End of the day
    // end.setUTCHours(0, 0, 0, 0); // End of the day

    return {
        startDate: start,
        endDate: end,
    };
}

export const getUTCDateRange = (dateUTC, numberOfDays) => {
    // Parse the provided UTC date string
    const date = new Date(dateUTC);
  
    // Extract the year, month, and day from the provided date
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
  
    // Create the start of the day in UTC
    const startOfDayUTC = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    const newDay = numberOfDays === 0 ? day : day + numberOfDays;
    // Create the end of the day in UTC
    const endOfDayUTC = new Date(Date.UTC(year, month, newDay, 23, 59, 59, 999));
  
    return {
      startDate: startOfDayUTC,
      endDate: endOfDayUTC
    };
}

export const matchesConditions = (obj, keys, dict, values) => {
  return keys.every(key => obj[key[dict]].toString() != values[key[dict].toString()]);
};

// checkig validation on extractedExcelData
export const isCheckValidations = (excelData) => {
  try {
    const validData = [];
    const inValidData = [];

    for (let each of excelData) {
      const status = [];

      const {
        clientName,
        contractStartDate,
        incharge,
        branch,
        shift,
        requirements
      } = each;

      // ===== BASIC FIELDS =====
      if (!clientName) status.push("Client Name should not be empty");
      if (!contractStartDate) status.push("Contract Start Date should not be empty");

      // ===== INCHARGE =====
      if (!incharge?.name) status.push("Incharge Name should not be empty");
      if (!incharge?.designation) status.push("Incharge Designation should not be empty");
      if (!incharge?.mobile || !/^\d{10}$/.test(incharge.mobile.toString())) {
        status.push("Incharge Mobile Number should be a 10-digit number");
      }

      // ===== BRANCH =====
      if (!branch?.name) status.push("Branch Name should not be empty");
      if (!branch?.gstNo) status.push("Branch GST Number should not be empty");
      if (!branch?.panNo) status.push("Branch PAN Number should not be empty");
      if (!branch?.address) status.push("Branch Address should not be empty");
      if (!branch?.city) status.push("Branch City should not be empty");
      if (!branch?.state) status.push("Branch State should not be empty");
      if (!branch?.pincode || isNaN(Number(branch.pincode))) {
        status.push("Branch Pincode should be a valid number");
      }

      // PAN format check (optional)
      if (branch?.panNo && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(branch.panNo.trim())) {
        status.push("Invalid Branch PAN Number format");
      }

      // GST format check (optional)
      if (branch?.gstNo && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(branch.gstNo.trim())) {
        status.push("Invalid Branch GST Number format");
      }

      // ===== SHIFT =====
      if (!shift?.name) status.push("Shift Name should not be empty");
      if (!shift?.startTime) status.push("Shift Start Time should not be empty");
      if (!shift?.endTime) status.push("Shift End Time should not be empty");
      if (!shift?.reportingTime) status.push("Shift Reporting Time should not be empty");

      // ===== REQUIREMENTS (Dynamic roles) =====
      if (!requirements || typeof requirements !== 'object') {
        status.push("Requirements should be provided and valid");
      } else {
        for (const [role, values] of Object.entries(requirements)) {
          const male = values?.male;
          const female = values?.female;

          if (male === undefined || isNaN(Number(male))) {
            status.push(`${role} Male count should be a valid number`);
          }
          if (female === undefined || isNaN(Number(female))) {
            status.push(`${role} Female count should be a valid number`);
          }
        }
      }

      // ===== RESULT CLASSIFICATION =====
      if (status.length === 0) {
        validData.push(each);
      } else {
        inValidData.push({ ...each, status: status.join(", ") });
      }
    }

    return { validData, inValidData };
  } catch (error) {
    console.error("Error during validation:", error.message);
    throw error;
  }
};


/**
 * Utility: Normalize value for Excel import
 */
const normalize = (value) => {
    if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && ['null', 'undefined', ''].includes(value.trim().toLowerCase()))
    ) {
        return null;
    }
    return typeof value === 'string' ? value.trim() : value;
};


export const normalizeDate = (value) => {
    if (!value) return null;
  
    const parseToLocalDate = (y, m, d) => {
      // Create date in local timezone (no Z)
      return new Date(y, m - 1, d);
    };
  
    if (value instanceof Date) {
      return value.toISOString().split("T")[0];
    }
  
    if (typeof value === "number") {
      const date = xlsx.SSF.parse_date_code(value);
      if (date) {
        const local = parseToLocalDate(date.y, date.m, date.d);
        return local.toISOString().split("T")[0];
      }
    }
  
    if (typeof value === "string") {
      const match = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{2,4})$/);
      if (match) {
        const [, d, m, y] = match;
        const year = y.length === 2 ? `20${y}` : y;
        const local = parseToLocalDate(year, m, d);
        return local.toISOString().split("T")[0];
      }
  
      const parsed = new Date(value);
      if (!isNaN(parsed)) return parsed.toISOString().split("T")[0];
    }
  
    return null;
};
    
  

/**
 * extractimportclientExcel - optimized
 */

// validation for employess after extract excel data
const isCheckEmployeeValidations = (excelData = []) => {
    const validData = [];
    const inValidData = [];

    for (const each of excelData) {
        const status = [];
        const {
            employeeId,
            firstName,
            mobile,
            password,
            subOrganization,
            branch,
            department,
            designation,
            email,
            gender,
            dateOfBirth,
            joinDate,
            bloodGroup,
            qualification,
            workTimingType,
            shiftIds,
            salaryConfig,
            emergencyNumber,
            guardianNumber,
            guardianName,
            martialStatus
        } = each;

        if (!employeeId) status.push("EmployeeId is required");
        if (!firstName) status.push("First Name is required");
        if (!mobile || !/^\d{10}$/.test(mobile)) status.push("Mobile must be 10 digits");
        //   if (!password) status.push("Password is required");
        if (!password) {
            status.push("Password is required");
        } else if (
            password.length < 6 ||
            !/[A-Z]/.test(password) ||
            !/[a-z]/.test(password) ||
            !/[0-9]/.test(password) ||
            !/[!@#$%^&*(),.?":{}|<>]/.test(password)
        ) {
            status.push("Password must be at least 6 characters and contain 1 uppercase, 1 lowercase, 1 number, 1 special char");
        }
        if(subOrganization){
            if(!subOrganization)status.push("Organization is required")
        }
        if(branch){
            if(!branch)status.push("branch is required")
        }
        // if (!branch) status.push("Branch is required");
        if (!department) status.push("Department is required");
        if (!designation) status.push("Designation is required");
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) status.push("Invalid Email");
        if (gender && !['male', 'female', 'other'].includes(gender.toLowerCase()))status.push("Invalid Gender");
        
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
            status.push("DOB must be in yyyy-mm-dd format");
        } else {
            const dob = new Date(dateOfBirth);
            const age = new Date().getFullYear() - dob.getFullYear();
            if (isNaN(dob.getTime())) {
                status.push("Invalid DOB");
            } else if (age < 15) {
                status.push("Employee must be at least 15 years old");
            }
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(joinDate)) {
            status.push("DOJ must be in yyyy-mm-dd format");
        } else {
            const doj = new Date(joinDate);
            const dob = new Date(dateOfBirth);
            const today = new Date();

            if (isNaN(doj.getTime())) {
                status.push("Invalid DOJ");
            } else {
                if (doj > today) {
                    status.push("DOJ cannot be a future date");
                }
                if (!isNaN(dob.getTime()) && doj <= dob) {
                    status.push("DOJ must be after DOB");
                }
            }
        }

        if (!bloodGroup) status.push("Blood Group is required");
        if (!qualification) status.push("Qualification is required");
        if (!workTimingType || !(workTimingType==='YES' || workTimingType==='NO')) status.push("Work Branch Timing is required && YES or NO valid data is required");
        if (!shiftIds) status.push("Work Shift Timing is required");
        if (!salaryConfig || !(salaryConfig==='YES' || salaryConfig==='NO')) status.push("Default Branch Salary Setting is required && YES or NO valid data is required");
        if (!emergencyNumber|| !/^\d{10}$/.test(emergencyNumber)) status.push("Emergency Number is required && must be 10 digits");
        if (!guardianNumber|| !/^\d{10}$/.test(guardianNumber)) status.push("Guardian Number is required && must be 10 digits");
        if (!guardianName) status.push("Guardian Name is required");
        if(!martialStatus) status.push('Martial Status id required');

        if (status.length === 0) {
            validData.push(each);
        } else {
            inValidData.push({ ...each, status: status.join(', ') });
        }
    }

    return { validData, inValidData };
};

/**
 * Utility: Parse Excel date to YYYY-MM-DD
 */
const parseExcelDate = (value) => {
    if (typeof value === 'number') {
        const date = new Date(Date.UTC(1900, 0, value - 1));
        if (value > 59) date.setUTCDate(date.getUTCDate() - 1); // Excel leap year bug
        return date.toISOString().slice(0, 10);
    }
    const parsed = new Date(value);
    return !isNaN(parsed) ? parsed.toISOString().slice(0, 10) : null;
};

/**
 * Utility: Read Excel file and return rows as JSON
 */
const readExcelRows = (filePath, sampleRows = [], headerRow = 0) => {
    const workbook = xlsx.readFile(filePath);
    const sheetnames = workbook.SheetNames;
    const sheet = workbook.Sheets[sheetnames[0]];
    const range = xlsx.utils.decode_range(sheet['!ref']);
    const headers = [];
    for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = sheet[xlsx.utils.encode_cell({ r: headerRow, c: C })];
        headers.push(cell ? cell.v : `UNKNOWN_${C}`);
    }
    const rows = xlsx.utils.sheet_to_json(sheet, {
        range: headerRow + 4,
        header: headers,
        defval: ''
    });
    // Filter out sample rows if sampleRows provided
    return rows.filter(row => {
        const mobile = row['Owner Mobile Number'] || row['Mobile Number'] || row['EmployeeId'];
        return !sampleRows.includes(mobile);
    });
};  

const getNestedValue = (obj, path) => 
  path.split('.').reduce((acc, key) => acc?.[key], obj);

/**
 * Utility: Remove duplicates from array of objects based on keys
 */
const removeDuplicates = (dataArray, uniqueKeys) => {
    const unique = [];
    const duplicates = [];
    dataArray.forEach(row => {
        const isDuplicate = unique.find(u =>
            uniqueKeys.every(key => getNestedValue(u, key) === getNestedValue(row, key))
        );
        if (!isDuplicate) {
            unique.push(row);
        } else {
            duplicates.push({ ...row, status: 'duplicate data' });
        }
    });
    return { unique, duplicates };
};

/**
 * Modular Excel Extractor
 * @param {Object} options
 * @returns {Object} { validData, inValidData, duplicates }
 */
const extractExcelData = async ({request, response, sampleRows = [], mapRowFn, uniqueKeys, validateFn, dirPath="asset/files/others"}) => {
    try {
        const tmpDir = '/tmp';
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
        const file = request.files?.file;
        if (!file) return apiResponse.validationError(response, 'No file uploaded');
        let reqfileName = file?.name;
        request.body.fileExtension = reqfileName?.split('.')?.slice(-1)[0]
        let fileName = "File_" + moment(getCurrentDateTime()).format('YYYYMMDDHHmmss') + "." + request.body.fileExtension
        const filePath = `${tmpDir}/${fileName}`;
        fs.writeFileSync(filePath, file.data);

        const excelRows = readExcelRows(filePath, sampleRows, 0);
        console.log(excelRows)

        // Map and normalize
        const dataArray = excelRows.map(mapRowFn);
        // console.log('data array', dataArray)

        // Remove duplicates
        const { unique, duplicates } = removeDuplicates(dataArray, uniqueKeys);

        if (duplicates.length > 0 && unique.length < 1) {
            return { validData: [], inValidData: [], duplicates };
        }
        if (!unique.length) {
            return { validData: [], inValidData: [], duplicates };
        }

        // Validate
        const { validData, inValidData } = validateFn(unique);
        // console.log('invalid data', inValidData)

        if (validData.length < 1 && inValidData.length > 0) {
            return { validData: [], inValidData, duplicates };
        }

        return { employExtractData:validData, inValidData, duplicates };
    } catch (error) {
        request.logger?.error('Error in extractExcelData', { stack: error.stack });
        throw error;
    }
};

export const clientExcelFormat = async (body) => {
  try {
    const orgId = new ObjectId(body.user.orgId);

    const designationResult = await getMany(
      { orgId, isService: true, isActive: true },
      "designation",
      { name: 1 }
    );

    const serviceDesignations = designationResult.data.map((d) => d.name);

    const headers = [
      "Client Organisation Name",
      "Contract Start Date",
      "Incharge Name",
      "Incharge Designation",
      "Incharge Mobile Number",
      "Branch Name",
      "GST Number",
      "PAN Number",
      "Address",
      "City",
      "State",
      "Pincode",
      "Shift Name",
      "Shift Start Time",
      "Shift End Time",
      "Shift Reporting Time Mins",
      // Dynamic service designations will follow here
    ];

    // Add dynamic service designations (male/female columns)
    serviceDesignations.forEach((name) => {
      headers.push(`${name} - Male`, `${name} - Female`);
    });

    const sampleRows = [
      [
        "MWB Tech Pvt Ltd",
        "04-06-2025",
        "Mukesh Bafna",
        "Founder",
        "7022667691",
        "Hubli Branch",
        "29ABCDE1234F1Z5",
        "ABCDE1234F",
        "WB Plaza, 1st Floor, Hubli",
        "Hubli",
        "Karnataka",
        "580020",
        "Morning Shift",
        "09:00 AM",
        "05:00 PM",
        "08:45 AM",
        ...Array(serviceDesignations.length * 2).fill(0),
      ],
      [
        "MWB Tech Pvt Ltd",
        "04-06-2025",
        "Mukesh Bafna",
        "Founder",
        "7022667691",
        "Dharwad Branch",
        "29ABCDE1234F1Z6",
        "ABCDE1234F",
        "Industrial Area, Dharwad",
        "Dharwad",
        "Karnataka",
        "580001",
        "Night Shift",
        "09:00 PM",
        "05:00 AM",
        "08:45 PM",
        ...Array(serviceDesignations.length * 2).fill(0),
      ],
    ];

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Client Data");

    sheet.columns = headers.map((header) => ({ header, key: header }));

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      cell.numFmt = "@";
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD9E1F2" },
      };
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
      cell.protection = { locked: true };
    });

    // Add sample data
    sampleRows.forEach((data) => {
      const row = sheet.addRow(data);
      row.eachCell((cell) => {
        cell.value = cell.value?.toString?.() ?? "";
        cell.numFmt = "@";
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF2F2F2" },
        };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Unlock user input cells (rows 5–105)
    for (let i = 5; i <= 105; i++) {
      const row = sheet.getRow(i);
      for (let j = 1; j <= headers.length; j++) {
        const cell = row.getCell(j);
        cell.protection = { locked: false };
        cell.numFmt = "@";
        cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
      }
    }

    // Dropdowns
    const applyDropdown = (colLetter, options) => {
      for (let i = 5; i <= 105; i++) {
        sheet.getCell(`${colLetter}${i}`).dataValidation = {
          type: "list",
          allowBlank: true,
          formulae: [`"${options.join(",")}"`],
          showDropDown: true,
        };
      }
    };

    applyDropdown("D", ["Founder", "Manager", "Director", "Owner"]);
    applyDropdown("K", [
      "Karnataka",
      "Maharashtra",
      "Tamil Nadu",
      "Delhi",
      "Gujarat",
    ]);
    applyDropdown("M", ["Morning Shift", "Evening Shift", "Night Shift"]);

    // Set minimum column width
    sheet.columns.forEach((col) => {
      let maxLen = Math.max(20, col.header.length + 5);
      col.eachCell({ includeEmpty: true }, (cell) => {
        const len = cell.value ? cell.value.toString().length : 0;
        maxLen = Math.max(maxLen, len + 5);
      });
      col.width = maxLen;
    });

    sheet.views = [{ state: "frozen", ySplit: 1 }];

    await sheet.protect("teju123", {
      selectLockedCells: true,
      selectUnlockedCells: true,
    });

    const destFolder = `assets/client/excelformat`;
    const fileName = `ClientOnboardingTemplate_${Date.now()}.xlsx`;
    if (!fs.existsSync(destFolder)) fs.mkdirSync(destFolder, { recursive: true });
    const filePath = path.join(destFolder, fileName);
    await workbook.xlsx.writeFile(filePath);

    return {
      status: true,
      data: `/api/v1/client/excel/format/${fileName}`,
    };
  } catch (error) {
    console.error("Error while generating Excel:", error);
    return { status: false, message: "Failed to generate Excel" };
  }
};


export const extractImportClientExcel = async (request, response, next) => {
    const sampleRows = ['9553737837', '9553737838', '9553737839'];
    const mapRowFn = (row) => ({
        clientName: normalize(row?.['Client Organisation Name']),
        contractStartDate: normalize(row?.['Contract Start Date']),

        incharge: {
            name: normalize(row?.['Incharge Name']),
            designation: normalize(row?.['Incharge Designation']),
            mobile: normalize(row?.['Incharge Mobile Number']),
        },

        branch: {
            name: normalize(row?.['Branch Name']),
            gstNo: normalize(row?.['GST Number']),
            panNo: normalize(row?.['PAN Number']),
            address: normalize(row?.['Address']),
            city: normalize(row?.['City']),
            state: normalize(row?.['State']),
            pincode: normalize(row?.['Pincode']),
        },

        shift: {
            name: normalize(row?.['Shift Name']),
            startTime: normalize(row?.['Shift Start Time']),
            endTime: normalize(row?.['Shift End Time']),
            reportingTime: normalize(row?.['Shift Reporting Time Mins']),
        },

        requirements: {
            // fieldOfficer: {
            //     male: Number(normalize(row?.['Field Officer - Male'])) || 0,
            //     female: Number(normalize(row?.['Field Officer - Female'])) || 0,
            // },
            supervisor: {
                male: Number(normalize(row?.['Supervisor - Male'])) || 0,
                female: Number(normalize(row?.['Supervisor - Female'])) || 0,
            },
            securityGuard: {
                male: Number(normalize(row?.['Security Guard - Male'])) || 0,
                female: Number(normalize(row?.['Security Guard - Female'])) || 0,
            },
        },
    });

    const uniqueKeys = [
        'clientName',
        'branch.name',
        'branch.address',
        'branch.city',
        'shift.name'
    ];

    const validateFn = isCheckValidations;

    return extractExcelData({
        request,
        response,
        sampleRows,
        mapRowFn,
        uniqueKeys,
        validateFn,
        dirPath:'assets/files/import/client',
    });
};

export const formatDesignationKey = (key) =>  {
  if (!key) return "";
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

export const prepareImportData = (request, response, next) => {
  try {
    const rows = request.body.excelData.validData;
    const clientsMap = new Map();

    for (let row of rows) {
      const {
        clientName,
        contractStartDate,
        incharge,
        branch,
        shift,
        requirements
      } = row;

      if (!clientsMap.has(clientName)) {
        clientsMap.set(clientName, {
          clientName,
          contractStartDate,
          incharge,
          branches: []
        });
      }

      const client = clientsMap.get(clientName);

      let branchObj = client.branches.find(
        (b) =>
          b.name === branch.name &&
          b.gstNo === branch.gstNo &&
          b.panNo === branch.panNo
      );

      if (!branchObj) {
        branchObj = {
          ...branch,
          shifts: []
        };
        client.branches.push(branchObj);
      }

      let formattedRequirements = {};
      if (requirements && typeof requirements === "object") {
        for (const key in requirements) {
          const formattedKey = formatDesignationKey(key); // "securityGuard" → "Security Guard"
          formattedRequirements[formattedKey] = requirements[key];
        }
      }

      let shiftObj = branchObj.shifts.find((s) => s.name === shift.name);
      if (!shiftObj) {
        shiftObj = {
          ...shift,
          requirements: formattedRequirements
        };
        branchObj.shifts.push(shiftObj);
      }
    }

    const finalClients = Array.from(clientsMap.values());

    return finalClients;
  } catch (error) {
    logger.error("Error while importing client from excel", { stack: error.stack });
    return apiResponse.somethingResponse(response, error.message);
  }
};

export const employeeExcelFormat2= async (body) => {
    try {

        const genderType=['Male','Female']
        const branchTimingOptions = ["YES", "NO"];
        let shiftOptions = ["NO"];

        try {
            const shiftRes=await shiftModel.listShift({query:{},...body})
            console.log
            
            if (shiftRes.data?.length) {
              const apiShifts = shiftRes.data.map((s) => s.name).filter(Boolean);
              shiftOptions = ["NO", ...apiShifts];
            }
          } catch (err) {
            console.warn("⚠️ Shift API failed, using default NO option only",err.message);

        }
      
        // let headers = [
        //     'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Branch','Department','Designation','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
        // ];
        let headers = [
            'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Branch','Department','Designation','Work Branch Timing','Work Shift Timing','Qualification','Blood Group','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
        ];

        let sampleRows = [
            ['EMP001', 'Mukesh', 'Bafna', '9553737837', 'test@1234', 'mukesh.bafna@example.com','Male', '1990-01-01', '2022-06-15', 'Mwb Trading', 'Accounts','Accountant','YES','NO','MBA', 'O+','12A', 'MG Road', 'Near City Mall', 'Pune', 'Pune', 'Maharashtra', 'India', '411001'],
            ['EMP002', 'Abani', 'Bafna', '9553737838', 'test@1234', 'abani.bafna@example.com', 'Male','1992-03-10', '2023-01-12', 'Mwb Trading', 'Accounts','Auditor','YES','NO','MBA', 'O+','13A', 'MG Road5', 'Near City Mall1', 'Pune', 'Pune', 'Maharashtra', 'India', '411002'],
            ['EMP003', 'Mukesh', 'Ramesh', '9553737839', 'test@1234', 'ramesh.bafna@example.com','Male', '1991-05-20', '2021-11-01', 'MWb Manufacturing','Cleaning','Supervisor','YES','NO','MBA', 'O+','14A', 'MG Road6', 'Near City Mall2', 'Pune', 'Pune', 'Maharashtra', 'India', '411003']
        ];
        if(body.orgDetails?.structure==='group'){
            headers = [
                'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Organization','Branch','Department','Designation','Work Branch Timing','Work Shift Timing','Qualification','Blood Group','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
            ];
            sampleRows = [
                ['EMP001', 'Mukesh', 'Bafna', '9553737837', 'test@1234', 'mukesh.bafna@example.com', 'Male','1990-01-01', '2022-06-15', 'MWB EnterPrise','Mwb Trading', 'Accounts','Accountant','YES','NO','MBA', 'O+','12A', 'MG Road', 'Near City Mall', 'Pune', 'Pune', 'Maharashtra', 'India', '411001'],
                ['EMP002', 'Abani', 'Bafna', '9553737838', 'test@1234', 'abani.bafna@example.com', 'Male','1992-03-10', '2023-01-12', 'MWB EnterPrise', 'Mwb Trading', 'Accounts','Auditor','YES','NO','MBA', 'O+','13A', 'MG Road5', 'Near City Mall1', 'Pune', 'Pune', 'Maharashtra', 'India', '411002'],
                ['EMP003', 'Mukesh', 'Ramesh', '9553737839', 'test@1234', 'ramesh.bafna@example.com', 'Male','1991-05-20', '2021-11-01',  'MWB EnterPrise','MWb Manufacturing', 'Cleaning','Supervisor','YES','NO','MBA', 'O+','14A', 'MG Road6', 'Near City Mall2', 'Pune', 'Pune', 'Maharashtra', 'India', '411003']
            ];
        }

        if(body.orgDetails?.structure==='branch'){
            // headers = [
            //     'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Department','Designation','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
            // ];
            headers = [
                'EmployeeId',  'First Name',  'Last Name', 'Mobile Number','Password','Email(optional)','Gender(optional)','DOB','DOJ','Department','Designation','Work Branch Timing','Work Shift Timing','Qualification','Blood Group','Hno(optional)', 'Street(optional)', 'LandMark(optional)', 'City(optional)', 'District(optional)', 'State(optional)', 'Country(optional)', 'Pincode(optional)'
            ];      
            sampleRows = [
                ['EMP001', 'Mukesh', 'Bafna', '9553737837', 'test@1234', 'mukesh.bafna@example.com', 'Male','1990-01-01', '2022-06-15', 'Accounts','Accountant','YES','NO','MBA', 'O+','12A','MG Road', 'Near City Mall', 'Pune', 'Pune', 'Maharashtra', 'India', '411001'],
                ['EMP002', 'Abani', 'Bafna', '9553737838', 'test@1234', 'abani.bafna@example.com', 'Male','1992-03-10', '2023-01-12',  'Accounts','Auditor','NO','Morning Shift','B.Com', 'O+','13A','MG Road5', 'Near City Mall1', 'Pune', 'Pune', 'Maharashtra', 'India', '411002'],
                ['EMP003', 'Mukesh', 'Ramesh', '9553737839', 'test@1234', 'ramesh.bafna@example.com', 'Male','1991-05-20', '2021-11-01', 'Cleaning','Supervisor','YES','NO','Diploma','O+','14A', 'MG Road6', 'Near City Mall2', 'Pune', 'Pune', 'Maharashtra', 'India', '411003']
            ];
        }

        
          

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Employee Template');

        sheet.columns = headers.map(header => ({ header, key: header }));

        // Unlock all cells initially
        sheet.eachRow({ includeEmpty: true }, row => {
            row.eachCell(cell => {
                cell.protection = { locked: false };
            });
        });

        // Header formatting & lock
        const headerRow = sheet.getRow(1);
        headerRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFCCE5FF' }
            };
            cell.protection = { locked: true };
        });

        // Add sample data and lock
        sampleRows.forEach((rowData) => {
            const row = sheet.addRow(rowData);
            row.eachCell(cell => {
                cell.protection = { locked: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE6E6E6' }
                };
            });
        });


         // Apply dropdowns to data rows (from row 5 to 105)
         const applyDropdown = (colLetter, options) => {
            for (let i = 5; i <= 105; i++) {
                sheet.getCell(`${colLetter}${i}`).dataValidation = {
                    type: 'list',
                    allowBlank: true,
                    formulae: [`"${options.join(',')}"`],
                    showDropDown: true
                };
            }
        };

        applyDropdown('G', genderType);  // BussinessType
        
         // L = Work Branch Timing
        applyDropdown("L", branchTimingOptions);
        // M = Work Shift Timing
        applyDropdown("M", shiftOptions);
       
        // ✅ Add instruction row
    sheet.insertRow(2, [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "👉 If Work Branch Timing = YES, keep Work Shift Timing = NO",
      ]);

      const instructionRow = sheet.getRow(2);
    instructionRow.eachCell((cell) => {
      cell.font = { italic: true, color: { argb: "FF0070C0" } };
    });

        

        // Unlock cells from row 5 to 105
        for (let i = 5; i <= 105; i++) {
            const row = sheet.getRow(i);
            for (let j = 1; j <= headers.length; j++) {
                row.getCell(j).protection = { locked: false };
            }
        }

        // Protect sheet
        await sheet.protect('teju123', {
            selectLockedCells: true,
            selectUnlockedCells: true
        });

        // Auto width
        sheet.columns.forEach(col => {
            let maxLen = col.header.length;
            col.eachCell({ includeEmpty: true }, cell => {
                const len = cell.value ? cell.value.toString().length : 0;
                maxLen = Math.max(maxLen, len + 2);
            });
            col.width = maxLen;
        });

        const destFolder = `assets/employee/excelformat`;
        const fileName = `EmployeeImportTemplate_${Date.now()}.xlsx`;
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
        const filePath = path.join(destFolder, fileName);
        await workbook.xlsx.writeFile(filePath);

        return { status: true, data: `/api/v1/employee/excel/format/${fileName}` };
    } catch (error) {
        console.error("Error while generating employee Excel:", error);
        return { status: false, message: "Failed to generate employee Excel" };
    }
};

export const employeeExcelFormat = async (body) => {
    try {
      const genderType = ["Male", "Female"];
      const branchTimingOptions = ["YES", "NO"];
      let shiftOptions = ["NO"];
      const branchSalarySettingsOptions=["YES", "NO"];
      const loanType=["Personal","Advance",'None'];
      const loanStatus=['Active','Closed','None'];
      const martialStatusOptions=['Single','Married'];
      const bloodGroupOptions=["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]

  
      // 🔹 Fetch shift list from API
      try {
        const shiftRes = await shiftModel.listShift({ query: {}, ...body });
        if (shiftRes.data?.length) {
          const apiShifts = shiftRes.data.map((s) => s.name).filter(Boolean);
          shiftOptions = ["NO", ...apiShifts];
        }
      } catch (err) {
        console.warn("Shift API failed, using default NO option only", err.message);
      }
  
      // 🔹 Headers & Sample Data (default structure)
      let headers = [
        "EmployeeId",
        "First Name",
        "Last Name",
        "Mobile Number",
        "Password",
        "Email(optional)",
        "Gender(optional)",
        "DOB",
        "DOJ",
        "Branch",
        "Department",
        "Designation",
        "Work Branch Timing",
        "Work Shift Timing",
        "Default Branch Salary Setting",
        "Qualification",
        "Blood Group",
        "Guardian Name",
        "Guardian Number",
        "Emergency Number",
        "Marital Status",
        "Hno(optional)",
        "Street(optional)",
        "LandMark(optional)",
        "City(optional)",
        "District(optional)",
        "State(optional)",
        "Country(optional)",
        "Pincode(optional)",
        "Loan Type(optional)",
        "Loan/Advance Amount(optional)",
        "Issued Date(optional)",
        "Total Installments(optional)",
        "EMI Amount(optional)",
        "Amount Paid(optional)",
        "Balance Amount(optional)",
        "Loan/Adavance Status(optional)"
      ];
  
      let sampleRows = [
        [
          "EMP001",
          "Mukesh",
          "Bafna",
          "9553737837",
          "Test@123",
          "mukesh.bafna@example.com",
          "Male",
          "1990-01-01",
          "2022-06-15",
          "Mwb Trading",
          "Accounts",
          "Accountant",
          "YES",
          "NO",
          "NO",
          "MBA",
          "O+",
          "Mukesh Bafna",
          "9998887770",
          "9998887771",
          "Married",
          "12A",
          "MG Road",
          "Near City Mall",
          "Pune",
          "Pune",
          "Maharashtra",
          "India",
          "411001",
          "Personal Loan",
          "50000",
          "2024-11-01",
          "10",
          "5000",
          "16500",
          "33500",
          "Active"
        ],
        [
          "EMP002",
          "Abani",
          "Bafna",
          "9553737838",
          "Test@123",
          "abani.bafna@example.com",
          "Male",
          "1992-03-10",
          "2023-01-12",
          "Mwb Trading",
          "Accounts",
          "Auditor",
          "NO",
          shiftOptions[1] || "Morning Shift",
          "NO",
          "MBA",
          "O+",
          "Mukesh Bafna",
          "9998887770",
          "9998887771",
          "Single",
          "13A",
          "MG Road5",
          "Near City Mall1",
          "Pune",
          "Pune",
          "Maharashtra",
          "India",
          "411002",
          "Advance Loan",
          "50000",
          "2024-11-01",
          "10",
          "0",
          "16500",
          "33500",
          "Active"
        ],
        [
          "EMP003",
          "Ramesh",
          "Kumar",
          "9553737839",
          "Test@123",
          "ramesh.kumar@example.com",
          "Male",
          "1991-05-20",
          "2021-11-01",
          "MWB Manufacturing",
          "Cleaning",
          "Supervisor",
          "YES",
          "NO",
          "NO",
          "Diploma",
          "O+",
          "Mukesh Bafna",
          "9998887770",
          "9998887771",
          "Married",
          "14A",
          "MG Road6",
          "Near City Mall2",
          "Pune",
          "Pune",
          "Maharashtra",
          "India",
          "411003",
          "None",
          "0",
          "",
          "0",
          "0",
          "0",
          "0",
          "None"
        ],
      ];
  
      // 🔹 Group structure case
      if (body.orgDetails?.structure === "group") {
        headers = [
          "EmployeeId",
          "First Name",
          "Last Name",
          "Mobile Number",
          "Password",
          "Email(optional)",
          "Gender(optional)",
          "DOB",
          "DOJ",
          "Organization",
          "Branch",
          "Department",
          "Designation",
          "Work Branch Timing",
          "Work Shift Timing",
          "Default Branch Salary Setting",
          "Qualification",
          "Blood Group",
          "Guardian Name",
          "Guardian Number",
          "Emergency Number",
          "Marital Status",
          "Hno(optional)",
          "Street(optional)",
          "LandMark(optional)",
          "City(optional)",
          "District(optional)",
          "State(optional)",
          "Country(optional)",
          "Pincode(optional)",
          "Loan Type(optional)",
        "Loan/Advance Amount(optional)",
        "Issued Date(optional)",
        "Total Installments(optional)",
        "EMI Amount(optional)",
        "Amount Paid(optional)",
        "Balance Amount(optional)",
        "Loan/Adavance Status(optional)"
        ];
      }
  
      // 🔹 Branch structure case
      if (body.orgDetails?.structure === "branch") {
        headers = [
          "EmployeeId",
          "First Name",
          "Last Name",
          "Mobile Number",
          "Password",
          "Email(optional)",
          "Gender(optional)",
          "DOB",
          "DOJ",
          "Department",
          "Designation",
          "Work Branch Timing",
          "Work Shift Timing",
          "Default Branch Salary Setting",
          "Qualification",
          "Blood Group",
          "Guardian Name",
          "Guardian Number",
          "Emergency Number",
          "Marital Status",
          "Hno(optional)",
          "Street(optional)",
          "LandMark(optional)",
          "City(optional)",
          "District(optional)",
          "State(optional)",
          "Country(optional)",
          "Pincode(optional)",
          "Loan Type(optional)",
        "Loan/Advance Amount(optional)",
        "Issued Date(optional)",
        "Total Installments(optional)",
        "EMI Amount(optional)",
        "Amount Paid(optional)",
        "Balance Amount(optional)",
        "Loan/Adavance Status(optional)"
        ];

        sampleRows= [
            [
              "EMP001",
              "Mukesh",
              "Bafna",
              "9553737837",
              "Test@123",
              "mukesh.bafna@example.com",
              "Male",
              "1990-01-01",
              "2022-06-15",
              "Accounts",
              "Accountant",
              "YES",
              "NO",
              "NO",
              "MBA",
              "O+",
              "Mukesh Bafna",
              "9998887770",
              "9998887771",
              "Single",
              "12A",
              "MG Road",
              "Near City Mall",
              "Pune",
              "Pune",
              "Maharashtra",
              "India",
              "411001",
              "Personal Loan",
              "50000",
              "2024-11-01",
              "10",
              "5000",
              "16500",
              "33500",
              "Active"
            ],
            [
              "EMP002",
              "Abani",
              "Bafna",
              "9553737838",
              "Test@123",
              "abani.bafna@example.com",
              "Male",
              "1992-03-10",
              "2023-01-12",
              "Accounts",
              "Auditor",
              "NO",
              shiftOptions[1] || "Morning Shift",
              "NO",
              "MBA",
              "O+",
              "Mukesh Bafna",
              "9998887770",
              "9998887771",
              "Single",
              "13A",
              "MG Road5",
              "Near City Mall1",
              "Pune",
              "Pune",
              "Maharashtra",
              "India",
              "411002",
              "Advance Loan",
              "50000",
              "2024-11-01",
              "10",
              "0",
              "16500",
              "33500",
              "Active"
            ],
            [
              "EMP003",
              "Ramesh",
              "Kumar",
              "9553737839",
              "Test@123",
              "ramesh.kumar@example.com",
              "Male",
              "1991-05-20",
              "2021-11-01",
              "Cleaning",
              "Supervisor",
              "YES",
              "NO",
              "NO",
              "Diploma",
              "O+",
              "Mukesh Bafna",
              "9998887770",
              "9998887771",
              "Married",
              "14A",
              "MG Road6",
              "Near City Mall2",
              "Pune",
              "Pune",
              "Maharashtra",
              "India",
              "411003",
              "None",
              "0",
              "",
              "0",
              "0",
              "0",
              "0",
              "None"
            ],
        ];
      }
  
      // ✅ Workbook setup
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Employee Template");
      sheet.columns = headers.map((header) => ({ header, key: header }));
  
      // Unlock all cells initially
      sheet.eachRow({ includeEmpty: true }, (row) => {
        row.eachCell((cell) => {
          cell.protection = { locked: false };
        });
      });
  
      // Header style
      const headerRow = sheet.getRow(1);
      headerRow.eachCell((cell) => {
        cell.font = { bold: true };
        cell.alignment = { horizontal: "center" };
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFCCE5FF" },
        };
        cell.protection = { locked: true };
      });
  
      // Sample data
      sampleRows.forEach((rowData) => {
        const row = sheet.addRow(rowData);
        row.eachCell((cell) => {
          cell.protection = { locked: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFE6E6E6" },
          };
        });
      });
  
      // 🔹 Utility: get Excel column letter from index
      const getColumnLetter = (colIndex) => {
        let letter = "";
        while (colIndex > 0) {
          const remainder = (colIndex - 1) % 26;
          letter = String.fromCharCode(65 + remainder) + letter;
          colIndex = Math.floor((colIndex - 1) / 26);
        }
        return letter;
      };
  
      // Find column positions dynamically
      const branchTimingIndex = headers.indexOf("Work Branch Timing") + 1;
      const shiftTimingIndex = headers.indexOf("Work Shift Timing") + 1;
      const genderIndex = headers.indexOf("Gender(optional)") + 1;
      const salarySeetingIndex=headers.indexOf('Default Branch Salary Setting')+1;
      const loanTypeIndex=headers.indexOf('Loan Type(optional)')+1;
      const loanStatusIndex=headers.indexOf('Loan/Adavance Status(optional)')+1;
      const martialStatusIndex=headers.indexOf('Marital Status')+1;
      const bloddGroupIndex=headers.indexOf('Blood Group')+1;
  
      const branchCol = getColumnLetter(branchTimingIndex);
      const shiftCol = getColumnLetter(shiftTimingIndex);
      const genderCol = getColumnLetter(genderIndex);
      const salaryCol=getColumnLetter(salarySeetingIndex);
      const loanTypeCol=getColumnLetter(loanTypeIndex);
      const loanStatusCol=getColumnLetter(loanStatusIndex);
      const martialStatusCol=getColumnLetter(martialStatusIndex);
      const bloodGroupCol=getColumnLetter(bloddGroupIndex)
  
      // 🔹 Apply dropdowns (from row 5–105)
      const applyDropdown = (colLetter, options) => {
        for (let i = 5; i <= 105; i++) {
          sheet.getCell(`${colLetter}${i}`).dataValidation = {
            type: "list",
            allowBlank: true,
            formulae: [`"${options.join(",")}"`],
            showDropDown: true,
          };
        }
      };
  
      applyDropdown(genderCol, genderType);
      applyDropdown(branchCol, branchTimingOptions);
      applyDropdown(shiftCol, shiftOptions);
      applyDropdown(salaryCol,branchSalarySettingsOptions);
      applyDropdown(loanTypeCol,loanType);
      applyDropdown(loanStatusCol,loanStatus);
      applyDropdown(martialStatusCol,martialStatusOptions);
      applyDropdown(bloodGroupCol,bloodGroupOptions)
  
      // 🔹 Instruction Row
      sheet.insertRow(2, [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "👉 If Work Branch Timing = YES, keep Work Shift Timing = NO",
      ]);
      const instructionRow = sheet.getRow(2);
      instructionRow.eachCell((cell) => {
        cell.font = { italic: true, color: { argb: "FF0070C0" } };
      });
  
      // Unlock rows for editing
      for (let i = 5; i <= 105; i++) {
        const row = sheet.getRow(i);
        for (let j = 1; j <= headers.length; j++) {
          row.getCell(j).protection = { locked: false };
        }
      }
  
      // Protect the sheet
      await sheet.protect("teju123", {
        selectLockedCells: true,
        selectUnlockedCells: true,
      });
  
      // Auto width
      sheet.columns.forEach((col) => {
        let maxLen = col.header?.length ?? 5;
        col.eachCell({ includeEmpty: true }, (cell) => {
          const len = cell.value ? cell.value.toString().length : 0;
          maxLen = Math.max(maxLen, len + 2);
        });
        col.width = maxLen;
      });
  
      // Save file
      const destFolder = `assets/employee/excelformat`;
      const fileName = `EmployeeImportTemplate_${Date.now()}.xlsx`;
      if (!fs.existsSync(destFolder)) {
        fs.mkdirSync(destFolder, { recursive: true });
      }
      const filePath = path.join(destFolder, fileName);
      await workbook.xlsx.writeFile(filePath);
  
      return { status: true, data: `/api/v1/employee/excel/format/${fileName}` };
    } catch (error) {
      console.error("❌ Error while generating employee Excel:", error);
      return { status: false, message: "Failed to generate employee Excel" };
    }
  };
  

export const extractImportEmployeeExcel = async (request, response, next) => {
    const sampleRows = ['EMP001', 'EMP002', 'EMP003', '9553737837', '9553737838', '9553737839'];
    const mapRowFn = (row) => {
        const dateOfBirth = parseExcelDate(row['DOB']);
        const joinDate = parseExcelDate(row['DOJ']);
        const emp = {
            employeeId: normalize(row['EmployeeId']),
            firstName: normalize(row['First Name']),
            lastName: normalize(row['Last Name']),
            mobile: normalize(row['Mobile Number']),
            password: normalize(row['Password']),
            email: normalize(row['Email(optional)']),
            gender: normalize(row['Gender(optional)']),
            dateOfBirth: normalize(dateOfBirth),
            joinDate: normalize(joinDate),
            // branch: normalize(row['Branch']),
            department: normalize(row['Department']),
            designation: normalize(row['Designation']),
            address: {
                hno: normalize(row['Hno(optional)']),
                street: normalize(row['Street(optional)']),
                landmark: normalize(row['LandMark(optional)']),
                city: normalize(row['City(optional)']),
                district: normalize(row['District(optional)']),
                state: normalize(row['State(optional)']),
                country: normalize(row['Country(optional)']) ?? 'India',
                pincode: normalize(row['Pincode(optional)'])
            },
            workTimingType:normalize(row["Work Branch Timing"]),
            shiftIds:normalize(row["Work Shift Timing"]),
            bloodGroup:normalize(row["Blood Group"]),
            qualification:normalize(row['Qualification']),
            salaryConfig:normalize(row["Default Branch Salary Setting"]),
            isSubOrg:false,
            emergencyNumber:normalize(row["Emergency Number"]),
            guardianNumber:normalize(row["Guardian Number"]),
            guardianName:normalize(row['Guardian Name']),
            financialDetails:{
                loanType:normalize(row['Loan Type(optional)']),
                amount:normalize(row["Loan/Advance Amount(optional)"]),
                issuedDate:normalize(row['Issued Date(optional)']),
                totalInstallments:normalize(row['Total Installments(optional)']),
                emiAmount:normalize(row['EMI Amount(optional)']),
                amountPaid:normalize(row['Amount Paid(optional)']),
                balanceAmount:normalize(row['Balance Amount(optional)']),
                loanAdvanceStatus:normalize(row['Loan/Adavance Status(optional)'])
            },
            martialStatus:normalize(row['Marital Status'])
            
            
        };
        if (request.body.orgDetails?.structure === 'group') {
            emp.subOrganization = normalize(row['Organization']);
            emp.isSubOrg=true
        }
        if (request.body.orgDetails?.structure === 'organization' || request.body.orgDetails?.structure === 'group') {
            emp.branch = normalize(row['Branch']);
        }
        return emp;
    };
    let uniqueKeys = [
        'employeeId', 'mobile', 'department', 'designation'
    ];
    if (request.body.orgDetails?.structure === 'organization' || request.body.orgDetails?.structure === 'group') {
        uniqueKeys = [
            'employeeId', 'mobile', 'branch', 'department', 'designation'
        ];
    }
    const validateFn = isCheckEmployeeValidations;

    return extractExcelData({
        request,
        response,
        sampleRows,
        mapRowFn,
        uniqueKeys,
        validateFn,
        dirPath:'assets/files/import/employee',
    });
};

export const getWorkingDaysTillToday=(year, month)=>{
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && (today.getMonth() + 1) === month;
  
    const endDay = isCurrentMonth ? today.getDate() : new Date(year, month, 0).getDate();
  
    let workingDays = 0;
    const date = new Date(year, month - 1, 1);
  
    while (date.getDate() <= endDay && date.getMonth() === (month - 1)) {
      const day = date.getDay(); // Sunday = 0
      if (day !== 0) workingDays++;
      date.setDate(date.getDate() + 1);
    }

    const monthDays = moment(`${year}-${month}`, 'YYYY-M').daysInMonth();
  
    // return workingDays,monthDays;
    return { workingDays, monthDays };
}
  


const generateDuplicateExcel = async ({
    data,
    headers,
    sheetName,
    note,
    destFolder,
    filePrefix
}) => {
    try {
        if (!data || !data.length) {
            return { status: false, message: 'No data to export' };
        }

        const formattedData = data.map(item => {
            const row = {};
            headers.forEach(h => {
                row[h.key] = typeof h.value === 'function' ? h.value(item) : (item[h.key] ?? '');
            });
            return row;
        });

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(sheetName);

        worksheet.columns = headers.map(h => ({
            header: h.header,
            key: h.key,
            width: h.width || 25,
            style: {
                font: { bold: true },
                alignment: {
                    vertical: 'middle',
                    horizontal: 'center',
                    wrapText: true
                }
            }
        }));

        // Insert Note row (top of sheet)
        // const lastColLetter = String.fromCharCode(64 + headers.length);
        // worksheet.insertRow(1, []);
        // worksheet.mergeCells(`A1:${lastColLetter}1`);
        // const noteCell = worksheet.getCell('A1');
        // noteCell.value = note;
        // noteCell.font = { bold: true, italic: true, size: 12 };
        // noteCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
        // noteCell.fill = {
        //     type: 'pattern',
        //     pattern: 'solid',
        //     fgColor: { argb: 'FFFFF2CC' }
        // };
        // worksheet.getRow(1).height = 35;

        // Add data rows
        formattedData.forEach(row => worksheet.addRow(row));


        // Header row (1st row) styling
        worksheet.getRow(1).eachCell(cell => {
            cell.protection = { locked: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFDCE6F1' }
            };
            cell.font = { bold: true };
            cell.alignment = {
                vertical: 'middle',
                horizontal: 'center',
                wrapText: true
            };
        });
        worksheet.getRow(1).height = 35;

        // Apply red fill to "Status" column header after default styling
        const statusColIndex = headers.findIndex(h => h.key === 'status') + 1;
        const statusHeaderCell = worksheet.getRow(1).getCell(statusColIndex);
        statusHeaderCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' } // Red background
        };
        statusHeaderCell.font = {
            bold: true,
            color: { argb: 'FFFFFFFF' } // White text
        };

        // Unlock data rows
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 2) {
                row.eachCell(cell => {
                    cell.protection = { locked: false };
                });
                row.alignment = { vertical: 'top', wrapText: true };
                row.height = sheetName === 'Duplicate Employees' ? 60 : 30;
            }
        });

        // Freeze headers
        worksheet.views = [{ state: 'frozen', ySplit: 2 }];

        // Protect Sheet
        // await worksheet.protect('mwb@123', {
        //     selectLockedCells: true,
        //     selectUnlockedCells: true,
        //     formatCells: false,
        //     insertRows: false,
        //     deleteRows: false,
        //     editObjects: false
        // });

        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
        }
        const fileName = `${filePrefix}_${Date.now()}.xlsx`;
        const filePath = path.join(destFolder, fileName);
        await workbook.xlsx.writeFile(filePath);

        return {
            status: true,
            data: `/api/v1/${filePrefix.includes('client') ? 'client' : 'employee'}/excel/duplicate/${fileName}`
        };
    } catch (error) {
        console.error('Excel generation failed:', error);
        return { status: false, message: 'Failed to generate Excel' };
    }
};

/**
 * Optimized: clientResponseExcelFormat
 */
export const clientResponseExcelFormat = async (data) => {
    const headers = [
        { header: 'Status', key: 'status', value: item => item.status || '' },
        { header: 'Organization', key: 'name', value: item => item.name || '' },
        { header: 'Bussiness Type', key: 'businessType', value: item => item.businessType || item.bussinesstype || '' },
        { header: 'Owner First Name', key: 'firstName', value: item => item.ownerName?.firstName || item.firstName || '' },
        { header: 'Owner Last Name', key: 'lastName', value: item => item.ownerName?.lastName || item.lastName || '' },
        { header: 'Owner Mobile Number', key: 'mobile', value: item => item.mobile || '' },
        { header: 'Branch Name', key: 'branchName', value: item => item.branchName || '' },
        { header: 'PAN', key: 'panNo', value: item => item.panNo || '' },
        { header: 'GST', key: 'gstNo', value: item => item.gstNo || '' },
        { header: 'No. of Shifts', key: 'NoOfShifts', value: item => item.NoOfShifts || '' },
        { header: 'No.of Male Supervisors', key: 'noOfMaleSupervisors', value: item => item.noOfMaleSupervisors || '' },
        { header: 'No.of Female Supervisors', key: 'noOfFemaleSupervisors', value: item => item.noOfFemaleSupervisors || '' },
        { header: 'No.of Male Guards', key: 'noOfMaleGuards', value: item => item.noOfMaleGuards || '' },
        { header: 'No.of Female Guards', key: 'noOfFemaleGuards', value: item => item.noOfFemaleGuards || '' },
        { header: 'DutyPoint', key: 'dutyPoint', value: item => item.dutyPoint || '' },
        { header: 'CheckPoint', key: 'checkPoint', value: item => item.checkPoint || '' },
        { header: 'Hno(optional)', key: 'hno', value: item => item.address?.hno || item.hno || '' },
        { header: 'Street(optional)', key: 'street', value: item => item.address?.street || item.street || '' },
        { header: 'LandMark(optional)', key: 'landmark', value: item => item.address?.landmark || item.landmark || '' },
        { header: 'City(optional)', key: 'city', value: item => item.address?.city || item.city || '' },
        { header: 'District(optional)', key: 'district', value: item => item.address?.district || item.district || '' },
        { header: 'State(optional)', key: 'state', value: item => item.address?.state || item.state || '' },
        { header: 'Country(optional)', key: 'country', value: item => item.address?.country || item.country || 'India' },
        { header: 'Pincode(optional)', key: 'pincode', value: item => item.address?.pincode || item.pincode || '' }
    ];
    return generateDuplicateExcel({
        data,
        headers,
        sheetName: 'Duplicate Data',
        note: '⚠️ Note: Upload this same file after correcting the issues mentioned in the Status column.',
        destFolder: `assets/client/excelduplicate`,
        filePrefix: 'duplicate_clients'
    });
};

/**
 * Optimized: employeeResponseExcelFormat
 */
export const employeeResponseExcelFormat = async (data) => {
    const headers = [
        { header: 'Status', key: 'status', value: item => item.status || 'Duplicate', width: 80 },
        { header: 'EmployeeId', key: 'employeeId', value: item => item.employeeId || '' },
        { header: 'First Name', key: 'firstName', value: item => item.firstName || '' },
        { header: 'Last Name', key: 'lastName', value: item => item.lastName || '' },
        { header: 'Mobile Number', key: 'mobile', value: item => item.mobile || '' },
        { header: 'Password', key: 'password', value: item => item.password || '' },
        { header: 'Email(optional)', key: 'email', value: item => item.email || '' },
        { header: 'Gender(optional)', key: 'gender', value: item => item.gender || '' },
        { header: 'DOB', key: 'dob', value: item => item.dob || item.dateOfBirth || '' },
        { header: 'DOJ', key: 'doj', value: item => item.doj || item.joinDate || '' },
        { header: 'Organization', key: 'subOrganization', value: item => item.subOrganization || '', width: 25 },
        { header: 'Branch', key: 'branch', value: item => item.branch || '' },
        { header: 'Department', key: 'department', value: item => item.department || '' },
        { header: 'Designation', key: 'designation', value: item => item.designation || '' },

        { header: 'Work Branch Timing', key: 'workTimingType', value: item => item.workTimingType || '' },
        { header: 'Work Shift Timing', key: 'shiftIds', value: item => item.shiftIds || '' },
        { header: 'Default Branch Salary Setting', key: 'salaryConfig', value: item => item.salaryConfig || '' },
        { header: 'Qualification', key: 'qualification', value: item => item.qualification || '' },
        { header: 'Blood Group', key: 'bloodGroup', value: item => item.bloodGroup || '' },
        { header: 'Guardian Name', key: 'guardianName', value: item => item.guardianName || '' },
        { header: 'Guardian Number', key: 'guardianNumber', value: item => item.guardianNumber || '' },
        { header: 'Emergency Number', key: 'emergencyNumber', value: item => item.emergencyNumber || '' },
       


        { header: 'Hno(optional)', key: 'hno', value: item => item.address?.hno || item.hno || '' },
        { header: 'Street(optional)', key: 'street', value: item => item.address?.street || item.street || '' },
        { header: 'LandMark(optional)', key: 'landmark', value: item => item.address?.landmark || item.landmark || '' },
        { header: 'City(optional)', key: 'city', value: item => item.address?.city || item.city || '' },
        { header: 'District(optional)', key: 'district', value: item => item.address?.district || item.district || '' },
        { header: 'State(optional)', key: 'state', value: item => item.address?.state || item.state || '' },
        { header: 'Country(optional)', key: 'country', value: item => item.address?.country || item.country || 'India' },
        { header: 'Pincode(optional)', key: 'pincode', value: item => item.address?.pincode || item.pincode || '' },


        { header: 'Loan Type(optional)', key: 'loanType', value: item => item.financialDetails?.loanType || '' },
        { header: 'Loan/Advance Amount(optional)', key: 'amount', value: item => item.financialDetails?.amount || '' },
        { header: 'Issued Date(optional)', key: 'issuedDate', value: item => item.financialDetails?.issuedDate || '' },
        { header: 'Total Installments(optional)', key: 'totalInstallments', value: item => item.financialDetails?.totalInstallments || '' },
        { header: 'EMI Amount(optional)', key: 'emiAmount', value: item => item.financialDetails?.emiAmount || '' },
        { header: 'Amount Paid(optional)', key: 'amountPaid', value: item => item.financialDetails?.amountPaid || '' },
        { header: 'Balance Amount(optional)', key: 'balanceAmount', value: item => item.financialDetails?.balanceAmount || '' },
        { header: 'Loan/Advance Status(optional)', key: 'loanAdvanceStatus', value: item => item.financialDetails?.loanAdvanceStatus || '' },
    ];
    // Remove Organization column if not present in any row
    const hasOrg = data.some(item => item.subOrganization);
    const hasBranch=data.some(item=> item.branch);
    const filteredHeaders = headers.filter((h) => {
        if(!hasOrg && h.key === 'subOrganization') return false;
        if(!hasBranch && h.key === 'branch') return false;
        return true;
    });
    return generateDuplicateExcel({
        data,
        headers: filteredHeaders,
        sheetName: 'Duplicate Employees',
        note: '⚠️ Note: Upload this same file after correcting the issues mentioned in the Status column.',
        destFolder: `assets/employee/excelduplicate`,
        filePrefix: 'duplicate_employees'
    });
};

export const calcuateTime = (seconds) => {
    if (seconds < 60 * 1000) {
        return `${Math.round(seconds / 1000)} second${Math.round(seconds / 1000) === 1 ? '' : 's'}`;
    } else if (seconds < 60 * 60 * 1000) {
        const mins = Math.round(seconds / (60 * 1000));
        return `${mins} minute${mins === 1 ? '' : 's'}`;
    } else {
        const hours = (seconds / (60 * 60 * 1000)).toFixed(2).replace(/^0+/, '');
        return `${hours} hour${hours === "1.00" ? '' : 's'}`;
    }                
}


export const extractUniqueValues = (data, fields) => {
  const seen = {}
  const result = {}

  for (const field of fields) {
    seen[field] = new Set();
    result[field] = [];
  }

  for (let i = 0; i < data.length; i++) {
    const doc = data[i];

    for (let j = 0; j < fields.length; j++) {
      const field = fields[j];
      const value = doc[field];

      // Skip invalid values
      if (
        value === undefined ||
        value === null ||
        (typeof value === "string" && value.trim() === "")
      ) continue;

      // Convert to string for comparison
      const key = typeof value === "object" && value?.toString ? value.toString() : String(value);

      if (!seen[field].has(key)) {
        seen[field].add(key);
        result[field].push(value); // Keep original value
      }
    }
  }

  return result;
}


export const calculateBreakMinutesFromLogs = (logs) => {
    let lastOut = null;
    let totalBreakMinutes = 0;
  
    for (const log of logs) {
      if (log.type === 'checkOut') {
        lastOut = moment(log.transactionDate);
      }
      if (log.type === 'checkIn' && lastOut) {
        const currentIn = moment(log.transactionDate);
        const diff = currentIn.diff(lastOut, 'minutes');
        if (diff > 0) totalBreakMinutes += diff;
        lastOut = null;
      }
    }
  
    return totalBreakMinutes;
  };

export const matchisActiveStr = (str) => {
    if (!str) return null;

    const isMatchActive = "active".includes(str);
    const isMatchInactive = "inactive".includes(str);

    if (isMatchActive && !isMatchInactive) return true;
    if (!isMatchActive && isMatchInactive) return false;

    // If both match, decide based on closeness (length or index)
    if (isMatchActive && isMatchInactive) {
        const indexActive = "active".indexOf(str);
        const indexInactive = "inactive".indexOf(str);

        // Prefer earlier index match or shorter distance
        return indexActive <= indexInactive ? true : false;
    }

    return null; // No match
}

export const findMatchingShift = (shifts, targetDateTime, currentShift = [], branchTimings = []) => {
try {
    const matchingShifts = [];
    const upcomingShifts = [];
    // Loop for today and tomorrow's shifts
    const dayOffsets = [0]; // 0 = today, 1 = tomorrow
    
    if(currentShift && currentShift.length > 0) {
        let shiftIds = currentShift.map(cs => cs._id.toString());
       shifts = shifts.filter(cs => shiftIds.includes(cs._id.toString()));
    }

    // for branch timings configuration
    if(!currentShift.length && branchTimings && branchTimings.length > 0) shifts = branchTimings

    for (const shift of shifts) {
        for (const offset of dayOffsets) {
            const shiftStart = new Date(targetDateTime);
            shiftStart.setDate(shiftStart.getDate() + offset);
            const [startHour, startMin] = shift.startTime.split(":").map(Number);
            shiftStart.setHours(startHour, startMin, 0, 0);

            const shiftEnd = new Date(shiftStart);
            const [endHour, endMin] = shift.endTime.split(":").map(Number);
            shiftEnd.setHours(endHour, endMin, 0, 0);

            // Handle overnight shift
            if (shiftEnd <= shiftStart) {
                shiftEnd.setDate(shiftEnd.getDate() + 1);
            }

            // Apply grace period
            const adjustedShiftStart = new Date(shiftStart);
            const adjustedShiftEnd = new Date(shiftEnd);

            if (shift.minIn) {
                const [minHour, minMin] = shift.minIn.split(":").map(Number);
                adjustedShiftStart.setHours(minHour, minMin, 0, 0);
            }

            if (shift.maxOut) {
                const [maxHour, maxMin] = shift.maxOut.split(":").map(Number);
                adjustedShiftEnd.setHours(maxHour, maxMin, 0, 0);
            }

            // if (adjustedShiftStart > targetDateTime) {
            //     matchingShifts.push({
            //         ...shift,
            //         shiftStart,
            //         shiftEnd,
            //         timeDiff: Math.abs(shift.adjustedShiftStart - targetDateTime),
            //         matchType: "upcoming",
            //         source: "upcoming",
            //         adjustedShiftStart,
            //         adjustedShiftEnd
            //     });
            // }

            let matchType = null;
            // if (targetDateTime >= adjustedShiftStart && targetDateTime <= adjustedShiftEnd) {
                if (targetDateTime <= adjustedShiftStart) matchType = "early";
                else if (targetDateTime >= shiftStart && targetDateTime <= adjustedShiftStart)
                    matchType = "on-time";
                else matchType = "late";

                matchingShifts.push({
                    ...shift,
                    matchType,
                    workTimingType: shift.workTimingType == 'branch' ? "branch" : "shift",
                    source: adjustedShiftStart > targetDateTime ? "upcoming" : "user",
                    timeDiff: Math.abs(adjustedShiftStart - targetDateTime),
                    shiftStart,
                    shiftEnd,
                    adjustedShiftStart,
                    adjustedShiftEnd
                });
            // }
        }
    }

    if (matchingShifts.length > 0) {
        return matchingShifts.reduce((a, b) => a.timeDiff < b.timeDiff ? a : b);
    } 
    // else if (upcomingShifts.length > 0) {
    //     return upcomingShifts.reduce((a, b) => (a.timeDiff < b.timeDiff ? a : b));
    // } else {
    //     return null;
    // }
}
catch (error) {
    throw error
}

}

export const getShiftDates = (shift, transactionDate = new Date()) => {
    const shiftStart = new Date(transactionDate);
    shiftStart.setDate(shiftStart.getDate() + 0);
    const [startHour, startMin] = shift.startTime.split(":").map(Number);
    shiftStart.setHours(startHour, startMin, 0, 0);

    const shiftEnd = new Date(shiftStart);
    const [endHour, endMin] = shift.endTime.split(":").map(Number);
    shiftEnd.setHours(endHour, endMin, 0, 0);

    // Handle overnight shift
    if (shiftEnd <= shiftStart) {
        shiftEnd.setDate(shiftEnd.getDate() + 1);
    }

    // Apply grace period
    const adjustedShiftStart = new Date(shiftStart);
    const adjustedShiftEnd = new Date(shiftEnd);

    if (shift.minIn) {
        const [minHour, minMin] = shift.minIn.split(":").map(Number);
        adjustedShiftStart.setHours(minHour, minMin, 0, 0);
    }

    if (shift.maxOut) {
        const [maxHour, maxMin] = shift.maxOut.split(":").map(Number);
        adjustedShiftEnd.setHours(maxHour, maxMin, 0, 0);
    }

    return { adjustedShiftStart, adjustedShiftEnd };
}


export const setGraceTime = (dateTime, startTime, graceTime, seconds) => {
    let [hour,minute] = graceTime ? graceTime.split(':') : startTime.split(':');
    dateTime.set({ hours: hour, minutes: minute, seconds: seconds, milliseconds: seconds == 0 ? 0 : 999 }); 
    return dateTime;
}


// export const formatModulesWithNames = (roleModules, moduleNames,disabledModules,designationDisabledModulesObj ) => {
//     if (!roleModules) return null;

//     // Convert both disabled module objects to unique moduleId arrays
//     const combinedDisabledIds = [
//         ...new Set([
//         ...Object.keys(disabledModules || {}),
//         ...Object.keys(designationDisabledModulesObj || {}),
//         ]),
//     ];
  
//     const formattedModules = roleModules.modules?.filter(roleMod => !combinedDisabledIds.includes(roleMod.moduleId?.toString())).map(roleMod => {
//       const match = moduleNames.find(
//         m => m._id?.toString() === roleMod.moduleId?.toString()
//       );
  
//       return {
//         moduleId: roleMod.moduleId,
//         name: match?.name ?? null,
//         moduleKey: match?.moduleKey ?? null,
//         permissions: roleMod.permissions
//       };
//     }) ?? [];

//     // const formatDisableModules = disabledModules.map(mod => {
//     //     const match = moduleNames.find(
//     //       m => m._id?.toString() === mod.moduleId?.toString()
//     //     );
    
//     //     return {
//     //       moduleId: mod.moduleId,
//     //       name: match?.name ?? null,
//     //       moduleKey: match?.moduleKey ?? null,
//     //       permissions: mod.permissions
//     //     };
//     //   }) ?? [];


//     // Format disabled modules (merged from both sources)
//   const allDisabledModules = combinedDisabledIds.map(id => {
//     const match = moduleNames.find(m => m._id?.toString() === id);
//     const perm =
//     disabledModules[id] ||
//       designationDisabledModulesObj[id] ||
//       [];

//     return {
//       moduleId: id,
//       name: match?.name ?? null,
//       moduleKey: match?.moduleKey ?? null,
//       permissions: perm,
//     };
//   });
  
//     return {
//       _id: roleModules._id,
//       name: roleModules.name,
//       description: roleModules.description,
//       modules: formattedModules,
//     //    disabledModules: formatDisableModules
//     disabledModules: allDisabledModules
//     };
//   };


export const formatModulesWithNames = (
    roleModules,
    moduleNames,
    userDisabledModules = {},
    designationDisabledModules = {}
  ) => {
    if (!roleModules) return null;
  
    //  Merge both disabled modules uniquely by moduleId
    const combinedDisabledModules = {};
  
    const mergeDisabled = (source) => {
      for (const [moduleId, perms] of Object.entries(source || {})) {
        if (!combinedDisabledModules[moduleId]) combinedDisabledModules[moduleId] = new Set();
        perms.forEach((p) => combinedDisabledModules[moduleId].add(p));
      }
    };
  
    mergeDisabled(userDisabledModules);
    mergeDisabled(designationDisabledModules);
  
    // Convert sets to arrays
    for (const id in combinedDisabledModules) {
      combinedDisabledModules[id] = Array.from(combinedDisabledModules[id]);
    }
  
    //  Format modules: restrict permissions if they exist in disabled modules
    const formattedModules =
      roleModules.modules?.map((roleMod) => {
        const moduleId = roleMod.moduleId?.toString();
        const match = moduleNames.find((m) => m._id?.toString() === moduleId);
  
        // Remove disabled permissions if any
        const disabledPerms = combinedDisabledModules[moduleId] || [];
        const allowedPerms = roleMod.permissions.filter(
          (p) => !disabledPerms.includes(p)
        );
  
        return {
          moduleId,
          name: match?.name ?? null,
          moduleKey: match?.moduleKey ?? null,
          permissions: allowedPerms,
        };
      }) ?? [];
  
    // Prepare formatted disabledModules array
    const allDisabledModules = Object.entries(combinedDisabledModules).map(
      ([id, perms]) => {
        const match = moduleNames.find((m) => m._id?.toString() === id);
        return {
          moduleId: id,
          name: match?.name ?? null,
          moduleKey: match?.moduleKey ?? null,
          permissions: perms,
        };
      }
    );
  
    // Final formatted role
    return {
      _id: roleModules._id,
      name: roleModules.name,
      description: roleModules.description,
      modules: formattedModules,
      disabledModules: allDisabledModules,
    };
};
  
export const formatEmergencyContacts=(data)=>{
    const contacts=data.map(item=>{
        return item.contacts.map(c=>({"_id":item._id,...c}));
    });

    return {
        "orgId":data[0]?._id,
        "clientmappedId":data[0]?.clientmappedId,
        "createdBy":data[0]?.createdBy,
        "isActive":data[0]?.isActive,
        contacts:contacts.flat()
    }

}

export const getMaximumSerialContact=(data)=>{
    let maxSerial=0;
    data.forEach(item=>{
        item.contacts.forEach(c=>{
            if(c.serialNo > maxSerial) maxSerial=c.serialNo;
        })
    });
    return maxSerial;
}


export const mergeExistingAndNewContact=(existingContacts,newContacts)=>{
    const contactMap={};
    existingContacts.forEach(c=>{
        contactMap[c.serialNo]=c;
    });

    newContacts.forEach(c=>{
        if(c.serialNo && contactMap[c.serialNo]){
            // Update existing contact
            contactMap[c.serialNo]= {...contactMap[c.serialNo],...c};
        }else{
            // Add new contact
            const randomNegative = -Math.floor(Math.random() * 1000000); 
            contactMap[randomNegative]={serialNo:randomNegative,...c};
        }
    });

    return Object.values(contactMap);
}

export const validatePolygonBoundary=(polygon)=>{
    if (polygon.type !== "Polygon") {
      return { valid: false, reason: "Not a Polygon type" };
    }
   
    const rings = polygon.coordinates;
    if (!Array.isArray(rings) || rings.length === 0) {
      return { valid: false, reason: "No coordinates found" };
    }
   
    for (let i = 0; i < rings.length; i++) {
      const ring = rings[i];
   
      // Check closed ring
      const first = ring[0];
      const last = ring[ring.length - 1];
   
      if (first[0] !== last[0] || first[1] !== last[1]) {
        return { valid: false, reason: `Ring ${i} is not closed` };
      }
   
      // Optional: Check minimum 4 points (triangle + closure)
      if (ring.length < 4) {
        return { valid: false, reason: `Ring ${i} has less than 4 points` };
      }
    }
   
    return { valid: true };
}

export const adjustMinutes = (timeStr, minutes) => {
  // Split "HH:mm" into hours and minutes
  let [hours, mins] = timeStr.split(":").map(Number);

  // Create a Date with today’s date and that time
  let date = new Date();
  date.setHours(hours, mins, 0, 0);

  // Add (positive) or subtract (negative) minutes
  date.setMinutes(date.getMinutes() + minutes);

  // Format back to HH:mm
  let hh = String(date.getHours()).padStart(2, "0");
  let mm = String(date.getMinutes()).padStart(2, "0");

  return `${hh}:${mm}`;
}

export const getDaysBetweenDates = (expiryDate, selectedDate) => {
  const firstDate = moment(expiryDate);
  const secondDate = moment(selectedDate);

  // Use the `diff` method in days
  return Math.abs(firstDate.diff(secondDate, 'days'));
}

  