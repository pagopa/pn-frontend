import { dataRegex } from '@pagopa-pn/pn-commons';
import * as yup from 'yup';

export function requiredStringFieldValidation(tc: any, maxLength?: number, minLength?: number): any {
    // eslint-disable-next-line functional/no-let
    let newValidation = yup.string().required(tc('required-field'))
      .matches(dataRegex.noSpaceAtEdges, tc('no-spaces-at-edges'));
    if (maxLength) {
      newValidation = newValidation.max(maxLength, tc('too-long-field-error', { maxLength }));
    }
    if (minLength) {
      newValidation = newValidation.min(minLength, tc('too-short-field-error', { minLength }));
    }
    return newValidation;
};