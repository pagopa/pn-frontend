import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Button, DialogContentText, DialogTitle } from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { ChannelType } from '../../models/contacts';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';

type Props = {
  showModal: boolean;
  handleModalClose: () => void;
  removeModalTitle: string;
  removeModalBody: string | ReactNode;
  blockDelete?: boolean;
  channelType?: ChannelType;
  confirmHandler: () => void;
};

const DeleteDialog: React.FC<Props> = ({
  showModal,
  handleModalClose,
  removeModalTitle,
  removeModalBody,
  blockDelete,
  channelType,
  confirmHandler,
}) => {
  const { t } = useTranslation(['common']);
  const { defaultSERCQ_SENDAddress, defaultPECAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );
  const isDigitalDomicileActive = defaultPECAddress || defaultSERCQ_SENDAddress;

  const getDeleteModalDODAction = () => {
    if (isDigitalDomicileActive && channelType) {
      return [
        <Button id="buttonDisable" key="disable" onClick={confirmHandler} variant="outlined">
          {t(`button.disable-${channelType?.toLowerCase()}`)}
        </Button>,
        <Button key="cancel" onClick={handleModalClose} variant="contained" id="buttonAnnulla">
          {t('button.annulla')}
        </Button>,
      ];
    } else {
      return [
        <Button key="cancel" onClick={handleModalClose} variant="outlined" id="buttonAnnulla">
          {t('button.annulla')}
        </Button>,
        <Button id="buttonConferma" key="confirm" onClick={confirmHandler} variant="contained">
          {t('button.conferma')}
        </Button>,
      ];
    }
  };

  const deleteModalActions = blockDelete ? (
    <Button id="buttonClose" onClick={handleModalClose} variant="contained">
      {t('button.understand')}
    </Button>
  ) : (
    getDeleteModalDODAction()
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

export default DeleteDialog;
