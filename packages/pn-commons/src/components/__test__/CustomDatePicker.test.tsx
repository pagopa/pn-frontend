import { createMatchMedia, fireEvent, render, screen } from '../../test-utils';
import CustomDatePicker from '../CustomDatePicker';

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

  it('renders the component with mobile window', () => {
    window.matchMedia = createMatchMedia(800);
    const { getByPlaceholderText, container } = render(<RenderDatePicker />);
    const input = getByPlaceholderText(/datepickerinput/i);
    expect(container).toHaveTextContent(/datepicker/i);
    expect(input).toBeInTheDocument();
  });
});

describe('test CustomDatePicker languages', () => {
  const languages = [
    {
      language: 'it',
      month: 'gennaio',
    },
    {
      language: 'en',
      month: 'January',
    },
    {
      language: 'fr',
      month: 'janvier',
    },
    {
      language: 'de',
      month: 'Januar',
    },
    {
      language: 'sl',
      month: 'januar',
    },
  ];

  it.each(languages)('check january month to be $month in $language', (language) => {
    const { container, getByPlaceholderText } = render(
      <RenderDatePicker language={language.language} />
    );
    expect(container).toHaveTextContent(/datepicker/i);
    const button = getByPlaceholderText('datepickerinput');
    fireEvent.click(button);
    const regExMonth = new RegExp(`${language.month}`);
    if (language.month == 'January') {
      expect(screen.getByText(regExMonth)).toBeInTheDocument();
    } else {
      expect(screen.getAllByText(regExMonth).length).toBe(2);
    }
  });
});
