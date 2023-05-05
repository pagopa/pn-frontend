import { useCallback, useEffect, useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import { TitleBox, TabPanel } from '@pagopa-pn/pn-commons';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { resetState } from '../redux/delegation/reducers';
import {
  getDelegators,
  getGroups,
  getDelegatesByCompany,
  getDelegatorsNames,
} from '../redux/delegation/actions';
import { RootState } from '../redux/store';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import DelegatesByCompany from '../component/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../component/Deleghe/DelegationsOfTheCompany';
import { getConfiguration } from '../services/configuration.service';

const Deleghe = () => {
  const { t } = useTranslation(['deleghe']);
  const [pageReady, setPageReady] = useState(false);
  const [value, setValue] = useState(0);
  const { isGroupAdmin } = useAppSelector((state: RootState) => state.userState.user);
  const dispatch = useAppDispatch();
  const { DELEGATIONS_TO_PG_ENABLED } = getConfiguration();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const retrieveData = useCallback(() => {
    // groups administrator cannot see the delegates by the company
    if (!isGroupAdmin) {
      void dispatch(getDelegatesByCompany());
    }
    if (DELEGATIONS_TO_PG_ENABLED) {
      void dispatch(getDelegators({ size: 10 }));
      void dispatch(getGroups());
      void dispatch(getDelegatorsNames());
    }
    setPageReady(true);
  }, []);

  useEffect(() => {
    retrieveData();
    return () => {
      dispatch(resetState());
    };
  }, []);

  return (
    <LoadingPageWrapper isInitialized={pageReady}>
      <Box
        sx={{
          width: '100%',
          justifyContent: 'center',
        }}
      >
        <Box mb={2} p={3}>
          <TitleBox title={t('deleghe.title')} variantTitle={'h4'}>
            {t('deleghe.description')}
          </TitleBox>
        </Box>
        {!isGroupAdmin && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 3 }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label={t('deleghe.tab_aria_label')}
                centered
                variant="fullWidth"
              >
                <Tab data-testid="tab1" label={t('deleghe.tab_delegati')} />
                <Tab data-testid="tab2" label={t('deleghe.tab_deleghe')} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <DelegatesByCompany />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <DelegationsOfTheCompany />
            </TabPanel>
          </>
        )}
        {isGroupAdmin && (
          <Box sx={{ mx: 3 }}>
            <DelegationsOfTheCompany />
          </Box>
        )}
      </Box>
    </LoadingPageWrapper>
  );
};

export default Deleghe;
