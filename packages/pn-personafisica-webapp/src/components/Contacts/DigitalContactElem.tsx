import {
  Dispatch,
  ReactChild,
  SetStateAction,
  forwardRef,
  memo,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle, Grid, Typography } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';
import { AsyncThunk } from '@reduxjs/toolkit';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { deleteCourtesyAddress, deleteLegalAddress } from '../../redux/contact/actions';
import { DeleteDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch } from '../../redux/hooks';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  fields: Array<{
    component: ReactChild;
    id: string;
    isEditable?: boolean;
    size: 'auto' | 'variable';
    key: string;
  }>;
  recipientId: string;
  senderId: string;
  senderName?: string;
  contactType: CourtesyChannelType | LegalChannelType;
  saveDisabled?: boolean;
  removeModalTitle: string;
  removeModalBody: string;
  value: string;
  onConfirmClick: (status: 'validated' | 'cancelled') => void;
  blockDelete?: boolean;
  resetModifyValue: () => void;
  onDeleteCbk?: () => void;
  editDisabled?: boolean;
  setContextEditMode?: Dispatch<SetStateAction<boolean>>;
};

type DialogProps = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string;
  blockDelete?: boolean;
  confirmHandler: () => void;
};

const DeleteDialog: React.FC<DialogProps> = ({
  showModal,
  handleModalClose,
  removeModalTitle,
  removeModalBody,
  blockDelete,
  confirmHandler,
}) => {
  const { t } = useTranslation(['common']);

  const deleteModalActions = blockDelete ? (
    <Button id="closeModalButton" onClick={handleModalClose} variant="outlined">
      {t('button.close')}
    </Button>
  ) : (
    [
      <Button key="cancel" onClick={handleModalClose} variant="outlined" id="buttonAnnulla">
        {t('button.annulla')}
      </Button>,
      <Button id="buttonConferma" key="confirm" onClick={confirmHandler} variant="contained">
        {t('button.conferma')}
      </Button>,
    ]
  );
  return (
    <PnDialog
      open={showModal}
      onClose={handleModalClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{removeModalTitle}</DialogTitle>
      <PnDialogContent>
        <DialogContentText id="dialog-description">{removeModalBody}</DialogContentText>
      </PnDialogContent>
      <PnDialogActions>{deleteModalActions}</PnDialogActions>
    </PnDialog>
  );
};

const DigitalContactElem = forwardRef<{ editContact: () => void }, Props>(
  (
    {
      fields,
      saveDisabled = false,
      removeModalTitle,
      removeModalBody,
      recipientId,
      senderId,
      senderName,
      contactType,
      value,
      onConfirmClick,
      blockDelete,
      resetModifyValue,
      editDisabled,
      setContextEditMode,
      onDeleteCbk,
    },
    ref
  ) => {
    const { t } = useTranslation(['common']);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const { initValidation } = useDigitalContactsCodeVerificationContext();

    const mappedChildren = fields.map((f) => (
      <Grid key={f.key} item lg={f.size === 'auto' ? true : 'auto'} xs={12}>
        {!f.isEditable && f.component}
        {f.isEditable && editMode && f.component}
        {f.isEditable && !editMode && (
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
            id={f.id}
          >
            {(f.component as any).props.value}
          </Typography>
        )}
      </Grid>
    ));

    const toggleEdit = () => {
      setEditMode(!editMode);
      if (setContextEditMode) {
        setContextEditMode(!editMode);
      }
    };

    const handleModalClose = () => {
      setShowModal(false);
    };

    const removeHandler = () => {
      setShowModal(true);
    };

    const onCancel = () => {
      resetModifyValue();
      toggleEdit();
    };

    const confirmHandler = () => {
      handleModalClose();
      /* eslint-disable-next-line functional/no-let */
      let actionToDispatch: AsyncThunk<string, DeleteDigitalAddressParams, any>;
      if (contactType === LegalChannelType.PEC) {
        actionToDispatch = deleteLegalAddress;
      } else {
        actionToDispatch = deleteCourtesyAddress;
      }
      void dispatch(actionToDispatch({ recipientId, senderId, channelType: contactType }))
        .unwrap()
        .then(() => {
          if (onDeleteCbk) {
            onDeleteCbk();
          }
        })
        .catch();
    };

    const editHandler = () => {
      initValidation(
        contactType,
        value,
        recipientId,
        senderId,
        senderName,
        (status: 'validated' | 'cancelled') => {
          onConfirmClick(status);
          toggleEdit();
        }
      );
    };

    useImperativeHandle(ref, () => ({
      editContact: editHandler,
    }));

    return (
      <>
        <Grid container spacing="4" direction="row" alignItems="center">
          {mappedChildren}
          <Grid item lg={12} xs={12} textAlign={'left'}>
            {!editMode ? (
              <>
                <ButtonNaked
                  color="primary"
                  onClick={toggleEdit}
                  sx={{ mr: 2 }}
                  disabled={editDisabled}
                  id={`modifyContact-${senderId}`}
                >
                  {t('button.modifica')}
                </ButtonNaked>
                <ButtonNaked
                  id={`cancelContact-${senderId}`}
                  color="primary"
                  onClick={removeHandler}
                  disabled={editDisabled}
                >
                  {t('button.elimina')}
                </ButtonNaked>
              </>
            ) : (
              <>
                <ButtonNaked
                  color="primary"
                  disabled={saveDisabled}
                  type="button"
                  onClick={editHandler}
                  sx={{ mr: 2 }}
                  id="saveModifyButton"
                >
                  {t('button.salva')}
                </ButtonNaked>
                <ButtonNaked color="primary" onClick={onCancel}>
                  {t('button.annulla')}
                </ButtonNaked>
              </>
            )}
          </Grid>
        </Grid>
        <DeleteDialog
          showModal={showModal}
          handleModalClose={handleModalClose}
          removeModalTitle={removeModalTitle}
          removeModalBody={removeModalBody}
          blockDelete={blockDelete}
          confirmHandler={confirmHandler}
        />
      </>
    );
  }
);

export default memo(DigitalContactElem);
