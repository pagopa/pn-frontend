import { fireEvent } from '@testing-library/react';
import * as hooks from '@pagopa-pn/pn-commons/src/hooks/IsMobile.hook';
import { render } from '../../../__test__/test-utils';

import ConfirmationModal from '../ConfirmationModal';

const useIsMobileSpy = jest.spyOn(hooks, 'useIsMobile');

const mockCancelFunction = jest.fn();
const mockConfirmFunction = jest.fn();

describe('ConfirmationModal Component', () => {
  afterEach(() => {
    useIsMobileSpy.mockClear();
    useIsMobileSpy.mockReset();
  });

  it('renders the component', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(
      <ConfirmationModal
        open={true}
        title={'Test Title'}
        handleClose={mockCancelFunction}
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Conferma'}
        onCloseLabel={'Annulla'}
      />
    );
    const dialog = result!.queryByRole('dialog');

    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent(/Test Title/i);
    expect(dialog).toHaveTextContent(/Conferma/i);
    expect(dialog).toHaveTextContent(/Annulla/i);
  });

  it('checks that the confirm and cancel functions are executed', () => {
    useIsMobileSpy.mockReturnValue(false);
    const result = render(
      <ConfirmationModal
        open={true}
        title={'Test Title'}
        handleClose={mockCancelFunction}
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Conferma'}
        onCloseLabel={'Cancella'}
      />
    );
    const confirm = result!.queryAllByTestId('dialogAction')[1];
    const cancel = result!.queryAllByTestId('dialogAction')[0];
    expect(confirm).toHaveTextContent(/Conferma/i);
    expect(cancel).toHaveTextContent(/Cancella/i);

    fireEvent.click(confirm);
    expect(mockConfirmFunction).toBeCalledTimes(1);

    fireEvent.click(cancel);
    expect(mockCancelFunction).toBeCalledTimes(1);
  });

  it('renders the dialog with default labels', () => {
    useIsMobileSpy.mockReturnValue(false);

    const result = render(
      <ConfirmationModal
        open={true}
        title={'Test Title'}
        handleClose={mockCancelFunction}
        onConfirm={mockConfirmFunction}
      />
    );
    const confirm = result!.queryAllByTestId('dialogAction')[1];
    const cancel = result!.queryAllByTestId('dialogAction')[0];
    expect(confirm).toHaveTextContent(/Riprova/i);
    expect(cancel).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog with no confirm button', () => {
    useIsMobileSpy.mockReturnValue(false);

    const result = render(
      <ConfirmationModal
        open={true}
        title={'Test Title'}
        handleClose={mockCancelFunction}
        onConfirm={mockConfirmFunction}
      />
    );
    const cancel = result!.queryAllByTestId('dialogAction')[0];
    expect(cancel).toHaveTextContent(/Annulla/i);
  });

  it('renders the dialog closed', () => {
    useIsMobileSpy.mockReturnValue(false);

    const result = render(
      <ConfirmationModal
        open={false}
        title={'Test Title'}
        handleClose={mockCancelFunction}
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Conferma'}
        onCloseLabel={'Annulla'}
      />
    );
    const dialog = result!.queryByRole('dialog');

    expect(dialog).toBeNull();
  });

  it('renders the mobile view of the dialog', () => {
    useIsMobileSpy.mockReturnValue(true);

    const result = render(
      <ConfirmationModal
        open={true}
        title={'Test Title'}
        handleClose={mockCancelFunction}
        onConfirm={mockConfirmFunction}
        onConfirmLabel={'Conferma'}
        onCloseLabel={'Annulla'}
        minHeight={'6em'}
        width={'20em'}
      />
    );
    const buttons = result!.queryAllByTestId('dialogAction');
    const dialog = result!.queryByRole('dialog');
    const stack = result.queryByTestId('dialogStack');

    expect(dialog).toBeInTheDocument();
    expect(buttons).toHaveLength(2);
    expect(stack).toHaveStyle('flex-direction: column');
  });
});
