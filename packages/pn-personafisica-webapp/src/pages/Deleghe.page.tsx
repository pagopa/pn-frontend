import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Stack } from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  EventMandateNotificationsListType,
  TitleBox,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import ConfirmationModal from '../components/Deleghe/ConfirmationModal';
import Delegates from '../components/Deleghe/Delegates';
import Delegators from '../components/Deleghe/Delegators';
import MobileDelegates from '../components/Deleghe/MobileDelegates';
import MobileDelegators from '../components/Deleghe/MobileDelegators';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import {
  acceptDelegation,
  getDelegates,
  getDelegators,
  rejectDelegation,
  revokeDelegation,
} from '../redux/delegation/actions';
import { closeAcceptModal, closeRevocationModal, resetState } from '../redux/delegation/reducers';
import { Delegation } from '../redux/delegation/types';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getSidemenuInformation } from '../redux/sidemenu/actions';
import { RootState } from '../redux/store';
import { TrackEventType } from '../utility/events';
import { trackEventByType } from '../utility/mixpanel';
import { DelegationStatus } from '../utility/status.utility';

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
  const [pageReady, setPageReady] = useState(false);

  const [errorMessage, setErrorMessage] = useState<{
    title: string;
    content: string;
  }>();

  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeRevocationModal());
  };

  const handleConfirmClick = () => {
    if (type === 'delegates') {
      trackEventByType(TrackEventType.SEND_MANDATE_REVOKED);
      void dispatch(revokeDelegation(id));
    } else {
      trackEventByType(TrackEventType.SEND_MANDATE_REJECTED);
      void dispatch(rejectDelegation(id));
    }
  };

  const handleCloseAcceptModal = () => {
    dispatch(closeAcceptModal());
  };

  const handleAccept = async (code: Array<string>) => {
    trackEventByType(TrackEventType.SEND_MANDATE_ACCEPTED);
    await dispatch(acceptDelegation({ id: acceptId, code: code.join('') }));
    void dispatch(getSidemenuInformation());
  };

  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );

  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const retrieveData = async () => {
    await dispatch(getDelegates());
    await dispatch(getDelegators());
    setPageReady(true);
  };

  const getDelegatorsDelegationCounts = (
    delegates: Array<Delegation>,
    delegators: Array<Delegation>
  ): EventMandateNotificationsListType => ({
    total_mandates_given_count: delegates.length,
    pending_mandates_given_count: delegates.filter((d) => d.status === DelegationStatus.PENDING)
      .length,
    active_mandates_given_count: delegates.filter((d) => d.status === DelegationStatus.ACTIVE)
      .length,
    total_mandates_received_count: delegators.length,
    pending_mandates_received_count: delegators.filter((d) => d.status === DelegationStatus.PENDING)
      .length,
    active_mandates_received_count: delegators.filter((d) => d.status === DelegationStatus.ACTIVE)
      .length,
  });

  useEffect(() => {
    void retrieveData();
    return () => {
      dispatch(resetState());
    };
  }, []);

  useEffect(() => {
    if (pageReady) {
      trackEventByType(
        TrackEventType.SEND_YOUR_MANDATES,
        getDelegatorsDelegationCounts(delegates, delegators)
      );
    }
  }, [pageReady]);

  const handleAcceptDelegationError = useCallback((errorResponse: AppResponse) => {
    const error = errorResponse.errors ? errorResponse.errors[0] : null;
    setErrorMessage(error?.message);
    trackEventByType(TrackEventType.SEND_MANDATE_ACCEPT_CODE_ERROR);
  }, []);

  useEffect(() => {
    AppResponsePublisher.error.subscribe('acceptDelegation', handleAcceptDelegationError);

    return () => {
      AppResponsePublisher.error.unsubscribe('acceptDelegation', handleAcceptDelegationError);
    };
  }, []);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box p={3}>
        <CodeModal
          title={t('deleghe.accept_title')}
          subtitle={t('deleghe.accept_description', { name: acceptName })}
          open={acceptOpen}
          initialValues={new Array(5).fill('')}
          cancelCallback={handleCloseAcceptModal}
          cancelLabel={t('button.indietro', { ns: 'common' })}
          confirmCallback={handleAccept}
          confirmLabel={t('deleghe.accept')}
          codeSectionTitle={t('deleghe.verification_code')}
          hasError={acceptError}
          errorTitle={errorMessage?.title}
          errorMessage={errorMessage?.content}
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
          <TitleBox
            title={t('deleghe.title')}
            variantTitle={'h4'}
            subTitle={t('deleghe.description')}
            variantSubTitle="body1"
          />
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
      </Box>
    </LoadingPageWrapper>
  );
};

export default Deleghe;
