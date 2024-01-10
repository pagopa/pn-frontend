import { disableConsoleLogging, fireEvent, getById, render, waitFor } from '../../test-utils';
import { SpecialContactsProvider, useSpecialContactsContext } from '../SpecialContacts.context';

const Component: React.FC = () => {
  const { contextEditMode, setContextEditMode } = useSpecialContactsContext();
  return (
    <>
      <div id="test">{`${contextEditMode}`}</div>
      <button onClick={() => setContextEditMode(true)}>Click me</button>
    </>
  );
};

describe('test SpecialContacts context', () => {
  disableConsoleLogging('error');

  it('throw error when using context outside provider', () => {
    expect(() => render(<Component />)).toThrowError(
      'useSpecialContactsContext must be used within a SpecialContactsProvider'
    );
  });

  it('test context behaviour', async () => {
    const { container, getByRole } = render(
      <SpecialContactsProvider>
        <Component />
      </SpecialContactsProvider>
    );
    const content = getById(container, 'test');
    expect(content).toHaveTextContent('false');
    const button = getByRole('button');
    fireEvent.click(button);
    await waitFor(() => {
      expect(content).toHaveTextContent('true');
    });
  });
});
