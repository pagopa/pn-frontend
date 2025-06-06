import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Box, Stack, Step, StepLabel, Stepper } from '@mui/material';
import { AppResponsePublisher, Prompt, TitleBox, appStateActions } from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import PublicKeyDataInsert from '../components/IntegrazioneApi/NewPublicKey/PublicKeyDataInsert';
import ShowPublicKeyParams from '../components/IntegrazioneApi/NewPublicKey/ShowPublicKeyParams';
import {
  BffPublicKeyRequest,
  BffPublicKeyResponse,
  PublicKeyStatus,
} from '../generated-client/pg-apikeys';
import {
  BffTosPrivacyActionBodyActionEnum,
  Consent,
  ConsentType,
} from '../generated-client/tos-privacy';
import * as routes from '../navigation/routes.const';
import {
  acceptTosPrivacy,
  createPublicKey,
  getTosPrivacy,
  rotatePublicKey,
} from '../redux/apikeys/actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';

const StepperContainer: React.FC<{ children: React.ReactNode; activeStep: number }> = ({
  children,
  activeStep,
}) => {
  const { t } = useTranslation(['integrazioneApi', 'common']);
  const navigate = useNavigate();
  const steps = [
    t('new-public-key.steps.insert-data.title'),
    t('new-public-key.steps.get-returned-parameters.title'),
  ];

  return (
    <Stack display={'flex'} alignItems={'center'} justifyContent={'center'}>
      <Box p={3} sx={{ maxWidth: { xs: '100%', lg: '90%' } }}>
        <ButtonNaked
          size="medium"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(routes.INTEGRAZIONE_API)}
          data-testid="exitBtn"
        >
          {t('button.exit', { ns: 'common' })}
        </ButtonNaked>

        <TitleBox
          variantTitle="h4"
          title={t('new-public-key.title')}
          sx={{ mt: 2, mb: 3 }}
          subTitle={t('new-public-key.subtitle')}
          variantSubTitle="body1"
        />
        <Stepper activeStep={activeStep} alternativeLabel data-testid="stepper">
          {steps.map((label, index) => (
            <Step id={label} key={label} data-testid={`step-${index}`}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {children}
      </Box>
    </Stack>
  );
};

const NewPublicKey = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const [activeStep, setActiveStep] = useState(0);
  const [consent, setConsent] = useState<Consent>();
  const [creationResponse, setCreationResponse] = useState<BffPublicKeyResponse | undefined>(
    undefined
  );
  const [tosError, setTosError] = useState(false);

  const { kid } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);

  const isRotate: boolean = !!kid;

  const isActiveKey: boolean = !!(
    kid &&
    publicKeys.items.find((item) => item.kid === kid && item.status === PublicKeyStatus.Active)
  );

  useEffect(() => {
    if (isRotate && !isActiveKey) {
      // it's not a valid kid -> redirect to api dashboard
      navigate(routes.INTEGRAZIONE_API);
      dispatch(
        appStateActions.addError({
          title: '',
          message: t('messages.error.rotate-invalid-kid'),
          showTechnicalData: false,
        })
      );
      return;
    }

    // retrieve tos and privacy version
    dispatch(getTosPrivacy())
      .unwrap()
      .then((response) => {
        // server response contains an invalid consent version
        if (response.length === 0 || !response[0].consentVersion) {
          handleRetrieveTosError();
          return;
        }
        // eslint-disable-next-line functional/immutable-data
        setConsent(response[0]);
      })
      .catch(() => {});
  }, []);

  const handleRetrieveTosError = () => {
    setTosError(true);
    dispatch(
      appStateActions.addError({
        title: '',
        message: t('messages.error.no-tos-version'),
        showTechnicalData: false,
      })
    );
  };

  const handleAcceptTosError = () => {
    setTosError(true);
    dispatch(
      appStateActions.addError({
        title: '',
        message: t('messages.error.accept-tos-failed'),
        showTechnicalData: false,
      })
    );
  };

  const showSuccessMessage = () => {
    const message = kid
      ? 'messages.success.public-key-rotated'
      : 'messages.success.public-key-registered';
    dispatch(
      appStateActions.addSuccess({
        title: '',
        message: t(message),
      })
    );
  };

  const publicKeyRegistration = async (publicKey: BffPublicKeyRequest) => {
    if (!consent?.accepted) {
      try {
        await dispatch(
          acceptTosPrivacy([
            {
              action: BffTosPrivacyActionBodyActionEnum.Accept,
              version: consent?.consentVersion ?? '',
              type: ConsentType.TosDestB2B,
            },
          ])
        ).unwrap();
      } catch (error) {
        return handleAcceptTosError();
      }
    }

    const publicKeyAction = kid
      ? dispatch(rotatePublicKey({ kid, body: publicKey }))
      : dispatch(createPublicKey(publicKey));

    publicKeyAction
      .unwrap()
      .then((response: BffPublicKeyResponse) => {
        if (response.issuer) {
          setActiveStep((previousStep) => previousStep + 1);
          setCreationResponse(response);
          showSuccessMessage();
        }
      })
      .catch(() => {});
  };

  const checkPublicKeyValueAllowed = (pk: string | undefined) =>
    !publicKeys.items.find((key) => key.value === pk && key.status === PublicKeyStatus.Active);

  useEffect(() => {
    AppResponsePublisher.error.subscribe('acceptTosPrivacyB2B', handleAcceptTosError);
    AppResponsePublisher.error.subscribe('getTosPrivacyB2B', handleRetrieveTosError);

    return () => {
      AppResponsePublisher.error.unsubscribe('acceptTosPrivacyB2B', handleAcceptTosError);
      AppResponsePublisher.error.unsubscribe('getTosPrivacyB2B', handleRetrieveTosError);
    };
  }, [handleAcceptTosError, handleRetrieveTosError]);

  useEffect(() => {
    if (tosError) {
      navigate(routes.INTEGRAZIONE_API);
    }
  }, [tosError]);

  return (
    <Prompt
      disabled={activeStep === 1 || (isRotate && !isActiveKey) || tosError}
      title={t('new-public-key.prompt.title')}
      message={t('new-public-key.prompt.message')}
    >
      <StepperContainer activeStep={activeStep}>
        {activeStep === 0 ? (
          <PublicKeyDataInsert
            onConfirm={publicKeyRegistration}
            duplicateKey={checkPublicKeyValueAllowed}
            tosAccepted={consent?.accepted}
          />
        ) : (
          <ShowPublicKeyParams params={creationResponse} />
        )}
      </StepperContainer>
    </Prompt>
  );
};

export default NewPublicKey;
