import { useFormik } from 'formik';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { EventAction, IllusHourglass, PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { NOTIFICHE } from '../../navigation/routes.const';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { pecValidationSchema } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';

interface Props {
  isTransferring?: boolean;
  setShowPecWizard: (showPecWizard: boolean) => void;
  onGoBack?: () => void;
}

const PecContactWizard: React.FC<Props> = ({
  isTransferring = false,
  setShowPecWizard,
  onGoBack,
}) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { defaultSERCQ_SENDAddress, legalAddresses, addresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const { IS_DOD_ENABLED } = getConfiguration();

  const feedbackTitleLabel = `legal-contacts.sercq-send-wizard.feedback.title-pec-${
    isTransferring ? 'transfer' : 'activation'
  }`;
  const feedbackContentLabel = `legal-contacts.sercq-send-wizard.feedback.content-pec${
    isTransferring ? '-transfer' : ''
  }`;
  const buttonTextLabel = `legal-contacts.sercq-send-wizard.button${
    isTransferring ? '-transfer' : '-activation'
  }`;

  const validationSchema = yup.object().shape({
    pec: pecValidationSchema(t),
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
      handleCodeVerification();
    },
  });

  const handleChangeTouched = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'disclaimer') {
      const event = e.target.checked
        ? PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_ACCEPTED
        : PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_DISMISSED;
      PFEventStrategyFactory.triggerEvent(event);
    }

    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_UX_CONVERSION);
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: 'default',
      channelType: ChannelType.PEC,
      value: formik.values.pec,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        if (!res) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_OTP);
          setOpenCodeModal(true);
          return;
        }
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_UX_SUCCESS, {
          event_type: EventAction.CONFIRM,
          addresses,
          other_contact: false,
        });
        setOpenCodeModal(false);
        return setActiveStep(activeStep + 1);
      })
      .catch(() => {});
  };

  const handlePreviousBtnClick = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_BACK);
    if (onGoBack && isTransferring) {
      onGoBack();
    } else {
      return !IS_DOD_ENABLED ? navigate(-1) : setShowPecWizard(false);
    }
  };

  const handleCloseCodeModal = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_OTP_BACK);
    setOpenCodeModal(false);
  };

  const handleSubmitForm = async () => {
    const errors = formik.errors;
    const pecValidation = !formik.values.pec ? 'missing' : errors?.pec ? 'invalid' : 'valid';
    if (errors?.pec) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ERROR, {
        pec_validation: pecValidation,
      });
    }

    if (errors?.disclaimer) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_TOS_MANDATORY);
    }

    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_START_ACTIVATION, {
      event_type: EventAction.ACTION,
      legal_addresses: legalAddresses,
      pec_validation: pecValidation,
      tos_validation: errors?.disclaimer ? 'missing' : 'valid',
    });

    await formik.submitForm();
  };

  const handleCloseFeedbackStep = () => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_THANK_YOU_PAGE_CLOSE);
    navigate(NOTIFICHE);
  };

  useEffect(() => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SERCQ_SEND_PEC_ENTER_PEC, {
      event_type: EventAction.SCREEN_VIEW,
      legal_addresses: legalAddresses,
    });
  }, []);

  return (
    <>
      <PnWizard
        title={
          <Typography fontSize="28px" fontWeight={700} data-testid="pec-wizard-title">
            {t(`legal-contacts.pec-contact-wizard.title${isTransferring ? '-transfer' : ''}`)}
          </Typography>
        }
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        slots={{
          exitButton: () => <></>,
          nextButton: () => <></>,
          prevButton: () => (
            <ButtonNaked
              onClick={handlePreviousBtnClick}
              color="primary"
              size="medium"
              data-testid="prev-button"
              sx={{ mt: { xs: 2, lg: 0 } }}
            >
              {t('button.indietro', { ns: 'common' })}
            </ButtonNaked>
          ),
          feedbackIcon: IllusHourglass,
        }}
        slotsProps={{
          container: {
            'data-testid': 'pec-contact-wizard',
          },
          feedback: {
            title: t(feedbackTitleLabel),
            content: t(feedbackContentLabel),
            buttonText: t('button.understand', { ns: 'common' }),
            onClick: handleCloseFeedbackStep,
            onFeedbackShow: () =>
              PFEventStrategyFactory.triggerEvent(
                PFEventsType.SEND_ADD_SERCQ_SEND_PEC_THANK_YOU_PAGE,
                {
                  event_type: EventAction.SCREEN_VIEW,
                  addresses,
                }
              ),
          },
          actions: { justifyContent: 'center' },
        }}
      >
        <PnWizardStep>
          <Typography fontSize="22px" fontWeight={700} mb={{ xs: 2, lg: 3 }}>
            {t('legal-contacts.pec-contact-wizard.content-title')}
          </Typography>

          <Typography variant="body2" mb={defaultSERCQ_SENDAddress ? { xs: 2, lg: 3 } : 3}>
            {t('legal-contacts.pec-contact-wizard.content-description')}
          </Typography>

          {defaultSERCQ_SENDAddress && (
            <Alert severity="info" sx={{ mb: 3 }} data-testid="sercq-info-alert">
              {t('legal-contacts.pec-contact-wizard.sercq-info-alert')}
            </Alert>
          )}

          <Typography
            fontSize="14px"
            fontWeight={400}
            mb={2}
            variant="body2"
            color="text.secondary"
          >
            {t('required-fields', { ns: 'common' })}
          </Typography>

          <TextField
            id="pec"
            name="pec"
            label={t('legal-contacts.pec-contact-wizard.input-label')}
            size="small"
            fullWidth
            sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
            value={formik.values.pec}
            onChange={handleChangeTouched}
            error={formik.touched.pec && Boolean(formik.errors.pec)}
            helperText={formik.touched.pec && formik.errors.pec}
            data-testid="pec-wizard-input"
            required
          />

          <FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  sx={
                    formik.touched.disclaimer && formik.errors.disclaimer
                      ? { color: 'error.dark' }
                      : { color: 'text.secondary' }
                  }
                  name="disclaimer"
                  id="disclaimer"
                  required
                  onChange={handleChangeTouched}
                  inputProps={{
                    'aria-describedby': 'disclaimer-helper-text',
                    'aria-invalid': formik.touched.disclaimer && Boolean(formik.errors.disclaimer),
                  }}
                />
              }
              label={<Trans ns="recapiti" i18nKey="legal-contacts.pec-contact-wizard.disclaimer" />}
              sx={{ mt: 2 }}
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
            onClick={handleSubmitForm}
            sx={{ mt: 3 }}
            data-testid="next-button"
          >
            {t(buttonTextLabel, { ns: 'recapiti' })}
          </Button>
        </PnWizardStep>
      </PnWizard>

      <ContactCodeDialog
        value={formik.values.pec}
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open={openCodeModal}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCloseCodeModal}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR)}
      />
    </>
  );
};

export default PecContactWizard;
