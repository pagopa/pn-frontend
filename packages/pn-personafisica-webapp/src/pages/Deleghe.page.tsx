import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Button, Stack } from '@mui/material';
import {
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  ConfirmationModal,
  ErrorMessage,
  TitleBox,
  appStateActions,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import Delegates from '../components/Deleghe/Delegates';
import Delegators from '../components/Deleghe/Delegators';
import MobileDelegates from '../components/Deleghe/MobileDelegates';
import MobileDelegators from '../components/Deleghe/MobileDelegators';
import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import { PFEventsType } from '../models/PFEventsType';
import {
  acceptMandate,
  getMandatesByDelegate,
  getMandatesByDelegator,
  rejectMandate,
  revokeMandate,
} from '../redux/delegation/actions';
import { closeAcceptModal, closeRevocationModal, resetState } from '../redux/delegation/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getSidemenuInformation } from '../redux/sidemenu/actions';
import { RootState } from '../redux/store';
import PFEventStrategyFactory from '../utility/MixpanelUtils/PFEventStrategyFactory';

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
  const [pageReady, setPageReady] = useState(false);
  const codeModalRef = useRef<{
    updateError: (error: ErrorMessage, codeNotValid: boolean) => void;
  }>(null);

  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeRevocationModal());
  };

  const handleConfirmClick = () => {
    if (type === 'delegates') {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_MANDATE_REVOKED);
      dispatch(revokeMandate(id))
        .unwrap()
        .then(() => {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_MANDATE_GIVEN, { delegators });
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t('deleghe.revoke-successfully'),
            })
          );
        })
        .catch(() => {});
    } else {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_MANDATE_REJECTED);
      dispatch(rejectMandate(id))
        .unwrap()
        .then(() => {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_HAS_MANDATE, { delegates });
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t('deleghe.reject-successfully'),
            })
          );
        })
        .catch(() => {});
    }
  };

  const handleCloseAcceptModal = () => {
    dispatch(closeAcceptModal());
  };

  const handleAccept = (code: string) => {
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_MANDATE_ACCEPTED);
    dispatch(acceptMandate({ id: acceptId, code }))
      .unwrap()
      .then(() => {
        void dispatch(getSidemenuInformation());
      })
      .catch(() => {});
  };

  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );

  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const retrieveData = async () => {
    await dispatch(getMandatesByDelegator());
    await dispatch(getMandatesByDelegate());
    setPageReady(true);
  };

  useEffect(() => {
    void retrieveData();
    return () => {
      dispatch(resetState());
    };
  }, []);

  useEffect(() => {
    if (pageReady) {
      PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_YOUR_MANDATES, {
        delegates,
        delegators,
      });
    }
  }, [pageReady]);

  const handleAcceptDelegationError = useCallback((errorResponse: AppResponse) => {
    const error = errorResponse.errors ? errorResponse.errors[0] : null;
    codeModalRef.current?.updateError(
      { title: error?.message.title || '', content: error?.message.content || '' },
      true
    );
    PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_MANDATE_ACCEPT_CODE_ERROR);
  }, []);

  useEffect(() => {
    AppResponsePublisher.error.subscribe('acceptMandate', handleAcceptDelegationError);

    return () => {
      AppResponsePublisher.error.unsubscribe('acceptMandate', handleAcceptDelegationError);
    };
  }, []);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box p={3}>
        <CodeModal
          title={t('deleghe.accept_title')}
          subtitle={t('deleghe.accept_description', { name: acceptName })}
          open={acceptOpen}
          codeLength={5}
          cancelCallback={handleCloseAcceptModal}
          cancelLabel={t('button.indietro', { ns: 'common' })}
          confirmCallback={handleAccept}
          confirmLabel={t('deleghe.accept')}
          codeSectionTitle={t('deleghe.verification_code')}
          ref={codeModalRef}
        />
        <ConfirmationModal
          open={open}
          title={
            type === 'delegates'
              ? t('deleghe.revocation_question')
              : t('deleghe.rejection_question')
          }
          slots={{
            confirmButton: Button,
            closeButton: Button,
          }}
          slotsProps={{
            closeButton: {
              onClick: handleCloseModal,
              children: t('button.annulla', { ns: 'common' }),
            },
            confirmButton: {
              onClick: handleConfirmClick,
              children:
                type === 'delegates'
                  ? t('deleghe.confirm_revocation')
                  : t('deleghe.confirm_rejection'),
            },
          }}
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
