import { useFormik } from 'formik';
import React, { ChangeEvent, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
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

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { PRIVACY_POLICY, TERMS_OF_SERVICE_SERCQ_SEND } from '../../navigation/routes.const';
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

const redirectPrivacyLink = () => window.open(`${PRIVACY_POLICY}`, '_blank');
const redirectToSLink = () => window.open(`${TERMS_OF_SERVICE_SERCQ_SEND}`, '_blank');

enum ModalType {
  DELIVERED = 'DELIVERED',
}

type Props = {
  goToNextStep?: () => void;
};

const SercqSendContactWizard: React.FC<Props> = ({ goToNextStep }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();

  const tosPrivacy = useRef<Array<TosPrivacyConsent>>();
  const { defaultPECAddress } = useAppSelector(contactsSelectors.selectAddresses);
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);
  const { IS_DOD_ENABLED } = getConfiguration();

  const validationSchema = yup.object().shape({
    disclaimer: yup.bool().isTrue(t('required-field', { ns: 'common' })),
  });

  const formik = useFormik({
    initialValues: {
      pec: '',
      disclaimer: false,
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      handleActivation();
    },
  });

  const sercqSendContactsList: Array<{ title: string; description: string }> = t(
    'legal-contacts.sercq-send-wizard.step_4.info-list',
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

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
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
      <Typography variant="h6" fontWeight={700} mb={1}>
        {t('legal-contacts.sercq-send-wizard.step_4.title')}
      </Typography>
      <Typography variant="body2" fontSize="14px" mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_4.content')}
      </Typography>
      <Typography variant="body1" fontSize="18px" fontWeight={600}>
        {t('legal-contacts.sercq-send-wizard.step_4.digital-domicile')}
      </Typography>
      <Typography variant="body2" mb={1}>
        {t('legal-contacts.sercq-send-wizard.step_4.send')}
      </Typography>
      <Divider />
      <Typography variant="body2" fontSize="14px" mt={3} mb={2}>
        {t('legal-contacts.sercq-send-wizard.step_4.content')}
      </Typography>
      <>
        <List dense sx={{ p: 0 }} data-testid="sercq-send-info-list">
          {sercqSendContactsList.map((item, index) => (
            // <ListItem key={index} sx={{ px: 0, py: 1 }} divider>
            <ListItem alignItems="flex-start" key={index} disableGutters divider>
              {/* <ListItemText disableTypography> */}
              <Stack width="100%">
                <Typography variant="body1" fontWeight={600}>
                  {item.title}
                </Typography>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">
                    {/* <Trans
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
                    /> */}
                  </Typography>
                  <IconButton size="small">
                    <CheckCircleIcon fontSize="small" htmlColor="green" />
                  </IconButton>
                </Box>
              </Stack>
              {/* </ListItemText> */}
            </ListItem>
          ))}
        </List>

        <FormControl sx={{ my: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                name="disclaimer"
                id="disclaimer"
                // required
                onChange={handleChangeTouched}
                inputProps={{
                  'aria-describedby': 'disclaimer-helper-text',
                  'aria-invalid': formik.touched.disclaimer && Boolean(formik.errors.disclaimer),
                }}
              />
            }
            label={
              <Typography fontSize="14px" color="text.secondary">
                <Trans
                  i18nKey="legal-contacts.sercq-send-wizard.step_4.disclaimer"
                  ns="recapiti"
                  components={[
                    <Link
                      key="privacy-policy"
                      sx={{
                        cursor: 'pointer',
                        textDecoration: 'none !important',
                        fontWeight: 'bold',
                      }}
                      onClick={redirectPrivacyLink}
                      data-testid="tos-link"
                    />,

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
            }
            sx={{ alignItems: 'center' }}
            value={formik.values.disclaimer}
          />
          {formik.touched.disclaimer && Boolean(formik.errors.disclaimer) && (
            <FormHelperText id="disclaimer-helper-text" error>
              {formik.errors.disclaimer}
            </FormHelperText>
          )}
        </FormControl>

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => formik.submitForm()}
          data-testid="activateButton"
        >
          {t('button.enable', { ns: 'common' })}
        </Button>
      </>
    </Box>
  );
};

export default SercqSendContactWizard;
