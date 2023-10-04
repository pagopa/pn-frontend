import { Badge, BadgeProps, Box, Button } from '@mui/material';
import { SxProps, Theme, styled } from '@mui/material/styles';

import { useCustomMobileDialogContext } from './CustomMobileDialog.context';

type Props = {
  sx?: SxProps<Theme>;
  hasCounterBadge?: boolean;
  bagdeCount?: number;
};

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.primary.main,
    position: 'unset',
    transform: 'translate(0, 0)',
  },
}));

/**
 * Button to open/close dialog
 * @param children the react component for the button
 * @param hasCounterBadge add counter near the button
 * @param bagdeCount number to display into the counter
 * @param sx style to be addded to the button
 */
const CustomMobileDialogToggle: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  hasCounterBadge,
  bagdeCount = 0,
  sx,
}) => {
  const { toggleOpen } = useCustomMobileDialogContext();

  const handleClickOpen = () => {
    toggleOpen();
  };

  return (
    <Box data-testid="dialogToggle">
      <Button onClick={handleClickOpen} sx={sx} data-testid="dialogToggleButton">
        {children}
      </Button>
      {hasCounterBadge && bagdeCount > 0 && (
        <StyledBadge
          id="dialogToggleBadge"
          badgeContent={bagdeCount}
          color="secondary"
        ></StyledBadge>
      )}
    </Box>
  );
};

export default CustomMobileDialogToggle;
