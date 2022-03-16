import { useEffect } from 'react';
import { Box } from '@mui/material';
import { TitleAndDescription } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  closeRevocationModal,
  rejectDelegation,
  revokeDelegation,
  getDelegates,
  getDelegators,
} from '../redux/delegation/actions';
import Delegates from './components/Deleghe/Delegates';
import Delegators from './components/Deleghe/Delegators';
import ConfirmationModal from './components/Deleghe/ConfirmationModal';

const Deleghe = () => {
  const { id, open, type } = useAppSelector(
    (state: RootState) => state.delegationsState.modalState
  );
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeRevocationModal());
  };

  const handleConfirmClick = () => {
    if (type === 'delegates') {
      void dispatch(revokeDelegation(id));
    } else {
      void dispatch(rejectDelegation(id));
    }
  };

  useEffect(() => {
    void dispatch(getDelegates());
    void dispatch(getDelegators());
  }, []);

  return (
    <Box sx={{ marginRight: 2 }}>
      <ConfirmationModal
        open={open}
        title={
          type === 'delegates'
            ? 'Vuoi davvero revocare la delega?'
            : 'Vuoi davvero rifiutare la delega?'
        }
        handleClose={handleCloseModal}
        onConfirm={handleConfirmClick}
        onConfirmLabel={type === 'delegates' ? 'Revoca la delega' : 'Rifiuta la delega'}
      />
      <TitleAndDescription title={'Deleghe'}>
        Qui puoi gestire <b>i tuoi delegati</b> e le <b>deleghe a tuo carico</b>. I primi sono le
        persone fisiche o giuridiche che hai autorizzato alla visualizzazione e gestione delle tue
        notifiche, le seconde sono color che hanno autorizzato te.
      </TitleAndDescription>
      <Delegates />
      <Delegators />
    </Box>
  );
};

export default Deleghe;
