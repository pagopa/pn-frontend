import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { AddCircleOutline, Verified, WarningOutlined } from '@mui/icons-material';
import { Card, CardActionArea, Stack, Typography } from '@mui/material';

import {
  AddressType,
  ChannelType,
  ContactOperation,
  DigitalAddress,
  IOAllowedValues,
} from '../../models/contacts';
import { contactsSelectors, resetExternalEvent } from '../../redux/contact/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

type ContactsSummaryCardProps = {
  contacts: Array<DigitalAddress>;
  isSercQEnabled?: boolean;
  addressType?: AddressType;
};

const ContactsSummaryCard: React.FC<ContactsSummaryCardProps> = ({
  contacts,
  isSercQEnabled,
  addressType,
}) => {
  const { t } = useTranslation('recapiti');
  const availableAddresses = contacts.filter(
    (contact) =>
      contact.channelType !== ChannelType.IOMSG ||
      (contact.channelType === ChannelType.IOMSG && contact.value === IOAllowedValues.ENABLED)
  );

  const hasAddress = availableAddresses.length > 0;
  const isCourtesyCard = addressType === AddressType.COURTESY;
  const title = isCourtesyCard ? 'summary-card.courtesy-title' : 'summary-card.legal-title';
  const externalEvent = useAppSelector((state: RootState) => state.contactsState.event);
  const dispatch = useAppDispatch();

  const getIcon = () => {
    if (!hasAddress) {
      if (isCourtesyCard && isSercQEnabled) {
        return <WarningOutlined color="warning" data-testid="warningIcon" />;
      } else {
        return <AddCircleOutline color="primary" data-testid="addIcon" />;
      }
    }

    return <Verified color="primary" data-testid="verifiedIcon" />;
  };

  const getDescription = () => {
    if (!hasAddress) {
      return t('summary-card.no-address');
    }

    const contactsType = availableAddresses.reduce((acc, item) => {
      // eslint-disable-next-line functional/immutable-data
      acc[item.channelType] = t(`summary-card.${item.channelType}`);
      return acc;
    }, {} as { [key: string]: string });

    return Object.values(contactsType).join(', ');
  };

  const goToSection = () => {
    const sectionId = isCourtesyCard ? 'courtesyContactsSection' : 'legalContactsSection';
    const titleId = isCourtesyCard ? 'courtesyContactsTitle' : 'legalContactsTitle';

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    document.getElementById(titleId)?.focus({ preventScroll: true });
  };
  useEffect(() => {
    if (
      externalEvent &&
      externalEvent.destination === ChannelType.EMAIL &&
      externalEvent.operation === ContactOperation.SCROLL &&
      isCourtesyCard
    ) {
      goToSection();
      dispatch(resetExternalEvent());
    }
  }, [externalEvent]);

  return (
    <Card
      elevation={4}
      sx={{ width: { xs: '100%', lg: '185px' } }}
      data-testid={isCourtesyCard ? 'courtesyContactsCard' : 'legalContactsCard'}
    >
      <CardActionArea
        onClick={goToSection}
        sx={{ p: 2 }}
        aria-label={t(title)}
        aria-description={getDescription()}
      >
        {getIcon()}
        <Typography
          variant="body2"
          fontWeight={600}
          data-testid="cardTitle"
          aria-hidden
          sx={{ mt: 0.5, mb: 1 }}
        >
          {t(title)}
        </Typography>
        <Typography
          variant="body2"
          data-testid="cardDescription"
          aria-hidden
          color={hasAddress ? 'primary' : 'text.secondary'}
        >
          {getDescription()}
        </Typography>
      </CardActionArea>
    </Card>
  );
};

const ContactsSummaryCards: React.FC = () => {
  const { legalAddresses, courtesyAddresses, defaultSERCQ_SENDAddress } = useAppSelector(
    contactsSelectors.selectAddresses
  );

  return (
    <Stack direction="row" gap={{ xs: 1.25, lg: 2 }} mb={{ xs: 5, lg: 6 }} mt={3}>
      <ContactsSummaryCard contacts={legalAddresses} addressType={AddressType.LEGAL} />
      <ContactsSummaryCard
        contacts={courtesyAddresses}
        isSercQEnabled={!!defaultSERCQ_SENDAddress}
        addressType={AddressType.COURTESY}
      />
    </Stack>
  );
};

export default ContactsSummaryCards;
