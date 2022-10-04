import { ChangeEvent, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useIsMobile, Prompt, PnBreadcrumb } from '@pagopa-pn/pn-commons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Box,
  Typography,
  TextField,
  Autocomplete,
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
import { getUserGroups, saveNewApiKey } from '../redux/NewApiKey/actions';
import SyncFeedbackApiKey from './components/NewApiKey/SyncFeedbackApiKey';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const NewApiKey = () => {
  const dispatch = useAppDispatch();
  const newApiKey = useAppSelector((state: RootState) => state.newApiKeyState.apiKey);
  const isMobile = useIsMobile();
  const groups = useAppSelector((state: RootState) => state.newApiKeyState.groups);
  const { t } = useTranslation(['apikeys'], { keyPrefix: 'new-api-key' });
  const { t: tc} = useTranslation(['common']);
  const [apiKeySent, setApiKeySent] = useState<boolean>(false);

  const initialValues = () => ({
    name: '',
    groups: [] as Array<string>,
  });

  const validationSchema = yup.object({
    name: yup.string().required(t('form-error-name')),
    groups: yup.array(),
  });

  useEffect(() => {
    if (groups.length === 0) {
      void dispatch(getUserGroups());
    }
  }, []);
  
  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    onSubmit: (values) => {
      if (formik.isValid) {
        /*
          Integrare logica di success / failure ed eventuale callback relativa.
          Il setState setApiKeySent(true) mostra la schermata di avvenuto successo.
        */

        void dispatch(saveNewApiKey({ ...values }));
        setApiKeySent(true);
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const classes = useStyles();

  const handleGroupClick = async (_event: any, value: Array<string>) => {
    await formik.setFieldValue('groups', value);
    await formik.setFieldTouched('groups', true, false);
  };

  return (
    <>
      {!apiKeySent && (
        <Prompt
          title={t('page-title')}
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
                  linkLabel="API Keys"
                  currentLocationLabel={t('page-title')}
                  goBackLabel={tc('button.indietro')}
                />
                <Typography variant="h4" my={3}>
                  {t('page-title')}
                </Typography>
                <Box
                  display={isMobile ? 'block' : 'flex'}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" sx={{ marginBottom: 4 }}>
                  {t('page-description')}
                  </Typography>
                </Box>
                <form onSubmit={formik.handleSubmit}>
                  <Typography sx={{ marginTop: 4 }} variant="body2">
                    * {t('required-fields')}
                  </Typography>
                  <Box>
                    <Paper sx={{ padding: '24px', marginTop: '40px' }} className="paperContainer">
                      <Typography variant="h5">Altre informazioni</Typography>
                      <Box sx={{ marginTop: '20px' }}>
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
                          sx={{ mb: 3 }}
                        />
                        <Typography fontWeight="bold" mb={2}>
                          {t('form-label-groups')}*
                        </Typography>
                        <Autocomplete
                          disableCloseOnSelect
                          multiple
                          noOptionsText={t('no-groups')}
                          value={formik.values.groups}
                          options={groups.map((g) => g.name)}
                          id="groups"
                          getOptionLabel={(option) => option}
                          isOptionEqualToValue={(option: any, value: any) => option === value}
                          onChange={handleGroupClick}
                          renderOption={(props, option) => (
                            <MenuItem {...props}>
                              <ListItemIcon>
                                <Checkbox checked={formik.values.groups.indexOf(option) > -1} />
                              </ListItemIcon>
                              <ListItemText primary={option} />
                            </MenuItem>
                          )}
                          renderInput={(params) => (
                            <TextField {...params} label={t('form-placeholder-groups')} />
                          )}
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

      {(apiKeySent && newApiKey !== '') && <SyncFeedbackApiKey newApiKeyId={newApiKey} />}
    </>
  );
};

export default NewApiKey;
