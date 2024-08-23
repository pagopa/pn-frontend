import { useFormik } from 'formik';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Divider, Stack, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  AppResponse,
  AppResponsePublisher,
  CodeModal,
  ErrorMessage,
  appStateActions,
  useIsMobile,
} from '@pagopa-pn/pn-commons';
import { ButtonNaked } from '@pagopa/mui-italia';

import { PFEventsType } from '../../models/PFEventsType';
import {
  AddressType,
  ChannelType,
  DigitalAddress,
  SaveDigitalAddressParams,
} from '../../models/contacts';
import {
  CONTACT_ACTIONS,
  createOrUpdateAddress,
  getAllActivatedParties,
} from '../../redux/contact/actions';
import { useAppDispatch } from '../../redux/hooks';
import PFEventStrategyFactory from '../../utility/MixpanelUtils/PFEventStrategyFactory';
import {
  allowedAddressTypes,
  contactAlreadyExists,
  emailValidationSchema,
  internationalPhonePrefix,
  pecValidationSchema,
  phoneValidationSchema,
} from '../../utility/contacts.utility';
import AddSpecialContactDialog from './AddSpecialContactDialog';
import ExistingContactDialog from './ExistingContactDialog';
import PecVerificationDialog from './PecVerificationDialog';

type Props = {
  digitalAddresses: Array<DigitalAddress>;
  channelType: ChannelType;
};

type AddressTypeItem = {
  id: ChannelType;
  value: string;
};

enum ModalType {
  EXISTING = 'existing',
  VALIDATION = 'validation',
  CODE = 'code',
  SPECIAL = 'special',
}

