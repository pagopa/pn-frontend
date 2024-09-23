import { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Button,
  DialogContentText,
  DialogTitle,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import {
  PRIVACY_POLICY_SERCQ_SEND,
  TERMS_OF_SERVICE_SERCQ_SEND,
} from '../../navigation/routes.const';

import { PFEventsType } from '../../models/PFEventsType';
import { resetFromExternalInfo } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';

type Props = {
  open: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
  senderId?: string;
};

const redirectPrivacyLink = () => window.open(`${PRIVACY_POLICY_SERCQ_SEND}`, '_blank');
const redirectToSLink = () => window.open(`${TERMS_OF_SERVICE_SERCQ_SEND}`, '_blank');

const SercqSendInfoDialog: React.FC<Props> = ({
  open = false,
  onDiscard,
  onConfirm,
  senderId = 'default',
}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const contactInfo = useAppSelector((state) => state.contactsState.fromExternalInfo);

  const trackSercqSendStartEvent = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_START, {
      senderId,
      source: contactInfo.source,
    });

    dispatch(resetFromExternalInfo());
  };

  const sercqSendInfoList: Array<{ title: string; description: string }> = t(
    'legal-contacts.sercq-send-info-list',
    {
      returnObjects: true,
      defaultValue: [],
      ns: 'recapiti',
    }
  );

  useEffect(() => {
    if (open) {
      trackSercqSendStartEvent();
    }
  }, [open]);

  return (
    <PnDialog
      open={open}
      data-testid="sercqSendInfoDialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        {t('legal-contacts.sercq-send-info-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description" sx={{ color: 'text.primary' }}>
          <Trans i18nKey="legal-contacts.sercq-send-info-description" ns="recapiti" />
        </DialogContentText>
        <Typography
          mt={3}
          mb={2}
          sx={{ textTransform: 'uppercase' }}
          fontWeight={700}
          variant="subtitle2"
          color="text.secondary"
        >
          {t('legal-contacts.sercq-send-info-advantages', { ns: 'recapiti' })}
        </Typography>
        <List dense sx={{ p: 0 }}>
          {sercqSendInfoList.map((item, index) => (
            <ListItem key={index} sx={{ px: 0, pt: 0, pb: 2 }}>
              <ListItemText disableTypography>
                <Typography variant="body2" fontSize="18px" fontWeight={700} mb={0.5}>
                  {item.title}
                </Typography>
                <Typography variant="body2" fontSize="18px">
                  {item.description}
                </Typography>
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Typography fontWeight={400} fontSize="14px" mt={2} mb={2}>
          {t('legal-contacts.sercq-send-info-pec-disclaimer', { ns: 'recapiti' })}
        </Typography>
        <Typography fontWeight={400} fontSize="14px">
          <Trans
            i18nKey="legal-contacts.sercq-send-info-tos-privacy"
            ns="recapiti"
            components={[
              <Link
                key="tos"
                sx={{ cursor: 'pointer', textDecoration: 'none !important', fontWeight: 'bold' }}
                onClick={redirectToSLink}
                data-testid="tos-link"
              />,
              <Link
                key="privacy"
                sx={{ cursor: 'pointer', textDecoration: 'none !important', fontWeight: 'bold' }}
                onClick={redirectPrivacyLink}
                data-testid="privacy-link"
              />,
            ]}
          />
        </Typography>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={onDiscard} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={onConfirm} variant="contained">
          {t('button.enable')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default SercqSendInfoDialog;
