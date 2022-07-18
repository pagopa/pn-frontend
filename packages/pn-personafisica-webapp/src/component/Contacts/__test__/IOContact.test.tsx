import {
  fireEvent,
  RenderResult,
  waitFor
} from '@testing-library/react';
import { axe, render } from "../../../__test__/test-utils";

import { CourtesyChannelType, IOAllowedValues } from "../../../models/contacts";
import * as redux from 'react-redux';
import * as actions from '../../../redux/contact/actions';
import IOContact from "../IOContact";

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
    code: '00000'
};

const enabledAddress = {
  addressType: 'courtesy',
    recipientId: 'mocked-recipientId',
    senderId: 'default',
    channelType: CourtesyChannelType.IOMSG,
    value: IOAllowedValues.ENABLED,
    code: '00000'
}

describe('IOContact component', () => {
  let result: RenderResult | undefined;

  describe('test component when IO is unavailable', () => {
    beforeEach(() => {
      result = render(<IOContact recipientId="mocked-recipientId" contact={null} />);
    });

    afterEach(() => {
      result = undefined;
    });

    it('renders as expected', () => {
      const cardAvatar = result?.container.querySelector('svg>title');
      expect(cardAvatar).toBeInTheDocument();
      expect(cardAvatar).toHaveTextContent('Sms'); // to be replaced when the correct icon will be available

      const title = result?.getByRole('heading', { name: 'io-contact.subtitle' });
      expect(title).toBeInTheDocument();

      const ioCheckbox = result?.queryByRole('checkbox', { name: 'io-contact.switch-label'});
      expect(ioCheckbox).not.toBeInTheDocument();

      const alert = result?.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('io-contact.disclaimer-message-unavailable');
      expect(alert).not.toHaveTextContent('io-contact.disclaimer-link');

      const link = result?.container.querySelector('a');
      expect(link).not.toBeInTheDocument();
    });

    it('does not have basic accessibility issues', async () => {
      if (result) {
        const res = await axe(result.container);
        expect(res).toHaveNoViolations();
      } else {
        fail("render() returned undefined!");
      }
    });
  });

  describe('test component when IO is available and disabled', () => {
    let mockDispatchFn: jest.Mock;
    let mockActionFn: jest.Mock;
    
    beforeEach(() => {
      mockActionFn = jest.fn();
      // mock dispatch
      mockDispatchFn = jest.fn(() => ({
        unwrap: () => Promise.resolve(),
      }));

      // mock action
      const actionSpy = jest.spyOn(actions, 'enableIOAddress');
      actionSpy.mockImplementation(mockActionFn as any);
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      useDispatchSpy.mockReturnValue(mockDispatchFn as any);
      result = render(<IOContact recipientId="mocked-recipientId" contact={disabledAddress} />);
    });

    afterEach(() => {
      result = undefined;
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('renders as expected', () => {
      const cardAvatar = result?.container.querySelector('svg>title');
      expect(cardAvatar).toBeInTheDocument();
      expect(cardAvatar).toHaveTextContent('Sms'); // to be replaced when the correct icon will be available

      const title = result?.getByRole('heading', { name: 'io-contact.subtitle' });
      expect(title).toBeInTheDocument();

      const ioCheckbox = result?.getByRole('checkbox', { name: 'io-contact.switch-label'});
      expect(ioCheckbox).toBeInTheDocument();
      expect(ioCheckbox).not.toBeChecked();

      const alert = result?.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('io-contact.disclaimer-message');
      expect(alert).toHaveTextContent('io-contact.disclaimer-link');

      const link = result?.container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('io-contact.disclaimer-link');
    });

    it.only('should enable IO', async () => {
      
      const ioCheckbox = result?.getByRole('checkbox', { name: 'io-contact.switch-label'});
      expect(ioCheckbox).toBeInTheDocument();
      
      result?.debug();
      fireEvent.click(ioCheckbox!);

      await waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledWith('mocked-recipientId');
      });

    });
    

    it('does not have basic accessibility issues', async () => {
      if (result) {
        const res = await axe(result.container);
        expect(res).toHaveNoViolations();
      } else {
        fail("render() returned undefined!");
      }
    });
  });

  describe('test component when IO is available and enabled', () => {
    beforeEach(() => {
      result = render(<IOContact recipientId="mocked-recipientId" contact={enabledAddress} />);
    });

    afterEach(() => {
      result = undefined;
      jest.resetAllMocks();
      jest.clearAllMocks();
    });

    it('renders as expected', () => {
      const cardAvatar = result?.container.querySelector('svg>title');
      expect(cardAvatar).toBeInTheDocument();
      expect(cardAvatar).toHaveTextContent('Sms'); // to be replaced when the correct icon will be available

      const title = result?.getByRole('heading', { name: 'io-contact.subtitle' });
      expect(title).toBeInTheDocument();

      const ioCheckbox = result?.getByRole('checkbox', { name: 'io-contact.switch-label'});
      expect(ioCheckbox).toBeInTheDocument();
      expect(ioCheckbox).toBeChecked();

      const alert = result?.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent('io-contact.disclaimer-message');
      expect(alert).toHaveTextContent('io-contact.disclaimer-link');

      const link = result?.container.querySelector('a');
      expect(link).toBeInTheDocument();
      expect(link).toHaveTextContent('io-contact.disclaimer-link');
    });

    it.skip('should disable IO', async () => {
      // mock action
      const mockActionFn = jest.fn();
      const actionSpy = jest.spyOn(actions, 'enableIOAddress');
      actionSpy.mockImplementation(mockActionFn as any);
      // mock dispatch
      const mockDispatchFn = jest.fn(() => ({
        unwrap: () => Promise.resolve(),
      }));
      const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
      useDispatchSpy.mockReturnValue(mockDispatchFn as any);
      
      const ioCheckbox = result?.getByRole('checkbox', { name: 'io-contact.switch-label'});
      expect(ioCheckbox).toBeInTheDocument();

      result?.debug();
      fireEvent.click(ioCheckbox!);

      await waitFor(() => {
        expect(mockDispatchFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledTimes(1);
        expect(mockActionFn).toBeCalledWith('mocked-recipientId');
      });

    });
    

    it('does not have basic accessibility issues', async () => {
      if (result) {
        const res = await axe(result.container);
        expect(res).toHaveNoViolations();
      } else {
        fail("render() returned undefined!");
      }
    });
  });
});