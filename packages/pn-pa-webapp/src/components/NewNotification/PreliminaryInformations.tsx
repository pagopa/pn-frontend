/* eslint-disable complexity */
// TODO: refactor
import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import {
  ApiErrorWrapper,
  CustomDropdown,
  PhysicalCommunicationType,
  dataRegex,
} from '@pagopa-pn/pn-commons';
import { LANGUAGES } from '@pagopa-pn/pn-commons/src/utility/costants';
import { LangCode } from '@pagopa/mui-italia';

import {
  BILINGUALISM_LANGUAGES,
  NewNotification,
  NewNotificationLangOther,
  PaymentModel,
} from '../../models/NewNotification';
import { GroupStatus } from '../../models/user';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { NEW_NOTIFICATION_ACTIONS, getUserGroups } from '../../redux/newNotification/actions';
import { setPreliminaryInformations } from '../../redux/newNotification/reducers';
import { PreliminaryInformationsPayload } from '../../redux/newNotification/types';
import { RootState } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';
import { requiredStringFieldValidation } from '../../utility/validation.utility';
import { FormBox } from '../FormBox/FormBox';
import { FormBoxSubtitle } from '../FormBox/FormBoxSubtitle';
import { FormBoxTitle } from '../FormBox/FormBoxTitle';
import NewNotificationCard from './NewNotificationCard';

type Props = {
  notification: NewNotification;
  onConfirm: () => void;
};

