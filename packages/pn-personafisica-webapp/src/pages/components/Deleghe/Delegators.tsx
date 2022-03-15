import { Box, Stack } from '@mui/material';
import { NotificationsTable, Row } from '@pagopa-pn/pn-commons';

import { DelegationStatus } from '../../../utils/status.utility';
import { delegatorsColumns } from './delegationsColumns';

const Delegators = () => {
  const rows: Array<Row> = [
    {
      id: '1',
      name: 'Jimmy',
      startDate: 'ciao',
      endDate: 'arrivederci',
      email: 'email@vera.it',
      visibilityIds: ['pa1', 'pa2', 'pa3'],
      status: DelegationStatus.PENDING,
    },
  ];

  return (
    <>
      {rows.length > 0 && (
        <Box mb={8}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <h2>Deleghe a tuo carico</h2>
          </Stack>
          <NotificationsTable columns={delegatorsColumns} rows={rows} />
        </Box>
      )}
    </>
  );
};

export default Delegators;
