import { fireEvent, waitFor } from "@testing-library/react";

import { render } from "../../../test-utils";
import Header from "../Header";

describe('Header Component', () => {

  it('renders header (no second header)', () => {
    // render component
    const result = render(<Header withSecondHeader={false}/>);
    const header = result?.container.querySelector('header');
    expect(header).toBeInTheDocument();
    const exitButton = result?.container.querySelector('button');
    expect(exitButton).toBeInTheDocument();
    expect(exitButton).toHaveTextContent(/Esci/i);
    const subHeader = result?.queryByTestId('subHeader');
    expect(subHeader).not.toBeInTheDocument();
  });

  it('renders header (with second header)', () => {
    // render component
    const result = render(<Header withSecondHeader={true}/>);
    const subHeader = result?.queryByTestId('subHeader');
    expect(subHeader).toBeInTheDocument();
  });

  it('clicks on exit button', async () => {
    const handleClick = jest.fn();
    // render component
    const result = render(<Header withSecondHeader={true} onExitAction={handleClick}/>);
    const exitButton = result.container.querySelector('button');
    await waitFor(() => {
      fireEvent.click(exitButton!);
    });
    expect(handleClick).toBeCalledTimes(1);
  });
});