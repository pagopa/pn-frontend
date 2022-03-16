import { fireEvent, waitFor, screen, RenderResult } from "@testing-library/react";

import { render } from "../../test-utils";
import CustomMobileDialog from "../CustomMobileDialog";


describe('CustomMobileDialog Component', () => {

  let result: RenderResult | undefined;

  beforeEach(() => {
    // render component
    result = render(<CustomMobileDialog title="Mocked title" actions={[
      {key: 'confirm', component: <div>Confirm</div>, closeOnClick: true},
      {key: 'cancel', component: <div>Cancel</div>},
    ]}><p>Mocked content</p></CustomMobileDialog>);
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders CustomMobileDialog (closed)', () => {
    const button = result?.container.querySelector('button');
    expect(button).toHaveTextContent(/Mocked title/i);
  });

  it('renders CustomMobileDialog (opened)', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Mocked title/i);
    expect(dialog).toHaveTextContent(/Mocked content/i);
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"]');
    expect(actions).toHaveLength(2);
    expect(actions![0]).toHaveTextContent(/Confirm/i);
    expect(actions![1]).toHaveTextContent(/Cancel/i);
  });

  it('clicks on confirm button', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"]');
    fireEvent.click(actions![0]);
    await waitFor(() => expect(dialog).not.toBeInTheDocument());
  });

  it('clicks on cancel button', async () => {
    const button = result?.container.querySelector('button');
    fireEvent.click(button!);
    const dialog =  await waitFor(() => screen.queryByTestId('mobileDialog'));
    const actions = dialog?.querySelectorAll('[data-testid="dialogAction"]');
    fireEvent.click(actions![1]);
    await waitFor(() => expect(dialog).toBeInTheDocument());
  });
});