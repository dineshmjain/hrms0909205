// import moment from "moment";
// import React from "react";
// import { CgLogIn, CgLogOut } from "react-icons/cg";
// import { FaArrowRightLong } from "react-icons/fa6";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";

// const AttendenceCard = ({ setShowModal }) => {
//   const DashboardData = useSelector((state) => state?.dashboard?.dashboard);
//   const nav = useNavigate();

//   const AttendanceTiming = ({ shift }) => {
//     console.log(DashboardData);

//     return shift?.startTime == "WO" ? (
//       <span className="bg-green-200 px-2 p-1 text-green-900  rounded-md">
//         {" "}
//         Week off
//       </span>
//     ) : (
//       <span className="font-normal ">
//         {" "}
//         {moment(shift?.startTime, "HH:mm").format("h:mm A")} to{" "}
//         {moment(shift?.endTime, "HH:mm").format("h:mm A")}
//       </span>
//     );
//   };

//   return (
//     <div className="w-[50%] flex flex-col gap-2 p-4 maxsm:gap-4 maxlg:w-full items-start bg-white rounded-md shadow-lg ">
//       <div className="flex justify-between font-medium maxmd:flex-wrap w-full">
//         <span className="">Attendence </span>
//         {DashboardData?.currentDay?.shift ? (
//           <span
//             className={`rounded-md  text-sm items-center justify-center
            
//           `}
//           >
//             {DashboardData?.currentDay?.shift?.name}

