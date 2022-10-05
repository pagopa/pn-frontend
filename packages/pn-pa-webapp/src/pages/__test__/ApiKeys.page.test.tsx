/*
  Scrivere TEST opportuni non appena si avrà il quadro completo su FE/BE
  Issue di riferimento: PN-1845

  Ci sono un paio di test dove si è provveduti a skipparli per evitare il fallimento dei test di tutta la webapp
*/

import { act, RenderResult } from '@testing-library/react';
import { render } from '../../__test__/test-utils';
import ApiKeys from '../ApiKeys.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('ApiKeys Page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  it('renders the page', async () => {
    await act(async () => {
      result = render(<ApiKeys />);
    });
    expect(result?.getAllByRole('heading')[0]).toHaveTextContent(/title/i);
  });
});