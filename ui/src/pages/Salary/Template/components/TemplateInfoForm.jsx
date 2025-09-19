import FormikInput from "../../../../components/Input/FormikInput";

const TemplateInfoForm = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-between py-2 gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 flex-1 gap-4">
        <FormikInput
          name="templateName"
          label="Template Name *"
          inputType="input"
          placeholder="Enter Template Name"
        />
        <FormikInput
          name="description"
          label="Description"
          inputType="input"
          placeholder="Enter Short Description"
        />
      </div>
    </div>
  );
};

export default TemplateInfoForm;