const SpecialContacts: React.FC<Props> = ({ digitalAddresses, channelType }) => {
  const { t } = useTranslation(['common', 'recapiti']);
  const isMobile = useIsMobile();
  const dispatch = useAppDispatch();
  const [senderInputValue, setSenderInputValue] = useState('');
  const [modalOpen, setModalOpen] = useState<ModalType | null>(null);
  const codeModalRef =
    useRef<{ updateError: (error: ErrorMessage, codeNotValid: boolean) => void }>(null);

  const addressTypes: Array<AddressTypeItem> = digitalAddresses
    .filter((a) => a.senderId === 'default' && allowedAddressTypes.includes(a.channelType))
    .map((a) => ({
      id: a.channelType,
      value: t(`special-contacts.${a.channelType.toLowerCase()}`, { ns: 'recapiti' }),
    }));

  const fetchAllActivatedParties = useCallback(() => {
    void dispatch(getAllActivatedParties({}));
  }, []);

  const validationSchema = yup.object({
    sender: yup.object({ id: yup.string(), name: yup.string() }).required(),
    addressType: yup.string().required(),
    s_value: yup
      .string()
      .when('addressType', {
        is: ChannelType.PEC,
        then: pecValidationSchema(t),
      })
      .when('addressType', {
        is: ChannelType.EMAIL,
        then: emailValidationSchema(t),
      })
      .when('addressType', {
        is: ChannelType.SMS,
        then: phoneValidationSchema(t),
      }),
  });

  const initialValues = {
    sender: { id: '', name: '' },
    addressType: addressTypes[0]?.id,
    s_value: '',
  };

  const formik = useFormik({
    initialValues,
    validateOnMount: true,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const event =
        values.addressType === ChannelType.PEC
          ? PFEventsType.SEND_ADD_PEC_START
          : values.addressType === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_START
          : PFEventsType.SEND_ADD_EMAIL_START;
      PFEventStrategyFactory.triggerEvent(event, values.sender.id);
      // first check if contact already exists
      if (
        contactAlreadyExists(digitalAddresses, values.s_value, values.sender.id, values.addressType)
      ) {
        setModalOpen(ModalType.EXISTING);
        return;
      }
      handleCodeVerification();
    },
  });

  const labelRoot =
    formik.values.addressType === ChannelType.PEC ? 'legal-contacts' : 'courtesy-contacts';
  const contactType = formik.values.addressType.toLowerCase();

  const sendSuccessEvent = (type: ChannelType) => {
    const event =
      type === ChannelType.PEC
        ? PFEventsType.SEND_ADD_PEC_UX_SUCCESS
        : type === ChannelType.SMS
        ? PFEventsType.SEND_ADD_SMS_UX_SUCCESS
        : PFEventsType.SEND_ADD_EMAIL_UX_SUCCESS;
    PFEventStrategyFactory.triggerEvent(event, formik.values.sender.id);
  };

  const handleCodeVerification = (verificationCode?: string) => {
    if (verificationCode) {
      const event =
        formik.values.addressType === ChannelType.PEC
          ? PFEventsType.SEND_ADD_PEC_UX_CONVERSION
          : formik.values.addressType === ChannelType.SMS
          ? PFEventsType.SEND_ADD_SMS_UX_CONVERSION
          : PFEventsType.SEND_ADD_EMAIL_UX_CONVERSION;
      PFEventStrategyFactory.triggerEvent(event, formik.values.sender.id);
    }

    const addressType =
      formik.values.addressType === ChannelType.PEC ? AddressType.LEGAL : AddressType.COURTESY;
    const value =
      formik.values.addressType === ChannelType.SMS
        ? internationalPhonePrefix + formik.values.s_value
        : formik.values.s_value;

    const digitalAddressParams: SaveDigitalAddressParams = {
      addressType,
      senderId: formik.values.sender.id,
      senderName: formik.values.sender.name,
      channelType: formik.values.addressType,
      value,
      code: verificationCode,
    };

    dispatch(createOrUpdateAddress(digitalAddressParams))
      .unwrap()
      .then(async (res) => {
        // contact to verify
        // open code modal
        if (!res) {
          setModalOpen(ModalType.CODE);
          return;
        }

        sendSuccessEvent(formik.values.addressType);

        // contact has already been verified
        if (res.pecValid || formik.values.addressType !== ChannelType.PEC) {
          // show success message
          dispatch(
            appStateActions.addSuccess({
              title: '',
              message: t(`${labelRoot}.${contactType}-added-successfully`, {
                ns: 'recapiti',
              }),
            })
          );

          setModalOpen(null);
          // reset form
          formik.resetForm();
          await formik.validateForm();
          setSenderInputValue('');
          return;
        }
        // contact must be validated
        // open validation modal
        setModalOpen(ModalType.VALIDATION);
      })
      .catch(() => {});
  };

  const handleAddressUpdateError = useCallback(
    (responseError: AppResponse) => {
      if (modalOpen === null) {
        // notify the publisher we are not handling the error
        return true;
      }
      if (Array.isArray(responseError.errors)) {
        const error = responseError.errors[0];
        codeModalRef.current?.updateError(
          {
            title: error.message.title,
            content: error.message.content,
          },
          true
        );
        if (formik.values.addressType === ChannelType.PEC) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_PEC_CODE_ERROR);
        } else if (formik.values.addressType === ChannelType.SMS) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_SMS_CODE_ERROR);
        } else if (formik.values.addressType === ChannelType.EMAIL) {
          PFEventStrategyFactory.triggerEvent(PFEventsType.SEND_ADD_EMAIL_CODE_ERROR);
        }
      }
      return false;
    },
    [modalOpen]
  );

  useEffect(() => {
    AppResponsePublisher.error.subscribe('createOrUpdateAddress', handleAddressUpdateError);

    return () => {
      AppResponsePublisher.error.unsubscribe('createOrUpdateAddress', handleAddressUpdateError);
    };
  }, [handleAddressUpdateError]);

  useEffect(() => {
    if (senderInputValue.length >= 4) {
      void dispatch(getAllActivatedParties({ paNameFilter: senderInputValue, blockLoading: true }));
    } else if (senderInputValue.length === 0) {
      void dispatch(getAllActivatedParties({ blockLoading: true }));
    }
  }, [senderInputValue]);

  return (
    <ApiErrorWrapper
      apiId={CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}
      reloadAction={fetchAllActivatedParties}
      mainText={t('special-contacts.fetch-party-error', { ns: 'recapiti' })}
    >
      {digitalAddresses &&
        digitalAddresses.map((address) => (
          <>
            <Divider
              sx={{
                backgroundColor: 'white',
                color: 'text.secondary',
                my: isMobile ? 3 : 2,
              }}
            />
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={2}>
              <Stack direction="row" spacing={2}>
                <VerifiedIcon
                  fontSize="small"
                  color="success"
                  sx={{ position: 'relative', top: '2px' }}
                />
                <Box>
                  <Typography
                    sx={{
                      wordBreak: 'break-word',
                      fontWeight: 600,
                    }}
                    variant="body2"
                    id={`${address.senderId}-typography`}
                  >
                    {address.value}
                  </Typography>
                  <ButtonNaked
                    key="editButton"
                    color="primary"
                    onClick={() => {}}
                    sx={{ mr: 2 }}
                    disabled={false}
                    id={`modifyContact-${address.senderId}`}
                    size="medium"
                  >
                    {t('button.modifica')}
                  </ButtonNaked>
                  <ButtonNaked
                    id={`cancelContact-${address.senderId}`}
                    color="error"
                    onClick={() => {}}
                    disabled={false}
                    size="medium"
                  >
                    {t('button.elimina')}
                  </ButtonNaked>
                </Box>
              </Stack>
              <Stack paddingLeft={{ xs: 0, sm: 8 }}>
                <Typography variant="caption-semibold">
                  {t(`special-contacts.sender-list`, { ns: 'recapiti' })}
                </Typography>
                <Typography variant="caption">{address.senderId}</Typography>
              </Stack>
            </Stack>
          </>
        ))}
      <ExistingContactDialog
        open={modalOpen === ModalType.EXISTING}
        value={formik.values.s_value}
        handleDiscard={() => setModalOpen(null)}
        handleConfirm={() => handleCodeVerification()}
      />
      <CodeModal
        title={
          t(`${labelRoot}.${contactType}-verify`, { ns: 'recapiti' }) + ` ${formik.values.s_value}`
        }
        subtitle={<Trans i18nKey={`${labelRoot}.${contactType}-verify-descr`} ns="recapiti" />}
        open={modalOpen === ModalType.CODE}
        initialValues={new Array(5).fill('')}
        codeSectionTitle={t(`${labelRoot}.insert-code`, { ns: 'recapiti' })}
        codeSectionAdditional={
          <>
            <Typography variant="body2" display="inline">
              {t(`${labelRoot}.${contactType}-new-code`, { ns: 'recapiti' })}
              &nbsp;
            </Typography>
            <ButtonNaked
              component={Box}
              onClick={() => handleCodeVerification()}
              sx={{ verticalAlign: 'unset', display: 'inline' }}
            >
              <Typography
                display="inline"
                color="primary"
                variant="body2"
                sx={{ textDecoration: 'underline' }}
              >
                {t(`${labelRoot}.new-code-link`, { ns: 'recapiti' })}.
              </Typography>
            </ButtonNaked>
          </>
        }
        cancelLabel={t('button.annulla')}
        confirmLabel={t('button.conferma')}
        cancelCallback={() => setModalOpen(null)}
        confirmCallback={(values: Array<string>) => handleCodeVerification(values.join(''))}
        ref={codeModalRef}
      />
      <PecVerificationDialog
        open={modalOpen === ModalType.VALIDATION}
        handleConfirm={() => setModalOpen(null)}
      />
      <AddSpecialContactDialog
        open={modalOpen === ModalType.SPECIAL}
        handleClose={() => setModalOpen(null)}
        handleConfirm={() => handleCodeVerification()}
        digitalAddresses={digitalAddresses}
        channelType={channelType}
      />
      <Divider
        sx={{
          backgroundColor: 'white',
          color: 'text.secondary',
          my: 2,
        }}
      />
      <Stack direction={{ xs: 'column', sm: 'row' }} mt={{ xs: 1, sm: 0 }} alignItems="baseline">
        <Typography variant="caption" lineHeight="1.125rem">
          {t(`special-contacts.${channelType.toLowerCase()}-add-more-caption`, { ns: 'recapiti' })}
        </Typography>
        <ButtonNaked
          component={Stack}
          onClick={() => setModalOpen(ModalType.SPECIAL)}
          color="primary"
          size="small"
          p={{ xs: '0.5rem 0', sm: 1 }}
        >
          {t(`special-contacts.${channelType.toLowerCase()}-add-more-button`, { ns: 'recapiti' })}
        </ButtonNaked>
      </Stack>
    </ApiErrorWrapper>
  );
};

export default SpecialContacts;
