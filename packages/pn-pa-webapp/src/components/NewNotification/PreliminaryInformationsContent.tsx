import { FormikProps } from 'formik';
import { ChangeEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField, Typography } from '@mui/material';
import { LangCode, LangLabels } from '@pagopa/mui-italia';

import { NewNotificationLangOther } from '../../models/NewNotification';
import { PreliminaryInformationsPayload } from '../../redux/newNotification/types';
import { FormBox, FormBoxSubtitle, FormBoxTitle } from './NewNotificationFormElelements';

type Props = {
  formik: FormikProps<PreliminaryInformationsPayload>;
  languages: LangLabels;
  onChangeTouched: (e: ChangeEvent) => Promise<void>;
  subjectHelperText: string;
};

const PreliminaryInformationsContent = ({
  formik,
  languages,
  onChangeTouched,
  subjectHelperText,
}: Props) => {
  const [focused, setFocused] = useState('');
  const { t } = useTranslation(['notifiche'], {
    keyPrefix: 'new-notification.steps.preliminary-informations',
  });

  const hasOtherLang =
    formik.values.lang === NewNotificationLangOther && formik.values.additionalLang;

  return (
    <FormBox>
      <FormBoxTitle text={t('notification-content-title')} />
      <FormBoxSubtitle text={t('notification-content-subtitle')} />
      {hasOtherLang && (
        <Typography variant="body2" color={'text.secondary'} marginTop={2} fontWeight={600}>
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
        onFocus={() => setFocused('subject')}
        onBlur={() => setFocused('')}
        error={formik.touched.subject && Boolean(formik.errors.subject)}
        helperText={
          (formik.touched.subject && formik.errors.subject) ||
          (focused === 'subject' && subjectHelperText)
        }
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
      {hasOtherLang && (
        <>
          <Typography variant="body2" color={'text.secondary'} marginTop={2} fontWeight={600}>
            {languages[formik.values.additionalLang as LangCode]}
          </Typography>
          <TextField
            id="additionalSubject"
            label={`${t('subject')}*`}
            fullWidth
            name="additionalSubject"
            onFocus={() => setFocused('additionalSubject')}
            onBlur={() => setFocused('')}
            value={formik.values.additionalSubject}
            onChange={onChangeTouched}
            error={formik.touched.additionalSubject && Boolean(formik.errors.additionalSubject)}
            helperText={
              (formik.touched.additionalSubject && formik.errors.additionalSubject) ||
              (focused === 'additionalSubject' && subjectHelperText)
            }
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
