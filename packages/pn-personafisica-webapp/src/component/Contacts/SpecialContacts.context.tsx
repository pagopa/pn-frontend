import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";

interface ISpecialContactsContext {
  contextEditMode: boolean;
  setContextEditMode: Dispatch<SetStateAction<boolean>>;
}

const SpecialContactsContext = createContext<
  ISpecialContactsContext | undefined
  >(undefined);

const SpecialContactsProvider: FC<ReactNode> = ({ children }) => {
  const [contextEditMode, setContextEditMode] = useState<boolean>(false);

  return (
    <SpecialContactsContext.Provider value={{contextEditMode, setContextEditMode}}>
      {children}
    </SpecialContactsContext.Provider>
  );
};

const useSpecialContactsContext = () => {
  const context = useContext(SpecialContactsContext);

  if (context === undefined) {
    throw new Error(
      'useSpecialContactsContext must be used within a SpecialContactsProvider'
    );
  }

  return context;
};

export { SpecialContactsProvider, useSpecialContactsContext };