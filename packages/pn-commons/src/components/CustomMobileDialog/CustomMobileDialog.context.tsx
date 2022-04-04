import { createContext, FC, ReactNode, useContext, useState } from 'react';

interface ICustomMobileDialogContext {
  open: boolean;
  toggleOpen: () => void;
}

const CustomMobileDialogContext = createContext<ICustomMobileDialogContext | undefined>(undefined);

const CustomMobileDialogProvider: FC<ReactNode> = ({ children }) => {
  const [open, setOpen] = useState(false);

  const toggleOpen = () => {
    setOpen(!open);
  };

  return (
    <CustomMobileDialogContext.Provider value={{ open, toggleOpen }}>
      {children}
    </CustomMobileDialogContext.Provider>
  );
};

const useCustomMobileDialogContext = () => {
  const context = useContext(CustomMobileDialogContext);
  if (context === undefined) {
    throw new Error(
      'useCustomMobileDialogContext must be used within a CustomMobileDialogProvider'
    );
  }
  return context;
};

export { CustomMobileDialogProvider, useCustomMobileDialogContext };
