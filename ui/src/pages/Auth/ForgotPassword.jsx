import React from "react";
import { Card, Input, Checkbox, Button, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/sign-in-bg.png";
const ForgotPassword = () => {

  const navigate=useNavigate()
  return (
    <div className="flex min-h-screen justify-center">
      {/* Left side image */}
      {/* <div
        className="hidden md:block w-1/2 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})`,objectFit:'cover' }}
      ></div> */}

      {/* Right side form */}
       <img
              src={bg}
              alt="AppLogo"className="absolute opacity-75 w-full h-full" // Set consistent width and height with rounded corners
            />
      <div className="flex items-center justify-end w-full md:w-1/2 p-6" style={{width:'90%'}}>
        <Card className="w-full max-w-sm p-6 bg-white rounded-xl shadow-xl shadow-blue-gray-200">
          <Typography variant="h4" className="mb-4 text-center">
            Forgot Password
          </Typography>
          <form className="space-y-6">
          <Input type="mobile" label="Mobile No or Email Address"  fullWidth />
           
            <Button type="submit" fullWidth className="bg-primary hover:bg-primaryLight hover:text-primary">
            send
            </Button>
          </form>
         
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
