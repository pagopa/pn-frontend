import { Children, cloneElement, isValidElement } from 'react';

import { Button, DialogActions, DialogActionsProps } from '@mui/material';

import { useIsMobile } from '../../hooks/useIsMobile';
import { ReactComponent } from '../../models/PnDialog';

const PnDialogActions: React.FC<DialogActionsProps> = (props) => {
  const isMobile = useIsMobile('sm');
  const buttons: Array<ReactComponent> | undefined = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type === Button
  );

  const enrichedButtons = buttons.map((button, index) =>
    isValidElement(button)
      ? cloneElement(button, {
          ...button.props,
          fullWidth: isMobile,
          sx: {
            marginBottom: index > 0 && isMobile ? 2 : 0,
            ...button.props.sx,
          },
        })
      : button
  );

  return (
    <DialogActions
      data-testid="dialog-actions"
      disableSpacing={isMobile}
      {...props}
      sx={{
        flexDirection: isMobile ? 'column-reverse' : 'row',
        p: isMobile ? 3 : 4,
        pt: 0,
        gap: isMobile ? 0 : 1,
        ...props.sx,
      }}
    >
      {enrichedButtons}
    </DialogActions>
  );
};

export default PnDialogActions;
