import { within } from '@testing-library/react';

import { render } from '../../../test-utils';
import Footer from '../Footer';

const assistanceEmail = 'mocked-assistance@mail.com';

const footerLinks = [
  {label: 'Privacy Policy', link: 'https://www.pagopa.it/it/privacy-policy/'},
  {label: 'Termini e condizioni d’uso del sito', link: 'https://www.pagopa.it/it/termini-e-condizioni-di-utilizzo-del-sito/'},
  {label: 'Sicurezza delle informazioni', link: 'https://www.pagopa.it/static/781646994f1f8ddad2d95af3aaedac3d/Sicurezza-delle-informazioni_PagoPA-S.p.A..pdft'},
  {label: 'Assistenza', link: `mailto:${assistanceEmail}`}
];

describe('Footer Component', () => {

  it('renders footer', async () => {
    // render component
    const result = render(<Footer/>);
    expect(result.container).toHaveTextContent(/PagoPA S.p.A./i);
    const linksContainer = await within(result?.container!).findByTestId('linksContainer');
    expect(linksContainer).toBeInTheDocument();
    const links = linksContainer.querySelectorAll('a');
    expect(links).toHaveLength(3);
    links.forEach((link, index) => {
      expect(link).toHaveTextContent(footerLinks[index].label);
      expect(link).toHaveAttribute('href', footerLinks[index].link);
    })
  });

  it('renders assistance mail link', async () => {
    // render component
    const result = render(<Footer assistanceEmail={assistanceEmail}/>);
    const linksContainer = await within(result.container!).findByTestId('linksContainer');
    expect(linksContainer).toBeInTheDocument();
    const links = linksContainer.querySelectorAll('a');
    expect(links).toHaveLength(4);
    links.forEach((link, index) => {
      expect(link).toHaveTextContent(footerLinks[index].label);
      expect(link).toHaveAttribute('href', footerLinks[index].link);
    })
  });
});