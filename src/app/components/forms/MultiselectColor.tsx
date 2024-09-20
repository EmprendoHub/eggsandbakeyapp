import React from "react";
import Select from "react-select";

const MultiselectColor = ({
  options,
  handleAddColorField,
  values,
}: {
  options: any;
  handleAddColorField: any;
  values: any;
}) => {
  return (
    <Select
      value={values}
      options={options}
      className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
      name="colors"
      onChange={handleAddColorField}
    />
  );
};

export default MultiselectColor;
