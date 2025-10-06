import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Building,
  Rocket,
  Users,
  Target,
  Calendar,
  Check,
  Building2,
  CalendarClock,
  Clock,
} from "lucide-react";
import {
  Input,
  Typography,
  Button,
  Card,
  Select,
  Option,
} from "@material-tailwind/react";

import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import axios from "axios";
import SingleSelectDropdown from "../../components/SingleSelectDropdown/SingleSelectDropdown";
import Address from "../../components/Address/Address";
import {
  GetStructureAction,
  GetOrganizationAction,
  GetBranchCreationAction,
  GetAllWizardAction,
} from "../../redux/Action/Wizard/WizardAction";
import { GetTypeOfIndustry } from "../../redux/Action/typeOfIndustory/TypeOfIndustryAction";
import { FloatingInput } from "../../components/FloatingInput/FloatingInput";
import OrganizationForm from "./OrganizationForm";
import BranchSettings from "./BranchSettings";
import LeaveSettings from "./LeaveSettings";
import ShiftOvertimeSelector from "./ShiftOvertimeSelector";
import ShiftCreation from "./ShiftCreation";
import OTCreation from "./OTCreation";
import SalarySettings from "./SalarySettings";
import EmployeeCreation from "./EmployeeCreation";
import { useNavigate } from "react-router-dom";
import DefaultSalaryTemplate from "./DefaultSalaryTemplate";
import SalaryComponents from "./SalaryComponents";

