import { useMemoizedFn } from "ahooks";
import { isFunction } from "lodash";
import { useState } from "react";

export type SetState<S extends Record<string, any>> = <K extends keyof S>(
  state: Pick<S, K> | null | ((prevState: Readonly<S>) => Pick<S, K> | S | null)
) => void;

const useResettableSetState = <S extends Record<string, any>>(
  initialState: S | (() => S)
): [S, SetState<S>, (patch?: S) => void] => {
  const [state, setState] = useState<S>(initialState);

  const setMergeState = useMemoizedFn((patch: any) => {
    setState((prevState) => {
      const newState = isFunction(patch) ? patch(prevState) : patch;
      return newState ? { ...prevState, ...newState } : prevState;
    });
  });

  const resetState = useMemoizedFn(() => setState(initialState));

  return [state, setMergeState, resetState];
};

export default useResettableSetState;
