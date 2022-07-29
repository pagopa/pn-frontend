
import { render, fireEvent } from "../../test-utils";
import LoadingPage from '../LoadingPage';

describe('LoadingPage component', () => {
  it('renders with whole layout', () => {
    const result = render(<LoadingPage renderType="whole"/>);
    const header = result.queryByTestId('header');
    const menu = result.queryByTestId('menu');
    const body = result.queryByTestId('body');
    const footer = result.queryByTestId('footer');
    expect(header).toBeInTheDocument();
    expect(menu).toBeInTheDocument();
    expect(body).toBeInTheDocument();
    expect(footer).toBeInTheDocument();
  });
  
  it('renders with part layout - generic', () => {
    const result = render(<LoadingPage/>);
    const title = result.queryByTestId('title');
    const subTitle = result.queryByTestId('subTitle');
    const content = result.queryByTestId('content');
    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
    expect(content).toBeInTheDocument();
  });

  it('renders with part layout - specific', () => {
    const result = render(<LoadingPage layout={[{id: '0', xs: 12}, {id: '1', xs: 6}]}/>);
    const title = result.queryByTestId('title');
    const subTitle = result.queryByTestId('subTitle');
    const customContent = result.queryByTestId('customContent');
    expect(title).toBeInTheDocument();
    expect(subTitle).toBeInTheDocument();
    expect(customContent).toBeInTheDocument();
  });
});
