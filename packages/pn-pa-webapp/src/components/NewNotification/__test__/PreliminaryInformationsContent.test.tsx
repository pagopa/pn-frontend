import { Formik, FormikProps } from 'formik';
import { vi } from 'vitest';

import {
  fireEvent,
  getById,
  getByText,
  render,
  testFormElements,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { NewNotificationLangOther } from '../../../models/NewNotification';
import { PreliminaryInformationsPayload } from '../../../redux/newNotification/types';
import PreliminaryInformationsContent from '../PreliminaryInformationsContent';

// mock imports
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
    i18n: { language: 'it' },
  }),
}));

describe('PreliminaryInformationsContent', () => {
  const mockFormikProps = {
    values: {
      lang: 'it',
      subject: '',
      abstract: '',
      additionalLang: '',
      additionalSubject: '',
      additionalAbstract: '',
    },
    touched: {},
    errors: {},
    handleChange: jest.fn(),
  } as unknown as FormikProps<PreliminaryInformationsPayload>;

  const mockLanguages = {
    it: 'Italiano',
    de: 'Tedesco',
  };

  const mockOnChangeTouched = jest.fn();
  const mockSubjectHelperText = 'Helper text for subject';

  it('renders the component', () => {
    const { container } = render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikProps}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    testFormElements(container, 'subject', 'subject*');
    testFormElements(container, 'abstract', 'abstract');
  });

  it('calls onChangeTouched when subject field changes', () => {
    const { container } = render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikProps}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    const subjectInput = getById(container, 'subject');
    fireEvent.change(subjectInput, { target: { value: 'New Subject' } });

    expect(mockOnChangeTouched).toHaveBeenCalled();
  });

  it('displays helper text when subject field is focused', () => {
    const { container } = render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikProps}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    const subjectInput = getById(container, 'subject');
    fireEvent.focus(subjectInput);

    expect(getByText(container, mockSubjectHelperText)).toBeInTheDocument();
  });

  it('renders additional language fields when hasOtherLang is true', () => {
    const mockFormikPropsWithOtherLang = {
      ...mockFormikProps,
      values: {
        ...mockFormikProps.values,
        lang: NewNotificationLangOther,
        additionalLang: 'de',
      },
    } as unknown as FormikProps<PreliminaryInformationsPayload>;

    const { container } = render(
      <Formik initialValues={mockFormikPropsWithOtherLang.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikPropsWithOtherLang}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    expect(getByText(container, mockLanguages.it!)).toBeInTheDocument();
    expect(getByText(container, mockLanguages.de!)).toBeInTheDocument();

    const additionalSubjectInput = getById(container, 'additionalSubject');
    expect(additionalSubjectInput).toBeInTheDocument();

    const additionalAbstractInput = getById(container, 'additionalAbstract');
    expect(additionalAbstractInput).toBeInTheDocument();
  });
});
