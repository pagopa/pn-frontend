import MockAdapter from 'axios-mock-adapter';
import { vi } from 'vitest';

import { TextField } from '@mui/material';

import {
  RenderResult,
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test__/test-utils';
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

const mockOnConfirm = vi.fn();
const mockResetModifyValue = vi.fn();

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

describe('DeleteDialogModal Component', () => {
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
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveTextContent('mocked-title');
    expect(dialog).toHaveTextContent('mocked-body');
    let dialogButtons = dialog?.querySelectorAll('button');
    expect(dialogButtons).toHaveLength(2);
    expect(dialogButtons[0]).toHaveTextContent('button.annulla');
    expect(dialogButtons[1]).toHaveTextContent('button.conferma');
  });

  it('remove contact', async () => {
    mock.onDelete('/bff/v1/addresses/LEGAL/mocked-senderId/PEC').reply(204);
    // render component
    act(() => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog?.querySelectorAll('button');
    expect(dialogButtons[1]).toHaveTextContent('button.conferma');
    // click on confirm
    fireEvent.click(dialogButtons![1]);
    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    });
  });

  it('delete contacts blocked', async () => {
    // render component
    act(() => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            senderId="mocked-senderId"
            value="mocked@pec.it"
            contactType={LegalChannelType.PEC}
            onConfirmClick={mockOnConfirm}
            resetModifyValue={mockResetModifyValue}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    let dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();
    let dialogButtons = dialog?.querySelectorAll('button');
    expect(dialogButtons[1]).toHaveTextContent('button.conferma');
    fireEvent.click(buttons![1]);
    expect(dialogButtons).toHaveLength(1);
    expect(dialogButtons[0]).toHaveTextContent('button.close');
  });
});
