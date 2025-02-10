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
  const originalLocation = window.location;

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { hash: '', pathname: '/' },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { writable: true, value: originalLocation });
  });

  it('renders the component', async () => {
    window.location.pathname = '/mocked-route';

    render(<DigitalContactPage />);
    const pageComponent = screen.queryByText('Mocked Page');
    expect(pageComponent).toBeTruthy();
  });
});
