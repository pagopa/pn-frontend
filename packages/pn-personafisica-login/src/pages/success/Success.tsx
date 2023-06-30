import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Box, Button, Grid, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import {
  AppRouteParams,
  AppRouteType,
  Layout,
  sanitizeString,
  useIsMobile,
} from '@pagopa-pn/pn-commons';

import { storageAarOps, storageTypeOps } from '../../utils/storage';
import { TrackEventType } from '../../utils/events';
import { trackEventByType } from '../../utils/mixpanel';
import { getConfiguration } from "../../services/configuration.service";

type DisambiguationAccountProps = {
  type: AppRouteType;
  selected?: boolean;
  onClickBox: (type: AppRouteType) => void;
  testId: string;
};

const DisambiguationAccount: React.FC<DisambiguationAccountProps> = ({
  type,
  selected = false,
  onClickBox,
  testId,
}: DisambiguationAccountProps) => {
  const { t } = useTranslation();

  const Icon = type === AppRouteType.PF ? PersonIcon : AccountBalanceIcon;
  const label = type === AppRouteType.PF ? t('disambiguationPage.pf') : t('disambiguationPage.pg');
  const boxBorder = selected ? '1px solid' : 'none';
  const boxBorderColor = selected ? 'primary.main' : 'none';
  const avatarBackgroundColor = selected ? 'white' : '#F5F5F5';
  const avatarIconColor = selected ? 'primary.main' : 'text.disabled';
  const boxBackgroundColor = selected ? 'primaryAction.selected' : 'white';
  const avatarTextColor = selected ? 'primary.main' : 'text.primary';

  return (
    <Grid container item justifyContent="center" mb={2} data-testid={testId}>
      <Grid item xs={10} sm={6} md={4} lg={4} xl={3}>
        <Box
          sx={{
            boxShadow:
              '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
            borderRadius: '16px',
            p: 4,
            backgroundColor: boxBackgroundColor,
            cursor: 'pointer',
            border: boxBorder,
            borderColor: boxBorderColor,
          }}
          onClick={() => onClickBox(type)}
        >
          <Box display="flex">
            <Avatar sx={{ backgroundColor: avatarBackgroundColor }} alt={label}>
              <Icon sx={{ margin: 'auto', color: avatarIconColor }} />
            </Avatar>
            <Typography
              fontWeight={600}
              sx={{ margin: 'auto', textAlign: 'left', marginLeft: '8px' }}
              display="inline-block"
              color={avatarTextColor}
            >
              {label}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

const SuccessPage = () => {
  const { i18n, t } = useTranslation(['login']);
  const isMobile = useIsMobile();
  const [typeSelected, setTypeSelected] = useState<AppRouteType | null>(null);
  const { PF_URL, PG_URL, PAGOPA_HELP_EMAIL } = getConfiguration();

  // momentarily changed for pn-5157
  // const typeUrl = useMemo(() => storageTypeOps.read(), []);
  const typeUrl = useMemo(() => AppRouteType.PF, []);
  const aar = useMemo(() => storageAarOps.read(), []);
  const token = useMemo(() => window.location.hash, []);

  const changeLanguageHandler = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
  };

  const handleAssistanceClick = () => {
    trackEventByType(TrackEventType.CUSTOMER_CARE_MAILTO, { source: 'postlogin' });
    // eslint-disable-next-line functional/immutable-data
    window.location.href = `mailto:${PAGOPA_HELP_EMAIL}`;
  };

  const calcRedirectUrl = useCallback(
    (type: AppRouteType): string => {
      // momentarily changed for pn-5157
      // eslint-disable-next-line functional/no-let
      let redirectUrl = PF_URL ? PF_URL : '';
      // let redirectUrl = '';
      if ((PF_URL && type === AppRouteType.PF) || (PG_URL && type === AppRouteType.PG)) {
        storageTypeOps.delete();
        // eslint-disable-next-line functional/immutable-data
        redirectUrl = `${type === AppRouteType.PF ? PF_URL : PG_URL}`;
      }

      // the includes check is needed to prevent xss attacks
      if (redirectUrl && [PF_URL, PG_URL].includes(redirectUrl) && aar) {
        storageAarOps.delete();
        // eslint-disable-next-line functional/immutable-data
        redirectUrl += `?${AppRouteParams.AAR}=${sanitizeString(aar)}`;
      }

      // the findIndex check is needed to prevent xss attacks
      if (
        redirectUrl &&
        [PF_URL, PG_URL].findIndex((url) => url && redirectUrl.startsWith(url)) > -1
      ) {
        window.location.replace(`${redirectUrl}${sanitizeString(token)}`);
      }

      return redirectUrl;
    },
    [aar, token]
  );

  const clickHandler = (type: AppRouteType) => {
    setTypeSelected(type);
  };

  const goToApp = () => {
    if (typeSelected) {
      calcRedirectUrl(typeSelected);
    }
  };

  useEffect(() => {
    calcRedirectUrl(typeUrl);
  }, [typeUrl]);

  // disambiguation page
  if (!typeUrl) {
    return (
      <Layout
        productsList={[]}
        onAssistanceClick={handleAssistanceClick}
        onLanguageChanged={changeLanguageHandler}
        showSideMenu={false}
        loggedUser={{
          id: '',
          name: undefined,
          surname: undefined,
          email: undefined,
        }}
      >
        <Grid container direction="column" my={isMobile ? 4 : 16}>
          <Grid container item justifyContent="center">
            <Grid item>
              <Typography
                component="h2"
                variant="h3"
                px={0}
                color="textPrimary"
                sx={{
                  textAlign: 'center',
                }}
              >
                {t('disambiguationPage.title')}
              </Typography>
              <Typography
                variant="body1"
                mb={isMobile ? 4 : 7}
                color="textPrimary"
                sx={{
                  textAlign: 'center',
                }}
              >
                {t('disambiguationPage.subTitle')}
              </Typography>
            </Grid>
            <DisambiguationAccount
              type={AppRouteType.PF}
              onClickBox={clickHandler}
              selected={typeSelected === AppRouteType.PF}
              testId="pf-box"
            />
            <DisambiguationAccount
              type={AppRouteType.PG}
              onClickBox={clickHandler}
              selected={typeSelected === AppRouteType.PG}
              testId="pg-box"
            />
            <Button
              variant="contained"
              sx={{ marginTop: isMobile ? 4 : 7 }}
              disabled={typeSelected === null}
              onClick={goToApp}
              data-testid="confirm-button"
            >
              {t('disambiguationPage.button')}
            </Button>
          </Grid>
        </Grid>
      </Layout>
    );
  }

  return null;
};

export default SuccessPage;
