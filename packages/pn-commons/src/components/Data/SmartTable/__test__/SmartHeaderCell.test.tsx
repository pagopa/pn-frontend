import { render } from '../../../../test-utils';
import SmartHeaderCell from '../SmartHeaderCell';

describe('SmartHeaderCell Component', () => {
  it('render component', () => {
    const { container } = render(
      <SmartHeaderCell columnId={'mock-column-id'}>mock-column-label</SmartHeaderCell>
    );
    expect(container).toHaveTextContent(/mock-column-label/);
  });
});
