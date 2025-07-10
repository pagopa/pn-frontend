import { useFormik } from 'formik';
import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import {
  Alert,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import {
  ApiErrorWrapper,
  ConsentActionType,
  ConsentType,
  CustomDropdown,
  PnAutocomplete,
  SERCQ_SEND_VALUE,
  TosPrivacyConsent,
  appStateActions,
  searchStringLimitReachedText,
} from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType, SaveDigitalAddressParams, Sender } from '../../models/contacts';
import { Party } from '../../models/party';
import {
  CONTACT_ACTIONS,
  acceptSercqSendTos,
  createOrUpdateAddress,
  getAllActivatedParties,
  getSercqSendTosApproval,
} from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { getConfiguration } from '../../services/configuration.service';
import {
  contactAlreadyExists,
  pecValidationSchema,
  specialContactsAvailableAddressTypes,
} from '../../utility/contacts.utility';
import DropDownPartyMenuItem from '../Party/DropDownParty';
import ContactCodeDialog from './ContactCodeDialog';
import ExistingContactDialog from './ExistingContactDialog';
import LegalContactAssociationDialog from './LegalContactAssociationDialog';

enum ModalType {
  EXISTING = 'existing',
  CODE = 'code',
  CONFIRM_LEGAL_ASSOCIATION = 'confirm_legal_association',
}

enum ErrorBannerType {
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  VALIDATING_PEC = 'VALIDATING_PEC',
}

export interface AddSpecialContactRef {
  handleConfirm: () => Promise<void>;
}

type Props = {
  handleContactAdded: () => void;
  handleError: (hasError: boolean) => void;
};

const ErrorBanner: React.FC<{ type: ErrorBannerType | undefined }> = ({ type }) => {
  const { t } = useTranslation(['recapiti']);
  if (type === ErrorBannerType.ALREADY_EXISTS) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }} data-testid="alreadyExistsAlert">
        {t(`special-contacts.contact-already-exists`)}
      </Alert>
    );
  } else if (type === ErrorBannerType.VALIDATING_PEC) {
    return (
      <Alert
        variant="outlined"
        severity="error"
        sx={{ mt: 2 }}
        data-testid="validatingPecForSenderAlert"
      >
        {t(`special-contacts.validating-pec`)}
      </Alert>
    );
  }
  return null;
};

/**
 * TODO: The following component has a high cognitive complexity which is probably dued to
 * the forwardRef used. This could be resolved upgrading to React 19 but this issue requires
 * a deeper analysis. The relative warning has been temporarily disabled.
 * -----------------------------
 * Maurizio Flauti, 05/02/2025
 */
