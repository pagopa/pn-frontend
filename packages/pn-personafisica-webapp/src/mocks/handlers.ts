import { rest } from 'msw';
// import { API_BASE_URL } from '../utils/constants';

export const handlers = [
  rest.get(`https://webapi.dev.pn.pagopa.it/mandate/api/v1/mandates-by-delegate`, (_, res, ctx) => 
    res(
      ctx.status(200),
      ctx.json([
        {
          mandateId: "d8cb6614-722a-4cc6-8a65-d62e413750c1",
          delegator: {
            displayName: "CColombo",
            firstName: "AAAA",
            lastName: "Colombo",
            companyName: "PagoPa SpA",
            fiscalCode: "CLMCST00M26D969Y",
            person: true
          },
          delegate: {
            displayName: "CBello",
            firstName: "Ciccio",
            lastName: "Bello",
            companyName: null,
            fiscalCode: null,
            person: true
          },
          status: "active",
          visibilityIds: [],
          verificationCode: null,
          datefrom: "2022-01-27Z",
          dateto: "2022-06-01"
        }
    ])
    )
  )
];