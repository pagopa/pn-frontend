import { ReactNode } from 'react';
import { vi } from 'vitest';

import { fireEvent, render } from '../../__test__/test-utils';
import DigitalContactActivation from '../DigitalContactActivation.page';

const mockNavigateFn = vi.fn();

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual<any>('react-router-dom')),
  useNavigate: () => mockNavigateFn,
}));

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string, options?: { returnObjects: boolean }) =>
      options?.returnObjects ? [str] : str,
  }),
  Trans: (props: { i18nKey: string; components?: Array<ReactNode> }) => (
    <>
      {props.i18nKey} {props.components?.map((c) => c)}
    </>
  ),
}));

describe('DigitalContactActivation', () => {
  it('render component', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const title = getByText('legal-contacts.sercq-send-wizard.title');
    expect(title).toBeInTheDocument();
  });

  it('should go back when clicking on the back button', () => {
    const { getByText } = render(<DigitalContactActivation />);
    const backButton = getByText('button.annulla');
    expect(backButton).toBeInTheDocument();
    fireEvent.click(backButton);
    expect(mockNavigateFn).toHaveBeenCalledTimes(1);
    expect(mockNavigateFn).toHaveBeenCalledWith(-1);
  });
});
