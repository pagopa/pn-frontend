import { Children, cloneElement, isValidElement, useMemo } from 'react';

import { Button, DialogActions, DialogActionsProps } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { ReactComponent } from '../../models/PnDialog';

const PnDialogActions: React.FC<DialogActionsProps> = (props) => {
  const isMobile = useIsMobile();
  const paddingSize = useMemo(() => (isMobile ? 3 : 4), [isMobile]);
  const gapSize = useMemo(() => (isMobile ? 0 : 1), [isMobile]);

  const buttons: Array<ReactComponent> | undefined = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type === Button
  );

  const enrichedButtons = buttons.map((button, index) =>
    isValidElement(button)
      ? cloneElement(button, {
          fullWidth: isMobile,
          sx: { marginBottom: isMobile && index > 0 ? 2 : 0, ...button.props.sx },
          ...button.props,
        })
      : button
  );

  return (
    <DialogActions
      data-testid="dialog-actions"
      disableSpacing={isMobile}
      sx={{
        flexDirection: isMobile ? 'column-reverse' : 'row',
        p: paddingSize,
        gap: gapSize,
        ...props.sx,
      }}
      {...props}
    >
      {enrichedButtons}
    </DialogActions>
  );
};

export default PnDialogActions;
