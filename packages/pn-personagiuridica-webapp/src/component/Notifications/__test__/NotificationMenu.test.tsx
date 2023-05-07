import React from 'react';
import NotificationMenu from "../NotificationMenu";
import {render, screen, waitFor} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Box, MenuItem } from "@mui/material";

describe('NotificationMenu component', () => {
  it('checks that it opens and renders the children correctly', () => {
    render(<NotificationMenu>test text</NotificationMenu>);

    expect(screen.queryByText('test text')).toBeNull();

    const menuButton = screen.getByTestId('contextMenuButton');

    userEvent.click(menuButton);

    expect(screen.queryByText('test text')).toBeInTheDocument();
  });
})
