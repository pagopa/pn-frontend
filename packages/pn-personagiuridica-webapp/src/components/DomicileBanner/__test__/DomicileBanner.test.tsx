import { vi } from 'vitest';

import { digitalCourtesyAddresses, digitalLegalAddresses } from '../../../__mocks__/Contacts.mock';
import { fireEvent, render } from '../../../__test__/test-utils';
import { ChannelType } from '../../../models/contacts';
import * as routes from '../../../navigation/routes.const';
import DomicileBanner from '../DomicileBanner';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const mockNavigateFn = vi.fn();
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

const pecDefault = digitalLegalAddresses.find((addr) => addr.senderId === 'default');
const emailDefault = digitalCourtesyAddresses.find(
  (addr) => addr.senderId === 'default' && addr.channelType === ChannelType.EMAIL
);

describe('DomicileBanner component', () => {
  it('renders the component - no addresses', () => {
    const { container, getByTestId } = render(<DomicileBanner />);
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    const regexp = new RegExp(
      `detail.domicile_${ChannelType.PEC}|detail.domicile_${ChannelType.EMAIL}`
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
    const regexp = new RegExp(`detail.domicile_${ChannelType.EMAIL}`);
    expect(container).toHaveTextContent(regexp);
  });

  it('renders the component - email added', () => {
    const { container, getByTestId } = render(<DomicileBanner />, {
      preloadedState: {
        generalInfoState: {
          defaultAddresses: [emailDefault],
          domicileBannerOpened: true,
        },
      },
    });
    const dialog = getByTestId('addDomicileBanner');
    expect(dialog).toBeInTheDocument();
    const regexp = new RegExp(`detail.domicile_${ChannelType.PEC}`);
    expect(container).toHaveTextContent(regexp);
  });

  it('clicks on the link to add a domicile', () => {
    const result = render(<DomicileBanner />);
    const link = result.getByRole('button', { name: /detail.add_domicile/ });
    fireEvent.click(link);
    expect(mockNavigateFn).toBeCalled();
    expect(mockNavigateFn).toBeCalledWith(routes.RECAPITI);
  });

  it('clicks on the close button', () => {
    const result = render(<DomicileBanner />);
    const closeButton = result.getByTestId('CloseIcon');
    fireEvent.click(closeButton);
    const dialog = result.queryByTestId('addDomicileBanner');
    expect(dialog).toBeNull();
  });
});
