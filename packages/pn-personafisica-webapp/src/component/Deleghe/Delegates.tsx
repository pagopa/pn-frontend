import { useNavigate } from 'react-router-dom';
import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import { Add } from '@mui/icons-material';
import { Column, ItemsTable as Table, Item } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import * as routes from '../../navigation/routes.const';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { Menu, OrganizationsList } from './DelegationsElements';

const Delegates = () => {
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );

  const rows: Array<Item> = delegationToItem(delegates, false);

  const delegatesColumns: Array<Column> = [
    {
      id: 'name',
      label: t('deleghe.table.name'),
      width: '13%',
      sortable: true,
      getCellLabel(value: string) {
        return <b>{value}</b>;
      },
    },
    {
      id: 'email',
      label: t('deleghe.table.email'),
      width: '18%',
      sortable: true,
      getCellLabel(value: string) {
        return value;
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
    },
    {
      id: 'visibilityIds',
      label: t('deleghe.table.permissions'),
      width: '14%',
      getCellLabel(value: Array<string>) {
        return <OrganizationsList organizations={value} />;
      },
    },
    {
      id: 'status',
      label: t('deleghe.table.status'),
      width: '18%',
      align: 'center' as const,
      getCellLabel(value: string) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        return <Chip label={label} color={color} />;
      },
    },
    {
      id: 'id',
      label: '',
      width: '5%',
      getCellLabel(value: string) {
        return <Menu menuType={'delegates'} id={value} />;
      },
    },
  ];

  const handleAddDelegationClick = () => {
    navigate(routes.NUOVA_DELEGA);
  };

  return (
    <Box mb={8}>
      <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <Typography variant="h6">{t('deleghe.delegatesTitle')}</Typography>
        <Box>
          <Button variant="outlined" onClick={handleAddDelegationClick}>
            <Add fontSize={'small'} sx={{ marginRight: 1 }} />
            {t('deleghe.add')}
          </Button>
        </Box>
      </Stack>
      <Table
        columns={delegatesColumns}
        rows={rows}
        emptyActionLabel={t('deleghe.add') as string}
        emptyMessage={'Non hai delegato nessuna persona alla visualizzazione delle tue notifiche.'}
        emptyActionCallback={handleAddDelegationClick}
      />
    </Box>
  );
};

export default Delegates;
