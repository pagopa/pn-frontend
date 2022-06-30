/* eslint-disable functional/immutable-data */
import { Delegator } from "../../delegation/types";

export const initialState = {
  pendingDelegators: 0,
  delegators: [],
  legalDomicile: [],
  domicileBannerOpened: true
};

type statusType = "pending" | "active";

export const getMockedDelegators = (status: "pending" | "active" | "mixed") : Array<Delegator> => {
  const returnStatus: [statusType, statusType] = ["pending", "active"];
  switch(status) {
    case "pending": returnStatus[1] = "pending";
                    break;
    case "active":  returnStatus[0] = "active";
                    break;
    default:        break;
  }
    return [
    {
      mandateId: "1dc53e54-1368-4c2d-8583-2f1d672350d8",
      status: returnStatus[0],
      visibilityIds: [],
      verificationCode: "",
      datefrom: "2022-03-01",
      dateto: "2022-06-30",
      delegator: {
        displayName: "Alessandro Manzoni",
        firstName: "",
        lastName: "",
        companyName: null,
        fiscalCode: "",
        person: true
      }
    }, {
      mandateId: "8ff0b635-b770-49ae-925f-3888495f3d13",
      status: returnStatus[1],
      visibilityIds: [],
      verificationCode: "",
      datefrom: "2022-03-01",
      dateto: "2022-06-30",
      delegator: {
        displayName: "Lucia Mondella",
        firstName: "",
        lastName: "",
        companyName: null,
        fiscalCode: "",
        person: true
      }
    }
  ];
};