const AddSpecialContact = forwardRef<AddSpecialContactRef, Props>(
  // eslint-disable-next-line sonarjs/cognitive-complexity
  ({ handleContactAdded, handleError }: Props, ref) => {
    const { t } = useTranslation(['common', 'recapiti']);
    const dispatch = useAppDispatch();
    const getOptionLabel = (option: Party) => option.name || '';
    const [errorBanner, setErrorBanner] = useState<ErrorBannerType | undefined>();
    const parties = useAppSelector((state: RootState) => state.contactsState.parties);
    const addressesData = useAppSelector(contactsSelectors.selectAddresses);
    const { IS_DOD_ENABLED } = getConfiguration();
    const [modalOpen, setModalOpen] = useState<{ type: ModalType; isDefault?: boolean } | null>(
      null
    );
    const tosConsent = useRef<Array<TosPrivacyConsent>>();

    const addressTypes = specialContactsAvailableAddressTypes(addressesData).filter(
      (addr) => addr.shown && (!IS_DOD_ENABLED ? addr.id !== ChannelType.SERCQ_SEND : true)
    );

    const mandatoryChannelType = addressTypes.length === 1 ? addressTypes[0].id : '';

    const isValidatingPecForSender = (senderId: string) =>
      addressesData.specialAddresses.some(
        (address) => address.senderId === senderId && !address.pecValid
      );

    const isSenderAlreadyAdded = (sender: Party, channelType?: ChannelType | string) =>
      addressesData.specialAddresses.some(
        (a) => a.senderId === sender.id && (!channelType || a.channelType === channelType)
      );

    const updateErrorBanner = (sender: Party, channelType: ChannelType) => {
      if (channelType === ChannelType.SERCQ_SEND && isValidatingPecForSender(sender.id)) {
        setErrorBanner(ErrorBannerType.VALIDATING_PEC);
        handleError(true);
        return;
      }

      if (channelType === ChannelType.PEC && isSenderAlreadyAdded(sender, channelType)) {
        setErrorBanner(ErrorBannerType.ALREADY_EXISTS);
      } else {
        setErrorBanner(undefined);
      }
      handleError(false);
    };

    const addressTypeChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
      await formik.setFieldValue('s_value', '');
      await formik.setFieldTouched('s_value', false);
      if (e.target.value) {
        const channelType = e.target.value as ChannelType;
        const sender = formik.values.sender;
        formik.handleChange(e);

        updateErrorBanner(sender, channelType);
      }
    };

    const senderChangeHandler = async (_: any, newValue: Party | null) => {
      const channelType = formik.values.channelType as ChannelType;
      const sender: Party = {
        id: newValue?.id ?? '',
        name: newValue?.name ?? '',
      };
      await formik.setFieldTouched('sender', true, false);
      await formik.setFieldValue('sender', { id: sender.id, name: sender.name });

      updateErrorBanner(sender, channelType);
    };

    const renderOption = (props: any, option: Party) => (
      <MenuItem {...props} value={option.id} key={option.id}>
        <DropDownPartyMenuItem name={option.name} />
      </MenuItem>
    );

    const validationSchema = yup.object({
      sender: yup
        .object({
          id: yup.string().required(t('required-field')),
          name: yup
            .string()
            .required(t('required-field'))
            .max(80, t('too-long-field-error', { maxLength: 80 })),
        })
        .required(),
      channelType: yup.string().required(t('required-field')),
      s_value: yup
        .string()
        .when('channelType', {
          is: ChannelType.PEC,
          then: pecValidationSchema(t),
        })
        .when('channelType', {
          is: ChannelType.SERCQ_SEND,
          then: yup.string().nullable(),
        }),
      s_disclaimer: yup.bool().when('channelType', {
        is: ChannelType.PEC,
        then: yup.bool().isTrue(t('required-field')),
      }),
    });

    const initialValues: {
      sender: { id: string; name: string };
      channelType: ChannelType | '';
      s_value: string;
      s_disclaimer: boolean;
    } = {
      sender: {
        id: '',
        name: '',
      },
      channelType: mandatoryChannelType,
      s_value: '',
      s_disclaimer: false,
    };

    const formik = useFormik({
      initialValues,
      validateOnMount: true,
      validationSchema,
      enableReinitialize: true,
      onSubmit: (values) => {
        onConfirm(values.s_value, values.channelType as ChannelType, {
          senderId: values.sender.id,
          senderName: values.sender.name,
        });
      },
    });

    // verify if the sender already has a contact associated
    const oldAddress = addressesData.specialAddresses.find(
      (addr) => addr.senderId === formik.values.sender.id
    );

    const labelRoot = `legal-contacts`;
    const contactType = formik.values.channelType.toLowerCase();

    const handleAssociation = () => {
      if (formik.values.channelType === ChannelType.SERCQ_SEND) {
        dispatch(getSercqSendTosApproval())
          .unwrap()
          .then((consent) => {
            // eslint-disable-next-line functional/immutable-data
            tosConsent.current = consent;
            handleAcceptSercqTos();
          })
          .catch(() => {});
        return;
      }
      handleCodeVerification();
    };

    const onConfirm = (
      value: string,
      channelType: ChannelType,
      sender: Sender = { senderId: 'default' }
    ) => {
      // verify if the sender already has a contact associated
      const oldAddress = addressesData.specialAddresses.find(
        (addr) => addr.senderId === sender.senderId
      );
      if (oldAddress) {
        setModalOpen({ type: ModalType.CONFIRM_LEGAL_ASSOCIATION });
        return;
      }

      // first check if contact already exists
      if (contactAlreadyExists(addressesData.addresses, value, sender.senderId, channelType)) {
        setModalOpen({
          type: ModalType.EXISTING,
          isDefault: addressesData.defaultPECAddress?.value === value,
        });
        return;
      }
      handleAssociation();
    };

    // handling of search string for sender
    const entitySearchLabel: string = `${t('special-contacts.add-sender', {
      ns: 'recapiti',
    })}${searchStringLimitReachedText(formik.values.sender.name)}`;

    const handleChangeTouched = async (e: ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
      await formik.setFieldTouched(e.target.id, true, false);
    };

    const getParties = () => {
      if (formik.values.sender.name.length >= 4) {
        void dispatch(
          getAllActivatedParties({ paNameFilter: formik.values.sender.name, blockLoading: true })
        );
      } else if (formik.values.sender.name.length === 0) {
        void dispatch(getAllActivatedParties({ blockLoading: true }));
      }
    };

    useEffect(() => {
      getParties();
    }, [formik.values.sender.name]);

    useImperativeHandle(ref, () => ({
      handleConfirm: async () => {
        if (errorBanner !== ErrorBannerType.VALIDATING_PEC) {
          await formik.submitForm();
        }
      },
    }));

    const handleAcceptSercqTos = () => {
      if (!tosConsent.current) {
        return;
      }
      // first check tos status
      const [tos] = tosConsent.current.filter(
        (consent) => consent.consentType === ConsentType.TOS_SERCQ
      );
      // if tos are already accepted, proceede with the activation
      if (tos.accepted) {
        handleCodeVerification();
        return;
      }
      // accept tos
      const tosBody = !tos.accepted
        ? [
            {
              action: ConsentActionType.ACCEPT,
              version: tos.consentVersion,
              type: ConsentType.TOS_SERCQ,
            },
          ]
        : [];

      dispatch(acceptSercqSendTos(tosBody))
        .unwrap()
        .then(() => {
          handleCodeVerification();
        })
        .catch(() => {});
    };

    const handleCodeVerification = (verificationCode?: string) => {
      // eslint-disable-next-line functional/no-let
      let value = formik.values.s_value;
      if (formik.values.channelType === ChannelType.SERCQ_SEND) {
        value = SERCQ_SEND_VALUE;
      }

      const digitalAddressParams: SaveDigitalAddressParams = {
        addressType: AddressType.LEGAL,
        senderId: formik.values.sender.id,
        senderName: formik.values.sender.name,
        channelType: formik.values.channelType as ChannelType,
        value,
        code: verificationCode,
      };

      dispatch(createOrUpdateAddress(digitalAddressParams))
        .unwrap()
        .then((res) => {
          // contact to verify
          if (!res) {
            setModalOpen({ type: ModalType.CODE });
            return;
          }

          // show success message
          if (formik.values.channelType !== ChannelType.PEC) {
            dispatch(
              appStateActions.addSuccess({
                title: '',
                message: t(`${labelRoot}.${contactType}-added-successfully`, {
                  ns: 'recapiti',
                }),
              })
            );
          }
          setModalOpen(null);
          handleContactAdded();
        })
        .catch(() => {});
    };

    return (
      <Paper data-testid="addSpecialContact" sx={{ p: { xs: 2, lg: 3 }, mb: 3 }}>
        <LegalContactAssociationDialog
          open={modalOpen?.type === ModalType.CONFIRM_LEGAL_ASSOCIATION}
          sender={{
            senderId: formik.values.sender.id,
            senderName: formik.values.sender.name,
          }}
          oldAddress={oldAddress}
          newAddress={{
            addressType: AddressType.LEGAL,
            channelType: formik.values.channelType as ChannelType,
            value: formik.values.s_value,
          }}
          onCancel={() => setModalOpen(null)}
          onConfirm={() => handleAssociation()}
        />
        <ExistingContactDialog
          open={modalOpen?.type === ModalType.EXISTING}
          value={formik.values.s_value}
          handleDiscard={() => setModalOpen(null)}
          handleConfirm={() => handleCodeVerification()}
        />
        {formik.values.channelType && (
          <ContactCodeDialog
            value={formik.values.s_value}
            addressType={AddressType.LEGAL}
            channelType={formik.values.channelType}
            open={modalOpen?.type === ModalType.CODE}
            onConfirm={(code) => handleCodeVerification(code)}
            onDiscard={() => setModalOpen(null)}
          />
        )}
        <Typography
          variant="h6"
          fontSize={{ xs: '22px', lg: '24px' }}
          fontWeight={700}
          mb={2}
          data-testid="specialContactsTitle"
        >
          {t(`special-contacts.add-title`, { ns: 'recapiti' })}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <Typography variant="body1" mb={4}>
            {t(`special-contacts.contact-to-add-description`, { ns: 'recapiti' })}
          </Typography>

          <Typography
            variant="body2"
            mb={2}
            fontWeight={400}
            fontSize="14px"
            color="text.secondary"
          >
            {t(`required-fields`)}
          </Typography>

          <ApiErrorWrapper
            apiId={CONTACT_ACTIONS.GET_ALL_ACTIVATED_PARTIES}
            mainText={t('special-contacts.fetch-party-error', { ns: 'recapiti' })}
            reloadAction={getParties}
          >
            <PnAutocomplete
              id="sender"
              data-testid="sender"
              size="small"
              options={parties ?? []}
              autoComplete
              getOptionLabel={getOptionLabel}
              noOptionsText={t('common.enti-not-found', { ns: 'recapiti' })}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={senderChangeHandler}
              inputValue={formik.values.sender.name}
              onInputChange={(_event, newInputValue, reason) => {
                if (reason === 'input') {
                  const senderId =
                    parties.find((sender) => sender.name === newInputValue)?.id ?? '';
                  void formik.setFieldTouched('sender', true, false);
                  void formik.setFieldValue('sender', { id: senderId, name: newInputValue });
                }
              }}
              filterOptions={(e) => e}
              renderOption={renderOption}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="sender"
                  label={entitySearchLabel}
                  error={
                    formik.touched.sender &&
                    Boolean(formik.errors.sender?.name ?? formik.errors.sender?.id)
                  }
                  helperText={
                    formik.touched.sender &&
                    (formik.errors.sender?.name || formik.errors.sender?.id)
                  }
                  required
                />
              )}
              sx={{ flexGrow: 1, flexBasis: 0, mb: 2 }}
            />
          </ApiErrorWrapper>
          {!mandatoryChannelType && (
            <CustomDropdown
              id="channelType"
              name="channelType"
              value={formik.values.channelType}
              onChange={addressTypeChangeHandler}
              size="small"
              sx={{ flexGrow: 1, flexBasis: 0, mb: 2 }}
              label={t('special-contacts.select-address', { ns: 'recapiti' })}
              fullWidth
              error={formik.touched.channelType && Boolean(formik.errors.channelType)}
              helperText={formik.touched.channelType && formik.errors.channelType}
              required
            >
              {addressTypes.map((a) => (
                <MenuItem
                  id={`dropdown-${a.id}`}
                  key={a.id}
                  value={a.id}
                  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
                >
                  {t(`special-contacts.${a.id.toLowerCase()}`, { ns: 'recapiti' })}
                </MenuItem>
              ))}
            </CustomDropdown>
          )}
          {formik.values.channelType === ChannelType.PEC && (
            <>
              <TextField
                size="small"
                fullWidth
                id="s_value"
                name="s_value"
                label={t(`special-contacts.link-${formik.values.channelType.toLowerCase()}-label`, {
                  ns: 'recapiti',
                })}
                value={formik.values.s_value}
                onChange={handleChangeTouched}
                error={formik.touched.s_value && Boolean(formik.errors.s_value)}
                helperText={formik.touched.s_value && formik.errors.s_value}
                required
              />
              <FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="s_disclaimer"
                      id="s_disclaimer"
                      required
                      onChange={handleChangeTouched}
                      inputProps={{
                        'aria-describedby': 's_disclaimer-helper-text',
                        'aria-invalid':
                          formik.touched.s_disclaimer && Boolean(formik.errors.s_disclaimer),
                      }}
                    />
                  }
                  label={<Trans ns="recapiti" i18nKey="special-contacts.pec-disclaimer" />}
                  sx={{ mt: 2 }}
                  value={formik.values.s_disclaimer}
                />
                {formik.touched.s_disclaimer && Boolean(formik.errors.s_disclaimer) && (
                  <FormHelperText id="s_disclaimer-helper-text" error>
                    {formik.errors.s_disclaimer}
                  </FormHelperText>
                )}
              </FormControl>
            </>
          )}
        </form>
        <ErrorBanner type={errorBanner} />
      </Paper>
    );
  }
);

export default AddSpecialContact;
