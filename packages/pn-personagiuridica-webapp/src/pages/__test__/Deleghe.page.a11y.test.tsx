import React from 'react';
import * as redux from 'react-redux';

import * as isMobileHook from '@pagopa-pn/pn-commons/src/hooks/useIsMobile';

import { act, RenderResult } from '@testing-library/react';
import { axe, render } from '../../__test__/test-utils';
import Deleghe from '../Deleghe.page';

const useIsMobileSpy = jest.spyOn(isMobileHook, 'useIsMobile');

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

const useDispatchSpy = jest.spyOn(redux, 'useDispatch');
const mockDispatchFn = jest.fn();

describe('Deleghe page - accessibility tests', () => {
 afterEach(() => {
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
    useDispatchSpy.mockClear();
    useDispatchSpy.mockReset();
  });

  it('is deleghe page accessible - desktop version', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(false);

    await act(async () => {
      result = render(<Deleghe />);
    });

    if (result) {
        const { container } = result;
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    } else {
        fail("render() returned undefined!");
      }
  });

  it('is deleghe page accessible - mobile version', async () => {
    // eslint-disable-next-line functional/no-let
    let result: RenderResult | undefined;

    useDispatchSpy.mockReturnValue(mockDispatchFn as any);
    useIsMobileSpy.mockReturnValue(true);

    await act(async () => {
      result = render(<Deleghe />);
    });

    if (result) {
        const { container } = result;
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    } else {
        fail("render() returned undefined!");
      }
  });
});
