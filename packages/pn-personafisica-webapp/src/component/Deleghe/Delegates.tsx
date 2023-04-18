import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Column, ItemsTable as Table, Item, CodeModal, Sort, EmptyState, ApiErrorWrapper } from '@pagopa-pn/pn-commons';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import * as routes from '../../navigation/routes.const';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { DELEGATION_ACTIONS, getDelegates } from '../../redux/delegation/actions';
import { setDelegatesSorting } from '../../redux/delegation/reducers';
import { trackEventByType } from "../../utils/mixpanel";
import { TrackEventType } from "../../utils/events";
import { DelegatesColumn } from '../../models/Deleghe';

import { Menu, OrganizationsList } from './DelegationsElements';

const Delegates = () => {
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );
  const sortDelegates = useAppSelector((state: RootState) => state.delegationsState.sortDelegates);
  const [showCodeModal, setShowCodeModal] = useState({ open: false, name: '', code: '' });

  const rows: Array<Item> = delegationToItem(delegates);

  const delegatesColumns: Array<Column<DelegatesColumn>> = [
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
      width: '14%',
      getCellLabel(value: Array<string>) {
        return <OrganizationsList organizations={value} visibleItems={3} />;
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      width: '18%',
      align: 'center' as const,
      getCellLabel(value: string) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        return <Chip label={label} color={color} data-testid={`statusChip-${label}`} />;
      },
    },
    {
      id: 'id',
      label: '',
      width: '5%',
      getCellLabel(value: string, row: Item) {
        return (
          <Menu
            menuType={'delegates'}
            id={value}
            verificationCode={row.verificationCode}
            name={row.name}
            setCodeModal={setShowCodeModal}
          />
        );
      },
    },
  ];

  const handleAddDelegationClick = (source: string) => {
    navigate(routes.NUOVA_DELEGA);
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_ADD_CTA, {source});
  };

  const handleCloseShowCodeModal = () => {
    setShowCodeModal({ ...showCodeModal, open: false });
  };

  const handleChangeSorting = (s: Sort<DelegatesColumn>) => {
    dispatch(setDelegatesSorting(s));
  };

  return (
    <>
      <CodeModal
        title={t('deleghe.show_code_title', { name: showCodeModal.name })}
        subtitle={t('deleghe.show_code_subtitle')}
        open={showCodeModal.open}
        initialValues={showCodeModal.code.split('')}
        handleClose={handleCloseShowCodeModal}
        cancelCallback={handleCloseShowCodeModal}
        cancelLabel={t('deleghe.close')}
        codeSectionTitle={t('deleghe.verification_code')}
        isReadOnly
      />
      <Box mb={8} data-testid="delegates-wrapper">
        <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Typography variant="h5">{t('deleghe.delegatesTitle')}</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={(_e, source = 'default') => handleAddDelegationClick(source)}
              data-testid="add-delegation"
            >
              <AddIcon fontSize={'small'} sx={{ marginRight: 1 }} />
              {t('deleghe.add')}
            </Button>
          </Box>
        </Stack>
        <ApiErrorWrapper
          apiId={DELEGATION_ACTIONS.GET_DELEGATES}
          reloadAction={() => dispatch(getDelegates())}
        >
          <>
            {rows.length > 0 ? (
              <Table
                columns={delegatesColumns}
                rows={rows}
                sort={sortDelegates}
                onChangeSorting={handleChangeSorting}
              />
            ) : (
              <EmptyState
                emptyActionLabel={t('deleghe.add') as string}
                emptyMessage={t('deleghe.no_delegates') as string}
                emptyActionCallback={(_e, source = 'empty_state') =>
                  handleAddDelegationClick(source)
                }
              />
            )}
          </>
        </ApiErrorWrapper>
      </Box>
    </>
  );
};

export default Delegates;
