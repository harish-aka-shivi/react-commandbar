import { useEffect, useReducer } from 'react';

export type ReactiveVar<T> = {
  (newValue?: T | ((value: T) => T)): T;
  subscribe: (handler: (value: T) => void) => () => void;
  unsubscribe: (handler: (value: T) => void) => void;
};

type EqualsFunc<T> = (a: T, b: T) => boolean;

export const makeVar = <T>(initialValue: T, equalsFunc?: EqualsFunc<T>): ReactiveVar<T> => {
  let value = initialValue;
  const subscribers = new Set<(value: T) => void>();

  const reactiveVar = (newValue?: T | ((value: T) => T)) => {
    if (newValue !== undefined) {
      let nextValue = value;

      if (newValue instanceof Function) {
        nextValue = newValue(value);
      } else {
        nextValue = newValue;
      }

      const valueChanged = equalsFunc ? !equalsFunc(nextValue, value) : nextValue !== value;
      value = nextValue;

      if (valueChanged) {
        subscribers.forEach((handler) => handler(value));
      }
    }
    return value;
  };

  reactiveVar.subscribe = (handler: (value: T) => void) => {
    subscribers.add(handler);
    return () => subscribers.delete(handler);
  };

  reactiveVar.unsubscribe = (handler: (value: T) => void) => {
    subscribers.delete(handler);
  };

  return reactiveVar;
};

export const useReactiveVar = <T>(reactiveVar: ReactiveVar<T>) => {
  const handler = useReducer((x) => x + 1, 0)[1] as () => void;

  useEffect(() => {
    reactiveVar.subscribe(handler);
    return () => {
      reactiveVar.unsubscribe(handler);
    };
  }, []);

  return reactiveVar();
};
