import { ReactNode } from "react";
import { Box } from "@mui/material";

import { useCustomMobileDialogContext } from "./CustomMobileDialog.context";

type Props = {
  children: ReactNode,
  closeOnClick?: boolean
}

/**
 * Dialog actions
 * @param children the react component for the action
 * @param closeOnClick flag for close the dialog on action click
 */
const CustomMobileDialogAction = ({children, closeOnClick = false}: Props) => {
  const { toggleOpen } = useCustomMobileDialogContext();

  const handleActionClick = () => {
    if (closeOnClick) {
      toggleOpen();
    }
  }

  return (
    <Box data-testid="dialogAction" onClick={handleActionClick}>
      {children}
    </Box>
  );
}

export default CustomMobileDialogAction;