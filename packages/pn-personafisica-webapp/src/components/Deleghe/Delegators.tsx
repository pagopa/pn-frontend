import { useTranslation } from 'react-i18next';

import { Box, Chip, Stack, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  Column,
  EmptyState,
  Item,
  KnownSentiment,
  PnTable,
  PnTableBody,
  PnTableBodyCell,
  PnTableBodyRow,
  PnTableHeader,
  PnTableHeaderCell,
  Sort,
} from '@pagopa-pn/pn-commons';

import { DelegatorsColumn } from '../../models/Deleghe';
import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import { setDelegatorsSorting } from '../../redux/delegation/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utility/delegation.utility';
import { DelegationStatus, getDelegationStatusKeyAndColor } from '../../utility/status.utility';
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
      width: '13%',
      sortable: true,
      getCellLabel(value: string) {
        return <Typography fontWeight="bold">{value}</Typography>;
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      width: '11%',
      getCellLabel(value: string) {
        return value;
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      width: '11%',
      getCellLabel(value: string) {
        return value;
      },
      sortable: true,
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      width: '13%',
      getCellLabel(value: Array<string>) {
        return <OrganizationsList organizations={value} visibleItems={3} />;
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      width: '18%',
      getCellLabel(value: string, row: Item) {
        const { color, key } = getDelegationStatusKeyAndColor(value as DelegationStatus);
        if (value === DelegationStatus.ACTIVE) {
          return <Chip id={`chip-status-${color}`} label={t(key)} color={color} />;
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
            <PnTable testId="delegatorsTable">
              <PnTableHeader testId="tableHead">
                {delegatorsColumns.map((column) => (
                  <PnTableHeaderCell
                    key={column.id}
                    sort={sortDelegators}
                    columnId={column.id}
                    sortable={column.sortable}
                    handleClick={handleChangeSorting}
                  >
                    {column.label}
                  </PnTableHeaderCell>
                ))}
              </PnTableHeader>
              <PnTableBody testId="tableBody">
                {rows.map((row, index) => (
                  <PnTableBodyRow key={row.id} testId="delegatorsTable" index={index}>
                    {delegatorsColumns.map((column) => (
                      <PnTableBodyCell
                        disableAccessibility={column.disableAccessibility}
                        key={column.id}
                        cellProps={{
                          width: column.width,
                          align: column.align,
                          cursor: column.onClick ? 'pointer' : 'auto',
                        }}
                      >
                        {column.getCellLabel(row[column.id as keyof Item], row)}
                      </PnTableBodyCell>
                    ))}
                  </PnTableBodyRow>
                ))}
              </PnTableBody>
            </PnTable>
          ) : (
            <EmptyState sentimentIcon={KnownSentiment.NONE}>
              {t('deleghe.no_delegators')}
            </EmptyState>
          )}
        </ApiErrorWrapper>
      </Box>
    </>
  );
};

export default Delegators;
