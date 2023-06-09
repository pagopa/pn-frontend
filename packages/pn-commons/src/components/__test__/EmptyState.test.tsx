import React from 'react';
import BalconyIcon from '@mui/icons-material/Balcony';
import { render, fireEvent } from '../../test-utils';
import { KnownSentiment } from '../../types';
import EmptyState from '../EmptyState';

describe('EmptyState component', () => {
  const mockAction = jest.fn(); // it creates a dummy functions

  const secondaryMessage = {
    emptyMessage: 'Secondary Message text',
    emptyActionLabel: 'Seconday Message Action Label',
    emptyActionCallback: mockAction,
  };

  it('renders with default parameters', () => {
    const result = render(<EmptyState emptyActionCallback={mockAction} />);
    expect(result.container).toHaveTextContent(
      'Non abbiamo trovato risultati: prova con dei filtri diversi'
    );
    expect(result.container).toHaveTextContent('Rimuovi filtri');
    const icon = result.queryByTestId('SentimentDissatisfiedIcon');
    expect(icon).toBeInTheDocument();
  });

  it('renders with parameters without secondaryMessage', () => {
    const result = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
      />
    );
    expect(result.container).toHaveTextContent('Test Message');
    expect(result.container).toHaveTextContent('Action label test');
    const sadIcon = result.queryByTestId('SentimentDissatisfiedIcon');
    const happyIcon = result.queryByTestId('InsertEmoticonIcon');
    expect(sadIcon).not.toBeInTheDocument();
    expect(happyIcon).not.toBeInTheDocument();
  });

  it('renders with happy face icon', () => {
    const result = render(
      <EmptyState emptyActionCallback={mockAction} sentimentIcon={KnownSentiment.SATISFIED} />
    );
    const icon = result.queryByTestId('InsertEmoticonIcon');
    expect(icon).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const result = render(
      <EmptyState emptyActionCallback={mockAction} sentimentIcon={BalconyIcon} />
    );
    const sadIcon = result.queryByTestId('SentimentDissatisfiedIcon');
    const happyIcon = result.queryByTestId('InsertEmoticonIcon');
    const customIcon = result.queryByTestId('BalconyIcon');
    expect(sadIcon).not.toBeInTheDocument();
    expect(happyIcon).not.toBeInTheDocument();
    expect(customIcon).toBeInTheDocument();
  });

  it('check call to action without secondaryMessage', () => {
    const result = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
      />
    );
    const button = result.queryByTestId('callToActionFirst');
    fireEvent.click(button!);
    expect(mockAction).toBeCalledTimes(1);
  });

  it('renders with parameters and secondaryMessage', () => {
    const result = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
        secondaryMessage={secondaryMessage}
      />
    );
    expect(result.container).toHaveTextContent('Test Message');
    expect(result.container).toHaveTextContent('Action label test');
    expect(result.container).toHaveTextContent('Secondary Message text');
    expect(result.container).toHaveTextContent('Seconday Message Action Label');
    const icon = result.queryByTestId('SentimentDissatisfiedIcon');
    expect(icon).not.toBeInTheDocument();
  });

  it('check call to action without secondaryMessage', () => {
    const result = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
        secondaryMessage={secondaryMessage}
      />
    );
    const button1 = result.queryByTestId('callToActionFirst');
    const button2 = result.queryByTestId('callToActionSecond');
    fireEvent.click(button1!);
    fireEvent.click(button2!);
    expect(mockAction).toBeCalledTimes(2);
  });
});
