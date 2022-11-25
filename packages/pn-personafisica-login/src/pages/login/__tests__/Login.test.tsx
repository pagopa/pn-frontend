import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from "react-router-dom";

import Login from '../Login';
import { ENV } from '../../../utils/env';
import '../../../locales/i18n';

const oldWindowLocation = global.window.location;

describe('test login page', () => {
  beforeAll(() => {
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(window, 'location', { value: { assign: jest.fn() } });
  });

  afterAll(() => {
    // eslint-disable-next-line functional/immutable-data
    Object.defineProperty(window, 'location', { value: oldWindowLocation });
  });

  test('rendering test', () => {
    const result = render(<BrowserRouter><Login /></BrowserRouter>);
    expect(result.container).toHaveTextContent(/Come vuoi accedere/i);
  });

  test('renders button Entra con Spid', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const ButtonSpid = document.getElementById('spidButton');
    if (ButtonSpid) {
      fireEvent.click(ButtonSpid);
    }
    expect(screen.getAllByRole('img')[0]).toHaveAttribute('src', 'spid_big.svg');
  });

  test.skip('renders button Entra con CIE', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);

    const ButtonCIE = screen.getByRole(/Button/i, {
      name: 'Entra con CIE',
    });

    fireEvent.click(ButtonCIE);
    expect(global.window.location.assign).toBeCalledWith(
      `${ENV.URL_API.LOGIN}/login?entityID=xx_servizicie_test&authLevel=SpidL2`
    );
  });

  // portale login has only privacy policy and not terms and conditions page
  test('does render the privacy disclaimer link', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const privacyDisclaimerLink = screen.queryByText(/Informativa Privacy/i);

    expect(privacyDisclaimerLink).toBeInTheDocument();
  });

  test('does not render the link', () => {
    render(<BrowserRouter><Login /></BrowserRouter>);
    const privacyDisclaimerLink = screen.queryByTestId('terms-and-conditions');
    expect(privacyDisclaimerLink).not.toBeInTheDocument();
  });
});
