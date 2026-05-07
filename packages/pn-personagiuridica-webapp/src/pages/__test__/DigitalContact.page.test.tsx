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

describe('DigitalContact Page', () => {
  it('renders the component', () => {
    render(<DigitalContactPage />, { route: '/mocked-route' });
    const pageComponent = screen.queryByText('Mocked Page');
    expect(pageComponent).toBeTruthy();
  });
});
