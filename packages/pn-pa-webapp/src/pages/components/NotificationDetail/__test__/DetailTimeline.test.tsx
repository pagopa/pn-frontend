import { act, RenderResult } from '@testing-library/react';

import { notificationToFe } from '../../../../redux/notification/__test__/test-utils';
import { render } from '../../../../__test__/test-utils';
import DetailTimeline from '../DetailTimeline';

describe('Notification Detail Timeline Component', () => {
  let result: RenderResult | undefined;

  beforeEach(async () => {
    // render component
    await act(async () => {
      result = render(<DetailTimeline notification={notificationToFe}/>);
    });
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders detail timeline', async () => {
    expect(result?.container).toHaveTextContent(/Stato della notifica/i);
    // expect(result?.container).toHaveTextContent(/Scarica tutti gli allegati/i);
  });

});