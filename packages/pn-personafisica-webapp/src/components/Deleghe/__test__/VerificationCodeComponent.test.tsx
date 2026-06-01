import { render } from '../../../__test__/test-utils';
import VerificationCodeComponent from '../VerificationCodeComponent';

describe('VerificationCodeComponent', () => {
  it('renders the component and checks the code value', () => {
    const fiveDigits = '12345';

    const { container } = render(<VerificationCodeComponent code={fiveDigits} />);

    const input = container.querySelector('input');

    expect(input).toBeInTheDocument();
    expect(input).toHaveValue(fiveDigits);
  });
});
