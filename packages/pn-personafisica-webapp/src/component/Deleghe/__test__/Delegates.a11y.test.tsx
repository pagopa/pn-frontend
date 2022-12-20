import * as React from 'react';
import { axe, render } from '../../../__test__/test-utils';
import * as hooks from '../../../redux/hooks';
import { arrayOfDelegates } from '../../../redux/delegation/__test__/test.utils';
import Delegates from '../Delegates';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('Delegates Component - accessibility tests', () => {
  it('is Delegates component accessible', async () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates);
    const result = render(<Delegates />);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
