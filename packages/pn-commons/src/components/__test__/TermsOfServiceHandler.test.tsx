import React from "react";
import { render, fireEvent } from "../../test-utils";
import TermsOfServiceHandler from "../TermsOfServiceHandler";

const mockHandleAcceptTos = jest.fn();

describe('TermsOfServiceHandler', () => {

  it('render component', () => {
    const result = render(<TermsOfServiceHandler handleAcceptTos={mockHandleAcceptTos}/>);
    expect(result.container).toBeInTheDocument();
  });
  
  it('checks the texts in the page', () => {
    const result = render(<TermsOfServiceHandler handleAcceptTos={mockHandleAcceptTos}/>);

    expect(result.container).toHaveTextContent(/Piattaforma Notifiche/i);
    expect(result.container).toHaveTextContent(/Per accedere, leggi e accetta l’Informativa Privacy e i Termini e condizioni d’uso./i);
    expect(result.container).toHaveTextContent(/Accetto l'Informativa Privacy e i Termini e condizioni d'uso di Piattaforma Notifiche/i);
    expect(result.container).toHaveTextContent(/Accedi/i);
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