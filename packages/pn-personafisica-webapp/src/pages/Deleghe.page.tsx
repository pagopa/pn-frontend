import { Box } from '@mui/material';
import { TitleAndDescription } from '@pagopa-pn/pn-commons';

import { useState } from 'react';
import GenericError from '../component/GenericError/GenericError';
import { useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import Delegates from './components/Deleghe/Delegates';
import Delegators from './components/Deleghe/Delegators';



const Deleghe = () => {
  const {error} = useAppSelector((state: RootState) => state.delegationState);
  return (
    <Box sx={{ marginRight: 2 }}>
      {
        error ?
          <GenericError /> :
          <>
            <TitleAndDescription title={'Deleghe'}>
              Qui puoi gestire <b>i tuoi delegati</b> e le <b>deleghe a tuo carico</b>. I primi sono le
              persone fisiche o giuridiche che hai autorizzato alla visualizzazione e gestione delle tue
              notifiche, le seconde sono color che hanno autorizzato te.
            </TitleAndDescription>
            <Delegates />
            <Delegators />
          </>
      }
    </Box>
  );
};

export default Deleghe;
