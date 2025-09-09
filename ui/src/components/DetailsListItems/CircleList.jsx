import React from "react";
import TooltipMaterial from "../TooltipMaterial/TooltipMaterial";
import SingleLine from "./SingleLine";

const CircleList = ({ dataList = [] }) => {
  let color = {
    dept: "bg-pink-600",
    designation: "bg-green-600",
    emp: "bg-orange-800",
  };
  let temp = [...dataList];
  const getInitials = (emp) => {
    switch (emp?.type) {
      case "emp":
        return (
          emp?.name?.firstName[0] +
          (emp?.name?.lastName?.[0] || emp?.name?.firstName?.[1])
        )?.toUpperCase();
      case "dept":
        return (emp?.name[0] + emp?.name[1])?.toUpperCase();
      case "designation":
        return (emp?.name[0] + emp?.name[1])?.toUpperCase();
      default:
        return (
          emp?.name?.firstName[0] +
          (emp?.name?.lastName?.[0] || emp?.name?.firstName?.[1])
        )?.toUpperCase();
    }
  };
  return (
    <div className="flex items-center prevent-modal-open ">
      {dataList?.map((emp, iIdx) => {
        let initials = getInitials(emp);
        return (
          iIdx <= 2 && (
            <TooltipMaterial
              content={<SingleLine emp={emp} idx={iIdx} key={iIdx} />}
              key={iIdx}
            >
              <div
                className={`w-8 h-8 maxsm:w-7 maxsm:h-7 flex items-center justify-center 
                        hover:z-10 overflow-hidden rounded-full border-2 border-gray-100 
                        font-semibold text-xs maxsm:text-[.7rem] 
                        ${
                          color?.[emp?.type] || color?.["emp"]
                        } text-white cursor-pointer`}
                style={{
                  marginLeft: iIdx === 0 ? "0px" : "-6px", // Overlapping effect
                }}
              >
                {emp?.imgPath ? (
                  <img
                    src={emp?.imgPath}
                    className="object-cover h-8 w-8 maxsm:w-7 maxsm:h-7"
                  />
                ) : (
                  <div>{initials}</div>
                )}
              </div>
            </TooltipMaterial>
          )
        );
      })}
      {dataList?.length > 3 && (
        <TooltipMaterial
          content={
            <div className="flex flex-col gap-2">
              {temp.splice(3, temp.length - 1).map((emp, iIdx) => {
                return <SingleLine emp={emp} idx={iIdx} />;
              })}
            </div>
          }
        >
          <div
            className="w-8 h-8 maxsm:w-7 maxsm:h-7 flex items-center justify-center 
                   hover:z-10 rounded-full border-2 border-gray-100 font-semibold 
                   bg-orange-800 text-white cursor-pointer"
            style={{
              marginLeft: "-6px", // Keeps overlap effect consistent
            }}
          >
            +{dataList.length - 3}
          </div>
        </TooltipMaterial>
      )}
    </div>
  );
};

export default CircleList;
