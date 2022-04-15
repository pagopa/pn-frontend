// import { render } from "../../__test__/test-utils";
import { render, screen } from "@testing-library/react";
import Profile from "../Profile.page";
import * as hooks from '../../redux/hooks';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    })
}));

describe('testing profile page', () => {
  beforeAll(() => {
    const mockUseAppSelector = jest.spyOn(hooks, 'useAppSelector');
    mockUseAppSelector.mockReturnValueOnce({
      name: 'Mario',
      family_name: 'Rossi',
      fiscal_number: 'RSSMRA45P02H501W'
    });

    render(<Profile />);
  });

  test('profile page renders properly', () => {
    const title = screen.getByRole('heading', { name: 'title' });
    expect(title).toBeInTheDocument();

    const subtitle = screen.getByText('subtitle');
    expect(subtitle).toBeInTheDocument()

    const nameLabel = screen.getByText('profile.name');
    expect(nameLabel).toBeInTheDocument();
    const familyNameLabel = screen.getByText('profile.family_name');
    expect(familyNameLabel).toBeInTheDocument();
    const fiscalNumberLabel = screen.getByText('profile.fiscal_number');
    expect(fiscalNumberLabel).toBeInTheDocument();

    const firstName = screen.getByText('Mario');
    expect(firstName).toBeInTheDocument();
    const familyName = screen.getByText('Rossi');
    expect(familyName).toBeInTheDocument();
    const fiscalNumber = screen.getByText('RSSMRA45P02H501W');
    expect(fiscalNumber).toBeInTheDocument();
  });
});