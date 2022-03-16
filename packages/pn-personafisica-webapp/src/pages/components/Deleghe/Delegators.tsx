import { Box, Stack } from '@mui/material';
import { NotificationsTable, Row } from '@pagopa-pn/pn-commons';

import { RootState } from '../../../redux/store';
import { useAppSelector } from '../../../redux/hooks';
import { delegatorsColumns } from './delegationsColumns';

const Delegators = () => {
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const rows: Array<Row> = delegates.map((e: any) => ({
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
