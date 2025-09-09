import { Radio } from "@material-tailwind/react";
import { FaRegBuilding } from "react-icons/fa";
import { BsBuildingsFill } from "react-icons/bs";
import { PiBuildingApartmentFill, PiCheck } from "react-icons/pi";
import { motion } from "framer-motion";

const StructureSelect = ({ handleChange, form }) => {
  const structData = {
    branch: {
      name: "Single Organization",
      details: ["Single Organization", "No Branch"],
      icon: <FaRegBuilding className="w-12 h-12" />,
    },
    organization: {
      name: "Single Org with Branches",
      details: ["Single Organization", "Multiple Branches"],
      icon: <PiBuildingApartmentFill className="w-12 h-12" />,
    },
    group: {
      name: "Group of Organizations",
      details: [
        "One Group Organisation",
        "Multiple Sub-Organizations",
        "Multiple Branches",
      ],
      icon: <BsBuildingsFill className="w-12 h-12" />,
    },
  };

  const handleStructureClick = (e) => {
    handleChange(e);
  };

  return (
    <div className="flex flex-col gap-6 font-inter w-full">
     

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Object.entries(structData).map(([key, data]) => {
          const isActive = form?.structure === key;

          return (
            <motion.label
              key={key}
              htmlFor={key}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex flex-col items-center gap-5 p-8 rounded-3xl backdrop-blur-xl
                transition-all duration-300 cursor-pointer border 
                ${
                  isActive
                    ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl shadow-blue-100"
                    : "border-gray-200 bg-gradient-to-br from-white/80 to-gray-50 hover:border-blue-400 hover:shadow-lg"
                }
              `}
            >
              {/* Hidden Radio */}
              <Radio
                name="structure"
                id={key}
                value={key}
                onChange={handleStructureClick}
                className={"hidden"}
                iconProps={{className:'hidden'}}

              />

              {/* Icon with Animated Ring */}
              <div className="relative flex items-center justify-center w-20 h-20">
                {isActive && (
                  <motion.span
                    layoutId="activeRing"
                    className="absolute w-24 h-24 rounded-full border-4 border-blue-400 opacity-50"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.5 }}
                    transition={{ duration: 0.4 }}
                  />
                )}
                <motion.div
                  className={`w-16 h-16 flex items-center justify-center rounded-2xl transition-all duration-500 
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-primary"
                    }
                  `}
                  animate={{ rotate: isActive ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {data.icon}
                </motion.div>
              </div>

              {/* Title */}
              <span
                className={`text-lg font-bold text-center transition-colors ${
                  isActive ? "text-blue-600" : "text-gray-800"
                }`}
              >
                {data.name}
              </span>

              {/* Details */}
              <ul className="text-sm text-gray-600 space-y-1 text-center font-medium">
                {data.details.map((item, idx) => (
                  <li key={idx}>
                    {idx + 1}. {item}
                  </li>
                ))}
              </ul>

              {/* Selection Indicator */}
              {isActive && (
             <motion.span
  className="absolute top-4 right-4 flex items-center justify-center w-5 h-5 bg-green-500 rounded-full text-white"
  animate={{ scale: [0.8, 1.2, 1] }}
  transition={{ duration: 0.5, ease: "easeInOut" }}
>
  <PiCheck size={14}  />
</motion.span>
              )}
            </motion.label>
          );
        })}
      </div>
    </div>
  );
};

export default StructureSelect;
