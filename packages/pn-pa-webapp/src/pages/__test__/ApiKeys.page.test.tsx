

import { RenderResult } from '@testing-library/react';
import { render, axe } from '../../__test__/test-utils';
import ApiKeys from '../ApiKeys.page';

describe('ApiKeys Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  beforeEach(async () => {
    // render component
    result = render(<ApiKeys />);
  });

  it('renders the page', () => {
    result?.getByRole('heading', { name: /api keys/i });
  });

  it.skip('does not have basic accessibility issues rendering the page', async () => {
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });

});