import * as React from 'react';

import { axe, render } from '../../../__test__/test-utils';
import VerificationCodeComponent from '../VerificationCodeComponent';

describe('VerificationCodeComponent - accessibility tests', () => {
  it('is Verification Code component accessible', async () => {
    const fiveDigits = '12345';
    const result = render(<VerificationCodeComponent code={fiveDigits} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
