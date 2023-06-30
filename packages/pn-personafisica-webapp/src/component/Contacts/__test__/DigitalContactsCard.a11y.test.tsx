import * as React from 'react';
import { axe, render } from '../../../__test__/test-utils';
import DigitalContactsCard from '../DigitalContactsCard';

const title = 'Mocked title';
const subTitle = 'Mocked subtitle';
const actions = <button>Click me</button>;
const body = <div data-testid="body">Body</div>;

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('DigitalContactsCard Component - accessibility tests', () => {
  it('does not have basic accessibility issues', async () => {
    const { container } = render(
      <DigitalContactsCard
        sectionTitle={'mocked-sectionTitle'}
        title={title}
        subtitle={subTitle}
        actions={actions}
        avatar="avatar"
      >
        {body}
      </DigitalContactsCard>
    );
    const result = await axe(container);
    expect(result).toHaveNoViolations();
  });
});
