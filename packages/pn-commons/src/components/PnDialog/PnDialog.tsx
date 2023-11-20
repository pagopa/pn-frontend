import { Children, cloneElement, isValidElement, useMemo } from 'react';

import { Dialog, DialogProps, DialogTitle } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { ReactComponent } from '../../models/PnDialog';
import PnDialogActions from './PnDialogActions';
import PnDialogContent from './PnDialogContent';

const PnDialog: React.FC<DialogProps> = (props) => {
  const isMobile = useIsMobile();
  const textPosition = useMemo(() => (isMobile ? 'center' : 'left'), [isMobile]);

  const title: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === DialogTitle
  );

  const enrichedTitle = isValidElement(title)
    ? cloneElement(title, {
        sx: { textAlign: textPosition, p: isMobile ? 3 : 4, pb: 2, ...title.props.sx },
        ...title.props,
      })
    : title;

  const content: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === PnDialogContent
  );

  const actions: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === PnDialogActions
  );

  return (
    <Dialog data-testid="dialog" {...props}>
      {title && enrichedTitle}
      {content}
      {actions}
    </Dialog>
  );
};

export default PnDialog;
