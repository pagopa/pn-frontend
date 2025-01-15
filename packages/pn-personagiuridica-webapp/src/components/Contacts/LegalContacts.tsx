import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ConstructionIcon from '@mui/icons-material/Construction';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SavingsIcon from '@mui/icons-material/Savings';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Box, Button, Chip, ChipOwnProps, Stack, Typography } from '@mui/material';
import { PnInfoCard, appStateActions, useIsMobile } from '@pagopa-pn/pn-commons';

import { AddressType, ChannelType } from '../../models/contacts';
import { DIGITAL_DOMICILE_ACTIVATION } from '../../navigation/routes.const';
import { deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import DeleteDialog from './DeleteDialog';
import InformativeDialog from './InformativeDialog';
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
        onClick={() => navigate(`${DIGITAL_DOMICILE_ACTIVATION}`)}
      >
        {t('button.start')}
      </Button>
    </>
  );
};

const LegalContacts = () => {
  const { t } = useTranslation(['common', 'recapiti']);
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { defaultPECAddress, defaultSERCQ_SENDAddress, specialAddresses } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  const isValidatingPec = defaultPECAddress?.value && defaultPECAddress.pecValid === false;
  const hasNoDefaultLegalAddress = !defaultPECAddress?.value && !defaultSERCQ_SENDAddress;
  const hasPecActive = defaultPECAddress?.value && defaultPECAddress.pecValid === true;
  const hasSercqSendActive = !!defaultSERCQ_SENDAddress;
  const isActive = (hasPecActive || hasSercqSendActive) && !isValidatingPec;
  const showSpecialContactsSection = specialAddresses.length > 0;
  const blockDisableDefaultLegalContact = showSpecialContactsSection;

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
            onClick={() => console.log('Gestisci!')}
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

  const getContactDescriptionMessage = () => {
    if (hasSercqSendActive && !isValidatingPec) {
      return t('legal-contacts.sercq-send-description', { ns: 'recapiti' });
    } else if (hasPecActive || isValidatingPec) {
      return t('legal-contacts.pec-description', { ns: 'recapiti' });
    }
    return '';
  };

  const removeModalTitle = hasSercqSendActive ? 'remove-sercq-send-title' : 'remove-pec-title';
  const removeModalBody = hasSercqSendActive ? 'remove-sercq-send-message' : 'remove-pec-message';

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
          {t('legal-contacts.sercq-send-title', { ns: 'recapiti' })}
        </Typography>
      )}
      {!hasNoDefaultLegalAddress && (
        <Typography variant="body1" mt={2} fontSize={{ xs: '14px', lg: '16px' }}>
          {getContactDescriptionMessage()}
        </Typography>
      )}
      {hasNoDefaultLegalAddress && <EmptyLegalContacts />}
      {showSpecialContactsSection && <SpecialContacts />}
      {blockDisableDefaultLegalContact ? (
        <InformativeDialog
          open={modalOpen}
          title={t('legal-contacts.block-remove-digital-domicile-title', {
            ns: 'recapiti',
          })}
          subtitle={t('legal-contacts.block-remove-digital-domicile-message', {
            ns: 'recapiti',
          })}
          onConfirm={() => setModalOpen(false)}
        />
      ) : (
        <DeleteDialog
          showModal={modalOpen}
          removeModalTitle={t(
            `legal-contacts.${blockDisableDefaultLegalContact ? 'block-' : ''}${removeModalTitle}`,
            {
              ns: 'recapiti',
            }
          )}
          removeModalBody={t(
            `legal-contacts.${blockDisableDefaultLegalContact ? 'block-' : ''}${removeModalBody}`,
            {
              ns: 'recapiti',
              value: defaultPECAddress?.value,
            }
          )}
          handleModalClose={() => setModalOpen(false)}
          confirmHandler={deleteConfirmHandler}
          blockDelete={blockDisableDefaultLegalContact}
        />
      )}
    </PnInfoCard>
  );
};

export default LegalContacts;
