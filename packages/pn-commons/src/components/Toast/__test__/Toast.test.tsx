
import { fireEvent, waitFor } from "@testing-library/react";

import { render } from "../../../test-utils";
import Toast from "../Toast";
import { MessageType } from "../types";

const toastProps = {
  message: 'Toast mocked message',
  title: 'Mocked title'
}

const renderToast = (open: boolean, type: MessageType, closingDelay?: number) => 
  render(<Toast open={open} message={toastProps.message} title={toastProps.title} type={type} closingDelay={closingDelay}/>);

describe('Toast Component', () => {

  it('renders toast (closed)', () => {
    const result = renderToast(false, MessageType.INFO);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).not.toBeInTheDocument();
  });

  it('renders toast (opened)', () => {
    const result = renderToast(true, MessageType.INFO);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).toBeInTheDocument();
    expect(toastContainer).toHaveTextContent(toastProps.title);
    expect(toastContainer).toHaveTextContent(toastProps.message);
  });

  it('closes toast by clicking close button', async () => {
    const result = renderToast(true, MessageType.INFO);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).toBeInTheDocument();
    const closeButton = toastContainer!.querySelector('button');
    await waitFor(() => {
      fireEvent.click(closeButton!);
    })
    expect(toastContainer).not.toBeInTheDocument();
  });

  it('closes toast after delay', async () => {
    const result = renderToast(true, MessageType.INFO, 400);
    const toastContainer = result?.queryByTestId('toastContainer');
    expect(toastContainer).toBeInTheDocument();
    await waitFor(() => {
      expect(toastContainer).not.toBeInTheDocument();
    }, {
      timeout: 400
    })
  });
});