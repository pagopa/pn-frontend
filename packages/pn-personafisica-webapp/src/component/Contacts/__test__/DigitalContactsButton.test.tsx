import react from 'react';
import {screen } from '@testing-library/react';

import { LegalChannelType } from '../../../models/contacts';
import { render } from '../../../__test__/test-utils';
import DigitalContactsButton from '../DigitalContactsButton';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  Trans: () => () => 'mocked-subtitle',
}));

// mock useState
const useStateSpy = jest.spyOn(react, 'useState');
const setState = jest.fn();

describe('DigitalContactsButton Component', () => {
  const component = (
    <DigitalContactsButton
      recipientId="mocked-recipientId"
      senderId="mocked-senderId"
      digitalDomicileType={LegalChannelType.PEC}
      pec="mocked-pec"
      successMessage="mocked-successMessage"
    >
      <button>Click me</button>
    </DigitalContactsButton>
  );

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('renders DigitalContactsButton (modal closed)', () => {
    useStateSpy.mockImplementation(() => [false, setState]);
    const result = render(component);
    const button = result?.container.querySelector('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).not.toBeInTheDocument();
  });

  it('renders DigitalContactsButton (modal opened)', async () => {
    useStateSpy.mockImplementation(() => [true, setState]);
    render(component);
    const dialog = screen.queryByTestId('codeDialog');
    expect(dialog).toBeInTheDocument();
  });
});
