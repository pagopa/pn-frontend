import { RenderResult } from '@testing-library/react';
import { render } from '../../__test__/test-utils';
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

});
