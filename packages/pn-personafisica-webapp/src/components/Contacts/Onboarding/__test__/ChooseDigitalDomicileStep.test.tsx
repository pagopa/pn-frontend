import { vi } from 'vitest';

import { fireEvent, render } from '../../../../__test__/test-utils';
import ChooseDigitalDomicileStep from '../ChooseDigitalDomicileStep';

describe('ChooseDigitalDomicileStep', () => {
  const labelPrefix = 'onboarding.digital-domicile.choice';

  it('renders SEND and PEC CTAs when PEC activation is not in progress and triggers callbacks', () => {
    const onSelectSend = vi.fn();
    const onSelectPec = vi.fn();

    const { getByText, getByRole, queryByText } = render(
      <ChooseDigitalDomicileStep
        onSelectSend={onSelectSend}
        onSelectPec={onSelectPec}
        isPecActivating={false}
      />
    );

    expect(getByText(`${labelPrefix}.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.description`)).toBeInTheDocument();

    expect(getByRole('button', { name: `${labelPrefix}.cta` })).toBeInTheDocument();
    expect(getByRole('button', { name: `${labelPrefix}.pec.cta` })).toBeInTheDocument();

    expect(queryByText(`${labelPrefix}.pec-activating.title`)).not.toBeInTheDocument();
    expect(queryByText(`${labelPrefix}.pec.activating.badge`)).not.toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.cta` }));
    expect(onSelectSend).toHaveBeenCalledTimes(1);

    fireEvent.click(getByRole('button', { name: `${labelPrefix}.pec.cta` }));
    expect(onSelectPec).toHaveBeenCalledTimes(1);
  });

  it('renders the PEC activating content and hides the standard CTAs when PEC activation is in progress', () => {
    const onSelectSend = vi.fn();
    const onSelectPec = vi.fn();

    const { getByText, queryByRole } = render(
      <ChooseDigitalDomicileStep
        onSelectSend={onSelectSend}
        onSelectPec={onSelectPec}
        isPecActivating
      />
    );

    expect(getByText(`${labelPrefix}.pec-activating.title`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pec-activating.description`)).toBeInTheDocument();
    expect(getByText(`${labelPrefix}.pec-activating.badge`)).toBeInTheDocument();

    expect(queryByRole('button', { name: `${labelPrefix}.cta` })).not.toBeInTheDocument();
    expect(queryByRole('button', { name: `${labelPrefix}.pec.cta` })).not.toBeInTheDocument();

    expect(onSelectSend).not.toHaveBeenCalled();
    expect(onSelectPec).not.toHaveBeenCalled();
  });
});
