import { useTranslation } from 'react-i18next';

import { Box, Stack, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  Column,
  EmptyState,
  KnownSentiment,
  PnTable,
  PnTableBody,
  PnTableBodyCell,
  PnTableBodyRow,
  PnTableHeader,
  PnTableHeaderCell,
  Row,
  Sort,
} from '@pagopa-pn/pn-commons';

import { DelegationColumnData, DelegationData } from '../../models/Deleghe';
import { DELEGATION_ACTIONS, getDelegators } from '../../redux/delegation/actions';
import { setDelegatorsSorting } from '../../redux/delegation/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utility/delegation.utility';
import DelegatorsDataSwitch from './DelegationDataSwitch';

const Delegators = () => {
  const { t } = useTranslation(['deleghe']);
  const dispatch = useAppDispatch();
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );
  const sortDelegators = useAppSelector(
    (state: RootState) => state.delegationsState.sortDelegators
  );

  const rows: Array<Row<DelegationData>> = delegationToItem(delegators);

  const delegatorsColumns: Array<Column<DelegationColumnData>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      width: '13%',
      sortable: true,
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      width: '11%',
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      width: '11%',
      sortable: true,
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      width: '13%',
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      width: '18%',
    },
    {
      id: 'menu',
      label: '',
      width: '5%',
    },
  ];

  const handleChangeSorting = (s: Sort<DelegationColumnData>) => {
    dispatch(setDelegatorsSorting(s));
  };

  return (
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
            <PnTableHeader>
              {delegatorsColumns.map((column) => (
                <PnTableHeaderCell
                  key={column.id}
                  sort={sortDelegators}
                  columnId={column.id}
                  sortable={column.sortable}
                  handleClick={handleChangeSorting}
                  testId="delegatorsTable.header.cell"
                >
                  {column.label}
                </PnTableHeaderCell>
              ))}
            </PnTableHeader>
            <PnTableBody>
              {rows.map((row, index) => (
                <PnTableBodyRow key={row.id} testId="delegatorsTable.body.row" index={index}>
                  {delegatorsColumns.map((column) => (
                    <PnTableBodyCell
                      key={column.id}
                      cellProps={{
                        width: column.width,
                        align: column.align,
                        cursor: column.onClick ? 'pointer' : 'auto',
                      }}
                    >
                      <DelegatorsDataSwitch data={row} type={column.id} menuType="delegators" />
                    </PnTableBodyCell>
                  ))}
                </PnTableBodyRow>
              ))}
            </PnTableBody>
          </PnTable>
        ) : (
          <EmptyState sentimentIcon={KnownSentiment.NONE}>{t('deleghe.no_delegators')}</EmptyState>
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default Delegators;
