import { useFormik } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { TextField, Typography } from '@mui/material';
import { PnWizard, PnWizardStep } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import { pecValidationSchema } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';

interface Props {
  setShowPecWizard: (showPecWizard: boolean) => void;
}

const PecContactWizard: React.FC<Props> = ({ setShowPecWizard }) => {
  const { t } = useTranslation(['recapiti', 'common']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openCodeModal, setOpenCodeModal] = useState(false);

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
        // open code modal
        if (!res) {
          setOpenCodeModal(true);
          return;
        }
        setOpenCodeModal(false);
        navigate(-1);
      })
      .catch(() => {});
  };

  return (
    <>
      <PnWizard
        title={
          <Typography fontSize="28px" fontWeight={700} data-testid="pec-wizard-title">
            {t('legal-contacts.pec-contact-wizard.title')}
          </Typography>
        }
        activeStep={0}
        setActiveStep={() => null}
        slots={{
          prevButton: () => (
            <ButtonNaked
              onClick={() => setShowPecWizard(false)}
              color="primary"
              size="medium"
              data-testid="prev-button"
              sx={{ mt: { xs: 2, lg: 0 } }}
            >
              {t('button.annulla', { ns: 'common' })}
            </ButtonNaked>
          ),
        }}
        slotsProps={{
          nextButton: {
            onClick: () => formik.submitForm(),
          },
        }}
      >
        <PnWizardStep>
          <Typography fontSize="22px" fontWeight={700} mb={{ xs: 2, lg: 3 }}>
            {t('legal-contacts.pec-contact-wizard.content-title')}
          </Typography>

          <Typography variant="body2" mb={3}>
            {t('legal-contacts.pec-contact-wizard.content-description')}
          </Typography>

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
      />
    </>
  );
};

export default PecContactWizard;
