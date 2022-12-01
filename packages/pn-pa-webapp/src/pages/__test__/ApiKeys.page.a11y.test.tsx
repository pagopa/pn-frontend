import { render, axe } from '../../__test__/test-utils';
import ApiKeys from '../ApiKeys.page';

describe('ApiKeys Page - accessibility tests', () => {
  it('does not have basic accessibility issues rendering the page', async () => {
    const result = render(<ApiKeys />);
    if (result) {
      const results = await axe(result.container);
      expect(results).toHaveNoViolations();
    }
  });
});
