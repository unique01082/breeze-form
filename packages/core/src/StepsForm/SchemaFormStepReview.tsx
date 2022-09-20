import * as React from "react";
import { useSchemaFormContext } from "../SchemaForm/components/SchemaFormContext";
import { SchemaFormStepProp } from "./SchemaFormStep";

interface SchemaFormStepReviewProps {
  stepProps: SchemaFormStepProp;
}

const SchemaFormStepReview: React.FC<SchemaFormStepReviewProps> = ({
  stepProps: { schema, review, label, index },
}) => {
  const { getValuesByObjectSchema } = useSchemaFormContext();

  if (!schema || !review) {
    return null;
  }

  const values = getValuesByObjectSchema(schema);
  console.log("review render", values);

  return (
    <>
      <h2>Values of step {label}</h2>
      <pre>{JSON.stringify(values, null, 2)}</pre>
      {review?.(values)}
    </>
  );
};

export default SchemaFormStepReview;
