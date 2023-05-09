import React from 'react';
import NotificationMenu from "../NotificationMenu";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => (
    {
      t: (str: string) => str,
    }
  ),
}));

describe('NotificationMenu component', () => {
  it('checks that it opens and renders the children correctly', () => {
    render(<NotificationMenu>test text</NotificationMenu>);

    expect(screen.queryByText('test text')).toBeNull();

    const menuButton = screen.getByTestId('contextMenuButton');

    userEvent.click(menuButton);

    expect(screen.queryByText('test text')).toBeInTheDocument();
  });
})
