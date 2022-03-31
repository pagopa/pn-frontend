import { Box, Chip, Stack, Typography } from '@mui/material';
import { Column, ItemsTable, Item } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import delegationToItem from '../../utils/delegation.utility';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { AcceptButton, Menu, OrganizationsList } from './DelegationsElements';

const Delegators = () => {
  const { t } = useTranslation(['deleghe']);
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const rows: Array<Item> = delegationToItem(delegates, true);

  const delegatorsColumns: Array<Column> = [
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
      id: 'email',
      label: t('deleghe.table.email'),
      width: '18%',
      sortable: true,
      getCellLabel(value: string) {
        return <Typography sx={{ wordBreak: 'break-all' }}>{value}</Typography>;
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
      getCellLabel(value: string, row: Item) {
        const { label, color } = getDelegationStatusLabelAndColor(value as DelegationStatus);
        if (value === DelegationStatus.ACTIVE) {
          return <Chip label={label} color={color} />;
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

  return (
    <>
      {rows.length > 0 && (
        <Box mb={8}>
          <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h6">Deleghe a tuo carico</Typography>
          </Stack>
          <ItemsTable
            columns={delegatorsColumns}
            rows={rows}
            emptyActionCallback={() => console.log()}
          />
        </Box>
      )}
    </>
  );
};

export default Delegators;
