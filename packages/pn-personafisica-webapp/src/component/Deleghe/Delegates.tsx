import { useNavigate } from 'react-router-dom';
import { Box, Chip, Stack, styled, Typography } from '@mui/material';
import { Add, SentimentDissatisfied } from '@mui/icons-material';
import { Column, NotificationsTable as Table, OutlinedButton, Row } from '@pagopa-pn/pn-commons';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import * as routes from '../../navigation/routes.const';
import { Delegation } from '../../redux/delegation/types';
import { DelegationStatus, getDelegationStatusLabelAndColor } from '../../utils/status.utility';
import { Menu, OrganizationsList } from './DelegationsElements';

const StyledStack = styled(Stack)`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;

const Delegates = () => {
  const theme = useTheme();
  const { t } = useTranslation(['deleghe']);
  const navigate = useNavigate();
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegates
  );

  const rows: Array<Row> = delegates.map((e: Delegation) => ({
    id: e.mandateId,
    name: `${e.delegate.firstName} ${e.delegate.lastName}`,
    startDate: e.datefrom,
    endDate: e.dateto,
    email: e.email,
    visibilityIds: e.visibilityIds.map((f: any) => f.name),
    status: e.status,
  }));

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
          <OutlinedButton onClick={handleAddDelegationClick}>
            <Add fontSize={'small'} sx={{ marginRight: 1 }} />
            {t('deleghe.add')}
          </OutlinedButton>
        </Box>
      </Stack>
      {rows.length ? (
        <Table columns={delegatesColumns} rows={rows} />
      ) : (
        <StyledStack
          sx={{ fontSize: '16px' }}
          direction={'row'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <SentimentDissatisfied
            fontSize={'small'}
            sx={{ verticalAlign: 'middle', margin: '0 20px' }}
          />
          <Typography sx={{ marginRight: '8px' }}>
            Non hai delegato nessuna persona alla visualizzazione delle tue notifiche.
          </Typography>
          <Typography
            sx={{ color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleAddDelegationClick}
          >
            {t('deleghe.add')}
          </Typography>
        </StyledStack>
      )}
    </Box>
  );
};

export default Delegates;
