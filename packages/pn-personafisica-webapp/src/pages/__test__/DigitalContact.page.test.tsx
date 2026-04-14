import { Route, Routes } from 'react-router-dom';

import { render, screen } from '../../__test__/test-utils';
import DigitalContact from '../DigitalContact.page';

const DigitalContactPage = () => (
  <Routes>
    <Route path="/" element={<DigitalContact />}>
      <Route path="/" element={<div>Generic Page</div>} />
      <Route path="/mocked-route" element={<div>Mocked Page</div>} />
    </Route>
  </Routes>
);

describe('DigitalContact Page', async () => {
  it('renders the component', async () => {
    render(<DigitalContactPage />, {
      route: ['/', '/mocked-route'],
      path: '*',
      initialIndex: 0,
    });
    const pageComponent = screen.queryByText('Generic Page');
    expect(pageComponent).toBeTruthy();
  });

  it('renders the component', async () => {
    render(<DigitalContactPage />, {
      route: ['/', '/mocked-route'],
      path: '*',
    });
    const pageComponent = screen.queryByText('Mocked Page');
    expect(pageComponent).toBeTruthy();
  });
});
