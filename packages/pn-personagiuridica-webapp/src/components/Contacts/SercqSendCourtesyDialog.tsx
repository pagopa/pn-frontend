import { useFormik } from 'formik';
import { ChangeEvent } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Button,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  InputAdornment,
  Radio,
  RadioGroup,
  SxProps,
  TextField,
  Typography,
} from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../models/contacts';
import {
  emailValidationSchema,
  internationalPhonePrefix,
  phoneValidationSchema,
} from '../../utility/contacts.utility';

type Props = {
  open: boolean;
  onDiscard: () => void;
  onConfirm: (type: ChannelType, value: string) => void;
};

const SercqSendCourtesyRadioLabel: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <>
    <Typography fontWeight={600} fontSize="18px">
      {title}
    </Typography>
    <Typography fontWeight={400} fontSize="14px" color="text.secondary">
      {description}
    </Typography>
  </>
);

const SercqSendCourtesyInput: React.FC<{
  formik: ReturnType<typeof useFormik<{channelType: string; value: string}>>;
  sx?: SxProps;
}> = ({ formik, sx }) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  return (
    <TextField
      id="value"
      name="value"
      label={t(`courtesy-contacts.link-${formik.values.channelType.toLowerCase()}-placeholder`, {
        ns: 'recapiti',
      })}
      size="small"
      sx={sx}
      fullWidth
      value={formik.values.value}
      onChange={handleChangeTouched}
      error={formik.touched.value && Boolean(formik.errors.value)}
      helperText={formik.touched.value && formik.errors.value}
      InputProps={{
        startAdornment:
          formik.values.channelType === ChannelType.SMS ? (
            <InputAdornment position="start">{internationalPhonePrefix}</InputAdornment>
          ) : null,
      }}
    />
  );
};

const SercqSendCourtesyDialog: React.FC<Props> = ({ open = false, onDiscard, onConfirm }) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    await formik.setFieldValue('channelType', event.target.value, false);
    await formik.setFieldValue('value', '', false);
    await formik.setFieldTouched('value', false, true);
  };

  const validationSchema = yup.object({
    channelType: yup.mixed<ChannelType>().oneOf(Object.values(ChannelType)).required(),
    value: yup
      .string()
      .when('channelType', {
        is: ChannelType.EMAIL,
        then: emailValidationSchema(t),
      })
      .when('channelType', {
        is: ChannelType.SMS,
        then: phoneValidationSchema(t),
      }),
  });

  const formik = useFormik({
    initialValues: { channelType: '', value: '' },
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (values.channelType) {
        onConfirm(values.channelType as ChannelType, values.value);
      }
    },
  });

  return (
    <PnDialog
      open={open}
      data-testid="sercqSendCourtesyDialog"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        {t('legal-contacts.sercq-send-courtesy-title', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description" sx={{ color: 'text.primary' }}>
          <Trans i18nKey="legal-contacts.sercq-send-courtesy-description" ns="recapiti" />
        </DialogContentText>
        <form>
          <RadioGroup sx={{ mt: 2 }} value={formik.values.channelType} onChange={handleChange}>
            <FormControlLabel
              value={ChannelType.EMAIL}
              control={<Radio />}
              label={
                <SercqSendCourtesyRadioLabel
                  title={t('courtesy-contacts.email-title', { ns: 'recapiti' })}
                  description={t('courtesy-contacts.email-dialog-description', { ns: 'recapiti' })}
                />
              }
              sx={{ alignItems: 'flex-start' }}
              data-testid="courtesyAddressRadio"
            />
            {formik.values.channelType === ChannelType.EMAIL && (
              <SercqSendCourtesyInput formik={formik} sx={{ mt: 2 }} />
            )}
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              value={ChannelType.SMS}
              control={<Radio />}
              label={
                <SercqSendCourtesyRadioLabel
                  title={t('courtesy-contacts.sms-title', { ns: 'recapiti' })}
                  description={t('courtesy-contacts.sms-dialog-description', { ns: 'recapiti' })}
                />
              }
              sx={{ alignItems: 'flex-start' }}
              data-testid="courtesyAddressRadio"
            />
            {formik.values.channelType === ChannelType.SMS && (
              <SercqSendCourtesyInput formik={formik} sx={{ mt: 2 }} />
            )}
          </RadioGroup>
        </form>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={onDiscard} variant="naked">
          {t('button.not-now')}
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          variant="contained"
          disabled={!formik.isValid}
        >
          {t('button.conferma')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default SercqSendCourtesyDialog;
