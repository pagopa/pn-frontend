import { disableConsoleLogging } from '../../test-utils';
import checkChildren from '../children.utility';

const MockedCmpChild: React.FC = () => <div>I'm a mocked component child</div>;
const MockedCmpAnotherChild: React.FC = () => <div>I'm an another mocked component child</div>;

describe('test children utility', () => {
  disableConsoleLogging('error');

  it('test checkChildren - everything is ok', () => {
    expect(
      checkChildren(<MockedCmpChild />, [{ cmp: MockedCmpChild }], 'Mocked Cmp')
    ).toBeUndefined();
  });

  it('test checkChildren - everything is ok with null', () => {
    expect(checkChildren(null, [{ cmp: MockedCmpChild }], 'Mocked Cmp')).toBeUndefined();
  });

  it('test checkChildren - forbidden type', () => {
    expect(() =>
      checkChildren(<p>Forbidden type</p>, [{ cmp: MockedCmpChild }], 'Mocked Cmp')
    ).toThrowError('Mocked Cmp can have only children of type MockedCmpChild');
  });

  it('test checkChildren - forbidden type with count', () => {
    expect(() =>
      checkChildren(<p>Forbidden type</p>, [{ cmp: MockedCmpChild, maxCount: 2 }], 'Mocked Cmp')
    ).toThrowError('Mocked Cmp can have only 2 children of type MockedCmpChild');
  });

  it('test checkChildren - forbidden type with multiple allowed types', () => {
    expect(() =>
      checkChildren(
        <p>Forbidden type</p>,
        [
          { cmp: MockedCmpChild, maxCount: 2 },
          { cmp: MockedCmpAnotherChild, maxCount: 1 },
        ],
        'Mocked Cmp'
      )
    ).toThrowError(
      'Mocked Cmp can have only 2 children of type MockedCmpChild and 1 child of type MockedCmpAnotherChild'
    );
  });

  it('test checkChildren - not required component in children', () => {
    expect(() =>
      checkChildren(
        <MockedCmpChild />,
        [
          { cmp: MockedCmpChild, maxCount: 2 },
          { cmp: MockedCmpAnotherChild, maxCount: 1, required: true },
        ],
        'Mocked Cmp'
      )
    ).toThrowError('Mocked Cmp can have only 1 child of type MockedCmpAnotherChild');
  });

  it('test checkChildren - exceed max number of children of a specific type', () => {
    expect(() =>
      checkChildren(
        [<MockedCmpChild />, <MockedCmpChild />, <MockedCmpChild />],
        [{ cmp: MockedCmpChild, maxCount: 2 }],
        'Mocked Cmp'
      )
    ).toThrowError('Mocked Cmp can have only 2 children of type MockedCmpChild');
  });
});
