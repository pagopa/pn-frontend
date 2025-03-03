import fs from 'fs';
import { JSDOM } from 'jsdom';
import path from 'path';
import { vi } from 'vitest';

const emptyHTML = '<html><head></head><body></body></html>';
const scriptContent = fs.readFileSync(path.resolve(__dirname, '../../public/js/config.js'), 'utf8');

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

  test('should add noindex meta tag when URL matches regex', async () => {
    const origins = [
      'https://imprese.notifichedigitali.it',
      'https://imprese.dev.notifichedigitali.it/',
      'https://imprese.test.notifichedigitali.it/',
      'https://imprese.uat.notifichedigitali.it/',
      'https://imprese.hotfix.notifichedigitali.it/',
    ];

    for (const origin of origins) {
      document.write.mockClear();
      dom.window.origin = origin;
      dom.window.eval(scriptContent);
      expect(document.write).toHaveBeenCalledWith(`<meta name="robots" content="noindex">`);
    }
  });

  test('should not add noindex meta tag when URL does not match regex', async () => {
    const origins = [
      'https://imprese.testnotifichedigitali.it',
      'https://imprese.prod.notifichedigitali.it',
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
