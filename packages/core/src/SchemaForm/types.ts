import { SetState } from "@breeze-form/hooks";
import { FormItemProps } from "antd";
import React from "react";
import { ObjectSchema, ValidationError } from "yup";
import { ValidateOptions } from "yup/lib/types";

export interface SchemaFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  isTouched: boolean;
}

export interface SchemaFormOptions<S> {
  defaultValues?: S;
  onValueChange?: (values: S) => void;
  schema?: ObjectSchema<any, any, any, any>;
}

export interface SchemaFormReturnValues<S = any> {
  schema: ObjectSchema<any, any, any, any>;
  formValues: S;
  formState: SchemaFormState;
  setFormState: SetState<SchemaFormState>;
  resetFormState: (patch?: SchemaFormState) => void;
  formErrors: Record<string, Error>;
  setFormErrors: any;
  resetFormErrors: any;
  getFormValues: () => any;
  setFormValues: (formValues: any) => void;
  getField: (field: string) => any;
  getValue: (field: string) => any;
  getValues: (fields: string[]) => any;
  getValuesByObjectSchema: (schema: ObjectSchema<any, any, any, any>) => any;
  setValue: (name: string, value: any, changeTouched?: boolean) => void;
  setValues: (values: any, changeTouched?: boolean) => void;
  resetValues: (value?: any) => void;
  clearError: (name: string) => void;
  clearErrors: () => void;
  setErrors: (errors: any, isClearErrors?: boolean) => void;
  setError: (name: string, error: Error) => void;
  validateForm: (
    options?: ValidateOptions,
    isClearErrors?: boolean
  ) => Promise<any>;
  validateFormBySchema: (
    alternativeSchema: ObjectSchema<any, any, any, any>,
    options?: ValidateOptions,
    isClearErrors?: boolean
  ) => Promise<any>;
  validateSyncFormBySchema: (
    alternativeSchema: ObjectSchema<any, any, any, any>,
    options?: ValidateOptions,
    isClearErrors?: boolean
  ) => any;
  validateField: (field: string, options?: ValidateOptions) => any;
  validateFields: (
    fields: string[],
    options?: ValidateOptions
  ) => Promise<boolean>;
  submit: () => Promise<any>;
}

export interface SchemaFieldOptions<S = any> {}

export interface SchemaFieldReturnValues<S = any> {
  value: S;
  error: any;
  onChange: (value?: S) => void;
  schema: any;
  isRequired: boolean;
}

export type SchemaFieldOwnProps<
  E extends React.ElementType = React.ElementType
> = {
  as?: E;
  name: string;
  fieldProps?: FormItemProps;
  children?: React.ReactNode;
  getErrorMessages?: (error?: ValidationError) => string | string[];
  valuePropName?: string;
  onChangePropName?: string;
} & FormItemProps;

export type SchemaFieldProps<E extends React.ElementType> =
  SchemaFieldOwnProps<E> &
    Omit<React.ComponentProps<E>, keyof SchemaFieldOwnProps>;
