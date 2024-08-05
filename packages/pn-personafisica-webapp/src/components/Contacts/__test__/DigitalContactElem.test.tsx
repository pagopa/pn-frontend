import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { TextField } from '@mui/material';

import { RenderResult, act, fireEvent, render, waitFor } from '../../../__test__/test-utils';
import { apiClient } from '../../../api/apiClients';
import { LegalChannelType } from '../../../models/contacts';
import DigitalContactElem from '../DigitalContactElem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const fields = [
  {
    id: 'label',
    component: 'PEC',
    size: 'variable' as 'variable' | 'auto',
    key: 'key-label',
  },
  {
    id: 'value',
    key: 'key-value',
    component: (
      <TextField
        id="pec"
        fullWidth
        name="pec"
        label="PEC"
        variant="outlined"
        size="small"
        value="mocked@pec.it"
        data-testid="field"
      />
    ),
    size: 'auto' as 'variable' | 'auto',
    isEditable: true,
  },
];

const mockResetModifyValue = vi.fn();
const mockDeleteCbk = vi.fn();
const mockOnConfirm = vi.fn();

/*
In questo test viene testato solo il rendering dei componenti e non il flusso.
Il flusso completo viene testato nei singoli componenti, dove si potrà testare anche il cambio di stato di redux e le api.
Per questo motivo non è necessario mockare le api, ma va bene anche usare lo spyOn.

Andrea Cimini - 6/09/2023
*/
describe('DigitalContactElem Component', () => {
  let result: RenderResult | undefined;
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    result = undefined;
    vi.clearAllMocks();
    mock.reset();
  });

  afterAll(() => {
    vi.restoreAllMocks();
    mock.restore();
  });

  it('renders component', async () => {
    // render component
    act(() => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            onDelete={mockDeleteCbk}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    expect(result?.container).toHaveTextContent('PEC');
    expect(result?.container).toHaveTextContent('mocked@pec.it');
    const input = result?.queryByTestId('field');
    expect(input).not.toBeInTheDocument();
    const buttons = result?.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![1]).toHaveTextContent('button.elimina');
  });

  it('edits contact', async () => {
    mock
      .onPost('/bff/v1/addresses/LEGAL/mocked-senderId/PEC', {
        value: 'mocked@pec.it',
      })
      .reply(200, {
        result: 'PEC_VALIDATION_REQUIRED',
      });
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            onDelete={mockDeleteCbk}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    let input = await waitFor(() => result?.container.querySelector('[name="pec"]'));
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('mocked@pec.it');
    const newButtons = result?.container.querySelectorAll('button');
    expect(newButtons).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![1]).toHaveTextContent('button.annulla');
    // cancel edit
    fireEvent.click(newButtons![1]);
    await waitFor(() => {
      expect(mockResetModifyValue).toBeCalledTimes(1);
    });
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    // confirm edit
    fireEvent.click(buttons![0]);
    input = await waitFor(() => result?.container.querySelector('[name="pec"]'));
    fireEvent.click(newButtons![0]);
    await waitFor(() => {
      expect(input).not.toBeInTheDocument();
    });
    await waitFor(() => {
      expect(mockOnConfirm).toBeCalledTimes(1);
    });
  });

  it('remove contact', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/mocked-senderId/PEC').reply(204);
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            onDelete={mockDeleteCbk}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    expect(mockDeleteCbk).toHaveBeenCalledTimes(1);
  });

  it('save disabled', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            saveDisabled
            onDelete={mockDeleteCbk}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const newButtons = await waitFor(() => result?.container.querySelectorAll('button'));
    expect(newButtons).toHaveLength(2);
    expect(newButtons![0]).toHaveTextContent('button.salva');
    expect(newButtons![0]).toBeDisabled();
    expect(newButtons![1]).toHaveTextContent('button.annulla');
  });

  it('edit disabled', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
            editDisabled
            onDelete={mockDeleteCbk}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
    expect(buttons![0]).toHaveTextContent('button.modifica');
    expect(buttons![0]).toBeDisabled();
    expect(buttons![1]).toHaveTextContent('button.elimina');
  });
});
