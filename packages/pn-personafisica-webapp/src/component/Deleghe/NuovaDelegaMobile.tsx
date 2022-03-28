import { useTranslation } from "react-i18next";
import {
    Box,
    Typography,
    Card,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Button,
    Divider,
    Select,
    MenuItem,
    InputLabel,
    SelectChangeEvent,
    } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormikContext } from 'formik';
import { TitleBox } from "@pagopa-pn/pn-commons";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import DateAdapter from '@mui/lab/AdapterMoment';
import DropDownEntiMenuItem from "./DropDownEnti";
import VerificationCodeComponent from "./VerificationCodeComponent";

const NuovaDelegaMobile = ({ values, setFieldValue, touched, errors }) => {
    const { t } = useTranslation(['deleghe']);
    const navigate = useNavigate();
    const { submitForm } = useFormikContext();

    return (
        <Box sx={{ padding: '30px' }}>
            <TitleBox
                title={t('nuovaDelega.title')}
                subTitle={t('nuovaDelega.subtitle')}
                variantTitle="h3"
                variantSubTitle="body1"
            />
            <Typography sx={{ mt: '1rem', mb: '1rem' }}>
                Campi Obbligatori *
            </Typography>
            <Card sx={{ padding: "24px" }}>
                <Typography sx={{ fontWeight: 'bold' }}>{t('nuovaDelega.form.personType')}</Typography>
                <FormControlLabel
                    value="pf"
                    control={<Radio />}
                    name={'selectPersonaFisicaOrPersonaGiuridica'}
                    label={t('nuovaDelega.form.naturalPerson') as string}
                    checked
                />
                <TextField
                    id="nome"
                    value={values.nome.toString()}
                    onChange={(event) => {
                        setFieldValue('nome', event.currentTarget.value);
                    }}
                    label={t('nuovaDelega.form.firstName')}
                    name="nome"
                    error={touched.nome && Boolean(errors.nome)}
                    helperText={touched.nome && errors.nome}
                    fullWidth
                />
                <TextField
                    sx={{ margin: 'auto', marginTop: '16px' }}
                    id="cognome"
                    value={values.cognome.toString()}
                    onChange={(event) => {
                        setFieldValue('cognome', event.currentTarget.value);
                    }}
                    label={t('nuovaDelega.form.lastName')}
                    name="cognome"
                    error={touched.cognome && Boolean(errors.cognome)}
                    helperText={touched.cognome && errors.cognome}
                    fullWidth
                />
                <FormControlLabel
                    value="pg"
                    control={<Radio />}
                    name={'selectPersonaFisicaOrPersonaGiuridica'}
                    label={t('nuovaDelega.form.legalPerson') as string}
                    disabled
                />
                <TextField
                    sx={{ marginTop: '1rem' }}
                    id="codiceFiscale"
                    value={values.codiceFiscale.toString()}
                    onChange={(event) => {
                        setFieldValue('codiceFiscale', event.currentTarget.value);
                    }}
                    label={t('nuovaDelega.form.fiscalCode')}
                    name="codiceFiscale"
                    error={touched.codiceFiscale && Boolean(errors.codiceFiscale)}
                    helperText={touched.codiceFiscale && errors.codiceFiscale}
                    fullWidth
                />
                <TextField
                    sx={{ marginTop: '1rem' }}
                    id="email"
                    value={values.email.toString()}
                    onChange={(event) => {
                        setFieldValue('email', event.currentTarget.value);
                    }}
                    label={t('nuovaDelega.form.email')}
                    name="email"
                    error={touched.email && Boolean(errors.email)}
                    helperText={touched.email && errors.email}
                    fullWidth
                />
                <Typography fontWeight={'bold'} sx={{ marginTop: '2rem' }}>
                    {t('nuovaDelega.form.viewFrom')}
                </Typography>
                <FormControl sx={{ width: '100%' }}>
                    <RadioGroup
                        aria-labelledby="radio-buttons-group-pf-pg"
                        defaultValue="tuttiGliEnti"
                        name="selectTuttiEntiOrSelezionati"
                        value={values.selectTuttiEntiOrSelezionati.toString()}
                        onChange={(event) => {
                            setFieldValue('selectTuttiEntiOrSelezionati', event.currentTarget.value);
                        }}
                    >
                        <FormControlLabel
                            value="tuttiGliEnti"
                            control={<Radio />}
                            name={t('selectTuttiEntiOrSelezionati')}
                            label={t('nuovaDelega.form.allEntities') as string}
                        />
                        <FormControlLabel
                            sx={{ marginBottom: '1rem' }}
                            value="entiSelezionati"
                            control={<Radio />}
                            name={'selectTuttiEntiOrSelezionati'}
                            label={t('nuovaDelega.form.onlySelected') as string}
                        />
                        {values.selectTuttiEntiOrSelezionati === 'entiSelezionati' ? (
                            <FormControl fullWidth>
                                <InputLabel id="ente-select">{t('Seleziona Enti')}</InputLabel>
                                <Select
                                    sx={{ marginBottom: '1rem' }}
                                    labelId="ente-select"
                                    id="ente-select"
                                    value={values.enteSelect}
                                    label={t('Seleziona Enti')}
                                    onChange={(event: SelectChangeEvent<string>) => {
                                        setFieldValue('enteSelect', event.target.value);
                                    }}
                                >
                                    <MenuItem value={'Bollate'}>
                                        <DropDownEntiMenuItem name="Comune di Bollate" />
                                    </MenuItem>
                                    <MenuItem value={'Rho'}>
                                        <DropDownEntiMenuItem name="Comune di Rho" />
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        ) : (
                            <></>
                        )}

                        <LocalizationProvider dateAdapter={DateAdapter}>
                            <DesktopDatePicker
                                label={t('nuovaDelega.form.endDate')}
                                inputFormat="DD/MM/yyyy"
                                value={values.expirationDate}
                                onChange={(value: Date | null) => {
                                    setFieldValue('expirationDate', value);
                                }}
                                renderInput={(params) => (
                                    <TextField id="endDate" name="endDate" {...params} />
                                )}
                                disablePast={true}
                            />
                        </LocalizationProvider>
                    </RadioGroup>
                </FormControl>
                <Divider sx={{ marginTop: '2rem' }} />
                <Typography fontWeight={'bold'} sx={{ marginTop: '2rem' }}>
                    {t('nuovaDelega.form.verificationCode')}
                </Typography>
                <Typography sx={{ marginTop: '1rem' }}>
                    {t('nuovaDelega.form.verificationCodeDescr')}
                </Typography>
                <Box sx={{ marginTop: '1rem' }}>
                    <VerificationCodeComponent code={values.verificationCode} />
                </Box>
                <Divider sx={{ marginTop: '2rem' }} />
                <Box sx={{ marginTop: '2rem'}}>
                <Button
                    sx={{ margin: 'auto' }}
                    type={'submit'}
                    variant={'contained'}
                    onClick={submitForm}
                >
                    {t('nuovaDelega.form.submit')}
                </Button>
                </Box>
            </Card>
            <Button variant="outlined" sx={{ mt: "1rem", mb: "1rem" }} onClick={() => navigate("/deleghe")}>Indietro</Button>
        </Box>
    );
};

export default NuovaDelegaMobile;