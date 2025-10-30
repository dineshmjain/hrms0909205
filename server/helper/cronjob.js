
import cron from 'node-cron';
import * as user from "../controllers/user/user.js"
import * as userModel from '../models/user/user.js'
import * as attendanceModel from '../models/attendence/attendence.js'
import { create, getOne, removeOne,findOneAndUpdate ,aggregationWithPegination,updateOne,findWithPegination} from '../helper/mongo.js';
import * as assignment from '../models/assignment/assignment.js';
import * as leaveBalance from "../models/leave/leave.js";
import * as leavePolicy from "../models/leavePolicy/leavePolicy.js";
import {bulkWriteOperations} from '../helper/mongo.js'
import { ObjectId } from 'mongodb';

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

// // function set up cron job for monthly and yearly cron job
// const carryForwardLeaves=()=>{
//   // Cron job to run every minute from 12:00 am
//   cron.schedule('0 0 * * *', () => {
//     console.log('Cron job is running between 12:00 am .');
//     // Add your logic here
//     updateMonthlyCarryForwardLeaves();
//   });
// }

// Setup cron for daily run
export const scheduleLeaveCreditCron = () => {
  // Run every day at 12:05 am
  cron.schedule("0 0 * * *", async () => {
    console.log("Leave Credit Cron started at", new Date());
    await runLeaveBalanceCron ();
  });
};

// setup cron for leave to salary conversion
export const scheduleLeaveToSalaryCron=()=>{
  // node-cron example
// cron.schedule("59 23 30 * *", async () => {
//   await runLeaveSalaryConversion();
// });
cron.schedule("0 0 * * *", async () => {
  await runLeaveSalaryConversion();
});

};

async function processAbsentEmployees() {
    
    const currentDateUTC = new Date();

    // Convert to IST (UTC +5:30)
    const currentDateIST = new Date(currentDateUTC.getTime() + (5.5 * 60 * 60 * 1000));
    
    // Subtract one day (in milliseconds)
    const previousDateIST = new Date(currentDateIST.getTime() - (24 * 60 * 60 * 1000));
    // console.log(".....",currentDateIST,"....",previousDateIST)


    
    const employees=await userModel.getAllUsersData()
    const attendanceRecords=await attendanceModel.getAllAttendanceData({startDate:previousDateIST})
    // console.log(".....employees.....",employees)
    // console.log(".....attendanceRecords.....",attendanceRecords)
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
    // console.log("....existingRecord...",existingRecord,`${data.employeeId}`)
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

// update carry forward leaves monthly/yearly
// async function updateMonthlyCarryForwardLeaves(){
//   const employees=await userModel.getAllUsersData()
//   const totalEmployees=employees.data.length
//   for(let i=0;i<totalEmployees;i++){
//     const each=employees.data[i]
//     const {assignmentId}=each
//     const getEmployLevelAssignmentIds=await assignment.getAllLevelAssignmentIds({assignmentId})
//   }
// }

export const calculateNextCreditDate = (policy, today) => {
  if (policy.cycle.type === "monthly") {
    return new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      policy.cycle.creditedDay || 1
    );
  }

  if (policy.cycle.type === "yearly") {
    const monthIndex = new Date(`${policy.cycle.creditedMonth} 1, 2000`).getMonth();
    return new Date(
      today.getFullYear() + 1,
      monthIndex,
      policy.cycle.creditedDay || 1
    );
  }

  // fallback → next month 1st
  return new Date(today.getFullYear(), today.getMonth() + 1, 1);
};

