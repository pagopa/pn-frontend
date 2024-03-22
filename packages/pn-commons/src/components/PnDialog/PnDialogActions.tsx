import { Children, cloneElement, isValidElement } from 'react';

import { Button, DialogActions, DialogActionsProps } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { ReactComponent } from '../../models/PnDialog';

const PnDialogActions: React.FC<DialogActionsProps> = (props) => {
  const isMobile = useIsMobile();

  const buttons: Array<ReactComponent> | undefined = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type === Button
  );

  const enrichedButtons = buttons.map((button) =>
    isValidElement(button)
      ? cloneElement(button, {
          ...button.props,
          sx: { marginBottom: { xs: 2, sm: 0 }, width: { xs: 1, sm: 'auto' }, ...button.props.sx },
        })
      : button
  );

  return (
    <DialogActions
      data-testid="dialog-actions"
      disableSpacing={isMobile}
      {...props}
      sx={{
        flexDirection: { xs: 'column-reverse', sm: 'row' },
        p: { xs: 3, sm: 4 },
        pt: { xs: 0, sm: 0 },
        gap: { xs: 0, sm: 1 },
        ...props.sx,
      }}
    >
      {enrichedButtons}
    </DialogActions>
  );
};

export default PnDialogActions;
