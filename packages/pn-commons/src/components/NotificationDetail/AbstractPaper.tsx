import { ReactNode, useState } from 'react';
import { Trans } from 'react-i18next';

import AccountBalanceRoundedIcon from '@mui/icons-material/AccountBalanceRounded';
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import { Avatar, Box, Divider, Grid, Stack, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { MIButton, MIPaper, Tag, theme } from '@pagopa/mui-italia';

import { useIsMobile } from '../../hooks';
import { formatDate } from '../../utility';
import { getAccessibleIun } from '../../utility/accessibility.utility';
import {
  getLocalizedOrDefaultLabel,
  getTranslationMessage,
} from '../../utility/localization.utility';
import PNMarkdown from '../PnMarkdown/PnMarkdown';
import TitleBox from '../TitleBox';

interface AbstractPaperDetail {
  label: ReactNode;
  value: ReactNode;
}

interface AbstractPaperProps {
  title?: string;
  senderPaId?: string;
  senderDenomination?: string;
  iun: string;
  abstract?: string; // todo: to sanitize and format the abstract content before passing it to the component
  isLegal?: boolean;
  filedAt: string;
  selfcareCdnUrl?: string;
  details?: Array<AbstractPaperDetail>;
  onDetailsClick?: () => void;
  detailsAriaLabel?: string;
  recipientDenomination?: string;
  hasAttachments?: boolean;
  hasPayment?: boolean;
}

interface InstitutionLogoProps {
  id?: string;
  name?: string;
  selfcareCdnUrl?: string;
}

const InstitutionLogo = ({ id, name, selfcareCdnUrl }: InstitutionLogoProps) => {
  const [hasError, setHasError] = useState(false);
  const logoSrc =
    id && !hasError && selfcareCdnUrl ? `${selfcareCdnUrl}/institutions/${id}/logo.png` : undefined;

  return (
    <Avatar
      src={logoSrc}
      alt={`${getLocalizedOrDefaultLabel('common', 'logo')} ${name}`}
      imgProps={{
        onError: () => setHasError(true),
      }}
      sx={{
        width: { xs: 64 },
        height: { xs: 64 },
        backgroundColor: logoSrc ? undefined : theme.palette.grey[50],
        border: logoSrc ? `1px solid ${theme.palette.grey[200]}` : undefined,
        borderRadius: 2,
        padding: logoSrc ? 1 : 0,
      }}
      variant="rounded"
    >
      <AccountBalanceRoundedIcon sx={{ width: 40, height: 40, color: theme.palette.grey[300] }} />
    </Avatar>
  );
};
const AbstractPaper = ({
  title,
  senderPaId,
  senderDenomination,
  iun,
  abstract,
  isLegal = true,
  filedAt,
  selfcareCdnUrl,
  details,
  onDetailsClick,
  detailsAriaLabel,
  recipientDenomination,
  hasAttachments = false,
  hasPayment = false,
}: AbstractPaperProps) => {
  const isMobile = useIsMobile();

  const hasDetails = !!details?.length;

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

  const renderAbstractSection = () => {
    if (isLegal) {
      return (
        <>
          <Divider aria-hidden sx={{ my: 2 }} />
          {abstract && (
            <Typography variant="body1" sx={{ overflowWrap: 'anywhere' }}>
              {abstract}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: abstract ? 2 : 0 }}>
            {getLocalizedOrDefaultLabel('notifications', 'detail.legal-disclaimer')}
          </Typography>
        </>
      );
    }

    if (!abstract) {
      return null;
    }

    return (
      <>
        <Divider aria-hidden sx={{ my: 2 }} />
        <Stack>
          {recipientDenomination && (
            <Typography variant="body1" color="text.primary">
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
                typography: 'body1',
                color: 'text.primary',
                mt: 4,
              },
            }}
          >
            <PNMarkdown content={abstract} />
          </Box>

          {hasAttachments && (
            <Typography variant="body1" color="text.primary" mt={4}>
              <Trans
                i18nKey={attachmentsInfoMessage.key}
                ns={attachmentsInfoMessage.ns}
                components={[<strong key="0" />]}
              />
            </Typography>
          )}

          {hasPayment && (
            <Typography variant="body1" color="text.primary" mt={hasAttachments ? 2 : 4}>
              <Trans
                i18nKey={paymentInstructionsMessage.key}
                ns={paymentInstructionsMessage.ns}
                components={[<strong key="0" />]}
              />
            </Typography>
          )}
          <Typography
            variant="body1"
            color="text.primary"
            mt={hasAttachments || hasPayment ? 2 : 4}
          >
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
      </>
    );
  };

  return (
    <MIPaper
      padding={24}
      sx={{
        ...(isLegal && {
          borderTop: `2px solid ${theme.palette.primary.main}`,
        }),
      }}
    >
      {isLegal && (
        <Tag
          variant="default"
          icon={VerifiedRoundedIcon}
          value={getLocalizedOrDefaultLabel('notifications', 'detail.legal-value')}
        />
      )}
      <TitleBox
        variantTitle="h4"
        componentTitle="h1"
        title={title}
        mtGrid={isLegal ? 2 : 0}
        mbTitle={0}
      />
      <Divider aria-hidden sx={{ my: 2 }} />
      {hasDetails ? (
        <Stack spacing={2}>
          {details.map((detail, index) => (
            <Box
              key={index}
              sx={{
                borderBottom:
                  index < details.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                pb: index < details.length - 1 ? 2 : 0,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                {detail.label}
              </Typography>
              <Typography
                component="div"
                variant="body2"
                color="text"
                fontWeight={600}
                sx={{ overflowWrap: 'anywhere' }}
              >
                {detail.value}
              </Typography>
            </Box>
          ))}
          {onDetailsClick && (
            <Box sx={{ alignSelf: 'flex-start' }}>
              <MIButton aria-label={detailsAriaLabel} onClick={onDetailsClick} variant="text">
                {getLocalizedOrDefaultLabel('notifications', 'go-to-detail')}{' '}
                <KeyboardArrowRightRoundedIcon />
              </MIButton>
            </Box>
          )}
        </Stack>
      ) : (
        <>
          <Grid container spacing={isMobile ? 0 : 2}>
            <Grid item xs={12} md={6} display="flex" alignItems="center" gap={2}>
              <InstitutionLogo
                id={senderPaId}
                name={senderDenomination}
                selfcareCdnUrl={selfcareCdnUrl}
              />
              <Box>
                <Typography variant="sidenav" color="text" sx={{ wordBreak: 'break-word' }}>
                  {senderDenomination}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isLegal
                    ? getLocalizedOrDefaultLabel('notifications', 'detail.legal-date')
                    : getLocalizedOrDefaultLabel('notifications', 'detail.informal-date')}{' '}
                  {formatDate(filedAt, false)}
                </Typography>
              </Box>
            </Grid>
            {isMobile && (
              <Grid item xs={12}>
                <Divider aria-hidden sx={{ my: 2 }} />
              </Grid>
            )}
            <Grid item xs={12} md={6} display="flex" alignItems="center" gap={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {getLocalizedOrDefaultLabel('common', 'iun')}
                </Typography>
                <Typography variant="body2" color="text" fontWeight={600} aria-hidden="true">
                  {iun}
                </Typography>
                <Typography component="span" sx={{ ...visuallyHidden }}>
                  {getAccessibleIun(iun)}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {renderAbstractSection()}
        </>
      )}
    </MIPaper>
  );
};

export default AbstractPaper;
