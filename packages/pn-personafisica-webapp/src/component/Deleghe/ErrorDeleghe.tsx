import { useTranslation } from 'react-i18next';
import { Toast, MessageType } from '@pagopa-pn/pn-commons';

class ErrorDelega {
  title: string;
  description: string;
  constructor(title: string, description: string) {
    this.title = title;
    this.description = description;
  }
}

type ErrorDelegheProps = {
  errorType?: number;
};

const ErrorDeleghe: React.FC<ErrorDelegheProps> = ({ errorType }) => {
  const { t } = useTranslation(['deleghe']);

  const errors = [
    new ErrorDelega(t('nuovaDelega.error.noConnection'), t('nuovaDelega.error.noConnectionDescr')),
    new ErrorDelega(
      t('nuovaDelega.error.existingDelegation'),
      t('nuovaDelega.error.existingDelegationDescr')
    ),
    new ErrorDelega(t('nuovaDelega.error.notAvailable'), t('nuovaDelega.error.notAvailableDescr')),
  ];

  return (
    <Toast
      title={errorType ? errors[errorType].title : ''}
      message={errorType ? errors[errorType].description : ''}
      open={!!errorType}
      variant="standard"
      type={MessageType.ERROR}
    />
  );
};

export default ErrorDeleghe;