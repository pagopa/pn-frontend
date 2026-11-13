import { ComponentType, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import CallRoundedIcon from '@mui/icons-material/CallRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import {
  Divider,
  Link,
  LinkProps,
  List,
  ListItem,
  Stack,
  SvgIconProps,
  Typography,
} from '@mui/material';
import { CopyToClipboard, useIsMobile } from '@pagopa-pn/pn-commons';
import { MIPaper } from '@pagopa/mui-italia';

import { EventNotificationTypes, EventPaymentRecipientType } from '../../models';
import MailCertificateRounded from '../Icons/MailCertificateRounded';

type SenderContactsProps = {
  phone?: string;
  site?: string;
  email?: string;
  pec?: string;
  handleTrackEventFn?: (event: EventPaymentRecipientType, param?: object) => void;
};

type SenderContactItemProps = {
  type: 'website' | 'phone' | 'email' | 'pec';
  Icon: ComponentType<SvgIconProps>;
  /** value shown in bold with a copy button; ignored when children are provided */
  copyableValue?: string;
  children?: ReactNode;
};

const SenderContactItem = ({ type, Icon, copyableValue, children }: SenderContactItemProps) => {
  const { t } = useTranslation();

  return (
    <ListItem
      disableGutters
      sx={{ py: 1.5 }}
      data-testid={`sender-contact-${type}`}
      secondaryAction={
        copyableValue && (
          <CopyToClipboard
            getValue={() => copyableValue}
            tooltipMode
            tooltip={t(`detail.contact_sender.copied_${type}`, { ns: 'notifiche' })}
            tooltipBefore={t(`detail.contact_sender.copy_${type}`, { ns: 'notifiche' })}
          />
        )
      }
    >
      <Icon sx={{ color: 'grey.400', mr: 1.5 }} />

      <Stack minWidth={0}>
        <Typography variant="body2" color="text.secondary">
          {t(`detail.contact_sender.${type}`, { ns: 'notifiche' })}
        </Typography>

        {children ?? (
          <Typography variant="body2" fontWeight={600} sx={{ overflowWrap: 'anywhere' }}>
            {copyableValue}
          </Typography>
        )}
      </Stack>
    </ListItem>
  );
};

const ContactLink = (props: LinkProps) => (
  <Link
    variant="body2"
    underline="always"
    // mui-italia adds a vertical margin to every link, not foreseen by the design
    sx={{ overflowWrap: 'anywhere', '&.MuiTypography-root': { my: 0 } }}
    {...props}
  />
);

const PnSenderContacts = ({ phone, site, email, pec, handleTrackEventFn }: SenderContactsProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  if (!phone && !site && !email && !pec) {
    return null;
  }

  const websiteUrl = site && /^https?:\/\//i.test(site) ? site : `https://${site}`;

  const trackExternalLinkClick = (link: string) => () =>
    handleTrackEventFn?.(EventPaymentRecipientType.SEND_TAP_EXTERNAL_LINK, {
      link,
      notification_type: EventNotificationTypes.INFORMAL,
    });

  return (
    <MIPaper sx={{ width: { xs: '100%', md: '42%' } }} padding={24}>
      <Stack spacing={1}>
        <Typography component="h2" variant="h5">
          {t('detail.contact_sender.title', { ns: 'notifiche' })}
        </Typography>

        <Stack component={List} disablePadding divider={<Divider component="li" />}>
          {site && (
            <SenderContactItem type="website" Icon={LanguageRoundedIcon}>
              <ContactLink
                href={websiteUrl}
                onClick={trackExternalLinkClick(websiteUrl)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site}
              </ContactLink>
            </SenderContactItem>
          )}

          {phone &&
            (isMobile ? (
              <SenderContactItem type="phone" Icon={CallRoundedIcon}>
                <ContactLink href={`tel:${phone}`} onClick={trackExternalLinkClick(`tel:${phone}`)}>
                  {phone}
                </ContactLink>
              </SenderContactItem>
            ) : (
              <SenderContactItem type="phone" Icon={CallRoundedIcon} copyableValue={phone} />
            ))}

          {email && (
            <SenderContactItem type="email" Icon={MailOutlineRoundedIcon} copyableValue={email} />
          )}

          {pec && (
            <SenderContactItem type="pec" Icon={MailCertificateRounded} copyableValue={pec} />
          )}
        </Stack>
      </Stack>
    </MIPaper>
  );
};

export default PnSenderContacts;
