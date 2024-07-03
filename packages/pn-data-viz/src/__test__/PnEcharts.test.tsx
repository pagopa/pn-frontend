import { render, within } from '@testing-library/react';

import { PnECharts } from '../PnEcharts';
import { option } from '../__mocks__/PnEcharts.mock';

describe('PnECharts component tests', () => {
  const originalClientHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'clientHeight'
  );
  const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');

  beforeAll(() => {
    // we need this, because the element taken with useRef doesn't have height and width
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      value: 200,
    });
  });

  afterAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      value: originalClientHeight,
      configurable: true,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      value: originalClientWidth,
      configurable: true,
    });
  });

  it('renders the component - no legend', () => {
    const { container, queryByTestId } = render(
      <PnECharts option={option} style={{ width: '100px', height: '100px' }} />
    );
    const canvas = container.querySelector('canvas');
    const legendContainer = queryByTestId('legendContainer');
    expect(canvas).toBeInTheDocument();
    expect(legendContainer).not.toBeInTheDocument();
  });

  it('renders the component - legend', () => {
    const { container, getByTestId } = render(
      <PnECharts
        option={option}
        style={{ width: '100px', height: '100px' }}
        legend={['Field1', 'Field2']}
      />
    );
    const canvas = container.querySelector('canvas');
    const legendContainer = getByTestId('legendContainer');
    const legendItems = within(legendContainer).getAllByTestId('legendItem');
    expect(canvas).toBeInTheDocument();
    expect(legendContainer).toBeInTheDocument();
    expect(legendItems).toHaveLength(2);
    expect(legendItems[0]).toHaveTextContent('Field1');
    expect(legendItems[1]).toHaveTextContent('Field2');
  });
});
