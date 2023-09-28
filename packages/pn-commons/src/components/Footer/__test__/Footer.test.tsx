import { fireEvent, screen } from '@testing-library/react';

import { render } from '../../../test-utils';
import { LANGUAGES, pagoPALink, postLoginLinks } from '../../../utils/costants';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('renders footer', () => {
    // render component
    const result = render(<Footer loggedUser={true} />);
    const buttons = result.container.querySelectorAll('button');

    expect(buttons).toHaveLength(5);
    buttons.forEach((button, index) => {
      if (index === 0) {
        expect(button).toHaveTextContent('PagoPA');
        expect(button).toHaveAttribute('aria-label', pagoPALink().ariaLabel);
      } else if (index === 4) {
        expect(button).toHaveTextContent(LANGUAGES.it.it); // language 'it' is default selected
      } else {
        expect(button).toHaveTextContent(postLoginLinks()[index - 1].label);
        expect(button).toHaveAttribute('aria-label', postLoginLinks()[index - 1].ariaLabel);
      }
    });
  });

  it('shows languages dropdown', async () => {
    const mockEventTrackingCallbackChangeLanguage = jest.fn();
    const result = render(
      <Footer
        loggedUser={true}
        eventTrackingCallbackChangeLanguage={mockEventTrackingCallbackChangeLanguage}
      />
    );
    const buttons = result.container.querySelectorAll('button');
    const dropdownLanguageButton = buttons[4];
    const languageKeys = Object.keys(LANGUAGES);

    // This array represents how the options labels should sequentially change when you click the option.
    const expectedLanguagesLabels = new Array();
    for (var i = 0; i < languageKeys.length; i++) {
      expectedLanguagesLabels.push(LANGUAGES[languageKeys[i - 1 < 0 ? 0 : i - 1]][languageKeys[i]]);
    }

    languageKeys.forEach((currentDropdownLanguage, index) => {
      fireEvent.click(dropdownLanguageButton);
      const languageSelector = screen.queryByRole('presentation');
      expect(languageSelector).toBeInTheDocument();
      const languageOptions = languageSelector?.querySelectorAll('ul li');
      expect(languageOptions).toHaveLength(Object.keys(LANGUAGES[currentDropdownLanguage]).length);
      const languageOptionsArray = Array.from(languageOptions!);
      expect(languageOptionsArray[index]).toHaveTextContent(expectedLanguagesLabels[index]);
      fireEvent.click(languageOptionsArray[index]);
    });
    expect(mockEventTrackingCallbackChangeLanguage).toBeCalledTimes(languageKeys.length);
  });
});
