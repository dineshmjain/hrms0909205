import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { sendOTP, verifyOTP } from "../../redux/Action/Auth/AuthAction";
import { Toaster } from "react-hot-toast";
// import { ToastContainer } from "react-hot-toast";
const OtpVerification = ({ open, handleClose, otps, mobile }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const otp = useRef();
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpSuccess = useSelector((state) => state.user);
  useEffect(() => {
    console.log(otpSuccess,"<----");
    if (otpSuccess?.status === "success") {
      const otpData = otpSuccess.user?.otp;
      const token = otpSuccess.user?.token;
      if (token) {
        localStorage.setItem("token", token);
        navigate("/auth/org");
      }
      if (otpData) {
        let newOtp = otpData.split("");
        otp.current = newOtp;
        console.log(otp.current, "setting");
      }
    }
  }, [otpSuccess]);
  const inputRefs = useRef([]);
  console.log(otp.current, "innder");
  const handleChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsVerifying(true);
    setError("");

    const otpValue = otp.current.join("");
    console.log(otps);
    try {
      dispatch(verifyOTP({ mobile: mobile, otp: otpValue }));
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !otp.current[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    setError("");

    try {
      dispatch(sendOTP({ mobile: mobile }));

      setResendTimer(60);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <Dialog
      size="sm"
      open={open}
      handler={handleClose}
      className="bg-transparent shadow-none"
    >
      <Toaster />
      <DialogBody>
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg h-64 ">
          <Typography variant="h4" className="mb-4 text-center">
            Verify OTP
          </Typography>
          <form
            className="w-full max-w-xs flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              {otp.current &&
                otp.current.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-lg border rounded-lg border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    autoFocus={index === 0}
                  />
                ))}
            </div>
            {error && (
              <Typography className="text-red-500 mb-4">{error}</Typography>
            )}
            <Button
              type="submit"
              fullWidth
              size="sm"
              className="bg-primary hover:bg-primary text-white transition-all mb-4"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
            <Button
              type="button"
              fullWidth
              size="sm"
              className="bg-gray-500 hover:bg-gray-600 text-white transition-all"
              onClick={handleResendOtp}
              disabled={isResending || resendTimer > 0}
            >
              {isResending
                ? "Resending..."
                : resendTimer > 0
                ? `Resend in ${resendTimer}s`
                : "Resend OTP"}
            </Button>
          </form>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default OtpVerification;
