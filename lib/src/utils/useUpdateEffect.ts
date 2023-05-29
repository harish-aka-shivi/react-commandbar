import { useEffect, useRef } from 'react';

export const useUpdateEffect = (fn: () => any, deps: any[]) => {
  const firstMount = useRef(true);

  const currentFn = useRef<(() => any) | null>(null);
  currentFn.current = fn;

  useEffect(() => {
    firstMount.current = false;
  }, []);

  useEffect(() => {
    if (!firstMount.current) {
      currentFn.current?.();
    }
  }, deps);
};
