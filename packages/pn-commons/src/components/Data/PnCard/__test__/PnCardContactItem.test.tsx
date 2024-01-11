import { render } from '../../../../test-utils';
import PnCardContentItem from '../PnCardContentItem';

describe('PnCardContactItem', () => {
  it('render component', () => {
    const { getByTestId } = render(
      <PnCardContentItem label="mocked-card-label" testId="cardBody">
        mocked-card-content
      </PnCardContentItem>
    );
    const label = getByTestId('cardBodyLabel');
    const body = getByTestId('cardBodyValue');
    expect(label).toHaveTextContent('mocked-card-label');
    expect(body).toHaveTextContent('mocked-card-content');
  });

  it('render component - no typography', () => {
    const { getByTestId } = render(
      <PnCardContentItem label="mocked-card-label" wrapValueInTypography={false} testId="cardBody">
        mocked-card-content
      </PnCardContentItem>
    );
    const label = getByTestId('cardBodyLabel');
    const body = getByTestId('cardBodyValue');
    expect(label).toHaveTextContent('mocked-card-label');
    expect(body).toHaveTextContent('mocked-card-content');
  });
});
