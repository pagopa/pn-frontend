import React from 'react';
import * as hooks from '../../redux/hooks';
import { axe, render } from "../../__test__/test-utils";
import Profile from "../Profile.page";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    })
}));

describe('profile page - accessibility tests', () => {
  it('is profile page accessible', async ()=>{
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce({
      name: 'Mario',
      family_name: 'Rossi',
      fiscal_number: 'RSSMRA45P02H501W'
    });
    const { container } = render(<Profile/>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});