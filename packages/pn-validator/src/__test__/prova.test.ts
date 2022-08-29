import { Validator } from './../Validator';

class Prova {
    ciao: string;
}

class ProvaValidator extends Validator<Prova> {
    constructor() {
        super();

        this.ruleFor('ciao')
    }
}

it('prova test', () => {
    const validator = new ProvaValidator();
    validator.validate({ciao: 'a'});
})