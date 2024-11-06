import { Formik, FormikProps } from 'formik';
import { vi } from 'vitest';

import {
  fireEvent,
  getById,
  render,
  screen,
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
    const result = render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikProps}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    testFormElements(result.container, 'subject', 'subject*');
    testFormElements(result.container, 'abstract', 'abstract');
  });

  it('calls onChangeTouched when subject field changes', () => {
    const result = render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikProps}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    const subjectInput = getById(result.container, 'subject');
    fireEvent.change(subjectInput, { target: { value: 'New Subject' } });

    expect(mockOnChangeTouched).toHaveBeenCalled();
  });

  it('displays helper text when subject field is focused', () => {
    const result = render(
      <Formik initialValues={mockFormikProps.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikProps}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    const subjectInput = getById(result.container, 'subject');
    fireEvent.focus(subjectInput);

    expect(screen.getByText(mockSubjectHelperText)).toBeInTheDocument();
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

    const result = render(
      <Formik initialValues={mockFormikPropsWithOtherLang.values} onSubmit={() => {}}>
        <PreliminaryInformationsContent
          formik={mockFormikPropsWithOtherLang}
          languages={mockLanguages}
          onChangeTouched={mockOnChangeTouched}
          subjectHelperText={mockSubjectHelperText}
        />
      </Formik>
    );

    expect(screen.getByText(mockLanguages.it!)).toBeInTheDocument();
    expect(screen.getByText(mockLanguages.de!)).toBeInTheDocument();

    const additionalSubjectInput = getById(result.container, 'additionalSubject');
    expect(additionalSubjectInput).toBeInTheDocument();

    const additionalAbstractInput = getById(result.container, 'additionalAbstract');
    expect(additionalAbstractInput).toBeInTheDocument();
  });


});
