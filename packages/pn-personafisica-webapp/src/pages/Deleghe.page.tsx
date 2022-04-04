import { useEffect } from 'react';
import { Box } from '@mui/material';
import { TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { Trans, useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  closeRevocationModal,
  rejectDelegation,
  revokeDelegation,
  getDelegates,
  getDelegators,
} from '../redux/delegation/actions';
import AcceptDelegationModal from '../component/Deleghe/AcceptDelegationModal';
import ConfirmationModal from '../component/Deleghe/ConfirmationModal';
import MobileDelegates from '../component/Deleghe/MobileDelegates';
import MobileDelegators from '../component/Deleghe/MobileDelegators';
import Delegates from '../component/Deleghe/Delegates';
import Delegators from '../component/Deleghe/Delegators';

const Deleghe = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['deleghe']);
  const { id, open, type } = useAppSelector(
    (state: RootState) => state.delegationsState.modalState
  );
  const {
    id: acceptId,
    open: acceptOpen,
    name: acceptName,
  } = useAppSelector((state: RootState) => state.delegationsState.acceptModalState);
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
    <Box sx={{ marginRight: isMobile ? 0 : 2 }}>
      <>
        <AcceptDelegationModal open={acceptOpen} id={acceptId} name={acceptName} />
        <ConfirmationModal
          open={open}
          title={
            type === 'delegates'
              ? t('deleghe.revocation_question')
              : t('deleghe.rejection_question')
          }
          handleClose={handleCloseModal}
          onConfirm={handleConfirmClick}
          onConfirmLabel={
            type === 'delegates' ? t('deleghe.confirm_revocation') : t('deleghe.confirm_rejection')
          }
        />
        <Box ml={isMobile ? 2 : 0} mb={2}>
          <TitleBox title={'Deleghe'} variantTitle={'h4'}>
            <Trans ns={'deleghe'} i18nKey="deleghe.description" t={t}>
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
    </Box>
  );
};

export default Deleghe;
