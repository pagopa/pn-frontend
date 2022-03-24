import { useEffect } from 'react';
import { Box } from '@mui/material';
import { TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';

import { Trans } from 'react-i18next';
import GenericError from '../component/GenericError/GenericError';
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
import MobileDelegates from './components/Deleghe/MobileDelegates';
import MobileDelegators from './components/Deleghe/MobileDelegators';

const Deleghe = () => {
  const isMobile = useIsMobile();
  const { id, open, type } = useAppSelector(
    (state: RootState) => state.delegationsState.modalState
  );
  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state: RootState) => state.delegationsState);

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
    <Box sx={{ marginRight: isMobile ? 0 : 2 }}>
      {error ? (
        <GenericError />
      ) : (
        <>
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
          <Box ml={isMobile ? 2 : 0}>
            <TitleBox title={'Deleghe'} variantTitle={'h4'}>
              <Trans ns={'deleghe'} i18nKey="deleghe.description">
                deleghe.description
              </Trans>
            </TitleBox>
          </Box>
          {isMobile ? (
            <>
              <MobileDelegates />
              <MobileDelegators />
            </>
          ) : (
            <>
              <Delegates />
              <Delegators />
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default Deleghe;
