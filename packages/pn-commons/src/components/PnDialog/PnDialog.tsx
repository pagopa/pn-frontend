import { Children, cloneElement, isValidElement } from 'react';

import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Dialog, DialogProps, DialogTitle, IconButton } from '@mui/material';

import { useIsMobile } from '../../hooks/useIsMobile';
import { ReactComponent } from '../../models/PnDialog';
import { getLocalizedOrDefaultLabel } from '../../utility/localization.utility';
import PnDialogActions from './PnDialogActions';
import PnDialogContent from './PnDialogContent';
import PnDialogIllustration from './PnDialogIllustration';

export type PnDialogProps = DialogProps & {
  /** Renders a standard close button in the top-right corner of the dialog */
  showCloseButton?: boolean;
  /** Accessible label for the close button. Falls back to the shared localized label */
  closeButtonLabel?: string;
  /** Invoked when the close button is clicked. Falls back to `onClose` */
  onCloseButtonClick?: () => void;
};

const PnDialog: React.FC<PnDialogProps> = ({
  showCloseButton = false,
  closeButtonLabel,
  onCloseButtonClick,
  ...props
}) => {
  const isMobile = useIsMobile('sm');
  const paddingSize = isMobile ? 3 : 4;

  const illustration: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === PnDialogIllustration
  );

  const enrichedIllustration = isValidElement(illustration)
    ? cloneElement(illustration, {
        ...illustration.props,
        sx: { px: paddingSize, pt: paddingSize, ...illustration.props.sx },
      })
    : illustration;

  const title: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === DialogTitle
  );

  const enrichedTitle = isValidElement(title)
    ? cloneElement(title, {
        ...title.props,
        sx: {
          p: paddingSize,
          pb: 2,
          ...(showCloseButton && { pr: 9 }),
          ...title.props.sx,
        },
      })
    : title;

  const content: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === PnDialogContent
  );

  const enrichedContent = isValidElement(content)
    ? cloneElement(content, {
        ...content.props,
        sx: { pt: title ? 0 : paddingSize, ...content.props.sx },
      })
    : content;

  const actions: ReactComponent = Children.toArray(props.children).find(
    (child) => isValidElement(child) && child.type === PnDialogActions
  );

  const handleCloseButtonClick = () => {
    if (onCloseButtonClick) {
      onCloseButtonClick();
      return;
    }
    props.onClose?.({}, 'escapeKeyDown');
  };

  return (
    <Dialog data-testid="dialog" {...props}>
      {showCloseButton && (
        <IconButton
          aria-label={
            closeButtonLabel ?? getLocalizedOrDefaultLabel('common', 'button.close', 'Chiudi')
          }
          onClick={handleCloseButtonClick}
          data-testid="dialogCloseButton"
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: (theme) => theme.palette.text.primary,
          }}
        >
          <CloseRoundedIcon />
        </IconButton>
      )}
      {illustration && enrichedIllustration}
      {title && enrichedTitle}
      {content && enrichedContent}
      {actions}
    </Dialog>
  );
};

export default PnDialog;
