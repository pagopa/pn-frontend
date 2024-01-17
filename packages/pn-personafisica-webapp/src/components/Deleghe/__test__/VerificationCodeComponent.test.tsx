import { render } from '../../../__test__/test-utils';
import VerificationCodeComponent from '../VerificationCodeComponent';

describe('VerificationCodeComponent', () => {
  it('renders the component and checks the digits', () => {
    const fiveDigits = '12345';
    const { queryAllByTestId } = render(<VerificationCodeComponent code={fiveDigits} />);
    const digitsElements = queryAllByTestId('codeDigit');
    const codes = fiveDigits.split('');
    expect(digitsElements).toHaveLength(fiveDigits.length);
    digitsElements.forEach((code, index) => {
      expect(code).toHaveTextContent(codes[index]);
    });
  });
});
