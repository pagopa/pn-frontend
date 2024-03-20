import { useReducer, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Box, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import { Prompt, TitleBox, useIsMobile } from '@pagopa-pn/pn-commons';
import { ValidationError } from '@pagopa-pn/pn-validator';
import { ButtonNaked } from '@pagopa/mui-italia';

import ZendeskForm from '../components/Support/ZendeskForm';
import { SupportForm, ZendeskAuthorizationDTO } from '../models/Support';
import { useAppDispatch } from '../redux/hooks';
import { zendeskAuthorization } from '../redux/support/actions';
import { getConfiguration } from '../services/configuration.service';
import validator from '../validators/SupportFormValidator';

type FormState = {
  email: {
    touched: boolean;
    value: string;
  };
  confirmEmail: {
    touched: boolean;
    value: string;
  };
  errors: null | ValidationError<SupportForm>;
};

const reducer = (state: FormState, action: { type: string; payload: string }) => {
  switch (action.type) {
    case 'UPDATE_EMAIL':
      return {
        ...state,
        email: {
          value: action.payload,
          touched: true,
        },
        errors: validator.validate({
          email: action.payload,
          confirmEmail: state.confirmEmail.value,
        }),
      };
    case 'UPDATE_CONFIRM_EMAIL':
      return {
        ...state,
        confirmEmail: {
          value: action.payload,
          touched: true,
        },
        errors: validator.validate({
          email: state.email.value,
          confirmEmail: action.payload,
        }),
      };
    default:
      return state;
  }
};

const SupportPPButton: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { PAGOPA_HELP_PP } = getConfiguration();
  const handleClick = () => {
    window.location.assign(PAGOPA_HELP_PP);
  };

  return (
    <ButtonNaked sx={{ verticalAlign: 'top' }} onClick={handleClick}>
      <Typography variant="body2" color="primary" display="inline">
        {children}
      </Typography>
    </ButtonNaked>
  );
};

const SupportPage: React.FC = () => {
  const { t } = useTranslation(['support', 'common']);
  const isMobile = useIsMobile();
  const [formData, formDispatch] = useReducer(reducer, {
    email: {
      value: '',
      touched: false,
    },
    confirmEmail: {
      value: '',
      touched: false,
    },
    errors: validator.validate({ email: '', confirmEmail: '' }),
  });
  const [zendeskAuthData, setZendeskAuthData] = useState<ZendeskAuthorizationDTO>({
    action: '',
    return_to: '',
    jwt: '',
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleChange = (
    type: 'UPDATE_EMAIL' | 'UPDATE_CONFIRM_EMAIL',
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    formDispatch({ type, payload: event.target.value });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleConfirm = () => {
    if (!formData.errors) {
      dispatch(zendeskAuthorization(formData.email.value))
        .unwrap()
        .then((response) => {
          setZendeskAuthData(response);
        })
        .catch(() => {});
    }
  };

  return (
    <Prompt
      title={t('exit-title')}
      message={t('exit-message')}
      eventTrackingCallbackPromptOpened={() => {}} // impostare eventi tracking previsti
      eventTrackingCallbackCancel={() => {}} // impostare eventi tracking previsti
      eventTrackingCallbackConfirm={() => {}} // impostare eventi tracking previsti
    >
      <Grid container justifyContent="center" alignContent="center">
        <Grid item xs={6}>
          <TitleBox
            mtGrid={3}
            title={t('title')}
            variantTitle="h3"
            subTitle={t('sub-title')}
            variantSubTitle="body1"
          />
          <Paper sx={{ p: 3, mt: 4 }}>
            <form data-testid="supportForm">
              <TextField
                id="mail"
                label={t('form.email')}
                name="mail"
                size="small"
                type="mail"
                fullWidth
                onChange={(e) => handleChange('UPDATE_EMAIL', e)}
                value={formData.email.value}
                error={formData.email.touched && !!formData.errors?.email}
                helperText={
                  formData.email.touched &&
                  !!formData.errors?.email &&
                  t('form.errors.' + formData.errors?.email)
                }
              />
              <TextField
                id="confirmMail"
                label={t('form.confirm-email')}
                name="confirmMail"
                size="small"
                type="mail"
                fullWidth
                sx={{ mt: 4 }}
                onChange={(e) => handleChange('UPDATE_CONFIRM_EMAIL', e)}
                value={formData.confirmEmail.value}
                error={formData.confirmEmail.touched && !!formData.errors?.confirmEmail}
                helperText={
                  formData.confirmEmail.touched &&
                  !!formData.errors?.confirmEmail &&
                  t('form.errors.' + formData.errors?.confirmEmail)
                }
              />
            </form>
          </Paper>
          <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
            <Trans
              ns={'support'}
              i18nKey={'disclaimer'}
              components={[<SupportPPButton key="support-pp-button" />]}
              variant="body2"
            />
          </Typography>
          <Box
            sx={{ my: 3 }}
            display="flex"
            flexDirection={isMobile ? 'column' : 'row-reverse'}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="small"
              fullWidth={isMobile}
              disabled={!!formData.errors}
              onClick={handleConfirm}
              data-testid="continueButton"
            >
              {t('button.continue', { ns: 'common' })}
            </Button>
            <Button
              variant="outlined"
              size="small"
              fullWidth={isMobile}
              sx={{ mt: isMobile ? 2 : 0 }}
              onClick={handleCancel}
              data-testid="backButton"
            >
              {t('button.indietro', { ns: 'common' })}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ZendeskForm data={zendeskAuthData} />
    </Prompt>
  );
};

export default SupportPage;
