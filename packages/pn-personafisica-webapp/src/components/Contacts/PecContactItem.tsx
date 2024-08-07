import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { dataRegex } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import { AddressType, LegalChannelType } from '../../models/contacts';
import { deleteAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import CancelVerificationModal from './CancelVerificationModal';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  value: string;
  verifyingAddress: boolean;
  blockDelete?: boolean;
};

const PecContactItem = ({ value, verifyingAddress, blockDelete }: Props) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalElemRef = useRef<{ editContact: () => void }>({ editContact: () => {} });
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const { initValidation } = useDigitalContactsCodeVerificationContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dispatch = useAppDispatch();

  const validationSchema = yup.object({
    pec: yup
      .string()
      .required(t('legal-contacts.valid-pec', { ns: 'recapiti' }))
      .max(254, t('common.too-long-field-error', { ns: 'recapiti', maxLength: 254 }))
      .matches(dataRegex.email, t('legal-contacts.valid-pec', { ns: 'recapiti' })),
  });

  const initialValues = {
    pec: value,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    /** onSubmit validate */
    onSubmit: () => {
      initValidation(LegalChannelType.PEC, formik.values.pec, 'default');
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleEditConfirm = (status: 'validated' | 'cancelled') => {
    if (status === 'cancelled') {
      formik.resetForm({ values: initialValues });
    }
  };

  const handlePecValidationCancel = () => {
    setCancelDialogOpen(true);
  };

  const deleteConfirmHandler = () => {
    setShowDeleteModal(false);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: 'default',
        channelType: LegalChannelType.PEC,
      })
    )
      .unwrap()
      .then(() => {
        PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_REMOVE_PEC_SUCCESS, 'default');
      })
      .catch(() => {});
  };

  useEffect(() => {
    const changeValue = async () => {
      await formik.setFieldValue('pec', value, true);
    };
    void changeValue();
  }, [value]);

  /*
   * if *some* value has been attached to the contact type,
   * then we show the value giving the user the possibility of changing it
   * (the DigitalContactElem component includes the "update" button)
   */
  /*
   * if *no* value has been attached to the contact type,
   * then we show the input field allowing the user to enter it along with the button
   * to perform the addition.
   */
  return (
    <>
      <form onSubmit={formik.handleSubmit} data-testid="insertLegalContact">
        {value && (
          <>
            <Typography mb={1} sx={{ fontWeight: 'bold' }} id="associatedPEC" mt={3}>
              {t('legal-contacts.pec-added', { ns: 'recapiti' })}
            </Typography>
            <DigitalContactElem
              senderId="default"
              contactType={LegalChannelType.PEC}
              ref={digitalElemRef}
              inputProps={{
                id: 'pec',
                name: 'pec',
                label: 'PEC',
                value: formik.values.pec,
                onChange: (e) => void handleChangeTouched(e),
                error: formik.touched.pec && Boolean(formik.errors.pec),
                helperText: formik.touched.pec && formik.errors.pec,
              }}
              saveDisabled={!formik.isValid}
              onConfirm={handleEditConfirm}
              resetModifyValue={() => handleEditConfirm('cancelled')}
              onDelete={() => setShowDeleteModal(true)}
            />
          </>
        )}
        {verifyingAddress && (
          <>
            <Typography mb={1} sx={{ fontWeight: 'bold' }} mt={3}>
              {t('legal-contacts.pec-validating', { ns: 'recapiti' })}
            </Typography>
            <Box display="flex" flexDirection="row" mt={2.5}>
              <Box display="flex" flexDirection="row" mr={1}>
                <WatchLaterIcon fontSize="small" />
                <Typography id="validationPecProgress" fontWeight="bold" variant="body2" ml={1}>
                  {t('legal-contacts.validation-in-progress', { ns: 'recapiti' })}
                </Typography>
              </Box>
              <ButtonNaked
                color="primary"
                onClick={handlePecValidationCancel}
                data-testid="cancelValidation"
              >
                {t('legal-contacts.cancel-pec-validation', { ns: 'recapiti' })}
              </ButtonNaked>
            </Box>
          </>
        )}
        {!value && !verifyingAddress && (
          <Stack spacing={2} direction={{ sm: 'row', xs: 'column' }} mt={3}>
            <TextField
              id="pec"
              placeholder={t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' })}
              fullWidth
              name="pec"
              value={formik.values.pec}
              onChange={handleChangeTouched}
              error={formik.touched.pec && Boolean(formik.errors.pec)}
              helperText={formik.touched.pec && formik.errors.pec}
              inputProps={{ sx: { height: '14px' } }}
              sx={{ flexBasis: { xs: 'unset', lg: '66.66%' } }}
            />
            <Button
              id="add-contact"
              variant="outlined"
              disabled={!formik.isValid}
              fullWidth
              type="submit"
              data-testid="addContact"
              sx={{ flexBasis: { xs: 'unset', lg: '33.33%' } }}
            >
              {t('button.conferma')}
              {/* {t(`courtesy-contacts.${type}-add`, { ns: 'recapiti' })} */}
            </Button>
          </Stack>
        )}
      </form>
      <CancelVerificationModal
        open={cancelDialogOpen}
        handleClose={() => setCancelDialogOpen(false)}
      />

      <DeleteDialog
        showModal={showDeleteModal}
        removeModalTitle={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-message`, {
          value: formik.values.pec,
          ns: 'recapiti',
        })}
        handleModalClose={() => setShowDeleteModal(false)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
    </>
  );
};

export default PecContactItem;
