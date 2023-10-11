import { CustomMobileDialogProvider } from './CustomMobileDialog.context';

/**
 * Container for mobile version of the dialog
 */
const CustomMobileDialog: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <CustomMobileDialogProvider>{children}</CustomMobileDialogProvider>
);

export default CustomMobileDialog;
