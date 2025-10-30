import SubCardHeader from "../../../../components/header/SubCardHeader";
import { valueTypes } from "../../../../constants/Constants";
import { toTitleCase } from "../../../../constants/reusableFun";

const lookup = (list, id, key = "id", label = "name") =>
  list.find((item) => item[key] === id)?.[label] || id;

const SPECIAL_LABELS = {
  ctc: "CTC",
  gross: "Gross Salary",
  net: "Net Salary",
};

const ActiveComponentsList = ({
  addedComponents,
  setAddedComponents,
  componentNames = [],
}) => {
  const isNumeric = (val) =>
    val !== null &&
    val !== "" &&
    !Array.isArray(val) &&
    !isNaN(val) &&
    isFinite(Number(val));

  const resolvePercentageLabel = (entry) => {
    if (!entry && entry !== 0) return "";

    if (typeof entry === "string") {
      if (entry.startsWith("special:")) {
        const key = entry.split(":")[1];
        return SPECIAL_LABELS[key] || toTitleCase(key || "");
      }
      const name = lookup(componentNames, entry, "_id", "name");
      return toTitleCase(name);
    }

    if (typeof entry === "object") {
      if (entry.type === "special") {
        return SPECIAL_LABELS[entry.value] || toTitleCase(entry.value || "");
      }
      if (entry.type === "component") {
        const name = lookup(componentNames, entry.value, "_id", "name");
        return toTitleCase(name);
      }
      return toTitleCase(entry.value || "");
    }

    return String(entry);
  };

  const renderSection = (label, comps) => (
    <div className="mt-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{label}</h3>
      {comps.length === 0 ? (
        <div className="text-gray-500 text-sm italic border border-dashed border-gray-300 rounded-md p-6 text-center">
          No {label.toLowerCase()} components added yet
        </div>
      ) : (
        <div className="space-y-3">
          {comps.map((comp, index) => {
            const compName = lookup(
              componentNames,
              comp.componentName,
              "_id",
              "name"
            );
            const valType = lookup(valueTypes, comp.valueType);

            const percentageLabels =
              comp.valueType === "percentage" && Array.isArray(comp.percentageOf)
                ? comp.percentageOf
                    .map((p) => resolvePercentageLabel(p))
                    .filter(Boolean)
                : [];

            // Get chips based on statutory components
            const statChips = componentNames
              .filter(
                (s) =>
                  s.isStatutory &&
                  Array.isArray(s.statutoryDetails?.appliesTo) &&
                  s.statutoryDetails.appliesTo.includes(comp.componentName)
              )
              .map((s) => {
                if (s.name.toLowerCase().includes("provident fund")) return "EPF";
                if (s.name.toLowerCase().includes("state insurance")) return "ESI";
                return null;
              })
              .filter(Boolean);

            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm flex-wrap">
                  {/* Component Name */}
                  <span className="font-medium text-gray-900">
                    {toTitleCase(compName)}
                  </span>

                  {/* Value Type chip */}
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md bg-gradient-to-r from-purple-500 to-purple-600 transition-transform transform hover:scale-105">
                    {valType}
                  </span>

                  {/* Value chip */}
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md transition-transform transform hover:scale-105 ${
                      isNumeric(comp.componentValue)
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900"
                        : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                    }`}
                  >
                    {comp.componentValue}
                  </span>

                  {/* Percentage Of chip */}
                  {percentageLabels.length > 0 && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full shadow-md bg-gradient-to-r from-pink-500 to-pink-600 text-white transition-transform transform hover:scale-105">
                      % of {percentageLabels.join(", ")}
                    </span>
                  )}

                                    {/* Chips for EPF / ESI */}
                  {statChips.length > 0 &&
                    statChips.map((chip, i) => (
                      <span
                        key={i}
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full text-white shadow-md transition-transform transform hover:scale-105 ${
                          chip === "EPF"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600"
                            : "bg-gradient-to-r from-green-500 to-green-600"
                        }`}
                      >
                        {chip}
                      </span>
                    ))}
                </div>

                <div className="mt-3 sm:mt-0 flex gap-3">
                  <button
                    type="button"
                    className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                    onClick={() =>
                      setAddedComponents((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // split by type
  const earnings = addedComponents.filter(
    (c) => (c.componentType || "").toLowerCase() === "earning"
  );
  const deductions = addedComponents.filter(
    (c) => (c.componentType || "").toLowerCase() === "deduction"
  );

  return (
    <div>
      <div className="mt-4">
        <SubCardHeader headerLabel="Active Components" />
      </div>

      {renderSection("Earnings", earnings)}
      {renderSection("Deductions", deductions)}
    </div>
  );
};

export default ActiveComponentsList;
