import {
  Dispatch,
  forwardRef,
  Fragment,
  memo,
  ReactChild,
  SetStateAction,
  useImperativeHandle,
  useState
} from 'react';
import { useTranslation } from 'react-i18next';
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
  contactType: CourtesyChannelType | LegalChannelType;
  saveDisabled?: boolean;
  removeModalTitle: string;
  removeModalBody: string;
  value: string;
  onConfirmClick: (status: 'validated' | 'cancelled') => void;
  blockDelete?: boolean;
  resetModifyValue: () => void;
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
      contactType,
      value,
      onConfirmClick,
      blockDelete,
      resetModifyValue,
      editDisabled,
      setContextEditMode
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
        {f.isEditable && !editMode && <Typography>{(f.component as any).props.value}</Typography>}
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
      if (contactType === LegalChannelType.PEC) {
        void dispatch(deleteLegalAddress({ recipientId, senderId, channelType: contactType }));
        trackEventByType(TrackEventType.CONTACT_LEGAL_CONTACT, { action: EventActions.DELETE });
        return;
      }
      const eventTypeByChannel = getContactEventType(contactType);
      void dispatch(
        deleteCourtesyAddress({
          recipientId,
          senderId,
          channelType: contactType as CourtesyChannelType,
        })
      );
      trackEventByType(eventTypeByChannel, { action: EventActions.DELETE });
    };

    const editHandler = () => {
      initValidation(
        contactType,
        value,
        recipientId,
        senderId,
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
              <ButtonNaked
                color="primary"
                onClick={toggleEdit}
                sx={{ marginRight: '10px' }}
                disabled={editDisabled}
              >
                {t('button.modifica')}
              </ButtonNaked>
            ) : (
              <ButtonNaked
                color="primary"
                disabled={saveDisabled}
                type="button"
                onClick={editHandler}
                sx={{ marginRight: '10px' }}
              >
                {t('button.salva')}
              </ButtonNaked>
            )}
            {!editMode ? (
              <ButtonNaked color="primary" onClick={removeHandler}>
                {t('button.elimina')}
              </ButtonNaked>
            ) : (
              <ButtonNaked color="primary" onClick={onCancel}>
                {t('button.annulla')}
              </ButtonNaked>
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
