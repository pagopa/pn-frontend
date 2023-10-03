import { Box } from '@mui/material';

import { useCustomMobileDialogContext } from './CustomMobileDialog.context';

type Props = {
  closeOnClick?: boolean;
};

/**
 * Dialog actions
 * @param children the react component for the action
 * @param closeOnClick flag for close the dialog on action click
 */
const CustomMobileDialogAction: React.FC<Props> = ({ children, closeOnClick = false }) => {
  const { toggleOpen } = useCustomMobileDialogContext();

  const handleActionClick = () => {
    if (closeOnClick) {
      toggleOpen();
    }
  };

  return (
    <Box data-testid="dialogAction" onClick={handleActionClick}>
      {children}
    </Box>
  );
};

export default CustomMobileDialogAction;
