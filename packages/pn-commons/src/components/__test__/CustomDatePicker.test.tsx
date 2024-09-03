import { createMatchMedia, fireEvent, render, screen } from '../../test-utils';
import CustomDatePicker from '../CustomDatePicker';

const languages = [
  {
    language: 'it',
    month: 'gennaio',
  },
  {
    language: 'en',
    month: 'january',
  },
  {
    language: 'fr',
    month: 'janvier',
  },
  {
    language: 'de',
    month: 'januar',
  },
  {
    language: 'sl',
    month: 'januar',
  },
];

const RenderDatePicker = ({ language = 'it' }: { language?: string }) => (
  <CustomDatePicker
    label={'DatePicker'}
    onChange={() => {}}
    value={new Date('01/01/2023')}
    language={language}
    slotProps={{
      textField: {
        inputProps: {
          placeholder: 'datepickerinput',
        },
      },
    }}
  />
);

describe('test CustomDatePicker component', () => {
  it('renders the component', () => {
    const { getByPlaceholderText, container } = render(<RenderDatePicker />);
    const input = getByPlaceholderText(/datepickerinput/i);
    expect(container).toHaveTextContent(/datepicker/i);
    expect(input).toBeInTheDocument();
  });

  it.each(languages)('check january month to be $month in $language', (language) => {
    const { container, getByRole } = render(<RenderDatePicker language={language.language} />);
    expect(container).toHaveTextContent(/datepicker/i);
    const button = getByRole('button');
    fireEvent.click(button);
    const regExMonth = new RegExp(`${language.month}`, 'i');
    expect(screen.getByText(regExMonth)).toBeInTheDocument();
  });

  it('renders the component with mobile window', () => {
    window.matchMedia = createMatchMedia(550, 600);
    const { getByPlaceholderText, getByRole } = render(<RenderDatePicker />);
    const input = getByPlaceholderText(/datepickerinput/i);
    fireEvent.click(input);
    const dialog = getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });
});
