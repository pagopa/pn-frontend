import {ReactNode } from 'react';
import { CustomMobileDialogProvider } from './CustomMobileDialog.context';

type Props = {
  children?: ReactNode;
};

/**
 * Container for mobile version of the dialog
 */
const CustomMobileDialog = ({
  children
}: Props) => {
  return (
    <CustomMobileDialogProvider>
      {children}
    </CustomMobileDialogProvider>
  );
};

export default CustomMobileDialog;
