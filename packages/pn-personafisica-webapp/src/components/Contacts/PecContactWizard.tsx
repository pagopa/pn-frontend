import { useFormik } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Alert, TextField, Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  ContactSource,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import { RECAPITI } from '../../navigation/routes.const';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
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
  const { defaultSERCQ_SENDAddress } = useAppSelector(contactsSelectors.selectAddresses);
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);
  const [openCodeModal, setOpenCodeModal] = useState(false);
  const { IS_DOD_ENABLED } = getConfiguration();

  const validationSchema = yup.object().shape({
    pec: pecValidationSchema(t),
  });

  const formik = useFormik({
    initialValues: {
      pec: '',
    },
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => {
      const source = externalEvent?.source ?? ContactSource.RECAPITI;
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_START, {
        senderId: 'default',
        source,
      });
      handleCodeVerification();
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_UX_CONVERSION, 'default');
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
          setOpenCodeModal(true);
          return;
        }
        PFEventStrategyFactory.triggerEvent(
          PFEventsType.SEND_ADD_PEC_UX_SUCCESS,
          res.pecValid && !!defaultSERCQ_SENDAddress
        );
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

          <Typography variant="body2" mb={defaultSERCQ_SENDAddress ? { xs: 2, lg: 3 } : 4}>
            {t('legal-contacts.pec-contact-wizard.content-description')}
          </Typography>

          {defaultSERCQ_SENDAddress && (
            <Alert severity="info" sx={{ mb: 3 }} data-testid="sercq-info-alert">
              {t('legal-contacts.pec-contact-wizard.sercq-info-alert')}
            </Alert>
          )}

          <Typography fontSize="18px" fontWeight={600} mb={2}>
            {t('legal-contacts.pec-contact-wizard.input-label')}
          </Typography>

          <TextField
            id="pec"
            name="pec"
            placeholder={t('legal-contacts.pec-contact-wizard.input-placeholder')}
            size="small"
            fullWidth
            sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
            value={formik.values.pec}
            onChange={handleChangeTouched}
            error={formik.touched.pec && Boolean(formik.errors.pec)}
            helperText={formik.touched.pec && formik.errors.pec}
            data-testid="pec-wizard-input"
          />
        </PnWizardStep>
      </PnWizard>

      <ContactCodeDialog
        value={formik.values.pec}
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open={openCodeModal}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={() => setOpenCodeModal(false)}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR)}
      />
    </>
  );
};

export default PecContactWizard;
