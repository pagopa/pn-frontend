import React from 'react';

import BalconyIcon from '@mui/icons-material/Balcony';

import { fireEvent, render } from '../../test-utils';
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
    const { container, getByTestId } = render(<EmptyState emptyActionCallback={mockAction} />);
    expect(container).toHaveTextContent(
      'Non abbiamo trovato risultati: prova con dei filtri diversi'
    );
    expect(container).toHaveTextContent('Rimuovi filtri');
    const icon = getByTestId('SentimentDissatisfiedIcon');
    expect(icon).toBeInTheDocument();
  });

  it('renders with parameters without secondaryMessage', () => {
    const { container, queryByTestId } = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
      />
    );
    expect(container).toHaveTextContent('Test Message');
    expect(container).toHaveTextContent('Action label test');
    const sadIcon = queryByTestId('SentimentDissatisfiedIcon');
    const happyIcon = queryByTestId('InsertEmoticonIcon');
    expect(sadIcon).not.toBeInTheDocument();
    expect(happyIcon).not.toBeInTheDocument();
  });

  it('renders with happy face icon', () => {
    const { getByTestId } = render(
      <EmptyState emptyActionCallback={mockAction} sentimentIcon={KnownSentiment.SATISFIED} />
    );
    const icon = getByTestId('InsertEmoticonIcon');
    expect(icon).toBeInTheDocument();
  });

  it('renders with custom icon', () => {
    const { getByTestId, queryByTestId } = render(
      <EmptyState emptyActionCallback={mockAction} sentimentIcon={BalconyIcon} />
    );
    const sadIcon = queryByTestId('SentimentDissatisfiedIcon');
    const happyIcon = queryByTestId('InsertEmoticonIcon');
    const customIcon = getByTestId('BalconyIcon');
    expect(sadIcon).not.toBeInTheDocument();
    expect(happyIcon).not.toBeInTheDocument();
    expect(customIcon).toBeInTheDocument();
  });

  it('check call to action without secondaryMessage', () => {
    const { getByTestId } = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
      />
    );
    const button = getByTestId('callToActionFirst');
    fireEvent.click(button!);
    expect(mockAction).toBeCalledTimes(1);
  });

  it('renders with parameters and secondaryMessage', () => {
    const { container, queryByTestId } = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
        secondaryMessage={secondaryMessage}
      />
    );
    expect(container).toHaveTextContent('Test Message');
    expect(container).toHaveTextContent('Action label test');
    expect(container).toHaveTextContent('Secondary Message text');
    expect(container).toHaveTextContent('Seconday Message Action Label');
    const icon = queryByTestId('SentimentDissatisfiedIcon');
    expect(icon).not.toBeInTheDocument();
  });

  it('check call to action without secondaryMessage', () => {
    const { getByTestId } = render(
      <EmptyState
        emptyActionCallback={mockAction}
        emptyMessage="Test Message"
        emptyActionLabel="Action label test"
        sentimentIcon={KnownSentiment.NONE}
        secondaryMessage={secondaryMessage}
      />
    );
    const button1 = getByTestId('callToActionFirst');
    const button2 = getByTestId('callToActionSecond');
    fireEvent.click(button1!);
    fireEvent.click(button2!);
    expect(mockAction).toBeCalledTimes(2);
  });
});
