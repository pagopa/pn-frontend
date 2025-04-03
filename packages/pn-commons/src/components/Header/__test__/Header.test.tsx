import { vi } from 'vitest';

import { LinkType, loggedUser, partyList, productsList } from '../../../__mocks__/User.mock';
import { fireEvent, render, screen, waitFor } from '../../../test-utils';
import Header from '../Header';

const handleActionClick = vi.fn();
const handleClick = vi.fn();
const assignFn = vi.fn();

const userActions = [
  {
    id: 'mocked-action-1',
    label: 'Mocked Action 1',
    onClick: handleActionClick,
    icon: '',
  },
  {
    id: 'mocked-action-2',
    label: 'Mocked Action 2',
    onClick: () => {},
    icon: '',
  },
];

describe('Header Component', () => {
  const original = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { href: '', assign: assignFn },
    });
  });

  beforeEach(() => {
    window.location.href = '';
    vi.clearAllMocks();
  });

  afterAll((): void => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  it('renders header (one product, no parties and no user dropdown)', async () => {
    // render component
    const { container } = render(
      <Header
        productsList={[productsList[0]]}
        loggedUser={loggedUser}
        onExitAction={handleClick}
        productId={productsList[0].id}
      />
    );
    const headers = container.querySelectorAll('.MuiContainer-root');
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
    await waitFor(() => expect(handleClick).toBeCalledTimes(1));
  });

  it('renders header (checking product without productUrl)', async () => {
    sessionStorage.setItem('fake-item', 'prova');
    // render component
    const { container } = render(
      <Header productsList={productsList} loggedUser={loggedUser} productId={productsList[0].id} />
    );
    expect(sessionStorage.getItem('fake-item')).not.toBeNull();
    const headers = container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    expect(productButton).toBeInTheDocument();
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(productDropdown).toBeInTheDocument();
    const products = productDropdown!.querySelectorAll('li');
    expect(products).toHaveLength(2);
    expect(products[0]).toHaveTextContent(productsList[0].title);
    expect(products[1]).toHaveTextContent(productsList[1].title);
    fireEvent.click(products[0]);
    expect(assignFn).toBeCalledTimes(0);
    expect(sessionStorage.getItem('fake-item')).toBe('prova');
  });

  it('renders header (checking switch product)', async () => {
    sessionStorage.setItem('fake-item', 'prova');
    // render component
    const { container } = render(
      <Header
        productsList={productsList}
        partyList={partyList}
        loggedUser={loggedUser}
        partyId="1"
        productId={productsList[0].id}
      />
    );
    expect(sessionStorage.getItem('fake-item')).not.toBeNull();
    const headers = container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    expect(productButton).toBeInTheDocument();
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(productDropdown).toBeInTheDocument();
    const products = productDropdown!.querySelectorAll('li');
    fireEvent.click(products[1]);
    expect(assignFn).toBeCalledTimes(1);
    expect(assignFn).toBeCalledWith(productsList[1].productUrl);
    expect(sessionStorage.getItem('fake-item')).toBeNull();
  });

  it('renders header (check switching to selfcare)', async () => {
    const productsWithSelfcare = [
      ...productsList,
      {
        id: 'selfcare',
        title: 'Area Riservata',
        productUrl: 'dev.selfcare/dashboard/1',
        linkType: LinkType.EXTERNAL,
      },
    ];
    const { container } = render(
      <Header
        productsList={productsWithSelfcare}
        loggedUser={loggedUser}
        partyList={partyList}
        partyId="1"
        productId={productsWithSelfcare[0].id}
      />
    );
    const headers = container.querySelectorAll('.MuiContainer-root');
    const productButton = headers[1].querySelector('[role="button"]');
    sessionStorage.setItem('fake-item', 'prova');
    expect(productButton).toBeInTheDocument();
    fireEvent.click(productButton!);
    const productDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(productDropdown).toBeInTheDocument();
    const products = productDropdown!.querySelectorAll('li');
    const selfcareProductIndex = productsWithSelfcare.findIndex(
      (product) => product.id === 'selfcare'
    );
    fireEvent.click(products[selfcareProductIndex]);
    expect(assignFn).toBeCalledTimes(1);
    expect(assignFn).toBeCalledWith(productsWithSelfcare[selfcareProductIndex].productUrl);
    expect(sessionStorage.getItem('fake-item')).toBeNull();
  });

  it('renders header (checking switch institution)', async () => {
    const partyIndex = partyList.findIndex((party) => party.entityUrl);
    sessionStorage.setItem('fake-item', 'prova');
    // render component
    const { container } = render(
      <Header
        productsList={productsList}
        partyList={partyList}
        partyId={partyList[0].id}
        loggedUser={loggedUser}
        productId={productsList[0].id}
      />
    );
    expect(sessionStorage.getItem('fake-item')).not.toBeNull();
    const headers = container.querySelectorAll('.MuiContainer-root');
    const partyButton = headers[1].querySelectorAll('[role="button"]')[1];
    expect(partyButton).toBeInTheDocument();
    fireEvent.click(partyButton!);
    const partyDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(partyDropdown).toBeInTheDocument();
    const parties = partyDropdown!.querySelectorAll('[role="button"]');
    fireEvent.click(parties[partyIndex]);
    expect(assignFn).toBeCalledTimes(1);
    expect(assignFn).toBeCalledWith(partyList[partyIndex].entityUrl);
    expect(sessionStorage.getItem('fake-item')).toBeNull();
  });

  it('renders header (checking institution without entityUrl)', async () => {
    const partyWithoutEntityUrl = partyList.findIndex((party) => !party.entityUrl);
    // render component
    const { container } = render(
      <Header
        productsList={productsList}
        partyList={partyList}
        partyId={partyList[partyWithoutEntityUrl].id}
        loggedUser={loggedUser}
        productId={productsList[0].id}
      />
    );
    const headers = container.querySelectorAll('.MuiContainer-root');
    const partyButton = headers[1].querySelectorAll('[role="button"]')[1];
    expect(partyButton).toBeInTheDocument();
    fireEvent.click(partyButton!);
    const partyDropdown = await waitFor(() => screen.queryByRole('presentation'));
    expect(partyDropdown).toBeInTheDocument();
    const parties = partyDropdown!.querySelectorAll('[role="button"]');
    fireEvent.click(parties[partyWithoutEntityUrl]);
    expect(assignFn).toBeCalledTimes(0);
  });

  it('renders header (two products, no parties and user dropdown)', async () => {
    // render component
    const { container } = render(
      <Header
        productsList={productsList}
        loggedUser={loggedUser}
        enableDropdown
        userActions={userActions}
        productId={productsList[0].id}
      />
    );
    const headers = container.querySelectorAll('.MuiContainer-root');
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
    await waitFor(() => expect(handleActionClick).toBeCalledTimes(1));
  });

  it('renders header (two products, one party and user dropdown)', async () => {
    // render component
    const { container } = render(
      <Header
        productsList={productsList}
        loggedUser={loggedUser}
        enableDropdown
        userActions={userActions}
        partyList={[partyList[0]]}
        productId={productsList[0].id}
      />
    );
    const headers = container.querySelectorAll('.MuiContainer-root');
    expect(headers[1]).toHaveTextContent(partyList[0].name);
    expect(headers[1]).toHaveTextContent(partyList[0].productRole);
    const logo = headers[1].querySelector('img');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', partyList[0].logoUrl);
    const buttons = headers[1].querySelectorAll('[role="button"]');
    expect(buttons).toHaveLength(1);
  });

  it('renders header (two products, two parties and user dropdown)', async () => {
    // render component
    const { container } = render(
      <Header
        productsList={productsList}
        loggedUser={loggedUser}
        enableDropdown
        userActions={userActions}
        partyList={partyList}
        productId={productsList[0].id}
      />
    );
    const headers = container.querySelectorAll('.MuiContainer-root');
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

  it('should show parentName (AOO/UO) on PartySwitch when present', async () => {
    const partyWithParent = partyList.find((party) => party.parentName);
    const { container } = render(
      <Header
        productsList={productsList}
        loggedUser={loggedUser}
        partyId={partyWithParent?.id}
        enableDropdown
        userActions={userActions}
        partyList={partyList}
        productId={productsList[0].id}
      />
    );

    const headers = container.querySelectorAll('.MuiContainer-root');
    expect(headers[1]).toHaveTextContent(partyWithParent?.parentName as string);
  });

  it('clicks on assistanceEmail when value is passed', async () => {
    // render component
    const { getByText } = render(
      <Header
        productsList={productsList}
        loggedUser={loggedUser}
        enableDropdown
        userActions={userActions}
        partyList={partyList}
        onAssistanceClick={() => (window.location.href = 'mailto:email')}
        productId={productsList[0].id}
      />
    );
    expect(window.location.href).toBe('');
    const assistanceLink = getByText(/Assistenza/i);
    fireEvent.click(assistanceLink);
    expect(window.location.href).toBe('mailto:email');
  });

  it('clicks on assistance link when assistanceEmail has no value', () => {
    // render component
    const { getByText } = render(
      <Header
        productsList={productsList}
        loggedUser={loggedUser}
        enableDropdown
        userActions={userActions}
        partyList={partyList}
        productId={productsList[0].id}
      />
    );
    const assistanceLink = getByText(/Assistenza/i);
    fireEvent.click(assistanceLink);
    expect(window.location.href).toBe('');
  });

  it('clicks on exit with default value', async () => {
    const { container } = render(
      <Header
        productsList={[productsList[0]]}
        loggedUser={loggedUser}
        productId={productsList[0].id}
      />
    );
    const headers = container.querySelectorAll('.MuiContainer-root');
    const buttons = headers[0]!.querySelectorAll('button');
    fireEvent.click(buttons[2]);
    await waitFor(() => expect(assignFn).toBeCalledTimes(1));
    await waitFor(() => expect(assignFn).toBeCalledWith(''));
  });
});
