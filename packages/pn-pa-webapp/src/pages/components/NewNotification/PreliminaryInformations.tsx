import { ChangeEvent, useEffect, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setPreliminaryInformations } from '../../../redux/newNotification/actions';
import { RootState } from '../../../redux/store';
import NewNotificationCard from './NewNotificationCard';

type Props = {
  notification: NewNotificationFe;
  onConfirm: () => void;
};

const PreliminaryInformations = ({ notification, onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const userGroups = useAppSelector((state: RootState) => state.userState.user.groups);
  const [groups, _setGroups] = useState(userGroups);
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
    group: groups ? yup.string().required() : yup.string(),
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

  useEffect(() => {
    if (!groups) {
      // TODO: chiamata al be per prendere gruppi associati con self care
      // setGroups(['Group1', 'Group2']);
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
          label={`${t('group')}${groups ? '*' : ''}`}
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
          {groups &&
            groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          {!groups && <MenuItem sx={{ display: 'none' }}></MenuItem>}
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
            onChange={formik.handleChange}
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
            onChange={formik.handleChange}
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
