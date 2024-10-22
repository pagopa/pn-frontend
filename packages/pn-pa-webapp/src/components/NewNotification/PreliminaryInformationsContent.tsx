import { FormikProps } from 'formik';
import { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField, Typography } from '@mui/material';
import { LangCode, LangLabels } from '@pagopa/mui-italia';

import { NewNotificationLangOther } from '../../models/NewNotification';
import { PreliminaryInformationsPayload } from '../../redux/newNotification/types';
import { FormBox } from '../FormBox/FormBox';
import { FormBoxSubtitle } from '../FormBox/FormBoxSubtitle';
import { FormBoxTitle } from '../FormBox/FormBoxTitle';

type Props = {
  formik: FormikProps<PreliminaryInformationsPayload>;
  languages: LangLabels;
  onChangeTouched: (e: ChangeEvent) => Promise<void>;
};

const PreliminaryInformationsContent = ({ formik, languages, onChangeTouched }: Props) => {
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.preliminary-informations',
  });
  return (
    <FormBox>
      <FormBoxTitle text={t('notification-content-title')} />
      <FormBoxSubtitle text={t('notification-content-subtitle')} />
      {formik.values.lang === NewNotificationLangOther && (
        <Typography variant="body2" color={'text.secondary'} marginTop={'16px'} fontWeight={600}>
          {languages.it}
        </Typography>
      )}
      <TextField
        id="subject"
        label={`${t('subject')}*`}
        fullWidth
        name="subject"
        value={formik.values.subject}
        onChange={onChangeTouched}
        error={formik.touched.subject && Boolean(formik.errors.subject)}
        helperText={formik.touched.subject && formik.errors.subject}
        size="small"
        margin="normal"
      />
      <TextField
        id="abstract"
        label={t('abstract')}
        fullWidth
        name="abstract"
        value={formik.values.abstract}
        onChange={onChangeTouched}
        error={formik.touched.abstract && Boolean(formik.errors.abstract)}
        helperText={formik.touched.abstract && formik.errors.abstract}
        size="small"
        margin="normal"
      />
      {formik.values.lang === NewNotificationLangOther &&
        formik.values.additionalLang && (
          <>
            <Typography
              variant="body2"
              color={'text.secondary'}
              marginTop={'16px'}
              fontWeight={600}
            >
              {languages[formik.values.additionalLang as LangCode]}
            </Typography>
            <TextField
              id="additionalSubject"
              label={`${t('subject')}*`}
              fullWidth
              name="additionalSubject"
              value={formik.values.additionalSubject}
              onChange={onChangeTouched}
              error={formik.touched.additionalSubject && Boolean(formik.errors.additionalSubject)}
              helperText={formik.touched.additionalSubject && formik.errors.additionalSubject}
              size="small"
              margin="normal"
            />
            <TextField
              id="additionalAbstract"
              label={t('abstract')}
              fullWidth
              name="additionalAbstract"
              value={formik.values.additionalAbstract}
              onChange={onChangeTouched}
              error={formik.touched.additionalAbstract && Boolean(formik.errors.additionalAbstract)}
              helperText={formik.touched.additionalAbstract && formik.errors.additionalAbstract}
              size="small"
              margin="normal"
            />
          </>
        )}
    </FormBox>
  );
};

export default PreliminaryInformationsContent;
