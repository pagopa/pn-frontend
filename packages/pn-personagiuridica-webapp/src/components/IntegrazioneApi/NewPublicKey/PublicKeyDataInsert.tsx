
import { ChangeEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import * as yup from 'yup';
import { useFormik } from 'formik';

import { formatDate, PRIVACY_LINK_RELATIVE_PATH, today, TOS_LINK_RELATIVE_PATH } from '@pagopa-pn/pn-commons';
import { Link, TextField, Typography } from '@mui/material';

import { NewPublicApiKeyRequest } from "../../../models/ApiKeys";
import * as routes from '../../../navigation/routes.const';
import NewPublicKeyCard from './NewPublicKeyCard';

type Props = {
    onConfirm: (publicKey: NewPublicApiKeyRequest) => void;
};

const PublicKeyDataInsert: React.FC<Props> = ({onConfirm}) => {
    const { t } = useTranslation(['integrazioneApi', 'common']);
    const { t: tc } = useTranslation(['common']);
    const navigate = useNavigate();

    const redirectPrivacyLink = () => navigate(`${PRIVACY_LINK_RELATIVE_PATH}`);
    const redirectToSLink = () => navigate(`${TOS_LINK_RELATIVE_PATH}`);
    const redirectApiKeyLink = () => navigate(routes.INTEGRAZIONE_API);

    // Remove useCallback and move above the component
    const initialValues = useCallback(
      () => ({
        name: `${t('new-public-key.steps.insert-data.name.default')}${formatDate(today, false, "")}`,// '',
        publicKey: '',
        exponent: undefined,
        algoritm: undefined
      }),
      []
    );

    const validationSchema = yup.object().shape({
        name: yup
            .string()
            .required("Campo obbligatorio"),
        publicKey: yup
            .string()
            .required("Campo obbligatorio")
            // .matches()
    });

    const formik = useFormik({
      initialValues: initialValues(),
      validateOnMount: true,
      validationSchema,
      enableReinitialize: true,
      /** onSubmit validate */
      onSubmit: (values) => {
        if (formik.isValid) {
            onConfirm(values);
        }
      },
    });

    const handleChangeTouched = async (e: ChangeEvent) => {
      formik.handleChange(e);
      await formik.setFieldTouched(e.target.id, true, false);
    };

    return (
        <form onSubmit={formik.handleSubmit} data-testid="publicKeyDataInsertForm">
            <NewPublicKeyCard
                isContinueDisabled={!formik.isValid}
                title={t('new-public-key.steps.insert-data.title')}
                previousStepLabel={tc('button.indietro')}
                previousStepOnClick={redirectApiKeyLink}
                submitLabel={t('new-public-key.button.register')}
                content={
                    <Typography marginTop={3} marginBottom={6} data-testid="content" variant="body2">
                        {t('new-public-key.steps.insert-data.content_1')}
                        <strong>{t('new-public-key.steps.insert-data.content_2')}</strong>
                        &nbsp;{t('new-public-key.steps.insert-data.content_3')}
                    </Typography>
                }
            >
                <Typography marginTop={3} fontWeight="bold" data-testid="content" variant="body1">
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
                    size="small"
                    margin="normal"
                />
                <Typography marginTop={9} fontWeight="bold" data-testid="content" variant="body1">
                    {t('new-public-key.steps.insert-data.publicKey.description')}
                </Typography>
                <Typography marginTop={3} data-testid="content" variant="body1">
                    {t('new-public-key.steps.insert-data.publicKey.begin')}
                </Typography>
                <TextField
                    multiline
                    rows={2}
                    // maxRows={2}
                    id="publicKey"
                    label={''}
                    fullWidth
                    placeholder={t('new-public-key.steps.insert-data.publicKey.placeholder')}
                    name="publicKey"
                    value={formik.values.publicKey}
                    onChange={handleChangeTouched}
                    error={formik.touched.publicKey && Boolean(formik.errors.publicKey)}
                    helperText={formik.touched.publicKey && formik.errors.publicKey}
                    size="small"
                    margin="normal"
                />
                <Typography marginTop={2} marginBottom={3} data-testid="content" variant="body1">
                    {t('new-public-key.steps.insert-data.publicKey.end')}
                </Typography>

                <Typography marginTop={3} >
                {t('new-public-key.steps.insert-data.tos_privacy_1')}
                <Link
                    key="tos-link"
                    sx={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none !important' }}
                    onClick={redirectToSLink}
                    data-testid="tos-link"
                >
                        {t('new-public-key.steps.insert-data.tos_privacy_2')}
                </Link>
                {t('new-public-key.steps.insert-data.tos_privacy_3')}
                <Link
                    key="privacy-link"
                    sx={{ cursor: 'pointer', fontWeight: 'bold', textDecoration: 'none !important' }}
                    onClick={redirectPrivacyLink}
                    data-testid="privacy-link"
                >
                    {t('new-public-key.steps.insert-data.tos_privacy_4')}
                </Link>
            </Typography>
            </NewPublicKeyCard>
        </form>
    );
};

export default PublicKeyDataInsert;