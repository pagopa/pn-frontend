import React from 'react';
import { useTranslation } from 'react-i18next';

import { AddCircle, Verified, WarningOutlined } from '@mui/icons-material';
import { Card, Stack, Typography } from '@mui/material';

import { AddressType, ChannelType, DigitalAddress } from '../../models/contacts';
import { contactsSelectors } from '../../redux/contact/reducers';
import { useAppSelector } from '../../redux/hooks';

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
  const hasAddress = contacts.length > 0;
  const isCourtesyCard = addressType === AddressType.COURTESY;
  const title = isCourtesyCard ? 'summary-card.courtesy-title' : 'summary-card.legal-title';

  const getIcon = () => {
    if (!hasAddress) {
      if (isCourtesyCard && isSercQEnabled) {
        return <WarningOutlined color="warning" data-testid="warningIcon" />;
      }
      return (
        <AddCircle
          color="primary"
          data-testid="addIcon"
          aria-label="summary-card.add-icon-arialabel"
        />
      );
    }

    return <Verified color="success" data-testid="verifiedIcon" />;
  };

  const getDescription = () => {
    if (!hasAddress) {
      return t('summary-card.no-address');
    }

    const contactsType = contacts.reduce((acc, item) => {
      // eslint-disable-next-line functional/immutable-data
      acc[item.channelType] = t(`summary-card.${item.channelType}`);
      return acc;
    }, {} as { [key: string]: string });

    return Object.values(contactsType).join(', ');
  };

  const goToSection = () => {
    const sectionId = isCourtesyCard ? 'courtesyContactsSection' : 'legalContactsSection';

    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Card
      sx={{
        p: 2,
        width: { xs: '100%', lg: '185px' },
        cursor: 'pointer',
        '&:hover, &:active': { bgcolor: '#F6F7F8' },
      }}
      onClick={goToSection}
      data-testid={isCourtesyCard ? 'courtesyContactsCard' : 'legalContactsCard'}
    >
      {getIcon()}
      <Typography variant="body2" fontWeight={700} mt={0.5} mb={1} data-testid="cardTitle">
        {t(title)}
      </Typography>
      <Typography variant="body2" data-testid="cardDescription">
        {getDescription()}
      </Typography>
    </Card>
  );
};

const ContactsSummaryCards: React.FC = () => {
  const { legalAddresses, courtesyAddresses } = useAppSelector(contactsSelectors.selectAddresses);

  const isSercQEnabled = legalAddresses.some(
    (address) => address.channelType === ChannelType.SERCQ
  );

  return (
    <Stack direction="row" gap={{ xs: 1.25, lg: 2 }} mb={{ xs: 5, lg: 6 }} mt={3}>
      <ContactsSummaryCard contacts={legalAddresses} addressType={AddressType.LEGAL} />
      <ContactsSummaryCard
        contacts={courtesyAddresses}
        isSercQEnabled={isSercQEnabled}
        addressType={AddressType.COURTESY}
      />
    </Stack>
  );
};

export default ContactsSummaryCards;
