import { Validator } from './../Validator';

class ProvaSub {
    hola: string;
}

class Prova {
    ciao: string;
    prova_sub: ProvaSub[];
}

class SubProvaValidator extends Validator<ProvaSub> {
    constructor() {
        super();
        this.ruleFor('hola').isString().isEqual('bb')
    }
}

class ProvaValidator extends Validator<Prova> {
    constructor() {
        super();

        this.ruleFor('ciao').isString().isEqual('aa');
        this.ruleFor('prova_sub').isObject().isEqual([{hola: 'bb'}]);
    }
}

it('prova test', () => {
    const validator = new ProvaValidator();
    const result = validator.validate({ciao: 'a', prova_sub: [{hola: 'b'}]});
    console.log(result);
})