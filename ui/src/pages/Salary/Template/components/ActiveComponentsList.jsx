import SubCardHeader from "../../../../components/header/SubCardHeader";
import { valueTypes } from "../../../../constants/Constants";
import { toTitleCase } from "../../../../constants/reusableFun";

// ---------- Helper & Constants ----------
const lookup = (list, id, key = "id", label = "name") =>
  list.find((item) => item[key] === id)?.[label] || id;

const SPECIAL_LABELS = {
  ctc: "CTC",
  gross: "Gross Salary",
  net: "Net Salary",
};

// ---------- ComponentRow ----------
const ComponentRow = ({
  comp,
  index,
  componentNames,
  valueTypes,
  resolvePercentageLabel,
  setAddedComponents,
}) => {
  const compName = lookup(componentNames, comp.componentName, "_id", "name");
  const valType = lookup(valueTypes, comp.valueType);
  const percentageLabels =
    comp.valueType === "percentage" && Array.isArray(comp.percentageOf)
      ? comp.percentageOf.map((p) => resolvePercentageLabel(p)).filter(Boolean)
      : [];

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
    <tr key={index} className="border-t hover:bg-gray-50 transition-colors">
      <td className="px-4 py-2 text-gray-500">{index + 1}</td>
      <td className="px-4 py-2 font-medium text-gray-900">
        {toTitleCase(compName)}
      </td>
      <td className="px-4 py-2">
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white rounded bg-purple-500">
          {valType}
        </span>
      </td>
      <td className="px-4 py-2">
        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">
          {comp.componentValue}
        </span>
      </td>
      <td className="px-4 py-2 text-gray-800">
        {percentageLabels.length > 0
          ? "% of " + percentageLabels.join(", ")
          : "-"}
      </td>
      <td className="px-4 py-2">
        {statChips.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {statChips.map((chip, i) => (
              <span
                key={i}
                className={`inline-block px-2 py-1 text-xs font-semibold text-white rounded ${
                  chip === "EPF" ? "bg-blue-500" : "bg-green-500"
                }`}
              >
                {chip}
              </span>
            ))}
          </div>
        ) : (
          "-"
        )}
      </td>
      <td className="px-4 py-2 text-center">
        <button
          type="button"
          className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
          onClick={() =>
            setAddedComponents((prev) => prev.filter((_, i) => i !== index))
          }
        >
          Remove
        </button>
      </td>
    </tr>
  );
};

// ---------- ComponentTable ----------
const ComponentTable = ({
  label,
  comps,
  componentNames,
  valueTypes,
  resolvePercentageLabel,
  setAddedComponents,
}) => (
  <div className="mt-6">
    <h3 className="text-sm font-semibold text-gray-700 mb-2">{label}</h3>
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Component Name</th>
            <th className="px-4 py-2">Value Type</th>
            <th className="px-4 py-2">Value</th>
            <th className="px-4 py-2">% Of</th>
            <th className="px-4 py-2">Statutory</th>
            <th className="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {comps.map((comp, index) => (
            <ComponentRow
              key={index}
              comp={comp}
              index={index}
              componentNames={componentNames}
              valueTypes={valueTypes}
              resolvePercentageLabel={resolvePercentageLabel}
              setAddedComponents={setAddedComponents}
            />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// ---------- ActiveComponentsList ----------
const ActiveComponentsList = ({
  addedComponents,
  setAddedComponents,
  componentNames = [],
}) => {
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
  const nothingAdded = earnings.length === 0 && deductions.length === 0;

  return (
    <div>
      <div className="mt-4">
        <SubCardHeader headerLabel="Active Components" />
      </div>

      {nothingAdded ? (
        <div className="text-gray-500 text-sm italic border border-dashed border-gray-300 rounded-md p-16 text-center mt-4">
          No components added yet
        </div>
      ) : (
        <>
          {earnings.length > 0 && (
            <ComponentTable
              label="Earnings"
              comps={earnings}
              componentNames={componentNames}
              valueTypes={valueTypes}
              resolvePercentageLabel={resolvePercentageLabel}
              setAddedComponents={setAddedComponents}
            />
          )}
          {deductions.length > 0 && (
            <ComponentTable
              label="Deductions"
              comps={deductions}
              componentNames={componentNames}
              valueTypes={valueTypes}
              resolvePercentageLabel={resolvePercentageLabel}
              setAddedComponents={setAddedComponents}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ActiveComponentsList;
