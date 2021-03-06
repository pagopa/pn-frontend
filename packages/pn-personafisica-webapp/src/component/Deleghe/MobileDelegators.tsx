import { Box, Chip, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CardElement, ItemsCard, Item } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import TableError from '../TableError/TableError';
import { getDelegators } from '../../redux/delegation/actions';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const MobileDelegators = () => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );
  const delegatorsError = useAppSelector(
    (state: RootState) => state.delegationsState.delegatorsError
  );

  const cardData: Array<Item> = delegationToItem(delegators);

  const cardHeader: [CardElement, CardElement] = [
    {
      id: 'status',
      label: t('deleghe.table.status'),
      getLabel(value: string, row: Item) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        if (value === DelegationStatus.ACTIVE) {
          return <Chip label={label} color={color} />;
        } else {
          return <AcceptButton id={row.id} name={row.name as string} />;
        }
      },
      gridProps: {
        xs: 8
      }
    },
    {
      id: 'id',
      label: '',
      getLabel(value: string) {
        return <Menu menuType={'delegators'} id={value} />;
      },
      gridProps: {
        xs: 4
      }
    },
  ];

  const cardBody: Array<CardElement> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      getLabel(value: string) {
        return <b>{value}</b>;
      },
    },
    {
      id: 'email',
      label: t('deleghe.table.email'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      getLabel(value: string) {
        return value;
      },
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      getLabel(value: Array<string>) {
        return <OrganizationsList organizations={value} textVariant="body2" />;
      },
      notWrappedInTypography: true,
    },
  ];

  return (
    <>
      {delegatorsError && (
        <Box>
          <Stack mb={3} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h6">Deleghe a tuo carico</Typography>
          </Stack>
          <TableError onClick={() => dispatch(getDelegators())} />
        </Box>
      )}
      {!delegatorsError && delegators.length > 0 && (
        <Box>
          <Typography variant="h4" mb={3}>
            {t('deleghe.delegatorsTitle')}
          </Typography>
          <ItemsCard cardHeader={cardHeader} cardBody={cardBody} cardData={cardData} />
        </Box>
      )}
    </>
  );
};

export default MobileDelegators;
