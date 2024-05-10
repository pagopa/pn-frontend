import { useEffect } from 'react';

import { ZendeskAuthorizationDTO } from '../../models/Support';

const ZendeskForm: React.FC<{ data: ZendeskAuthorizationDTO }> = ({ data }) => {
  const { action_url: url, jwt, return_to: returnTo } = data;

  useEffect(() => {
    if (url && jwt && returnTo) {
      const form = document.getElementById('jwtForm') as HTMLFormElement;
      if (form) {
        try {
          form.submit();
        } catch (e) {
          console.log(e);
        }
      }
    }
  }, [url, jwt, returnTo]);

  return (
    <form id="jwtForm" method="POST" target="_blank" action={url}>
      <input id="jwtString" type="hidden" name="jwt" value={jwt} />
      <input id="returnTo" type="hidden" name="return_to" value={returnTo} />
    </form>
  );
};

export default ZendeskForm;
