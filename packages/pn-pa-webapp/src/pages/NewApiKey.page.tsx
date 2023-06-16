import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import {
  useIsMobile,
  Prompt,
  PnBreadcrumb,
  TitleBox,
  PnAutocomplete,
  SectionHeading,
} from '@pagopa-pn/pn-commons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import * as routes from '../navigation/routes.const';
import { RootState } from '../redux/store';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getApiKeyUserGroups, saveNewApiKey } from '../redux/NewApiKey/actions';
import { GroupStatus, UserGroup } from '../models/user';
import SyncFeedbackApiKey from './components/NewApiKey/SyncFeedbackApiKey';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const SubTitle = () => {
  const { t } = useTranslation(['apikeys'], { keyPrefix: 'new-api-key' });
  return <Fragment>{t('page-description')}</Fragment>;
};

const NewApiKey = () => {
  const dispatch = useAppDispatch();
  const newApiKey = useAppSelector((state: RootState) => state.newApiKeyState.apiKey);
  const isMobile = useIsMobile();
  const groups = useAppSelector((state: RootState) => state.newApiKeyState.groups);
  const { t } = useTranslation(['apikeys'], { keyPrefix: 'new-api-key' });
  const { t: tc } = useTranslation(['common']);
  const [apiKeySent, setApiKeySent] = useState<boolean>(false);

  const initialValues = () => ({
    name: '',
    groups: [] as Array<UserGroup>,
  });

  const validationSchema = yup.object({
    name: yup.string().required(t('form-error-name')),
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

  const classes = useStyles();

  const handleGroupClick = async (_event: any, value: Array<UserGroup>) => {
    await formik.setFieldValue('groups', value);
    await formik.setFieldTouched('groups', true, false);
  };

  return (
    <>
      {!apiKeySent && (
        <Prompt
          title={t('cancel-title')}
          message={t('cancel-prompt')}
          eventTrackingCallbackPromptOpened={() => {}} // impostare eventi tracking previsti
          eventTrackingCallbackCancel={() => {}} // impostare eventi tracking previsti
          eventTrackingCallbackConfirm={() => {}} // impostare eventi tracking previsti
        >
          <Box p={3}>
            <Grid container className={classes.root} sx={{ padding: isMobile ? '0 20px' : 0 }}>
              <Grid item xs={12} lg={8}>
                <PnBreadcrumb
                  linkRoute={routes.API_KEYS}
                  linkLabel={t('page-title')}
                  currentLocationLabel={t('page-title')}
                  goBackLabel={tc('button.indietro')}
                />
                <TitleBox
                  variantTitle="h4"
                  title={t('page-title')}
                  sx={{ pt: '20px', marginBottom: 4 }}
                  subTitle={<SubTitle />}
                  variantSubTitle="body1"
                ></TitleBox>
                <form onSubmit={formik.handleSubmit}>
                  <Typography sx={{ marginTop: 4 }} variant="body2">
                    * {t('required-fields')}
                  </Typography>
                  <Box>
                    <Paper sx={{ padding: '24px', marginTop: '40px' }} className="paperContainer">
                      <SectionHeading>{t('other-info')}</SectionHeading>
                      <Box sx={{ marginTop: '24px' }}>
                        <Typography fontWeight="bold">{t('form-label-name')}*</Typography>
                        <TextField
                          id="name"
                          label={t('form-placeholder-name')}
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
                        <Typography fontWeight="bold">{t('form-label-groups')}</Typography>
                        <PnAutocomplete
                          disableCloseOnSelect
                          multiple
                          noOptionsText={t('no-groups')}
                          value={formik.values.groups}
                          options={groups}
                          id="groups"
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
                            <TextField {...params} label={t('form-placeholder-groups')} />
                          )}
                          sx={{ mt: '8px' }}
                        />
                      </Box>
                    </Paper>
                    <Box mt={3}>
                      <Button variant="contained" type="submit" disabled={!formik.isValid}>
                        {t('continue-button')}
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
