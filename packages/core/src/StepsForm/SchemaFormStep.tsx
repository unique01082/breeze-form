// @ts-nocheck
import { useCreation } from "ahooks";
import { Button } from "antd";
import * as React from "react";
import { object, ObjectSchema } from "yup";
import { useSchemaFormContext } from "../SchemaForm/components/SchemaFormContext";
import { useSchemaFormStepsContext } from "./SchemaFormSteps";

export interface SchemaFormStepProp {
  label?: string;
  index?: number;
  schema?: ObjectSchema<any, any, any, any>;
  review?: (values: any) => React.ReactNode;
}

const SchemaFormStep: React.FC<SchemaFormStepProp> = ({
  index,
  label,
  schema = object(),
  children,
}) => {
  const { validateFields, validateSyncFormBySchema } = useSchemaFormContext();
  const fields = useCreation(
    () => Object.keys(schema.describe().fields),
    [schema]
  );
  const { location, setLocation } = useSchemaFormStepsContext();

  return (
    <div style={{ border: "1px solid red", padding: 8, margin: 8 }}>
      <p>
        {index} {label}
      </p>
      {children}
      <Button
        onClick={() => {
          setLocation({ step: location.step - 1 });
        }}
      >
        Previous
      </Button>
      <Button
        onClick={() => {
          setLocation({ step: location.step + 1 });
        }}
      >
        Next
      </Button>
      <Button
        onClick={() => {
          validateFields(fields);
        }}
      >
        Validate fields
      </Button>
      <Button
        onClick={() => {
          try {
            validateSyncFormBySchema(schema);
            setLocation({ step: location.step + 1 });
          } catch (error) {}
        }}
      >
        Validate and Next
      </Button>
    </div>
  );
};

export default SchemaFormStep;
