import { useEffect } from 'react';
import { Box } from '@mui/material';
import { CourtesyPage, TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { Trans, useTranslation } from 'react-i18next';

import { RestorePageOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  closeRevocationModal,
  rejectDelegation,
  revokeDelegation,
  getDelegates,
  getDelegators,
  closeVerificationCodeModal,
} from '../redux/delegation/actions';
import AcceptDelegationModal from '../component/Deleghe/AcceptDelegationModal';
import ConfirmationModal from '../component/Deleghe/ConfirmationModal';
import MobileDelegates from '../component/Deleghe/MobileDelegates';
import MobileDelegators from '../component/Deleghe/MobileDelegators';
import Delegates from '../component/Deleghe/Delegates';
import Delegators from '../component/Deleghe/Delegators';
import VerificationCodeModal from '../component/Deleghe/VerificationCodeModal';

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
  const {
    open: verificationCodeOpen,
    name: verificationCodeName,
    verificationCode: verificationCode
  } = useAppSelector((state: RootState) => state.delegationsState.verificationCodeModalState);

  const dispatch = useAppDispatch();
  const { error } = useAppSelector((state: RootState) => state.delegationsState);

  const handleCloseModal = () => {
    dispatch(closeRevocationModal());
  };

  const handleCloseVerificationCodeModal = () => {
    dispatch(closeVerificationCodeModal());
  }; 

  const handleConfirmClick = () => {
    if (type === 'delegates') {
      void dispatch(revokeDelegation(id));
    } else {
      void dispatch(rejectDelegation(id));
    }
  };

  const handleReloadClick = () => {
    void dispatch(getDelegates());
    void dispatch(getDelegators());
  };

  useEffect(() => {
    void dispatch(getDelegates());
    void dispatch(getDelegators());
  }, []);

  return (
    <Box sx={{ marginRight: isMobile ? 0 : 2 }}>
      {error ? (
        <CourtesyPage
          icon={<RestorePageOutlined />}
          title={t('deleghe.error_title')}
          subtitle={t('deleghe.error_subtitle')}
          onClick={handleReloadClick}
          onClickLabel={t('deleghe.error_button')}
        />
      ) : (
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
              type === 'delegates'
                ? t('deleghe.confirm_revocation')
                : t('deleghe.confirm_rejection')
            }
          />
          <VerificationCodeModal
            open={verificationCodeOpen}
            code={verificationCode}
            name={verificationCodeName}
            handleClose={handleCloseVerificationCodeModal}
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
      )}
    </Box>
  );
};

export default Deleghe;
