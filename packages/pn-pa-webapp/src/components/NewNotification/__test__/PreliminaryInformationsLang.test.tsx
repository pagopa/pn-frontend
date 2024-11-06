import { Formik, FormikProps } from 'formik';
import { vi } from 'vitest';

import {
  act,
  fireEvent,
  getById,
  getByText,
  render,
  screen,
  testInput,
  testRadio,
  within,
} from '@pagopa-pn/pn-commons/src/test-utils';
import { LangLabels } from '@pagopa/mui-italia';
import userEvent from '@testing-library/user-event';

import { PreliminaryInformationsPayload } from '../../../redux/newNotification/types';
import PreliminaryInformationsLang from '../PreliminaryInformationsLang';

// mock imports
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

const mockFormikProps = {
  values: {
    lang: 'it',
    additionalLang: '',
  },
  handleChange: jest.fn(),
  setFieldTouched: jest.fn(),
} as unknown as FormikProps<PreliminaryInformationsPayload>;

const mockLanguages: LangLabels = {
  it: 'Italiano',
  de: 'Tedesco',
};

const mockOnChange = jest.fn();
const mockOnChangeTouched = jest.fn();

describe('PreliminaryInformationsLang', () => {
  it('renders correctly with initial values', async () => {
    const result = render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsLang
          formik={mockFormikProps}
          languages={mockLanguages}
          onChange={mockOnChange}
          onChangeTouched={mockOnChangeTouched}
        />
      </Formik>
    );
    const title = getByText(result.container, 'notification-language-title');
    expect(title).toBeInTheDocument();

    await testRadio(
      result.container,
      'notificationLanguageRadio',
      ['Italiano', 'italian-and-other-language'],
      0
    );
  });

  it('calls onChange when language is changed', () => {
    render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsLang
          formik={mockFormikProps}
          languages={mockLanguages}
          onChange={mockOnChange}
          onChangeTouched={mockOnChangeTouched}
        />
      </Formik>
    );
    fireEvent.click(screen.getByLabelText('italian-and-other-language'));
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders additional language dropdown when "Italian and other language" is selected', () => {
    const updatedFormikProps = {
      ...mockFormikProps,
      values: {
        ...mockFormikProps.values,
        lang: 'other',
      },
    } as unknown as FormikProps<PreliminaryInformationsPayload>;

    render(
      <Formik initialValues={updatedFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsLang
          formik={updatedFormikProps}
          languages={mockLanguages}
          onChange={mockOnChange}
          onChangeTouched={mockOnChangeTouched}
        />
      </Formik>
    );

    expect(screen.getByLabelText('select-other-language*')).toBeInTheDocument();
  });

  it('calls onChangeTouched when additional language is changed', async () => {
    const updatedFormikProps = {
      ...mockFormikProps,
      values: {
        ...mockFormikProps.values,
        lang: 'other',
      },
    } as unknown as FormikProps<PreliminaryInformationsPayload>;

    const result = render(
      <Formik initialValues={updatedFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsLang
          formik={updatedFormikProps}
          languages={mockLanguages}
          onChange={mockOnChange}
          onChangeTouched={mockOnChangeTouched}
        />
      </Formik>
    );

    const selectAdditionalLang = getById(result.container, 'additionalLang');
    expect(selectAdditionalLang).toBeInTheDocument();

    userEvent.click(selectAdditionalLang);

    await act(async () => {
      // time to appear the dropdown
      await new Promise((r) => setTimeout(r, 500));
    });

    const dropdown = document.querySelector('#menu-additionalLang') as HTMLElement;
    expect(dropdown).toBeInTheDocument();

    const frOption = within(dropdown).getByText('Tedesco');
    userEvent.click(frOption);

    await testInput(result.container, 'additionalLang', 'de');

    expect(mockOnChangeTouched).toHaveBeenCalled();
  });
});
