import { useFormik } from 'formik';
import { ChangeEvent, useCallback, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import {
  ApiErrorWrapper,
  CustomDropdown,
  LANGUAGES,
  PhysicalCommunicationType,
  dataRegex,
} from '@pagopa-pn/pn-commons';
import { LangCode } from '@pagopa/mui-italia';

import {
  NewNotification,
  NewNotificationLangOther,
  PreliminaryInformationsPayload,
} from '../../models/NewNotification';
import { GroupStatus } from '../../models/user';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { NEW_NOTIFICATION_ACTIONS, getUserGroups } from '../../redux/newNotification/actions';
import { setPreliminaryInformations } from '../../redux/newNotification/reducers';
import { RootState } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';
import { requiredStringFieldValidation } from '../../utility/validation.utility';
import NewNotificationCard from './NewNotificationCard';
import { FormBox, FormBoxSubtitle, FormBoxTitle } from './NewNotificationFormElelements';
import PreliminaryInformationsContent from './PreliminaryInformationsContent';
import PreliminaryInformationsLang from './PreliminaryInformationsLang';

type Props = {
  notification: NewNotification;
  onConfirm: () => void;
};

const PreliminaryInformations = ({ notification, onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state: RootState) => state.newNotificationState.groups);
  const hasGroups = useAppSelector(
    (state: RootState) => state.userState.user.organization.hasGroups
  );
  const additionalLanguages = useAppSelector(
    (state: RootState) => state.userState.additionalLanguages
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
  const { IS_PAYMENT_ENABLED, TAXONOMY_SEND_URL } = useMemo(() => getConfiguration(), []);

  const languages = useMemo(() => {
    const currentLang = i18n.language?.substring(0, 2) as LangCode;
    return LANGUAGES[currentLang] ?? LANGUAGES.it;
  }, [i18n.language]);

  const initialValues = useCallback(() => {
    const additionalLang = additionalLanguages?.length > 0 ? additionalLanguages[0] : undefined;

    return {
      paProtocolNumber: notification.paProtocolNumber || '',
      subject: notification.subject || '',
      senderDenomination: notification.senderDenomination ?? '',
      abstract: notification.abstract ?? '',
      group: notification.group ?? '',
      taxonomyCode: notification.taxonomyCode || '',
      physicalCommunicationType: notification.physicalCommunicationType || '',
      lang: notification.lang || (additionalLang ? NewNotificationLangOther : 'it'),
      additionalLang: notification.additionalLang || additionalLang || '',
      additionalSubject: notification.additionalSubject || '',
      additionalAbstract: notification.additionalAbstract || '',
    } as PreliminaryInformationsPayload;
  }, [notification, IS_PAYMENT_ENABLED, additionalLanguages]);

  const validationSchema = yup.object({
    paProtocolNumber: requiredStringFieldValidation(tc, 256),
    subject: yup.string().when('lang', {
      is: NewNotificationLangOther,
      then: requiredStringFieldValidation(tc, 66, 10),
      otherwise: requiredStringFieldValidation(tc, 134, 10),
    }),
    senderDenomination: yup
      .string()
      .required(`${t('sender-denomination')} ${tc('required')}`)
      .max(80, tc('too-long-field-error', { maxLength: 80 })),
    abstract: yup
      .string()
      .max(1024, tc('too-long-field-error', { maxLength: 1024 }))
      .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges')),
    physicalCommunicationType: yup.string().required(),
    group: hasGroups ? yup.string().required() : yup.string(),
    taxonomyCode: yup
      .string()
      .required(`${t('taxonomy-id')} ${tc('required')}`)
      .test('taxonomyCodeTest', `${t('taxonomy-id')} ${tc('invalid')}`, (value) =>
        dataRegex.taxonomyCode.test(value as string)
      ),
    lang: yup.string().required(),
    additionalLang: yup.string().when('lang', {
      is: NewNotificationLangOther,
      then: requiredStringFieldValidation(tc),
    }),
    additionalSubject: yup.string().when('lang', {
      is: NewNotificationLangOther,
      then: requiredStringFieldValidation(tc, 66, 10),
    }),
    additionalAbstract: yup.string().when('lang', {
      is: NewNotificationLangOther,
      then: yup
        .string()
        .max(1024, tc('too-long-field-error', { maxLength: 1024 }))
        .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges')),
    }),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    /** onSubmit validate */
    onSubmit: (values) => {
      if (formik.isValid) {
        dispatch(setPreliminaryInformations(values));
        onConfirm();
      }
    },
  });

  const handleChangeTouched = async (e: ChangeEvent) => {
    formik.handleChange(e);
    await formik.setFieldTouched(e.target.id, true, false);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === 'it') {
      void formik.setValues({ ...formik.values, additionalLang: '', additionalSubject: '' }, false);
      void formik.setFieldTouched('additionalSubject', false);
    }
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
              label={`${t('sender-name')}*`}
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

          <PreliminaryInformationsLang
            formik={formik}
            languages={languages}
            onChange={handleChange}
            onChangeTouched={handleChangeTouched}
          />
          <PreliminaryInformationsContent
            formik={formik}
            onChangeTouched={handleChangeTouched}
            languages={languages}
          />

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
            <Typography variant="body2" fontSize={'14px'} marginTop={0.5}>
              <Trans
                t={t}
                i18nKey={'taxonomy-id-subtitle'}
                components={[
                  <Link
                    key={'taxonomy'}
                    href={TAXONOMY_SEND_URL}
                    target="_blank"
                    color={'primary'}
                    fontWeight={600}
                    sx={{ textDecoration: 'none' }}
                  />,
                ]}
              />
            </Typography>
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
                <FormBoxTitle text={t('comunication-type-title')} />
              </FormLabel>
              <FormBoxSubtitle text={t('comunication-type-subtitle')} />
              <RadioGroup
                aria-labelledby="comunication-type-label"
                name="physicalCommunicationType"
                row
                value={formik.values.physicalCommunicationType}
                onChange={handleChange}
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
            <FormBoxTitle text={t('notification-management-title')} />
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
        </NewNotificationCard>
      </form>
    </ApiErrorWrapper>
  );
};

export default PreliminaryInformations;
