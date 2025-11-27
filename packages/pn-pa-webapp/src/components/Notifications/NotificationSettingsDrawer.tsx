import { useFormik } from 'formik';
import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import { CustomDropdown, LANGUAGES, useIsMobile } from '@pagopa-pn/pn-commons';
import { ButtonNaked, LangCode } from '@pagopa/mui-italia';

import { BILINGUALISM_LANGUAGES, NewNotificationLangOther } from '../../models/NewNotification';
import { setAdditionalLanguages } from '../../redux/auth/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';

const NotificationSettingsDrawer = () => {
  const dispatch = useAppDispatch();
  const [openDrawer, setOpenDrawer] = useState(false);
  const { t, i18n } = useTranslation(['notifiche']);
  const additionalLanguages = useAppSelector(
    (state: RootState) => state.userState.additionalLanguages
  );
  const isMobile = useIsMobile();

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const onCloseDrawer = async () => {
    if (formik.dirty) {
      formik.handleSubmit();
      return;
    }
    setOpenDrawer(false);
  };

  const validationSchema = yup.object({
    lang: yup.string().oneOf(['it', NewNotificationLangOther]).required(),
    additionalLang: yup.string().when('lang', {
      is: NewNotificationLangOther,
      then: yup.string().required(t('settings.select-language-to-confirm')),
    }),
  });

  const initialValues =
    additionalLanguages && additionalLanguages.length > 0
      ? {
          lang: NewNotificationLangOther,
          additionalLang: additionalLanguages[0],
        }
      : {
          lang: 'it',
          additionalLang: '',
        };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      void dispatch(
        setAdditionalLanguages(
          values.lang === NewNotificationLangOther ? [values.additionalLang] : []
        )
      );
      setOpenDrawer(false);
    },
  });

  const handleChangeLang = async (e: ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    await formik.setFieldTouched('additionalLang', false, false);
  };

  const languages = useMemo(() => {
    const currentLang = i18n.language?.substring(0, 2) as LangCode;
    return LANGUAGES[currentLang] ?? LANGUAGES.it;
  }, [i18n.language]);

  return (
    <>
      <ButtonNaked
        color="primary"
        sx={{ fontSize: '16px', fontWeight: 700 }}
        onClick={toggleDrawer}
        data-testid="settingsLangBtn"
      >
        {t('settings.language-settings-title')}
      </ButtonNaked>
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={onCloseDrawer}
        data-testid="settingsLangDrawer"
      >
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <IconButton aria-label="close" onClick={onCloseDrawer}>
            <CloseIcon fontSize="medium" sx={{ color: 'action.active' }} />
          </IconButton>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Box paddingX={4}>
            <Typography variant="h6" color="text.primary">
              {t('settings.language-settings-title')}
            </Typography>
            <Typography
              variant="body2"
              color="text.primary"
              whiteSpace={isMobile ? 'normal' : 'pre-line'}
              mt={2}
              mb={2}
            >
              {t('settings.language-settings-subtitle')}
            </Typography>
            <FormControl fullWidth>
              <RadioGroup
                aria-labelledby="notification-language-label"
                name="lang"
                value={formik.values.lang}
                onChange={handleChangeLang}
              >
                <FormControlLabel
                  value={'it'}
                  control={<Radio />}
                  label={languages.it}
                  data-testid="notificationLanguageRadio"
                />
                <FormControlLabel
                  value={NewNotificationLangOther}
                  control={<Radio />}
                  label={t(
                    'new-notification.steps.preliminary-informations.italian-and-other-language'
                  )}
                  data-testid="notificationLanguageRadio"
                />
              </RadioGroup>
              {formik.values.lang === NewNotificationLangOther && (
                <Box mt={4}>
                  <CustomDropdown
                    id="additionalLang"
                    label={`${t(
                      'new-notification.steps.preliminary-informations.select-other-language'
                    )}*`}
                    name="additionalLang"
                    size="medium"
                    margin="none"
                    value={formik.values.additionalLang}
                    onChange={(e) => formik.handleChange(e)}
                    fullWidth
                    error={formik.touched.additionalLang && !!formik.errors.additionalLang}
                    helperText={formik.touched.additionalLang && formik.errors.additionalLang}
                  >
                    {Object.keys(languages)
                      .filter((key) => BILINGUALISM_LANGUAGES.includes(key))
                      .map((key) => (
                        <MenuItem key={key} value={key}>
                          {languages[key as LangCode]}
                        </MenuItem>
                      ))}
                  </CustomDropdown>
                </Box>
              )}
            </FormControl>
          </Box>
        </form>
      </Drawer>
    </>
  );
};

export default NotificationSettingsDrawer;
