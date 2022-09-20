// @ts-nocheck
import { Steps } from "antd";
import * as React from "react";
import { useSchemaFormContext } from "../SchemaForm/components/SchemaFormContext";
import SchemaFormStep, { SchemaFormStepProp } from "./SchemaFormStep";
import SchemaFormStepReview from "./SchemaFormStepReview";

const { Step } = Steps;

export interface SchemaFormTabProp {
  label?: string;
  index?: number;
  children?:
    | React.ReactElement<SchemaFormStepProp, typeof SchemaFormStep>
    | React.ReactElement<SchemaFormStepProp, typeof SchemaFormStep>[];
  currentStep?: number;
  onChange?: (number: number) => void;
}

const SchemaFormTab: React.FC<SchemaFormTabProp> = ({
  index = -1,
  label = "",
  currentStep,
  onChange,
  children,
}) => {
  const { getValuesByObjectSchema } = useSchemaFormContext();
  const steps = React.Children.toArray(children).concat(
    <SchemaFormStep label="Preview" index={React.Children.count(children) + 1}>
      Preview of step {index}
      {React.Children.map(
        children,
        (
          child: React.ReactElement<SchemaFormStepProp, typeof SchemaFormStep>
        ) => (
          <SchemaFormStepReview stepProps={child.props} />
        )
      )}
    </SchemaFormStep>
  );
  const stepsProps = steps.map(
    (child: React.ReactElement<SchemaFormStepProp>) => child.props
  );

  return (
    <div style={{ border: "1px solid blue", padding: 8, margin: 8 }}>
      <h4>
        {index} - {label}
      </h4>
      <Steps current={currentStep} onChange={onChange}>
        {stepsProps.map((step: SchemaFormStepProp) => (
          <Step title={step.label} />
        ))}
      </Steps>
      {steps[currentStep]}
    </div>
  );
};

export default SchemaFormTab;
