
import { act, fireEvent, RenderResult, waitFor } from "@testing-library/react";

import { render } from "../../../test-utils";
import Toast from "../Toast";
import { MessageType } from "../types";

const toastProps = {
  message: 'Toast mocked message',
  title: 'Mocked title'
}

const renderToast = async (open: boolean, type: MessageType, closingDelay?: number) => {
  let result: RenderResult | undefined;
  await act(async () => {
    result = render(<Toast open={open} message={toastProps.message} title={toastProps.title} type={type} closingDelay={closingDelay}/>);
  });
  return result;
}

describe('Toast Component', () => {

  it('renders toast (closed)', async () => {
    const result = await renderToast(false, MessageType.INFO);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).not.toBeInTheDocument();
  });

  it('renders toast (opened)', async () => {
    const result = await renderToast(true, MessageType.INFO);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveTextContent(toastProps.title);
    expect(toastContainer).toHaveTextContent(toastProps.message);
  });

  it('closes toast by clicking close button', async () => {
    const result = await renderToast(true, MessageType.INFO);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).toBeInTheDocument();
    const closeButton = toastContainer!.querySelector('button');
    await waitFor(() => {
      fireEvent.click(closeButton!);
    })
    expect(toastContainer).not.toBeInTheDocument();
  });

  it('closes toast after delay', async () => {
    const result = await renderToast(true, MessageType.INFO, 400);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).toBeInTheDocument();
    await waitFor(() => {
      expect(toastContainer).not.toBeInTheDocument();
    }, {
      timeout: 400
    })
  });
});