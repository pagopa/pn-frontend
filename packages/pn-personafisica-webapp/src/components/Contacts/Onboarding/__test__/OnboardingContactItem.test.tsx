import { vi } from 'vitest';

import { Chip } from '@mui/material';

import { fireEvent, render } from '../../../../__test__/test-utils';
import OnboardingContactItem from '../OnboardingContactItem';

describe('OnboardingContactItem', () => {
  describe('entry mode', () => {
    it('renders the entry content and triggers the provided callbacks', () => {
      const onChange = vi.fn();
      const onBlur = vi.fn();
      const onSubmit = vi.fn();
      const onCollapse = vi.fn();

      const { getByText, getByLabelText, getByRole } = render(
        <OnboardingContactItem
          mode="entry"
          title="mock-title"
          label="mock-label"
          inputLabel="mock-input-label"
          value=""
          buttonLabel="mock-submit"
          error="mock-error"
          touched
          onChange={onChange}
          onBlur={onBlur}
          onSubmit={onSubmit}
          collapse={{
            label: 'mock-collapse',
            onClick: onCollapse,
          }}
          footer="mock-footer"
        />
      );

      expect(getByText('mock-title')).toBeInTheDocument();
      expect(getByText('mock-label')).toBeInTheDocument();
      expect(getByLabelText('mock-input-label')).toBeInTheDocument();
      expect(getByRole('button', { name: 'mock-submit' })).toBeInTheDocument();
      expect(getByText('mock-footer')).toBeInTheDocument();
      expect(getByRole('button', { name: 'mock-collapse' })).toBeInTheDocument();
      expect(getByText('mock-error')).toBeInTheDocument();

      fireEvent.change(getByLabelText('mock-input-label'), {
        target: { value: 'a' },
      });
      expect(onChange).toHaveBeenCalledWith('a');

      fireEvent.blur(getByLabelText('mock-input-label'));
      expect(onBlur).toHaveBeenCalled();

      fireEvent.click(getByRole('button', { name: 'mock-submit' }));
      expect(onSubmit).toHaveBeenCalledTimes(1);

      fireEvent.click(getByRole('button', { name: 'mock-collapse' }));
      expect(onCollapse).toHaveBeenCalledTimes(1);
    });

    it('does not render extra buttons in entry mode when collapse props are not provided', () => {
      const { getByText, getByLabelText, getByRole, getAllByRole } = render(
        <OnboardingContactItem
          mode="entry"
          label="mock-label"
          inputLabel="mock-input-label"
          value=""
          buttonLabel="mock-submit"
          onChange={vi.fn()}
          onSubmit={vi.fn()}
        />
      );

      expect(getByText('mock-label')).toBeInTheDocument();
      expect(getByLabelText('mock-input-label')).toBeInTheDocument();
      expect(getByRole('button', { name: 'mock-submit' })).toBeInTheDocument();

      expect(getAllByRole('button')).toHaveLength(1);
    });
  });

  describe('view mode', () => {
    it('renders intro text, label, value and secondary content', () => {
      const mockEmail = 'mock@pagopa.it';
      const { getByText } = render(
        <OnboardingContactItem
          mode="view"
          introText="mock-intro"
          label="mock-label"
          value={mockEmail}
          secondaryContent={<Chip label="SEND" size="small" />}
        />
      );

      expect(getByText('mock-intro')).toBeInTheDocument();
      expect(getByText('mock-label')).toBeInTheDocument();
      expect(getByText(mockEmail)).toBeInTheDocument();
      expect(getByText('SEND')).toBeInTheDocument();
    });

    it('renders secondary content in view mode even when value is not provided', () => {
      const { getByText } = render(
        <OnboardingContactItem
          mode="view"
          label="mock-label"
          secondaryContent={<Chip label="SEND" size="small" />}
        />
      );

      expect(getByText('mock-label')).toBeInTheDocument();
      expect(getByText('SEND')).toBeInTheDocument();
    });
  });
});
