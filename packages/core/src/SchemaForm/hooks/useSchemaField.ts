import { useCreation } from "ahooks";
import { get } from "lodash";
import { reach } from "yup";
import { useSchemaFormContext } from "../components/SchemaFormContext";
import { SchemaFieldOptions, SchemaFieldReturnValues } from "../types";

export const useSchemaField = <S>(
  name: string,
  options?: SchemaFieldOptions<S>
): SchemaFieldReturnValues<S> => {
  const {
    setValue,
    schema: formSchema,
    formErrors,
    validateField,
    formState,
    getValue,
  } = useSchemaFormContext();

  const value = getValue(name);

  const onChange = (newValue?: S) => {
    setValue(name, newValue);
    if (formState.isSubmitted) {
      validateField(name);
    }
  };

  const schema = useCreation(() => {
    try {
      return reach(formSchema, name);
    } catch (error) {
      return undefined;
    }
  }, [formSchema]);

  const isRequired = useCreation(
    () => schema?.exclusiveTests?.required ?? false,
    schema
  );

  const error = useCreation(() => get(formErrors, name), [formErrors, name]);

  return {
    error,
    value,
    onChange,
    schema,
    isRequired,
  };
};
