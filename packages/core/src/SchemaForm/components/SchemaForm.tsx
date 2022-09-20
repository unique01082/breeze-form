// @ts-nocheck
import { Form, FormProps } from "antd";
import * as React from "react";
import { useSchemaForm } from "../hooks/useSchemaForm";
import { SchemaFormOptions, SchemaFormReturnValues } from "../types";
import { SchemaFormContext } from "./SchemaFormContext";

interface SchemaFormProps<S = {}> extends Partial<SchemaFormOptions<S>> {
  form?: SchemaFormReturnValues;
  formProps?: FormProps;
}

const SchemaForm: React.FC<SchemaFormProps> = ({
  form,
  formProps,
  children,
  ...restProps
}) => {
  const methods = form ?? useSchemaForm(restProps);
  // @ts-ignore
  window.form = methods;

  return (
    <SchemaFormContext.Provider value={methods}>
      <Form onFinish={methods.submit} {...formProps}>
        {children}
      </Form>
    </SchemaFormContext.Provider>
  );
};

export default SchemaForm;
