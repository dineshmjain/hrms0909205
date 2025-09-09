import {Typography } from "@material-tailwind/react";


const SubCardHeader = ({
 headerLabel
}) => {
  return (
    <div
      className={`w-full  flex flex-col sm:flex-row sm:items-center sm:justify-between py-[5px]`}
    >

          <Typography className="text-[#5c5c5c] text-[16px] font-semibold">
            {headerLabel}
          </Typography>
 

    </div>
  );
};

export default SubCardHeader;
