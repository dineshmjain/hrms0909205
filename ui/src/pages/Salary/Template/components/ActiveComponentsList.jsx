import SubCardHeader from "../../../../components/header/SubCardHeader";
import { valueTypes } from "../../../../constants/Constants";
import { toTitleCase } from "../../../../constants/reusableFun";

const lookup = (list, id, key = "id", label = "name") =>
  list.find((item) => item[key] === id)?.[label] || id;

// friendly labels for special bases
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

                  {/* Value Type */}
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                    {valType}
                  </span>

                  {/* Value */}
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded ${
                      isNumeric(comp.componentValue)
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {comp.componentValue}
                  </span>

                  {/* Percentage Of */}
                  {percentageLabels.length > 0 && (
                    <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 text-purple-700">
                      % of {percentageLabels.join(", ")}
                    </span>
                  )}
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
