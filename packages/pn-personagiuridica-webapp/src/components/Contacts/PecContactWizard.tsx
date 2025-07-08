import { useFormik } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Typography,
} from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { RECAPITI } from '../../navigation/routes.const';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getConfiguration } from '../../services/configuration.service';
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
  const { defaultSERCQ_SENDAddress } = useAppSelector(contactsSelectors.selectAddresses);
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const { IS_DOD_ENABLED } = getConfiguration();

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
    onSubmit: () => handleCodeVerification(),
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
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
          setOpenCodeModal(true);
          return;
        }
        setOpenCodeModal(false);
        return isTransferring ? setActiveStep(activeStep + 1) : navigate(RECAPITI);
      })
      .catch(() => {});
  };

  const handlePreviousBtnClick = () => {
    if (onGoBack && isTransferring) {
      onGoBack();
    } else {
      return !IS_DOD_ENABLED ? navigate(-1) : setShowPecWizard(false);
    }
  };

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
        onExit={() => navigate(-1)}
        slots={{
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
        }}
        slotsProps={{
          nextButton: {
            onClick: () => formik.submitForm(),
          },
          container: {
            'data-testid': 'pec-contact-wizard',
          },
          feedback: isTransferring
            ? {
                title: t(
                  `legal-contacts.sercq-send-wizard.feedback.title-${
                    isTransferring ? 'transfer' : 'activation'
                  }`
                ),
                buttonText: t('legal-contacts.sercq-send-wizard.feedback.go-to-contacts'),
                onClick: () => navigate(RECAPITI),
              }
            : undefined,
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
        </PnWizardStep>
      </PnWizard>

      <ContactCodeDialog
        value={formik.values.pec}
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open={openCodeModal}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={() => setOpenCodeModal(false)}
      />
    </>
  );
};

export default PecContactWizard;
