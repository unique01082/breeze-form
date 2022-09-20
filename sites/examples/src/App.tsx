// @ts-nocheck
import { Button, DatePicker, Input } from "antd";
import {
  SchemaField,
  SchemaForm,
  SchemaFormStep,
  SchemaFormSteps,
  SchemaFormTab,
  useSchemaForm,
} from "breeze-form";
import * as React from "react";
import schema, {
  generalInformationSchema,
  initialIncidentDescriptionSchema,
  preliminaryResponseActionsSchema,
  rootCauseAssessmentSchema,
  teamMembersSchema,
} from "./schema2";

interface FailureAnalysisReportProps {}

const FailureAnalysisReport: React.FC<FailureAnalysisReportProps> = () => {
  const form = useSchemaForm({
    schema,
    onValueChange: (...args) => {
      console.log("...onValueChange :>> ", ...args);
    },
  });

  return (
    <SchemaForm formProps={{ layout: "vertical" }} form={form}>
      <SchemaFormSteps>
        <SchemaFormTab label="Step 1">
          <SchemaFormStep
            label="Sub-step 1.1"
            schema={generalInformationSchema}
            review={(values) =>
              Object.keys(values).map((key) => (
                <p>
                  <b>{key}</b>: {values[key]}
                </p>
              ))
            }
          >
            <SchemaField
              as={Input}
              name="farNo"
              fieldProps={{ label: "FAR No." }}
            />
            <SchemaField
              as={DatePicker}
              name="farTitle"
              fieldProps={{ label: "FAR Title" }}
            />
          </SchemaFormStep>
          <SchemaFormStep
            label="Sub-step 1.2"
            schema={teamMembersSchema}
            review={(values) =>
              Object.keys(values).map((key) => (
                <p>
                  <b>{key}</b>: {values[key]}
                </p>
              ))
            }
          >
            <SchemaField
              as={Input}
              name="projectTitle"
              fieldProps={{ label: "Project Title" }}
            />
            <SchemaField
              as={Input}
              name="maintenanceWorkOrder"
              fieldProps={{ label: "Maintenance Work Order" }}
            />
          </SchemaFormStep>
        </SchemaFormTab>
        <SchemaFormTab label="Step 2">
          <SchemaFormStep
            label="Sub-step 2.1"
            schema={initialIncidentDescriptionSchema}
          >
            <SchemaField
              as={Input}
              name="revNo"
              fieldProps={{ label: "Rev No." }}
            />
            <SchemaField
              as={Input}
              name="reportDate"
              fieldProps={{ label: "Report Date" }}
            />
          </SchemaFormStep>
          <SchemaFormStep
            label="Sub-step 2.2"
            schema={preliminaryResponseActionsSchema}
          >
            <SchemaField
              as={Input}
              name="imageIds"
              fieldProps={{ label: "Image Ids" }}
            />
            <SchemaField
              as={Input}
              name="assetIds"
              fieldProps={{ label: "Asset Ids" }}
            />
          </SchemaFormStep>
        </SchemaFormTab>
        <SchemaFormTab label="Step 3">
          <SchemaFormStep
            label="Sub-step 3.1"
            schema={rootCauseAssessmentSchema}
          >
            Content of step 3.1
          </SchemaFormStep>
          <SchemaFormStep label="Sub-step 3.2">
            Content of step 3.2
          </SchemaFormStep>
        </SchemaFormTab>
      </SchemaFormSteps>

      <Button htmlType="submit" type="primary">
        Submit
      </Button>
    </SchemaForm>
  );
};

export default FailureAnalysisReport;
