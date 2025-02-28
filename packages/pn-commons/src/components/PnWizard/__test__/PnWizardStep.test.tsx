import { describe, expect, it } from 'vitest';

import { render } from '../../../test-utils';
import PnWizardStep from '../PnWizardStep';

describe('PnWizardStep Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(<PnWizardStep>Step Content</PnWizardStep>);

    expect(getByText('Step Content')).toBeInTheDocument();
  });
});
