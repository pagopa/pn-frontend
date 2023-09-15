// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { initLocalization } from './services';

beforeAll(() => {
  // init localization function
  const mockedTranslationFn = (
    namespace: string | Array<string>,
    path: string,
    data?: { [key: string]: any | undefined }
  ) => (data ? `${namespace} - ${path} - ${JSON.stringify(data)}` : `${namespace} - ${path}`);
  initLocalization(mockedTranslationFn);
});
