import React from 'react';

import { fireEvent, render } from '../../../__test__/test-utils';
import DomicileBanner from '../DomicileBanner';

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

const getReduxInitialState = (domicileBannerOpened: boolean = true) => ({
  generalInfoState: {
    pendingDelegators: 0,
    legalDomicile: [],
    domicileBannerOpened,
  },
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

  it('banner is closed with domicileBannerOpened as false', () => {
    const result = render(<DomicileBanner />, {
      preloadedState: getReduxInitialState(false),
    });
    expect(result.queryByTestId('CloseIcon')).toBeNull();
  });
});
