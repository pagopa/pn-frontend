import { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import { Box, Button, Chip, Link, Stack, Typography } from '@mui/material';
import {
  ApiErrorWrapper,
  CodeModal,
  Column,
  EmptyState,
  Item,
  Sort,
  ItemsTable as Table,
} from '@pagopa-pn/pn-commons';

import { DelegatesColumn } from '../../models/Deleghe';
import * as routes from '../../navigation/routes.const';
import { DELEGATION_ACTIONS, getDelegates } from '../../redux/delegation/actions';
import { setDelegatesSorting } from '../../redux/delegation/reducers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utility/delegation.utility';
import { TrackEventType } from '../../utility/events';
import { trackEventByType } from '../../utility/mixpanel';
import { DelegationStatus, getDelegationStatusKeyAndColor } from '../../utility/status.utility';
import { Menu, OrganizationsList } from './DelegationsElements';

const LinkAddDelegate: React.FC<{ handleAddDelegationClick: (source: string) => void }> = ({
  children,
  handleAddDelegationClick,
}) => {
  const { t } = useTranslation(['deleghe']);
  return (
    <Link
      component={'button'}
      id="call-to-action-first"
      aria-label={t('deleghe.add')}
      key="add-delegate"
      data-testid="link-add-delegate"
      onClick={(_e, source = 'empty_state') => handleAddDelegationClick(source)}
    >
      {children}
    </Link>
  );
};

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
      getCellLabel(value: string) {
        const { color, key } = getDelegationStatusKeyAndColor(value as DelegationStatus);
        return <Chip label={t(key)} color={color} />;
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
    trackEventByType(TrackEventType.DELEGATION_DELEGATE_ADD_CTA, { source });
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
              id="add-delegation-button"
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
                testId="delegatesTable"
              />
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
                />
              </EmptyState>
            )}
          </>
        </ApiErrorWrapper>
      </Box>
    </>
  );
};

export default Delegates;
