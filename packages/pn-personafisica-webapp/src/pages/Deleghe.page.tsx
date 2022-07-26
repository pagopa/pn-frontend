import { useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import { CodeModal, TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { Trans, useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import {
  closeRevocationModal,
  rejectDelegation,
  revokeDelegation,
  getDelegates,
  getDelegators,
  closeAcceptModal,
  acceptDelegation,
  resetDelegationsState,
} from '../redux/delegation/actions';
import ConfirmationModal from '../component/Deleghe/ConfirmationModal';
import MobileDelegates from '../component/Deleghe/MobileDelegates';
import MobileDelegators from '../component/Deleghe/MobileDelegators';
import Delegates from '../component/Deleghe/Delegates';
import Delegators from '../component/Deleghe/Delegators';
import { getSidemenuInformation } from '../redux/sidemenu/actions';
import { trackEventByType } from "../utils/mixpanel";
import { TrackEventType } from "../utils/events";

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
    error: acceptError,
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

  const handleCloseAcceptModal = () => {
    dispatch(closeAcceptModal());
  };

  const handleAccept = async (code: Array<string>) => {
    await dispatch(acceptDelegation({ id: acceptId, code: code.join('') }));
    void dispatch(getDelegators());
    void dispatch(getSidemenuInformation);
    trackEventByType(TrackEventType.DELEGATION_DELEGATOR_ACCEPT);
  };

  useEffect(() => {
    void dispatch(getDelegates());
    void dispatch(getDelegators());
    return () => {
      dispatch(resetDelegationsState);
    };
  }, []);

  return (
    <Box p={3}>
      <>
        <CodeModal
          title={t('deleghe.accept_title')}
          subtitle={t('deleghe.accept_description', { name: acceptName })}
          open={acceptOpen}
          initialValues={new Array(5).fill('')}
          handleClose={handleCloseAcceptModal}
          cancelCallback={handleCloseAcceptModal}
          cancelLabel={t('button.indietro', { ns: 'common' })}
          confirmCallback={handleAccept}
          confirmLabel={t('deleghe.accept')}
          codeSectionTitle={t('deleghe.verification_code')}
          hasError={acceptError}
          errorMessage={t('deleghe.invalid_code')}
        />
        <ConfirmationModal
          open={open}
          title={
            type === 'delegates'
              ? t('deleghe.revocation_question')
              : t('deleghe.rejection_question')
          }
          onCloseLabel={t('button.annulla', { ns: 'common' })}
          handleClose={handleCloseModal}
          onConfirm={handleConfirmClick}
          onConfirmLabel={
            type === 'delegates' ? t('deleghe.confirm_revocation') : t('deleghe.confirm_rejection')
          }
        />
        <Box mb={8}>
          <TitleBox title={t('deleghe.title')} variantTitle={'h4'}>
            <Trans ns={'deleghe'} i18nKey="deleghe.description" t={t}>
              deleghe.description
            </Trans>
          </TitleBox>
        </Box>
        {isMobile ? (
          <Stack direction="column" spacing={8}>
            <MobileDelegates />
            <MobileDelegators />
          </Stack>
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
