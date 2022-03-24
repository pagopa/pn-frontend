import { Box, Stack } from '@mui/material';
import { NotificationsTable, Row, Sort } from '@pagopa-pn/pn-commons';

import { RootState } from '../../../redux/store';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setDelegatorsSorting } from '../../../redux/delegation/actions';
import { delegatorsColumns } from './delegationsColumns';

const Delegators = () => {

  const dispatch = useAppDispatch();
  
  const delegates = useAppSelector(
    (state: RootState) => state.delegationsState.delegations.delegators
  );

  const sortDelegators = useAppSelector((state: RootState) => state.delegationsState.sortDelegators);

  const rows: Array<Row> = delegates.map((e: any) => ({
    id: e.mandateId,
    name: `${e.delegate.firstName} ${e.delegate.lastName}`,
    startDate: e.datefrom,
    endDate: e.dateto,
    email: e.email,
    visibilityIds: e.visibilityIds.map((f: any) => f.name),
    status: e.status,
  }));

  const handleChangeSorting = (s: Sort) => {
    dispatch(setDelegatorsSorting(s));
  };
  
  return (
    <>
      {rows.length > 0 && (
        <Box mb={8}>
          <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
            <h2>Deleghe a tuo carico</h2>
          </Stack>
          <NotificationsTable columns={delegatorsColumns} rows={rows} sort={sortDelegators} onChangeSorting={handleChangeSorting}/>
        </Box>
      )}
    </>
  );
};

export default Delegators;
