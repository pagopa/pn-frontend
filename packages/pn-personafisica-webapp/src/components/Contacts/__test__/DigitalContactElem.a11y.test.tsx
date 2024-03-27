import { vi } from 'vitest';

import { TextField } from '@mui/material';

import {
  RenderResult,
  act,
  axe,
  fireEvent,
  render,
  screen,
  waitFor,
} from '../../../__test__/test-utils';
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

describe('DigitalContactElem Component - accessibility tests', () => {
  let result: RenderResult | undefined;

  it('does not have basic accessibility issues', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked-value"
            contactType={LegalChannelType.PEC}
            onConfirmClick={() => {}}
            resetModifyValue={() => {}}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues - edit mode', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked-value"
            contactType={LegalChannelType.PEC}
            onConfirmClick={() => {}}
            resetModifyValue={() => {}}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![0]);
    const input = await waitFor(() => result?.container.querySelector('[name="pec"]'));
    expect(input).toBeInTheDocument();

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('does not have basic accessibility issues - delete contact', async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <DigitalContactElem
            fields={fields}
            removeModalTitle="mocked-title"
            removeModalBody="mocked-body"
            recipientId="mocked-recipientId"
            senderId="mocked-senderId"
            value="mocked-value"
            contactType={LegalChannelType.PEC}
            onConfirmClick={() => {}}
            resetModifyValue={() => {}}
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
    const buttons = result?.container.querySelectorAll('button');
    fireEvent.click(buttons![1]);
    const dialog = await waitFor(() => screen.getByRole('dialog'));
    expect(dialog).toBeInTheDocument();

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
