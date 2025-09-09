import React from "react";
import { Link } from "react-router-dom";
import notfound from "../../assets/notfound.webp";
const NotFound = () => {
  return (
    <div className="flex maxmd:flex-col gap-4 w-[100%] items-center h-screen justify-around">
      <div className="w-full sm:w-[50%] px-5">
        <img src={notfound} className="w-full" />
      </div>
      <div className="flex flex-col gap-5  justify-center px-4 p-2 snap-y items-center">
        <div className="flex items-center gap-1">
          <span className="text-[60px] max-sm:text-[40px] font-bold ">
            Opps!
          </span>
        </div>
        <span className="text-[30px] max-sm:text-[20px] font-bold">
          You are Unauthorized!
        </span>
        <span className="text-xl max-sm:text-base text-center max-w-[400px] text-gray-500 font-semibold">
          The page you are looking for might not be available or you are
          unauthorized to access it!
        </span>
        <Link
          to="/"
          className="text-lg  max-sm:text-base text-center max-w-[400px] bg-[#5AE3A7] px-4 rounded-full text-[#1C2F36] font-semibold p-2"
        >
          GO TO HOMEPAGE
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
