import { ChangeEvent, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import {
  PhysicalCommunicationType,
  CustomDropdown,
  ApiErrorWrapper,
  dataRegex,
} from '@pagopa-pn/pn-commons';

import { NewNotification, PaymentModel } from '../../../models/NewNotification';
import { GroupStatus } from '../../../models/user';
import { getConfiguration } from '../../../services/configuration.service';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setPreliminaryInformations } from '../../../redux/newNotification/reducers';
import { getUserGroups, NEW_NOTIFICATION_ACTIONS } from '../../../redux/newNotification/actions';
import { PreliminaryInformationsPayload } from '../../../redux/newNotification/types';
import { RootState } from '../../../redux/store';
import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import NewNotificationCard from './NewNotificationCard';

type Props = {
  notification: NewNotification;
  onConfirm: () => void;
};

const PreliminaryInformations = ({ notification, onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state: RootState) => state.newNotificationState.groups);
  const hasGroups = useAppSelector((state: RootState) => state.userState.user.organization.hasGroups);

  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.preliminary-informations',
  });
  const { t: tc } = useTranslation(['common']);
  const { IS_PAYMENT_ENABLED } = useMemo(() => getConfiguration(), []);

  const initialValues = useCallback(() => ({
    paProtocolNumber: notification.paProtocolNumber || '',
    subject: notification.subject || '',
    abstract: notification.abstract || '',
    group: notification.group || '',
    taxonomyCode: notification.taxonomyCode || '',
    physicalCommunicationType: notification.physicalCommunicationType || '',
    paymentMode: notification.paymentMode || (IS_PAYMENT_ENABLED ? '' : PaymentModel.NOTHING),
  }), [notification, IS_PAYMENT_ENABLED]);

  const validationSchema = yup.object({
    paProtocolNumber: yup.string().required(`${t('protocol-number')} ${tc('required')}`),
    subject: yup.string().required(`${t('subject')} ${tc('required')}`).max(134, tc('too-long-field-error', { maxLength: 134 })),
    abstract: yup.string().max(1024, tc('too-long-field-error', { maxLength: 1024 })),
    physicalCommunicationType: yup.string().required(),
    paymentMode: yup.string().required(),
    group: (hasGroups) ? yup.string().required() : yup.string(),
    taxonomyCode: yup
      .string()
      .required(`${t('taxonomy-id')} ${tc('required')}`)
      .test('taxonomyCodeTest', `${t('taxonomy-id')} ${tc('invalid')}`, (value) =>
        dataRegex.taxonomyCode.test(value as string)
      ),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
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
    trackEventByType(TrackEventType.NOTIFICATION_SEND_DELIVERY_MODE, { type: e.target.value });
  };

  const handleChangePaymentMode = (e: ChangeEvent & { target: { value: any } }) => {
    formik.handleChange(e);
    trackEventByType(TrackEventType.NOTIFICATION_SEND_PAYMENT_MODE, { target: e.target.value });
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
      <form onSubmit={formik.handleSubmit}>
        <NewNotificationCard isContinueDisabled={!formik.isValid} title={t('title')}>
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
          <CustomDropdown
            id="group"
            label={`${t('group')}${(hasGroups) ? '*' : ''}`}
            fullWidth
            name="group"
            size="small"
            margin="normal"
            value={formik.values.group}
            onChange={handleChangeTouched}
            error={formik.touched.group && Boolean(formik.errors.group)}
            helperText={formik.touched.group && formik.errors.group}
          >
            {groups.length > 0 &&
              groups.map((group) => (
                <MenuItem key={group.id} value={group.id}>
                  {group.name}
                </MenuItem>
              ))}
          </CustomDropdown>
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
          <FormControl margin="normal" fullWidth>
            <FormLabel id="comunication-type-label">
              <Typography fontWeight={600} fontSize={16}>
                {`${t('comunication-type')}*`}
              </Typography>
            </FormLabel>
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
          {IS_PAYMENT_ENABLED && (
            <>
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
            </>
          )}
        </NewNotificationCard>
      </form>
    </ApiErrorWrapper>
  );
};

export default PreliminaryInformations;
