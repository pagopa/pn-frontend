import {ReactNode } from 'react';
import { CustomMobileDialogProvider } from './CustomMobileDialog.context';

type Props = {
  children?: ReactNode;
};

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
