import { vi } from 'vitest';

import { Languages } from '@pagopa/mui-italia';

import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import { LANGUAGES, pagoPALink, postLoginLinks } from '../../../utility/costants';
import Footer from '../Footer';

const mockOpenFn = vi.fn();

describe('Footer Component', () => {
  const original = window.open;

  beforeAll(() => {
    Object.defineProperty(window, 'open', {
      configurable: true,
      value: mockOpenFn,
    });
  });

  afterAll((): void => {
    Object.defineProperty(window, 'open', { configurable: true, value: original });
  });

  it('renders footer', () => {
    // render component
    const { getAllByRole, getByRole } = render(<Footer loggedUser={true} />);
    const buttons = getAllByRole('link');
    expect(buttons).toHaveLength(4);
    buttons.forEach((button, index) => {
      if (index === 0) {
        expect(button).toHaveTextContent('PagoPA');
        expect(button).toHaveAttribute('aria-label', pagoPALink().ariaLabel);
      } else {
        expect(button).toHaveTextContent(postLoginLinks()[index - 1].label);
        expect(button).toHaveAttribute('aria-label', postLoginLinks()[index - 1].ariaLabel);
      }
    });
    const dropdownLanguageButton = getByRole('button');
    expect(dropdownLanguageButton).toBeInTheDocument();
    expect(dropdownLanguageButton).toHaveTextContent(LANGUAGES.it.it); // language 'it' is default selected
  });

  it('clicks on company link', () => {
    const { getAllByRole } = render(<Footer loggedUser={true} />);
    const buttons = getAllByRole('link');
    fireEvent.click(buttons[0]);
    const localizedPagoPALink = pagoPALink();
    expect(mockOpenFn).toHaveBeenCalledTimes(1);
    expect(mockOpenFn).toHaveBeenCalledWith(localizedPagoPALink.href, '_blank');
  });

  it('change language', async () => {
    const { getByRole, rerender } = render(
      <Footer
        loggedUser={true}
        onLanguageChanged={(langCode) => sessionStorage.setItem('lang', langCode)}
      />
    );
    let dropdownLanguageButton = getByRole('button');
    let expectedLanguagesLabels = Object.values(LANGUAGES.it);
    // open the dropdown
    fireEvent.click(dropdownLanguageButton);
    let languageSelector = screen.getByRole('presentation');
    expect(languageSelector).toBeInTheDocument();
    let languageOptions = languageSelector?.querySelectorAll('ul li');
    expect(languageOptions).toHaveLength(expectedLanguagesLabels.length);
    // check the dropdown languages - by default the it language is selected
    languageOptions.forEach((option, index) => {
      expect(option).toHaveTextContent(expectedLanguagesLabels[index]);
    });
    // select a language - we assume that the languages array has at least a length of 3
    fireEvent.click(languageOptions[2]);
    await waitFor(() => {
      expect(languageSelector).not.toBeInTheDocument();
    });
    // check that the right language is selected
    const languageCode = Object.keys(LANGUAGES)[2] as keyof Languages;
    expect(sessionStorage.getItem('lang')).toBe(languageCode);
    // simulate rerendering due to language change
    rerender(<Footer loggedUser={true} />);
    dropdownLanguageButton = getByRole('button');
    expect(dropdownLanguageButton).toHaveTextContent(Object.values(LANGUAGES[languageCode]!)[2]);
    // check the dropdown languages
    expectedLanguagesLabels = Object.values(LANGUAGES[languageCode]!);
    fireEvent.click(dropdownLanguageButton);
    languageSelector = screen.getByRole('presentation');
    languageOptions = languageSelector?.querySelectorAll('ul li');
    languageOptions.forEach((option, index) => {
      expect(option).toHaveTextContent(expectedLanguagesLabels[index]);
    });
  });

  it('check language when sessionStorage is initially set', async () => {
    // we assume that the languages array has at least a length of 4
    const languageCode = Object.keys(LANGUAGES)[3] as keyof Languages;
    sessionStorage.setItem('lang', languageCode);
    const { getByRole } = render(<Footer loggedUser={true} />);
    const dropdownLanguageButton = getByRole('button');
    const expectedLanguagesLabels = Object.values(LANGUAGES[languageCode]!);
    expect(dropdownLanguageButton).toHaveTextContent(Object.values(LANGUAGES[languageCode]!)[3]);
    // open the dropdown
    fireEvent.click(dropdownLanguageButton);
    const languageSelector = screen.getByRole('presentation');
    const languageOptions = languageSelector?.querySelectorAll('ul li');
    // check the dropdown languages
    languageOptions.forEach((option, index) => {
      expect(option).toHaveTextContent(expectedLanguagesLabels[index]);
    });
  });
});
