import * as React from "react";
import SchemaField from "../SchemaForm/components/SchemaField";

interface SchemaFormFieldProps {}

const SchemaFormField: React.FC<SchemaFormFieldProps> = (props) => {
  return <SchemaField {...props} />;
};

export default SchemaFormField;
