import { useNavigate } from 'react-router-dom';
import { Box, Stack, styled, Typography } from '@mui/material';
import { Add, SentimentDissatisfied } from '@mui/icons-material';
import { NotificationsTable as Table, OutlinedButton, Row } from '@pagopa-pn/pn-commons';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import * as routes from '../../navigation/routes.const';
import { Delegation } from '../../redux/delegation/types';
import { delegatesColumns } from './delegationsColumns';

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
