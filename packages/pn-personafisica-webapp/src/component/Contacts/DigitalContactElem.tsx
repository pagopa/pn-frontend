import { Fragment, memo, ReactChild, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Grid,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useIsMobile } from '@pagopa-pn/pn-commons';

import { CourtesyChannelType, LegalChannelType } from '../../models/contacts';
import { deleteCourtesyAddress, deleteLegalAddress } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
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
  forceMobileView?: boolean;
};

const DigitalContactElem = memo(
  ({
    fields,
    saveDisabled = false,
    removeModalTitle,
    removeModalBody,
    recipientId,
    senderId,
    contactType,
    value,
    onConfirmClick,
    forceMobileView = false,
  }: Props) => {
    const { t } = useTranslation(['common']);
    const [editMode, setEditMode] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const isMobile = useIsMobile() || forceMobileView;
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
    };

    const handleModalClose = () => {
      setShowModal(false);
    };

    const removeHandler = () => {
      setShowModal(true);
    };

    const confirmHandler = () => {
      handleModalClose();
      if (contactType === LegalChannelType.PEC) {
        void dispatch(deleteLegalAddress({ recipientId, senderId, channelType: contactType }));
        return;
      }
      void dispatch(deleteCourtesyAddress({ recipientId, senderId, channelType: contactType as CourtesyChannelType }));
    };

    const editHandler = () => {
      initValidation(contactType, value, recipientId, senderId, (status: 'validated' | 'cancelled') => {
        onConfirmClick(status);
        toggleEdit();
      });
    };

    return (
      <Fragment>
        <Grid container spacing={isMobile ? 2 : 4} direction="row" alignItems="center">
          {!isMobile && (
            <Grid item lg="auto">
              <CloseIcon
                sx={{
                  cursor: 'pointer',
                  position: 'relative',
                  top: '4px',
                  color: 'action.active',
                }}
                onClick={removeHandler}
              />
            </Grid>
          )}
          {mappedChildren}
          <Grid item lg={forceMobileView ? 12 : 2} xs={12} textAlign={isMobile ? 'left' : 'right'}>
            {!editMode && (
              <ButtonNaked color="primary" onClick={toggleEdit} sx={{ marginRight: '10px' }}>
                {t('button.modifica')}
              </ButtonNaked>
            )}
            {editMode && (
              <ButtonNaked color="primary" disabled={saveDisabled} type="button" onClick={editHandler} sx={{ marginRight: '10px' }}>
                {t('button.salva')}
              </ButtonNaked>
            )}
            {isMobile && (
              <ButtonNaked color="primary" onClick={removeHandler}>
                {t('button.rimuovi')}
              </ButtonNaked>
            )}
          </Grid>
        </Grid>
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
          <DialogActions>
            <Button onClick={handleModalClose} variant="outlined">
              {t('button.annulla')}
            </Button>
            <Button onClick={confirmHandler} variant="contained">
              {t('button.conferma')}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
);

export default DigitalContactElem;
