import { Button, IconButton, Typography } from "@material-tailwind/react";
import React from "react";
import { FaPen } from "react-icons/fa";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Header = ({
  isSubTab = false,
  isButton = true,
  handleClick = () => { },
  handleEdit = () => { },
  headerLabel,
  subHeaderLabel,
  buttonDisbaled = false,
  isBackHandler = false,
  isEditAvaliable = false,
  buttonTitle = "Add",
  handleBack,
}) => {
  const navigate = useNavigate();

  const BackHandler = () => {
    navigate(-1);
  };
  console.log(isEditAvaliable,"isbutton");
  

  return (
    <div
      className={`w-full p-2 flex flex-wrap gap-4  items-center sm:justify-between `}
    >
      {/* Left: Back button and title */}
      <div className="flex flex-wrap sm:flex-row items-center gap-4 flex-1 min-w-[200px]">
        {isBackHandler && isSubTab==false && (
          <button
            onClick={handleBack || BackHandler}
            className="flex items-center justify-center text-gray-600 hover:text-pop transition-colors  bg-primary
                hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-8 sm:h-8 rounded-full">
            <MdArrowBack className="text-2xl sm:text-lg" />
          </button>
        )}
        <div className="">
          <Typography className="text-gray-900 font-semibold text-[18px] capitalize  ">
            {headerLabel}
          </Typography>
          {subHeaderLabel && (
            <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
              {subHeaderLabel}
            </Typography>
          )}
        </div>
      </div>

      {/* Right: Action button */}
      {isButton && (
        <div className="flex justify-end">
          {!isEditAvaliable ? (
            <button
              className="flex items-center gap-2 cursor-pointer transition ease-in-out duration-[.2s] w-fit bg-primary shadow-none text-popfont-medium text-white px-2 py-2 rounded-md hover:bg-primaryLight hover:shadow-none text-sm hover:text-primary"
              onClick={isEditAvaliable ? handleEdit : handleClick}
              disabled={buttonDisbaled}
            >
              {isEditAvaliable ? "Edit" : buttonTitle}
            </button>
          ) : (
            <IconButton
              onClick={handleEdit}
              size="sm"
              className="flex items-center justify-center text-gray-600 hover:text-pop transition-colors  bg-primary
                hover:bg-primaryLight text-white hover:text-primary w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            >
              <FaPen
                // onClick={handleEdit}
                className=""
              />
            </IconButton>
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
