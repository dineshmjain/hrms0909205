import { useDispatch } from "react-redux";
import { exitSetupMode } from "../redux/reducer/SetupModeReducer";
import { Route, Routes, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect, useState } from "react";
import Loader from "../pages/Loader/Loader";
import { useSelector } from "react-redux";

const CreateSubOrg = lazy(() => import("../pages/SubOrg/Add"));
const CreateBranch = lazy(() => import("../pages/Branch/Add"));
// const CreateDepartment = lazy(() => import("../pages/Department/Add"));
export default function SetupPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { setupMode } = useSelector((state) => state.setupMode);
  const nav = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState([
    {
      name: "subOrganization",
      displayName: "Organization",
      path: "/suborg",
      element: (
        <CreateSubOrg
          setupMode={true}
          onComplete={() => {
            setCurrentStep((prev) => prev + 1);
          }}
        />
      ),
    },
    {
      name: "branch",
      displayName: "Branch",
      path: "/branch",
      element: (
        <CreateBranch
          setupMode={true}
          onComplete={() => {
            setCurrentStep((prev) => prev + 1);
          }}
        />
      ),
    },
    // {
    //   name: "department",
    //   displayName: "Department",
    //   path: "/department",
    //   element: (
    //     <CreateDepartment
    //       setupMode={true}
    //       onComplete={() => {
    //         setCurrentStep((prev) => prev + 1);
    //       }}
    //     />
    //   ),
    // },
  ]);

  useEffect(() => {
    if (user?.pending) {
      let currStep = 0;
      let temp = steps.map((s, idx) => {
        if (user?.pending?.[s.name]) {
          currStep++;
        }
        s.completed = user?.pending?.[s.name];
        return s;
      });
      setSteps((prev) => {
        return [...temp];
      });
      setCurrentStep(currStep);
    }
  }, [user?.pending]);

  useEffect(() => {
    if (currentStep < steps?.length) {
      nav(`/setup/${steps[currentStep]?.path}`);
    } else {
      dispatch(exitSetupMode());
      nav("/dashboard");
    }
  }, [currentStep]);

  useEffect(() => {
    if (setupMode == false) {
      nav("/dashboard");
    }
  }, []);

  console.log(steps, currentStep);

  return (
    <div className="p-4 bg-background min-h-screen font-inter">
      <div className="flex justify-between items-start">
        <h1 className="text-xl font-bold mb-4">
          {steps?.[currentStep]?.displayName} Create
        </h1>
      </div>
      <div className="flex flex-col gap-2">
        <Routes>
          {steps.map((step, index) => {
            return (
              !step?.completed && (
                <Route
                  key={index}
                  path={step.path}
                  element={
                    <Suspense fallback={<Loader />}>{step.element}</Suspense>
                  }
                />
              )
            );
          })}
        </Routes>
      </div>
    </div>
  );
}
