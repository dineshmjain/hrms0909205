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
  CalendarClock,
  Clock,
  Building2,
  DollarSign,
  Briefcase,
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
import { SubOrgEditAction } from "../../redux/Action/SubOrgAction/SubOrgAction";
import { GetTypeOfIndustry } from "../../redux/Action/typeOfIndustory/TypeOfIndustryAction";
import { BranchGetAction } from "../../redux/Action/Branch/BranchAction";
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

  // Get branch list from Redux store
  const branchList = useSelector((state) => state.branch.branchList || []);
  const shiftList = useSelector((state) => state.shift.shiftList);
  const [employeeList, setEmployeeList] = useState([]);
  const isToggleDisabled = shiftList.length > 0;
  const [overtimeList, setOvertimeList] = useState([]);

  useEffect(() => {
    console.log("branchList updated:", branchList);
  }, [branchList]);

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

          name: "",
          startTime: "",
          endTime: "",
          maxIn: "",
          minOut: "",
          weekOff: [],
          salaryCycle: "",
          timeSettingType: "startEnd",
        };
  });

  const steps = [
    { id: 1, title: "Get Started", icon: Rocket },
    { id: 2, title: "Organization Info", icon: Building },
    { id: 3, title: "Leave Settings", icon: CalendarClock },
    { id: 4, title: "Shift/OT Selection", icon: Clock },
    // Only show these steps when "Both" is selected
    ...(formData.shiftOvertime === "Both"
      ? [
          { id: 5, title: "Shift Creation", icon: Clock },
          { id: 6, title: "OT Creation", icon: Clock },
        ]
      : []),
    { id: 9, title: "Employee Upload", icon: Users },
    { id: 10, title: "Complete Setup", icon: CheckCircle },
  ];

  const totalSteps = steps.length;

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

          // Fetch branches using BranchGetAction
          await dispatch(BranchGetAction({ orgId: data.organization._id }));
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
        }

        // Overtime data - ADD CONSOLE LOG HERE
        if (data?.overtime) {
          console.log("Setting OT list from API:", data.overtime);
          setOvertimeList(data.overtime);
        } else {
          console.log("No overtime data in API response");
          setOvertimeList([]);
        }

        if (data?.users) {
          setEmployeeList(data.users);
        }
      }
    } catch (err) {
      console.error("Error fetching wizard data:", err);
    }
  };

  const nextStep = async () => {
    if (currentStep === 4) {
      if (!formData.shiftOvertime || formData.shiftOvertime.trim() === "") {
        // No selection -> skip to Employee Upload (step 9)
        setCurrentStep(9);
      } else if (
        formData.shiftOvertime === "Shifts" ||
        formData.shiftOvertime === "Overtime"
      ) {
        // Only one selected -> they configure inline, so go directly to step 9
        setCurrentStep(9);
      } else if (formData.shiftOvertime === "Both") {
        // Both -> go to Shift Creation step (step 5)
        setCurrentStep(5);
      }
    }

    // Step 5 (Shift Creation) - only reached when "Both" is selected
    else if (currentStep === 5) {
      setCurrentStep(6); // Go to OT Creation
    }

    // Step 6 (OT Creation) - only reached when "Both" is selected
    else if (currentStep === 6) {
      setCurrentStep(9); // Go to Employee Upload
    }

    // Step 9 (Employee Upload) - go to step 10 (Complete Setup)
    else if (currentStep === 9) {
      setCurrentStep(10);
    }

    // Normal progression for other steps
    else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = async () => {
    if (currentStep > 1) {
      let newStep = currentStep - 1;

      if (currentStep === 10) {
        // Coming from Complete Setup -> go back to Employee Upload (step 9)
        newStep = 9;
      } else if (currentStep === 9) {
        // Coming from Employee Upload
        if (!formData.shiftOvertime || formData.shiftOvertime.trim() === "") {
          // No shift/OT selected -> go back to selection (step 4)
          newStep = 4;
        } else if (formData.shiftOvertime === "Both") {
          // Both selected -> go back to OT Creation (step 6)
          newStep = 6;
        } else {
          // Only Shifts or Only OT -> go back to selection (step 4) where they configured inline
          newStep = 4;
        }
      } else if (currentStep === 6) {
        // Coming from OT Creation (only when "Both" selected)
        newStep = 5; // Go back to Shift Creation
      } else if (currentStep === 5) {
        // Coming from Shift Creation (only when "Both" selected)
        newStep = 4; // Go back to selection
      }

      // Fetch wizard data for early steps
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
          // Step 1: Get Structure
          const structureResult = await dispatch(GetStructureAction());

          if (GetStructureAction.fulfilled.match(structureResult)) {
            const structureValue = structureResult.payload?.data;
            setFormData((prev) => ({
              ...prev,
              structure: structureValue,
            }));

            // Step 2: Get Organization Name from wizard data
            const wizardResult = await dispatch(GetAllWizardAction());

            if (GetAllWizardAction.fulfilled.match(wizardResult)) {
              const organizationName =
                wizardResult.payload?.data?.organization?.name;
              const orgId = wizardResult.payload?.data?.organization?._id;

              if (organizationName) {
                // Step 3: Create/Update Organization with structure
                const orgPayload = {
                  name: organizationName,
                  structure: structureValue,
                };

                const orgResult = await dispatch(
                  GetOrganizationAction(orgPayload)
                );

                if (GetOrganizationAction.fulfilled.match(orgResult)) {
                  console.log(
                    "Organization updated successfully with structure"
                  );

                  // Fetch branches
                  if (orgId) {
                    await dispatch(BranchGetAction({ orgId }));
                  }
                }
              }
            }
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

  const handleFinish = async () => {
    console.log("Wizard completed with data:", formData);
    setWizardCompleted(true);
    localStorage.removeItem("wizardCurrentStep");
    localStorage.removeItem("wizardFormData");
    navigate("/dashboard");
  };

  const handleGetStarted = async () => {
    try {
      // Step 1: Get structure
      const structureResult = await dispatch(GetStructureAction());

      if (GetStructureAction.fulfilled.match(structureResult)) {
        const structureValue = structureResult.payload?.data;

        // Step 2: Get organization name
        const wizardResult = await dispatch(GetAllWizardAction());
        if (GetAllWizardAction.fulfilled.match(wizardResult)) {
          const organizationName =
            wizardResult.payload?.data?.organization?.name || "DefaultOrgName";
          const orgId = wizardResult.payload?.data?.organization?._id;

          // Step 3: Hit GetOrganizationAction
          const orgPayload = {
            name: organizationName,
            structure: structureValue
          };

          const orgResult = await dispatch(GetOrganizationAction(orgPayload));

          if (GetOrganizationAction.fulfilled.match(orgResult)) {
            console.log("✅ GetOrganizationAction success:", orgResult.payload);
            // Store structure and org name locally
            setFormData((prev) => ({
              ...prev,
              orgName: organizationName,
              structure: structureValue,
              orgId: orgId,
            }));

            // Fetch branches
            if (orgId) {
              await dispatch(BranchGetAction({ orgId }));
            }

            setCurrentStep(2); // Move to next step
          } else {
            alert(
              orgResult.payload?.message || "Failed to process organization"
            );
          }
        } else {
          alert("Failed to fetch organization name");
        }
      } else {
        alert("Failed to fetch structure");
      }
    } catch (err) {
      console.error("Error in handleGetStarted:", err);
      alert("Something went wrong while starting the wizard");
    }
  };

  const renderStepIndicator = () => {
    // Find the current step index (0-based)
    const currentStepIndex = steps.findIndex((step) => step.id === currentStep);
    const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

    return (
      <div className="w-full mb-8">
        <div className="relative flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative z-10">
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
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium text-center ${
                      isCurrent ? "text-primary" : "text-primary"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                    flex-1 h-0.5 mx-2 transition-all duration-200
                    ${isCompleted ? "bg-green-500" : "bg-gray-200"}
                  `}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6 py-2">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary/90 rounded-full shadow-sm backdrop-blur-sm">
              <Typography className="text-white text-sm font-semibold tracking-wide uppercase">
                Quick Setup Wizard
              </Typography>
            </div>
            <div className="space-y-3">
              <Typography className="text-primary text-3xl md:text-4xl font-bold tracking-tight">
                Welcome to{" "}
                <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                  SecurForce
                </span>
              </Typography>
              <Typography className="text-gray-600 text-lg max-w-2xl mx-auto">
                Let's get your workspace ready in just a few minutes. Follow
                these quick steps to complete your setup effortlessly.
              </Typography>
            </div>
          </div>
        );

      case 2:
        return (
          <OrganizationForm
            formData={formData}          
            handleInputChange={handleInputChange}
            typeOfIndustryList={typeOfIndustryList}
            setFinalData={setFinalData}
            setFormValidity={setFormValidity}
            state={{
              address: finalData.address,
              geoLocation: finalData.geoLocation,
              geoJson: finalData.geoJson,
            }}
          />
        );

      case 3:
        return (
          <LeaveSettings
            formData={formData}
            handleInputChange={handleInputChange}
            branchList={branchList}
            selectedBranch={formData.branchId}
          />
        );

     

      case 4:
        return (
          <div className="space-y-8">
            {/* Shift/OT Selector */}
            <ShiftOvertimeSelector
              value={formData.shiftOvertime}
              onChange={(val) => {
                handleInputChange("shiftOvertime", val);
              }}
              disableToggle={false}
              existingShifts={shiftList && shiftList.length > 0}
              existingOT={overtimeList && overtimeList.length > 0}
            />

            {/* Show Shift Creation inline ONLY if "Shifts" is selected (not "Both") */}
            {formData.shiftOvertime === "Shifts" && (
              <div className="border-t-2 border-blue-200 pt-6 mt-6">
                <Typography
                  variant="h5"
                  className="font-bold text-gray-800 mb-4"
                >
                  {shiftList && shiftList.length > 0
                    ? "Shift Management"
                    : "Configure Shifts"}
                </Typography>
                <ShiftCreation
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                  branchList={branchList}
                  onSuccess={fetchWizardData}
                />
              </div>
            )}

            {/* Show OT Creation inline ONLY if "Overtime" is selected (not "Both") */}
            {formData.shiftOvertime === "Overtime" && (
              <div className="border-t-2 border-green-200 pt-6 mt-6">
                <Typography
                  variant="h5"
                  className="font-bold text-gray-800 mb-4"
                >
                  {overtimeList && overtimeList.length > 0
                    ? "Overtime Management"
                    : "Configure Overtime"}
                </Typography>
                <OTCreation
                  formData={formData}
                  setFormData={setFormData}
                  handleInputChange={handleInputChange}
                  onSuccess={fetchWizardData}
                  branchList={branchList}
                />
              </div>
            )}

            {/* Info message when "Both" is selected */}
            {formData.shiftOvertime === "Both" && (
              <div className="p-6 bg-blue-50 border-2 border-blue-300 rounded-lg">
                <Typography className="text-blue-800 font-semibold mb-2">
                   Both Shift and Overtime selected
                </Typography>
                <Typography className="text-blue-700 text-sm">
                  Click "Next" to configure Shifts first, then Overtime in
                  separate steps.
                </Typography>
              </div>
            )}

            {/* Info message when nothing is selected */}
            {!formData.shiftOvertime && (
              <div className="p-6 bg-gray-50 border-2 border-gray-300 rounded-lg">
                <Typography className="text-gray-700 text-sm">
                  No selection made.if there is no SHift or OT , You can skip this step and proceed directly
                  to Employee Upload 
                </Typography>
              </div>
            )}
          </div>
        );
      case 5:
        // Only shown when "Both" is selected
        return (
          <ShiftCreation
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            branchList={branchList}
            onSuccess={fetchWizardData}
          />
        );

      case 6:
        // Only shown when "Both" is selected
        return (
          <OTCreation
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            onSuccess={fetchWizardData}
            overtimeList={overtimeList}
            branchList={branchList}
          />
        );

      case 9:
        return (
          <EmployeeCreation
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            onSuccess={fetchWizardData}
            employeeList={employeeList}
          />
        );

      case 10:
        return (
          <div className="text-center space-y-2 py-2">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mx-auto">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <div className="space-y-2">
              <Typography className="text-primary text-xl md:text-lg font-bold tracking-tight">
                Organization Setup Complete!
              </Typography>
              <Typography className="text-gray-600 text-lg max-w-2xl mx-auto">
                Your organization is now configured. Would you like to add
                clients to your system?
              </Typography>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleFinish}
                className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  navigate("/auth/assist-client");
                }}
                className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
              >
                Add Clients
                <Users className="w-5 h-5" />
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="min-h-screen py-14 px-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #1E40AF 100%)",
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="squareGrid"
              patternUnits="userSpaceOnUse"
              width="60"
              height="60"
            >
              <rect
                x="0"
                y="0"
                width="60"
                height="60"
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#squareGrid)" />
        </svg>
      </div>

      <div className="max-w-full mx-6">
        <div className="bg-white/100 rounded-2xl shadow-md p-8 space-y-6 transition-all duration-300 min-h-[600px]">
          {renderStepIndicator()}

          <div className="mb-2">{renderStep()}</div>

          {/* Navigation Buttons */}
          {currentStep === 1 ? (
            <div className="flex justify-center">
              <button
                onClick={handleGetStarted}
                className="px-4 py-4 bg-primary text-white rounded-lg hover:bg-primaryLight hover:text-primary transition-all duration-200 text-sm flex gap-2 justify-between"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : currentStep === 10 ? (
            <div className="flex justify-start">
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            </div>
          ) : (
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

              <button
                onClick={nextStep}
                className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WizardScreen;
