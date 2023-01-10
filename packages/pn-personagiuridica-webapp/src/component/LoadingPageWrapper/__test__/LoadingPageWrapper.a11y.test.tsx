import * as React from 'react';
import { axe, render } from '../../../__test__/test-utils';
import LoadingPageWrapper from '../LoadingPageWrapper';

describe('LoadingPageWrapper component - accessibility tests', () => {
  it('is component accessible', async()=>{
    const result = render(<LoadingPageWrapper>test</LoadingPageWrapper>);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
