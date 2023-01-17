import * as React from 'react';

import { axe, render } from '../../../__test__/test-utils';
import * as hooks from '../../../redux/hooks';
import { Component, mockedStore, Wrapper } from './DigitalContactsCodeVerification.context.test-utils';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('DigitalContactsCodeVerification Context - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValue(mockedStore);

    const result = render(
      <Wrapper>
        <Component />
      </Wrapper>
    );
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});
