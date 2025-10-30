import BranchTab from "./BranchTab";
import EmployeeAssign from "../../../components/EmployeeAssign/EmployeeAssign";
import ShiftTab from "./ShiftTab";
import OwnerDetails from "./OwnerDetails";
import EmergencyNo from "./Emergency/EmergencyNo";
import Settings from "./Settings/Settings";
import KYC from "./KYC";

const TabsContent = ({ tab, ...rest }) => {
  const tabData = {
    clientOwnerDetails: <OwnerDetails {...rest} />,
    clientBranch: <BranchTab {...rest} />,
    kyc: <KYC {...rest} />,
    clientShift: <ShiftTab {...rest} />,
    assignEmp: <EmployeeAssign {...rest} />,
    emergencyNo: <EmergencyNo {...rest} />,
    settings: <Settings {...rest} />,
  };

  let selectedTab = tabData?.[tab];
  if (!selectedTab) return <></>;
  return selectedTab;
};

export default TabsContent;
