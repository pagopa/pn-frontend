import {act, cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {EstimatePeriod, EstimateStatusEnum} from "../../../../../../models/UsageEstimation";
import {EstimateForm} from "../Estimate.form";
import * as reactRedux from "../../../../../../redux/hooks";


const setScenario = (initialValues: EstimatePeriod, stat: EstimateStatusEnum) => {
  return {
    ...initialValues,
    status: stat
  }
}

const initEstimatePeriod = {
  status: EstimateStatusEnum.DRAFT,
  showEdit: true,
  deadlineDate: "2023-06-15T23:59:00.000+00:00",
  referenceMonth: "LUG-2023",
  lastModifiedDate: "",
  estimate: {
    total890Notif: 10,
    totalAnalogNotif: 10,
    totalDigitalNotif: 10
  },
  billing: {
    sdiCode: "",
    splitPayment: false,
    description: "",
    mailAddress: "test@test.com"
  }
};

const stateUser = {
  sessionToken: "",
  name: "",
  family_name: "",
  fiscal_number: "",
  email: "",
  uid: "",
  organization: {
    id: "id"
  }
};

jest.mock("../bill/Bill.form",
  () => ({
    BillForm: () => {
      // @ts-ignore
      return <mock-table data-testid="bill-form-mock"/>;
    },
  })
);

jest.mock("../usage/UsageEstimate.form",
  () => ({
    UsageEstimateForm: () => {
      // @ts-ignore
      return <mock-table data-testid="usage-form-mock"/>;
    },
  })
);

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('@pagopa-pn/pn-commons', () => ({
  ...jest.requireActual('@pagopa-pn/pn-commons')
}));

describe("Estimate.form.test", () => {
  const mockSelector = jest.fn();
  const mockDispatch = jest.fn().mockImplementation(() => Promise.resolve());
  const spyOnDispatch = jest.spyOn(reactRedux, "useAppDispatch");
  const spyOnSelector = jest.spyOn(reactRedux, "useAppSelector");

  const mockingStore = (userStore= { }) => {
    const reduxStore = {
      userState:{
        user: userStore
      }
    } as any

    spyOnSelector.mockImplementation((selector) => selector(reduxStore))
  }

  beforeEach(() => {
    spyOnSelector.mockReturnValue(mockSelector);
    spyOnDispatch.mockReturnValue(mockDispatch);
    mockingStore(stateUser);
  });

  afterEach(() => {
    cleanup()
    spyOnSelector.mockClear()
    spyOnSelector.mockReset();
    spyOnDispatch.mockClear()
    spyOnDispatch.mockReset();
  });

  it("whenEstimateIsSaved", async () => {
    const mockOnEstimateValidated = jest.fn()

    const initialValue = setScenario(initEstimatePeriod, EstimateStatusEnum.DRAFT);
    render(<EstimateForm detail={initialValue} onEstimateValidated={mockOnEstimateValidated}/>);

    const saveButton = await screen.queryByTestId("btn-save-estimate");
    screen.debug(saveButton);
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
    fireEvent.click(saveButton);
    await act(async () => {
      await waitFor( () => {
        screen.debug(saveButton);
        expect(mockDispatch).toBeCalledTimes(1);
      })
    })
  })

  it("whenEstimateIsValidated", async () => {
    const mockOnEstimateValidated = jest.fn()
    const initialValue = setScenario(initEstimatePeriod, EstimateStatusEnum.VALIDATED);
    render(<EstimateForm detail={initialValue} onEstimateValidated={mockOnEstimateValidated}/>);

    const openDialogButton = await screen.queryByTestId("btn-open-dialog");
    // screen.debug(openDialogButton);
    expect(openDialogButton).toBeInTheDocument();
    expect(openDialogButton).not.toBeDisabled();
    fireEvent.click(openDialogButton);

    const sendDialog = await screen.queryByTestId("send-estimate-dialog");
    screen.debug(sendDialog);
    const buttons = sendDialog.querySelectorAll('button');

    // const buttons = sendDialog.querySelectorAll("input[type='button']");

    buttons.forEach((btn, index) => {
      if(index === 1) {
        fireEvent.click(btn);
      }
    });

    await act(async () => {
      await waitFor( () => {
        expect(mockDispatch).toBeCalledTimes(1);
      })
    })
  })

  it("whenEstimateIsNotValidated", async () => {
    const mockOnEstimateValidated = jest.fn()
    const initialValue = setScenario(initEstimatePeriod, EstimateStatusEnum.VALIDATED);
    render(<EstimateForm detail={initialValue} onEstimateValidated={mockOnEstimateValidated}/>);

    const openDialogButton = await screen.queryByTestId("btn-open-dialog");
    // screen.debug(openDialogButton);
    expect(openDialogButton).toBeInTheDocument();
    expect(openDialogButton).not.toBeDisabled();
    fireEvent.click(openDialogButton);

    const sendDialog = await screen.queryByTestId("send-estimate-dialog");
    screen.debug(sendDialog);
    const buttons = sendDialog.querySelectorAll('button');

    buttons.forEach((btn, index) => {
      if(index === 0) {
        fireEvent.click(btn);
      }
    });

    await act(async () => {
      await waitFor( () => {
        expect(sendDialog).not.toBeInTheDocument();
      })
    })
  })
});