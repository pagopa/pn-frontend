import { testInput } from '@pagopa-pn/pn-commons/src/test-utils';

import { render, within } from '../../../__test__/test-utils';
import { ShowCodesInput } from '../ShowCodesInput';

describe('ShowCodesInput', () => {
  it('render component', async () => {
    const { container } = render(
      <ShowCodesInput name="test" value="test-value" label="test-label" />
    );
    expect(container).toHaveTextContent('test-label');
    await testInput(container, 'test', 'test-value');
    const input = container.querySelector(`input[name="test"]`);
    expect(input).toHaveAttribute('readonly');
    const copyToClipboardButton = within(container).getByRole('button');
    expect(copyToClipboardButton).toBeInTheDocument();
  });
});
