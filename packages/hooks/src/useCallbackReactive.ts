import { useCreation, useUpdate } from "ahooks";
import { isObject } from "lodash";

const WHITE_LIST_KEYS: Array<string | symbol> = ["prototype", "constructor"];

const proxyMap = new WeakMap();
const rawMap = new WeakMap();

function observer<T extends Record<string, any>>(
  initialVal: T,
  cb: (...args: any) => void
): T {
  const existingProxy = proxyMap.get(initialVal);

  if (existingProxy) {
    return existingProxy;
  }

  if (rawMap.has(initialVal)) {
    return initialVal;
  }

  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);

      return isObject(result) && !WHITE_LIST_KEYS.includes(key)
        ? observer(result, cb)
        : Reflect.get(target, key, receiver);
    },
    set(target, key, val) {
      const result = Reflect.set(target, key, val);
      cb({ target, key, val });

      return result;
    },
    deleteProperty(target, key) {
      const result = Reflect.deleteProperty(target, key);
      cb({ target, key });
      return result;
    },
  });

  proxyMap.set(initialVal, proxy);
  rawMap.set(proxy, initialVal);

  return proxy;
}

function useCallbackReactive<S extends Record<string, any>>(
  initialState: S,
  callback?: (state: S, args?: any) => void
): S {
  const update = useUpdate();
  console.log(222);

  const state = useCreation(
    () =>
      observer(initialState, (...args) => {
        update();
        callback?.(initialState, ...args);
      }),
    [initialState]
  );

  return state;
}

useCallbackReactive.unwrap = (object: any) => rawMap.get(object);

export default useCallbackReactive;
