import FormikInput from "../../../../components/Input/FormikInput";
import { componentTypes } from "../../../../constants/Constants";

const ComponentInfoForm = ({ values, setFieldValue }) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 gap-4">
          <FormikInput
            name="name"
            label="Component Name *"
            inputType="input"
            placeholder="Enter Name"
          />
          <FormikInput
            name="category"
            label="Component Type *"
            inputType="dropdown"
            listData={componentTypes}
            inputName="Select Component Type"
            feildName="name"
            hideLabel
            showTip={false}
            showSerch
            handleClick={(selected) => {
              setFieldValue("category", selected?.id);
            }}
            selectedOption={values?.category}
            selectedOptionDependency="id"
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentInfoForm;
