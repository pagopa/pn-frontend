import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  ErrorMessage,
  appStateActions,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { AddressType, ChannelType, SaveDigitalAddressParams } from '../../models/contacts';
import { createOrUpdateAddress, deleteAddress } from '../../redux/contact/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { contactAlreadyExists, pecValidationSchema } from '../../utility/contacts.utility';
import CancelVerificationModal from './CancelVerificationModal';
import DeleteDialog from './DeleteDialog';
import DigitalContactElem from './DigitalContactElem';
import ExistingContactDialog from './ExistingContactDialog';
import PecVerificationDialog from './PecVerificationDialog';

type Props = {
  value: string;
  verifyingAddress: boolean;
  senderId?: string;
  senderName?: string;
  blockDelete?: boolean;
  blockEdit?: boolean;
  onEdit?: (editFlag: boolean) => void;
};

enum ModalType {
  EXISTING = 'existing',
  VALIDATION = 'validation',
  CANCEL_VALIDATION = 'cancel_validation',
  DELETE = 'delete',
  CODE = 'code',
}

const PecContactItem: React.FC<Props> = ({
  value,
  verifyingAddress,
  blockDelete,
  senderId = 'default',
  senderName,
  blockEdit,
  onEdit,
}) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const digitalAddresses =
    useAppSelector((state: RootState) => state.contactsState.digitalAddresses) ?? [];
  const digitalElemRef = useRef<{ toggleEdit: () => void }>({ toggleEdit: () => {} });
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const dispatch = useAppDispatch();
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  const validationSchema = yup.object({
    [`${senderId}_pec`]: pecValidationSchema(t),
  });

  const initialValues = {
    [`${senderId}_pec`]: value,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    validateOnMount: true,
    enableReinitialize: true,
    /** onSubmit validate */
    onSubmit: () => {
      // first check if contact already exists
      if (
        contactAlreadyExists(
          digitalAddresses,
          formik.values[`${senderId}_pec`],
          senderId,
          ChannelType.PEC
        )
      ) {
        setModalOpen(ModalType.EXISTING);
        return;
      }
      handleCodeVerification();
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType: AddressType.LEGAL,
      senderId,
      senderName,
      channelType: ChannelType.PEC,
      value: formik.values[`${senderId}_pec`],
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
          if (value) {
            digitalElemRef.current.toggleEdit();
          }
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen(ModalType.VALIDATION);
      })
      .catch(() => {});
  };

  const handleCancelCode = async () => {
    setModalOpen(null);
    if (value) {
      digitalElemRef.current.toggleEdit();
    }
    await formik.setFieldTouched(`${senderId}_pec`, false, false);
    await formik.setFieldValue(`${senderId}_pec`, initialValues[`${senderId}_pec`], true);
  };

  const deleteConfirmHandler = () => {
    setModalOpen(null);
    void dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId,
        channelType: ChannelType.PEC,
      })
    );
  };

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (modalOpen === null) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
      }
      return false;
    },
    [modalOpen]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe('createOrUpdateAddress', handleAddressUpdateError);
    };
  }, [handleAddressUpdateError]);

  return (
    <>
      <form onSubmit={formik.handleSubmit} data-testid={`${senderId}_pecContact`}>
        {value && (
          <>
            {senderId === 'default' && (
              <Typography mb={1} sx={{ fontWeight: 'bold' }} id="associatedPEC" mt={3}>
                {t('legal-contacts.pec-added', { ns: 'recapiti' })}
              </Typography>
            )}
            <DigitalContactElem
              senderId={senderId}
              ref={digitalElemRef}
              inputProps={{
                id: `${senderId}_pec`,
                name: `${senderId}_pec`,
                label: 'PEC',
                value: formik.values[`${senderId}_pec`],
                onChange: (e) => void handleChangeTouched(e),
                error:
                  formik.touched[`${senderId}_pec`] && Boolean(formik.errors[`${senderId}_pec`]),
                helperText: formik.touched[`${senderId}_pec`] && formik.errors[`${senderId}_pec`],
              }}
              saveDisabled={!formik.isValid}
              editDisabled={blockEdit}
              onDelete={() => setModalOpen(ModalType.DELETE)}
              onEditCancel={() => formik.resetForm({ values: initialValues })}
              onEdit={onEdit}
            />
          </>
        )}
        {verifyingAddress && (
          <>
            {senderId === 'default' && (
              <Typography mb={1} sx={{ fontWeight: 'bold' }} mt={3}>
                {t('legal-contacts.pec-validating', { ns: 'recapiti' })}
              </Typography>
            )}
            <Stack direction="row" spacing={1}>
              <WatchLaterIcon fontSize="small" />
              <Typography id="validationPecProgress" fontWeight="bold" variant="body2">
                {t('legal-contacts.validation-in-progress', { ns: 'recapiti' })}
              </Typography>
              <ButtonNaked
                color="primary"
                onClick={() => setModalOpen(ModalType.CANCEL_VALIDATION)}
                data-testid="cancelValidation"
              >
                {t('legal-contacts.cancel-pec-validation', { ns: 'recapiti' })}
              </ButtonNaked>
            </Stack>
          </>
        )}
        {!value && !verifyingAddress && (
          <Stack spacing={2} direction={{ sm: 'row', xs: 'column' }} mt={3}>
            <TextField
              id={`${senderId}_pec`}
              name={`${senderId}_pec`}
              placeholder={t('legal-contacts.link-pec-placeholder', { ns: 'recapiti' })}
              fullWidth
              value={formik.values[`${senderId}_pec`]}
              onChange={handleChangeTouched}
              error={formik.touched[`${senderId}_pec`] && Boolean(formik.errors[`${senderId}_pec`])}
              helperText={formik.touched[`${senderId}_pec`] && formik.errors[`${senderId}_pec`]}
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
            </Button>
          </Stack>
        )}
      </form>
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values[`${senderId}_pec`]}
        handleDiscard={() => setModalOpen(null)}
        handleConfirm={() => handleCodeVerification()}
      />
      <CodeModal
        title={
          t(`legal-contacts.pec-verify`, { ns: 'recapiti' }) +
          ` ${formik.values[senderId + '_pec']}`
        }
        subtitle={<Trans i18nKey={`legal-contacts.pec-verify-descr`} ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`legal-contacts.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`legal-contacts.pec-new-code`, { ns: 'recapiti' })}
              &nbsp;
            </Typography>
            <ButtonNaked
              component={Box}
              onClick={() => handleCodeVerification()}
              sx={{ verticalAlign: 'unset', display: 'inline' }}
            >
              <Typography
                display="inline"
                color="primary"
                variant="body2"
                sx={{ textDecoration: 'underline' }}
              >
                {t(`legal-contacts.new-code-link`, { ns: 'recapiti' })}.
              </Typography>
            </ButtonNaked>
          </>
        }
        cancelLabel={t('button.annulla')}
        confirmLabel={t('button.conferma')}
        cancelCallback={handleCancelCode}
        confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
        ref={codeModalRef}
      />
      <PecVerificationDialog
        open={modalOpen === ModalType.VALIDATION}
        handleConfirm={() => setModalOpen(null)}
      />
      <CancelVerificationModal
        open={modalOpen === ModalType.CANCEL_VALIDATION}
        senderId={senderId}
        handleClose={() => setModalOpen(null)}
      />
      <DeleteDialog
        showModal={modalOpen === ModalType.DELETE}
        removeModalTitle={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-title`, {
          ns: 'recapiti',
        })}
        removeModalBody={t(`legal-contacts.${blockDelete ? 'block-' : ''}remove-pec-message`, {
          value: formik.values[`${senderId}_pec`],
          ns: 'recapiti',
        })}
        handleModalClose={() => setModalOpen(null)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={blockDelete}
      />
    </>
  );
};

export default PecContactItem;
