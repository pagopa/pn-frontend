import { Button, CircularProgress, Grid, Icon } from '@mui/material';

import { IDP } from '../../models/IDPS';
import { getConfiguration } from '../../services/configuration.service';
import { shuffleList } from '../../utility/utils';

type Props = {
  idps: Array<IDP>;
  loading: boolean;
  onSelect: (idp: IDP) => void;
};

const SpidList: React.FC<Props> = ({ idps, loading, onSelect }) => {
  const { ONE_IDENTITY_CDN_URL } = getConfiguration();

  const shuffledIDPS = shuffleList<IDP>(idps);

  const getImageUrl = (entityID: string) =>
    `${ONE_IDENTITY_CDN_URL}/assets/idps/${btoa(entityID)}.png`;

  if (loading) {
    return <CircularProgress data-testid="spid-loader" />;
  }

  return (
    <Grid item>
      <Grid container direction="row" justifyItems="center" spacing={2}>
        {shuffledIDPS.map((idp, i) => (
          <Grid
            item
            key={idp.entityID}
            xs={6}
            sx={{ minWidth: '100px', textAlign: i % 2 === 0 ? 'right' : 'left' }}
          >
            <Button
              id={`spid-select-${idp.entityID}`}
              onClick={() => onSelect(idp)}
              sx={{ width: '100px', padding: '0' }}
              aria-label={idp.friendlyName}
            >
              <Icon sx={{ width: '100px', height: '48px' }}>
                <img width="100px" src={getImageUrl(idp.entityID)} alt={idp.friendlyName} />
              </Icon>
            </Button>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default SpidList;
