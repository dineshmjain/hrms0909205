import React, { useState, useEffect } from "react";
import {
    ArrowRight,
    ArrowLeft,
    CheckCircle,
    Building,
    Clock,
    Target,
    Upload,
    Shield,
    Users,
} from "lucide-react";
import ClientandBranch from "./ClientandBranch";
import ClientShifts from "./ClientShifts";
import RequirementsandCheckpoints from "./RequirementsandCheckpoints";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import DesignationServiceModal from "./Components/DesignationServiceModal";
import toast, { Toaster } from "react-hot-toast";
import { Typography } from "@material-tailwind/react";

const Index = () => {
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState(
        () => Number(localStorage.getItem("onboardingStep")) || 1
    );
    const [isStepValid, setIsStepValid] = useState(false);
    const [wizardData, setWizardData] = useState(() => {
        const saved = localStorage.getItem("onboardingData");
        return saved
            ? JSON.parse(saved)
            : { clientDetails: null, branches: [], shifts: [], requirements: [] };
    });

    const [designationService, setDesignationService] = useState([]);
    const [showDesignationModal, setShowDesignationModal] = useState(false);
    const [checkingDesignations, setCheckingDesignations] = useState(true);
    const [canProceed, setCanProceed] = useState(false);

    const steps = [
        { id: 1, title: "Client Details", icon: Building },
        { id: 2, title: "Shifts", icon: Clock },
        { id: 3, title: "Requirements", icon: Target },
        { id: 4, title: "Complete", icon: CheckCircle },
    ];

    const totalSteps = steps.length;

    useEffect(() => {
        getDesignationListService();
    }, []);

    const getDesignationListService = async () => {
        setCheckingDesignations(true);
        try {
            const response = await axiosInstance.post("/designation/get/asService", { type: 'active' });
            const serviceDesignations = response?.data?.data || [];
            setDesignationService(serviceDesignations);

            if (serviceDesignations.length === 0) {
                setCanProceed(false);
                setShowDesignationModal(true);
                toast.error('No service designations found. Please enable at least one designation.');
            } else {
                setCanProceed(true);
            }
        } catch (error) {
            console.error('Error fetching service designations:', error);
            toast.error('Failed to check service designations');
            setCanProceed(false);
        } finally {
            setCheckingDesignations(false);
        }
    };

    useEffect(() => {
        localStorage.setItem("onboardingStep", currentStep);
    }, [currentStep]);

    useEffect(() => {
        localStorage.setItem("onboardingData", JSON.stringify(wizardData));
    }, [wizardData]);

    const updateWizardData = (key, data, valid = true) => {
        setWizardData((prev) => ({ ...prev, [key]: data }));
        setIsStepValid(valid);
    };

    const nextStep = () => {
        if (!isStepValid || !canProceed) {
            if (!canProceed) {
                toast.error('Please enable service designations first');
                setShowDesignationModal(true);
            }
            return;
        }
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1);
            setIsStepValid(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
            setIsStepValid(true);
        }
    };

    const handleFinish = () => {
        setCurrentStep(4);
    };

    const handleBulkUpload = () => {
        if (!canProceed) {
            toast.error('Please enable service designations before bulk upload');
            setShowDesignationModal(true);
            return;
        }
        navigate("/auth/assist-client/bulkupload");
    };

    const handleDesignationModalSuccess = () => {
        getDesignationListService();
        toast.success('Service designations enabled successfully!');
    };

    const CompleteScreen = () => {
        return (
            <div className="text-center space-y-2 py-2">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mx-auto">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <div className="space-y-2">
                    <Typography className="text-primary text-xl md:text-lg font-bold tracking-tight">
                        Client Setup Complete!
                    </Typography>
                    <Typography className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Do You want to add More Clients
                    </Typography>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                        onClick={() => {
                            navigate("/dashboard");
                        }}
                        className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center gap-2"
                    >
                        Go to Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => {
                            toast.success('Client onboarded successfully!');
                            localStorage.removeItem("onboardingStep");
                            localStorage.removeItem("onboardingData");
                            setCurrentStep(1);
                            setIsStepValid(false);
                            setWizardData({ clientDetails: null, branches: [], shifts: [], requirements: [] });
                        }}
                        className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all duration-200 flex items-center gap-2"
                    >
                        Add More Clients
                        <Users className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <ClientandBranch
                        wizardData={wizardData}
                        updateWizardData={updateWizardData}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 2:
                return (
                    <ClientShifts
                        wizardData={wizardData}
                        updateWizardData={updateWizardData}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 3:
                return (
                    <RequirementsandCheckpoints
                        wizardData={wizardData}
                        updateWizardData={updateWizardData}
                        setIsStepValid={setIsStepValid}
                    />
                );
            case 4:
                return (
                    <CompleteScreen
                        wizardData={wizardData}
                        updateWizardData={updateWizardData}
                        setIsStepValid={setIsStepValid}
                    />
                );
            default:
                return null;
        }
    };

    const renderStepIndicator = () => {
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
                                            ${isCompleted
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
                                        className={`text-xs font-medium text-center ${isCurrent ? "text-primary" : "text-primary"
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

    return (
        <div
            className="min-h-screen py-12 px-2 relative overflow-hidden w-full"
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #1E40AF 100%)",
            }}
        >
            {/* Subtle animated grid background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" patternUnits="userSpaceOnUse" width="60" height="60">
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
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="w-full px-4 sm:px-8 lg:px-16 relative z-10">
                <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6 min-h-[600px]">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-blue-600 font-extrabold text-3xl mb-2">
                                Client Onboarding
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Complete setup in {steps.length} quick steps
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDesignationModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-medium shadow-sm"
                            >
                                <Shield className="w-5 h-5" />
                                Manage Designations
                            </button>
                            <button
                                onClick={handleBulkUpload}
                                disabled={!canProceed}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium shadow-sm ${canProceed
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <Upload className="w-5 h-5" />
                                Bulk Upload
                            </button>
                        </div>
                    </div>

                    {/* Step Indicator - Similar to WizardScreen */}
                    {renderStepIndicator()}

                    {/* Step Content */}
                    <div className="min-h-[300px] mb-6">{renderStep()}</div>

                    {/* Navigation */}
                    <div className="flex justify-between items-center pt-6 border-t">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1 || !canProceed}
                            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${currentStep === 1 || !canProceed
                                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                : "bg-blue-600 text-white hover:bg-blue-700"
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>

                        <div className="text-sm text-gray-500 font-medium">
                            Step {currentStep} of {totalSteps}
                        </div>

                        {currentStep < totalSteps ? (
                            <button
                                onClick={nextStep}
                                disabled={!isStepValid || !canProceed}
                                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${isStepValid && canProceed
                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                            >
                                Next
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
                            <button
                                onClick={handleFinish}
                                disabled={!isStepValid || !canProceed}
                                className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${isStepValid && canProceed
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

            {/* Designation Service Modal */}
            <DesignationServiceModal
                isOpen={showDesignationModal}
                onClose={() => setShowDesignationModal(false)}
                onSuccess={handleDesignationModalSuccess}
            />
        </div>
    );
};

export default Index;