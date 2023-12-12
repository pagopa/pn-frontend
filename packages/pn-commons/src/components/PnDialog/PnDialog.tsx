import { Children, cloneElement, isValidElement, useMemo } from 'react';

import { Dialog, DialogProps, DialogTitle } from '@mui/material';

import { useIsMobile } from '../../hooks';
import { ReactComponent } from '../../models/PnDialog';
import PnDialogActions from './PnDialogActions';
import PnDialogContent from './PnDialogContent';

const PnDialog: React.FC<DialogProps> = (props) => {
  const isMobile = useIsMobile();
  const paddingSize = useMemo(() => (isMobile ? 3 : 4), [isMobile]);

  const title: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === DialogTitle
  );

  const enrichedTitle = isValidElement(title)
    ? cloneElement(title, {
        sx: { p: paddingSize, ...title.props.sx },
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
