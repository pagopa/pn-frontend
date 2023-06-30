import { render } from '../../test-utils';
import AccessDenied from '../AccessDenied';

describe('AccessDenied Component', () => {
  it('renders access denied with standard texts', () => {
    // render component
    const result = render(
      <AccessDenied
        isLogged={false}
        goToLogin={function (): void {
          throw new Error('Function not implemented.');
        }}
        goToHomePage={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    const heading = result?.queryByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(
      /Non hai le autorizzazioni necessarie per accedere a questa pagina/i
    );
  });

  it('renders access denied with custom texts', () => {
    // render component
    const result = render(
      <AccessDenied
        isLogged={false}
        message="mock-message"
        subtitle="mock-subtitle"
        goToLogin={function (): void {
          throw new Error('Function not implemented.');
        }}
        goToHomePage={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    const messageElement = result?.queryByText("mock-message");
    const subtitleElement = result?.queryByText("mock-subtitle");
    expect(messageElement).toBeInTheDocument();
    expect(subtitleElement).toBeInTheDocument();
  });
});