export const runLeaveBalanceCron  = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueBalances = await leaveBalance.leaveBalanceUsers();
    // console.log("....JdueBalances..",JSON.stringify(dueBalances))
    if(!dueBalances?.data?.length) return
    const userPoliciesMap =new Map()
    // const totalDueBalanceCount=dueBalances.data.length;
    for (const bal of dueBalances.data) {
      const key = bal.userId.toString();
      if (!userPoliciesMap.has(key)) {
        userPoliciesMap.set(key, []);
      }
      userPoliciesMap.get(key).push(bal.policyId);
    }

    const policiesMap = new Map();
    for (const [userId,  policies ] of userPoliciesMap.entries()) {
      const policiesData = await leavePolicy.getLeavePolicies({ policies });
      for (const policy of policiesData.data || []) {
        policiesMap.set(policy.leavePolicyId.toString(), policy);
      }
    }

    const bulkOpsBalance = [];
    const bulkOpsCronTx = [];

    for (const bal of dueBalances.data) {
      const policy = policiesMap.get(bal.policyId.toString());
      if (!policy) continue;

      const creditDays = policy.noOfDays || 0;
      if (creditDays <= 0) continue;

      // const tx = {
      //   _id: new ObjectId(),
      //   date: today,
      //   credited: creditDays,
      //   remark: `${policy.cycle?.type || "monthly"} credit`
      // };

      // if (!bal.cronTransactionId) {
      //   // first time for this user-policy
      //   const newCronTxId = new ObjectId();
      //   bulkOpsCronTx.push({
      //     insertOne: {
      //       document: {
      //         _id: newCronTxId,
      //         userId: bal.userId,
      //         policyId: bal.policyId,
      //         transactions: [tx],
      //         createdAt: new Date()
      //       }
      //     }
      //   });

      //   bulkOpsBalance.push({
      //     updateOne: {
      //       filter: { _id: bal._id },
      //       update: {
      //         $inc: { totalAccrued: creditDays, currentBalance: creditDays },
      //         $set: {
      //           cronTransactionId: newCronTxId,
      //           nextCreditingDate: calculateNextCreditingDate(policy, today),
      //           lastCreditedMonth: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
      //         }
      //       }
      //     }
      //   });
      // } else {
      //   // subsequent credit
      //   bulkOpsCronTx.push({
      //     updateOne: {
      //       filter: { _id: bal.cronTransactionId },
      //       update: { $push: { transactions: tx } }
      //     }
      //   });

      //   bulkOpsBalance.push({
      //     updateOne: {
      //       filter: { _id: bal._id },
      //       update: {
      //         $inc: { totalAccrued: creditDays, currentBalance: creditDays },
      //         $set: {
      //           nextCreditingDate: calculateNextCreditingDate(policy, today),
      //           lastCreditedMonth: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
      //         }
      //       }
      //     }
      //   });
      // }
      // Prepare simplified cron document
      const cronDoc = {
        _id: new ObjectId(),
        userId: bal.userId,
        policyId: bal.policyId,
        credited: creditDays,
        remark: `${policy.cycle?.type || "monthly"} credit`,
        createdAt: new Date()
      };

      bulkOpsCronTx.push({
        insertOne: { document: cronDoc }
      });
      // Update leaveBalance
      bulkOpsBalance.push({
        updateOne: {
          filter: { _id: bal._id },
          update: {
            $inc: { totalAccrued: creditDays, currentBalance: creditDays },
            $set: {
              nextCreditingDate: calculateNextCreditingDate(policy, today),
              lastCreditedMonth: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
            }
          }
        }
      });
    }

    // if (bulkOpsCronTx.length) {
    //   await cronTxCol.bulkWrite(bulkOpsCronTx);
    // }
    // if (bulkOpsBalance.length) {
    //   await leaveBalanceCol.bulkWrite(bulkOpsBalance);
    // }

    // console.log("....balanceOps..",JSON.stringify(bulkOpsBalance))
    // console.log("....cronTxnOps..",JSON.stringify(bulkOpsCronTx))

    if (bulkOpsBalance.length) {
      await bulkWriteOperations(bulkOpsBalance, "leaveBalance", "Leave Balance Cron");
    }
    if (bulkOpsCronTx.length) {
      await bulkWriteOperations(bulkOpsCronTx, "leaveBalanceCron", "Leave Balance Cron Txn");
    }

    
  } catch (err) {
    console.error("❌ Error updating leave balances:", err);
  }
};

