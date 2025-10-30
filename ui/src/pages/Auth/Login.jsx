import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  input,
} from "@material-tailwind/react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import logo from "../../assets/MWB_Logo (2).png";
import bg from "../../assets/sign-in-bg.png";

import toast, { Toaster } from "react-hot-toast";
import { login } from "../../redux/Action/Auth/AuthAction";
import { PasswordWithHelperText } from "../../components/Input/Input";
const Login = () => {
  const [credentials, setCredentials] = useState({ password: "" });
  const [inputValue, setInputValue] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  // useEffect(() => {
  //   if (data?.user.status === "success") {
  //     //   toast.success(data?.user?.user.message);
  //     localStorage.setItem("token", data?.user?.user?.token);
  //     localStorage.setItem(
  //       "modules",
  //       JSON.stringify(data?.user?.user?.modules)
  //     );
  //     setTimeout(() => {
  //       checkAndNav();
  //     }, 2000);
  //   }
  // }, [data?.user]);
  const params = useLocation();
  const { search } = useLocation();

  const query = new URLSearchParams(search);
  const product = query.get("product");

  const handleRememberMe = () => {
    if (rememberMe) {
      localStorage.setItem("rememberMe", inputValue);
    } else {
      localStorage.removeItem("rememberMe");
    }
  };
  const checkAndNav = () => {
    let productId = parseInt(product) || 0;

    switch (productId) {
      case 1:
        return window.open(`http://192.168.1.93/production`, "_blank");
      case 2:
        return window.open(`http://192.168.1.93/taskManagement`, "_blank");
      default:
        return navigate("/auth/assist-wizard");
      // return navigate("/dashboard");
    }
  };

  // const handleInputChange = (e) => {

  //   console.log(e.target.value)
  //   setInputValue(e.target.value)
  // }
  const handleInputChange = (e) => {
    let value = e.target.value.trim(); // Remove extra spaces

    value = value.replace(/[^a-zA-Z0-9@._-]/g, "");

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const mobileRegex = /^[6-9][0-9]{9}$/;
    // Prevent first digit from being 1-5
    if (value.length === 1 && /[1-5]/.test(value)) {
      return; // Stops input if first digit is 1-5
    }

    // Limit to 10 digits for mobile numbers
    if (/^\d+$/.test(value) && value.length > 10) {
      return; // Prevents typing more than 10 digits
    }

    setInputValue(value); // Update state

    // Validation logic
    if (/^\d+$/.test(value)) {
      if (value.length > 10) {
        setErrorMessage("Mobile number cannot be more than 10 digits");
      } else if (!/^[6-9]/.test(value) && value.length > 0) {
        setErrorMessage("Mobile number must start with 6-9");
      } else {
        setErrorMessage(""); // Clear error when valid
      }
    } else if (value.length > 0 && !emailRegex.test(value)) {
      setErrorMessage("Please enter a valid email address");
    } else {
      setErrorMessage("");
    }
  };
  const handleInputPassword = (e) => {
    setCredentials({ password: e.target.value });
  };
  const handleLogin = (e) => {
    try {
      let value = inputValue;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      const mobileRegex = /^[6-9][0-9]{9}$/;
      console.log(
        "error",
        inputValue,
        value,
        emailRegex.test(value),
        mobileRegex.test(value)
      );

      if (emailRegex.test(value)) {
        let body = {
          ...credentials,
          email: value.toLocaleLowerCase(),
          mobile: "",
          module: "keyvalue",
        };
        dispatch(
          login({
            body,
            rememberMe,
          })
        )?.then(({ payload }) => {
          if (payload?.status === 200) {
            handleRememberMe();
            if (payload?.data?.pending?.organization == true) {
              toast("Please complete your organization details");
              // return navigate("../org");
              return navigate("../assist-wizard");
            }
            checkAndNav();
          }
        });
      } else if (mobileRegex.test(value)) {
        let body = {
          ...credentials,
          email: "",
          mobile: value,
          module: "keyvalue",
        };
        dispatch(login({ body, rememberMe }))?.then(({ payload }) => {
          if (payload?.status === 200) {
            handleRememberMe();
            if (payload?.data?.pending?.organization == false) {
              toast("Please complete your organization details");
              // return navigate("../org");
              return navigate("../assist-wizard");
            }
            checkAndNav();
          }
        });
      } else {
        // If neither, reset both fields
        toast.error("Please provide proper Email or Mobile number");
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    let Input = localStorage.getItem("rememberMe");
    if (Input) {
      setInputValue(Input);
      setRememberMe(true);
      document.getElementsByName("password")[0].focus();
    } else {
      document.getElementsByName("email")[0].focus();
    }
  }, []);
  return (
    <div className="flex min-h-screen justify-center w-full  font-inter">
      <Toaster />
      {/* Left side image */}
      {/* <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        // style={{ backgroundImage: `url(${backgroundImage})`,objectFit:'contain'}}
      ></div> */}

      {/* Right side form */}
      <div className="absolute opacity-75 ">
        <img src={bg} alt="AppLogo" className="w-[100vw] h-[100vh]" />
      </div>
      <div
        className="flex items-center justify-end w-full md:w-1/2 p-6"
        style={{ width: "90%" }}
      >
        <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-xl shadow-blue-gray-200 h-[360px] justify-center">
          <div className="flex justify-center">
            <img
              src={logo}
              alt="AppLogo"
              style={{ width: "120px", height: "80px" }}
              className="w-9 h-9 cursor-pointer rounded-md mb-4" // Set consistent width and height with rounded corners
            />
          </div>

          <Typography variant="h4" className="mb-4 text-center ">
            Login
          </Typography>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {/* <Input
              type="text"
              label="Mobile Number or Email"
              onChange={(e) => {
                handleInputChange(e);
              }}
            /> */}
            <Input
              type="text"
              label="Mobile Number or Email"
              value={inputValue} // Controlled input
              onChange={handleInputChange}
              name="email"
            />
            {errorMessage && (
              <p style={{ color: "red", fontSize: "14px" }}>{errorMessage}</p>
            )}
            <PasswordWithHelperText
              className="py-1"
              label={"Password"}
              type={"password"}
              name="password"
              OnChange={handleInputPassword}
            />

            {/* <Checkbox label="Remember me" className="mb-4" /> */}
            <Button
              type="submit"
              className="bg-primary w-full hover:bg-primaryLight hover:text-primary"
            >
              Login
            </Button>
          </form>
          <div className="flex gap-2 items-center px-1 text-sm mt-2">
            <input
              type="checkbox"
              name="rememberMe"
              id="rememberMe"
              className="w-4 h-4"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              onKeyDown={(e) => {
                if (e?.key === "Enter") {
                  setRememberMe(!rememberMe);
                }
              }}
            />
            <label
              htmlFor="rememberMe"
              className="select-none cursor-pointer text-gray-800 font-medium"
            >
              Remember me
            </label>
          </div>
          <div className="flex justify-between md:flex-row gap-2 text-sm px-1 pt-2">
            <span variant="small" className="text-center flex ">
              <span
                onClick={() => navigate("/auth/sign-up")}
                className="text-primary hover:underline flex"
              >
                Register Now
              </span>
            </span>
            <span variant="small" className="font-inter">
              <span
                onClick={() => navigate("/auth/subscription")}
                className="text-primary flex"
              >
                Forgot Password?
              </span>
            </span>
          </div>
          {/* <div className="flex justify-between md:flex-row gap-2">
            <span variant="small" className="mt-4 text-center flex">
              <a href="/auth/sign-in-otp" className="text-primary hover:underline flex">
               Login with OTP  
              </a>
            </span>
           
          </div> */}
        </Card>
      </div>
    </div>
  );
};

export default Login;
