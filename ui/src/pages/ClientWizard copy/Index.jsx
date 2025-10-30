import React, { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle, Building, Clock, Target, Upload, UserPlus } from "lucide-react";
import Branch from "./Branch/Branch";
import Shift from "./Shift/Shift";
import ReuirementsCheckPoints from "./RequirementsCheckPoints/RequirementsCheckPoints";

export default function Index() {
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSave, setIsSave] = useState(false);
  
  const [formData, setFormData] = useState({
    companyName: "",
    contractDate: "",
    branchName: "",
    ownerName: "",
    designation: "",
    contactMobile: "",
    contactEmail: "",
    gstNumber: "",
    panNumber: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    registeredAddress: "",
    selectedBranch: "",
    selectedEmployee: "",
    shifts: [],
  });

  const steps = [
    { id: 1, title: "Client Details", icon: Building },
    { id: 2, title: "Shifts", icon: Clock },
    { id: 3, title: "Requirements", icon: Target },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 1) {
      setIsSave(true);
    }
    if (currentStep < steps.length && isSave) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    alert("Client onboarded successfully!");
    console.log("Form data:", formData);
    setShowWizard(false);
    setCurrentStep(1);
    setIsSave(false);
    // Reset form
    setFormData({
      companyName: "",
      contractDate: "",
      branchName: "",
      ownerName: "",
      designation: "",
      contactMobile: "",
      contactEmail: "",
      gstNumber: "",
      panNumber: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      registeredAddress: "",
      selectedBranch: "",
      selectedEmployee: "",
      shifts: [],
    });
  };

  const handleAddClient = () => {
    setShowWizard(true);
  };

  const handleBulkUpload = () => {
    alert("Bulk Upload feature - Navigate to bulk upload screen");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div>
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

         
            <>
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
                        {index < steps.length - 1 && (
                          <div className={`absolute top-5 w-full h-0.5 -z-10 transition-all duration-200 ${
                            isCompleted ? "bg-green-500" : "bg-gray-200"
                          }`} style={{ left: "50px", width: "calc(100% - 100px)" }} />
                        )}
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
                    setFormData={setFormData} 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    isSave={isSave} 
                  />
                )}

                {currentStep === 2 && (
                  <Shift 
                    formData={formData} 
                    handleInputChange={handleInputChange} 
                    setFormData={setFormData} 
                  />
                )}

                {currentStep === 3 && (
                  <ReuirementsCheckPoints/>
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
                    className="flex items-center px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700"
                  >
                    {currentStep === 1 ? 'Save' : 'Next'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Complete
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </>
      
        </div>
      </div>
    </div>
  );
}