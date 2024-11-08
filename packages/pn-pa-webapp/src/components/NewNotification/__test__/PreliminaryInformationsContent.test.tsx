import { Formik } from 'formik';
import { vi } from 'vitest';

import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';
import {
  fireEvent,
  getById,
  getByText,
  render,
  testFormElements,
} from '@pagopa-pn/pn-commons/src/test-utils';

import { NewNotificationLangOther, PaymentModel } from '../../../models/NewNotification';
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
  const initialValues: PreliminaryInformationsPayload = {
    lang: 'it',
    additionalLang: '',
    paymentMode: PaymentModel.NOTHING,
    paProtocolNumber: '',
    subject: '',
    physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
    taxonomyCode: '',
  };

  const mockLanguages = {
    it: 'Italiano',
    de: 'Tedesco',
  };

  const mockOnChangeTouched = jest.fn();
  const mockSubjectHelperText = 'Helper text for subject';

  it('renders the component', () => {
    const { container } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsContent
            formik={formik}
            languages={mockLanguages}
            onChangeTouched={mockOnChangeTouched}
            subjectHelperText={mockSubjectHelperText}
          />
        )}
      </Formik>
    );

    testFormElements(container, 'subject', 'subject*');
    testFormElements(container, 'abstract', 'abstract');
  });

  it('calls onChangeTouched when subject field changes', () => {
    const { container } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsContent
            formik={formik}
            languages={mockLanguages}
            onChangeTouched={mockOnChangeTouched}
            subjectHelperText={mockSubjectHelperText}
          />
        )}
      </Formik>
    );

    const subjectInput = getById(container, 'subject');
    fireEvent.change(subjectInput, { target: { value: 'New Subject' } });

    expect(mockOnChangeTouched).toHaveBeenCalled();
  });

  it('displays helper text when subject field is focused', () => {
    const { container } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsContent
            formik={formik}
            languages={mockLanguages}
            onChangeTouched={mockOnChangeTouched}
            subjectHelperText={mockSubjectHelperText}
          />
        )}
      </Formik>
    );

    const subjectInput = getById(container, 'subject');
    fireEvent.focus(subjectInput);

    expect(getByText(container, mockSubjectHelperText)).toBeInTheDocument();
  });

  it('renders additional language fields when hasOtherLang is true', () => {
    const initialValuesWithOtherLang: PreliminaryInformationsPayload = {
      ...initialValues,
      lang: NewNotificationLangOther,
      additionalLang: 'de',
    };

    const { container } = render(
      <Formik initialValues={initialValuesWithOtherLang} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsContent
            formik={formik}
            languages={mockLanguages}
            onChangeTouched={mockOnChangeTouched}
            subjectHelperText={mockSubjectHelperText}
          />
        )}
      </Formik>
    );

    expect(getByText(container, mockLanguages.it)).toBeInTheDocument();
    expect(getByText(container, mockLanguages.de)).toBeInTheDocument();

    const additionalSubjectInput = getById(container, 'additionalSubject');
    expect(additionalSubjectInput).toBeInTheDocument();

    const additionalAbstractInput = getById(container, 'additionalAbstract');
    expect(additionalAbstractInput).toBeInTheDocument();
  });
});
