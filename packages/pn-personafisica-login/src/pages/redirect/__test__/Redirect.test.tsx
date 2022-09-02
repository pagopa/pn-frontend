/* eslint-disable functional/immutable-data */
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import RedirectPage from "../Redirect";
import '../../../locales/i18n';
import { storageOriginOps } from "../../../utils/storage";

const mockLocationAssign = jest.fn();

const original = window.location;

beforeAll(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { replace: mockLocationAssign },
  });
});

afterAll(() => {
  Object.defineProperty(window, 'location', { configurable: true, value: original });
});

test('test redirect', () => {
  storageOriginOps.write('testurl');
  render(
    <BrowserRouter>
      <RedirectPage />
    </BrowserRouter>
  );

  expect(mockLocationAssign).toBeCalled();
});