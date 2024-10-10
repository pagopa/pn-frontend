import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Step, StepLabel, Stepper } from '@mui/material';
import {
  AppResponsePublisher,
  PnBreadcrumb,
  Prompt,
  TitleBox,
  appStateActions,
} from '@pagopa-pn/pn-commons';

import PublicKeyDataInsert from '../components/IntegrazioneApi/NewPublicKey/PublicKeyDataInsert';
import ShowPublicKeyParams from '../components/IntegrazioneApi/NewPublicKey/ShowPublicKeyParams';
import {
  BffPublicKeyRequest,
  BffPublicKeyResponse,
  PublicKeyStatus,
} from '../generated-client/pg-apikeys';
import { BffTosPrivacyActionBodyActionEnum, ConsentType } from '../generated-client/tos-privacy';
import * as routes from '../navigation/routes.const';
import {
  acceptTosPrivacy,
  checkPublicKeyIssuer,
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
  const steps = [
    t('new-public-key.steps.insert-data.title'),
    t('new-public-key.steps.get-returned-parameters.title'),
  ];

  return (
    <Box p={3} sx={{ maxWidth: { xs: '100%', lg: '70%' } }}>
      <PnBreadcrumb
        linkRoute={routes.INTEGRAZIONE_API}
        linkLabel={t('title')}
        currentLocationLabel={t('new-public-key.title')}
        goBackLabel={t('button.exit', { ns: 'common' })}
      />
      <TitleBox
        variantTitle="h4"
        title={t('new-public-key.title')}
        sx={{ pt: '20px', mb: 4 }}
        subTitle={t('new-public-key.subtitle')}
        variantSubTitle="body1"
      />
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{ marginTop: '60px' }}
        data-testid="stepper"
      >
        {steps.map((label, index) => (
          <Step
            id={label}
            key={label}
            sx={{ cursor: index < activeStep ? 'pointer' : 'auto' }}
            data-testid={`step-${index}`}
          >
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {children}
    </Box>
  );
};

const NewPublicKey = () => {
  const { t } = useTranslation(['integrazioneApi']);
  const [activeStep, setActiveStep] = useState(0);
  const [isTosAccepted, setIsTosAccepted] = useState<boolean | undefined>();
  const [tosVersion, setTosVersion] = useState<string | undefined>('1');
  const [creationResponse, setCreationResponse] = useState<BffPublicKeyResponse | undefined>(
    undefined
  );
  
  const { kid } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);

  // const kid = searchParams.get('kid');

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
        })
      );
    }

    // verify if tos are accepted
    void dispatch(checkPublicKeyIssuer())
      .unwrap()
      .then((response) => {
        setIsTosAccepted(() => response.tosAccepted);
      });

    // retrieve tos and privacy version
    void dispatch(getTosPrivacy())
      .unwrap()
      .then((response) => {
        // server response contains an invalid consent version
        if (response.length === 0 || !response[0].consentVersion) {
          navigate(routes.INTEGRAZIONE_API);
          dispatch(
            appStateActions.addError({
              title: '',
              message: t('messages.error.no-tos-version'),
            })
          );
          return;
        }
        setTosVersion(() => response[0].consentVersion);
      });
  }, []);

  const handleCreate = (publicKey: BffPublicKeyRequest): Promise<BffPublicKeyResponse> =>
    dispatch(createPublicKey(publicKey)).unwrap();

  const handleRotate = (
    kid: string,
    publicKey: BffPublicKeyRequest
  ): Promise<BffPublicKeyResponse> => dispatch(rotatePublicKey({ kid, body: publicKey })).unwrap();

  const handleErrorTosPrivacy = () => {
    dispatch(
      appStateActions.addError({
        title: '',
        message: t('messages.error.accept-tos-failed'),
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
    if (!isTosAccepted) {
      const acceptTosResponse = await dispatch(
        acceptTosPrivacy([
          {
            action: BffTosPrivacyActionBodyActionEnum.Accept,
            version: tosVersion ?? '',
            type: ConsentType.TosDestB2B,
          },
        ])
      );

      if (acceptTosResponse.meta.requestStatus === 'rejected') {
        return handleErrorTosPrivacy();
      }
    }
    const returnedPromise = kid ? handleRotate(kid, publicKey) : handleCreate(publicKey);

    returnedPromise
      .then((response: BffPublicKeyResponse) => {
        if (response.issuer) {
          setActiveStep((previousStep) => previousStep + 1);
          setCreationResponse(response);
          showSuccessMessage();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkPublicKeyValueAllowed = (pk: string | undefined) =>
    !publicKeys.items.find((key) => key.value === pk && key.status === PublicKeyStatus.Active);

  useEffect(() => {
    AppResponsePublisher.error.subscribe('acceptTosPrivacyB2B', handleErrorTosPrivacy);
    AppResponsePublisher.error.subscribe('getTosPrivacyB2B', handleErrorTosPrivacy);

    return () => {
      AppResponsePublisher.error.unsubscribe('acceptTosPrivacyB2B', handleErrorTosPrivacy);
      AppResponsePublisher.error.subscribe('getTosPrivacyB2B', handleErrorTosPrivacy);
    };
  }, []);

  return (
    <>
      {activeStep === 0 && !((isRotate && !isActiveKey) || !tosVersion) ? (
        <Prompt
          title={t('new-public-key.prompt.title')}
          message={t('new-public-key.prompt.message')}
        >
          <StepperContainer activeStep={activeStep}>
            <PublicKeyDataInsert
              onConfirm={publicKeyRegistration}
              duplicateKey={checkPublicKeyValueAllowed}
            />
          </StepperContainer>
        </Prompt>
      ) : (
        <StepperContainer activeStep={activeStep}>
          <ShowPublicKeyParams params={creationResponse} />
        </StepperContainer>
      )}
    </>
  );
};

export default NewPublicKey;
