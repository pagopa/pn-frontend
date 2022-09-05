import { Validator } from './../Validator';

class ProvaSub {
    hola: string;
    hi: string
}

class Prova {
    ciao: string;
    prova_sub: ProvaSub[];
}

class SubProvaValidator extends Validator<ProvaSub> {
    constructor() {
        super();
        this.ruleFor('hola').isEqual('bb');
        this.ruleFor('hi').isEqual('cc');
    }
}

class ProvaValidator extends Validator<Prova> {
    constructor() {
        super();

        this.ruleFor('ciao').isEqual('a');
        this.ruleFor('prova_sub').isEqual([{hola: 'b', hi: 'c'}, {hola: 'bb', hi: 'cc'}]).forEachElement((rules) => {rules.setValidator(new SubProvaValidator())});
    }
}

it('prova test', () => {
    const validator = new ProvaValidator();
    const result = validator.validate({ciao: 'a', prova_sub: [{hola: 'b', hi: 'c'}, {hola: 'bb', hi: 'cc'}]});
    console.log(result);
})