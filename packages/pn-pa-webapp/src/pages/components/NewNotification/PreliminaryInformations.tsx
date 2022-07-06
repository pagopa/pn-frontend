import { ChangeEvent, useEffect, useState } from 'react';
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
import { trackEventByType } from '../../../utils/mixpanel';
import { TrackEventType } from '../../../utils/events';
import NewNotificationCard from './NewNotificationCard';

type Props = {
  notification: NewNotificationFe;
  onConfirm: () => void;
};

const PreliminaryInformations = ({ notification, onConfirm }: Props) => {
  const dispatch = useAppDispatch();
  const userGroups = useAppSelector((state: RootState) => state.userState.user.groups);
  const [groups, _setGroups] = useState(userGroups);

  const initialValues = () => ({
    paProtocolNumber: notification.paProtocolNumber || '',
    subject: notification.subject || '',
    abstract: notification.abstract || '',
    group: notification.group || '',
    physicalCommunicationType: notification.physicalCommunicationType || '',
    paymentMode: notification.paymentMode || '',
  });

  const validationSchema = yup.object({
    paProtocolNumber: yup.string().required('Numero di protocollo obbligatorio'),
    subject: yup.string().required('Oggetto di protocollo obbligatorio'),
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

  const handleChangeDeliveryMode = (e: ChangeEvent & {target: {value: any}}) => {
    formik.handleChange(e);
    trackEventByType(TrackEventType.NOTIFICATION_SEND_DELIVERY_MODE, {type: e.target.value});
  };

  const handleChangePaymentMode = (e: ChangeEvent & {target: {value: any}}) => {
    formik.handleChange(e);
    trackEventByType(TrackEventType.NOTIFICATION_SEND_PAYMENT_MODE, {target: e.target.value});
  };
  
  useEffect(() => {
    if (!groups) {
      // TODO: chiamata al be per prendere gruppi associati con self care
      // setGroups(['Group1', 'Group2']);
    }
  }, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      <NewNotificationCard isContinueDisabled={!formik.isValid} title="Informazioni preliminari">
        <TextField
          id="paProtocolNumber"
          label="Numero di protocollo*"
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
          label="Oggetto della notifica*"
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
          label="Descrizione"
          fullWidth
          name="abstract"
          value={formik.values.abstract}
          onChange={handleChangeTouched}
          size="small"
          margin="normal"
        />
        <TextField
          id="group"
          label={`Gruppo${groups ? '*' : ''}`}
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
          {!groups &&
              <MenuItem sx={{display: 'none'}}>
              </MenuItem>
            }
        </TextField>
        <FormControl margin="normal" fullWidth>
          <FormLabel id="comunication-type-label">
            <Typography fontWeight={600} fontSize={16}>
              Modalità di invio*
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
              label="Modello 890"
              data-testid="comunicationTypeRadio"
            />
            <FormControlLabel
              value={PhysicalCommunicationType.SIMPLE_REGISTERED_LETTER}
              control={<Radio />}
              label="Raccomandata A/R"
              data-testid="comunicationTypeRadio"
            />
          </RadioGroup>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <FormLabel id="payment-method-label">
            <Typography fontWeight={600} fontSize={16}>
              Modello di pagamento*
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
              label="Avviso pagoPA"
              data-testid="paymentMethodRadio"
            />
            <FormControlLabel
              value={PaymentModel.PAGO_PA_NOTICE_F24_FLATRATE}
              control={<Radio />}
              label="Avviso pagoPA e Modello F24 forfettario"
              data-testid="paymentMethodRadio"
            />
            <FormControlLabel
              value={PaymentModel.PAGO_PA_NOTICE_F24}
              control={<Radio />}
              label="Avviso pagoPA e Modello F24"
              data-testid="paymentMethodRadio"
            />
          </RadioGroup>
        </FormControl>
      </NewNotificationCard>
    </form>
  );
};

export default PreliminaryInformations;
