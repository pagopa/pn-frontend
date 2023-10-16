import { Children, cloneElement, isValidElement, useMemo } from 'react';
import { DialogContent, DialogContentProps, DialogContentText } from '@mui/material';

import { ReactComponent } from '../../types/PnDialog';
import { useIsMobile } from '../../hooks';

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
        ...subtitle.props,
        sx: { ...subtitle.props.sx, textAlign: textPosition },
      })
    : subtitle;

  return (
    <DialogContent
      {...props}
      data-testid="dialog-content"
      sx={{ ...props.sx, p: isMobile ? 3 : 4, textAlign: textPosition }}
    >
      {subtitle && enrichedSubTitle}
      {othersChildren}
    </DialogContent>
  );
};

export default PnDialogContent;
