import { render } from '@testing-library/react';
import { axe } from '../../../__test__/test-utils';
import ErrorDeleghe from '../ErrorDeleghe';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('ErrorDeleghe Component', () => {
  it('does not render the error', () => {
    const result = render(<ErrorDeleghe />);
    const toast = result.queryByTestId('toastContainer');

    expect(result.container).toBeInTheDocument();
    expect(toast).toBeNull();
  });

  it('render the no connection error', () => {
    const result = render(<ErrorDeleghe errorType={0} />);
    const toast = result.queryByTestId('toastContainer');

    expect(result.container).toBeInTheDocument();
    expect(toast).not.toBeNull();
    expect(result.baseElement).toHaveTextContent(/nuovaDelega.error.noConnection/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.error.noConnectionDescr/i);
  });

  it('render the already existing delegation error', () => {
    const result = render(<ErrorDeleghe errorType={1} />);
    const toast = result.queryByTestId('toastContainer');

    expect(result.container).toBeInTheDocument();
    expect(toast).not.toBeNull();
    expect(result.baseElement).toHaveTextContent(/nuovaDelega.error.existingDelegation/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.error.existingDelegationdescr/i);
  });

  it('render the no service error', () => {
    const result = render(<ErrorDeleghe errorType={2} />);
    const toast = result.queryByTestId('toastContainer');

    expect(result.container).toBeInTheDocument();
    expect(toast).not.toBeNull();
    expect(result.baseElement).toHaveTextContent(/nuovaDelega.error.notAvailable/i);
    expect(result.container).toHaveTextContent(/nuovaDelega.error.notAvailableDescr/i);
  });

  it('is ErrorDeleghe component accessible', async()=>{
    const result = render(<ErrorDeleghe errorType={2} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
