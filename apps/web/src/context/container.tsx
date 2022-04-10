import { createContext, ReactNode, useContext } from 'react';

type ProviderProps<State> = {
  initState?: State;
  children: ReactNode;
};

export const createContainer = <State, Value>(useHook: (initState?: State) => Value, displayName?: string) => {
  const Context = createContext<Value | null>(null);

  if (displayName) {
    Context.displayName = displayName;
  }

  function useContainer(throwError: false): Value | undefined;
  function useContainer(throwError?: true): Value;
  function useContainer(throwError = true) {
    const value = useContext(Context);
    if (value === null) {
      if (throwError) {
        throw new Error('Component must be wrapped in Provider');
      } else {
        return;
      }
    }
    return value;
  }

  const Provider = ({ initState, children }: ProviderProps<State>) => {
    const value = useHook(initState);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };

  return { useContainer, Provider };
};
