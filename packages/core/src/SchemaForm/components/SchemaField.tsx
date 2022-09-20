// @ts-nocheck
import { useMemoizedFn } from "ahooks";
import { Form } from "antd";
import * as React from "react";
import { useSchemaField } from "../hooks/useSchemaField";
import { SchemaFieldOwnProps, SchemaFieldProps } from "../types";

// https://github.com/kripod/react-polymorphic-box
const SchemaField: (<E extends React.ElementType>(
  props: SchemaFieldProps<E>
) => React.ReactElement | null) &
  React.FC = React.forwardRef(
  (
    {
      fieldProps,
      as,
      name,
      label,
      getErrorMessages,
      valuePropName,
      onChangePropName,
      ...props
    }: SchemaFieldOwnProps,
    ref: React.Ref<Element>
  ) => {
    const { value, onChange, error, isRequired } = useSchemaField(name);

    const handleChange = useMemoizedFn((e: any) => {
      const value = e?.target?.value ?? e;
      onChange(value);
      // @ts-ignore
      props?.onChange?.(value);
    });

    return (
      <Form.Item
        name={name}
        label={label}
        required={isRequired}
        validateStatus={error ? "error" : undefined}
        help={getErrorMessages!(error)}
        {...fieldProps}
      >
        {/* Please keep this fragment. Without this fragment, antd Form.Item will
      override the value prop */}
        <>
          {React.createElement(as, {
            ref,
            [valuePropName]: value,
            [onChangePropName]: handleChange,
            ...props,
          })}
        </>
      </Form.Item>
    );
  }
);

SchemaField.defaultProps = {
  getErrorMessages: (error: any) => error?.message as unknown as string,
  valuePropName: "value",
  onChangePropName: "onChange",
};

export default SchemaField;
