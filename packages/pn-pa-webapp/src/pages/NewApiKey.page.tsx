import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import {
  PnBreadcrumb,
  Prompt,
  SectionHeading,
  TitleBox,
  dataRegex,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Autocomplete } from '@pagopa/mui-italia';

import SyncFeedbackApiKey from '../components/NewApiKey/SyncFeedbackApiKey';
import { GroupStatus, UserGroup } from '../models/user';
import * as routes from '../navigation/routes.const';
import { getApiKeyUserGroups, newApiKey } from '../redux/apiKeys/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const NewApiKey = () => {
  const dispatch = useAppDispatch();
  const apiKey = useAppSelector((state: RootState) => state.apiKeysState.apiKey);
  const isMobile = useIsMobile();
  const groups = useAppSelector((state: RootState) => state.apiKeysState.groups);
  const { t } = useTranslation(['apikeys', 'common']);
  const tkp = (key: string) => t(`new-api-key.${key}`);
  const [apiKeySent, setApiKeySent] = useState<boolean>(false);

  const initialValues = () => ({
    name: '',
    groups: [] as Array<UserGroup>,
  });

  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(dataRegex.noSpaceAtEdges, t('no-spaces-at-edges', { ns: 'common' }))
      .required(tkp('form-error-name')),
    groups: yup.array().of(
      yup.object({
        id: yup.string(),
        name: yup.string(),
        description: yup.string(),
        status: yup.string(),
      })
    ),
  });

  useEffect(() => {
    void dispatch(getApiKeyUserGroups(GroupStatus.ACTIVE));
  }, []);

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    onSubmit: (values) => {
      const newApiKeyValues = {
        name: values.name,
        groups: values.groups.map((e) => e.id),
      };
      if (formik.isValid) {
        void dispatch(newApiKey({ ...newApiKeyValues }))
          .unwrap()
          .then(() => setApiKeySent(true));
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleGroupClick = async (value: Array<UserGroup>) => {
    await formik.setFieldValue('groups', value);
    await formik.setFieldTouched('groups', true, false);
  };

  return (
    <>
      {!apiKeySent && (
        <Prompt title={tkp('cancel-title')} message={tkp('cancel-prompt')}>
          <Box p={3}>
            <Grid container sx={{ padding: isMobile ? '0 20px' : 0 }}>
              <Grid item xs={12} lg={8}>
                <PnBreadcrumb
                  linkRoute={routes.API_KEYS}
                  linkLabel={t('title')}
                  currentLocationLabel={tkp('page-title')}
                  goBackLabel={t('button.indietro', { ns: 'common' })}
                />
                <TitleBox
                  variantTitle="h4"
                  title={tkp('page-title')}
                  sx={{ pt: '20px', marginBottom: 4 }}
                  subTitle={tkp('page-description')}
                  variantSubTitle="body1"
                ></TitleBox>
                <form onSubmit={formik.handleSubmit} data-testid="new-api-key-form">
                  <Typography sx={{ marginTop: 4 }} variant="body2">
                    * {tkp('required-fields')}
                  </Typography>
                  <Box>
                    <Paper sx={{ padding: '24px', marginTop: '40px' }} elevation={0}>
                      <SectionHeading>{tkp('other-info')}</SectionHeading>
                      <Box sx={{ marginTop: '24px' }}>
                        <Typography fontWeight="bold">{tkp('form-label-name')}*</Typography>
                        <TextField
                          id="name"
                          label={tkp('form-placeholder-name')}
                          fullWidth
                          name="name"
                          value={formik.values.name}
                          onChange={handleChangeTouched}
                          error={formik.touched.name && Boolean(formik.errors.name)}
                          helperText={formik.touched.name && formik.errors.name}
                          size="small"
                          margin="normal"
                          sx={{ mb: '24px', mt: '8px' }}
                        />
                        <Typography fontWeight="bold">{tkp('form-label-groups')}</Typography>
                        <Autocomplete
                          id="groups"
                          multiple
                          value={formik.values.groups}
                          options={groups}
                          data-testid="groups"
                          getOptionLabel={(option) => option.name}
                          onChange={handleGroupClick}
                          noResultsText={tkp('no-groups')}
                          sx={{ mt: '8px' }}
                          label={tkp('form-placeholder-groups')}
                        />
                      </Box>
                    </Paper>
                    <Box mt={3}>
                      <Button
                        data-testid="submit-new-api-key"
                        id="continue-button"
                        variant="contained"
                        type="submit"
                        disabled={!formik.isValid}
                      >
                        {tkp('continue-button')}
                      </Button>
                    </Box>
                  </Box>
                </form>
              </Grid>
            </Grid>
          </Box>
        </Prompt>
      )}

      {apiKeySent && apiKey.apiKey !== '' && <SyncFeedbackApiKey newApiKey={apiKey.apiKey} />}
    </>
  );
};

export default NewApiKey;
