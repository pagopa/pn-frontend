import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Box,
  Button,
  Checkbox,
  Grid,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  PnAutocomplete,
  PnBreadcrumb,
  Prompt,
  SectionHeading,
  TitleBox,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { GroupStatus, UserGroup } from '../models/user';
import * as routes from '../navigation/routes.const';
import { getApiKeyUserGroups, saveNewApiKey } from '../redux/NewApiKey/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import SyncFeedbackApiKey from './components/NewApiKey/SyncFeedbackApiKey';

const NewApiKey = () => {
  const dispatch = useAppDispatch();
  const newApiKey = useAppSelector((state: RootState) => state.newApiKeyState.apiKey);
  const isMobile = useIsMobile();
  const groups = useAppSelector((state: RootState) => state.newApiKeyState.groups);
  const { t } = useTranslation(['apikeys', 'common']);
  const tkp = (key: string) => t(`new-api-key.${key}`);
  const [apiKeySent, setApiKeySent] = useState<boolean>(false);

  const initialValues = () => ({
    name: '',
    groups: [] as Array<UserGroup>,
  });

  const validationSchema = yup.object({
    name: yup.string().required(tkp('form-error-name')),
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
        void dispatch(saveNewApiKey({ ...newApiKeyValues }));
        setApiKeySent(true);
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleGroupClick = async (_event: any, value: Array<UserGroup>) => {
    await formik.setFieldValue('groups', value);
    await formik.setFieldTouched('groups', true, false);
  };

  return (
    <>
      {!apiKeySent && (
        <Prompt
          title={tkp('cancel-title')}
          message={tkp('cancel-prompt')}
          eventTrackingCallbackPromptOpened={() => {}} // impostare eventi tracking previsti
          eventTrackingCallbackCancel={() => {}} // impostare eventi tracking previsti
          eventTrackingCallbackConfirm={() => {}} // impostare eventi tracking previsti
        >
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
                        <PnAutocomplete
                          disableCloseOnSelect
                          multiple
                          noOptionsText={tkp('no-groups')}
                          value={formik.values.groups}
                          options={groups}
                          id="groups"
                          data-testid="groups"
                          getOptionLabel={(option) => option.name}
                          onChange={handleGroupClick}
                          renderOption={(props, option) => (
                            <MenuItem {...props}>
                              <ListItemIcon>
                                <Checkbox
                                  checked={formik.values.groups.indexOf(option as UserGroup) > -1}
                                />
                              </ListItemIcon>
                              <ListItemText primary={option.name} />
                            </MenuItem>
                          )}
                          renderInput={(params) => (
                            <TextField {...params} label={tkp('form-placeholder-groups')} />
                          )}
                          sx={{ mt: '8px' }}
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

      {apiKeySent && newApiKey !== '' && <SyncFeedbackApiKey newApiKeyId={newApiKey} />}
    </>
  );
};

export default NewApiKey;