/* eslint-disable-next-line sonarjs/cognitive-complexity */ // TODO: refactor
const PreliminaryInformations = ({ notification, onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state: RootState) => state.newNotificationState.groups);
  const hasGroups = useAppSelector(
    (state: RootState) => state.userState.user.organization.hasGroups
  );

  // this is the initial value of the sender denomination. it used to show the error
  const senderDenomination = useAppSelector((state: RootState) =>
    state.userState.user.organization.rootParent?.description
      ? state.userState.user.organization.rootParent?.description +
        ' - ' +
        state.userState.user.organization.name
      : state.userState.user.organization.name
  );

  const { t, i18n } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.preliminary-informations',
  });
  const { t: tc } = useTranslation(['common']);
  const { IS_PAYMENT_ENABLED } = useMemo(() => getConfiguration(), []);

  const languages = useMemo(() => {
    const currentLang = i18n.language?.substring(0, 2) as LangCode;
    return LANGUAGES[currentLang] ?? LANGUAGES.it;
  }, [i18n.language]);

  const initialValues = useCallback(
    () => ({
      paProtocolNumber: notification.paProtocolNumber || '',
      subject: notification.subject || '',
      senderDenomination: notification.senderDenomination ?? '',
      abstract: notification.abstract ?? '',
      group: notification.group ?? '',
      taxonomyCode: notification.taxonomyCode || '',
      physicalCommunicationType: notification.physicalCommunicationType || '',
      paymentMode: notification.paymentMode || (IS_PAYMENT_ENABLED ? '' : PaymentModel.NOTHING),
      lang: notification.lang || 'it',
      additionalLang: notification.additionalLang || '',
      additionalSubject: notification.additionalSubject || '',
      additionalAbstract: notification.additionalAbstract || '',
    }),
    [notification, IS_PAYMENT_ENABLED]
  );

  const validationSchema = yup.object({
    paProtocolNumber: requiredStringFieldValidation(tc, 256),
    subject: requiredStringFieldValidation(tc, 134, 10),
    senderDenomination: yup
      .string()
      .required(`${t('sender-denomination')} ${tc('required')}`)
      .max(80, tc('too-long-field-error', { maxLength: 80 })),
    abstract: yup
      .string()
      .max(1024, tc('too-long-field-error', { maxLength: 1024 }))
      .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges')),
    physicalCommunicationType: yup.string().required(),
    paymentMode: yup.string().required(),
    group: hasGroups ? yup.string().required() : yup.string(),
    taxonomyCode: yup
      .string()
      .required(`${t('taxonomy-id')} ${tc('required')}`)
      .test('taxonomyCodeTest', `${t('taxonomy-id')} ${tc('invalid')}`, (value) =>
        dataRegex.taxonomyCode.test(value as string)
      ),
    lang: yup.string().required(),
    // TODO additionalLang,additionalSubject,additionalAbstract
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    /** onSubmit validate */
    onSubmit: (values) => {
      if (formik.isValid) {
        dispatch(setPreliminaryInformations(values as PreliminaryInformationsPayload));
        onConfirm();
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleChangeDeliveryMode = (e: ChangeEvent & { target: { value: any } }) => {
    formik.handleChange(e);
  };

  const handleChangePaymentMode = (e: ChangeEvent & { target: { value: any } }) => {
    formik.handleChange(e);
  };

  const handleChangeLanguage = (e: ChangeEvent & { target: { value: any } }) => {
    formik.handleChange(e);
  };

  const fetchGroups = useCallback(() => {
    void dispatch(getUserGroups(GroupStatus.ACTIVE));
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return (
    <ApiErrorWrapper
      apiId={NEW_NOTIFICATION_ACTIONS.GET_USER_GROUPS}
      reloadAction={() => fetchGroups()}
      mainText={t('fetch-groups-error')}
      mt={3}
    >
      <form onSubmit={formik.handleSubmit} data-testid="preliminaryInformationsForm">
        <NewNotificationCard isContinueDisabled={!formik.isValid} title={t('title')}>
          <Typography variant="body2">{tc('required-fields')}</Typography>
          <FormBox>
            <FormBoxTitle text={t('sender-denomination')} />
            <TextField
              id="senderDenomination"
              label={`${t('sender-denomination')}*`}
              fullWidth
              name="senderDenomination"
              value={formik.values.senderDenomination}
              onChange={handleChangeTouched}
              error={Boolean(formik.errors.senderDenomination)}
              disabled={senderDenomination.length < 80}
              helperText={formik.errors.senderDenomination}
              size="small"
              margin="normal"
            />
          </FormBox>

          <FormBox>
            <FormControl margin="normal" fullWidth>
              <FormLabel id="notification-language-label">
                <FormBoxTitle text={t('notification-language')} />
              </FormLabel>
              <FormBoxSubtitle text={t('notification-language-subtitle')} />
              <RadioGroup
                aria-labelledby="notification-language-label"
                name="lang"
                value={formik.values.lang}
                row
                onChange={handleChangeLanguage}
              >
                <FormControlLabel
                  value={'it'}
                  control={<Radio />}
                  label={languages.it}
                  data-testid="notificationLanguageRadio"
                />
                <FormControlLabel
                  value={NewNotificationLangOther}
                  control={<Radio />}
                  label={t('other-language')}
                  data-testid="notificationLanguageRadio"
                />
              </RadioGroup>
            </FormControl>
            {formik.values.lang === NewNotificationLangOther && (
              <CustomDropdown
                id="additionalLang"
                label={`${t('select-other-language')}*`}
                name="additionalLang"
                size="small"
                margin="normal"
                value={formik.values.additionalLang}
                onChange={handleChangeTouched}
              >
                {Object.keys(languages)
                  .filter((key) => BILINGUALISM_LANGUAGES.includes(key))
                  .map((key) => (
                    <MenuItem key={key} value={key}>
                      {languages[key as LangCode]}
                    </MenuItem>
                  ))}
              </CustomDropdown>
            )}
          </FormBox>
          <FormBox>
            <FormBoxTitle text={t('notification-content')} />
            <FormBoxSubtitle text={t('notification-content-subtitle')} />
            {formik.values.lang === NewNotificationLangOther && (
              <Typography
                variant="body2"
                color={'text.secondary'}
                marginTop={'16px'}
                fontWeight={600}
              >
                {languages.it}
              </Typography>
            )}
            <TextField
              id="subject"
              label={`${t('subject')}*`}
              fullWidth
              name="subject"
              value={formik.values.subject}
              onChange={handleChangeTouched}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
              size="small"
              margin="normal"
            />
            <TextField
              id="abstract"
              label={t('abstract')}
              fullWidth
              name="abstract"
              value={formik.values.abstract}
              onChange={handleChangeTouched}
              error={formik.touched.abstract && Boolean(formik.errors.abstract)}
              helperText={formik.touched.abstract && formik.errors.abstract}
              size="small"
              margin="normal"
            />
            {formik.values.lang === NewNotificationLangOther && (
              <>
                <Typography
                  variant="body2"
                  color={'text.secondary'}
                  marginTop={'16px'}
                  fontWeight={600}
                >
                  {languages[formik.values.additionalLang as LangCode]}
                </Typography>
                <TextField
                  id="additionalSubject"
                  label={`${t('subject')}*`}
                  fullWidth
                  name="additionalSubject"
                  value={formik.values.additionalSubject}
                  onChange={handleChangeTouched}
                  error={
                    formik.touched.additionalSubject && Boolean(formik.errors.additionalSubject)
                  }
                  helperText={formik.touched.additionalSubject && formik.errors.additionalSubject}
                  size="small"
                  margin="normal"
                />
                <TextField
                  id="additionalAbstract"
                  label={t('abstract')}
                  fullWidth
                  name="additionalAbstract"
                  value={formik.values.additionalAbstract}
                  onChange={handleChangeTouched}
                  error={
                    formik.touched.additionalAbstract && Boolean(formik.errors.additionalAbstract)
                  }
                  helperText={formik.touched.additionalAbstract && formik.errors.additionalAbstract}
                  size="small"
                  margin="normal"
                />
              </>
            )}
          </FormBox>
          <FormBox>
            <FormBoxTitle text={t('protocol-number')} />
            <FormBoxSubtitle text={t('protocol-number-subtitle')} />
            <TextField
              id="paProtocolNumber"
              label={`${t('protocol-number')}*`}
              fullWidth
              name="paProtocolNumber"
              value={formik.values.paProtocolNumber}
              onChange={handleChangeTouched}
              error={formik.touched.paProtocolNumber && Boolean(formik.errors.paProtocolNumber)}
              helperText={formik.touched.paProtocolNumber && formik.errors.paProtocolNumber}
              size="small"
              margin="normal"
            />
          </FormBox>
          <FormBox>
            <FormBoxTitle text={t('taxonomy-id')} />
            <FormBoxSubtitle text={t('taxonomy-id-subtitle')} />
            <TextField
              id="taxonomyCode"
              label={`${t('taxonomy-id')}*`}
              fullWidth
              name="taxonomyCode"
              value={formik.values.taxonomyCode}
              onChange={handleChangeTouched}
              error={formik.touched.taxonomyCode && Boolean(formik.errors.taxonomyCode)}
              helperText={formik.touched.taxonomyCode && formik.errors.taxonomyCode}
              size="small"
              margin="normal"
            />
          </FormBox>
          <FormBox>
            <FormControl margin="none" fullWidth>
              <FormLabel id="comunication-type-label">
                <FormBoxTitle text={t('comunication-type')} />
              </FormLabel>
              <FormBoxSubtitle text={t('comunication-type-subtitle')} />
              <RadioGroup
                aria-labelledby="comunication-type-label"
                name="physicalCommunicationType"
                row
                value={formik.values.physicalCommunicationType}
                onChange={handleChangeDeliveryMode}
              >
                <FormControlLabel
                  value={PhysicalCommunicationType.REGISTERED_LETTER_890}
                  control={<Radio />}
                  label={t('registered-letter-890')}
                  data-testid="comunicationTypeRadio"
                />
                <FormControlLabel
                  value={PhysicalCommunicationType.AR_REGISTERED_LETTER}
                  control={<Radio />}
                  label={t('simple-registered-letter')}
                  data-testid="comunicationTypeRadio"
                />
              </RadioGroup>
            </FormControl>
          </FormBox>

          <FormBox>
            <FormBoxTitle text={t('notification-management')} />
            <FormBoxSubtitle text={t('notification-management-subtitle')} />
            <CustomDropdown
              id="group"
              label={`${t('group')}${hasGroups ? '*' : ''}`}
              fullWidth
              name="group"
              size="small"
              margin="normal"
              value={formik.values.group}
              onChange={handleChangeTouched}
              error={formik.touched.group && Boolean(formik.errors.group)}
              helperText={formik.touched.group && formik.errors.group}
              emptyStateMessage={t('no-groups')}
            >
              {groups.length > 0 &&
                groups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name}
                  </MenuItem>
                ))}
            </CustomDropdown>
          </FormBox>

          {IS_PAYMENT_ENABLED && (
            <FormControl margin="normal" fullWidth>
              <FormLabel id="payment-method-label">
                <Typography fontWeight={600} fontSize={16}>
                  {`${t('payment-method')}*`}
                </Typography>
              </FormLabel>
              <RadioGroup
                aria-labelledby="payment-method-label"
                name="paymentMode"
                value={formik.values.paymentMode}
                onChange={handleChangePaymentMode}
              >
                <FormControlLabel
                  value={PaymentModel.PAGO_PA_NOTICE}
                  control={<Radio />}
                  label={t('pagopa-notice')}
                  data-testid="paymentMethodRadio"
                />
                <FormControlLabel
                  value={PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE}
                  control={<Radio />}
                  label={t('pagopa-notice-f24-flatrate')}
                  data-testid="paymentMethodRadio"
                />
                <FormControlLabel
                  value={PaymentModel.PAGO_PA_NOTICE_F24}
                  control={<Radio />}
                  label={t('pagopa-notice-f24')}
                  data-testid="paymentMethodRadio"
                />
                <FormControlLabel
                  value={PaymentModel.NOTHING}
                  control={<Radio />}
                  label={t('nothing')}
                  data-testid="paymentMethodRadio"
                />
              </RadioGroup>
            </FormControl>
          )}
        </NewNotificationCard>
      </form>
    </ApiErrorWrapper>
  );
};

export default PreliminaryInformations;
