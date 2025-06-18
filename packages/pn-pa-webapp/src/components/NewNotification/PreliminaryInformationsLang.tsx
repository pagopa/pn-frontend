import { FormikProps } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
} from '@mui/material';
import { CustomDropdown } from '@pagopa-pn/pn-commons';
import { LangCode, LangLabels } from '@pagopa/mui-italia';

import {
  BILINGUALISM_LANGUAGES,
  NewNotificationLangOther,
  PreliminaryInformationsPayload,
} from '../../models/NewNotification';
import { FormBox, FormBoxSubtitle, FormBoxTitle } from './NewNotificationFormElelements';

type Props = {
  formik: FormikProps<PreliminaryInformationsPayload>;
  languages: LangLabels;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeTouched: (e: ChangeEvent) => Promise<void>;
};

const PreliminaryInformationsLang = ({ formik, languages, onChange, onChangeTouched }: Props) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.preliminary-informations',
  });
  return (
    <FormBox>
      <FormControl fullWidth>
        <FormLabel id="notification-language-label">
          <FormBoxTitle text={t('notification-language-title')} />
        </FormLabel>
        <FormBoxSubtitle text={t('notification-language-subtitle')} />
        <Grid container alignItems={'center'} spacing={2} paddingTop={2}>
          <Grid item xs={12} md={6}>
            <RadioGroup
              aria-labelledby="notification-language-label"
              name="lang"
              value={formik.values.lang}
              row
              onChange={onChange}
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
          </Grid>
          <Grid item xs={12} md={6}>
            {formik.values.lang === NewNotificationLangOther && (
              <CustomDropdown
                id="additionalLang"
                label={t('select-other-language')}
                name="additionalLang"
                size="small"
                margin="none"
                value={formik.values.additionalLang}
                onChange={onChangeTouched}
                fullWidth
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
          </Grid>
        </Grid>
      </FormControl>
    </FormBox>
  );
};

export default PreliminaryInformationsLang;
