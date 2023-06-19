import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Tab, Tabs } from '@mui/material';
import { TitleBox, TabPanel } from '@pagopa-pn/pn-commons';
import { useNavigate } from 'react-router-dom';
import * as routes from '../navigation/routes.const';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { resetState } from '../redux/delegation/reducers';
import { getDelegators, getGroups, getDelegatesByCompany } from '../redux/delegation/actions';
import { RootState } from '../redux/store';
import LoadingPageWrapper from '../component/LoadingPageWrapper/LoadingPageWrapper';
import DelegatesByCompany from '../component/Deleghe/DelegatesByCompany';
import DelegationsOfTheCompany from '../component/Deleghe/DelegationsOfTheCompany';
import { getConfiguration } from '../services/configuration.service';

type Props = {
  indexOfTab: number;
};

const Deleghe = ({ indexOfTab = 0 }: Props) => {
  const { t } = useTranslation(['deleghe']);
  const [pageReady, setPageReady] = useState(false);
  // const [value, setValue] = useState(0);
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const { hasGroup } = useAppSelector((state: RootState) => state.userState.user);
  const { DELEGATIONS_TO_PG_ENABLED } = getConfiguration();

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    if (newValue) {
      navigate(routes.DELEGATI);
    } else {
      navigate(routes.DELEGHEACARICO);
    }
  };

  const retrieveData = useCallback(() => {
    // groups administrator cannot see the delegates by the company
    if (!hasGroup) {
      void dispatch(getDelegatesByCompany());
    }
    if (DELEGATIONS_TO_PG_ENABLED) {
      void dispatch(getDelegators({ size: 10 }));
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
        {!hasGroup && (
          <>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mx: 3 }}>
              <Tabs
                value={indexOfTab}
                onChange={handleChange}
                aria-label={t('deleghe.tab_aria_label')}
                centered
                variant="fullWidth"
              >
                <Tab data-testid="tab2" label={t('deleghe.tab_deleghe')} />
                <Tab data-testid="tab1" label={t('deleghe.tab_delegati')} />
              </Tabs>
            </Box>
            <TabPanel value={indexOfTab} index={0}>
              <DelegationsOfTheCompany />
            </TabPanel>
            <TabPanel value={indexOfTab} index={1}>
              <DelegatesByCompany />
            </TabPanel>
          </>
        )}
        {hasGroup && (
          <Box sx={{ mx: 3 }}>
            <DelegationsOfTheCompany />
          </Box>
        )}
      </Box>
    </LoadingPageWrapper>
  );
};

export default Deleghe;
