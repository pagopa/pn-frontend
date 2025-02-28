import { Formik } from 'formik';

import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';
import { fireEvent, getById, render, testFormElements } from '@pagopa-pn/pn-commons/src/test-utils';

import { NewNotificationLangOther, PaymentModel, PreliminaryInformationsPayload } from '../../../models/NewNotification';
import PreliminaryInformationsContent from '../PreliminaryInformationsContent';

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

  it('renders the component', () => {
    const { container } = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsContent
            formik={formik}
            languages={mockLanguages}
            onChangeTouched={mockOnChangeTouched}
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
          />
        )}
      </Formik>
    );

    const subjectInput = getById(container, 'subject');
    fireEvent.change(subjectInput, { target: { value: 'New Subject' } });

    expect(mockOnChangeTouched).toHaveBeenCalled();
  });

  it('displays helper text when subject field is focused', () => {
    const result = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsContent
            formik={formik}
            languages={mockLanguages}
            onChangeTouched={mockOnChangeTouched}
          />
        )}
      </Formik>
    );

    const subjectInput = getById(result.container, 'subject');
    fireEvent.focus(subjectInput);

    expect(result.getByText('too-long-field-error')).toBeInTheDocument();
  });

  it('renders additional language fields when hasOtherLang is true', () => {
    const initialValuesWithOtherLang: PreliminaryInformationsPayload = {
      ...initialValues,
      lang: NewNotificationLangOther,
      additionalLang: 'de',
    };

    const result = render(
      <Formik initialValues={initialValuesWithOtherLang} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsContent
            formik={formik}
            languages={mockLanguages}
            onChangeTouched={mockOnChangeTouched}
          />
        )}
      </Formik>
    );

    expect(result.getByText(mockLanguages.it)).toBeInTheDocument();
    expect(result.getByText(mockLanguages.de)).toBeInTheDocument();

    const additionalSubjectInput = getById(result.container, 'additionalSubject');
    expect(additionalSubjectInput).toBeInTheDocument();

    const additionalAbstractInput = getById(result.container, 'additionalAbstract');
    expect(additionalAbstractInput).toBeInTheDocument();
  });
});
