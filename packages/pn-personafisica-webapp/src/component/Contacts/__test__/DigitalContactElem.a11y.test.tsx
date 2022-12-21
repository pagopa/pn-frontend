import * as React from 'react';
import { TextField } from '@mui/material';

import { LegalChannelType } from '../../../models/contacts';
import { axe, render } from '../../../__test__/test-utils';
import DigitalContactElem from '../DigitalContactElem';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
      t: (str: string) => str,
    }),
  Trans: (props: {i18nKey: string}) => props.i18nKey,
}));

const fields = [
  {
    id: '1',
    component: 'Campo 1',
    size: 'variable' as 'variable' | 'auto',
  },
  {
    id: '2',
    component: (
      <TextField
        id="campo-2"
        fullWidth
        name="campo-2"
        label="campo-2"
        variant="outlined"
        size="small"
        value="Campo 2"
        data-testid="field"
      ></TextField>
    ),
    size: 'auto' as 'variable' | 'auto',
    isEditable: true,
  },
];

describe('DigitalContactElem Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    const result = render(
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
        />
      </DigitalContactsCodeVerificationProvider>
    );

    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});
