import React, { useState } from "react";
import { Typography } from "@material-tailwind/react";
import { CheckCircle } from "lucide-react";

const ShareModal = ({ isOpen, onClose, onConfirm, employeeData }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen && !showSuccess) return null;

  const handleYes = async () => {
    setIsLoading(true);
    try {
      await onConfirm(employeeData);
      setShowSuccess(true);

      // Hide success message and close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setIsLoading(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error sharing:", error);
      setIsLoading(false);
    }
  };

  // Success Toast
  if (showSuccess) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>

        {/* Success Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg shadow-xl w-lg mx-4 pointer-events-auto">
            <div className="px-6 py-8 flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
              <Typography className="text-lg font-semibold text-gray-900 text-center">
                Successfully Sent!
              </Typography>
              <Typography className="text-gray-600 text-center text-sm mt-2">
                Credentials have been shared to the employee
              </Typography>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Confirmation Modal
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
        <div className="bg-white rounded-lg shadow-xl w-lg mx-4 pointer-events-auto">
          {/* Body */}
          <div className="px-6 py-6">
            <Typography className="text-gray-700 text-center mb-3">
              Do you want to share Credentials to this employee record?
            </Typography>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              No
            </button>
            <button
              onClick={handleYes}
              disabled={isLoading}
              className="px-6 py-2 rounded-lg font-medium text-white bg-primary hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Sending...
                </>
              ) : (
                "Yes"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShareModal;
