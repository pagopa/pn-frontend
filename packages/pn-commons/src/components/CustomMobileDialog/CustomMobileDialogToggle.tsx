import { ReactNode } from "react";
import { Badge, BadgeProps, Box, Button } from "@mui/material";
import { styled, SxProps, Theme } from '@mui/material/styles';

import {useCustomMobileDialogContext} from "./CustomMobileDialog.context";

type Props = {
  children: ReactNode,
  sx?: SxProps<Theme>,
  hasCounterBadge?: boolean;
  bagdeCount?: number;
}

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    position: 'unset',
    transform: 'translate(0, 0)',
  },
}));

const CustomMobileDialogToggle = ({children, hasCounterBadge, bagdeCount = 0, sx}: Props) => {

  const { toggleOpen } = useCustomMobileDialogContext();

  const handleClickOpen = () => {
    toggleOpen();
  }

  return (
    <Box>
      <Button onClick={handleClickOpen} sx={sx}>{children}</Button>
      {hasCounterBadge && bagdeCount > 0 && (
        <StyledBadge badgeContent={bagdeCount} color="secondary"></StyledBadge>
      )}
    </Box>
  );
};

export default CustomMobileDialogToggle;
