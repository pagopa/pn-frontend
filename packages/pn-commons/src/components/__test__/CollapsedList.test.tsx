import { render } from '../../test-utils';
import CollapsedList from '../CollapsedList';

const people = [
  { id: 'utente-uno', label: 'Utente Test Uno' },
  { id: 'utente-nove', label: 'Utente Test Nove' },
  { id: 'utente-dieci', label: 'Utente Test Dieci' },
  { id: 'utente-cinque', label: 'Utente Test Cinque' },
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
      return expect(renderedPerson).toHaveTextContent(people[index].label);
    });
    const remainingPeople = result.queryByTestId('remainingPeople');
    expect(remainingPeople).toBeInTheDocument();
    expect(remainingPeople).toHaveTextContent('+' + maxNumberOfItems);
  });
});
