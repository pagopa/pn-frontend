import { Box, Stack, styled } from '@mui/material';
import { Add, SentimentDissatisfied } from '@mui/icons-material';
import { NotificationsTable as Table, Row } from '@pagopa-pn/pn-commons';

import { useTheme } from '@mui/material/styles';
import OutlinedButton from '../../../component/OutlinedButton';
import { DelegationStatus } from '../../../utils/status.utility';
import { delegatesColumns } from './delegationsColumns';

const StyledStack = styled(Stack)`
  border-radius: 4px;
  background-color: #ffffff;
  padding: 16px;
`;

const Delegates = () => {
  const theme = useTheme();
  // const delegates = useAppSelector((state: RootState) => state.delegationsState.delegates);
  const rows: Array<Row> = [
    {
      id: '0',
      name: 'Jimmy',
      startDate: 'ciao',
      endDate: 'arrivederci',
      email: 'email@vera.it',
      visibilityIds: ['pa1', 'pa2', 'pa3'],
      status: DelegationStatus.ACCEPTED,
    },
  ];

  const handleAddDelegationClick = () => {
    // TODO: redirect to create new delegation
    console.log('add');
  };

  return (
    <Box mb={8}>
      <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        <h2>I tuoi delegati</h2>
        <div>
          <OutlinedButton onClick={handleAddDelegationClick}>
            <Add fontSize={'small'} sx={{ marginRight: 1 }} />
            Aggiungi una delega
          </OutlinedButton>
        </div>
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
          <span style={{ marginRight: '8px' }}>
            Non hai delegato nessuna persona alla visualizzazione delle tue notifiche.
          </span>
          <span
            style={{ color: theme.palette.primary.main, cursor: 'pointer', fontWeight: 'bold' }}
            onClick={handleAddDelegationClick}
          >
            Aggiungi una delega
          </span>
        </StyledStack>
      )}
    </Box>
  );
};

export default Delegates;
