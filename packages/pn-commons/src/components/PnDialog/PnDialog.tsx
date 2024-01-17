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
        ...title.props,
        sx: { p: paddingSize, pb: 2, ...title.props.sx },
      })
    : title;

  const content: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === PnDialogContent
  );

  const paddingTop = isMobile ? 3 : 4;
  const enrichedContent = isValidElement(content)
    ? cloneElement(content, {
        ...content.props,
        sx: { pt: title ? 0 : paddingTop, ...content.props.sx },
      })
    : content;

  const actions: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === PnDialogActions
  );

  return (
    <Dialog data-testid="dialog" {...props}>
      {title && enrichedTitle}
      {content && enrichedContent}
      {actions}
    </Dialog>
  );
};

export default PnDialog;
