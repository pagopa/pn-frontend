import { Close } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, TextField, Typography } from "@mui/material";
import { ChangeEvent, Fragment, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { appStateActions, CodeModal } from "@pagopa-pn/pn-commons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
// import { CourtesyChannelType, SaveCourtesyAddressParams } from "../../models/contacts";
import { RootState } from "../../redux/store";
import { CourtesyChannelType, SaveDigitalAddressParams } from "../../models/contacts";
import { createOrUpdateCourtesyAddress } from "../../redux/contact/actions";

interface Props {
  fieldType: "email" | "phone";
  fieldValue: string;
  isVerified: boolean;
};

const emailValidationSchema = yup.object().shape({
  field: yup.string()
    .email("Formato non corretto")
    .required("Il campo è obbligatorio"),
});

const phoneValidationSchema = yup.object().shape({
  field: yup.string()
    .required("Il campo è obbligatorio")
    .matches(/^\d{9,10}$/, "Formato non corretto!"),
});

const CourtesyContactItem = (props: Props) => {
  const { fieldType, fieldValue, isVerified } = props;
  
  const recipientId = useAppSelector((state: RootState) => state.userState.user.uid);
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'recapiti']);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditMode, SetIsEditMode] = useState(!isVerified);
  const [isValidationCodeOk, setIsValidationCodeOk] = useState(true);

  const subtitleText = `courtesy-contacts.${fieldType}-verify-descr`;

  const formik = useFormik({
    initialValues: {
      field: fieldValue
    },
    validationSchema: fieldType === "email" ? emailValidationSchema : phoneValidationSchema,
    onSubmit: (values) => {
      alert("prova! " + values.field);
    }
  });

  const enteredValueChanged = () => fieldValue !== formik.values.field;

  const saveDataHandler = () => {
    if(formik.isValid){
      if(isVerified && !enteredValueChanged()) {
        SetIsEditMode(false);
      } else { 
        // show modal
        handleAddressCreation();
        // dispatch azione con chiamata api
        // se il dato non è verificato
        setIsModalVisible((prevState) => !prevState);
      }
    }
  };

  const handleClose = () => {
    setIsModalVisible(false);
  };

  const handleChangeTouched = (e: ChangeEvent) => {
    void formik.setFieldTouched(e.target.id, true, false);
    formik.handleChange(e);
  };

  useEffect(() => {
    void formik.validateForm();
  }, []);

  const handleAddressCreation = (verificationCode?: string, noCallback: boolean = false) => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      recipientId,
      senderId: "default",
      channelType: fieldType === "email" ? CourtesyChannelType.EMAIL : CourtesyChannelType.SMS,
      value: fieldValue,
      code: verificationCode,
    };
    dispatch(createOrUpdateCourtesyAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        if (noCallback) {
          return;
        }
        if (res && verificationCode) {
          // show success message
          dispatch(appStateActions.addSuccess({ title: '', message: "Operazione eseguita correttamente" })); // 2DO add translation!
          // if (closeModalOnVerification) {
          //   setOpen(false);
          // }
          setIsModalVisible(false);
        } else {
          // open code verification dialog
          setIsModalVisible(true);
        }
      }).catch(() => {
        setIsValidationCodeOk(false);
      });
  };

  if(isVerified && !isEditMode) {
    return (
      <form onSubmit={formik.handleSubmit}>
        <Grid item lg={7} xs={8}>
          <IconButton aria-label="">
            <Close />
          </IconButton>
          <TextField inputProps={{ sx: { height: '12px' } }}>
            {fieldValue}
          </TextField>
        </Grid>
        <Grid item lg={5} xs={6}>
          <Button variant="text">Text</Button>
        </Grid>
      </form>
    );
  } else {
    return (
      <Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Grid item lg={7} xs={8}>
          <TextField
            id="field"
            name="field"
            label={fieldType === "email" ? "Email" : "Phone"}
            value={formik.values.field}
            onChange={handleChangeTouched}
            error={formik.touched.field && Boolean(formik.errors.field)}
            helperText={formik.touched.field && formik.errors.field}
            inputProps={{ sx: { height: '12px' } }}
            placeholder={
              t(`courtesy-contacts.link-${fieldType}-placeholder`, { ns: 'recapiti' })
            }
            fullWidth
          />
        </Grid>
        <Grid item lg={5} xs={4}>
          <Button
            variant="outlined"
            onClick={saveDataHandler}
            disabled={!formik.isValid}
          >
              {t(`courtesy-contacts.${fieldType}-add`, { ns: 'recapiti' })}
          </Button>
        </Grid>
      </form>
      <CodeModal
      title={t(`courtesy-contacts.${fieldType}-verify`, { ns: 'recapiti' }) + ` ${formik.values.field}`}
      subtitle={<Trans i18nKey={subtitleText} ns="recapiti" />}
      open={isModalVisible}
      initialValues={new Array(5).fill('')}
      handleClose={() => setIsModalVisible(false)}
      codeSectionTitle={t(`courtesy-contacts.insert-code`, { ns: 'recapiti' })}
      codeSectionAdditional={
        <Box>
          <Typography variant="body2" display="inline">
          {t(`courtesy-contacts.${fieldType}-new-code`, { ns: 'recapiti' })}&nbsp;
          </Typography>
          <Typography variant="body2" display="inline" color="primary" onClick={() => alert("Click")} sx={{cursor: 'pointer'}}>
          {t(`courtesy-contacts.new-code-link`, { ns: 'recapiti' })}
          </Typography>
        </Box>
      }
      cancelLabel={t('button.annulla')}
      confirmLabel={t('button.conferma')}
      cancelCallback={handleClose}
      confirmCallback={(values: Array<string>) => handleAddressCreation(values.join(''))}
      hasError={!isValidationCodeOk}
      errorMessage={t(`courtesy-contacts.wrong-code`, { ns: 'recapiti' })}
    />
    </Fragment>
    );
  }
};

export default CourtesyContactItem;