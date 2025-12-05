import { IS_DEVELOP } from '@pagopa-pn/pn-commons';

import { getConfiguration } from '../services/configuration.service';

function initNoticeScript(OT_SETTINGS_TOKEN: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const otprivacyNoticeScript = document.createElement('script');
    otprivacyNoticeScript.setAttribute('src', '/onetrust/notice-script/otnotice-1.0.min.js');
    otprivacyNoticeScript.setAttribute('type', 'text/javascript');
    otprivacyNoticeScript.setAttribute('charset', 'UTF-8');
    otprivacyNoticeScript.setAttribute('id', 'otprivacy-notice-script');
    // eslint-disable-next-line functional/immutable-data
    otprivacyNoticeScript.innerHTML = `settings="${OT_SETTINGS_TOKEN}"`;
    // eslint-disable-next-line functional/immutable-data
    otprivacyNoticeScript.onload = () => {
      resolve();
    };
    // eslint-disable-next-line functional/immutable-data
    otprivacyNoticeScript.onerror = () => {
      console.error('Error during OneTrust notice script loading!');
      reject();
    };
    document.head.appendChild(otprivacyNoticeScript);
  });
}

function initSdkScript(OT_DOMAIN_ID: string, domainScript: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const scriptEl = document.createElement('script');
    scriptEl.setAttribute('src', '/onetrust/scripttemplates/otSDKStub.js');
    scriptEl.setAttribute('type', 'text/javascript');
    scriptEl.setAttribute('charset', 'UTF-8');
    scriptEl.setAttribute('data-domain-script', OT_DOMAIN_ID + domainScript);
    // scriptEl.setAttribute('nonce', (window as unknown as ExtendedWindow).nonce)
    // eslint-disable-next-line functional/immutable-data
    scriptEl.onload = () => {
      resolve();
    };
    // eslint-disable-next-line functional/immutable-data
    scriptEl.onerror = () => {
      console.error('Error during OneTrust sdk script loading!');
      reject();
    };
    document.head.appendChild(scriptEl);
  });
}

export async function initOneTrust() {
  if (IS_DEVELOP) {
    return;
  }
  const { OT_DOMAIN_ID, OT_SETTINGS_TOKEN } = getConfiguration();
  const domainScript = IS_DEVELOP ? '-test' : '';
  await initNoticeScript(OT_SETTINGS_TOKEN);
  await initSdkScript(OT_DOMAIN_ID, domainScript);
}
