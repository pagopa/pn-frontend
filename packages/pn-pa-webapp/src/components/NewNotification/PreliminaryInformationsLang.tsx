import { FormikProps } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import {
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
} from '@mui/material';
import { CustomDropdown } from '@pagopa-pn/pn-commons';
import { LangCode, LangLabels } from '@pagopa/mui-italia';

import { BILINGUALISM_LANGUAGES, NewNotificationLangOther } from '../../models/NewNotification';
import { PreliminaryInformationsPayload } from '../../redux/newNotification/types';
import { FormBox } from '../FormBox/FormBox';
import { FormBoxSubtitle } from '../FormBox/FormBoxSubtitle';
import { FormBoxTitle } from '../FormBox/FormBoxTitle';

type Props = {
  formik: FormikProps<PreliminaryInformationsPayload>;
  languages: LangLabels;
  onChange: (e: ChangeEvent & { target: { value: any } }) => void;
  onChangeTouched: (e: ChangeEvent) => Promise<void>;
};

const PreliminaryInformationsLang = ({ formik, languages, onChange, onChangeTouched }: Props) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.preliminary-informations',
  });
  return (
    <FormBox>
      <FormControl margin="normal" fullWidth>
        <FormLabel id="notification-language-label">
          <FormBoxTitle text={t('notification-language')} />
        </FormLabel>
        <FormBoxSubtitle text={t('notification-language-subtitle')} />
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
            label={t('other-language')}
            data-testid="notificationLanguageRadio"
          />
        </RadioGroup>
      </FormControl>
      {formik.values.lang === NewNotificationLangOther && (
        <CustomDropdown
          id="additionalLang"
          label={`${t('select-other-language')}*`}
          name="additionalLang"
          size="small"
          margin="normal"
          value={formik.values.additionalLang}
          onChange={onChangeTouched}
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
    </FormBox>
  );
};

export default PreliminaryInformationsLang;
