import { vi } from 'vitest';

import { digitalAddresses } from '../../../__mocks__/Contacts.mock';
import { axe, render } from '../../../__test__/test-utils';
import { CourtesyChannelType, IOAllowedValues } from '../../../models/contacts';
import IOContact from '../IOContact';

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

const IOAddress = digitalAddresses.courtesy.find(
  (addr) => addr.channelType === CourtesyChannelType.IOMSG
);

describe('IOContact component - accessibility tests', () => {
  it('when there are no contacts - does not have basic accessibility issues', async () => {
    const result = render(<IOContact recipientId="mocked-recipientId" contact={null} />);
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('when IO is unavailable - does not have basic accessibility issues', async () => {
    const result = render(<IOContact recipientId="mocked-recipientId" contact={undefined} />);
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('when IO is available and disabled - does not have basic accessibility issues', async () => {
    const result = render(<IOContact recipientId="mocked-recipientId" contact={IOAddress} />);
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });

  it('when IO is available and enabled - does not have basic accessibility issues', async () => {
    const result = render(
      <IOContact
        recipientId="mocked-recipientId"
        contact={{ ...IOAddress!, value: IOAllowedValues.ENABLED }}
      />
    );
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
