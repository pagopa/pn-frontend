import React from 'react';
import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { CourtesyChannelType, LegalChannelType } from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import DomicileBanner from '../DomicileBanner';

const mockNavigateFn = vi.fn();

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')) as any,
  useNavigate: () => mockNavigateFn,
}));

const pecDefault = digitalAddresses.legal.find((addr) => addr.senderId === 'default');
const emailDefault = digitalAddresses.courtesy.find(
  (addr) => addr.senderId === 'default' && addr.channelType === CourtesyChannelType.EMAIL
);
const IODefault = digitalAddresses.courtesy.find(
  (addr) => addr.senderId === 'default' && addr.channelType === CourtesyChannelType.IOMSG
);

describe('DomicileBanner component', () => {
  it('renders the component - no addresses', () => {
    const { container, getByTestId } = render(<DomicileBanner />);
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    const regexp = new RegExp(
      `detail.domicile_${LegalChannelType.PEC}|detail.domicile_${CourtesyChannelType.EMAIL}|detail.domicile_${CourtesyChannelType.IOMSG}`
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders the component - pec added', () => {
    const { container, getByTestId } = render(<DomicileBanner />, {
      preloadedState: {
        generalInfoState: { defaultAddresses: [pecDefault], domicileBannerOpened: true },
      },
    });
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    const regexp = new RegExp(
      `detail.domicile_${CourtesyChannelType.EMAIL}|detail.domicile_${CourtesyChannelType.IOMSG}`
    );
    expect(container).toHaveTextContent(regexp);
  });

  it('renders the component - pec and email added', () => {
    const { container, getByTestId } = render(<DomicileBanner />, {
      preloadedState: {
        generalInfoState: {
          defaultAddresses: [pecDefault, emailDefault],
          domicileBannerOpened: true,
        },
      },
    });
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    const regexp = new RegExp(`detail.domicile_${CourtesyChannelType.IOMSG}`);
    expect(container).toHaveTextContent(regexp);
  });

  it('renders the component - email and IO added', () => {
    const { container, getByTestId } = render(<DomicileBanner />, {
      preloadedState: {
        generalInfoState: {
          defaultAddresses: [IODefault, emailDefault],
          domicileBannerOpened: true,
        },
      },
    });
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    const regexp = new RegExp(`detail.domicile_${LegalChannelType.PEC}`);
    expect(container).toHaveTextContent(regexp);
  });

  it('clicks on the link to add a domicile', () => {
    const { getByRole } = render(<DomicileBanner />);
    const link = getByRole('button', { name: /detail.add_domicile/ });
    fireEvent.click(link);
    expect(mockNavigateFn).toBeCalled();
    expect(mockNavigateFn).toBeCalledWith(routes.RECAPITI);
  });

  it('clicks on the close button', () => {
    const { getByTestId, queryByTestId } = render(<DomicileBanner />);
    const closeButton = getByTestId('CloseIcon');
    fireEvent.click(closeButton);
    const dialog = queryByTestId('addDomicileBanner');
    expect(dialog).toBeNull();
  });
});
