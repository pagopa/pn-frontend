import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  Alert,
  Box,
  Button,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import {
  ConsentActionType,
  ConsentType,
  SERCQ_SEND_VALUE,
  TosPrivacyConsent,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { TERMS_OF_SERVICE_SERCQ_SEND } from '../../navigation/routes.const';
import {
  acceptSercqSendTosPrivacy,
  createOrUpdateAddress,
  getSercqSendTosPrivacyApproval,
} from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import InformativeDialog from './InformativeDialog';

const redirectToSLink = () => window.open(`${TERMS_OF_SERVICE_SERCQ_SEND}`, '_blank');

enum ModalType {
  DELIVERED = 'DELIVERED',
}

type Props = {
  goToNextStep?: () => void;
  setShowPecWizard: (showPecWizard: boolean) => void;
};

const SercqSendContactWizard: React.FC<Props> = ({ goToNextStep, setShowPecWizard }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const tosPrivacy = useRef<Array<TosPrivacyConsent>>();
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const { defaultPECAddress } = useAppSelector(contactsSelectors.selectAddresses);
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);
  const { IS_DOD_ENABLED } = getConfiguration();

  const sercqSendInfoList: Array<{ title: string; description: string }> = t(
    'legal-contacts.sercq-send-wizard.step_1.info-list',
    {
      returnObjects: true,
      defaultValue: [],
    }
  );

  const handleActivation = () => {
    dispatch(getSercqSendTosPrivacyApproval())
      .unwrap()
      .then((consent) => {
        // eslint-disable-next-line functional/immutable-data
        tosPrivacy.current = consent;
        const source = externalEvent?.source ?? ContactSource.RECAPITI;
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_START, {
          senderId: 'default',
          source,
        });
        handleInfoConfirm();
      })
      .catch(() => {});
  };

  const handleInfoConfirm = () => {
    if (!tosPrivacy.current) {
      return;
    }
    // first check tos and privacy status
    const [tos, privacy] = tosPrivacy.current.filter(
      (consent) =>
        consent.consentType === ConsentType.TOS_SERCQ ||
        consent.consentType === ConsentType.DATAPRIVACY_SERCQ
    );
    // if tos and privacy are already accepted, proceede with the activation
    if (tos.accepted && privacy.accepted) {
      activateService();
      return;
    }
    // accept tos and privacy
    const tosPrivacyBody = [];
    if (!tos.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: tos.consentVersion,
        type: ConsentType.TOS_SERCQ,
      });
    }
    if (!privacy.accepted) {
      // eslint-disable-next-line functional/immutable-data
      tosPrivacyBody.push({
        action: ConsentActionType.ACCEPT,
        version: privacy.consentVersion,
        type: ConsentType.DATAPRIVACY_SERCQ,
      });
    }
    dispatch(acceptSercqSendTosPrivacy(tosPrivacyBody))
      .unwrap()
      .then(() => {
        activateService();
      })
      .catch(() => {});
  };

  const activateService = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_UX_CONVERSION, 'default');
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: 'default',
      channelType: ChannelType.SERCQ_SEND,
      value: SERCQ_SEND_VALUE,
    };
    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then(() => {
        sessionStorage.removeItem('domicileBannerClosed');
        PFEventStrategyFactory.triggerEvent(
          PFEventsType.SEND_ADD_SERCQ_SEND_UX_SUCCESS,
          !!defaultPECAddress
        );
        // show success message
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(`legal-contacts.sercq_send-added-successfully`, { ns: 'recapiti' }),
          })
        );
        goToNextStep && goToNextStep();
      })
      .catch(() => {});
  };

  return (
    <Box data-testid="sercqSendContactWizard">
      <Typography fontSize="22px" fontWeight={700} mb={3}>
        {t('legal-contacts.sercq-send-wizard.step_1.title')}
      </Typography>

      {IS_DOD_ENABLED && (
        <>
          <List dense sx={{ p: 0 }} data-testid="sercq-send-info-list">
            {sercqSendInfoList.map((item, index) => (
              <Stack key={index} spacing={2} direction="row" alignItems="flex-start">
                <Box
                  sx={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#35C1EC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" fontSize="14px" fontWeight={400} color="white">
                    {index + 1}
                  </Typography>
                </Box>
                <ListItem key={index} sx={{ px: 0, pt: 0, pb: 3 }}>
                  <ListItemText disableTypography>
                    <Typography fontSize="16px" fontWeight={600} mb={1}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2">
                      <Trans
                        i18nKey={item.description}
                        ns="recapiti"
                        t={(s: string) => s}
                        components={[
                          <Link
                            key="consegnata"
                            sx={{
                              cursor: 'pointer',
                              textDecoration: 'none !important',
                            }}
                            onClick={() => setModalOpen(ModalType.DELIVERED)}
                          />,
                        ]}
                      />
                    </Typography>
                  </ListItemText>
                </ListItem>
              </Stack>
            ))}
          </List>

          {defaultPECAddress && (
            <Alert severity="info" sx={{ mb: 4 }} data-testid="default-pec-info">
              {t('legal-contacts.sercq-send-wizard.step_1.pec-info-alert')}
            </Alert>
          )}

          <Typography fontSize="14px" color="text.secondary" mb={4}>
            <Trans
              i18nKey="legal-contacts.sercq-send-wizard.step_1.info-tos"
              ns="recapiti"
              components={[
                <Link
                  key="tos"
                  sx={{
                    cursor: 'pointer',
                    textDecoration: 'none !important',
                    fontWeight: 'bold',
                  }}
                  onClick={redirectToSLink}
                  data-testid="tos-link"
                />,
              ]}
            />
          </Typography>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleActivation}
            sx={{ textTransform: 'none', mb: !defaultPECAddress ? 4 : 0 }}
            data-testid="activateButton"
          >
            {t('button.enable', { ns: 'common' })}
          </Button>

          {!defaultPECAddress && (
            <Divider
              sx={{ mb: 4, fontSize: '14px', color: 'text.secondary', textTransform: 'capitalize' }}
            >
              {t('conjunctions.or', { ns: 'common' })}
            </Divider>
          )}
        </>
      )}

      {!defaultPECAddress && (
        <Box data-testid="pec-section">
          <Typography fontSize="16px" fontWeight={600} mb={0.5}>
            {t('legal-contacts.sercq-send-wizard.step_1.have-pec')}
          </Typography>
          <Typography variant="body2" mb={1}>
            {t('legal-contacts.sercq-send-wizard.step_1.have-pec-description')}
          </Typography>
          <ButtonNaked color="primary" size="medium" onClick={() => setShowPecWizard(true)}>
            {t('legal-contacts.sercq-send-wizard.step_1.insert-pec')}
          </ButtonNaked>
        </Box>
      )}

      <InformativeDialog
        open={modalOpen === ModalType.DELIVERED}
        title={t('legal-contacts.sercq-send-wizard.step_1.delivered-dialog-title')}
        subtitle={
          <Trans
            i18nKey="legal-contacts.sercq-send-wizard.step_1.delivered-dialog-description"
            ns="recapiti"
          />
        }
        onConfirm={() => setModalOpen(null)}
      />
    </Box>
  );
};

export default SercqSendContactWizard;
