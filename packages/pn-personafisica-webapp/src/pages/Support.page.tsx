import { useReducer, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import * as yup from 'yup';

import { Box, Button, Paper, Stack, TextField, Typography } from '@mui/material';
import { Prompt, TitleBox } from '@pagopa-pn/pn-commons';
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
  const [params] = useSearchParams();
  const rawData = params.get('data');
  
  const dataSchema = yup.object({
    traceId: yup.string().required(),
    errorCode: yup.string().required(),
  });
  // eslint-disable-next-line functional/no-let
  let data: { traceId: string; errorCode: string } | null = null;
  if (rawData !== null) {
    try{
      const parsed = JSON.parse(decodeURIComponent(rawData));
      data = dataSchema.validateSync(parsed);
    } catch(e){
      console.error('Param "data" is not properly formatted:', e);
      data = null;
    };
  }
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
    action_url: '',
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
      dispatch(
        zendeskAuthorization(
          data ? { email: formData.email.value, data } : { email: formData.email.value }
        )
      )
        .unwrap()
        .then((response) => {
          setZendeskAuthData(response);
        })
        .catch(() => {});
    }
  };

  return (
    <Prompt title={t('exit-title')} message={t('exit-message')}>
      <Stack alignItems="center" sx={{ flexGrow: 1 }}>
        <Box width={{ xs: 0.8, sm: 0.5 }}>
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
            flexDirection={{ xs: 'column', sm: 'row-reverse' }}
            justifyContent="space-between"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="small"
              sx={{ width: { xs: 1, sm: 'auto' } }}
              disabled={!!formData.errors}
              onClick={handleConfirm}
              data-testid="continueButton"
            >
              {t('button.continue', { ns: 'common' })}
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{ mt: { xs: 2, sm: 0 }, width: { xs: 1, sm: 'auto' } }}
              onClick={handleCancel}
              data-testid="backButton"
            >
              {t('button.indietro', { ns: 'common' })}
            </Button>
          </Box>
        </Box>
        <ZendeskForm data={zendeskAuthData} />
      </Stack>
    </Prompt>
  );
};

export default SupportPage;
