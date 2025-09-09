import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { sendOTP } from "../../redux/Action/Auth/AuthAction";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

const Otp = ({ checkOtp, receivedOtp, numberExists, roleId, mobile }) => {

  const numberOfDigits = 4;
  const resendTime= 90;
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const otpBoxReference = useRef([]);
  const [timeLeft, setTimeLeft] = useState(resendTime); // 90 seconds (1 minute 30 seconds)
  const [resendVisible, setResendVisible] = useState(false);
  const dispatch = useDispatch();

  function handleChange(value, index) {
    if (value >= 0 && value <= 9) {
      let newArr = [...otp];
      newArr[index] = value;
      setOtp(newArr);
      if (value && index < numberOfDigits - 1) {
        otpBoxReference.current[index + 1].focus();
      }
    }
  }

  function handleBackspaceAndEnter(e, index) {
    if (e.target.value < 10 && e.target.value >= 0) {
      const value = e.target.value;
      const num = value.toString().split("")[value.toString().length - 1];
      handleChange(num, index);
    }
    if (!e.target.value && index > 0) {
      if (e.key === "Backspace") {
        otpBoxReference.current[index - 1].focus();
      }
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index === numberOfDigits - 1) {
      checkOtp(otp.join(""));
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleResendOtp = () => {
    try {
      dispatch(sendOTP({ mobile: mobile }));
      setResendVisible(false);
      setTimeLeft(resendTime);
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } 
  };


  useEffect(() => {
    if (receivedOtp) {
      setOtp([...receivedOtp.split("")]);
    }
  }, [receivedOtp]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timerId);
    } else {
      setResendVisible(true);
    }
  }, [timeLeft]);

  return (
    <div
      className={`flex  items-center  h-full w-full  justify-center py-10 flex-col gap-5 transition-all duration-[.5s] ease-in-out `}
    >
      <div className="w-full flex flex-col h-full items-center  gap-4 ">
        <div className="flex gap-2">
          {otp?.map((otpInput, idx) => {
            return (
              <input
                required
                type="number"
                min={0}
                step={1}
                className="bg-gray-200  p-2 w-14 font-semibold rounded-md text-center"
                maxLength={1}
                ref={(reference) => (otpBoxReference.current[idx] = reference)}
                onChange={(e) => handleChange(e.target.value, idx)}
                onKeyUp={(e) => handleBackspaceAndEnter(e, idx)}
                placeholder="0"
                value={otpInput}
                key={idx}
              />
            );
          })}
        </div>

        <button
          className="bg-gray-800 text-white px-4 p-1 font-medium w-fit hover:bg-gray-500  rounded-md  transition-all duration-[.5s] ease-in-out"
          onClick={() => checkOtp(otp.join(""))}
        >
          Confirm
        </button>

        {resendVisible ? (
          <button
            className="bg-blue-600 text-white px-4 p-1 text-xs font-medium w-fit hover:bg-blue-400 rounded-md transition-all duration-[.5s] ease-in-out"
            onClick={() => {
              handleResendOtp();
              // Reset timer
            }}
          >
            Resend OTP
          </button>
        ) : (
          <div className="text-gray-600">
            Resend OTP in {formatTime(timeLeft)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Otp;
