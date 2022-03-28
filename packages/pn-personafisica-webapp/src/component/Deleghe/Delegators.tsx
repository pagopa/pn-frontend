import { Box, Stack, Typography } from '@mui/material';
import { NotificationsTable, Row } from '@pagopa-pn/pn-commons';

import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Delegation } from '../../redux/delegation/types';
import { delegatorsColumns } from './delegationsColumns';

const Delegators = () => {
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
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

  return (
    <>
      {rows.length > 0 && (
        <Box mb={8}>
          <Stack mb={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <Typography variant="h6">Deleghe a tuo carico</Typography>
          </Stack>
          <NotificationsTable columns={delegatorsColumns} rows={rows} />
        </Box>
      )}
    </>
  );
};

export default Delegators;
