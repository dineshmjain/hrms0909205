import SubCardHeader from "../../../../components/header/SubCardHeader";
import FormikInput from "../../../../components/Input/FormikInput";
import MultiSelectDropdown from "../../../../components/MultiSelectDropdown/MultiSelectDropdown";
import { IoMdAdd } from "react-icons/io";
import { valueTypes } from "../../../../constants/Constants";

const ComponentsForm = ({
  values,
  setFieldValue,
  setAddedComponents,
  componentNames,
  percentageOptions,
  loading,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mt-4">
        <div>
          <SubCardHeader headerLabel="Components" />
          <div className="text-xs text-gray-600 italic mb-2">
            Assign Components To The Template
          </div>
        </div>
        <button
          type="button"
          className="bg-primary p-2 px-4 h-10 flex items-center gap-2 rounded-md text-white font-medium tracking-tight text-sm hover:bg-primaryLight hover:text-primary"
          onClick={() => {
            if (
              values.componentName &&
              values.valueType &&
              values.componentValue
            ) {
              setAddedComponents((prev) => [...prev, { ...values }]);
              setFieldValue("componentName", "");
              setFieldValue("valueType", "");
              setFieldValue("componentValue", "");
              setFieldValue("percentageOf", []); // reset multi-select
            }
          }}
        >
          <IoMdAdd className="w-4 h-4" />
          Add Component
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 gap-4">
          {/* Component Name */}
          <FormikInput
            name="componentName"
            label="Component Name *"
            inputType="dropdown"
            listData={componentNames}
            inputName={loading ? "Loading..." : "Select Component"}
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => {
              setFieldValue("componentName", selected?._id); // API returns _id
              setFieldValue("componentType", selected?.category); 
            }}
            selectedOption={values?.componentName}
            selectedOptionDependency="_id"
          />

          {/* Value Type */}
          <FormikInput
            name="valueType"
            label="Value Type *"
            inputType="dropdown"
            listData={valueTypes}
            inputName="Select Value Type"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => {
              setFieldValue("valueType", selected?.id);
            }}
            selectedOption={values?.valueType}
            selectedOptionDependency="id"
          />

           {/* Percentage Of (only when valueType = "percentage") */}
          {values.valueType === "percentage" && (
            <MultiSelectDropdown
              data={percentageOptions}
              FeildName="name"
              Dependency="_id"
              InputName="Percentage Of"
              selectedData={values.percentageOf || []}
              setSelectedData={(val) => setFieldValue("percentageOf", val)}
              selectType="multiple"
              enableSearch
              showTip={false}
            />
          )}

          {/* Component Value */}
          <FormikInput
            name="componentValue"
            type="number"
            label="Component Value *"
            inputType="input"
            placeholder="Enter Value"
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentsForm;
