import * as React from 'react';
import { render } from '@testing-library/react';
import { axe } from '../../../__test__/test-utils';
import VerificationCodeComponent from '../VerificationCodeComponent';

describe('VerificationCodeComponent - accessibility tests', () => {
  it('is Verification Code component accessible', async()=>{
    const fiveDigits = '987654321';
    const result = render(<VerificationCodeComponent code={fiveDigits} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
