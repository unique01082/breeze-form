import { array, number, object, string } from "yup";

export const generalInformationSchema = object().shape({
  farNo: string().max(255).required(), // missing async validation
  farTitle: string().max(255).required(),
  // members: array().of(
  //   object().shape({
  //     name: string().required(), // this field is used to support BE
  //     refId: string().required(),
  //     department: string().max(100).required(),
  //     discipline: string().max(100).required(),
  //     role: string().oneOf(["LEADER", "MEMBER"]).required(),
  //   })
  // ),
  // test: array().of(string()).unique("ahkjsdfh"),
  // test2: array().of(object().shape({ code: number().uniqueIn() })),
});

// @ts-ignore
window.a = generalInformationSchema;

export const teamMembersSchema = object().shape({
  projectTitle: string().required(),
  maintenanceWorkOrder: string().max(100).required(),
});

export const initialIncidentDescriptionSchema = object().shape({
  revNo: string().max(3).required(),
  reportDate: string().required(),
});
export const preliminaryResponseActionsSchema = object().shape({
  imageIds: array().min(1).max(1).required(),
  assetIds: string().required(),
});
export const rootCauseAssessmentSchema = object().shape({ c: string() });
export const permanentCorrectiveActionSchema = object().shape({});
export const implementationAndValidationSchema = object().shape({});
export const preventiveActionSchema = object().shape({});

export default generalInformationSchema
  .concat(initialIncidentDescriptionSchema)
  .concat(preliminaryResponseActionsSchema)
  .concat(rootCauseAssessmentSchema)
  .concat(permanentCorrectiveActionSchema)
  .concat(implementationAndValidationSchema)
  .concat(preventiveActionSchema);
