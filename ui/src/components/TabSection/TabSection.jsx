import React from "react";
import EmergencyNo from "../../pages/Client/Tabs/Emergency/EmergencyNo";

const TabSection = ({ tabs, selectedTab, children, handleTabClick }) => {
  const altNames = {
        clientOwnerDetails: "Owner Details",
    clientBranch: "Branch",
       clientShift: "Shifts",
    assignEmp: "Assign Employee",
    emergencyNo: "Contact Details",
    settings: "Settings",
  };
  return (
    <div className="flex maxsm:flex-col gap-4 maxsm:gap-2 border-2   bg-white rounded-lg border-gray-300 flex-1 h-full overflow-x-hidden">
      {/* Sidebar Tabs */}
      <div className="flex flex-col maxsm:flex-row scrolls gap-2 sticky top-0 right-0 p-2 bg-white z-20   border-b-2 sm:border-r-2  border-gray-300 overflow-auto sm:min-w-32 md:min-w-44">
        {tabs?.map((item) => (
          <button
            key={item}
            id={item}
            className={`flex capitalize items-center justify-between p-2 px-3 text-nowrap sm:truncate cursor-pointer rounded-md ${
              selectedTab === item
                ? "bg-primaryLight text-pop"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleTabClick(item)}
            disabled={selectedTab == item}
          >
            <h2 className="text-sm max-w-[25ch] sm:truncate">
              {altNames?.[item] ?? item}
            </h2>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 p-2 w-full ">{children}</div>
    </div>
  );
};

export default TabSection;
