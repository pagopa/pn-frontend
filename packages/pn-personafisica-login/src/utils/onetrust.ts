import { OT_DOMAIN_ID } from "./constants";

const domainScript = process.env.NODE_ENV === "development" ? "-test" : "";
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
