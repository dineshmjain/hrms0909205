import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Dialog,
  DialogBody, DialogHeader
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { Modal } from "../../components/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  sendOTP,
  verifyOTP,
} from "../../redux/Action/Auth/AuthAction";
import {
  InputWithHelperText,
  PasswordWithHelperText,
} from "../../components/Input/Input";
import OtpVerification from "./OTPVerfication";
import toast from "react-hot-toast";
import Otp from "./Otp";
import logo from "../../assets/MWB_Logo (2).png";
import bg from "../../assets/sign-in-bg.png";
import { HiOutlineXMark } from "react-icons/hi2";

const SignUp = () => {
  const [credentials, setCredentials] = useState({
    mobile: "",
    password: "",
    email: "",
    name: "",
    lastName: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [iAgree, setIAgree] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  // const otps = useRef(["", "", "", ""]);
  const otps = useRef("");
  const nav = useNavigate();
  const confrimPasswordSet = (e) => {
    setConfirmPassword(e.target.value);
  };

  const validate = () => {
    if (!iAgree) {
      setShakeKey((prev) => prev + 1);
      return;
    }
    console.log(credentials, credentials.password, credentials.confirmPassword);
    const newErrors = {};
    if (!credentials.name) newErrors.name = "Name is required";
    if (!credentials.mobile) newErrors.mobile = "Mobile number is required";
    if (!credentials.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(credentials.email))
      newErrors.email = "Email address is invalid";
    if (!credentials.password) newErrors.password = "Password is required";
    if (credentials.password !== credentials.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOpen = () => {
    if (validate()) {
      let userDetails = {
        name: { firstName: credentials.name, lastName: credentials.lastName },
        password: credentials.password,
        mobile: credentials.mobile,
        email: credentials.email,
      };
      dispatch(register(userDetails))?.then(({ payload }) => {
        console.log(payload);
        if (payload?.status === 200) {
          toast.success(payload?.message);
          const otpData = payload?.data?.otp;

          if (otpData) {
            // otps.current = otpData?.split("");
            otps.current = otpData;
            setOpen(true);
          }
        }
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClick = () => {
    closeDialog()
  }

  const closeDialog = () => {
    setIAgree(true)
    setOpenDialog(false);
  }

  const handleChange = (e) => {
    console.log(e.target.name);
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Dialog open={openDialog} size='sm'>
        <DialogHeader className="flex justify-between">
          <h3 className="text-lg font-semibold">Terms And Conditions</h3>
          <HiOutlineXMark onClick={closeDialog} />
        </DialogHeader>
        <DialogBody >

          <span className="text-[16px]">Terms and conditions</span>
          <div className="flex justify-start gap-2 mt-4">
            <button
              className="bg-primary text-white px-4 py-1 rounded-md h-fit"
              onClick={handleClick}
            >
              I Agree
            </button>
          </div>
        </DialogBody>
      </Dialog>
      <div className="flex min-h-screen justify-center w-full">
        {/* <OtpVerification
        open={open}
        handleClose={handleClose}
        otps={otps.current}
        mobile={credentials.mobile}
      /> */}
        {open && (
          <Modal size={"sm"} onClose={() => setOpen(false)} heading={"Enter OTP"}>
            <Otp
              receivedOtp={otps?.current}
              checkOtp={(otp) => {
                dispatch(
                  verifyOTP({ mobile: credentials?.mobile, otp: otp })
                )?.then(({ payload }) => {
                  if (payload?.status === 200) {
                    toast.success(payload?.message);
                    const token = payload?.data?.token;
                    if (token) {
                      localStorage.setItem("token", token);
                      nav("/auth/org");
                    }
                  }
                });
              }}
              mobile={credentials.mobile}
            />
          </Modal>
        )}

        <img
          src={bg}
          alt="AppLogo" className="absolute opacity-75 w-full h-full" // Set consistent width and height with rounded corners
        />
        <div className="flex items-center justify-end w-full md:w-1/2 p-4" style={{ width: '90%' }}>
          <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-xl shadow-blue-gray-200">
            <div className="flex justify-center">
              <img
                src={logo}
                alt="AppLogo" style={{ width: '120px', height: '80px' }}
                className="w-9 h-9 cursor-pointer rounded-md mb-4" // Set consistent width and height with rounded corners
              />
            </div>
            <Typography variant="h4" className="mb-4 text-center">
              Sign Up
            </Typography>
            <form className="flex flex-col gap-4">
              <InputWithHelperText
                className="py-1"
                label={"First Name"}
                type={"text"}
                name="name"
                OnChange={handleChange}
                error={errors.name}
              />
              <InputWithHelperText
                className="py-1"
                label={"Last Name"}
                type={"text"}
                name="lastName"
                OnChange={handleChange}
                error={errors.name}
              />

              <InputWithHelperText
                className="py-1"
                label={"Mobile"}
                type={"text"}
                name="mobile"
                OnChange={handleChange}
                error={errors.mobile}
              />

              <InputWithHelperText
                className="py-1"
                label={"email"}
                type={"email"}
                name="email"
                OnChange={handleChange}
                error={errors.email}
              />
              <PasswordWithHelperText
                className="py-1"
                label={"Password"}
                type={"password"}
                name="password"
                OnChange={handleChange}
                error={errors.password}
              />
              <PasswordWithHelperText
                className="py-1"
                label={"Confirm Password"}
                type={"password"}
                name="confirmPassword"
                OnChange={handleChange}
                error={errors.confirmPassword}
              />
              <div className="flex gap-4">
                <input type="checkbox" className="w-5 h-5" checked={iAgree} onChange={() => setIAgree(!iAgree)} />
                <Typography
                  key={shakeKey} // 🔑 forces re-render so animation restarts
                  variant="small"
                  className={`flex gap-1 items-center transition-all ${!iAgree ? "animate-shake text-red-500" : ""
                    }`}
                >
                  I agree to this{" "}
                  <a
                    onClick={() => setOpenDialog(true)}
                    className="text-primary hover:underline hover:text-blue-700 flex cursor-pointer"
                  >
                    terms and conditions
                  </a>
                </Typography>
              </div>
              <Button
                fullWidth
                onClick={handleOpen}
                className={`transition-all ${iAgree
                    ? "bg-primary hover:bg-primaryLight hover:text-primary"
                    : "bg-gray-300 text-gray-500"
                  }`}
              >
                Submit
              </Button>
            </form>
            <div className="flex justify-center">
              <Typography variant="small" className="mt-4 text-center flex">
                <a
                  onClick={() => nav("/auth/sign-in")}
                  className="text-primary hover:underline flex"
                >
                  Already have Account?{" "}
                  <Typography variant="small" className="text-center">
                    Sign In
                  </Typography>
                </a>
              </Typography>
            </div>
          </Card>
        </div>

      </div>
    </>
  );
};

export default SignUp;
