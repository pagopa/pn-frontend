import { useTranslation } from 'react-i18next';
import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  Column,
  ItemsTable,
  Item,
  Sort,
  ApiErrorWrapper,
  EmptyState,
  KnownSentiment,
} from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import { setDelegatorsSorting } from '../../redux/delegation/reducers';
import { DelegatorsColumn } from '../../models/Deleghe';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const Delegators = () => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );
  const sortDelegators = useAppSelector(
    (state: RootState) => state.delegationsState.sortDelegators
  );

  const rows: Array<Item> = delegationToItem(delegators);

  const delegatorsColumns: Array<Column<DelegatorsColumn>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      width: '18%',
      sortable: true,
      getCellLabel(value: string) {
        return <Typography fontWeight="bold">{value}</Typography>;
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      width: '13%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      width: '13%',
      getCellLabel(value: string) {
        return value;
      },
      sortable: true,
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      width: '18%',
      getCellLabel(value: Array<string>) {
        return <OrganizationsList organizations={value} visibleItems={3} />;
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      width: '20%',
      getCellLabel(value: string, row: Item) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        if (value === DelegationStatus.ACTIVE) {
          return <Chip label={label} color={color} data-testid={`statusChip-${label}`} />;
        } else {
          return <AcceptButton id={row.id} name={row.name as string} />;
        }
      },
    },
    {
      id: 'id',
      label: '',
      width: '5%',
      getCellLabel(value: string) {
        return <Menu menuType={'delegators'} id={value} />;
      },
    },
  ];

  const handleChangeSorting = (s: Sort<DelegatorsColumn>) => {
    dispatch(setDelegatorsSorting(s));
  };

  return (
    <>
      <Box mb={8} data-testid="delegators-wrapper">
        <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="h5">{t('deleghe.delegatorsTitle')}</Typography>
        </Stack>
        <ApiErrorWrapper
          apiId={DELEGATION_ACTIONS.GET_DELEGATORS}
          reloadAction={() => dispatch(getDelegators())}
          mainText={t('deleghe.delegatorsApiErrorMessage')}
        >
          {rows.length > 0 ? (
            <ItemsTable
              columns={delegatorsColumns}
              rows={rows}
              sort={sortDelegators}
              onChangeSorting={handleChangeSorting}
            />
          ) : (
            <EmptyState
              sentimentIcon={KnownSentiment.NONE}
              emptyMessage={t('deleghe.no_delegators')}
            />
          )}
        </ApiErrorWrapper>
      </Box>
    </>
  );
};

export default Delegators;
