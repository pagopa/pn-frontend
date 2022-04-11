import { Close } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, IconButton, TextField, Typography } from '@mui/material';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';
import { CourtesyChannelType } from '../../models/contacts';
import { createOrUpdateCourtesyAddress, deleteCourtesyAddress } from '../../redux/contact/actions';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';
import { useAppDispatch } from '../../redux/hooks';

export enum CourtesyFieldType {
  EMAIL = 'email',
  PHONE = 'phone',
}

enum CourtesyMode {
  NEW = 'NEW',
  EDIT = 'EDIT',
  SHOW = 'SHOW'
};

interface Props {
  recipientId: string;
  type: CourtesyFieldType;
  value: string;
}

const CourtesyContactItem: React.FC<Props> = ({ recipientId, type, value }) => {
  const dispatch = useAppDispatch();
  const isMobile = useIsMobile();
  const { t } = useTranslation(['common', 'recapiti']);

  const digitalDomicileType = type === CourtesyFieldType.EMAIL ? CourtesyChannelType.EMAIL : CourtesyChannelType.SMS;
  const { setProps, handleCodeVerification } = useDigitalContactsCodeVerificationContext();
  const [mode, setMode] = useState<CourtesyMode>(value === '' ? CourtesyMode.NEW : CourtesyMode.SHOW);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const emailValidationSchema = yup.object().shape({
    field: yup
      .string()
      .email(t('courtesy-contacts.valid-email', { ns: 'recapiti' }))
      .required(t('courtesy-contacts.valid-email', { ns: 'recapiti' })),
  });

  const phoneValidationSchema = yup.object().shape({
    field: yup
      .string()
      .required(t('courtesy-contacts.valid-phone', { ns: 'recapiti' }))
      .matches(/^\d{9,10}$/, t('courtesy-contacts.valid-phone', { ns: 'recapiti' })),
  });

  const formik = useFormik({
    initialValues: {
      field: value,
    },
    validationSchema:
      type === CourtesyFieldType.EMAIL ? emailValidationSchema : phoneValidationSchema,
    onSubmit: () => {},
  });

  useEffect(() => {
    void formik.validateForm();
  }, []);

  const enteredValueChanged = () => value !== formik.values.field;

  const saveDataHandler = () => {
    if (formik.isValid) {
      if(mode === CourtesyMode.EDIT && !enteredValueChanged()) {
        setMode(CourtesyMode.SHOW);
      } else {
        handleAssociation();
      }
    }
  };

  const handleChangeTouched = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    void formik.setFieldTouched(event.target.id, true, false);
    formik.handleChange(event);
  };

  const handleAssociation = () => {
    setProps({
      title: t(`courtesy-contacts.${type}-verify`, { ns: 'recapiti' }) + ` ${formik.values.field}`,
      subtitle: <Trans i18nKey={`courtesy-contacts.${type}-verify-descr`} ns="recapiti" />,
      initialValues: new Array(5).fill(''),
      codeSectionTitle: t(`courtesy-contacts.insert-code`, { ns: 'recapiti' }),
      codeSectionAdditional: (
        <Box>
          <Typography variant="body2" display="inline">
            {t(`courtesy-contacts.${type}-new-code`, { ns: 'recapiti' })}&nbsp;
          </Typography>
          <Typography
            variant="body2"
            display="inline"
            color="primary"
            onClick={() => handleCodeVerification(undefined, true)}
            sx={{ cursor: 'pointer' }}
          >
            {t(`courtesy-contacts.new-code-link`, { ns: 'recapiti' })}.
          </Typography>
        </Box>
      ),
      cancelLabel: t('button.annulla'),
      confirmLabel: t('button.conferma'),
      errorMessage: t(`courtesy-contacts.wrong-code`, { ns: 'recapiti' }),
      recipientId,
      senderId: 'default',
      digitalDomicileType,
      value: formik.values.field,
      successMessage: t(`courtesy-contacts.${type}-added-successfully`, { ns: 'recapiti' }),
      actionToBeDispatched: createOrUpdateCourtesyAddress,
    });
  };

  const handleDiscardChanges = () => {
    setIsConfirmationModalVisible(false);
    setMode(CourtesyMode.SHOW);
  };

  const clickEditHandler = () => {
    setMode(CourtesyMode.EDIT);
  };

  const clickDeleteHandler = () => {
    // 2 DO
    setIsConfirmationModalVisible(true);
  };

  const handleRemoveContact = () => {
    void dispatch(deleteCourtesyAddress({recipientId, senderId: 'default', channelType: type === CourtesyFieldType.EMAIL ? CourtesyChannelType.EMAIL : CourtesyChannelType.SMS}));
  };

  const getMobileVersion = () => {
    // show mode
    if(mode === CourtesyMode.SHOW) {
      return (
        <Fragment>
          <Grid item lg={7} xs={8}>
            <Typography variant="body2" display="inline">
              {value}&nbsp;
            </Typography>
          </Grid>
          <Grid item lg={5} xs={12}>
            <ButtonNaked color="primary" sx={{ marginRight: '10px' }} onClick={clickDeleteHandler}>
              {t('button.rimuovi')}
            </ButtonNaked>
            <ButtonNaked color="primary" onClick={clickEditHandler} >{t('button.modifica')}</ButtonNaked>
          </Grid>
        </Fragment>
      );
    } else {
    // edit mode
      return(
        <Fragment>
          <Grid item lg={7} xs={12}>
            <TextField
              id="field"
              name="field"
              value={formik.values.field}
              onChange={handleChangeTouched}
              error={formik.touched.field && Boolean(formik.errors.field)}
              helperText={formik.touched.field && formik.errors.field}
              inputProps={{ sx: { height: '12px' } }}
              placeholder={t(`courtesy-contacts.link-${type}-placeholder`, {
                ns: 'recapiti',
              })}
              fullWidth
            />
          </Grid>
          <Grid item lg={5} xs={12} alignItems="right">
            {mode === CourtesyMode.NEW ?
              <Button variant="outlined" onClick={saveDataHandler} disabled={!formik.isValid} fullWidth>
                {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })}
              </Button>
            :
              <Fragment>
                <ButtonNaked color="primary" sx={{ marginRight: '10px' }} onClick={clickDeleteHandler} >
                  {t('button.rimuovi')}
                </ButtonNaked>
                <ButtonNaked color="primary" onClick={saveDataHandler} disabled={!formik.isValid} >{t('button.salva')}</ButtonNaked>
              </Fragment>
            }
          </Grid>
        </Fragment>
      );
    }
  };

  const getDeskstopVersion = () => {
    // show mode
    const fieldWidth: number = mode === CourtesyMode.EDIT ? 6 : 7; 
    if(mode === CourtesyMode.SHOW) {
      return (
        <Fragment>
          <Grid item lg={7} xs={8}>
            <IconButton aria-label="Elimina" onClick={clickDeleteHandler} >
              <Close />
            </IconButton>
            <Typography variant="body2" display="inline"  sx={{ marginLeft: '1rem' }}>
              {value}&nbsp;
            </Typography>
          </Grid>
          <Grid item lg={5} xs={12}>
            <Button color="primary" onClick={clickEditHandler} fullWidth>
              {t('button.modifica')}
            </Button>
          </Grid>
        </Fragment>
      );
    } else {
    // edit mode
      return(
        <Fragment>
          {mode === CourtesyMode.EDIT &&
          <Grid item lg={1} xs={12}>
            <IconButton aria-label="Elimina" onClick={clickDeleteHandler} >
              <Close />
            </IconButton>
          </Grid>
          }
          <Grid item lg={fieldWidth} xs={12}>
            <TextField
              id="field"
              name="field"
              value={formik.values.field}
              onChange={handleChangeTouched}
              error={formik.touched.field && Boolean(formik.errors.field)}
              helperText={formik.touched.field && formik.errors.field}
              inputProps={{ sx: { height: '12px' } }}
              placeholder={t(`courtesy-contacts.link-${type}-placeholder`, {
                ns: 'recapiti',
              })}
              fullWidth
            />
          </Grid>
          <Grid item lg={5} xs={12} alignItems="right">
            {mode === CourtesyMode.NEW ?
              <Button variant="outlined" onClick={saveDataHandler} disabled={!formik.isValid} fullWidth>
                {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })}
              </Button>
            :
              <Button color="primary" onClick={saveDataHandler} disabled={!formik.isValid} fullWidth>
                {t('button.salva')}
              </Button>
            }
          </Grid>
        </Fragment>
      );
    }
  };

  return <Fragment>
      {isMobile ? getMobileVersion() : getDeskstopVersion()}
      <Dialog
        open={isConfirmationModalVisible}
        onClose={handleDiscardChanges}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{t(`courtesy-contacts.remove-${type}-title`, { ns: 'recapiti' })}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">{t(`courtesy-contacts.remove-${type}-message`, { value: formik.values.field, ns: 'recapiti'})}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDiscardChanges} variant="outlined">{t('button.annulla')}</Button>
          <Button onClick={handleRemoveContact} variant="contained">{t('button.conferma')}</Button>
        </DialogActions>
      </Dialog>
    </Fragment>;
};

export default CourtesyContactItem;
