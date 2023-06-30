import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { EmptyState, ApiErrorWrapper, useIsMobile, SmartTable, Item } from '@pagopa-pn/pn-commons';
import { SmartTableData } from '@pagopa-pn/pn-commons/src/types/SmartTable';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import * as routes from '../../navigation/routes.const';
import { DELEGATION_ACTIONS, getDelegatesByCompany } from '../../redux/delegation/actions';
import { trackEventByType } from '../../utils/mixpanel';
import { TrackEventType } from '../../utils/events';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utils/delegation.utility';
import { DelegatesColumn, DelegationStatus } from '../../models/Deleghe';
import { getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { Menu, OrganizationsList } from './DelegationsElements';

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
  const userLogged = useAppSelector((state: RootState) => state.userState.user);

  const rows: Array<Item> = delegationToItem(delegatesByCompany);

  const handleAddDelegationClick = (source: string) => {
    navigate(routes.NUOVA_DELEGA);
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_ADD_CTA, { source });
  };

  const delegatesColumn: Array<SmartTableData<DelegatesColumn>> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      tableConfiguration: {
        width: '13%',
        sortable: true,
      },
      getValue(value) {
        return <Typography fontWeight={'bold'}>{value}</Typography>;
      },
      cardConfiguration: {
        position: 'body',
        notWrappedInTypography: true,
      },
    },
    {
      id: 'startDate',
      label: t('deleghe.table.delegationStart'),
      tableConfiguration: {
        width: '11%',
      },
      getValue(value) {
        return value;
      },
      cardConfiguration: {
        position: 'body',
      },
    },
    {
      id: 'endDate',
      label: t('deleghe.table.delegationEnd'),
      tableConfiguration: {
        width: '11%',
        sortable: true,
      },
      getValue(value) {
        return value;
      },
      cardConfiguration: {
        position: 'body',
      },
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      tableConfiguration: {
        width: '11%',
      },
      getValue(value: Array<string>) {
        return <OrganizationsList organizations={value} visibleItems={3} />;
      },
      cardConfiguration: {
        position: 'body',
        notWrappedInTypography: true,
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      tableConfiguration: {
        width: '18%',
      },
      getValue(value: string) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        return <Chip label={label} color={color} />;
      },
      cardConfiguration: {
        position: 'header',
        gridProps: { xs: 8 },
      },
    },
    {
      id: 'id',
      label: '',
      tableConfiguration: {
        width: '5%',
      },
      getValue(value: string, data: Item) {
        return (
          <Menu
            menuType={'delegates'}
            id={value}
            row={data}
            userLogged={userLogged}
            onAction={handleRewoke}
          />
        );
      },
      cardConfiguration: {
        position: 'header',
        gridProps: { xs: 4 },
      },
    },
  ];

  const handleRewoke = (mandateId: string) => {
    // because a PG can delegate itself, we must check if the rewoked delegation is in delegates object and redo the delegators api call
    const isSelfMandate =
      delegators.findIndex((delegator) => delegator.mandateId === mandateId) > -1;
    if (isSelfMandate) {
      getDelegatorsData();
    }
  };

  return (
    <>
      <Box mb={8}>
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
            variant="outlined"
            onClick={(_e, source = 'default') => handleAddDelegationClick(source)}
            data-testid="addDeleghe"
          >
            <AddIcon fontSize={'small'} sx={{ marginRight: 1 }} />
            {t('deleghe.add')}
          </Button>
        </Stack>
        <ApiErrorWrapper
          apiId={DELEGATION_ACTIONS.GET_DELEGATES_BY_COMPANY}
          reloadAction={() => dispatch(getDelegatesByCompany())}
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
              currentSort={{ orderBy: '', order: 'asc' }}
            ></SmartTable>
          ) : (
            <EmptyState
              emptyActionLabel={t('deleghe.add')}
              emptyMessage={t('deleghe.no_delegates', { organizationName: organization.name })}
              emptyActionCallback={(_e, source = 'empty_state') => handleAddDelegationClick(source)}
            />
          )}
        </ApiErrorWrapper>
      </Box>
    </>
  );
};

export default DelegatesByCompany;
function getDelegatorsData() {
  throw new Error('Function not implemented.');
}
