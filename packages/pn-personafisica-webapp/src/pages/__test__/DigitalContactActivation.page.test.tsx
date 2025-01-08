import { vi } from 'vitest';

import { fireEvent, render } from '../../__test__/test-utils';
import { AddressType, ChannelType, IOAllowedValues } from '../../models/contacts';
import DigitalContactActivation from '../DigitalContactActivation.page';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

describe('DigitalContactActivation', () => {
  it('render component', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const title = getByText('legal-contacts.sercq-send-wizard.title');
    expect(title).toBeInTheDocument();
  });

  it('should go back when clicking on the back button', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const backButton = getByText('button.annulla');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
  });

  it('renders the first step label correctly', () => {
    const { queryAllByText } = render(<DigitalContactActivation />);
    const step1Label = queryAllByText('legal-contacts.sercq-send-wizard.step_1.title')[0];
    expect(step1Label).toBeInTheDocument();
  });

  it('renders the second step label if has appIO and is disabled', () => {
    const { getByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.DISABLED,
            },
          ],
        },
      },
    });
    const step2Label = getByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(step2Label).toBeInTheDocument();
  });

  it('does not render the second step label if has no app IO contact', () => {
    const { queryByText } = render(<DigitalContactActivation />);
    const step2Label = queryByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(step2Label).not.toBeInTheDocument();
  });

  it('does not render the second step label if has app IO enabled', () => {
    const { queryByText } = render(<DigitalContactActivation />, {
      preloadedState: {
        contactsState: {
          digitalAddresses: [
            {
              addressType: AddressType.COURTESY,
              senderId: 'default',
              channelType: ChannelType.IOMSG,
              value: IOAllowedValues.ENABLED,
            },
          ],
        },
      },
    });
    const step2Label = queryByText('legal-contacts.sercq-send-wizard.step_2.title');
    expect(step2Label).not.toBeInTheDocument();
  });
});
