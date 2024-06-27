import { render, screen } from '@testing-library/react';

import { PnECharts } from '../PnEcharts';
import { option } from '../__mocks__/PnEcharts.mock';

describe('PnECharts component tests', () => {
  it('renders the component', () => {
    const result = render(
      <div style={{ width: '100px', height: '100px' }}>
        <PnECharts option={option} />
      </div>
    );

    screen.debug(result.container);
  });
});