// function calculateNextCreditingDate(policy, today) {
//   const d = new Date(today);
//   if (policy.cycle?.type === "monthly") {
//     d.setMonth(d.getMonth() + 1);
//   } else if (policy.cycle?.type === "yearly") {
//     d.setFullYear(d.getFullYear() + 1);
//   } else {
//     d.setMonth(d.getMonth() + 1); // default
//   }
//   return d;
// }

function calculateNextCreditingDate(policy, today) {
  // ensure local midnight, not UTC
  const d = new Date(today);
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();

  let next;
  if (policy.cycle?.type === "yearly") {
    next = new Date(year + 1, month, day);
  } else {
    // monthly or default
    next = new Date(year, month + 1, day);
  }

  // normalize time to midnight local
  next.setHours(0, 0, 0, 0);
  return next;
}


export const runLeaveSalaryConversion = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const policies = await leavePolicy.getLeavePoliciesOfSalaryEnabled();
    // console.log(".......policies.",JSON.stringify(policies))
    if(!policies.data)throw new Error ("leave policies under salaryenabled not found")
    const salaryPolicies=policies.data.map(data=>new ObjectId(data.leavePolicyId))
    const dueBalances = await leaveBalance.leaveBalanceSalaryEnabledUsers({salaryPolicies});
    if (!dueBalances || !dueBalances?.data.length) return;

   

    const policyMap = new Map(policies.data.map(p => [p.leavePolicyId.toString(), p]));

    const bulkOpsBalance = [];
    const bulkOpsConversion = [];

    
    for (const bal of dueBalances.data) {
      const policy = policyMap.get(bal.policyId.toString());
      if (!policy) continue;

      const creditDays = policy.noOfDays || 1; // monthly credit = 1
      const rate = policy.leaveEncashmentRatePerDaySalary || 0;
      const totalAmountRate = rate * creditDays;

      if (creditDays <= 0 || totalAmountRate <= 0) continue;

      // 4️⃣ Create log document
      const conversionLog = {
        _id: new ObjectId(),
        userId: bal.userId,
        policyId: bal.policyId,
        credited: creditDays,
        ratePerDay: rate,
        totalAmountRate,
        remark: `${policy.cycle?.type || "monthly"} salary conversion`,
        createdAt: new Date()
      };

      bulkOpsConversion.push({ insertOne: { document: conversionLog } });

      // 5️⃣ Update balance (reduce converted day)
      bulkOpsBalance.push({
        updateOne: {
          filter: { _id: bal._id },
          update: {
            $inc: {
              currentBalance: -creditDays,
              usedLeaves: creditDays
            },
            $set: {
              nextCreditingDate: calculateNextCreditingDate(policy, today),
              lastCreditedMonth: `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`
            }
          }
        }
      });
    }

    // 6️⃣ Apply bulk operations
    // if (bulkOpsConversion.length) {
    //   await leaveSalaryConversionCol.bulkWrite(bulkOpsConversion);
    // }
    // if (bulkOpsBalance.length) {
    //   await leaveBalanceCol.bulkWrite(bulkOpsBalance);
    // }

    // console.log(".....bulkOpsBalance...",JSON.stringify(bulkOpsBalance))
    // console.log(".....bulkOpsConversion...",JSON.stringify(bulkOpsConversion))

    if (bulkOpsBalance.length) {
      await bulkWriteOperations(bulkOpsBalance, "leaveBalance", "Leave Balance Cron");
    }
    if (bulkOpsConversion.length) {
      await bulkWriteOperations(bulkOpsConversion, "leaveSalaryConversions", "Leave Balance Cron Txn");
    }

    

    console.log("✅ leave balance salary conversion completed");
  } catch (err) {
    console.error("❌ Error updating salary conversion:", err);
  }
};




// Export the setup function
export { setupCronJobs };

