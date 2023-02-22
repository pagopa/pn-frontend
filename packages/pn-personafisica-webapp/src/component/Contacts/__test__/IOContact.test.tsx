/* eslint-disable functional/no-let */
import React from 'react';
import { fireEvent, RenderResult, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';
import { render, screen } from '../../../__test__/test-utils';

import { CourtesyChannelType, IOAllowedValues } from '../../../models/contacts';
import * as actions from '../../../redux/contact/actions';
import IOContact from '../IOContact';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const disabledAddress = {
  addressType: 'courtesy',
  recipientId: 'mocked-recipientId',
  senderId: 'default',
  channelType: CourtesyChannelType.IOMSG,
  value: IOAllowedValues.DISABLED,
  code: '00000',
};

const enabledAddress = {
  addressType: 'courtesy',
  recipientId: 'mocked-recipientId',
  senderId: 'default',
  channelType: CourtesyChannelType.IOMSG,
  value: IOAllowedValues.ENABLED,
  code: '00000',
};

describe('IOContact component', () => {
  let result: RenderResult | undefined;
  let mockDispatchFn: jest.Mock;
  let mockEnableActionFn: jest.Mock;
  let mockDisableActionFn: jest.Mock;

  beforeEach(() => {
    mockEnableActionFn = jest.fn();
    mockDisableActionFn = jest.fn();

    // mock dispatch
    mockDispatchFn = jest.fn(() => ({
      then: () => Promise.resolve(),
    }));

    // mock actions
    const enableActionSpy = jest.spyOn(actions, 'enableIOAddress');
    enableActionSpy.mockImplementation(mockEnableActionFn as any);
    const disableActionSpy = jest.spyOn(actions, 'disableIOAddress');
    disableActionSpy.mockImplementation(mockDisableActionFn as any);
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
  });

  afterEach(() => {
    result = undefined;
    jest.restoreAllMocks();
  });

  describe('test component when contacts have not yet been fetched', () => {
    beforeEach(() => {
      result = render(<IOContact recipientId="mocked-recipientId" contact={null} />);
    });

    afterEach(() => {
      result = undefined;
    });

    it('renders as expected', () => {
      const cardAvatar = result?.container.querySelector('svg>title');
      expect(cardAvatar).toBeInTheDocument();
      expect(cardAvatar).toHaveTextContent('Sms');

      const title = result?.getByRole('heading', { name: 'io-contact.subtitle' });
      expect(title).toBeInTheDocument();

      const ioCheckbox = result?.queryByRole('checkbox', { name: 'io-contact.switch-label' });
      expect(ioCheckbox).not.toBeInTheDocument();

      const alert = result?.queryByRole('alert');
      expect(alert).not.toBeInTheDocument();

      const link = result?.container.querySelector('a');
      expect(link).not.toBeInTheDocument();
    });
  });

  describe('test component when IO is unavailable', () => {
    it('renders as expected', () => {
      result = render(<IOContact recipientId="mocked-recipientId" contact={undefined} />);

      const cardAvatar = result?.container.querySelector('svg>title');
      expect(cardAvatar).toBeInTheDocument();
      expect(cardAvatar).toHaveTextContent('Sms');

      const title = result?.getByRole('heading', { name: 'io-contact.subtitle' });
      expect(title).toBeInTheDocument();

      const ioCheckbox = result?.queryByRole('checkbox', { name: 'io-contact.switch-label' });
      expect(ioCheckbox).not.toBeInTheDocument();

      const alert = result?.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('io-contact.disclaimer-message-unavailable');

      /** Waiting for FAQs */
      // expect(alert).not.toHaveTextContent('io-contact.disclaimer-link');

      const link = result?.container.querySelector('a');
      expect(link).not.toBeInTheDocument();
    });
  });

  describe('test component when IO is available and disabled', () => {
    beforeEach(() => {
      result = render(<IOContact recipientId="mocked-recipientId" contact={disabledAddress} />);
    });

    it('renders as expected', () => {
      const cardAvatar = result?.container.querySelector('svg>title');
      expect(cardAvatar).toBeInTheDocument();
      expect(cardAvatar).toHaveTextContent('Sms');

      const title = result?.getByRole('heading', { name: 'io-contact.subtitle' });
      expect(title).toBeInTheDocument();

      result?.getByTestId('CloseIcon');
      result?.getByText('io-contact.disabled');
      const enableBtn = result?.getByRole('button', { name: 'button.enable' });
      expect(enableBtn).toBeInTheDocument();
      expect(enableBtn).toBeEnabled();

      const alert = result?.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('io-contact.disclaimer-message');

      /** Waiting for FAQs */
      // expect(alert).toHaveTextContent('io-contact.disclaimer-link');
      // const link = result?.container.querySelector('a');
      // expect(link).toBeInTheDocument();
      // expect(link).toHaveTextContent('io-contact.disclaimer-link');
    });

    it('should enable IO', async () => {
      const enableBtn = result?.getByRole('button', { name: 'button.enable' });

      fireEvent.click(enableBtn!);

      waitFor(() => {
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', {
          name: 'io-contact.enable-modal.confirm',
        });
        fireEvent.click(disclaimerConfirmButton);
      });

      waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockEnableActionFn).toBeCalledTimes(1);
        expect(mockEnableActionFn).toBeCalledWith('mocked-recipientId');

        const disableBtn = screen.getByRole('button', { name: 'button.disable' });
        expect(disableBtn).toBeInTheDocument();
      });
    });
  });

  describe('test component when IO is available and enabled', () => {
    beforeEach(() => {
      result = render(<IOContact recipientId="mocked-recipientId" contact={enabledAddress} />);
    });

    it('renders as expected', () => {
      const cardAvatar = result?.container.querySelector('svg>title');
      expect(cardAvatar).toBeInTheDocument();
      expect(cardAvatar).toHaveTextContent('Sms');

      const title = result?.getByRole('heading', { name: 'io-contact.subtitle' });
      expect(title).toBeInTheDocument();

      result?.getByTestId('CheckIcon');
      result?.getByText('io-contact.enabled');
      const enableBtn = result?.getByRole('button', { name: 'button.disable' });
      expect(enableBtn).toBeInTheDocument();
      expect(enableBtn).toBeEnabled();

      const alert = result?.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('io-contact.disclaimer-message');

      /** Waiting for FAQs */
      // expect(alert).toHaveTextContent('io-contact.disclaimer-link');
      // const link = result?.container.querySelector('a');
      // expect(link).toBeInTheDocument();
      // expect(link).toHaveTextContent('io-contact.disclaimer-link');
    });

    it('should disable IO', async () => {
      const disableBtn = result?.getByRole('button', { name: 'button.disable' });

      fireEvent.click(disableBtn!);

      waitFor(() => {
        const disclaimerCheckbox = screen.getByRole('checkbox', { name: 'button.capito' });
        fireEvent.click(disclaimerCheckbox);
        const disclaimerConfirmButton = screen.getByRole('button', {
          name: 'io-contact.enable-modal.confirm',
        });
        fireEvent.click(disclaimerConfirmButton);
      });

      waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockEnableActionFn).toBeCalledTimes(1);
        expect(mockEnableActionFn).toBeCalledWith('mocked-recipientId');

        const enableBtn = screen.getByRole('button', { name: 'button.enable' });
        expect(enableBtn).toBeInTheDocument();
      });
    });
  });
});
