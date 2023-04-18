export default {
  copy: {
    newDelegation: {
      name: 'Cristoforo',
      surname: 'Colombo',
      fiscalCode: 'CLMCST42R12D969Z',
    }
  },
  payloads: {
    newDelegation: {
      delegate: {
        firstName: 'Cristoforo',
        lastName: 'Colombo',
        fiscalCode: 'CLMCST42R12D969Z',
        person: true
      },
      verificationCode: '12345',
      visibilityIds: [],
      dateto: '2023-05-05'
    }
  },
  requests: {
    newDelegation: {
      selectPersonaFisicaOrPersonaGiuridica: 'pf',
      codiceFiscale: 'CLMCST42R12D969Z',
      nome: 'Cristoforo',
      cognome: 'Colombo',
      selectTuttiEntiOrSelezionati: 'tuttiGliEnti',
      expirationDate: '',
      enteSelect: {
        name: '',
        uniqueIdentifier: '',
      },
      verificationCode: '12345',
    }
  },
  responses: {
    newDelegation: {
      "mandateId": "94e272e1-26b6-4c7f-8878-c07c1cbf83f9",
      "delegator": {
          "displayName": null,
          "firstName": null,
          "lastName": null,
          "companyName": null,
          "fiscalCode": null,
          "person": true
      },
      "delegate": {
          "displayName": "Cristoforo Colombo",
          "firstName": "Cristoforo",
          "lastName": "Colombo",
          "companyName": null,
          "fiscalCode": null,
          "person": true
      },
      "status": "pending",
      "visibilityIds": [],
      "verificationCode": "29320",
      "datefrom": "2022-10-06",
      "dateto": "2023-02-04"
    }
  }
}