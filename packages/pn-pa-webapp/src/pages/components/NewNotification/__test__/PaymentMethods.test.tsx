/* eslint-disable functional/no-let */
/* eslint-disable functional/immutable-data */
import { RenderResult, act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';

import { render } from '../../../../__test__/test-utils';
import { newNotification } from '../../../../redux/newNotification/__test__/test-utils';
import { PaymentObject } from '../../../../models/NewNotification';
import * as actions from '../../../../redux/newNotification/actions';
import PaymentMethods from '../PaymentMethods';

// mock imports
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const file = new Blob(['mocked content'], { type: 'application/pdf' });
(file as any).name = 'Mocked file';

function uploadDocument(elem: ParentNode) {
  const fileInput = elem.querySelector('[data-testid="fileInput"]');
  const input = fileInput?.querySelector('input');
  fireEvent.change(input!, { target: { files: [file] } });
}

describe('PaymentMethods Component', () => {
  let result: RenderResult;
  let mockDispatchFn: jest.Mock;
  let mockActionFn: jest.Mock;
  const confirmHandlerMk = jest.fn();

  beforeEach(async () => {
    // mock action
    mockActionFn = jest.fn();
    const actionSpy = jest.spyOn(actions, 'uploadNotificationPaymentDocument');
    actionSpy.mockImplementation(mockActionFn);
    // mock dispatch
    mockDispatchFn = jest.fn(() => ({
      unwrap: () => Promise.resolve(),
    }));
    const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    // render component
    await act(async () => {
      const notification = {...newNotification, payment: undefined};
      result = render(
        <PaymentMethods
          notification={notification}
          onConfirm={confirmHandlerMk}
          isCompleted={false}
        />
      );
    });
  });

  it('renders PaymentMethods', () => {
    expect(result.container).toHaveTextContent(
      `${newNotification.recipients[0].firstName} ${newNotification.recipients[0].lastName}`
    );
    expect(result.container).toHaveTextContent(
      `${newNotification.recipients[1].firstName} ${newNotification.recipients[1].lastName}`
    );
    const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    expect(paymentBoxes).toHaveLength(4);
    paymentBoxes.forEach((paymentBox, index) => {
      expect(paymentBox).toHaveTextContent(
        index % 2 === 0 ? /attach-pagopa-notice*/i : /attach-f24/i
      );
      const fileInput = paymentBox.parentNode?.querySelector('[data-testid="fileInput"]');
      expect(fileInput).toBeInTheDocument();
    });
    const buttonSubmit = result.getByTestId('step-submit');
    const buttonPrevious = result.getByTestId('previous-step');
    expect(buttonSubmit).toBeInTheDocument();
    expect(buttonPrevious).toBeInTheDocument();
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // vedi flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    expect(buttonPrevious).toHaveTextContent(/back-to-attachments/i);
  });

  it('adds first and second pagoPa documents (confirm disabled)', async () => {
    const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    uploadDocument(paymentBoxes[0].parentNode!);
    uploadDocument(paymentBoxes[2].parentNode!);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // vedi flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
  });

  it('adds all payment documents and clicks on confirm', async () => {
    const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    uploadDocument(paymentBoxes[0].parentNode!);
    uploadDocument(paymentBoxes[1].parentNode!);
    uploadDocument(paymentBoxes[2].parentNode!);
    uploadDocument(paymentBoxes[3].parentNode!);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // vedi flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    expect(buttons![0]).toBeEnabled();
    fireEvent.click(buttons![0]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith(newNotification.recipients.reduce((obj: { [key: string]: PaymentObject }, r, index) => {
        obj[r.taxId] = {
          pagoPaForm: {
            id: index === 0 ? 'MRARSS90P08H501Q-pagoPaDoc' : 'SRAGLL00P48H501U-pagoPaDoc',
            idx: 0,
            name: 'pagopa-notice',
            file: {
              name: 'Mocked file',
              sha256: {
                hashBase64: 'mocked-hasBase64',
                hashHex: 'mocked-hashHex'
              },
              size: 14,
              uint8Array: new Uint8Array()
            },
            contentType: 'application/pdf',
            ref: {
              key: '',
              versionToken: ''
            }
          },
          f24standard: {
            id: index === 0 ? 'MRARSS90P08H501Q-f24standardDoc' : 'SRAGLL00P48H501U-f24standardDoc',
            idx: 0,
            name: 'pagopa-notice-f24',
            file: {
              name: 'Mocked file',
              sha256: {
                hashBase64: 'mocked-hasBase64',
                hashHex: 'mocked-hashHex'
              },
              size: 14,
              uint8Array: new Uint8Array()
            },
            contentType: 'application/pdf',
            ref: {
              key: '',
              versionToken: ''
            }
          },
        };
        return obj;
      }, {}));
    });
  });
});
