import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  appStateActions,
  PnBreadcrumb,
  Prompt,
  TitleBox,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { Box, Grid, Step, StepLabel, Stepper } from '@mui/material';

import * as routes from '../navigation/routes.const';
import PublicKeyDataInsert from '../components/IntegrazioneApi/NewPublicKey/PublicKeyDataInsert';
import ShowPublicKeyParams from '../components/IntegrazioneApi/NewPublicKey/ShowPublicKeyParams';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { acceptTosPrivacy, checkPublicKeyIssuer, createPublicKey, rotatePublicKey } from '../redux/apikeys/actions';
import {
  BffPublicKeyRequest,
  BffPublicKeyResponse,
  PublicKeyStatus,
} from '../generated-client/pg-apikeys';
import { BffTosPrivacyActionBodyActionEnum, ConsentType } from '../generated-client/tos-privacy';

const NewPublicKey = () => {
  const { t } = useTranslation(['common', 'integrazioneApi']);
  const isMobile = useIsMobile();
  const [activeStep, setActiveStep] = useState(0);
  const [isTosAccepted, setIsTosAccepted] = useState<boolean | undefined>();
  const [creationResponse, setCreationResponse] = useState<BffPublicKeyResponse | undefined>(
    undefined
  );
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);

  const kid = searchParams.get('kid');

  const isRotate: boolean = !!kid;

  const isActiveKey: boolean = 
    !!(
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
          message: t('message.error.rotate-invalid-kid', {
            ns: 'integrazioneApi',
          }),
        })
      );
    }
    
    // verify if tos are accepted
    void dispatch(checkPublicKeyIssuer()).unwrap().then((response) => {
      setIsTosAccepted(() => response.tosAccepted);
    });
  }, []);

  const handleCreate = (publicKey: BffPublicKeyRequest): Promise<BffPublicKeyResponse> =>
    dispatch(createPublicKey(publicKey)).unwrap();

  const handleRotate = (
    kid: string,
    publicKey: BffPublicKeyRequest
  ): Promise<BffPublicKeyResponse> => dispatch(rotatePublicKey({ kid, body: publicKey })).unwrap();

 
  const publicKeyRegistration = async (publicKey: BffPublicKeyRequest) => {
    // if tos not accepted -> accept
    if(!isTosAccepted){
      await dispatch(acceptTosPrivacy([{
        action: BffTosPrivacyActionBodyActionEnum.Accept,
        version: "1", // ???
        type: ConsentType.TosDestB2B
      }]));
    }
    const returned = kid ? handleRotate(kid, publicKey) : handleCreate(publicKey);

    returned
      .then((response: BffPublicKeyResponse) => {
        if (response.issuer) {
          setActiveStep((previousStep) => previousStep + 1);
          setCreationResponse(response);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const checkPublicKeyValueAllowed = (pk: string | undefined) => !publicKeys.items.find((key) => key.value === pk && key.status === PublicKeyStatus.Active);

  const steps = [
    t('new-public-key.steps.insert-data.title', { ns: 'integrazioneApi' }),
    t('new-public-key.steps.get-returned-parameters.title', { ns: 'integrazioneApi' }),
  ];

  const StepperContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box p={3}>
      <Grid container sx={{ padding: isMobile ? '0 20px' : 0 }}>
        <Grid item xs={12} lg={8}>
          <PnBreadcrumb
            linkRoute={routes.INTEGRAZIONE_API}
            linkLabel={t('title', { ns: 'integrazioneApi' })}
            currentLocationLabel={t('new-public-key.title', { ns: 'integrazioneApi' })}
            goBackLabel={t('button.exit', { ns: 'common' })}
          />
          <TitleBox
            variantTitle="h4"
            title={t('new-public-key.title', { ns: 'integrazioneApi' })}
            sx={{ pt: '20px', mb: 4 }}
            subTitle={t('new-public-key.subtitle', { ns: 'integrazioneApi' })}
            variantSubTitle="body1"
          ></TitleBox>
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
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <>
      {activeStep === 0 && !(isRotate && !isActiveKey) ? (
        <Prompt
          title={t('new-public-key.prompt.title', { ns: 'integrazioneApi' })}
          message={t('new-public-key.prompt.message', { ns: 'integrazioneApi' })}
        >
          <StepperContainer>
            <PublicKeyDataInsert onConfirm={publicKeyRegistration} duplicateKey={checkPublicKeyValueAllowed} />
          </StepperContainer>
        </Prompt>
      ) : (
        <StepperContainer>
          <ShowPublicKeyParams params={creationResponse} />
        </StepperContainer>
      )}
    </>
  );
};

export default NewPublicKey;
