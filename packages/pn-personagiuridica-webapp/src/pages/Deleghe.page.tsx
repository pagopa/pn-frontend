import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { Box, Tab, Tabs } from '@mui/material';
import { TabPanel, TitleBox } from '@pagopa-pn/pn-commons';

import LoadingPageWrapper from '../components/LoadingPageWrapper/LoadingPageWrapper';
import * as routes from '../navigation/routes.const';
import {
  getGroups,
  getMandatesByDelegator,
  searchMandatesByDelegate,
} from '../redux/delegation/actions';
import { resetState } from '../redux/delegation/reducers';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { RootState } from '../redux/store';
import { getConfiguration } from '../services/configuration.service';

const Deleghe = () => {
  const { t } = useTranslation(['deleghe']);
  const [pageReady, setPageReady] = useState(false);
  const { pathname } = useLocation();
  const [value, setValue] = useState(pathname === routes.DELEGATI ? 1 : 0);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { hasGroup } = useAppSelector((state: RootState) => state.userState.user);
  const { DELEGATIONS_TO_PG_ENABLED } = getConfiguration();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (newValue) {
      navigate(routes.DELEGATI);
    } else {
      navigate(routes.DELEGHEACARICO);
    }
  };

  const retrieveData = useCallback(() => {
    // groups administrator cannot see the delegates by the company
    if (!hasGroup) {
      void dispatch(getMandatesByDelegator());
    }
    if (DELEGATIONS_TO_PG_ENABLED) {
      void dispatch(searchMandatesByDelegate({ size: 10 }));
      void dispatch(getGroups());
    }
    setPageReady(true);
  }, []);

  useEffect(() => {
    retrieveData();
    return () => {
      dispatch(resetState());
    };
  }, []);

  useEffect(() => {
    const tabToBeSelected = pathname === routes.DELEGATI ? 1 : 0;
    if (value !== tabToBeSelected) {
      setValue(tabToBeSelected);
    }
  }, [pathname]);
  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box
        sx={{
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box mb={2} p={3}>
          <TitleBox
            title={t('deleghe.title')}
            variantTitle={'h4'}
            subTitle={t('deleghe.description')}
            variantSubTitle="body1"
          />
        </Box>
        {!hasGroup && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 3 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label={t('deleghe.tab_aria_label')}
                centered
                variant="fullWidth"
              >
                <Tab id="tab-2" value={0} data-testid="tab2" label={t('deleghe.tab_deleghe')} />
                <Tab id="tab-1" value={1} data-testid="tab1" label={t('deleghe.tab_delegati')} />
              </Tabs>
            </Box>
            <TabPanel value={-1} index={-1}>
              <Outlet />
            </TabPanel>
          </>
        )}
        {hasGroup && (
          <Box sx={{ mx: 3 }}>
            <Outlet />
          </Box>
        )}
      </Box>
    </LoadingPageWrapper>
  );
};

export default Deleghe;
