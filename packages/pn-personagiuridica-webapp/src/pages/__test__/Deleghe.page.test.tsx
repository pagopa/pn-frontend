import React from 'react';
import { fireEvent, RenderResult } from '@testing-library/react';
import { render } from '../../__test__/test-utils';
import Deleghe from '../Deleghe.page';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../component/Deleghe/DelegatesByCompany', () => ({
  __esModule: true,
  default: () => <div>DelegatesByCompany</div>,
}));

jest.mock('../../component/Deleghe/DelegationsOfTheCompany', () => ({
  __esModule: true,
  default: () => <div>DelegationsOfTheCompany</div>,
}));

describe('Deleghe page', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult;

  const renderComponent = async () => {
    result = render(<Deleghe />);
  };

  it('renders deleghe page', async () => {
    await renderComponent();
    expect(result.container).toHaveTextContent(/deleghe.title/i);
    expect(result.container).toHaveTextContent(/deleghe.description/i);
    expect(result.container).toHaveTextContent(/DelegatesByCompany/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_delegati/i);
    expect(result.container).toHaveTextContent(/deleghe.tab_deleghe/i);
    expect(result.container).not.toHaveTextContent(/DelegationsOfTheCompany/i);
  });

  it('test changing tab', async () => {
    await renderComponent();
    const tab2 = result.getByTestId('tab2');
    fireEvent.click(tab2);
    expect(result.container).toHaveTextContent(/DelegationsOfTheCompany/i);
  });
});
