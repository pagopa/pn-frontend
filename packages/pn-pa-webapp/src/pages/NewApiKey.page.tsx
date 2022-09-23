import { ChangeEvent, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { useIsMobile, Prompt, PnBreadcrumb } from '@pagopa-pn/pn-commons';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Box,
  Typography,
  TextField,
  Paper,
  Grid,
  Button,
  Select,
  Checkbox,
  MenuItem,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
  InputLabel,
  FormControl,
  Chip,
} from '@mui/material';
import * as routes from '../navigation/routes.const';
import SyncFeedbackApiKey from './components/NewApiKey/SyncFeedbackApiKey';

const useStyles = makeStyles(() => ({
  root: {
    '& .paperContainer': {
      boxShadow: 'none',
    },
  },
}));

const NewApiKey = () => {
  const isMobile = useIsMobile();
  const apiKeyId = '0000002340000011234000000077781546453728'; // mock
  const groups = ['Gruppo 1', 'Gruppo 2', 'Gruppo 3', 'Gruppo 4']; // mock
  const [apiKeySent, setApiKeySent] = useState(false);

  const initialValues = () => ({
    name: '',
    groups: [] as Array<string>,
  });

  const validationSchema = yup.object({
    name: yup.string().required("Definire un nome per l'API Key"),
    groups: yup.array().min(1, 'Selezionare almeno un gruppo'),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    onSubmit: (values) => {
      if (formik.isValid) {
        console.log(values);
        setApiKeySent(true);
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const classes = useStyles();

  const handleGroupClick = async (event: SelectChangeEvent<typeof formik.values.groups>) => {
    formik.handleChange(event);
    await formik.setFieldTouched(event.target.name, true, false);
  };

  const handleUncheckChipClick = async (g: string) => {
    // eslint-disable-next-line functional/immutable-data
    formik.values.groups = formik.values.groups.filter(group => group !== g);
    await formik.setFieldTouched('groups', true, false);
  };

  return (
    <>
      {!apiKeySent && (
        <Prompt
          title="Genera API Key"
          message="Annullare l'operazione?"
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
                  currentLocationLabel="Genera API Key"
                  goBackLabel="indietro"
                />
                <Typography variant="h4" my={3}>
                  Genera una API Key
                </Typography>
                <Box
                  display={isMobile ? 'block' : 'flex'}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="body1" sx={{ marginBottom: 4 }}>
                    Piattaforma Notifiche ha generato il codice della API Key. Ora, inserisci un
                    nome identificativo e assegnala a uno o più gruppi.
                  </Typography>
                </Box>
                <Box>
                  <Typography fontWeight="bold">API Key</Typography>
                  <TextField
                    size="small"
                    id="apiKeyId"
                    value={apiKeyId}
                    name="apiKeyId"
                    fullWidth
                    inputProps={{ readOnly: true }}
                  />
                </Box>
                <Typography sx={{ marginTop: 4 }} variant="body2">
                  * Campi obbligatori
                </Typography>
                <Box>
                  <form onSubmit={formik.handleSubmit}>
                    <Paper sx={{ padding: '24px', marginTop: '40px' }} className="paperContainer">
                      <Typography variant="h5">Altre informazioni</Typography>
                      <Box sx={{ marginTop: '20px' }}>
                        <Typography fontWeight="bold">Dai un nome alla tua API Key*</Typography>
                        <TextField
                          id="name"
                          label="Inserisci un nome"
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
                          Scegli i gruppi a cui assegnare l’API Key*
                        </Typography>
                        <FormControl fullWidth size="small">
                          <InputLabel id="select-label">Cerca un gruppo</InputLabel>
                          <Select
                            multiple
                            value={formik.values.groups}
                            name="groups"
                            id="groups"
                            labelId="select-label"
                            label="Cerca un gruppo"
                            fullWidth
                            size="small"
                            onChange={handleGroupClick}
                            renderValue={() => ''}
                          >
                            {groups.map((g) => (
                              <MenuItem key={g} value={g}>
                                <ListItemIcon>
                                  <Checkbox checked={formik.values.groups.indexOf(g) > -1} />
                                </ListItemIcon>
                                <ListItemText primary={g} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <Box mt={1}>
                          {formik.values.groups.map((g) => (
                            <Chip
                              sx={{ mr: 1 }}
                              key={g}
                              label={g}
                              onDelete={() => handleUncheckChipClick(g)}
                              variant="outlined"
                              deleteIcon={<CancelIcon />}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                    <Box mt={3}>
                      <Button variant="contained" type="submit" disabled={!formik.isValid}>
                        Continua
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Prompt>
      )}

      {apiKeySent && <SyncFeedbackApiKey />}
    </>
  );
};

export default NewApiKey;
