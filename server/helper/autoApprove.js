import cron from 'node-cron';
import {getAttendanceDataPending,attendanceApprove} from '../models/attendence/attendence.js'
import haversine from 'haversine-distance';



//set up auto approved attendance
const autoApprovedAttendance=()=>{
    try{
        // Variable to track if the job is running
        let isJobRunning = false;
        // Cron job scheduled to run at 12:00 AM
        cron.schedule('0 0 * * *', async () => {
            if (isJobRunning) {
            console.log('Job is already running, skipping this execution.');
            return;
            }
        
            isJobRunning = true; // Set the job as running
            console.log('Running cron job at 12:00 AM');
        
            try {
            // Simulate a long-running asynchronous operation (e.g., database update)
            await autoUpdateAttendance();
            console.log('Cron job completed successfully.');
            } catch (error) {
            console.error('Error in cron job:', error);
            } finally {
            isJobRunning = false; // Mark the job as not running
            }
        })

    }catch(error){
        console.log("....error...",error?.message)
    }
}




// Office location and radius (in meters)
const officeLocation = {
  latitude: 15.355932655710209, // Example coordinates for the office
  longitude: 75.13547606601175,
  radiusMeters: 100 // Radius in meters to validate location
};

async function autoUpdateAttendance(){
    try {
        // Fetch pending attendance records that need approval
        // Convert to IST (UTC +5:30)
        const currentDateUTC = new Date();

        const currentDateIST = new Date(currentDateUTC.getTime() + (5.5 * 60 * 60 * 1000));
        
        // Subtract one day (in milliseconds)
        const previousDateIST = new Date(currentDateIST.getTime() - (24 * 60 * 60 * 1000));
        const pendingRecords = await getAttendanceDataPending({startDate:previousDateIST})

        console.log(".....pendingRecords....",pendingRecords)
        if(!pendingRecords.data.length>=1) throw {message: "Pending records not found"}
        const approvedRecords = pendingRecords.data.filter(record => {
          
          console.log(".....record....",record)
          console.log(".....session....",record.session)
          const checkInLocation = record.session.firstHalf.checkIn.location; // { latitude, longitude }
          const checkOutLocation = record.session.secondHalf.checkOut.location; // { latitude, longitude }
    
          // Calculate total working hours
          const totalWorkingHours = record.totalHoursWorked
    
          // Location validation
          const isCheckInValid = validateLocation(checkInLocation, officeLocation);
          const isCheckOutValid = validateLocation(checkOutLocation, officeLocation);
    
          const isValidLocation = isCheckInValid && isCheckOutValid;
    
          // Approve based on total working hours and location
          if (totalWorkingHours >= 8 && isValidLocation) {
            record.attendanceApprove = 'Full-Day Approved';
            return true;
          } else if (totalWorkingHours >= 4 && totalWorkingHours < 8 && isValidLocation) {
            record.attendanceApprove = 'Half-Day Approved';
            return true;
          }
          record.attendanceApprove = 'Rejected';
          return false; // Do not approve if conditions are not met
        });

        console.log(".....approvedRecords....",approvedRecords)
    
        // Update attendance records that qualify for approval
        const updatePromises = approvedRecords.map(record => {
          console.log("...recordstatus...",record)
          return attendanceApprove(
            { _id: record._id },
            { attendanceApprove: record.attendanceApprove }
          );
        });
    
        await Promise.all(updatePromises);
        console.log(`Auto-approved ${approvedRecords.length} attendance records.`);
      } catch (error) {
        console.error('Error in auto-approve job:', error);
      }
}

// Helper function to validate location within the office radius
function validateLocation(employeeLocation, officeLocation) {
    const latitude = parseFloat(employeeLocation.lat);
    const longitude = parseFloat(employeeLocation.long);
  const distance = haversine({latitude,longitude}, officeLocation); // Calculate distance in meters
  return distance <= officeLocation.radiusMeters; // Return true if within office radius
}



export {autoApprovedAttendance};