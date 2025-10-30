import React, { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle, Building, Clock, Target, Upload } from "lucide-react";
import Branch from "./Branch/Branch";
import Shift from "./Shift/Shift";
import RequirementsCheckPoints from "./RequirementsCheckPoints/RequirementsCheckPoints";

export default function Index() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isStepValid, setIsStepValid] = useState(false);
  
  // Centralized data state
  const [wizardData, setWizardData] = useState({
    clientDetails: null,
    branches: [],
    shifts: [],
    requirements: []
  });

  const steps = [
    { id: 1, title: "Client Details", icon: Building },
    { id: 2, title: "Shifts", icon: Clock },
    { id: 3, title: "Requirements", icon: Target },
  ];

  const handleNext = () => {
    if (currentStep < steps.length && isStepValid) {
      setCurrentStep(currentStep + 1);
      setIsStepValid(false); // Reset for next step
    } else if (!isStepValid) {
      alert(`Please complete Step ${currentStep} before proceeding`);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setIsStepValid(true); // Previous steps are assumed valid
    }
  };

  const handleFinish = () => {
    if (!isStepValid) {
      alert("Please complete all requirements before finishing");
      return;
    }

    console.log("Final Wizard Data:", wizardData);
    alert("Client onboarded successfully!");
    
    // Reset wizard
    setCurrentStep(1);
    setIsStepValid(false);
    setWizardData({
      clientDetails: null,
      branches: [],
      shifts: [],
      requirements: []
    });
  };

  const handleBulkUpload = () => {
    alert("Bulk Upload feature - Navigate to bulk upload screen");
  };

  // Callback to update wizard data from child components
  const updateWizardData = (stepKey, data, isValid = true) => {
    setWizardData(prev => ({
      ...prev,
      [stepKey]: data
    }));
    setIsStepValid(isValid);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div className="text-center flex-1">
              <h1 className="text-primary mb-3 font-bold text-3xl">Client Onboarding</h1>
              <p className="text-gray-600 text-sm">Complete setup in {steps.length} steps</p>
            </div>

            <button
              onClick={handleBulkUpload}
              className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Upload className="w-5 h-5" />
              Bulk Upload
            </button>
          </div>

          {/* Step Indicators */}
          <div className="mb-8 relative">
            <div className="flex justify-evenly items-center mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-200 ${
                      isCompleted ? "bg-green-500 text-white" :
                      isCurrent ? "bg-primary text-white" :
                      "bg-gray-200 text-primary border border-primary"
                    }`}>
                      {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                    </div>
                    <span className={`text-xs font-medium ${isCurrent ? "text-primary" : "text-primary"}`}>
                      {step.title}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8 min-h-[300px]">
            {currentStep === 1 && (
              <Branch
                wizardData={wizardData}
                updateWizardData={updateWizardData}
                isStepValid={isStepValid}
                setIsStepValid={setIsStepValid}
              />
            )}

            {currentStep === 2 && (
              <Shift
                wizardData={wizardData}
                updateWizardData={updateWizardData}
                isStepValid={isStepValid}
                setIsStepValid={setIsStepValid}
              />
            )}

            {currentStep === 3 && (
              <RequirementsCheckPoints
                wizardData={wizardData}
                updateWizardData={updateWizardData}
                isStepValid={isStepValid}
                setIsStepValid={setIsStepValid}
              />
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-blue-700"
              }`}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <span className="text-sm text-gray-500 font-medium">
              Step {currentStep} of {steps.length}
            </span>

            {currentStep < steps.length ? (
              <button
                onClick={handleNext}
                disabled={!isStepValid}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  isStepValid
                    ? "bg-primary text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!isStepValid}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  isStepValid
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Complete
                <CheckCircle className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}