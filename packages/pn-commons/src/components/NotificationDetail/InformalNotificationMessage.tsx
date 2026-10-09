import { Trans } from 'react-i18next';

import { Box, Stack, Typography } from '@mui/material';

import {
  getLocalizedOrDefaultLabel,
  getTranslationMessage,
} from '../../utility/localization.utility';
import PNMarkdown from '../PnMarkdown/PnMarkdown';

type Props = {
  message: string;
  recipientDenomination?: string;
  senderDenomination?: string;
  hasAttachments?: boolean;
  hasPayment?: boolean;
  variant?: 'body1' | 'body2';
  onExternalLinkClick?: (href: string) => void;
};

const InformalNotificationMessage: React.FC<Props> = ({
  message,
  recipientDenomination,
  senderDenomination,
  hasAttachments = false,
  hasPayment = false,
  variant = 'body1',
  onExternalLinkClick,
}) => {
  const attachmentsInfoMessage = getTranslationMessage(
    'detail.informal_notification_markdown.attachments_info',
    'notifiche'
  );

  const paymentInstructionsMessage = getTranslationMessage(
    'detail.informal_notification_markdown.payment_instructions',
    'notifiche'
  );
  const assistanceMessage = getTranslationMessage(
    'detail.informal_notification_markdown.assistance',
    'notifiche'
  );

  return (
    <Stack data-testid="informalNotificationMessage">
      {recipientDenomination && (
        <Typography variant={variant} color="text.primary">
          {getLocalizedOrDefaultLabel(
            'notifications',
            'detail.informal_notification_markdown.greeting',
            undefined,
            { recipientDenomination }
          )}
        </Typography>
      )}

      <Box
        sx={{
          overflowWrap: 'anywhere',
          '& p': {
            m: 0,
            typography: variant,
            color: 'text.primary',
            mt: 1.5,
          },
        }}
      >
        <PNMarkdown content={message} onExternalLinkClick={onExternalLinkClick} />
      </Box>

      {(hasAttachments || hasPayment) && (
        <Typography variant={variant} color="text.primary" mt={1.5}>
          {hasAttachments && (
            <Trans
              i18nKey={attachmentsInfoMessage.key}
              ns={attachmentsInfoMessage.ns}
              components={[<strong key="0" />]}
            />
          )}
          {hasAttachments && hasPayment && ' '}
          {hasPayment && (
            <Trans
              i18nKey={paymentInstructionsMessage.key}
              ns={paymentInstructionsMessage.ns}
              components={[<strong key="0" />, <strong key="1" />]}
            />
          )}
        </Typography>
      )}

      <Typography variant={variant} color="text.primary" mt={1.5}>
        <Trans
          i18nKey={assistanceMessage.key}
          ns={assistanceMessage.ns}
          values={{
            senderDenomination,
          }}
          components={[<strong key="0" />]}
        />
      </Typography>
    </Stack>
  );
};

export default InformalNotificationMessage;
