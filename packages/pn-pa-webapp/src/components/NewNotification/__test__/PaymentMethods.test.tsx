import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { newNotification } from '../../../__mocks__/NewNotification.mock';
import { RenderResult, act, fireEvent, render, within } from '../../../__test__/test-utils';
import PaymentMethods from '../PaymentMethods';

const file = new File(['mocked content'], 'Mocked file', { type: 'application/pdf' });

function uploadDocument(elem: HTMLElement) {
  const fileInput = within(elem).getByTestId('fileInput');
  const input = fileInput?.querySelector('input');
  fireEvent.change(input!, { target: { files: [file] } });
}

describe('PaymentMethods Component', () => {
  let result: RenderResult;
  const confirmHandlerMk = vi.fn();

  beforeEach(async () => {
    const mock = new MockAdapter(axios);
    mock.onPost('https://mocked-url.com').reply(200, { success: true });

    // render component
    await act(async () => {
      const notification = { ...newNotification, payment: undefined };
      result = render(
        <PaymentMethods
          notification={notification}
          onConfirm={confirmHandlerMk}
          isCompleted={false}
        />
      );
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders PaymentMethods', () => {
    expect(result.container).toHaveTextContent(
      `${newNotification.recipients[0].firstName} ${newNotification.recipients[0].lastName}`
    );
    expect(result.container).toHaveTextContent(
      `${newNotification.recipients[1].firstName} ${newNotification.recipients[1].lastName}`
    );
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    expect(paymentBoxes).toHaveLength(4);

    const paymentForRecipient = result.queryAllByTestId('paymentForRecipient');
    const firstPayment = paymentForRecipient[0];
    expect(within(firstPayment).queryAllByTestId('removeDocument')).toHaveLength(1);
    expect(within(firstPayment).queryAllByTestId('fileInput')).toHaveLength(1);

    const secondPayment = paymentForRecipient[1];
    expect(within(secondPayment).queryAllByTestId('removeDocument')).toHaveLength(2);

    const buttonSubmit = result.getByTestId('step-submit');
    const buttonPrevious = result.getByTestId('previous-step');
    expect(buttonSubmit).toBeInTheDocument();
    expect(buttonPrevious).toBeInTheDocument();
    expect(buttonPrevious).toHaveTextContent(/back-to-attachments/i);
  });

  it.skip('adds first and second pagoPa documents (confirm disabled)', async () => {
    // const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    uploadDocument(paymentBoxes[0].parentElement!);
    uploadDocument(paymentBoxes[2].parentElement!);
    // const buttons = await waitFor(() => form?.querySelectorAll('button'));
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // vedi flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
  });

  // it.skip('adds all payment documents and clicks on confirm', async () => {
  //   const form = result.container.querySelector('form');
  //   const paymentBoxes = result.queryAllByTestId('paymentBox');
  //   uploadDocument(paymentBoxes[0].parentElement!);
  //   uploadDocument(paymentBoxes[1].parentElement!);
  //   uploadDocument(paymentBoxes[2].parentElement!);
  //   uploadDocument(paymentBoxes[3].parentElement!);
  //   const buttons = await waitFor(() => form?.querySelectorAll('button'));
  //   // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
  //   // vedi flexDirection row-reverse
  //   // PN-1843 Carlotta Dimatteo 12/08/2022
  //   expect(buttons![0]).toBeEnabled();
  //   fireEvent.click(buttons![0]);
  //   await waitFor(() => {
  //     expect(mockActionFn).toHaveBeenCalledTimes(1);
  //     expect(mockActionFn).toHaveBeenCalledWith(
  //       newNotification.recipients.reduce((obj: { [key: string]: PaymentObject }, r, index) => {
  //         obj[r.taxId] = {
  //           pagoPa: {
  //             id: index === 0 ? 'MRARSS90P08H501Q-pagoPaDoc' : 'SRAGLL00P48H501U-pagoPaDoc',
  //             idx: 0,
  //             name: 'pagopa-notice',
  //             file: {
  //               sha256: {
  //                 hashBase64: 'mocked-hasBase64',
  //                 hashHex: 'mocked-hashHex',
  //               },
  //               data: file,
  //             },
  //             contentType: 'application/pdf',
  //             ref: {
  //               key: '',
  //               versionToken: '',
  //             },
  //           },
  //           f24: {
  //             id: index === 0 ? 'MRARSS90P08H501Q-f24' : 'SRAGLL00P48H501U-f24',
  //             idx: 0,
  //             name: 'pagopa-notice-f24',
  //             file: {
  //               sha256: {
  //                 hashBase64: 'mocked-hasBase64',
  //                 hashHex: 'mocked-hashHex',
  //               },
  //               data: file,
  //             },
  //             contentType: 'application/json',
  //             ref: {
  //               key: '',
  //               versionToken: '',
  //             },
  //           },
  //         };
  //         return obj;
  //       }, {})
  //     );
  //   });
  // });
});
