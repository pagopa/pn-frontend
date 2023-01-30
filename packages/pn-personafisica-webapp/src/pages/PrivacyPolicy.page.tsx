import { useEffect, useState } from 'react';
import { Grid, Link, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import * as routes from '../navigation/routes.const';
import { useToSLayout } from '@pagopa-pn/pn-commons';
declare const OneTrust: any;

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    useToSLayout(contentLoaded, routes);
    OneTrust.NoticeApi.Initialized.then(function () {
      OneTrust.NoticeApi.LoadNotices(
        [
          'https://privacyportalde-cdn.onetrust.com/77f17844-04c3-4969-a11d-462ee77acbe1/privacy-notices/draft/5b7fed3e-ea34-4620-b01d-b17fa7c88441.json',
        ],
        false
      );
    }).finally(() => {
      setContentLoaded(true);
    });
  }, []);

  return (
    <>
      <Grid sx={{ px: 3, py: 3 }}>
        <div id="otnotice-5b7fed3e-ea34-4620-b01d-b17fa7c88441" className="otnotice"></div>
      </Grid>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}>
        <Grid
          sx={{ display: 'grid', gridColumn: 'span 2', mt: 5, justifyContent: 'center' }}
        ></Grid>
        <Grid sx={{ display: 'grid', gridColumn: 'span 10', mt: 5, justifyContent: 'center' }}>
          <Link underline="hover" href={routes.APP_STATUS}>
            {t('tos.backHome')}
          </Link>
        </Grid>
      </Box>
    </>
  );
};

export default PrivacyPolicy;
