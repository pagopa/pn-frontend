import { getConfiguration } from "../services/configuration.service";

export function initOneTrust() {
  const { IS_DEVELOP, OT_DOMAIN_ID } = getConfiguration();
  console.log({ IS_DEVELOP, OT_DOMAIN_ID });

  const domainScript = IS_DEVELOP ? "-test" : "";

  const scriptEl = document.createElement('script');
  scriptEl.setAttribute(
    'src',
    '/onetrust/scripttemplates/otSDKStub.js'
  );
  scriptEl.setAttribute('type', 'text/javascript');
  scriptEl.setAttribute('charset', 'UTF-8');
  scriptEl.setAttribute('data-domain-script', OT_DOMAIN_ID + domainScript);
  // scriptEl.setAttribute('nonce', (window as any).nonce);
  document.head.appendChild(scriptEl);
}