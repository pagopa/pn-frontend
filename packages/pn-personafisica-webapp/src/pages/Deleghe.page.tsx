import { Box } from '@mui/material';

import TitleAndDescription from '../component/TitleAndDescription/TitleAndDescription';
import Delegates from './components/Deleghe/Delegates';
import Delegators from './components/Deleghe/Delegators';

const Deleghe = () => (
  <Box sx={{ marginRight: 2 }}>
    <TitleAndDescription title={'Deleghe'}>
      Qui puoi gestire <b>i tuoi delegati</b> e le <b>deleghe a tuo carico</b>. I primi sono le
      persone fisiche o giuridiche che hai autorizzato alla visualizzazione e gestione delle tue
      notifiche, le seconde sono color che hanno autorizzato te.
    </TitleAndDescription>
    <Delegates />
    <Delegators />
  </Box>
);

export default Deleghe;
