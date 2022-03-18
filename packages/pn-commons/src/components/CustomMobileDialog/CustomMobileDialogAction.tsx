import { ReactNode } from "react";
import { Box } from "@mui/material";

import { useCustomMobileDialogContext } from "./CustomMobileDialog.context";

type Props = {
  children: ReactNode,
  closeOnClick?: boolean
}

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