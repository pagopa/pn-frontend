import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardElement, ItemCard, Item } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const MobileDelegators = () => {
  const { t } = useTranslation(['deleghe']);
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const cardData: Array<Item> = delegationToItem(delegators, true);

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'status',
      label: t('deleghe.table.'),
      getLabel(value: string, row: Item) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        if (value === DelegationStatus.ACTIVE) {
          return <Chip label={label} color={color} />;
        } else {
          return <AcceptButton id={row.id} />;
        }
      },
    },
    {
      id: 'id',
      label: '',
      getLabel(value: string) {
        return <Menu menuType={'delegators'} id={value} />;
      },
    },
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'name',
      label: t('Nome'),
      getLabel(value: string) {
        return <b>{value}</b>;
      },
    },
    {
      id: 'email',
      label: t('Email'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'startDate',
      label: t('Inizio Delega'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'endDate',
      label: t('Fine Delega'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'visibilityIds',
      label: t('Permessi per vedere'),
      getLabel(value: Array<string>) {
        return <OrganizationsList organizations={value} />;
      },
    },
  ];

  return (
    <>
      {delegators.length > 0 && (
        <Box mx={1} mb={8}>
          <Typography variant="h4" mb={2}>
            {t('deleghe.delegatorsTitle')}
          </Typography>
          <ItemCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} />
        </Box>
      )}
    </>
  );
};

export default MobileDelegators;
