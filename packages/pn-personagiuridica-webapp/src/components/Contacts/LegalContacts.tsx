import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ConstructionIcon from '@mui/icons-material/Construction';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SavingsIcon from '@mui/icons-material/Savings';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Alert, Box, Button, Chip, ChipOwnProps, Stack, Typography } from '@mui/material';
import { PnInfoCard, appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType } from '../../models/contacts';
import {
  DIGITAL_DOMICILE_ACTIVATION,
  DIGITAL_DOMICILE_MANAGEMENT,
} from '../../navigation/routes.const';
import { deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import DeleteDialog from './DeleteDialog';
import PecContactItem from './PecContactItem';
import SpecialContacts from './SpecialContacts';

const EmptyLegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const infoIcons = [LaptopChromebookIcon, SavingsIcon, TouchAppIcon];
  const sercqSendInfoList: Array<{ title: string; description: string }> = t(
    'legal-contacts.sercq-send-info-list',
    {
      returnObjects: true,
      defaultValue: [],
      ns: 'recapiti',
    }
  );

  return (
    <>
      <Typography variant="body2" fontSize="14px" mb={3}>
        {t('legal-contacts.sercq-send-info-advantages', { ns: 'recapiti' })}
      </Typography>
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        {infoIcons.map((Icon, index) => {
          const title = sercqSendInfoList[index]?.title;
          const description = sercqSendInfoList[index]?.description;
          return (
            <Stack key={title} direction={{ xs: 'row', lg: 'column' }} spacing={2}>
              <Icon sx={{ height: '24px', width: '24px', color: '#35C1EC' }} />
              <Box>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  {title}
                </Typography>
                <Typography fontSize="14px">{description}</Typography>
              </Box>
            </Stack>
          );
        })}
      </Stack>
      <Button
        variant="contained"
        fullWidth={isMobile}
        onClick={() => navigate(DIGITAL_DOMICILE_ACTIVATION)}
      >
        {t('button.start')}
      </Button>
    </>
  );
};

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { defaultPECAddress, defaultSERCQ_SENDAddress, specialAddresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const isValidatingPec = defaultPECAddress?.pecValid === false;
  const hasNoDefaultLegalAddress = !defaultPECAddress && !defaultSERCQ_SENDAddress;
  const hasPecActive = defaultPECAddress?.value && defaultPECAddress.pecValid === true;
  const hasSercqSendActive = !!defaultSERCQ_SENDAddress;
  const isActive = hasPecActive || (hasSercqSendActive && !isValidatingPec);
  const showSpecialContactsSection = specialAddresses.length > 0;

  const channelType =
    hasSercqSendActive && !isValidatingPec ? ChannelType.SERCQ_SEND : ChannelType.PEC;

  type SubtitleParams = {
    label: string;
    color: ChipOwnProps['color'];
  };

  const getSubtitle = () => {
    // eslint-disable-next-line functional/no-let
    let params: SubtitleParams;
    if (isValidatingPec) {
      params = {
        label: t('status.pec-validation', { ns: 'recapiti' }),
        color: 'warning',
      };
    } else if (hasNoDefaultLegalAddress) {
      params = {
        label: t('status.inactive', { ns: 'recapiti' }),
        color: 'default',
      };
    } else {
      params = {
        label: t('status.active', { ns: 'recapiti' }),
        color: 'success',
      };
    }
    return <Chip {...params} sx={{ mb: 2 }} />;
  };

  const deleteConfirmHandler = () => {
    setModalOpen(false);
    dispatch(
      deleteAddress({
        addressType: AddressType.LEGAL,
        senderId: 'default',
        channelType: hasSercqSendActive ? ChannelType.SERCQ_SEND : ChannelType.PEC,
      })
    )
      .unwrap()
      .then(() => {
        if (channelType === ChannelType.SERCQ_SEND) {
          sessionStorage.removeItem('domicileBannerClosed');
        }
        dispatch(
          appStateActions.addSuccess({
            title: '',
            message: t(
              `legal-contacts.${hasSercqSendActive ? 'sercq_send' : 'pec'}-removed-successfully`,
              { ns: 'recapiti' }
            ),
          })
        );
      })
      .catch(() => {});
  };

  const getActions = () =>
    isActive
      ? [
          <Button
            key="manage"
            variant="naked"
            color="primary"
            startIcon={<ConstructionIcon />}
            onClick={() => navigate(DIGITAL_DOMICILE_MANAGEMENT)}
            sx={{ p: '10px 16px' }}
          >
            {t('button.manage')}
          </Button>,
          <Button
            key="disable"
            variant="naked"
            color="error"
            startIcon={<PowerSettingsNewIcon />}
            onClick={() => setModalOpen(true)}
            sx={{ p: '10px 16px' }}
          >
            {t('button.disable')}
          </Button>,
        ]
      : undefined;

  const removeDialogLabel = `remove-${channelType.toLowerCase()}`;

  return (
    <PnInfoCard
      title={
        <Typography
          variant="h6"
          fontSize={{ xs: '22px', lg: '24px' }}
          fontWeight={700}
          mb={2}
          data-testid="legalContactsTitle"
        >
          {t('legal-contacts.title', { ns: 'recapiti' })}
        </Typography>
      }
      subtitle={getSubtitle()}
      actions={getActions()}
      expanded={isActive}
      slotProps={{ Card: { 'data-testid': 'legalContacts' } }}
    >
      {(isValidatingPec || hasPecActive) && <PecContactItem />}
      {hasSercqSendActive && !isValidatingPec && (
        <Typography variant="body1" fontWeight={600} mb={2} fontSize="18px">
          {t('legal-contacts.sercq_send-title', { ns: 'recapiti' })}
        </Typography>
      )}
      {hasNoDefaultLegalAddress ? (
        <EmptyLegalContacts />
      ) : (
        <Typography variant="body1" mt={2} fontSize={{ xs: '14px', lg: '16px' }}>
          {t(`legal-contacts.${channelType.toLowerCase()}-description`, { ns: 'recapiti' })}
        </Typography>
      )}
      {(isValidatingPec || hasPecActive) && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {t(`legal-contacts.pec-disclaimer`, { ns: 'recapiti' })}
        </Alert>
      )}
      {showSpecialContactsSection && <SpecialContacts addressType={AddressType.LEGAL} />}
      <DeleteDialog
        showModal={modalOpen}
        removeModalTitle={t(
          `legal-contacts.${
            showSpecialContactsSection ? 'block-remove-digital-domicile' : removeDialogLabel
          }-title`,
          {
            ns: 'recapiti',
          }
        )}
        removeModalBody={t(
          `legal-contacts.${
            showSpecialContactsSection ? 'block-remove-digital-domicile' : removeDialogLabel
          }-message`,
          {
            ns: 'recapiti',
            value: defaultPECAddress?.value,
          }
        )}
        handleModalClose={() => setModalOpen(false)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={showSpecialContactsSection}
      />
    </PnInfoCard>
  );
};

export default LegalContacts;
