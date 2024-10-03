import { useEffect, useState } from "react";
import {
    useNavigate,
  useSearchParams
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import { appStateActions, PnBreadcrumb, Prompt, TitleBox, useIsMobile } from "@pagopa-pn/pn-commons";
import { Box, Grid, Step, StepLabel, Stepper } from "@mui/material";

import * as routes from '../navigation/routes.const';
import PublicKeyDataInsert from "../components/IntegrazioneApi/NewPublicKey/PublicKeyDataInsert";
import ShowPublicKeyParams from "../components/IntegrazioneApi/NewPublicKey/ShowPublicKeyParams";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { RootState } from "../redux/store";
import { createPublicKey, rotatePublicKey } from "../redux/apikeys/actions";
import { BffPublicKeyRequest, BffPublicKeyResponse, PublicKeyStatus } from "../generated-client/pg-apikeys";

const NewPublicKey = () => {
    const { t } = useTranslation(['common', 'integrazioneApi']);
    const isMobile = useIsMobile();
    const [activeStep, setActiveStep] = useState(0);
    // const [isTosAccepted, setIsTosAccepted] = useState<boolean | undefined>();
    const [creationResponse, setCreationResponse] = useState<BffPublicKeyResponse | undefined>(undefined);
    const [searchParams] = useSearchParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // verify if tos are accepted
        // void dispatch(checkPublicKeyIssuer()).then((response) => console.log(response));
        if(isRotate && !activeKey) {
            // redirectApiDashboard();
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
    }, []);

    const publicKeys = useAppSelector((state: RootState) => state.apiKeysState.publicKeys);
    
    const kid = searchParams.get("kid");
    
    const isRotate: boolean = !!kid;
    
    const activeKey: boolean = !!(kid && publicKeys.items.find(item => item.kid === kid && item.status === PublicKeyStatus.Active));
    
    // const redirectApiDashboard = () => {
    //     setInterval(() => {
    //         // navigate(routes.INTEGRAZIONE_API);
    //     }, 200);
    // };

    const dispatchCreate = (publicKey: BffPublicKeyRequest) => dispatch(createPublicKey(publicKey))
        .unwrap()
        .then((response: BffPublicKeyResponse) => {
            if(response.issuer) {
                setActiveStep((previousStep) => previousStep + 1);
                setCreationResponse(response);
            }
        })
        .catch(error => {
            console.error(error);
        });

    const dispatchRotate = (kid: string, publicKey: BffPublicKeyRequest) => dispatch(rotatePublicKey({kid, body: publicKey}))
        .unwrap()
        .then((response: BffPublicKeyResponse) => {
            if(response.issuer) {
                setActiveStep((previousStep) => previousStep + 1);
                setCreationResponse(response);
            }
        })
        .catch(error => {
            console.error(error);
        });
    
    const publicKeyRegistration = async (publicKey: BffPublicKeyRequest) => {
        if(kid){
            await dispatchRotate(kid, publicKey);
        }
        else {
            await dispatchCreate(publicKey);
        }
    
    // const publicKeyRegistration = async (publicKey: BffPublicKeyRequest) => {
    //     const dispatchAction = isRotate? rotatePublicKey({ kid: kid ?? '', body: publicKey}) : createPublicKey(publicKey);

    //     // eslint-disable-next-line functional/no-let
    //     let params = kid ? { kid, body: publicKey} : publicKey;
        
    //     dispatch(dispatchAction)
    //     .unwrap()
    //     .then((response: BffPublicKeyResponse) => {
    //         if(response.issuer) {
    //             setActiveStep((previousStep) => previousStep + 1);
    //             setCreationResponse(response);
    //         }
    //     })
    //     .catch(error => {
    //         console.error(error);
    //     });
        
    };

    const steps = [
      t('new-public-key.steps.insert-data.title', { ns: 'integrazioneApi' }),
      t('new-public-key.steps.get-returned-parameters.title', { ns: 'integrazioneApi' }),
    ];

    return (
        <Prompt
          title={t('new-public-key.prompt.title', { ns: 'integrazioneApi' })}
          message={t('new-public-key.prompt.message', { ns: 'integrazioneApi' })}
        >
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
    
                {activeStep === 0 && (
                  <PublicKeyDataInsert onConfirm={publicKeyRegistration} />
                )}
                {activeStep === 1 && (
                    <ShowPublicKeyParams params={creationResponse} />
                )}
              </Grid>
            </Grid>
          </Box>
        </Prompt>
      );
};

export default NewPublicKey;