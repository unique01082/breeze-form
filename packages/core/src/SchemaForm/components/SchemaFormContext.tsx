import React, { createContext, useContext } from "react";
import { SchemaFormReturnValues } from "../types";

export const SchemaFormContext = createContext<SchemaFormReturnValues>(
  undefined as never
);

interface SchemaFormContextProviderProps extends SchemaFormReturnValues {
  children?: React.ReactNode;
}

export const SchemaFormContextProvider: React.FC<
  SchemaFormContextProviderProps
> = ({ children, ...restProps }) => (
  <SchemaFormContext.Provider value={restProps}>
    {children}
  </SchemaFormContext.Provider>
);

export const SchemaFormContextConsumer = SchemaFormContext.Consumer;

export const useSchemaFormContext = () => useContext(SchemaFormContext);
