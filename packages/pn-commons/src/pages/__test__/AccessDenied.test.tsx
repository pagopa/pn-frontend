import React from 'react';
import { vi } from 'vitest';

import { fireEvent, initLocalizationForTest, render } from '../../test-utils';
import AccessDenied from '../AccessDenied';

describe('AccessDenied Component', () => {
  beforeAll(() => {
    initLocalizationForTest();
  });

  it('renders access denied with standard texts - logged user', () => {
    // render component
    const { getByRole } = render(
      <AccessDenied
        isLogged
        goToLogin={function (): void {
          throw new Error('Function not implemented.');
        }}
        goToHomePage={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    const heading = getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('common - access-denied');
    const redirectButton = getByRole('button');
    expect(redirectButton).toHaveTextContent('common - button.go-to-home');
  });

  it('renders access denied with standard texts - not logged user', () => {
    // render component
    const { container, getByRole } = render(
      <AccessDenied
        isLogged={false}
        goToLogin={function (): void {
          throw new Error('Function not implemented.');
        }}
        goToHomePage={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    const heading = getByRole('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('common - not-logged');
    expect(container).toHaveTextContent('common - not-logged-subtitle');
    const redirectButton = getByRole('button');
    expect(redirectButton).toHaveTextContent('common - button.go-to-login');
  });

  it('renders access denied with custom texts', () => {
    // render component
    const { getByText } = render(
      <AccessDenied
        isLogged
        message="mock-message"
        subtitle="mock-subtitle"
        goToLogin={function (): void {
          throw new Error('Function not implemented.');
        }}
        goToHomePage={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    const messageElement = getByText('mock-message');
    const subtitleElement = getByText('mock-subtitle');
    expect(messageElement).toBeInTheDocument();
    expect(subtitleElement).toBeInTheDocument();
  });

  it('clicks on redirect button - not logged user', () => {
    const goToLogin = vi.fn();
    // render component
    const { getByRole } = render(
      <AccessDenied
        isLogged={false}
        goToLogin={goToLogin}
        goToHomePage={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    const redirectButton = getByRole('button');
    fireEvent.click(redirectButton);
    expect(goToLogin).toBeCalledTimes(1);
  });

  it('clicks on redirect button - logged user', () => {
    const goToHomePage = vi.fn();
    // render component
    const { getByRole } = render(
      <AccessDenied
        isLogged
        goToLogin={function (): void {
          throw new Error('Function not implemented.');
        }}
        goToHomePage={goToHomePage}
      />
    );
    const redirectButton = getByRole('button');
    fireEvent.click(redirectButton);
    expect(goToHomePage).toBeCalledTimes(1);
  });
});
