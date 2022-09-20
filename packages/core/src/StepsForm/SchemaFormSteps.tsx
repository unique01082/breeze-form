// @ts-nocheck
import { SetState } from "@breeze-form/hooks";
import { useMemoizedFn, useSetState } from "ahooks";
import { Button, Col, Row } from "antd";
import * as React from "react";
import { useSchemaFormContext } from "../SchemaForm/components/SchemaFormContext";
import SchemaFormTab, { SchemaFormTabProp } from "./SchemaFormTab";

export interface SchemaFormStepsContextValue {
  location: { tab: number; step: number };
  setLocation: SetState<{
    tab: number;
    step: number;
  }>;
}

export const SchemaFormStepsContext =
  React.createContext<SchemaFormStepsContextValue>({} as never);

export const SchemaFormStepsContextProvider: React.FC<
  SchemaFormStepsContextValue
> = ({ children, ...restProps }) => (
  <SchemaFormStepsContext.Provider value={restProps}>
    {children}
  </SchemaFormStepsContext.Provider>
);

export const SchemaFormStepsContextConsumer = SchemaFormStepsContext.Consumer;

export const useSchemaFormStepsContext = () =>
  React.useContext(SchemaFormStepsContext);

interface SchemaFormStepsProps {
  children?:
    | React.ReactElement<SchemaFormTabProp, typeof SchemaFormTab>
    | React.ReactElement<SchemaFormTabProp, typeof SchemaFormTab>[];
}

const SchemaFormSteps: React.FC<SchemaFormStepsProps> = ({ children }) => {
  const { validateSyncFormBySchema } = useSchemaFormContext();

  const validateAllSteps = useMemoizedFn(async () => {
    const c = schemas.map((schema) =>
      schema?.map((s) => {
        try {
          validateSyncFormBySchema(s, { abortEarly: false }, false);
        } catch (error) {
          return error;
        }
      })
    );

    outer: for (let tabIndex = 0; tabIndex < c.length; tabIndex++) {
      const tabErrors = c[tabIndex];
      if (tabErrors) {
        for (let stepIndex = 0; stepIndex < tabErrors.length; stepIndex++) {
          if (tabErrors[stepIndex]) {
            setLocation({ tab: tabIndex, step: stepIndex });
            break outer;
          }
        }
      }
    }
  });

  const [location, setLocation] = useSetState({ tab: 0, step: 0 });
  const tabs = React.Children.toArray(children).concat(
    <SchemaFormTab label="Preview" index={React.Children.count(children)}>
      <Button onClick={validateAllSteps}>Submit</Button>
    </SchemaFormTab>
  );
  const newTabs = tabs.map(
    (
      child: React.ReactElement<SchemaFormTabProp, typeof SchemaFormTab>,
      index
    ) =>
      React.cloneElement(child, {
        index: index + 1,
        currentStep: location.step,
        onChange: (step) => setLocation({ step }),
      })
  );
  const tabsProps = newTabs.map((tab) => tab.props);

  const schemas = React.Children.toArray(newTabs).map(
    (child: React.ReactElement<SchemaFormTabProp, typeof SchemaFormTab>) =>
      React.Children.map(child.props.children, (child) => child.props.schema)
  );

  return (
    <SchemaFormStepsContextProvider
      location={location}
      setLocation={setLocation}
    >
      <Row>
        <Col span={6}>
          {tabsProps.map((tab, index) => (
            <h3 onClick={() => setLocation({ tab: index, step: 0 })}>
              {tab.index} {tab.label}
            </h3>
          ))}
        </Col>
        <Col span={18}>{newTabs[location.tab]}</Col>
      </Row>
    </SchemaFormStepsContextProvider>
  );
};

export default SchemaFormSteps;
