import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlansGetActiveListAction } from "../../redux/Action/Susbcription/SubscriptionAction";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const Plans = () => {
    const dispatch = useDispatch();
    const { PlanList } = useSelector((state) => state.plans);
    const scrollRef = useRef(null);
    const [selectedPlanId, setSelectedPlanId] = useState("")

    useEffect(() => {
        dispatch(PlansGetActiveListAction({ SoftwareID: 17 }));
    }, [dispatch]);

    // Filter out Demo Plan and hidden
    const activePlans = PlanList?.filter(
        (plan) => plan.Name !== "Demo Plan" && !plan.hidden
    );

    const scrollOneCard = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = 300; // Reduced from 340
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    const formatPrice = (amount, duration) => {
        if (amount === 0) return "FREE";
        return `₹${amount.toLocaleString()}/${duration} days`;
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"> {/* Reduced py-12 → py-8 */}
            <div className="text-center mb-8"> {/* Reduced mb-12 → mb-8 */}
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900"> {/* Reduced text size */}
                    Choose Your Plan
                </h2>
                <p className="mt-2 text-sm text-gray-600"> {/* Reduced mt-3, text-lg → text-sm */}
                    Simple, transparent pricing for every business size
                </p>
            </div>

            {/* Scrollable Container */}
            <div className="relative">
                {/* Left Arrow */}
                <button
                    onClick={() => scrollOneCard("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1.5 hover:bg-gray-50 transition-all -ml-3 hidden sm:flex items-center justify-center" /* Smaller p-2 → p-1.5 */
                    >
                    <ChevronLeft className="w-5 h-5 text-gray-700" /> {/* Smaller icon */}
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() => scrollOneCard("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-1.5 hover:bg-gray-50 transition-all -mr-3 hidden sm:flex items-center justify-center"
                    >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>

                {/* Plans Container */}
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth px-2 py-6 sm:px-6" /* gap-6 → gap-4, px-10 → px-6 */
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {activePlans?.map((plan) => {
                        const isFree = plan.Amount === 0;
                        const isTrial = plan.Duration === 14;
                        const employeeCount =
                            plan.AllFeatures.find(
                                (f) => f.FeatureId === "64a3e34ae021a0096f431d04"
                            )?.Count || 0;
                        const branchCount =
                            plan.AllFeatures.find(
                                (f) => f.FeatureId === "64a3e34fe021a0096f431d05"
                            )?.Count || 0;
                        const userCount = plan.Count || employeeCount;

                        const isSelected = selectedPlanId === plan._id;

                        return (
                            <div
                                key={plan._id}
                                onClick={() => setSelectedPlanId(plan._id)}
                                className={`relative bg-white rounded-xl shadow-md p-5 w-72 flex-shrink-0 transition-all duration-300 cursor-pointer snap-center min-h-[340px] flex flex-col
                                    ${isSelected
                                        ? "ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-xl"
                                        : "hover:shadow-lg border border-gray-200"
                                    }`} /* w-80 → w-72, p-6 → p-5, rounded-2xl → rounded-xl */
                            >
                                {/* Trial Badge */}
                                {isTrial && (
                                    <div className="absolute -top-3 right-3 bg-green-500 text-white px-2 py-0.5 text-xs font-bold rounded-bl-md"> {/* Smaller badge */}
                                        TRIAL
                                    </div>
                                )}

                                {/* Plan Name */}
                                <h3 className="text-lg font-bold text-gray-900 text-center"> {/* text-xl → text-lg */}
                                    {plan.Name}
                                </h3>
                                <p className="mt-1 text-xs text-gray-500 text-center"> {/* text-sm → text-xs */}
                                    {plan.SubPlanDescription}
                                </p>

                                {/* Price */}
                                <div className="mt-4 text-center flex-1"> {/* mt-5 → mt-4 */}
                                    {isFree ? (
                                        <span className="text-3xl font-bold text-green-600"> {/* text-4xl → text-3xl */}
                                            FREE
                                        </span>
                                    ) : (
                                        <div>
                                            <span className="text-3xl font-bold text-blue-600">
                                                ₹{plan.Amount.toLocaleString()}
                                            </span>
                                            <span className="text-xs text-gray-500"> {/* text-sm → text-xs */}
                                                /{plan.Duration} days
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <p className="text-xs text-gray-500 text-center mt-1">
                                    {isTrial ? "14 days access" : "365 days access"}
                                </p>

                                {/* Features */}
                                <ul className="mt-4 space-y-2 flex-1"> {/* mt-6 → mt-4, space-y-3 → space-y-2 */}
                                    {employeeCount > 0 && (
                                        <li className="flex items-center text-sm text-gray-700">
                                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" /> {/* w-5 → w-4 */}
                                            <span>
                                                <strong>{employeeCount}</strong> Employee
                                                {employeeCount > 1 ? "s" : ""}
                                            </span>
                                        </li>
                                    )}
                                    {userCount > 0 && employeeCount === 0 && (
                                        <li className="flex items-center text-sm text-gray-700">
                                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            <span>
                                                <strong>{userCount}</strong> User
                                                {userCount > 1 ? "s" : ""}
                                            </span>
                                        </li>
                                    )}
                                    {branchCount > 0 && (
                                        <li className="flex items-center text-sm text-gray-700">
                                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                            <span>
                                                <strong>{branchCount}</strong> Branch
                                                {branchCount > 1 ? "es" : ""}
                                            </span>
                                        </li>
                                    )}
                                    {/* {plan.IsIntroOffer && (
                                        <li className="flex justify-center mt-1">
                                            <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
                                                Intro Offer
                                            </span>
                                        </li>
                                    )} */}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    className={`mt-5 w-full py-2.5 rounded-lg font-medium text-white transition-all duration-200 text-sm
                                        ${isSelected
                                            ? "bg-gradient-to-r from-blue-600 to-purple-600 shadow-md"
                                            : isFree
                                                ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                                        }`} /* py-3 → py-2.5, rounded-xl → rounded-lg */
                                >
                                    {isFree ? "Get Started" : "Buy Now"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Swipe Hint */}
            <p className="mt-5 text-center text-xs text-gray-500 sm:hidden"> {/* mt-6 → mt-5 */}
                Swipe to view all plans
            </p>

            {/* Footer Note */}
            <p className="mt-8 text-center text-xs text-gray-500"> {/* mt-10 → mt-8 */}
                All plans include core HRMS features. Need more? Contact sales.
            </p>

            {/* Hide Scrollbar */}
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default Plans;