import { Children, cloneElement, isValidElement, useMemo } from 'react';

import { DialogContent, DialogContentProps, DialogContentText } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { ReactComponent } from '../../models/PnDialog';

const PnDialogContent: React.FC<DialogContentProps> = (props) => {
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);

  const subtitle: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === DialogContentText
  );

  const othersChildren: Array<ReactComponent> | undefined = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type !== DialogContentText
  );

  const enrichedSubTitle = isValidElement(subtitle)
    ? cloneElement(subtitle, {
        sx: { textAlign: textPosition, ...subtitle.props.sx },
        ...subtitle.props,
      })
    : subtitle;

  return (
    <DialogContent
      data-testid="dialog-content"
      sx={{ p: isMobile ? 3 : 4, textAlign: textPosition, ...props.sx }}
      {...props}
    >
      {subtitle && enrichedSubTitle}
      {othersChildren}
    </DialogContent>
  );
};

export default PnDialogContent;
