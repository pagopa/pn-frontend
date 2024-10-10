import { useFormik } from 'formik';
import { ChangeEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { Box, Link, TextField, Typography } from '@mui/material';
import {
  formatDate,
  today,
} from '@pagopa-pn/pn-commons';

import { BffPublicKeyRequest } from '../../../generated-client/pg-apikeys';
import * as routes from '../../../navigation/routes.const';
import NewPublicKeyCard from './NewPublicKeyCard';

const nameMaxLen = 254;
const nameAllowedChars = 'a-zA-Z0-9-\\';

const validateName = (name: string | undefined): boolean => {
  const pattern = /^[a-zA-Z0-9-\\s]+$/i;
  return pattern.test(name ?? '');
};

type Props = {
  onConfirm: (publicKey: BffPublicKeyRequest) => void;
  duplicateKey: (publicKey: string | undefined) => boolean;
};

const PublicKeyDataInsert: React.FC<Props> = ({ onConfirm, duplicateKey }) => {
  const { t } = useTranslation(['integrazioneApi', 'common']);
  const navigate = useNavigate();

  const redirectToSLink = () => window.open(routes.TERMS_OF_SERVICE_B2B, "_blank");
  const redirectApiKeyLink = () => navigate(routes.INTEGRAZIONE_API);

  const initialValues = {
    name: `${t('new-public-key.steps.insert-data.name.default')}${formatDate(
      today.toISOString(),
      false,
      ''
    )}`,
    publicKey: '',
  };

  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required(t('required-field', { ns: 'common' }))
      .max(nameMaxLen, t('too-long-field-error', { ns: 'common', maxLength: 254 }))
      .test(
        'name',
        t('messages.error.name-allowed-charset', { allowedCharset: nameAllowedChars }),
        validateName
      ),
    publicKey: yup
      .string()
      .required(t('required-field', { ns: 'common' }))
      .test('publicKey', t('messages.error.key-already-registered'), duplicateKey),
  });

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      onConfirm(values);
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  return (
    <NewPublicKeyCard
      isContinueDisabled={!formik.isValid}
      title={t('new-public-key.steps.insert-data.title')}
      previousStepLabel={t('button.indietro', { ns: 'common' })}
      onBackClick={redirectApiKeyLink}
      onContinueClick={formik.submitForm}
      submitLabel={t('new-public-key.button.register')}
      content={
        <Typography component={Box} mt={2} mb={3} data-testid="content" variant="body2" sx={{ fontSize: '14px' }}>
          <Trans i18nKey="new-public-key.steps.insert-data.content" ns="integrazioneApi" />
        </Typography>
      }
    >
      <form onSubmit={formik.handleSubmit} data-testid="publicKeyDataInsertForm">
        <Box border="1px solid #E3E7EB" borderRadius="4px" px={2} py={3} mb={3}>
          <Typography mb={2} fontWeight="bold" data-testid="content" variant="body2">
            {t('new-public-key.steps.insert-data.name.description')}
          </Typography>
          <TextField
            id="name"
            label={t('new-public-key.steps.insert-data.name.label')}
            fullWidth
            name="name"
            value={formik.values.name}
            onChange={handleChangeTouched}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            size="medium"
            sx={{ mt: 1 }}
          />
        </Box>
        <Box border="1px solid #E3E7EB" borderRadius="4px" px={2} py={3} mb={3}>
          <Typography mb={2} fontWeight="bold" data-testid="content" variant="body2">
            {t('new-public-key.steps.insert-data.publicKey.description')}
          </Typography>
          <Typography mb={2} data-testid="content" variant="body2">
            {t('new-public-key.steps.insert-data.publicKey.begin')}
          </Typography>
          <TextField
            multiline
            rows={2}
            id="publicKey"
            fullWidth
            placeholder={t('new-public-key.steps.insert-data.publicKey.placeholder')}
            name="publicKey"
            value={formik.values.publicKey}
            onChange={handleChangeTouched}
            error={formik.touched.publicKey && Boolean(formik.errors.publicKey)}
            helperText={formik.touched.publicKey && formik.errors.publicKey}
            size="medium"
          />
          <Typography mt={2} data-testid="content" variant="body2">
            {t('new-public-key.steps.insert-data.publicKey.end')}
          </Typography>
        </Box>

        <Typography component={Box} mt={3} sx={{ fontSize: '14px' }}>
          <Trans
            i18nKey="new-public-key.steps.insert-data.tos"
            ns="integrazioneApi"
            components={[
              <Link
                key="tos-link"
                sx={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none !important' }}
                onClick={(redirectToSLink)}
                data-testid="tos-link"
              />
            ]}
          />
        </Typography>
      </form>
    </NewPublicKeyCard>
  );
};

export default PublicKeyDataInsert;
