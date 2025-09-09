
import cron from 'node-cron';
import * as user from "../controllers/user/user.js"
import * as userModel from '../models/user/user.js'
import * as attendanceModel from '../models/attendence/attendence.js'
import { create, getOne, removeOne,findOneAndUpdate ,aggregationWithPegination,updateOne,findWithPegination} from '../helper/mongo.js';
import * as assignment from '../models/assignment/assignment.js';
// Function to set up the cron job
const setupCronJobs = () => {
  // Cron job to run every minute from 12:00 am
  cron.schedule('0 0 * * *', () => {
    console.log('Cron job is running between 12:00 am .');
    // Add your logic here
    processAbsentEmployees();
    // Get the current date in UTC


  });
};

// function set up cron job for monthly and yearly cron job
const carryForwardLeaves=()=>{
  // Cron job to run every minute from 12:00 am
  cron.schedule('0 0 * * *', () => {
    console.log('Cron job is running between 12:00 am .');
    // Add your logic here
    updateMonthlyCarryForwardLeaves();
  });
}

async function processAbsentEmployees() {
    
    const currentDateUTC = new Date();

    // Convert to IST (UTC +5:30)
    const currentDateIST = new Date(currentDateUTC.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Subtract one day (in milliseconds)
    const previousDateIST = new Date(currentDateIST.getTime() - (24 * 60 * 60 * 1000));
    console.log(".....",currentDateIST,"....",previousDateIST)


    
    const employees=await userModel.getAllUsersData()
    const attendanceRecords=await attendanceModel.getAllAttendanceData({startDate:previousDateIST})
    console.log(".....employees.....",employees)
    console.log(".....attendanceRecords.....",attendanceRecords)
    // Find employees without attendance records
    const absentEmployeeIds = employees.data
      .filter(emp => !attendanceRecords.data.some(att => att.userId.toString() === emp._id.toString()))
      .map(emp => ({employeeId:emp._id,orgId:emp.orgId}));
    // Process each absent employee
    for (const data of absentEmployeeIds) {
    // Check if an attendance record already exists for the employee on the given date
    const existingRecord = await getOne({
      userId: data.employeeId,
      createdAt: { $gte: previousDateIST, $lt: currentDateIST }},'employeeAttendance'
    );
    console.log("....existingRecord...",existingRecord,`${data.employeeId}`)
    if (!existingRecord.status) {
      // Create an attendance record marked as 'Absent'
      await create({
        userId: data.employeeId,
        orgId: data.orgId, // Replace with your org ID logic
        session: {
          firstHalf: {
            checkIn: null,
            checkOut: null
          },
          secondHalf: {
            checkIn: null,
            checkOut: null
          }
        },
        totalHoursWorked: 0,
        transactionLog:[],
        wholeDayStatus: 'Absent',
        createdAt: new Date(previousDateIST),
        modifiedDate: new Date(previousDateIST)
      }, 'employeeAttendance');

      console.log(`Marked employee ${data.employeeId} as absent for the day.`);
    } else {
      console.log(`Attendance record for employee ${data.employeeId} already exists, skipping.`);
    }
  
    }
}

// update carry forward leaves monthly
async function updateMonthlyCarryForwardLeaves(){
  const employees=await userModel.getAllUsersData()
  const totalEmployees=employees.data.length
  for(let i=0;i<totalEmployees;i++){
    const each=employees.data[i]
    const {assignmentId}=each
    const getEmployLevelAssignmentIds=await assignment.getAllLevelAssignmentIds({assignmentId})
  }
}

// Export the setup function
export { setupCronJobs };

