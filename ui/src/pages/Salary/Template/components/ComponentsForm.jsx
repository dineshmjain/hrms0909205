import SubCardHeader from "../../../../components/header/SubCardHeader";
import FormikInput from "../../../../components/Input/FormikInput";
import { IoMdAdd } from "react-icons/io";
import { componentNames, componentTypes, valueTypes } from "../temp";

const ComponentsForm = ({ values, setFieldValue, setAddedComponents }) => {
  return (
    <div>
      <div className="flex items-center justify-between mt-4 mb-2">
        <div>
          <SubCardHeader headerLabel="Components" />
          <div className="text-xs text-gray-600 italic mb-2">
            Note: Some components require others to be added first. For example,
            HRA and DA typically require Basic Pay to be defined before they can
            be used.
          </div>
        </div>
        <button
          type="button"
          className="bg-primary p-2 px-4 h-10 flex items-center gap-2 rounded-md text-white font-medium tracking-tight text-sm hover:bg-primaryLight hover:text-primary"
          onClick={() => {
            if (
              values.componentName &&
              values.componentType &&
              values.valueType &&
              values.componentValue
            ) {
              setAddedComponents((prev) => [...prev, { ...values }]);
              setFieldValue("componentName", "");
              setFieldValue("componentType", "");
              setFieldValue("valueType", "");
              setFieldValue("componentValue", "");
            }
          }}
        >
          <IoMdAdd className="w-4 h-4" />
          Add Component
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 gap-4">
          <FormikInput
            name="componentName"
            label="Component Name *"
            inputType="dropdown"
            listData={componentNames}
            inputName="Select Component"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => {
              setFieldValue("componentName", selected?.id);
            }}
            selectedOption={values?.componentName}
            selectedOptionDependency="id"
          />

          <FormikInput
            name="componentType"
            label="Component Type *"
            inputType="dropdown"
            listData={componentTypes}
            inputName="Select Component Type"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => {
              setFieldValue("componentType", selected?.id);
            }}
            selectedOption={values?.componentType}
            selectedOptionDependency="id"
          />

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

          <FormikInput
            name="componentValue"
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
