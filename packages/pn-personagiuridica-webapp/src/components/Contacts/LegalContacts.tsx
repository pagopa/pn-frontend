import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import ConstructionIcon from '@mui/icons-material/Construction';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import SavingsIcon from '@mui/icons-material/Savings';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { Box, Stack, Typography } from '@mui/material';
import { PnInfoCard, appStateActions, appStorage, useIsMobile } from '@pagopa-pn/pn-commons';
import { MIAlert, MIButton, MIChip } from '@pagopa/mui-italia';

import { PGEventsType } from '../../models/PGEventsType';
import { AddressType, ChannelType } from '../../models/contacts';
import {
  DIGITAL_DOMICILE_ACTIVATION,
  DIGITAL_DOMICILE_MANAGEMENT,
} from '../../navigation/routes.const';
import { deleteAddress } from '../../redux/contact/actions';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import PGEventStrategyFactory from '../../utility/MixpanelUtils/PGEventStrategyFactory';
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
      <MIButton
        variant="contained"
        fullWidth={isMobile}
        onClick={() => {
          PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_ADD_DIGITAL_DOMICILE_START);
          navigate(DIGITAL_DOMICILE_ACTIVATION);
        }}
      >
        {t('button.start')}
      </MIButton>
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
  const showSpecialContactsSection =
    specialAddresses.filter((addr) => addr.addressType === AddressType.LEGAL).length > 0;

  const channelType =
    hasSercqSendActive && !isValidatingPec ? ChannelType.SERCQ_SEND : ChannelType.PEC;

  type SubtitleParams = {
    label: string;
    color: 'default' | 'warning' | 'success' | 'info' | 'error' | 'highlight' | 'neutral';
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
    return <MIChip {...params} sx={{ mb: 2 }} />;
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
        PGEventStrategyFactory.triggerEvent(
          PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_UX_SUCCESS
        );
        PGEventStrategyFactory.triggerEvent(PGEventsType.SEND_PG_HAS_DIGITAL_DOMICILE, {
          value: 'not_available',
        });

        if (channelType === ChannelType.SERCQ_SEND) {
          appStorage.domicileBanner.enable();
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
          {
            key: 'manage',
            label: t('button.manage'),
            icon: <ConstructionIcon />,
            onClick: () => navigate(DIGITAL_DOMICILE_MANAGEMENT),
          },
          {
            key: 'disable',
            label: t('button.disable'),
            icon: <PowerSettingsNewIcon />,
            destructive: true,
            onClick: () => {
              PGEventStrategyFactory.triggerEvent(
                PGEventsType.SEND_PG_REMOVE_DIGITAL_DOMICILE_START
              );
              setModalOpen(true);
            },
          },
        ]
      : undefined;

  const removeDialogLabel = `remove-${channelType.toLowerCase()}`;

  return (
    <PnInfoCard
      title={
        <Typography
          component="span"
          display="block"
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
      mobileCollapsible={!isActive}
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
        <MIAlert severity="info" sx={{ mt: 2 }}>
          {t(`legal-contacts.pec-disclaimer`, { ns: 'recapiti' })}
        </MIAlert>
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
        removeModalBody={
          showSpecialContactsSection ? (
            t('legal-contacts.block-remove-digital-domicile-message', { ns: 'recapiti' })
          ) : (
            <Trans
              i18nKey={`legal-contacts.${removeDialogLabel}-message`}
              ns={'recapiti'}
              components={[
                <Typography variant="body2" fontSize={'18px'} key={'paragraph1'} sx={{ mb: 2 }} />,
                <Typography variant="body2" fontSize={'18px'} key={'paragraph2'} />,
              ]}
            />
          )
        }
        handleModalClose={() => setModalOpen(false)}
        confirmHandler={deleteConfirmHandler}
        blockDelete={showSpecialContactsSection}
        slotsProps={
          !showSpecialContactsSection
            ? {
                primaryButton: {
                  onClick: () => setModalOpen(false),
                  label: t('button.annulla'),
                },
                secondaryButton: {
                  onClick: deleteConfirmHandler,
                  label: t(`legal-contacts.${removeDialogLabel}-confirm`, { ns: 'recapiti' }),
                  variant: 'outlined',
                  color: 'error',
                },
              }
            : undefined
        }
      />
    </PnInfoCard>
  );
};

export default LegalContacts;
