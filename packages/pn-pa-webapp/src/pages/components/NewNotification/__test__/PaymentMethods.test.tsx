import { RenderResult, act, fireEvent, waitFor } from '@testing-library/react';
import * as redux from 'react-redux';

import { newNotification } from '../../../../redux/newNotification/__test__/test-utils';
import * as actions from '../../../../redux/newNotification/actions';
import { render } from '../../../../__test__/test-utils';
import PaymentMethods from '../PaymentMethods';
import { UploadPayementParams } from '../../../../models/newNotification';

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
      result = render(
        <PaymentMethods notification={newNotification} onConfirm={confirmHandlerMk} />
      );
    });
  });

  it('renders PaymentMethods', () => {
    expect(result.container).toHaveTextContent(newNotification.recipients[0].denomination);
    expect(result.container).toHaveTextContent(newNotification.recipients[1].denomination);
    const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    expect(paymentBoxes).toHaveLength(4);
    paymentBoxes.forEach((paymentBox, index) => {
      expect(paymentBox).toHaveTextContent(index % 2 === 0 ? /Allega Avviso pagoPA/i : /Allega Modello F24/i);
      const fileInput = paymentBox.parentNode?.querySelector('[data-testid="fileInput"]');
      expect(fileInput).toBeInTheDocument();
    });
    const buttons = form?.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![1]).toBeDisabled();
  });

  it('adds first pagoPa document (confirm disabled)', async () => {
    const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    uploadDocument(paymentBoxes[0].parentNode!);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    expect(buttons![1]).toBeDisabled();
  });

  it('adds first and second pagoPa documents and clicks on confirm', async () => {
    const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    uploadDocument(paymentBoxes[0].parentNode!);
    uploadDocument(paymentBoxes[2].parentNode!);
    uploadDocument(paymentBoxes[3].parentNode!);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    expect(buttons![1]).toBeEnabled();
    fireEvent.click(buttons![1]);
    await waitFor(() => {
      expect(mockDispatchFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith(newNotification.recipients.reduce((obj: UploadPayementParams, r, index) => {
        obj[r.taxId] = {
          pagoPaForm: {
            key: 'Avviso pagoPA',
            fileBase64: 'mocked-base64String',
            sha256: 'mocked-hasBase64',
            contentType: 'application/pdf',
          },
          f24flatRate: {
            key: 'F24 forfettario',
            fileBase64: '',
            sha256: '',
            contentType: 'application/pdf',
          },
          f24standard: {
            key: 'F24',
            fileBase64: index === 0 ? '' : 'mocked-base64String',
            sha256: index === 0 ? '' : 'mocked-hasBase64',
            contentType: 'application/pdf',
          },
        };
        return obj;
      }, {}));
      expect(confirmHandlerMk).toBeCalledTimes(1);
    });
  });
});
