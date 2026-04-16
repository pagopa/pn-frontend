import { describe, expect, it, vi } from 'vitest';

import { Chip } from '@mui/material';

import { fireEvent, render, screen } from '../../../../__test__/test-utils';
import OnboardingContactItem from '../OnboardingContactItem';

describe('OnboardingContactItem', () => {
  describe('entry mode', () => {
    it('renders the entry content and triggers the provided callbacks', () => {
      const onChange = vi.fn();
      const onBlur = vi.fn();
      const onSubmit = vi.fn();
      const onCollapse = vi.fn();

      render(
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

      expect(screen.getByText('mock-title')).toBeInTheDocument();
      expect(screen.getByText('mock-label')).toBeInTheDocument();
      expect(screen.getByLabelText('mock-input-label')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'mock-submit' })).toBeInTheDocument();
      expect(screen.getByText('mock-footer')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'mock-collapse' })).toBeInTheDocument();
      expect(screen.getByText('mock-error')).toBeInTheDocument();

      fireEvent.change(screen.getByLabelText('mock-input-label'), {
        target: { value: 'a' },
      });
      expect(onChange).toHaveBeenCalledWith('a');

      fireEvent.blur(screen.getByLabelText('mock-input-label'));
      expect(onBlur).toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'mock-submit' }));
      expect(onSubmit).toHaveBeenCalledTimes(1);

      fireEvent.click(screen.getByRole('button', { name: 'mock-collapse' }));
      expect(onCollapse).toHaveBeenCalledTimes(1);
    });

    it('does not render extra buttons in entry mode when collapse props are not provided', () => {
      render(
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

      expect(screen.getByText('mock-label')).toBeInTheDocument();
      expect(screen.getByLabelText('mock-input-label')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'mock-submit' })).toBeInTheDocument();

      expect(screen.getAllByRole('button')).toHaveLength(1);
    });
  });

  describe('view mode', () => {
    it('renders intro text, label, value and secondary content', () => {
      render(
        <OnboardingContactItem
          mode="view"
          introText="mock-intro"
          label="mock-label"
          value="user@example.com"
          secondaryContent={<Chip label="SEND" size="small" />}
        />
      );

      expect(screen.getByText('mock-intro')).toBeInTheDocument();
      expect(screen.getByText('mock-label')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
      expect(screen.getByText('SEND')).toBeInTheDocument();
    });

    it('renders secondary content in view mode even when value is not provided', () => {
      render(
        <OnboardingContactItem
          mode="view"
          label="mock-label"
          secondaryContent={<Chip label="SEND" size="small" />}
        />
      );

      expect(screen.getByText('mock-label')).toBeInTheDocument();
      expect(screen.getByText('SEND')).toBeInTheDocument();
    });
  });
});
