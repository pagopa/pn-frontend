import React from "react";
import { render, fireEvent, waitFor } from "../../test-utils";
import TermsOfServiceHandler from "../TermsOfServiceHandler";

const mockHandleAcceptTos = jest.fn();

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  Trans: (props: { i18nKey: string }) => props.i18nKey,
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('TermsOfServiceHandler', () => {

  it('render component', () => {
    const result = render(<TermsOfServiceHandler handleAcceptTos={mockHandleAcceptTos}/>);
    expect(result.container).toBeInTheDocument();
  });
  
  it('checks the texts in the page', () => {
    const result = render(<TermsOfServiceHandler handleAcceptTos={mockHandleAcceptTos}/>);

    expect(result.container).toHaveTextContent(/tos.title/i);
    expect(result.container).toHaveTextContent(/tos.body/i);
    expect(result.container).toHaveTextContent(/tos.switchLabel/i);
    expect(result.container).toHaveTextContent(/tos.button/i);
  });

  it('checks the switch and button', async () => {
    const result = render(<TermsOfServiceHandler handleAcceptTos={mockHandleAcceptTos}/>)
    const acceptSwitch = result.getByTestId('tosSwitch');
    const accessButton = result.getByTestId('accessButton');

    expect(accessButton).toBeDisabled();

    fireEvent.click(acceptSwitch);
    expect(accessButton).toBeEnabled();
    fireEvent.click(accessButton);
    
    expect(mockHandleAcceptTos).toBeCalledTimes(1);
  });

});