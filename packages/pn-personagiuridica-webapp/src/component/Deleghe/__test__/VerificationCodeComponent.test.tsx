import { render } from '@testing-library/react';
import VerificationCodeComponent from '../VerificationCodeComponent';

describe('VerificationCodeComponent', () => {
  it('renders the component and checks the digits', () => {
    const fiveDigits = '12345';
    const result = render(<VerificationCodeComponent code={fiveDigits} />);
    const digitsElements = result.queryAllByTestId('codeDigit');

    expect(result.baseElement).toHaveTextContent(/12345/i);
    expect(result.baseElement).not.toHaveTextContent(/123456/i);
    expect(digitsElements).toHaveLength(fiveDigits.length);
  });

  it('renders the component with a different amount of digits', () => {
    const fiveDigits = '987654321';
    const result = render(<VerificationCodeComponent code={fiveDigits} />);
    const digitsElements = result.queryAllByTestId('codeDigit');
    expect(result.baseElement).toHaveTextContent(/987654321/i);
    expect(result.baseElement).not.toHaveTextContent(/asdfgh/i);
    expect(digitsElements).toHaveLength(fiveDigits.length);
  });
});
