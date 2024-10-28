import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
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
import { CustomDropdown } from '@pagopa-pn/pn-commons';
import { LANGUAGES } from '@pagopa-pn/pn-commons/src/utility/costants';
import { ButtonNaked, LangCode } from '@pagopa/mui-italia';

const NewNotificationLangOther = 'other'; // TODO replace from merge 2.1
const BILINGUALISM_LANGUAGES = ['it', 'en']; // TODO replace from merge 2.1

const NotificationSettingsButton = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { t, i18n } = useTranslation(['notifiche']);

  const toggleDrawer = () => setOpenDrawer(!openDrawer);

  const onClose = async () => {
    await formik.validateForm();
    if (!formik.isValid) {
      await formik.setTouched({ additionalLang: true });
      return;
    }
    formik.handleSubmit();
    setOpenDrawer(false);
  };

  const validationSchema = yup.object({
    lang: yup.string().required(),
    additionalLang: yup.string().when('lang', {
      is: NewNotificationLangOther,
      then: yup.string().required('Per confermare, seleziona una lingua'),
    }),
  });

  const formik = useFormik({
    initialValues: {
      lang: 'it',
      additionalLang: '',
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      resetForm();
    },
  });

  const languages = useMemo(() => {
    const currentLang = i18n.language?.substring(0, 2) as LangCode;
    return LANGUAGES[currentLang] ?? LANGUAGES.it;
  }, [i18n.language]);

  return (
    <>
      <ButtonNaked color="primary" sx={{ marginRight: '32px' }} onClick={toggleDrawer}>
        Impostazioni lingua
      </ButtonNaked>
      <Drawer anchor="right" open={openDrawer} onClose={onClose}>
        <Box display="flex" justifyContent="flex-end" padding={2}>
          <IconButton aria-label="close" onClick={onClose}>
            <CloseIcon fontSize="medium" sx={{ color: 'action.active' }} />
          </IconButton>
        </Box>
        <Box padding="0 16px">
          <Typography variant="h6" color="text.primary">
            Impostazioni lingua
          </Typography>
          <Typography variant="body2" color="text.primary" whiteSpace="pre" margin="16px 0">
            In questa sezione puoi scegliere una lingua aggiuntiva{'\n'}con cui inviare la notifica
            ai destinatari, oltre allitaliano.
          </Typography>
          <FormControl fullWidth>
            <RadioGroup
              aria-labelledby="notification-language-label"
              name="lang"
              value={formik.values.lang}
              onChange={(e) => formik.handleChange(e)}
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
                label={t('italian-and-other-language')}
                data-testid="notificationLanguageRadio"
              />
            </RadioGroup>
            {formik.values.lang === NewNotificationLangOther && (
              <CustomDropdown
                id="additionalLang"
                label={`${t('select-other-language')}*`}
                name="additionalLang"
                size="medium"
                margin="none"
                value={formik.values.additionalLang}
                onChange={(e) => formik.handleChange(e)}
                fullWidth
                sx={{ marginTop: '16px' }}
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
            )}
          </FormControl>
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationSettingsButton;
