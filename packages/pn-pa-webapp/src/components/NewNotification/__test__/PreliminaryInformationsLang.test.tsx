import { Formik } from 'formik';

import { PhysicalCommunicationType } from '@pagopa-pn/pn-commons';
import {
  fireEvent,
  getById,
  render,
  testInput,
  testRadio,
  waitFor,
  within,
} from '@pagopa-pn/pn-commons/src/test-utils';
import { LangLabels } from '@pagopa/mui-italia';
import userEvent from '@testing-library/user-event';

import { PaymentModel, PreliminaryInformationsPayload } from '../../../models/NewNotification';
import PreliminaryInformationsLang from '../PreliminaryInformationsLang';

describe('PreliminaryInformationsLang', () => {
  const initialValues: PreliminaryInformationsPayload = {
    lang: 'it',
    additionalLang: '',
    paymentMode: PaymentModel.NOTHING,
    paProtocolNumber: '',
    subject: '',
    physicalCommunicationType: PhysicalCommunicationType.AR_REGISTERED_LETTER,
    taxonomyCode: '',
  };

  const mockLanguages: LangLabels = {
    it: 'Italiano',
    de: 'Tedesco',
  };

  const mockOnChange = jest.fn();
  const mockOnChangeTouched = jest.fn();

  it('renders correctly with initial values', async () => {
    const result = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsLang
            formik={formik}
            languages={mockLanguages}
            onChange={mockOnChange}
            onChangeTouched={mockOnChangeTouched}
          />
        )}
      </Formik>
    );
    const title = result.getByText('notification-language-title');
    expect(title).toBeInTheDocument();

    await testRadio(
      result.container,
      'notificationLanguageRadio',
      ['Italiano', 'italian-and-other-language'],
      0
    );
  });

  it('calls onChange when language is changed', () => {
    const result = render(
      <Formik initialValues={initialValues} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsLang
            formik={formik}
            languages={mockLanguages}
            onChange={mockOnChange}
            onChangeTouched={mockOnChangeTouched}
          />
        )}
      </Formik>
    );
    const radioInput = result.getByText('italian-and-other-language');
    fireEvent.click(radioInput);
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('renders additional language dropdown when "Italian and other language" is selected', () => {
    const initialValuesLangOther: PreliminaryInformationsPayload = {
      ...initialValues,
      lang: 'other',
    };

    const result = render(
      <Formik initialValues={initialValuesLangOther} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsLang
            formik={formik}
            languages={mockLanguages}
            onChange={mockOnChange}
            onChangeTouched={mockOnChangeTouched}
          />
        )}
      </Formik>
    );

    expect(getById(result.container, 'additionalLang')).toBeInTheDocument();
  });

  it('calls onChangeTouched when additional language is changed', async () => {
    const initialValuesLangOther: PreliminaryInformationsPayload = {
      ...initialValues,
      lang: 'other',
    };

    const { container } = render(
      <Formik initialValues={initialValuesLangOther} onSubmit={() => {}}>
        {(formik) => (
          <PreliminaryInformationsLang
            formik={formik}
            languages={mockLanguages}
            onChange={mockOnChange}
            onChangeTouched={mockOnChangeTouched}
          />
        )}
      </Formik>
    );

    const selectAdditionalLang = getById(container, 'additionalLang');
    expect(selectAdditionalLang).toBeInTheDocument();

    userEvent.click(selectAdditionalLang);

    const dropdown = await waitFor(() => getById(document.body, 'menu-additionalLang'));
    expect(dropdown).toBeInTheDocument();

    const frOption = within(dropdown).getByText('Tedesco');
    userEvent.click(frOption);

    await testInput(container, 'additionalLang', 'de');

    expect(mockOnChangeTouched).toHaveBeenCalled();
  });
});
