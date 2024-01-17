import { Children, cloneElement, isValidElement, useMemo } from 'react';

import { DialogContent, DialogContentProps, DialogContentText } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { ReactComponent } from '../../models/PnDialog';

const PnDialogContent: React.FC<DialogContentProps> = (props) => {
  const isMobile = useIsMobile();
  const paddingSize = useMemo(() => (isMobile ? 3 : 4), [isMobile]);

  const subtitle: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === DialogContentText
  );

  const othersChildren: Array<ReactComponent> | undefined = Children.toArray(props.children).filter(
    (child) => isValidElement(child) && child.type !== DialogContentText
  );

  const enrichedSubTitle = isValidElement(subtitle)
    ? cloneElement(subtitle, {
        sx: { ...subtitle.props.sx },
        ...subtitle.props,
      })
    : subtitle;

  return (
    <DialogContent
      data-testid="dialog-content"
      {...props}
      sx={{ p: paddingSize, pt: 0, ...props.sx }}
    >
      {subtitle && enrichedSubTitle}
      {othersChildren}
    </DialogContent>
  );
};

export default PnDialogContent;
