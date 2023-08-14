import { ValidatorBuilder } from "../../ValidatorBuilder";
import { ValidatorBuilders } from "../../types/ValidatorBuilders";
import { isMissingRules } from "../isMissingRules";

// Sample model interface
interface DummyModel {
    propertyOne: string;
    propertyTwo: string;
    propertyThree: number;
}

describe('isMissingRules', () => {
    it('should return an array of missing rule keys when there is missing one rule', () => {
        const validatorBuilders: ValidatorBuilders<DummyModel> = {
            propertyOne: new ValidatorBuilder<DummyModel, string>(),
            propertyThree: new ValidatorBuilder<DummyModel, number>(),
        };

        const dummyObject: DummyModel = {
            propertyOne: 'valueOne',
            propertyTwo: 'valueTwo',
            propertyThree: 123,
        };

        const missingRules = isMissingRules(dummyObject, validatorBuilders);
        expect(missingRules).toEqual(['propertyTwo']);
    });

    it('should return an empty array when all rules are defined correctly', () => {
        const validatorBuilders: ValidatorBuilders<DummyModel> = {
            propertyOne: new ValidatorBuilder<DummyModel, string>(),
            propertyTwo: new ValidatorBuilder<DummyModel, string>(),
            propertyThree: new ValidatorBuilder<DummyModel, number>(),
        };

        const dummyObject: DummyModel = {
            propertyOne: 'valueOne',
            propertyTwo: 'valueTwo',
            propertyThree: 123,
        };

        const missingRules = isMissingRules(dummyObject, validatorBuilders);
        expect(missingRules).toEqual([]);
    });
});
