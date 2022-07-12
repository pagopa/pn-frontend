import { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { IllusEmailValidation } from '@pagopa/mui-italia';
import { Grid, Box, Typography, TextField } from '@mui/material';

import { DigitalAddress, LegalChannelType } from '../../models/contacts';
import DigitalContactsCard from './DigitalContactsCard';
import DigitalContactElem from './DigitalContactElem';

type Props = {
  recipientId: string;
  legalAddresses: Array<DigitalAddress>;
};

const LegalContactsList = ({ recipientId, legalAddresses }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);


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
    () => legalAddresses.find((a) => a.senderId === 'default'),
    [legalAddresses]
  );

  const validationSchema = yup.object({
    pec: yup
      .string()
      .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
      .email(t('legal-contacts.valid-pec', { ns: 'recapiti' })),
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

  return (
    <DigitalContactsCard
      sectionTitle={t('legal-contacts.title', { ns: 'recapiti' })}
      title={title}
      subtitle={t('legal-contacts.description-2', { ns: 'recapiti' }) + t('legal-contacts.link-aar', { ns: 'recapiti' })}
      avatar={<IllusEmailValidation />}
    >
      <Box sx={{ marginTop: '20px' }}>
        <form>
          <DigitalContactElem
            recipientId={recipientId}
            senderId="default"
            // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
            contactType={LegalChannelType.PEC}
            fields={[
              {
                id: 'label',
                component: (
                  <Typography>{t('legal-contacts.pec-added', { ns: 'recapiti' })}</Typography>
                ),
                size: 'variable',
              },
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
            removeModalTitle={t('legal-contacts.remove-pec-title', { ns: 'recapiti' })}
            removeModalBody={t('legal-contacts.remove-pec-message', {
              value: formik.values.pec,
              ns: 'recapiti',
            })}
            value={formik.values.pec}
            onConfirmClick={handleEditConfirm}
          />
        </form>
      </Box>
    </DigitalContactsCard>
  );
};

export default LegalContactsList;
