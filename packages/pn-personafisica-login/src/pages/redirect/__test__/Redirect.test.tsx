/* eslint-disable functional/immutable-data */
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import RedirectPage from "../Redirect";
import '../../../locales/i18n';

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
  sessionStorage.setItem('redirectUrl', 'https://localhost:3000/login');
  render(
    <BrowserRouter>
      <RedirectPage />
    </BrowserRouter>
  );

  expect(mockLocationAssign).toBeCalled();
});