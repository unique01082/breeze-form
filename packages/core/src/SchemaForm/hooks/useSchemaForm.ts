import { useCallbackReactive, useResettableSetState } from "@breeze-form/hooks";
import { useMemoizedFn } from "ahooks";
import { get, merge, pick, set } from "lodash";
import { useState } from "react";
import { object, reach } from "yup";
import { SchemaFormOptions, SchemaFormReturnValues } from "../types";

export const useSchemaForm = <S extends Record<string, any>>(
  options: SchemaFormOptions<S> = {}
): SchemaFormReturnValues => {
  const { defaultValues = {} as S, onValueChange, schema = object() } = options;

  const [formState, setFormState, resetFormState] = useResettableSetState({
    isSubmitting: false,
    isSubmitted: false,
    isTouched: false,
  });

  const [rawState, setFormValues] = useState<S>(defaultValues);

  const formValues = useCallbackReactive(rawState, onValueChange);

  const [formErrors, setFormErrors, resetFormErrors] = useResettableSetState(
    {}
  );

  const setValue: SchemaFormReturnValues["setValue"] = useMemoizedFn(
    (name, value, changeTouched = true) => {
      if (changeTouched && !formState.isTouched) {
        setFormState({ isTouched: true });
      }

      set(formValues, name, value);
    }
  );

  const setValues: SchemaFormReturnValues["setValues"] = useMemoizedFn(
    (values, changeTouched = true) => {
      if (changeTouched && !formState.isTouched) {
        setFormState({ isTouched: true });
      }

      return merge(formValues, values);
    }
  );

  const getFormValues: SchemaFormReturnValues["getFormValues"] = () => rawState;

  const getValue: SchemaFormReturnValues["getValue"] = useMemoizedFn((fields) =>
    get(getFormValues(), fields)
  );

  const getField: SchemaFormReturnValues["getField"] = useMemoizedFn((field) =>
    get(formValues, field)
  );

  const getValues: SchemaFormReturnValues["getValues"] = useMemoizedFn(
    (fields) => pick(getFormValues(), fields)
  );

  const getValuesByObjectSchema: SchemaFormReturnValues["getValuesByObjectSchema"] =
    useMemoizedFn((schema) =>
      pick(getFormValues(), Object.keys(schema.describe().fields))
    );

  // TODO persist values as defaultValues for next no-args reset
  const resetValues: SchemaFormReturnValues["resetValues"] = useMemoizedFn(
    (values = rawState ?? {}) => {
      setFormValues(values);
      setFormState({ isSubmitted: false, isTouched: false });
      resetFormErrors();
    }
  );

  const clearError: SchemaFormReturnValues["clearError"] = useMemoizedFn(
    (name) => setFormErrors({ [name]: undefined })
  );

  const clearErrors: SchemaFormReturnValues["clearErrors"] = useMemoizedFn(() =>
    resetFormErrors()
  );

  const setErrors: SchemaFormReturnValues["setErrors"] = useMemoizedFn(
    (errors, isClearErrors = true) => {
      if (isClearErrors) {
        clearErrors();
      }
      setFormErrors(errors);
    }
  );

  const setError: SchemaFormReturnValues["setError"] = useMemoizedFn(
    (name, error) => setFormErrors({ [name]: error })
  );

  const validateSyncFormBySchema: SchemaFormReturnValues["validateSyncFormBySchema"] =
    useMemoizedFn(
      (schema, options = { abortEarly: false }, isClearErrors = true) => {
        try {
          const values = schema.validateSync(getFormValues(), options);
          if (isClearErrors) {
            clearErrors();
          }
          return values;
        } catch (error: any) {
          const errors = {};
          if (error.inner && error.inner.length) {
            error.inner.forEach((error: any) => {
              set(errors, error.path, error);
            });
          } else {
            set(errors, error.path, error);
          }
          setErrors(errors, isClearErrors);
          throw error;
        }
      }
    );

  const validateFormBySchema: SchemaFormReturnValues["validateFormBySchema"] =
    useMemoizedFn(
      async (schema, options = { abortEarly: false }, isClearErrors = true) => {
        try {
          const values: any = await schema.validate(getFormValues(), options);
          if (isClearErrors) {
            clearErrors();
          }
          return values;
        } catch (error: any) {
          const errors = {};
          if (error.inner && error.inner.length) {
            error.inner.forEach((error: any) => {
              set(errors, error.path, error);
            });
          } else {
            set(errors, error.path, error);
          }
          setErrors(errors);
          throw error;
        }
      }
    );

  const validateForm: SchemaFormReturnValues["validateForm"] = useMemoizedFn(
    (options = { abortEarly: false }, isClearErrors) =>
      validateFormBySchema(schema, options, isClearErrors)
  );

  const validateField: SchemaFormReturnValues["validateField"] = useMemoizedFn(
    (field, options) => {
      let nestedSchema: any;
      try {
        nestedSchema = reach(schema, field);
      } catch (error: any) {
        nestedSchema = undefined;
      }

      if (!nestedSchema) {
        return Promise.resolve();
      }

      try {
        const values = schema.validateSyncAt(field, getFormValues(), options);
        clearError(field);
        return values;
      } catch (error: any) {
        setError(field, error);
        return error;
      }
    }
  );

  const validateFields: SchemaFormReturnValues["validateFields"] =
    useMemoizedFn(
      (fields, option) =>
        new Promise((resolve) =>
          Promise.all(fields.map((field) => validateField(field, option)))
            .then((results) =>
              resolve(!results.some((result) => result instanceof Error))
            )
            .catch(() => resolve(false))
        )
    );

  const submit: SchemaFormReturnValues["submit"] = useMemoizedFn(async () => {
    try {
      setFormState({ isSubmitting: true });
      const values = await validateForm();
      setFormState({ isTouched: false });
      return values;
    } finally {
      setFormState({ isSubmitting: false, isSubmitted: true });
    }
  });

  return {
    schema,
    formValues,
    formState,
    setFormState,
    resetFormState,
    formErrors,
    setFormErrors,
    resetFormErrors,
    getFormValues,
    setFormValues,
    getValue,
    getField,
    getValues,
    getValuesByObjectSchema,
    setValue,
    setValues,
    resetValues,
    clearError,
    clearErrors,
    setErrors,
    setError,
    validateForm,
    validateSyncFormBySchema,
    validateFormBySchema,
    validateField,
    validateFields,
    submit,
  };
};
