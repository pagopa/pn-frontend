import { useEffect } from 'react';

import { ZendeskAuthorizationDTO } from '../../models/Support';

const ZendeskForm: React.FC<{ data: ZendeskAuthorizationDTO }> = ({ data }) => {
  const { action: url, jwt, return_to: returnTo } = data;

  useEffect(() => {
    if (url && jwt && returnTo) {
      const form = document.getElementById('jwtForm') as HTMLFormElement;
      if (form) {
        form.submit();
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