const WizardScreen = () => {
  const navigate = useNavigate();
  const userId = useSelector((state) => state?.user?.user?._id);
  const { structure, status, errorMessage } = useSelector(
    (state) => state.wizard
  );
  console.log("User ID in Wizard:", userId);
  const dispatch = useDispatch();

  // const [currentStep, setCurrentStep] = useState(1);
  const [currentStep, setCurrentStep] = useState(() => {
    const savedStep = localStorage.getItem("wizardCurrentStep");
    return savedStep ? Number(savedStep) : 1;
  });

  const [finalData, setFinalData] = useState({ address: [] });
  const [formValidity, setFormValidity] = useState({ address: true });
  const typeOfIndustryList = useSelector(
    (state) => state.typeOfIndustury.typeList
  );
  const [wizardCompleted, setWizardCompleted] = useState(false);
  const [branchList, setBranchList] = useState([]);
  const shiftList = useSelector((state) => state.shift.shiftList);
  const [employeeList, setEmployeeList] = useState([]);
  const isToggleDisabled = shiftList.length > 0;
  const [overtimeList, setOvertimeList] = useState([]);
  useEffect(() => {
    const fetchIndustryList = async () => {
      const resultAction = await dispatch(GetTypeOfIndustry());
      console.log("Result of GetTypeOfIndustry:", resultAction);
    };
    fetchIndustryList();
  }, [dispatch]);

  // Fetch wizard data whenever step changes (esp. for 3 and above)
  useEffect(() => {
    if (currentStep >= 3) {
      fetchWizardData();
    }
  }, [currentStep]);

  console.log("Redux typeOfIndustryList:", typeOfIndustryList);

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("wizardFormData");
    return savedData
      ? JSON.parse(savedData)
      : {
          structure: "",
          branchName: "",
          orgName: "",
          groupName: "",
          orgTypeId: "",
          companyName: "",
          industry: "",
          companySize: "",
          goals: [],
          timeline: "",
          features: [],
        };
  });

  const steps = [
    { id: 1, title: "Get Started", icon: Rocket },
    { id: 2, title: "Organization Info", icon: Building },
    { id: 3, title: "Branch Timings", icon: Building2 },
    { id: 4, title: "Leave Settings", icon: CalendarClock },
    { id: 5, title: "Shift/OT Selection", icon: Clock },
    { id: 6, title: "Shift Creation", icon: Clock },
    { id: 7, title: "OT Creation", icon: Clock },
    { id: 8, title: "Salary Settings", icon: Target },
    { id: 9, title: "Statutory Settings", icon: Target }, // new screen
    { id: 10, title: "Employee Upload", icon: Users }, // shifted dow
  ];

  const totalSteps = steps.length; // instead of 5

  const handleInputChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem("wizardFormData", JSON.stringify(updated));
      return updated;
    });
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: prev[field].includes(value)
          ? prev[field].filter((item) => item !== value)
          : [...prev[field], value],
      };
      localStorage.setItem("wizardFormData", JSON.stringify(updated));
      return updated;
    });
  };

  const nextStep = async () => {
    if (currentStep === 2) {
      // Organization step
      if (!formData.orgTypeId) {
        alert("Please select a Business Type before proceeding");
        return;
      }

      if (!formData.orgId) {
        const payload = {
          name: formData.orgName || formData.groupName || formData.branchName,
          orgTypeId: formData.orgTypeId,
          structure: formData.structure,
        };

        try {
          const resultAction = await dispatch(GetOrganizationAction(payload));
          if (GetOrganizationAction.fulfilled.match(resultAction)) {
            setFormData((prev) => ({
              ...prev,
              orgId: resultAction.payload._id,
              branchId: resultAction.payload.branchId || null,
            }));
            setCurrentStep(currentStep + 1);
          } else {
            alert(
              resultAction.payload?.message || "Failed to create organization"
            );
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong while creating organization");
        }
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 3) {
      // BranchSettings step → create branch ONLY if branchId is not available
      if (!finalData.address || Object.keys(finalData.address).length === 0) {
        alert("Please fill in the address correctly");
        return;
      }

      // Skip API if branch already exists
      if (formData.branchId) {
        // Branch already exists → skip API
        setCurrentStep(currentStep + 1);
        return;
      }

      const payload = {
        orgId: formData.orgId, // link branch to organization
        name: formData.branchName || formData.orgName,
        address: finalData.address,
        geoLocation: finalData.geoLocation,
        geoJson: finalData.geoJson,
        timeSettingType: formData.timeSettingType || "startEnd",
        startTime: formData.startTime,
        endTime: formData.endTime,
        maxIn: formData.maxIn,
        minOut: formData.minOut,
        weekOff: formData.weekOff || [],
      };

      try {
        const resultAction = await dispatch(GetBranchCreationAction(payload));
        if (GetBranchCreationAction.fulfilled.match(resultAction)) {
          console.log("Branch created:", resultAction.payload);

          // Save branchId for later use
          setFormData((prev) => ({
            ...prev,
            branchId: resultAction.payload?.data?._id,
          }));

          setCurrentStep(currentStep + 1);
        } else {
          alert(resultAction.payload?.message || "Failed to create branch");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong while creating branch");
      }
    } else if (currentStep === 5) {
      // Shift/OT Selection
      if (!formData.shiftOvertime || isToggleDisabled) {
        setCurrentStep(8); // skip directly to Salary Settings
      } else {
        switch (formData.shiftOvertime) {
          case "Shifts":
            setCurrentStep(6); // go to ShiftCreation
            break;
          case "Overtime":
            setCurrentStep(7); // go to OTCreation
            break;
          case "Both":
            setCurrentStep(6); // start with ShiftCreation
            break;
          default:
            setCurrentStep(8); // fallback
        }
      }
    } else if (currentStep === 6) {
      // After ShiftCreation
      if (formData.shiftOvertime === "Both") {
        setCurrentStep(7); // go to OTCreation
      } else {
        setCurrentStep(8); // skip to Salary
      }
    } else if (currentStep === 7) {
      setCurrentStep(8); // After OTCreation → Salary
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const fetchWizardData = async () => {
    try {
      const resultAction = await dispatch(GetAllWizardAction());
      console.log("GetAllWizardAction result:", resultAction);

      if (GetAllWizardAction.fulfilled.match(resultAction)) {
        const data = resultAction.payload.data;

        // Organization data
        if (data?.organization) {
          setFormData((prev) => ({
            ...prev,
            orgId: data.organization._id,
            orgName: data.organization.name,
            orgTypeId: data.organization.orgTypeId,
            structure: data.organization.structure,
          }));
        }

        // Branch data
        if (data?.branch) {
          setFormData((prev) => ({
            ...prev,
            branchId: data.branch._id,
            branchName: data.branch.name || prev.branchName,
            startTime: data.branch.startTime,
            endTime: data.branch.endTime,
            maxIn: data.branch.maxIn,
            minOut: data.branch.minOut,
            weekOff: data.branch.weekoff || [],
          }));

          setFinalData({
            address: data.branch.address || {},
            geoLocation: data.branch.geoLocation || {},
            geoJson: data.branch.geoJson || {},
          });

          setBranchList([{ _id: data.branch._id, name: data.branch.name }]);
        }
        // Overtime data
        if (data?.overtime) {
          setOvertimeList(data.overtime); // Save OT list
        }
        if (data?.users) {
          setEmployeeList(data.users);
        }
      }
    } catch (err) {
      console.error("Error fetching wizard data:", err);
    }
  };

  // const prevStep = async () => {
  //   if (currentStep > 1) {
  //     const newStep = currentStep - 1;

  //     // Fetch wizard data only for steps 1-3
  //     if (newStep >= 1 && newStep <= 3) {
  //       try {
  //         const resultAction = await dispatch(GetAllWizardAction());
  //         console.log("GetAllWizardAction result:", resultAction);

  //         if (GetAllWizardAction.fulfilled.match(resultAction)) {
  //           const data = resultAction.payload.data;

  //           if (data?.organization) {
  //             setFormData((prev) => ({
  //               ...prev,
  //               orgId: data.organization._id,
  //               orgName: data.organization.name,
  //               orgTypeId: data.organization.orgTypeId,
  //               structure: data.organization.structure,
  //             }));
  //           }

  //           if (data?.branch) {
  //             setFormData((prev) => ({
  //               ...prev,
  //               branchId: data.branch._id,
  //               branchName: data.branch.name || prev.branchName,
  //               startTime: data.branch.startTime,
  //               endTime: data.branch.endTime,
  //               maxIn: data.branch.maxIn, // Here
  //               minOut: data.branch.minOut, //  Here
  //               weekOff: data.branch.weekoff || [],
  //             }));

  //             setFinalData({
  //               address: data.branch.address || {},
  //               geoLocation: data.branch.geoLocation || {},
  //               geoJson: data.branch.geoJson || {},
  //             });
  //             console.log("Branch data:", data.branch);
  //             // ← update branchList state here
  //             setBranchList([{ _id: data.branch._id, name: data.branch.name }]);
  //           }
  //         }
  //       } catch (err) {
  //         console.error("Error fetching wizard data:", err);
  //       }
  //     }

  //     setCurrentStep(newStep);
  //   }
  // };
  const prevStep = async () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;

      // Fetch wizard data only for steps 1-3
      if (newStep >= 1 && newStep <= 3) {
        await fetchWizardData();
      }

      setCurrentStep(newStep);
    }
  };

  useEffect(() => {
    const initializeStructure = async () => {
      if (!formData.structure) {
        try {
          const resultAction = await dispatch(GetStructureAction());
          if (GetStructureAction.fulfilled.match(resultAction)) {
            const structureValue = resultAction.payload?.data;
            setFormData((prev) => ({
              ...prev,
              structure: structureValue,
            }));

            // Auto-advance to step 2 if coming from step 1
            // if (currentStep === 1) setCurrentStep(2);
          }
        } catch (err) {
          console.error("Error fetching structure:", err);
        }
      } else {
        // Already have structure in localStorage, go to step 2
        if (currentStep === 1) setCurrentStep(2);
      }
    };

    initializeStructure();
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("wizardCurrentStep", currentStep);
  }, [currentStep]);

  // const handleFinish = async () => {
  //   console.log("Wizard completed with data:", formData);

  //   await dispatch(getUserByToken()); // refresh flags
  //   setWizardCompleted(true); // mark wizard as done
  //   navigate("/dashboard"); // redirect only here
  // };
  const handleFinish = async () => {
    console.log("Wizard completed with data:", formData);
    setWizardCompleted(true);
    localStorage.removeItem("wizardCurrentStep");
    localStorage.removeItem("wizardFormData");
    navigate("/dashboard");
  };

  const handleGetStarted = async () => {
    try {
      const resultAction = await dispatch(GetStructureAction());

      if (GetStructureAction.fulfilled.match(resultAction)) {
        const structureValue = resultAction.payload?.data; // "branch" | "organization" | "group"

        setFormData((prev) => ({
          ...prev,
          structure: structureValue, // store API value
        }));

        nextStep(); // move to case 2
      } else {
        alert(
          resultAction.payload?.message ||
            resultAction.error?.message ||
            "Failed to fetch structure"
        );
      }
    } catch (err) {
      console.error("Dispatch Error:", err);
      alert("Something went wrong while fetching structure");
    }
  };

  const renderStepIndicator = () => (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div key={step.id} className=" flex flex-col items-center">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200
                ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isCurrent
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-primary border border-primary"
                }
              `}
              >
                {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent ? "text-primary" : "text-primary"
                }`}
              >
                {step.title}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`
                  absolute top-5 w-full h-0.5 -z-10 transition-all duration-200
                  ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                `}
                  style={{
                    left: "50px",
                    width: "calc(100% - 100px)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="mb-8">
              <Typography className="text-primary mb-4 font-semibold text-[18px] capitalize  ">
                Welcome to SecurForce
              </Typography>
              <Typography className="text-[#6c6c6c] font-medium text-[14px] capitalize ">
                We'll Setup Organization, Timings, Leave, Shift, OT, Salary
                Settings, Employee and Client. Click Get Started to Continue
              </Typography>
            </div>
          </div>
        );

      case 2:
        return (
          <OrganizationForm
            formData={formData} // contains structure from API
            handleInputChange={handleInputChange}
            typeOfIndustryList={typeOfIndustryList} // match the prop name
            setFinalData={setFinalData}
            setFormValidity={setFormValidity}
          />
        );

      case 3:
        return (
          <BranchSettings
            formData={formData}
            handleInputChange={handleInputChange}
            setFinalData={setFinalData}
            setFormValidity={setFormValidity}
            state={{
              address: finalData.address,
              geoLocation: finalData.geoLocation,
              geoJson: finalData.geoJson,
            }}
          />
        );
      case 4:
        return (
          <LeaveSettings
            formData={formData}
            handleInputChange={handleInputChange}
            branchList={branchList}
            selectedBranch={formData.branchId} // ← extra, not used
          />
        );

      case 5:
        return (
          <ShiftOvertimeSelector
            value={formData.shiftOvertime}
            onChange={(val) => {
              handleInputChange("shiftOvertime", val);
              if (val) {
                // Auto-advance to Shift/OT Details step once user selects an option
                setCurrentStep(currentStep + 1);
              }
            }}
            disableToggle={isToggleDisabled}
          />
        );

      case 6:
        return (
          <ShiftCreation
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            branchList={branchList}
          />
        );

      case 7:
        return (
          <OTCreation
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            onSuccess={fetchWizardData} // refresh list after save
            overtimeList={overtimeList}
          />
        );

      case 8:
        return (
          <SalaryComponents
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 9:
        return (
          <DefaultSalaryTemplate
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 10:
        return (
          <EmployeeCreation
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            onSuccess={fetchWizardData} // refresh list after save
            employeeList={employeeList}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-14 px-4">
      <div className="max-w-full mx-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {renderStepIndicator()}

          <div className="mb-8">{renderStep()}</div>

          {/* Navigation Buttons - Only show for steps 2-5 */}
          {currentStep === 1 ? (
            // Special case for welcome screen - only show Get Started button
            <div className="flex justify-center">
              <button
                onClick={handleGetStarted}
                className="px-4 py-4 bg-primary text-white  rounded-lg hover:bg-primaryLight hover:text-primary transition-all duration-200 text-sm flex gap-2 justify-between"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            // Normal navigation for other steps
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="text-sm text-gray-500">
                Step {currentStep} of {totalSteps}
              </div>

              {currentStep < totalSteps ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleFinish();
                    navigate("/dashboard");
                  }}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                >
                  Finish
                  <CheckCircle className="w-4 h-4 ml-2" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardScreen;
