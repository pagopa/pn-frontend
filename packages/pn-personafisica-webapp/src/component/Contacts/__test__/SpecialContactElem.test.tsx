import { act, RenderResult } from '@testing-library/react';

import { axe, render } from '../../../__test__/test-utils';
import { DigitalContactsCodeVerificationProvider } from '../DigitalContactsCodeVerification.context';
import SpecialContactElem from '../SpecialContactElem';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
  Trans: (props: { i18nKey: string }) => props.i18nKey,
}));

describe('SpecialContactElem Component', () => {
  // eslint-disable-next-line functional/no-let
  let result: RenderResult | undefined;

  beforeEach(async () => {
    // render component
    await act(async () => {
      result = render(
        <DigitalContactsCodeVerificationProvider>
          <SpecialContactElem
            address={{
              senderId: 'mocked-senderId',
              mail: 'mocked@mail.it',
              pec: 'mocked@pec.it',
            }}
            senders={[{ id: 'mocked-senderId', name: 'Mocked Sender' }]}
            recipientId="mocked-recipientId"
          />
        </DigitalContactsCodeVerificationProvider>
      );
    });
  });

  afterEach(() => {
    result = undefined;
  });

  it('renders SpecialContactElem', () => {
    expect(result?.container).toHaveTextContent('Mocked Sender');
    const specialContactForms = result?.queryAllByTestId('specialContactForm');
    expect(specialContactForms).toHaveLength(2);
    expect(specialContactForms![0]).toHaveTextContent('mocked@pec.it');
    expect(result?.container).toHaveTextContent('-');
    expect(specialContactForms![1]).toHaveTextContent('mocked@mail.it');
    const firstFormButtons = specialContactForms![0].querySelectorAll('button');
    expect(firstFormButtons).toHaveLength(2);
    expect(firstFormButtons[0]).toHaveTextContent('button.modifica');
    expect(firstFormButtons[1]).toHaveTextContent('button.rimuovi');
    const secondFormButtons = specialContactForms![1].querySelectorAll('button');
    expect(secondFormButtons).toHaveLength(2);
    expect(secondFormButtons[0]).toHaveTextContent('button.modifica');
    expect(secondFormButtons[1]).toHaveTextContent('button.rimuovi');
  });

  it('does not have basic accessibility issues', async () => {
    if (result) {
      const res = await axe(result.container);
      expect(res).toHaveNoViolations();
    } else {
      fail('render() returned undefined!');
    }
  });
});
