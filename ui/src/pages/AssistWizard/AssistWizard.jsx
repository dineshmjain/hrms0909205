import React, { useState } from "react";
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
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
const WizardScreen = () => {
  const userId = useSelector((state) => state?.user?.user?._id);
  console.log("User ID in Wizard:", userId);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    goals: [],
    timeline: "",
    features: [],
  });

  const totalSteps = 5;

  const steps = [
    { id: 1, title: "Get Started", icon: Rocket },
    { id: 2, title: "Company Info", icon: Building },
    { id: 3, title: "Team Size", icon: Users },
    { id: 4, title: "Goals", icon: Target },
    { id: 5, title: "Timeline", icon: Calendar },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleArrayToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    console.log("Wizard completed with data:", formData);
    // Handle completion logic here
    alert("Setup completed successfully!");
  };
  const handleGetStarted = async () => {
    try {
      const body = {
        SoftwareID: 17,
        UserId: userId, //  from Redux
      };
      console.log(" Sending payload:", body);
      const res = await axios.post(
        "http://117.205.68.9/masterportalv2/subscription/features/get/active",
        body
      );

      console.log("API Response:", res.data);

      if (res?.data?.status === 200) {
        // Save features into formData
        setFormData((prev) => ({
          ...prev,
          features: res.data.data,
        }));

        // go to next step
        nextStep();
      } else {
        alert(res.data.message || "Failed to fetch features");
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Something went wrong while fetching features");
    }
  };

  const renderStepIndicator = () => (
    <div className="w-9xl mb-8">
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
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }
              `}
              >
                {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
              </div>
              <span
                className={`text-xs font-medium ${
                  isCurrent ? "text-blue-600" : "text-gray-500"
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
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Welcome to SecurForce
              </h2>
              <p className="text-lg text-gray-600 mx-auto leading-relaxed max-w-2xl">
                We'll Setup Organization, Timings, Leave, Shift, OT, Salary
                Settings, Employee and Client. Click Get Started to Continue
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <Building className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Company Information
              </h2>
              <p className="text-gray-600">Tell us about your organization</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) =>
                  handleInputChange("companyName", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange("industry", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select your industry</option>
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Team Size
              </h2>
              <p className="text-gray-600">
                How many people are in your organization?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "1-10", label: "1-10 employees" },
                { value: "11-50", label: "11-50 employees" },
                { value: "51-200", label: "51-200 employees" },
                { value: "201+", label: "201+ employees" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange("companySize", option.value)}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    formData.companySize === option.value
                      ? "border-blue-500 bg-blue-50 text-blue-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-semibold">{option.value}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {option.label}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Primary Goals
              </h2>
              <p className="text-gray-600">
                What do you want to achieve? (Select all that apply)
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  value: "productivity",
                  label: "Increase Productivity",
                  desc: "Streamline workflows and processes",
                },
                {
                  value: "collaboration",
                  label: "Improve Collaboration",
                  desc: "Better team communication",
                },
                {
                  value: "analytics",
                  label: "Better Analytics",
                  desc: "Data-driven insights",
                },
                {
                  value: "automation",
                  label: "Process Automation",
                  desc: "Reduce manual tasks",
                },
                {
                  value: "growth",
                  label: "Scale Operations",
                  desc: "Support business growth",
                },
              ].map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleArrayToggle("goals", goal.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.goals.includes(goal.value)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {goal.label}
                      </div>
                      <div className="text-sm text-gray-500">{goal.desc}</div>
                    </div>
                    {formData.goals.includes(goal.value) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-8">
              <Calendar className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Implementation Timeline
              </h2>
              <p className="text-gray-600">
                When would you like to get started?
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  value: "immediately",
                  label: "Immediately",
                  desc: "Start using right away",
                },
                {
                  value: "1-2weeks",
                  label: "1-2 Weeks",
                  desc: "Need some preparation time",
                },
                {
                  value: "1month",
                  label: "1 Month",
                  desc: "Planning and coordination needed",
                },
                {
                  value: "flexible",
                  label: "Flexible",
                  desc: "No specific timeline",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange("timeline", option.value)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    formData.timeline === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-gray-800">
                        {option.label}
                      </div>
                      <div className="text-sm text-gray-500">{option.desc}</div>
                    </div>
                    {formData.timeline === option.value && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-green-800 mb-2">
                Setup Summary
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>
                  <strong>Company:</strong>{" "}
                  {formData.companyName || "Not specified"}
                </div>
                <div>
                  <strong>Industry:</strong>{" "}
                  {formData.industry || "Not specified"}
                </div>
                <div>
                  <strong>Team Size:</strong>{" "}
                  {formData.companySize || "Not specified"}
                </div>
                <div>
                  <strong>Goals:</strong>{" "}
                  {formData.goals.length
                    ? formData.goals.join(", ")
                    : "None selected"}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {renderStepIndicator()}

          <div className="mb-8">{renderStep()}</div>

          {/* Navigation Buttons - Only show for steps 2-5 */}
          {currentStep === 1 ? (
            // Special case for welcome screen - only show Get Started button
            <div className="flex justify-center pt-6 border-t">
              <button
                onClick={handleGetStarted}
                className="flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-3" />
              </button>
            </div>
          ) : (
            // Normal navigation for other steps
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={prevStep}
                className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg font-medium transition-all"
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
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleFinish}
                  className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all"
                >
                  Complete Setup
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
