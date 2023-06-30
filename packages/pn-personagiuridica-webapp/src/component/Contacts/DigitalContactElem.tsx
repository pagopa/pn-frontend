import {
  Dispatch,
  forwardRef,
  Fragment,
  memo,
  ReactChild,
  SetStateAction,
  useImperativeHandle,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { AsyncThunk } from '@reduxjs/toolkit';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { deleteCourtesyAddress, deleteLegalAddress } from '../../redux/contact/actions';
import { DeleteDigitalAddressParams } from '../../redux/contact/types';
import { useAppDispatch } from '../../redux/hooks';
import { trackEventByType } from '../../utils/mixpanel';
import { EventActions, TrackEventType } from '../../utils/events';
import { getContactEventType } from '../../utils/contacts.utility';
import { useDigitalContactsCodeVerificationContext } from './DigitalContactsCodeVerification.context';

type Props = {
  fields: Array<{
    component: ReactChild;
    id: string;
    isEditable?: boolean;
    size: 'auto' | 'variable';
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
    <Button onClick={handleModalClose} variant="outlined">
      {t('button.close')}
    </Button>
  ) : (
    <>
      <Button onClick={handleModalClose} variant="outlined">
        {t('button.annulla')}
      </Button>
      <Button onClick={confirmHandler} variant="contained">
        {t('button.conferma')}
      </Button>
    </>
  );
  return (
    <Dialog
      open={showModal}
      onClose={handleModalClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{removeModalTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">{removeModalBody}</DialogContentText>
      </DialogContent>
      <DialogActions>{deleteModalActions}</DialogActions>
    </Dialog>
  );
};

const DigitalContactElem = forwardRef(
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
    }: Props,
    ref
  ) => {
    const { t } = useTranslation(['common']);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const { initValidation } = useDigitalContactsCodeVerificationContext();

    const mappedChildren = fields.map((f) => (
      <Grid key={f.id} item lg={f.size === 'auto' ? true : 'auto'} xs={12}>
        {!f.isEditable && f.component}
        {f.isEditable && editMode && f.component}
        {f.isEditable && !editMode && (
          <Typography
            sx={{
              wordBreak: 'break-word',
            }}
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
        trackEventByType(TrackEventType.CONTACT_LEGAL_CONTACT, { action: EventActions.DELETE });
        actionToDispatch = deleteLegalAddress;
      } else {
        const eventTypeByChannel = getContactEventType(contactType);
        trackEventByType(eventTypeByChannel, { action: EventActions.DELETE });
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
      <Fragment>
        <Grid container spacing="4" direction="row" alignItems="center">
          {mappedChildren}
          <Grid item lg={12} xs={12} textAlign={'left'}>
            {!editMode ? (
              <>
                <ButtonNaked
                  color="primary"
                  onClick={toggleEdit}
                  sx={{ marginRight: '10px' }}
                  disabled={editDisabled}
                >
                  {t('button.modifica')}
                </ButtonNaked>
                <ButtonNaked color="primary" onClick={removeHandler} disabled={editDisabled}>
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
                  sx={{ marginRight: '10px' }}
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
      </Fragment>
    );
  }
);

export default memo(DigitalContactElem);
