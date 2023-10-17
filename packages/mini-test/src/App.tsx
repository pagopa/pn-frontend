/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { EmptyState, KnownSentiment, formatEurocentToCurrency, } from '@pagopa-pn/pn-commons';
import { Person, PersonValidator } from "./validator/PersonValidator";

const badPerson: Person = {
  firstName: 'Luigi',
  lastName: 'Cazzullo',
  displayName: 'Bel luigino',
}

export function App() {
  const [validationResult, setValidationResult] = useState<any>();

  // const toto = import.meta.env.VITE_HOST;

  useEffect(() => {
    const validator = new PersonValidator();
    const theResult = validator.validate(badPerson);
    console.log(theResult);
    // console.log(toto);
    setValidationResult(theResult);
  }, []);

  return <div style={{ display: 'flex', flexDirection: 'column'}}>
    <div>Validation result signals {validationResult ? Object.keys(validationResult).length : 0} errors</div>
    <div style={{ marginBottom: "2rem" }}>The amout is {formatEurocentToCurrency(8100)}</div>
    <EmptyState sentimentIcon={KnownSentiment.SATISFIED}>
      <span>dentro l'empty state</span>
    </EmptyState>
    {/* <PnDialog open={true}>
      <DialogTitle>
        A nice dialog
      </DialogTitle>
      <PnDialogContent>
        <DialogContentText>Subtitle</DialogContentText>
        <div>Dialog contents</div>
      </PnDialogContent>
    </PnDialog> */}
  </div>;
}
