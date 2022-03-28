import { Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardElem, NotificationsCard, Row } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Delegation } from '../../redux/delegation/types';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { AcceptButton, Menu, OrganizationsList } from './delegationsColumns';

const MobileDelegators = () => {
  const { t } = useTranslation(['deleghe']);
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const cardData: Array<Row> = delegators.map((e: Delegation) => ({
    id: e.mandateId,
    name: `${e.delegator.firstName} ${e.delegator.lastName}`,
    startDate: e.datefrom,
    endDate: e.dateto,
    email: e.email,
    visibilityIds: e.visibilityIds.map((f: any) => f.name),
    status: e.status,
  }));

  const cardHeader: [CardElem, CardElem] = [
    {
      id: 'status',
      label: t('deleghe.table.'),
      getLabel(value: string, row: Row) {
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

  const cardBody: Array<CardElem> = [
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
          <Typography variant="h6" mb={2}>
            {t('deleghe.delegatorsTitle')}
          </Typography>
          <NotificationsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} />
        </Box>
      )}
    </>
  );
};

export default MobileDelegators;
