import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { appStateActions } from '@pagopa-pn/pn-commons';

import { ZendeskAuthorizationDTO } from '../../models/Support';
import { useAppDispatch } from '../../redux/hooks';

const ZendeskForm: React.FC<{ data: ZendeskAuthorizationDTO }> = ({ data }) => {
  const { action_url: url, jwt, return_to: returnTo } = data;
  const dispatch = useAppDispatch();
  const { t } = useTranslation(['support']);

  useEffect(() => {
    if (url && jwt && returnTo) {
      const form = document.getElementById('jwtForm') as HTMLFormElement;
      if (form) {
        try {
          form.submit();
        } catch (e) {
          dispatch(
            appStateActions.addError({
              title: t('messages.generic-title'),
              message: t('messages.generic-message'),
              showTechnicalData: false,
            })
          );
        }
      }
    }
  }, [url, jwt, returnTo]);

  return (
    <form id="jwtForm" method="POST" action={url}>
      <input id="jwtString" type="hidden" name="jwt" value={jwt} />
      <input id="returnTo" type="hidden" name="return_to" value={returnTo} />
    </form>
  );
};

export default ZendeskForm;
