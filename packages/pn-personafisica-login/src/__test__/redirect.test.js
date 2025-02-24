import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { vi } from 'vitest';

const emptyHTML = '<html><head></head><body></body></html>';
const scriptContent = fs.readFileSync(
  path.resolve(__dirname, '../../public/js/redirect.js'),
  'utf8'
);

describe('config.js behavior', () => {
  let dom;
  let document;

  beforeAll(() => {
    dom = new JSDOM(emptyHTML, {
      runScripts: 'dangerously',
      resources: 'usable',
    });

    document = dom.window.document;
    vi.spyOn(document, 'write').mockImplementation(() => {});
  });

  test('should redirect and add noindex meta tag when URL matches regex', async () => {
    const data = [
      {
        origin: 'https://login.notifichedigitali.it',
        redirect: 'https://cittadini.notifichedigitali.it/auth',
      },
      {
        origin: 'https://login.dev.notifichedigitali.it',
        redirect: 'https://cittadini.dev.notifichedigitali.it/auth',
      },
      {
        origin: 'https://login.test.notifichedigitali.it',
        redirect: 'https://cittadini.test.notifichedigitali.it/auth',
      },
      {
        origin: 'https://login.uat.notifichedigitali.it',
        redirect: 'https://cittadini.uat.notifichedigitali.it/auth',
      },
      {
        origin: 'https://login.hotfix.notifichedigitali.it',
        redirect: 'https://cittadini.hotfix.notifichedigitali.it/auth',
      },
    ];

    for (const { origin, redirect } of data) {
      document.write.mockClear();
      dom.window.origin = origin;
      dom.window.eval(scriptContent);
      expect(document.write).toHaveBeenNthCalledWith(
        1,
        `<meta http-equiv="refresh" content="0; url=${redirect}">`
      );
      expect(document.write).toHaveBeenNthCalledWith(2, `<meta name="robots" content="noindex">`);
    }
  });

  test('should not add noindex meta tag when URL does not match regex', async () => {
    const origins = [
      'https://login.testnotifichedigitali.it',
      'https://login.prod.notifichedigitali.it',
      'https://otherapp.dev.notifichedigitali.it',
    ];

    for (const origin of origins) {
      document.write.mockClear();
      dom.window.origin = origin;
      dom.window.eval(scriptContent);
      expect(document.write).not.toHaveBeenCalled();
    }
  });
});
