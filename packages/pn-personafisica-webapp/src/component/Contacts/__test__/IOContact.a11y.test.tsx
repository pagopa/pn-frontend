import * as React from 'react';
import { axe, render } from "../../../__test__/test-utils";

import { CourtesyChannelType, IOAllowedValues } from "../../../models/contacts";
import IOContact from "../IOContact";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: () => 'mocked verify description',
}));

const addressTemplate = {
  addressType: 'courtesy',
  recipientId: 'mocked-recipientId',
  senderId: 'default',
  channelType: CourtesyChannelType.IOMSG,
  value: IOAllowedValues.DISABLED,
  code: '00000'
};

describe('IOContact component - accessibility tests', () => {
  it('when IO is unavailable - does not have basic accessibility issues', async () => {
    const result = render(<IOContact recipientId="mocked-recipientId" contact={undefined} />);
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });

  it('when IO is available and disabled - does not have basic accessibility issues', async () => {
    const result = render(<IOContact 
      recipientId="mocked-recipientId" 
      contact={{...addressTemplate, value: IOAllowedValues.DISABLED}} />
    );
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });

  it('when IO is available and enabled - does not have basic accessibility issues', async () => {
    const result = render(<IOContact 
      recipientId="mocked-recipientId" 
      contact={{...addressTemplate, value: IOAllowedValues.ENABLED}} />
    );
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail("render() returned undefined!");
    }
  });
});

