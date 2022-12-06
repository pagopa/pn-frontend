import * as React from 'react';
import { render } from '@testing-library/react';
import { axe } from '../../../__test__/test-utils';
import ErrorDeleghe from '../ErrorDeleghe';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('ErrorDeleghe Component - accessibility tests', () => {
  it('is ErrorDeleghe component accessible', async()=>{
    const result = render(<ErrorDeleghe errorType={2} />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
