import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { Button, DialogActions, DialogActionsProps } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { ReactComponent } from '../../types/PnDialog';

const PnDialogActions: React.FC<DialogActionsProps> = (props) => {
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);

  const buttons: Array<ReactComponent> | undefined = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type === Button
  );

  const enrichedButtons = buttons.map((button, index) =>
    isValidElement(button)
      ? cloneElement(button, {
          ...button.props,
          fullWidth: isMobile,
          sx: { ...button.props.sx, marginTop: isMobile && index > 0 ? '10px' : 0 },
        })
      : button
  );

  return (
    <DialogActions
      data-testid="dialog-actions"
      {...props}
      disableSpacing={isMobile}
      sx={{
        textAlign: textPosition,
        flexDirection: isMobile ? 'column' : 'row',
        p: isMobile ? 3 : 4,
        pt: 2,
      }}
    >
      {enrichedButtons}
    </DialogActions>
  );
};

export default PnDialogActions;
