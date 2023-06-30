import * as React from 'react';
import { axe, render } from '../../../__test__/test-utils';
import { arrayOfDelegates } from '../../../redux/delegation/__test__/test.utils';
import * as hooks from '../../../redux/hooks';
import MobileDelegates from '../MobileDelegates';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('MobileDelegates Component - accessibility tests', () => {
  it('is Mobile Delegates component accessible', async()=>{
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce(arrayOfDelegates);
    const result = render(<MobileDelegates/>);
    const results = await axe(result?.container);
    expect(results).toHaveNoViolations();
  });
});
