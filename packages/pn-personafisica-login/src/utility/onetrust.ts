import { IS_DEVELOP } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

export function initOneTrust() {
  const { OT_DOMAIN_ID, OT_SETTINGS_TOKEN } = getConfiguration();
  const domainScript = IS_DEVELOP ? '-test' : '';

  const otprivacyNoticeScript = document.createElement('script');
  otprivacyNoticeScript.setAttribute('src', '/onetrust/notice-script/otnotice-1.0.min.js');
  otprivacyNoticeScript.setAttribute('type', 'text/javascript');
  otprivacyNoticeScript.setAttribute('charset', 'UTF-8');
  otprivacyNoticeScript.setAttribute('id', 'otprivacy-notice-script');
  // eslint-disable-next-line functional/immutable-data
  otprivacyNoticeScript.innerHTML = `settings="${OT_SETTINGS_TOKEN}"`;
  document.head.appendChild(otprivacyNoticeScript);

  const scriptEl = document.createElement('script');
  scriptEl.setAttribute('src', '/onetrust/scripttemplates/otSDKStub.js');
  scriptEl.setAttribute('type', 'text/javascript');
  scriptEl.setAttribute('charset', 'UTF-8');
  scriptEl.setAttribute('data-domain-script', OT_DOMAIN_ID + domainScript);
  // scriptEl.setAttribute('nonce', (window as any).nonce);
  document.head.appendChild(scriptEl);
}
