import { fireEvent, waitFor, screen } from '@testing-library/react';

import { render } from '../../../test-utils';
import { LANGUAGES, pagoPALink, postLoginLinks } from '../../../utils/costants';
import Footer from '../Footer';

describe('Footer Component', () => {

  it('renders footer', () => {
    // render component
    const result = render(<Footer loggedUser={true}/>);
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
    // render component
    const mockEventTrackingCallbackChangeLanguage = jest.fn();
    const result = render(<Footer loggedUser={true} eventTrackingCallbackChangeLanguage={mockEventTrackingCallbackChangeLanguage}/>);
    const buttons = result.container.querySelectorAll('button');
    fireEvent.click(buttons[4]);
    const languageSelector = await waitFor(() => screen.queryByRole('presentation'));
    expect(languageSelector).toBeInTheDocument();
    const languagesElements = languageSelector?.querySelectorAll('ul li');
    expect(languagesElements).toHaveLength(Object.keys(LANGUAGES).length);
    const languagesKeys = Object.keys(LANGUAGES.it); // language 'it' is default selected
    languagesElements!.forEach((languageElement, index) => {
      expect(languageElement).toHaveTextContent(LANGUAGES.it[languagesKeys[index] as 'it' | 'en']);
      fireEvent.click(languageElement);
    });
    expect(mockEventTrackingCallbackChangeLanguage).toBeCalledTimes(languagesElements!.length);
  });
});