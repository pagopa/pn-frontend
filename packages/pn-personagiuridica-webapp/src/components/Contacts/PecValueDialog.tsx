import { useFormik } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { Button, DialogContentText, DialogTitle, TextField, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { pecValidationSchema } from '../../utility/contacts.utility';

type Props = {
  open: boolean;
  onConfirm: (value: string) => void;
  onDiscard: () => void;
};

const PecValueDialog: React.FC<Props> = ({ open, onConfirm, onDiscard }) => {
  const { t } = useTranslation(['common', 'recapiti']);

  const validationSchema = yup.object().shape({
    default_modal_pec: pecValidationSchema(t),
  });

  const formik = useFormik({
    initialValues: { default_modal_pec: '' },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      onConfirm(values.default_modal_pec);
      formik.resetForm();
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleClose = () => {
    formik.resetForm();
    onDiscard();
  };

  return (
    <PnDialog
      open={open}
      onClose={() => formik.resetForm()}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      data-testid="pecValueDialog"
    >
      <DialogTitle id="dialog-title">
        {t('legal-contacts.sercq-send-add-pec', { ns: 'recapiti' })}
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description" mb={2}>
          {t('legal-contacts.sercq-send-add-pec-description', { ns: 'recapiti' })}
        </DialogContentText>
        <Typography variant="caption" mb={2} display="block" fontWeight={600}>
          {t('special-contacts.pec', { ns: 'recapiti' })}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            id="default_modal_pec"
            name="default_modal_pec"
            label={t('special-contacts.link-pec-label', { ns: 'recapiti' })}
            fullWidth
            size="small"
            value={formik.values.default_modal_pec}
            onChange={(e) => void handleChangeTouched(e)}
            error={formik.touched.default_modal_pec && Boolean(formik.errors.default_modal_pec)}
            helperText={formik.touched.default_modal_pec && formik.errors.default_modal_pec}
          />
        </form>
      </PnDialogContent>
      <PnDialogActions>
        <Button onClick={handleClose} variant="outlined">
          {t('button.annulla')}
        </Button>
        <Button onClick={formik.submitForm} variant="contained" disabled={!formik.isValid}>
          {t('button.attiva')}
        </Button>
      </PnDialogActions>
    </PnDialog>
  );
};

export default PecValueDialog;
