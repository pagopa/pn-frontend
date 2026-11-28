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
  greetingKey?: string;
  attachmentsInfoKey?: string;
  paymentInstructionsKey?: string;
  assistanceKey?: string;
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
  greetingKey = 'detail.informal_notification_markdown.greeting',
  attachmentsInfoKey = 'detail.informal_notification_markdown.attachments_info',
  paymentInstructionsKey = 'detail.informal_notification_markdown.payment_instructions',
  assistanceKey = 'detail.informal_notification_markdown.assistance',
  onExternalLinkClick,
}) => {
  const greetingMessage = getLocalizedOrDefaultLabel('notifications', greetingKey, undefined, {
    recipientDenomination,
  });
  const attachmentsInfoMessage = getTranslationMessage(attachmentsInfoKey, 'notifiche');
  const paymentInstructionsMessage = getTranslationMessage(paymentInstructionsKey, 'notifiche');
  const assistanceMessage = getTranslationMessage(assistanceKey, 'notifiche');

  return (
    <Stack data-testid="informalNotificationMessage">
      {recipientDenomination && (
        <Typography variant={variant} color="text.primary">
          {greetingMessage}
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

      {hasAttachments && (
        <Typography component="p" variant={variant} color="text.primary" mt={1.5}>
          <Trans
            i18nKey={attachmentsInfoMessage.key}
            ns={attachmentsInfoMessage.ns}
            components={[<strong key="0" />]}
          />
        </Typography>
      )}

      {hasPayment && (
        <Typography component="p" variant={variant} color="text.primary" mt={1.5}>
          <Trans
            i18nKey={paymentInstructionsMessage.key}
            ns={paymentInstructionsMessage.ns}
            components={[<strong key="0" />, <strong key="1" />]}
          />
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
