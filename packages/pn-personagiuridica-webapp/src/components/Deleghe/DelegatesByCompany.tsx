import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Link, Stack, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  EmptyState,
  Row,
  SmartBody,
  SmartBodyCell,
  SmartBodyRow,
  SmartHeader,
  SmartHeaderCell,
  SmartTable,
  SmartTableData,
  Sort,
  sortArray,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { DelegationColumnData } from '../../models/Deleghe';
import * as routes from '../../navigation/routes.const';
import { DELEGATION_ACTIONS, getMandatesByDelegator } from '../../redux/delegation/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utility/delegation.utility';
import DelegationDataSwitch from './DelegationDataSwitch';

type Props = {
  handleAddDelegationClick: (source: string) => void;
  children?: React.ReactNode;
};

const LinkAddDelegate: React.FC<Props> = ({ children, handleAddDelegationClick }) => (
  <Link
    component={'button'}
    variant="body1"
    id="call-to-action-first"
    key="add-delegate"
    data-testid="link-add-delegate"
    onClick={(_e, source = 'empty_state') => handleAddDelegationClick(source)}
  >
    {children}
  </Link>
);

const DelegatesByCompany = () => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(['deleghe', 'notifiche']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const organization = useAppSelector((state: RootState) => state.userState.user.organization);
  const delegatesByCompany = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );
  const delegators = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const [sort, setSort] = useState<Sort<DelegationColumnData>>({ orderBy: '', order: 'asc' });
  const data = delegationToItem(delegatesByCompany) as Array<Row<DelegationColumnData>>;
  const rows = sortArray(sort.order, sort.orderBy, data);

  const handleAddDelegationClick = () => {
    navigate(routes.NUOVA_DELEGA);
  };

  const delegatesColumn: Array<SmartTableData<DelegationColumnData>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      tableConfiguration: {
        cellProps: { width: '13%' },
        sortable: true,
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      tableConfiguration: {
        cellProps: { width: '11%' },
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      tableConfiguration: {
        cellProps: { width: '11%' },
        sortable: true,
      },
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      tableConfiguration: {
        cellProps: { width: 'auto' },
      },
      cardConfiguration: {
        wrapValueInTypography: false,
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      tableConfiguration: {
        cellProps: { width: '18%' },
      },
      cardConfiguration: {
        position: 'left',
        isCardHeader: true,
        gridProps: { xs: 8 },
      },
    },
    {
      id: 'menu',
      label: '',
      tableConfiguration: {
        cellProps: { width: '5%' },
      },
      cardConfiguration: {
        position: 'right',
        isCardHeader: true,
        gridProps: { xs: 4 },
      },
    },
  ];

  const handleRewoke = (mandateId: string) => {
    // because a PG can delegate itself, we must check if the rewoked delegation is in delegators object and redo the delegators api call
    const isSelfMandate =
      delegators.findIndex((delegator) => delegator.mandateId === mandateId) > -1;
    if (isSelfMandate) {
      // getDelegatorsData();
    }
  };

  return (
    <Box mb={8} data-testid="delegatesByCompany">
      <Stack
        mb={4}
        direction={isMobile ? 'column' : 'row'}
        justifyContent={'space-between'}
        alignItems={isMobile ? 'flex-start' : 'center'}
      >
        <Typography variant="h6" mb={3}>
          {t('deleghe.delegatesTitle')}
        </Typography>
        <Button
          id="add-deleghe"
          variant="outlined"
          onClick={handleAddDelegationClick}
          data-testid="addDeleghe"
        >
          <AddIcon fontSize={'small'} sx={{ marginRight: 1 }} />
          {t('deleghe.add')}
        </Button>
      </Stack>
      <ApiErrorWrapper
        apiId={DELEGATION_ACTIONS.GET_MANDATES_BY_DELEGATOR}
        reloadAction={() => dispatch(getMandatesByDelegator())}
      >
        {delegatesByCompany.length > 0 ? (
          <SmartTable
            data={rows}
            conf={delegatesColumn}
            sortLabels={{
              title: t('sort.title', { ns: 'notifiche' }),
              optionsTitle: t('sort.options', { ns: 'notifiche' }),
              cancel: t('sort.cancel', { ns: 'notifiche' }),
              asc: t('sort.asc', { ns: 'notifiche' }),
              dsc: t('sort.desc', { ns: 'notifiche' }),
            }}
            currentSort={sort}
            onChangeSorting={setSort}
            testId="delegatesTable"
          >
            <SmartHeader>
              {delegatesColumn.map((column) => (
                <SmartHeaderCell
                  key={column.id.toString()}
                  columnId={column.id}
                  sortable={column.tableConfiguration.sortable}
                >
                  {column.label}
                </SmartHeaderCell>
              ))}
            </SmartHeader>
            <SmartBody>
              {rows.map((row, index) => (
                <SmartBodyRow key={row.id} index={index} testId="delegatesBodyRow">
                  {delegatesColumn.map((column) => (
                    <SmartBodyCell
                      key={column.id.toString()}
                      columnId={column.id}
                      tableProps={column.tableConfiguration}
                      cardProps={column.cardConfiguration}
                      isCardHeader={column.cardConfiguration?.isCardHeader}
                    >
                      <DelegationDataSwitch
                        data={row}
                        type={column.id}
                        menuType="delegates"
                        onAction={handleRewoke}
                      />
                    </SmartBodyCell>
                  ))}
                </SmartBodyRow>
              ))}
            </SmartBody>
          </SmartTable>
        ) : (
          <EmptyState>
            <Trans
              i18nKey={'deleghe.no_delegates'}
              ns={'deleghe'}
              components={[
                <LinkAddDelegate
                  key={'add-delegate'}
                  handleAddDelegationClick={handleAddDelegationClick}
                />,
              ]}
              values={{ organizationName: organization.name }}
            />
          </EmptyState>
        )}
      </ApiErrorWrapper>
    </Box>
  );
};

export default DelegatesByCompany;
