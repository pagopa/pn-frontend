import { useFormik } from 'formik';
import React, { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Button,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent, appStateActions } from '@pagopa-pn/pn-commons';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import { pecValidationSchema } from '../../utility/contacts.utility';
import ContactCodeDialog from './ContactCodeDialog';
import PecVerificationDialog from './PecVerificationDialog';

type Props = {
  open: boolean;
  handleClose: () => void;
};

enum ModalType {
  CODE = 'code',
  VALIDATION = 'validation',
}

const PecDisableSercqDialog: React.FC<Props> = ({ open = false, handleClose }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();

  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);

  const formik = useFormik({
    initialValues: {
      pec: '',
    },
    validationSchema: yup.object().shape({
      pec: pecValidationSchema(t),
    }),
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: () => handleCodeVerification(),
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_UX_CONVERSION, 'default');
    }

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId: 'default',
      channelType: ChannelType.PEC,
      value: formik.values.pec,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then((res) => {
        // contact to verify
        // open code modal
        if (!res) {
          setModalOpen(ModalType.CODE);
          return;
        }

        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_UX_SUCCESS, 'default');

        // contact has already been verified
        if (res.pecValid) {
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`legal-contacts.pec-added-successfully`, { ns: 'recapiti' }),
            })
          );
          setModalOpen(null);
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen(ModalType.VALIDATION);
      })
      .catch(() => {});
  };

  const handleCancelCode = () => {
    setModalOpen(null);
    handleClose();
  };

  return (
    <>
      <PnDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        data-testid="duplicateDialog"
      >
        <DialogTitle id="dialog-title">Inserisci PEC</DialogTitle>
        <PnDialogContent>
          <Stack spacing={2}>
            <DialogContentText id="dialog-description">
              La PEC sostituirà il Domicilio Digitale come tuo recapito a valore legale di SEND. Il
              Domicilio Digitale verrà disattivato automaticamente.
            </DialogContentText>

            <Typography variant="caption-semibold" color="black">
              {t('legal-contacts.pec-to-add', { ns: 'recapiti' })}
            </Typography>
            <TextField
              id="pec"
              name="pec"
              placeholder={t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' })}
              size="small"
              fullWidth
              value={formik.values.pec}
              onChange={(e) => void handleChangeTouched(e)}
              error={formik.touched.pec && Boolean(formik.errors.pec)}
              helperText={formik.touched.pec && formik.errors.pec}
            />
          </Stack>
        </PnDialogContent>
        <PnDialogActions>
          <Button onClick={handleClose} variant="outlined">
            {t('button.annulla')}
          </Button>
          <Button
            onClick={() => formik.handleSubmit()}
            disabled={!formik.isValid}
            variant="contained"
          >
            {t('button.conferma')}
          </Button>
        </PnDialogActions>
      </PnDialog>

      <ContactCodeDialog
        value={formik.values.pec}
        addressType={AddressType.LEGAL}
        channelType={ChannelType.PEC}
        open={modalOpen === ModalType.CODE}
        onConfirm={(code) => handleCodeVerification(code)}
        onDiscard={handleCancelCode}
        onError={() => PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR)}
      />
      <PecVerificationDialog
        open={modalOpen === ModalType.VALIDATION}
        handleConfirm={() => setModalOpen(null)}
      />
    </>
  );
};

export default PecDisableSercqDialog;
