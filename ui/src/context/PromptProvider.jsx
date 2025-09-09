import { AnimatePresence, motion } from "framer-motion";
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";
import SvgQuestion from "../assets/svgs/Question";

const PromptContext = createContext();

export const usePrompt = () => useContext(PromptContext);

export const PromptProvider = ({ children }) => {
  const [promptData, setPromptData] = useState(null);

  const showPrompt = (data) => {
    setPromptData(data);
  };

  const hidePrompt = () => {
    setPromptData(null);
  };

  const colors = {
    0: { bg: "bg-red-700", text: `text-red-100` },
    1: { bg: "bg-green-700", text: `text-green-100` },
  };
  console.log(promptData);

  // const dropdownRef = useRef(null);

  // const handleClickOutside = (event) => {
  //   if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
  //     setPromptData(null);
  //   }
  // };

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return createPortal(
    <PromptContext.Provider value={{ showPrompt, hidePrompt }}>
      {children}
      {promptData && (
        <div className="fixed z-50 w-[100%] top-0 font-inter text-sm left-0 bg-[#00000093] prevent-sidebar-close h-[100vh] backdrop-blur-[1px]	 flex items-center justify-center flex-col gap-2 ">
          <AnimatePresence>
            <motion.div
              key={promptData}
              initial={{ scale: 0, opacity: 0 }} // Starts hidden and scaled down
              animate={{ scale: 1, opacity: 1 }} // Scales up and fades in when visible
              exit={{ scale: 0, opacity: 0 }} // Scales down and fades out when hidden
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <div className="bg-primary/10 p-1 rounded-[1vw]">
                <div
                  className="relative bg-white md:w-[40vw]  lg:w-[25vw]  min-h-[40%] rounded-[1vw] flex flex-col items-center gap-2 justify-evenly pt-[5%]"
                  //  ref={dropdownRef}
                >
                  {/* px-[30px] py-[40px] */}
                  <div className="flex w-full justify-center items-center px-[3%] mb-[6%]">
                    <div className="flex items-center gap-2">
                      {promptData?.icon || <SvgQuestion />}
                    </div>
                  </div>
                  <div className="w-full items-center mb-[22%]">
                    <div className="flex w-full items-center justify-center px-[3%]">
                      <span
                        className={`font-semibold  text-lg ${
                          promptData?.type == 1 ? `text-green-800` : `text-gray-900`
                        }`}
                      >
                        {promptData?.heading || `Choose an option`}
                      </span>
                    </div>
                    {promptData.content && <div className=" px-[3%]">{promptData.content}</div>}

                    <div className="flex w-full self-start font-medium text-gray-700 justify-center px-[3%] py-[1%]">
                      {promptData?.message}
                    </div>

                  </div>
                  <div className="flex gap-4  w-full justify-center h-full flex-wrap absolute items-end pb-[7%]">
                    {promptData?.buttons?.map((button, idx) => {
                      const bg = colors[button?.type]?.bg;
                      const text = colors[button?.type]?.text;
                      return (
                        <div
                          className={` py-[1%] px-[1%] cursor-pointer text-md  maxsm:flex-1 maxsm:w-[50%] tuncate text-center  w-[12vw] md:w-[18vw]  lg:w-[10vw] font-medium  ${
                            bg || `bg-gray-600`
                          } ${text || `text-white`} rounded-md ${
                            button?.customCss
                          }`}
                          key={idx}
                          onClick={() => button?.onClick()}
                        >
                          {button?.label}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </PromptContext.Provider>,
    document.body
  );
};
