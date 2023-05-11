import React from 'react';

import {fireEvent, render} from '../../../__test__/test-utils';
import DomicileBanner from '../DomicileBanner';
import {DigitalAddress, LegalChannelType} from "../../../models/contacts";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockNavigateFn = jest.fn();
jest.mock('react-router-dom', () => ({
  ...(jest.requireActual('react-router-dom') as any),
  useNavigate: () => mockNavigateFn,
}));

const getReduxInitialState = (isGroupAdmin: boolean, domicileBannerOpened: boolean = true) => ({
  userState: {
    user: {
      isGroupAdmin
    }
  },
  generalInfoState: {
    pendingDelegators: 0,
    legalDomicile: [],
    domicileBannerOpened
  }
});

describe('DomicileBanner component', () => {
  it('renders the component', () => {
    const result = render(<DomicileBanner />);
    const dialog = result.getByTestId('addDomicileBanner');

    expect(dialog).toBeInTheDocument();
    expect(result.container).toHaveTextContent(/detail.add_domicile/i);
  });

  it('clicks on the link to add a domicile', () => {
    const result = render(<DomicileBanner />);
    const link = result.getByRole('button', { name: /detail.add_domicile/ });

    fireEvent.click(link);

    expect(mockNavigateFn).toBeCalled();
  });

  it('clicks on the close button', () => {
    const result = render(<DomicileBanner />);
    const closeButton = result.getByTestId('CloseIcon');

    fireEvent.click(closeButton);
    const dialog = result.queryByTestId('addDomicileBanner');
    expect(dialog).toBeNull();
  });

  it('banner is open with isGroupAdmin as false', () => {
    const result = render(<DomicileBanner />, { preloadedState: getReduxInitialState(false) });
    expect(result.queryByTestId('CloseIcon')).toBeInTheDocument();
  });

  it('banner is closed with isGroupAdmin as true', () => {
    const result = render(<DomicileBanner />, { preloadedState: getReduxInitialState(true) });
    expect(result.queryByTestId('CloseIcon')).toBeNull();
  });

  it('banner is closed with domicileBannerOpened as false', () => {
    const result = render(<DomicileBanner />, { preloadedState: getReduxInitialState(false, false) });
    expect(result.queryByTestId('CloseIcon')).toBeNull();
  });
});
