import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Card, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Button, Divider, Grid, Select, MenuItem, InputLabel, SelectChangeEvent,Avatar, Stack } from '@mui/material';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { TitleBox } from '@pagopa-pn/pn-commons';
import DropDownEntiMenuItem from "./components/Deleghe/DropDownEnti";
import ErrorDeleghe from './components/Deleghe/ErrorDeleghe';
const fiscalCode_regex = /^([A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1})$/i;

const validationSchema = yup.object({
    selectPersonaFisicaOrPersonaGiuridica: yup
        .string()
        .required('Email is required'),
    cf: yup
        .string()
        .required('Il Codice Fiscale è obbligatorio').matches(fiscalCode_regex, 'Il codice fiscale inserito non è corretto'),
    email: yup
        .string()
        .required('Email obbligatoria')
        .email('Email non formattata correttamente'),
    nome: yup
        .string()
        .required('Il nome è obbligatorio'),
    cognome: yup
        .string()
        .required('Il cognome è obbligatorio'),
    enteSelect: yup
        .string()
});

const NuovaDelega = () => {

    const { t } = useTranslation(['nuovaDelega']);

    return (
        <>
            <Box>
                <TitleBox title={"Deleghe"} subTitle={"Inserisci i dati della persona fisica o giuridica a cui vuoi delegare la visualizzazione o la gestione delle tue notifiche"}  variantSubTitle = 'p'/>
                <Card sx={{ padding: "30px", width: "80%", mt: 4}}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                        Tipologia di persona *
                    </Typography>
                    <Formik
                        initialValues={{
                            selectPersonaFisicaOrPersonaGiuridica: 'pf',
                            cf: '',
                            email: '',
                            nome: '',
                            cognome: '',
                            selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
                            expirationDate: Date.now(),
                            enteSelect: '',
                            verificationCode: "12345"
                        }}
                        validationSchema={validationSchema}
                        onSubmit={async (values) => {
                            await new Promise((r) => setTimeout(r, 500));
                            alert(JSON.stringify(values, null, 2));
                        }}
                    >
                        {({ values, setFieldValue, touched, errors, dirty, isValid }) => (
                            <Form>
                                <FormControl sx={{ width: "100%" }}>
                                    <RadioGroup
                                        aria-labelledby="radio-buttons-group-pf-pg"
                                        defaultValue="pf"
                                        name="selectPersonaFisicaOrPersonaGiuridica"
                                        value={values.selectPersonaFisicaOrPersonaGiuridica.toString()}
                                        onChange={(event) => {
                                            setFieldValue('selectPersonaFisicaOrPersonaGiuridica', event.currentTarget.value);
                                        }}
                                    >
                                        <Grid container sx={{ width: "100%" }}>
                                            <Grid item xs={3}>
                                                <FormControlLabel value="pf" control={<Radio />} name={"selectPersonaFisicaOrPersonaGiuridica"} label="Persona Fisica" />
                                            </Grid>
                                            <Grid item xs={4} sx={{ margin: "auto" }}>
                                                <TextField
                                                    sx={{ margin: "auto" }}
                                                    id="nome"
                                                    value={values.nome.toString()}
                                                    onChange={(event) => {
                                                        setFieldValue('nome', event.currentTarget.value);
                                                    }}
                                                    label={'Nome'}
                                                    name="cf"
                                                    variant="outlined"
                                                    error={touched.nome && Boolean(errors.nome)}
                                                    helperText={touched.nome && errors.nome}
                                                    fullWidth
                                                />                                        </Grid>
                                            <Grid item xs={4} sx={{ margin: "auto" }}>
                                                <TextField
                                                    sx={{ margin: "auto" }}
                                                    id="cognome"
                                                    value={values.cognome.toString()}
                                                    onChange={(event) => {
                                                        setFieldValue('cognome', event.currentTarget.value);
                                                    }}
                                                    label={'Cognome'}
                                                    name="cognome"
                                                    variant="outlined"
                                                    error={touched.cognome && Boolean(errors.cognome)}
                                                    helperText={touched.cognome && errors.cognome}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                        <FormControlLabel value="pg" control={<Radio />} name={"selectPersonaFisicaOrPersonaGiuridica"} label="Persona Giuridica" disabled />
                                    </RadioGroup>
                                </FormControl>
                                <TextField
                                    sx={{ marginTop: "2rem" }}
                                    id="cf"
                                    value={values.cf.toString()}
                                    onChange={(event) => {
                                        setFieldValue('cf', event.currentTarget.value);
                                    }}
                                    label={'Codice Fiscale'}
                                    name="cf"
                                    variant="outlined"
                                    error={touched.cf && Boolean(errors.cf)}
                                    helperText={touched.cf && errors.cf}
                                    fullWidth
                                />
                                <TextField
                                    sx={{ marginTop: "1rem" }}
                                    id="email"
                                    value={values.email.toString()}
                                    onChange={(event) => {
                                        setFieldValue('email', event.currentTarget.value);
                                    }}
                                    label={'Email'}
                                    name="email"
                                    variant="outlined"
                                    error={touched.email && Boolean(errors.email)}
                                    helperText={touched.email && errors.email}
                                    fullWidth
                                />
                                <Typography sx={{ fontWeight: 'bold', marginTop: "2rem" }}>
                                    Potrà visualizzare le notifiche da parte di*
                                </Typography>
                                <FormControl sx={{ width: "100%" }}>
                                    <RadioGroup
                                        aria-labelledby="radio-buttons-group-pf-pg"
                                        defaultValue="tuttiGliEnti"
                                        name="selectTuttiEntiOrSelezionati"
                                        value={values.selectTuttiEntiOrSelezionati.toString()}
                                        onChange={(event) => {
                                            setFieldValue('selectTuttiEntiOrSelezionati', event.currentTarget.value);
                                        }}
                                    >
                                        <FormControlLabel value="tuttiGliEnti" control={<Radio />} name={"selectTuttiEntiOrSelezionati"} label="Tutti gli enti" />
                                        <Grid container>
                                            <Grid item xs={6}>
                                                <FormControlLabel value="entiSelezionati" control={<Radio />} name={"selectTuttiEntiOrSelezionati"} label="Solo gli enti selezionati" />
                                            </Grid>
                                            <Grid item xs={6} sx={{ margin: 'auto' }}>
                                                {
                                                    values.selectTuttiEntiOrSelezionati === "entiSelezionati" ?
                                                        <FormControl fullWidth>
                                                            <InputLabel id="ente-select">Seleziona Enti</InputLabel>
                                                            <Select
                                                                labelId="ente-select"
                                                                id="ente-select"
                                                                value={values.enteSelect}
                                                                label="Seleziona Enti"
                                                                onChange={(event: SelectChangeEvent<string>) => {
                                                                    console.log(event);
                                                                    setFieldValue('enteSelect', event.target.value);
                                                                }}                                                            >
                                                                <MenuItem value={"Bollate"}>
                                                                    <DropDownEntiMenuItem name="Comune di Bollate"/>
                                                                </MenuItem>
                                                                <MenuItem value={"Rho"}>
                                                                    <DropDownEntiMenuItem name="Comune di Rho"/>
                                                                </MenuItem>
                                                            </Select>
                                                        </FormControl> : <></>
                                                }
                                            </Grid>
                                        </Grid>
                                    </RadioGroup>
                                </FormControl>
                                <br></br>
                                <Box sx={{ marginTop: "1rem" }}>
                                    <LocalizationProvider
                                        dateAdapter={DateAdapter}
                                    >
                                        <DesktopDatePicker
                                            label="Termine Delega"
                                            inputFormat="DD/MM/yyyy"
                                            value={values.expirationDate}
                                            onChange={(value: Date | null) => {
                                                console.log(value);
                                                setFieldValue('expirationDate', value);
                                            }}
                                            renderInput={(params) => <TextField id="endDate" name="endDate" {...params} />}
                                            disablePast={true}
                                        // minDate={startDate ? startDate : undefined}
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <Divider sx={{ marginTop: "1rem" }} />
                                <Typography sx={{ fontWeight: 'bold', marginTop: "1rem" }}>Codice di verifica</Typography>
                                <Grid container>
                                    <Grid item xs={8}>
                                        <Typography sx={{ marginTop: "1rem" }}>Condividi questo codice con la persona delegata : dovrà inserirlo <br></br> al primo accesso a Piattaforma Notifiche.</Typography>
                                    </Grid>
                                    <Grid item xs={4} sx={{ margin: 'auto' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                                            {
                                                values.verificationCode.split('').map((codeNumber) => (
                                                    <Box key={codeNumber} sx={{ display: 'flex', borderRadius: "4px", borderColor: '#0173E5', width: "2.5rem", height: "4rem", borderWidth: "2px", borderStyle: 'solid', justifyContent: 'center', alignItems: 'center', textAlign: 'center', marginRight: "8px" }}>
                                                        <Typography sx={{ color: "#0173E5", fontWeight: 600 }}>{codeNumber}</Typography>
                                                    </Box>
                                                )
                                                )
                                            }
                                        </Box>
                                    </Grid>
                                </Grid>
                                <Divider sx={{ marginTop: "1rem" }} />
                                <Grid container sx={{marginTop: "1rem"}}>
                                    <Grid item xs={4} sx={{ margin: 'auto' }}>
                                        <Button sx={{ marginTop: "1rem", margin: 'auto' }} type={"submit"} variant={"contained"} >Invia la richiesta</Button>
                                    </Grid>
                                    <Grid item xs={8} sx={{ margin: 'auto' }}>
                                        <Stack direction="row" alignItems="center" justifyContent="end">
                                        <ErrorDeleghe/>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Box>
        </>
    );
};

export default NuovaDelega;