//             <AttendanceTiming shift={DashboardData?.currentDay?.shift} />
//           </span>
//         ) : (
//           <span className={`skeleton-loader w-52 h-5`}></span>
//         )}
//       </div>
//       <div className="flex justify-between md:flex-wrap  maxmd:flex-col gap-2 w-full ">
//         <div className="flex gap-2 bg-gray-200 flex-col rounded-md p-2 w-fit maxsm:w-full">
//           <div className="flex justify-between items-center">
//             <span className="font-medium text-xs">Last 3 Transactions</span>
//             <span
//               className="font-medium text-xs cursor-pointer flex items-center gap-1 group "
//               onClick={() => {
//                 window?.localStorage?.setItem(
//                   "AttendenceList",
//                   JSON?.stringify({
//                     selectedMonth: moment().month(),
//                   })
//                 );
//                 nav("../../attendence");
//               }}
//             >
//               <span className="opacity-0 translate-x-5 group-hover:translate-x-1 text-gray-600 text-nowrap maxsm:opacity-100 maxsm:translate-x-0 group-hover:opacity-100 transition-all ease-in-out duration-300">
//                 Show more
//               </span>
//               <FaArrowRightLong className="w-4 h-3 group-hover:translate-x-1 transition-all ease-in-out duration-300" />
//             </span>
//           </div>
//           {/* ------------SHOW LAST 3 TRANSACTIONS ------------ */}
//           <div className="flex gap-2 overflow-x-auto scrolls w-full ">
//             {[...Array(3)]?.map((_, index) => {
//               let data = DashboardData?.currentDay?.transactions?.[index] ?? 0;
//               return data ? (
//                 <div
//                   key={index}
//                   className={`flex flex-col gap-1 p-2  rounded-md ${
//                     data.type === "checkIn"
//                       ? "bg-blue-100 text-blue-900"
//                       : "bg-orange-100 text-orange-900"
//                   }`}
//                 >
//                   <span className="text-sm maxsm:text-xs font-semibold">
//                     {moment(data.transactionDate).format("hh:mm A")}
//                   </span>
//                   <span className="text-xs flex gap-2 items-center justify-center">
//                     {moment(data.transactionDate).format("DD/MM")}{" "}
//                     {data.type === "checkIn" ? (
//                       <CgLogIn className="w-4 h-4" />
//                     ) : (
//                       <CgLogOut className="w-4 h-4" />
//                     )}
//                   </span>
//                 </div>
//               ) : (
//                 <div
//                   key={index}
//                   className="flex flex-col gap-1 p-2 rounded-md bg-gray-100 min-w-[75px] "
//                 >
//                   <div className="h-4 bg-gray-300 rounded w-2/3"></div>
//                   <div className="h-4 bg-gray-300 rounded w-3/3 mt-1"></div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//         <div className="flex gap-2 justify-end items-end text-sm maxsm:justify-center max-sm:w-full">
//           <button
//             className="bg-blue-500 hover:bg-blue-600 maxsm:w-[50%] maxsm:text-xs justify-center text-white rounded-md p-2 h-fit flex gap-2 items-center"
//             onClick={() => setShowModal(1)}
//           >
//             Check In <CgLogIn className="w-4 h-4" />
//           </button>
//           <button
//             className="bg-orange-500 hover:bg-orange-600 maxsm:w-[50%] maxsm:text-xs justify-center text-white rounded-md p-2 h-fit flex gap-2 items-center"
//             onClick={() => setShowModal(2)}
//           >
//             Check Out <CgLogOut className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AttendenceCard;
import moment from "moment";
import React from "react";
import { CgLogIn, CgLogOut } from "react-icons/cg";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AttendenceCard = ({ setShowModal }) => {
  const DashboardData = useSelector((state) => state?.dashboard?.dashboard);
  const nav = useNavigate();

  const AttendanceTiming = ({ shift }) => {
    console.log(DashboardData);

    return shift?.startTime == "WO" ? (
      <span className="bg-green-200 px-2 p-1 text-green-900  rounded-md">
        {" "}
        Week off
      </span>
    ) : (
      <span className="font-normal ">
        {" "}
        {moment(shift?.startTime, "HH:mm").format("h:mm A")} to{" "}
        {moment(shift?.endTime, "HH:mm").format("h:mm A")}
      </span>
    );
  };

  return (
    <div className="w-[50%] flex flex-col gap-2 p-4 maxsm:gap-4 maxlg:w-full items-start bg-white rounded-md shadow-lg ">
      <div className="flex justify-between font-medium maxmd:flex-wrap w-full">
        <span className="">Attendence </span>
        {DashboardData?.currentDay?.shift ? (
          <span
            className={`rounded-md  text-sm items-center justify-center
            
          `}
          >
            {DashboardData?.currentDay?.shift?.name}

            <AttendanceTiming shift={DashboardData?.currentDay?.shift} />
          </span>
        ) : (
          <span className={`skeleton-loader w-52 h-5`}></span>
        )}
      </div>
      <div className="flex justify-between md:flex-wrap  maxmd:flex-col gap-2 w-full ">
        <div className="flex gap-2 bg-gray-200 flex-col rounded-md p-2 w-fit maxsm:w-full">
          <div className="flex justify-between items-center">
            <span className="font-medium text-xs">Last 3 Transactions</span>
            <span
              className="font-medium text-xs cursor-pointer flex items-center gap-1 group "
              onClick={() => {
                window?.localStorage?.setItem(
                  "AttendenceList",
                  JSON?.stringify({
                    selectedMonth: moment().month(),
                  })
                );
                nav("../../attendence");
              }}
            >
              <span className="opacity-0 translate-x-5 group-hover:translate-x-1 text-gray-600 text-nowrap maxsm:opacity-100 maxsm:translate-x-0 group-hover:opacity-100 transition-all ease-in-out duration-300">
                Show more
              </span>
              <FaArrowRightLong className="w-4 h-3 group-hover:translate-x-1 transition-all ease-in-out duration-300" />
            </span>
          </div>
          {/* ------------SHOW LAST 3 TRANSACTIONS ------------ */}
          <div className="flex gap-2 overflow-x-auto scrolls w-full ">
            {[...Array(3)]?.map((_, index) => {
              let data = DashboardData?.currentDay?.transactions?.[index] ?? 0;
              return data ? (
                <div
                  key={index}
                  className={`flex flex-col gap-1 p-2  rounded-md ${
                    data.type === "checkIn"
                      ? "bg-blue-100 text-blue-900"
                      : "bg-orange-100 text-orange-900"
                  }`}
                >
                  <span className="text-sm maxsm:text-xs font-semibold">
                    {moment(data.transactionDate).format("hh:mm A")}
                  </span>
                  <span className="text-xs flex gap-2 items-center justify-center">
                    {moment(data.transactionDate).format("DD/MM")}{" "}
                    {data.type === "checkIn" ? (
                      <CgLogIn className="w-4 h-4" />
                    ) : (
                      <CgLogOut className="w-4 h-4" />
                    )}
                  </span>
                </div>
              ) : (
                <div
                  key={index}
                  className="flex flex-col gap-1 p-2 rounded-md bg-gray-100 min-w-[75px] "
                >
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/3 mt-1"></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2 justify-end items-end text-sm maxsm:justify-center max-sm:w-full">
          <button
            className="bg-blue-500 hover:bg-blue-600 maxsm:w-[50%] maxsm:text-xs justify-center text-white rounded-md p-2 h-fit flex gap-2 items-center"
            onClick={() => setShowModal(1)}
          >
            Check In <CgLogIn className="w-4 h-4" />
          </button>
          <button
            className="bg-orange-500 hover:bg-orange-600 maxsm:w-[50%] maxsm:text-xs justify-center text-white rounded-md p-2 h-fit flex gap-2 items-center"
            onClick={() => setShowModal(2)}
          >
            Check Out <CgLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendenceCard;

