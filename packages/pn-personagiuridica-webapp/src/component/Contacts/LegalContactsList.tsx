import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Box, Typography, TextField, Alert } from '@mui/material';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ButtonNaked, IllusEmailValidation } from '@pagopa/mui-italia';
import { dataRegex } from '@pagopa-pn/pn-commons';

import { DigitalAddress, LegalChannelType } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import DigitalContactElem from './DigitalContactElem';
import CancelVerificationModal from "./CancelVerificationModal";

type Props = {
  recipientId: string;
  legalAddresses: Array<DigitalAddress>;
};

const LegalContactsList = ({ recipientId, legalAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalElemRef = useRef<{ editContact: () => void }>({ editContact: () => {} });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const title = useMemo(
    () => (
      <Grid container spacing={1} alignItems="flex-end" direction="row">
        <Grid item xs="auto">
          {t('legal-contacts.subtitle-2', { ns: 'recapiti' })}
        </Grid>
      </Grid>
    ),
    []
  );
  const defaultAddress = useMemo(
    () => legalAddresses.find((a) => a.senderId === 'default' && a.pecValid === true),
    [legalAddresses]
  );

  const verifyingAddress = useMemo(
    () => legalAddresses.find((a) => a.senderId === 'default' && a.pecValid === false),
    [legalAddresses]
  );

  const validationSchema = yup.object({
    pec: yup
      .string()
      .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
      .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' })),
  });

  const initialValues = {
    pec: defaultAddress?.value || '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    /** onSubmit validate */
    onSubmit: () => {},
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleEditConfirm = (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      formik.resetForm({ values: initialValues });
    }
  };

  const handlePecValidationCancel = () => {
    setCancelDialogOpen(true);
  };

  return (
    <>
      <CancelVerificationModal open={cancelDialogOpen} handleClose={() => setCancelDialogOpen(false)} />
      <DigitalContactsCard
        sectionTitle={t('legal-contacts.title', { ns: 'recapiti' })}
        title={title}
        subtitle={t('legal-contacts.description', { ns: 'recapiti' })}
        avatar={<IllusEmailValidation />}
      >
        <Box mt="20px">
          <form onSubmit={(e) => {
            e.preventDefault();
            digitalElemRef.current.editContact();
          }}>
            <Typography mb={1} sx={{ fontWeight: 'bold' }}>
              {t('legal-contacts.pec-added', { ns: 'recapiti' })}
            </Typography>
            <DigitalContactElem
              recipientId={recipientId}
              senderId="default"
              contactType={LegalChannelType.PEC}
              fields={[
                {
                  id: 'value',
                  component: (
                    <TextField
                      id="pec"
                      fullWidth
                      name="pec"
                      label="PEC"
                      variant="outlined"
                      size="small"
                      value={formik.values.pec}
                      onChange={handleChangeTouched}
                      error={formik.touched.pec && Boolean(formik.errors.pec)}
                      helperText={formik.touched.pec && formik.errors.pec}
                    />
                  ),
                  isEditable: true,
                  size: 'auto',
                },
              ]}
              saveDisabled={!formik.isValid}
              removeModalTitle={
                legalAddresses.length > 1
                  ? t('legal-contacts.block-remove-pec-title', { ns: 'recapiti' })
                  : t('legal-contacts.remove-pec-title', { ns: 'recapiti' })
              }
              removeModalBody={
                legalAddresses.length > 1
                  ? t('legal-contacts.block-remove-pec-message', { ns: 'recapiti' })
                  : t('legal-contacts.remove-pec-message', {
                    value: formik.values.pec,
                    ns: 'recapiti',
                  })
              }
              value={formik.values.pec}
              onConfirmClick={handleEditConfirm}
              blockDelete={legalAddresses.length > 1}
              resetModifyValue={() => handleEditConfirm('cancelled')}
              ref={digitalElemRef}
            />
          </form>
        </Box>
        {verifyingAddress &&
          <Box display="flex" flexDirection="row" mt={2.5}>
            <Box display="flex" flexDirection="row" mr={1}>
              <WatchLaterIcon fontSize="small" />
              <Typography fontWeight="bold" variant="body2" ml={1} >
                {t('legal-contacts.validation-in-progress', { ns: 'recapiti' })}
              </Typography>
            </Box>
            <ButtonNaked color="primary" onClick={handlePecValidationCancel}>
              {t('button.annulla')}
            </ButtonNaked>
          </Box>
        }
        <Alert sx={{ mt: 4 }} severity="info">
          <Typography component="span" variant="body1">
            {t('legal-contacts.disclaimer-message', { ns: 'recapiti' })}{' '}
          </Typography>
          {/**
           * Waiting for FAQs
           <Link href={URL_DIGITAL_NOTIFICATIONS} target="_blank" variant="body1">
           {t('legal-contacts.disclaimer-link', { ns: 'recapiti' })}
           </Link>
           * */}
        </Alert>
      </DigitalContactsCard>
    </>
  );
};

export default LegalContactsList;
