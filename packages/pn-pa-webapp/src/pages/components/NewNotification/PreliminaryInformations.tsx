import { ChangeEvent, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
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
import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';

import { NewNotificationFe, PaymentModel } from '../../../models/NewNotification';
import { GroupStatus } from '../../../models/user';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setPreliminaryInformations } from '../../../redux/newNotification/reducers';
import { getUserGroups } from '../../../redux/newNotification/actions';
import { RootState } from '../../../redux/store';
import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import NewNotificationCard from './NewNotificationCard';

type Props = {
  notification: NewNotificationFe;
  onConfirm: () => void;
};

const PreliminaryInformations = ({ notification, onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const groups = useAppSelector((state: RootState) => state.newNotificationState.groups);
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.preliminary-informations',
  });
  const { t: tc } = useTranslation(['common']);

  const initialValues = () => ({
    paProtocolNumber: notification.paProtocolNumber || '',
    subject: notification.subject || '',
    abstract: notification.abstract || '',
    group: notification.group || '',
    physicalCommunicationType: notification.physicalCommunicationType || '',
    paymentMode: notification.paymentMode || '',
  });

  const validationSchema = yup.object({
    paProtocolNumber: yup.string().required(`${t('protocol-number')} ${tc('common:required')}`),
    subject: yup.string().required(`${t('subject')} ${tc('common:required')}`),
    physicalCommunicationType: yup.string().required(),
    paymentMode: yup.string().required(),
    group: groups.length > 0 ? yup.string().required() : yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValues(),
    validateOnMount: true,
    validationSchema,
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

  const handleChangeDeliveryMode = (e: ChangeEvent & { target: { value: any } }) => {
    formik.handleChange(e);
    trackEventByType(TrackEventType.NOTIFICATION_SEND_DELIVERY_MODE, { type: e.target.value });
  };

  const handleChangePaymentMode = (e: ChangeEvent & { target: { value: any } }) => {
    formik.handleChange(e);
    trackEventByType(TrackEventType.NOTIFICATION_SEND_PAYMENT_MODE, { target: e.target.value });
  };

  useEffect(() => {
    if (groups.length === 0) {
      void dispatch(getUserGroups(GroupStatus.ACTIVE));
    }
  }, []);

  return (
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
          size="small"
          margin="normal"
        />
        <TextField
          id="group"
          label={`${t('group')}${groups.length > 0 ? '*' : ''}`}
          fullWidth
          name="group"
          value={formik.values.group}
          onChange={handleChangeTouched}
          error={formik.touched.group && Boolean(formik.errors.group)}
          helperText={formik.touched.group && formik.errors.group}
          size="small"
          margin="normal"
          select
        >
          {groups.length > 0 &&
            groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))}
          {groups.length === 0 && <MenuItem sx={{ display: 'none' }}></MenuItem>}
        </TextField>
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
              value={PhysicalCommunicationType.SIMPLE_REGISTERED_LETTER}
              control={<Radio />}
              label={t('simple-registered-letter')}
              data-testid="comunicationTypeRadio"
            />
          </RadioGroup>
        </FormControl>
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
          </RadioGroup>
        </FormControl>
      </NewNotificationCard>
    </form>
  );
};

export default PreliminaryInformations;
