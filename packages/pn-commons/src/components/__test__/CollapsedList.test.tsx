import React from 'react';
import CollapsedList from '../CollapsedList';

import { render } from '../../test-utils';

const people = [
  { id: 'mario', label: 'Mario Rossi' },
  { id: 'sara', label: 'Sara Giallo' },
  { id: 'maria', label: 'Maria Verde' },
  { id: 'luca', label: 'Luca Bianchi' },
];

describe('CollapsedList Component', () => {
  it('renders component - no remaining button', () => {
    // render component
    const result = render(
      <CollapsedList
        items={people}
        maxNumberOfItems={4}
        renderItem={(item) => (
          <div data-testid="people" key={item.id}>
            {item.label}
          </div>
        )}
        renderRemainingItem={(count) => <div data-testid="remainingPeople">+{count}</div>}
      />
    );
    const renderedPeople = result.queryAllByTestId('people');
    expect(renderedPeople).toHaveLength(people.length);
    renderedPeople.forEach((renderedPerson, index) => {
      expect(renderedPerson).toHaveTextContent(people[index].label);
    });
    const remainingPeople = result.queryByTestId('remainingPeople');
    expect(remainingPeople).not.toBeInTheDocument();
  });

  it('renders component - remaining button', () => {
    const maxNumberOfItems = 2;
    // render component
    const result = render(
      <CollapsedList
        items={people}
        maxNumberOfItems={maxNumberOfItems}
        renderItem={(item) => (
          <div data-testid="people" key={item.id}>
            {item.label}
          </div>
        )}
        renderRemainingItem={(count) => <div data-testid="remainingPeople">+{count}</div>}
      />
    );
    const renderedPeople = result.queryAllByTestId('people');
    expect(renderedPeople).toHaveLength(maxNumberOfItems);
    renderedPeople.forEach((renderedPerson, index) => {
      if (index === maxNumberOfItems) {
        return false;
      }
      expect(renderedPerson).toHaveTextContent(people[index].label);
    });
    const remainingPeople = result.queryByTestId('remainingPeople');
    expect(remainingPeople).toBeInTheDocument();
    expect(remainingPeople).toHaveTextContent('+' + maxNumberOfItems);
  });
});
