import { fireEvent, RenderResult } from '@testing-library/react';
import { render } from '../../../__test__/test-utils';
import ConfirmationModal from '../ConfirmationModal';

jest.mock('@pagopa-pn/pn-commons', () => {
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  const original = jest.requireActual('@pagopa-pn/pn-commons');
  return {
    ...original,
    useIsMobile: () => false,
  };
});

const mockCancelFunction = jest.fn();
const mockConfirmFunction = jest.fn();

describe('ConfirmationModal Component', () => {
  // eslint-disable-next-line
  let result: RenderResult | undefined;

  beforeEach(() => {
    result = render(
      <ConfirmationModal
        open={true}
        title={'Test Title'}
        handleClose={mockCancelFunction}
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Conferma'}
        onCloseLabel={'Annulla'}
      />
    );
  });

  afterEach(() => {
    result = undefined;
    jest.resetAllMocks();
  });

  it('renders the component', () => {
    const dialog = result!.queryByRole('dialog');

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    expect(dialog).toHaveTextContent(/Conferma/i);
    expect(dialog).toHaveTextContent(/Annulla/i);
  });

  it('checks that the confirm function is executed', () => {
    const confirm = result!.queryAllByTestId('dialogAction')[1];
    expect(confirm).toBeInTheDocument();
    expect(confirm).toHaveTextContent(/Conferma/i);

    fireEvent.click(confirm);
    expect(mockConfirmFunction).toBeCalledTimes(1);
  });

  it('checks that the cancel function is executed', () => {
    const cancel = result!.queryAllByTestId('dialogAction')[0];
    expect(cancel).toBeInTheDocument();
    expect(cancel).toHaveTextContent(/Annulla/i);

    fireEvent.click(cancel);
    expect(mockCancelFunction).toBeCalledTimes(1);
  });
});
