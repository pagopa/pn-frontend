import { useFormik } from 'formik';
import React, { MutableRefObject, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { PnDialog, PnDialogActions, PnDialogContent } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, Sender } from '../../models/contacts';
import { Party } from '../../models/party';
import { deleteAddress, getAllActivatedParties } from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import DeleteDialog from './DeleteDialog';
import SpecialContactsInput from './SpecialContactsInput';

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  currentAddress: MutableRefObject<{ value: string; sender: Sender }>;
};

const SercqSendDisambiguationRadio: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <>
    <Typography fontWeight={400} fontSize="18px">
      {title}
    </Typography>
    <Typography fontWeight={400} fontSize="14px" color="text.secondary">
      {description}
    </Typography>
  </>
);

const SercqSendDisambiguationDialog: React.FC<Props> = ({
  open,
  onCancel,
  onConfirm,
  currentAddress,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['common', 'recapiti']);
  const [type, setType] = useState<string>('');
  const [senderInputValue, setSenderInputValue] = useState<string>('');
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      senders: [] as Array<Party>,
      s_value: currentAddress.current.value,
    },
    validateOnMount: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      if (values.senders.length > 0) {
        onConfirm();
      }
    },
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setType(e.target.value);
  };

  const handleConfirm = () => {
    if (type === 'SOME') {
      // TODO qui prende solo un sender, ma in realtà dovrebbe prendere tutti i sender selezionati
      // eslint-disable-next-line functional/immutable-data
      currentAddress.current = {
        ...currentAddress.current,
        sender: {
          senderId: formik.values.senders[0].id,
          senderName: formik.values.senders[0].name,
        },
      };
      onConfirm();
      return;
    }

    setShowDeleteDialog(true);
  };

  const handleDeleteSercqSend = () => {
    setShowDeleteDialog(false);
    void dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: currentAddress.current.sender.senderId,
        channelType: ChannelType.SERCQ,
      })
    )
      .unwrap()
      .then(() => onConfirm());
  };

  const getParties = () => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllActivatedParties({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0) {
      void dispatch(getAllActivatedParties({ blockLoading: true }));
    }
  };

  useEffect(() => {
    if (!open) {
      return;
    }
    getParties();
  }, [senderInputValue, open]);

  return (
    <>
      <PnDialog
        open={open}
        data-testid="sercqSendDisambiguationDialog"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title" sx={{ fontWeight: 700 }}>
          {t('legal-contacts.sercq-send-disambiguation-title', { ns: 'recapiti' })}
        </DialogTitle>
        <PnDialogContent>
          <DialogContentText id="dialog-description" sx={{ color: 'text.primary' }}>
            {t('legal-contacts.sercq-send-disambiguation-description', { ns: 'recapiti' })}
          </DialogContentText>

          <RadioGroup value={type} onChange={handleChange} sx={{ px: 1, mt: 2 }}>
            <FormControlLabel
              value={'ALL'}
              control={<Radio />}
              sx={{ mb: 1 }}
              label={
                <SercqSendDisambiguationRadio
                  title={t('legal-contacts.all-organisations', { ns: 'recapiti' })}
                  description={t('legal-contacts.all-organisations-description', {
                    ns: 'recapiti',
                  })}
                />
              }
              data-testid="courtesyAddressRadio"
            />

            <FormControlLabel
              value={'SOME'}
              control={<Radio />}
              sx={{ mb: 1 }}
              label={
                <SercqSendDisambiguationRadio
                  title={t('legal-contacts.specific-organisations', { ns: 'recapiti' })}
                  description={t('legal-contacts.specific-organisations-description', {
                    ns: 'recapiti',
                  })}
                />
              }
              data-testid="courtesyAddressRadio"
            />
          </RadioGroup>

          {type === 'SOME' && (
            <SpecialContactsInput
              formik={formik}
              value={currentAddress.current.value}
              digitalAddresses={[]}
              contactType={ChannelType.PEC}
              senders={formik.values.senders}
              senderInputValue={senderInputValue}
              setSenderInputValue={setSenderInputValue}
            />
          )}
        </PnDialogContent>
        <PnDialogActions>
          <Button variant="outlined" onClick={onCancel}>
            {t('button.annulla')}
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            {t('button.conferma')}
          </Button>
        </PnDialogActions>
      </PnDialog>

      <DeleteDialog
        showModal={showDeleteDialog}
        removeModalTitle={t('legal-contacts.delete-sercq-send-dialog-title', { ns: 'recapiti' })}
        removeModalBody={t('legal-contacts.delete-sercq-send-dialog-description', {
          ns: 'recapiti',
        })}
        handleModalClose={() => setShowDeleteDialog(false)}
        confirmHandler={handleDeleteSercqSend}
      />
    </>
  );
};

export default SercqSendDisambiguationDialog;
