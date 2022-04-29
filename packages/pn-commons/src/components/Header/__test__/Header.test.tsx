import { fireEvent, waitFor, screen } from "@testing-library/react";

import { render } from "../../../test-utils";
import Header from "../Header";
import { loggedUser, partyList, productsList } from "./test-utils";

const handleActionClick = jest.fn();
const userActions = [
  {
    id: "mocked-action-1",
    label: 'Mocked Action 1',
    onClick: handleActionClick,
    icon: '',
  },
  {
    id: "mocked-action-2",
    label: 'Mocked Action 2',
    onClick: () => {},
    icon: '',
  }
]

const handleClick = jest.fn();

describe('Header Component', () => {

  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
  })

  it('renders header (one product, no parties and no user dropdown)', async () => {
    // render component
    const result = render(<Header productsList={[productsList[0]]} loggedUser={loggedUser} onExitAction={handleClick}/>);
    const headers = result.container.querySelectorAll('.MuiContainer-root');
    expect(headers[0]).toBeInTheDocument();
    expect(headers[0]).toHaveTextContent(/PagoPA S.p.A./i);
    const buttons = headers[0]!.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
    expect(buttons[0]).toHaveTextContent(/Assistenza/i);
    expect(buttons[2]).toHaveTextContent(/Esci/i);
    expect(headers[1]).toHaveTextContent(/Product 1/i);
    const productButton = headers[1].querySelector('[role="button"]');
    expect(productButton).not.toBeInTheDocument();
    fireEvent.click(buttons[2]);
    await waitFor(() => expect(handleClick).toBeCalledTimes(1))
  });

  it('renders header (two products, no parties and no user dropdown)', async () => {
    // render component
    const result = render(<Header productsList={productsList} loggedUser={loggedUser}/>);
    const headers = result.container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    expect(productButton).toBeInTheDocument();
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(productDropdown).toBeInTheDocument();
    const products = productDropdown!.querySelectorAll('li');
    expect(products).toHaveLength(2);
    expect(products[0]).toHaveTextContent(productsList[0].title);
    expect(products[1]).toHaveTextContent(productsList[1].title);
  });

  it('renders header (two products, no parties and user dropdown)', async () => {
    // render component
    const result = render(<Header productsList={productsList} loggedUser={loggedUser} enableDropdown userActions={userActions}/>);
    const headers = result.container.querySelectorAll('.MuiContainer-root');
    const buttons = headers[0]!.querySelectorAll('button');
    expect(buttons[2]).toHaveTextContent(/Mario Rossi/i);
    fireEvent.click(buttons[2]);
    const userDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(userDropdown).toBeInTheDocument();
    const userActionsBtn = userDropdown!.querySelectorAll('li');
    expect(userActionsBtn).toHaveLength(2);
    expect(userActionsBtn[0]).toHaveTextContent(userActions[0].label);
    expect(userActionsBtn[1]).toHaveTextContent(userActions[1].label);
    fireEvent.click(userActionsBtn[0]);
    await waitFor(() => expect(handleActionClick).toBeCalledTimes(1))
  });

  it('renders header (two products, one party and user dropdown)', async () => {
    // render component
    const result = render(<Header productsList={productsList} loggedUser={loggedUser} enableDropdown userActions={userActions} partyList={[partyList[0]]}/>);
    const headers = result.container.querySelectorAll('.MuiContainer-root');
    expect(headers[1]).toHaveTextContent(partyList[0].name);
    expect(headers[1]).toHaveTextContent(partyList[0].productRole);
    const buttons = headers[1].querySelectorAll('[role="button"]');
    expect(buttons).toHaveLength(1);
  });

  it('renders header (two products, two parties and user dropdown)', async () => {
    // render component
    const result = render(<Header productsList={productsList} loggedUser={loggedUser} enableDropdown userActions={userActions} partyList={partyList}/>);
    const headers = result.container.querySelectorAll('.MuiContainer-root');
    const buttons = headers[1].querySelectorAll('[role="button"]');
    expect(buttons).toHaveLength(2);
    fireEvent.click(buttons[1]);
    const partyDrawer = await waitFor(() => screen.queryByRole('presentation'));
    expect(partyDrawer).toBeInTheDocument();
    const partyBtn = partyDrawer!.querySelectorAll('[role="button"]');
    expect(partyBtn[0]).toHaveTextContent(partyList[0].name);
    expect(partyBtn[0]).toHaveTextContent(partyList[0].productRole);
    expect(partyBtn[1]).toHaveTextContent(partyList[1].name);
    expect(partyBtn[1]).toHaveTextContent(partyList[1].productRole);
    fireEvent.click(partyBtn[1]);
    await waitFor(() => expect(partyDrawer).not.toBeInTheDocument());
    expect(headers[1]).toHaveTextContent(partyList[1].name);
    expect(headers[1]).toHaveTextContent(partyList[1].productRole);
  });
});