import { Mock, vi } from 'vitest';

import { newNotification } from '../../../__mocks__/NewNotification.mock';
import {
  RenderResult,
  act,
  fireEvent,
  render,
  waitFor,
  within,
} from '../../../__test__/test-utils';
import { PaymentObject } from '../../../models/NewNotification';
import * as actions from '../../../redux/newNotification/actions';
import PaymentMethods from '../PaymentMethods';

// mock imports
vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

const file = new File(['mocked content'], 'Mocked file', { type: 'application/pdf' });

function uploadDocument(elem: HTMLElement) {
  const fileInput = within(elem).getByTestId('fileInput');
  const input = fileInput?.querySelector('input');
  fireEvent.change(input!, { target: { files: [file] } });
}

describe('PaymentMethods Component', () => {
  let result: RenderResult;
  let mockActionFn: Mock;
  const confirmHandlerMk = vi.fn();

  beforeEach(async () => {
    // mock action
    mockActionFn = vi.fn();
    vi.spyOn(actions, 'uploadNotificationPaymentDocument').mockImplementation(mockActionFn);

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
    console.log('Render result:', result.container.innerHTML); // Debugging

    expect(result.container).toHaveTextContent(
      `${newNotification.recipients[0].firstName} ${newNotification.recipients[0].lastName}`
    );
    expect(result.container).toHaveTextContent(
      `${newNotification.recipients[1].firstName} ${newNotification.recipients[1].lastName}`
    );
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    expect(paymentBoxes).toHaveLength(3);
    paymentBoxes.forEach((paymentBox, index) => {
      expect(paymentBox).toHaveTextContent(
        index % 2 === 0 ? /attach-pagopa-notice*/i : /attach-f24/i
      );
      const fileInput = paymentBox.parentNode?.querySelector('[data-testid="fileUploadInput"]');

      console.log('--------------', fileInput);
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

  it.skip('adds all payment documents and clicks on confirm', async () => {
    const form = result.container.querySelector('form');
    const paymentBoxes = result.queryAllByTestId('paymentBox');
    uploadDocument(paymentBoxes[0].parentElement!);
    uploadDocument(paymentBoxes[1].parentElement!);
    uploadDocument(paymentBoxes[2].parentElement!);
    uploadDocument(paymentBoxes[3].parentElement!);
    const buttons = await waitFor(() => form?.querySelectorAll('button'));
    // Avendo cambiato posizione nella lista dei bottoni (in modo da avere sempre il bottone "continua" a dx, qui vado a prendere il primo bottone)
    // vedi flexDirection row-reverse
    // PN-1843 Carlotta Dimatteo 12/08/2022
    expect(buttons![0]).toBeEnabled();
    fireEvent.click(buttons![0]);
    await waitFor(() => {
      expect(mockActionFn).toBeCalledTimes(1);
      expect(mockActionFn).toBeCalledWith(
        newNotification.recipients.reduce((obj: { [key: string]: PaymentObject }, r, index) => {
          obj[r.taxId] = {
            pagoPa: {
              id: index === 0 ? 'MRARSS90P08H501Q-pagoPaDoc' : 'SRAGLL00P48H501U-pagoPaDoc',
              idx: 0,
              name: 'pagopa-notice',
              file: {
                sha256: {
                  hashBase64: 'mocked-hasBase64',
                  hashHex: 'mocked-hashHex',
                },
                data: file,
              },
              contentType: 'application/pdf',
              ref: {
                key: '',
                versionToken: '',
              },
            },
            f24: {
              id:
                index === 0 ? 'MRARSS90P08H501Q-f24standardDoc' : 'SRAGLL00P48H501U-f24standardDoc',
              idx: 0,
              name: 'pagopa-notice-f24',
              file: {
                sha256: {
                  hashBase64: 'mocked-hasBase64',
                  hashHex: 'mocked-hashHex',
                },
                data: file,
              },
              contentType: 'application/pdf',
              ref: {
                key: '',
                versionToken: '',
              },
            },
          };
          return obj;
        }, {})
      );
    });
  });
});
