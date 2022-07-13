import { createContext, FC, ReactNode } from 'react';

interface INavigationContext {

}

const NavigationContext = createContext<INavigationContext | undefined>(
  undefined
);

const NavigationProvider: FC<ReactNode> = ({ children }) => {
  return <NavigationContext.Provider value={{}}>{children}</NavigationContext.Provider>;
};
