import SubCardHeader from "../../../../components/header/SubCardHeader";
import { componentNames, componentTypes, valueTypes } from "../temp";

const lookup = (list, id) =>
  list.find((item) => item.id === id)?.name || id;

const ActiveComponentsList = ({ addedComponents, setAddedComponents }) => {
  return (
    <div>
      <SubCardHeader headerLabel="Active Components" />
      <div className="mt-3 space-y-3">
        {addedComponents.length === 0 && (
          <div className="text-gray-500 text-sm italic border border-dashed border-gray-300 rounded-md p-8 text-center">
            No components added yet
          </div>
        )}

        {addedComponents.map((comp, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-200 bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm">
              <span className="font-medium text-gray-900">
                {lookup(componentNames, comp.componentName)}
              </span>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  comp.componentType === "1"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {lookup(componentTypes, comp.componentType)}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                {lookup(valueTypes, comp.valueType)}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700">
                {comp.componentValue}
              </span>
            </div>

            <div className="mt-3 sm:mt-0 flex gap-3">
              <button
                type="button"
                className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200"
                onClick={() =>
                  setAddedComponents((prev) => prev.filter((_, i) => i !== index))
                }
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveComponentsList;
