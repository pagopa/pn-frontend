
import { render, fireEvent } from "../../test-utils";
import EmptyState from '../EmptyState';

describe('EmptyState component', () => {
  const mockAction = jest.fn(); // it creates a dummy functions

  const secondaryMessage = {
    emptyMessage: 'Secondary Message text',
    emptyActionLabel: 'Seconday Message Action Label',
    emptyActionCallback: mockAction,
  };

  it('renders with default parameters', () => {
    const result = render(<EmptyState emptyActionCallback={mockAction}/>);
    expect(result.container).toHaveTextContent('I filtri che hai aggiunto non hanno dato nessun risultato.');
    expect(result.container).toHaveTextContent('Rimuovi filtri');
    const icon = result.queryByTestId('SentimentDissatisfiedIcon');
    expect(icon).toBeInTheDocument();
  });
  
  it('renders with parameters without secondaryMessage', () => {
    const result = render(<EmptyState emptyActionCallback={mockAction} emptyMessage='Test Message' emptyActionLabel='Action label test' disableSentimentDissatisfied />);
    expect(result.container).toHaveTextContent('Test Message');
    expect(result.container).toHaveTextContent('Action label test');
    const icon = result.queryByTestId('SentimentDissatisfiedIcon');
    expect(icon).not.toBeInTheDocument();
  });

  it('check call to action without secondaryMessage', () => {
    const result = render(<EmptyState emptyActionCallback={mockAction} emptyMessage='Test Message' emptyActionLabel='Action label test' disableSentimentDissatisfied />);
    const button = result.queryByTestId('callToActionFirst');
    fireEvent.click(button!);
    expect(mockAction).toBeCalledTimes(1);
  });

  it('renders with parameters and secondaryMessage', () => {
    const result = render(<EmptyState emptyActionCallback={mockAction} emptyMessage='Test Message' emptyActionLabel='Action label test' disableSentimentDissatisfied secondaryMessage={secondaryMessage} />);
    expect(result.container).toHaveTextContent('Test Message');
    expect(result.container).toHaveTextContent('Action label test');
    expect(result.container).toHaveTextContent('Secondary Message text');
    expect(result.container).toHaveTextContent('Seconday Message Action Label');
    const icon = result.queryByTestId('SentimentDissatisfiedIcon');
    expect(icon).not.toBeInTheDocument();
  });

  it('check call to action without secondaryMessage', () => {
    const result = render(<EmptyState emptyActionCallback={mockAction} emptyMessage='Test Message' emptyActionLabel='Action label test' disableSentimentDissatisfied secondaryMessage={secondaryMessage} />);
    const button1 = result.queryByTestId('callToActionFirst');
    const button2 = result.queryByTestId('callToActionSecond');
    fireEvent.click(button1!);
    fireEvent.click(button2!);
    expect(mockAction).toBeCalledTimes(2);
  });
});
