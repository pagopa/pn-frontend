import { vi } from 'vitest';

import { testFormElements } from '@pagopa-pn/pn-commons/src/test-utils';

import { render } from '../../../__test__/test-utils';
import PhysicalAddress from '../PhysicalAddress';

const mockSetValue = vi.fn();

const formTestValues = {
  address: 'via delle vie',
  houseNumber: '12',
  municipalityDetails: 'Ostia',
  municipality: 'Roma',
  province: 'Roma',
  zip: '00122',
  foreignState: 'Italia',
  at: 'Multoni srl',
  addressDetails: 'scala b quarto piano',
};

vi.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

describe('PhysicalAddress Component', () => {
  it('renders the component', () => {
    const { container } = render(
      <PhysicalAddress
        values={{ recipients: [{}, formTestValues] }}
        touched={{}}
        errors={{}}
        recipient={1}
        setFieldValue={mockSetValue}
      />
    );
    testFormElements(container, 'recipients[1].address', 'address*', formTestValues.address);
    testFormElements(
      container,
      'recipients[1].houseNumber',
      'house-number*',
      formTestValues.houseNumber
    );
    testFormElements(
      container,
      'recipients[1].municipalityDetails',
      'municipality-details',
      formTestValues.municipalityDetails
    );
    testFormElements(
      container,
      'recipients[1].municipality',
      'municipality*',
      formTestValues.municipality
    );
    testFormElements(container, 'recipients[1].province', 'province*', formTestValues.province);
    testFormElements(container, 'recipients[1].zip', 'zip*', formTestValues.zip);
    testFormElements(
      container,
      'recipients[1].foreignState',
      'foreign-state*',
      formTestValues.foreignState
    );
    testFormElements(
      container,
      'recipients[1].addressDetails',
      'address-details',
      formTestValues.addressDetails
    );
  });
});
