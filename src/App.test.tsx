import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { searchUsers } from './services/github';

jest.mock('./services/github', () => ({
  searchUsers: jest.fn(() => Promise.resolve({ data: { items: [] } })),
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders app without crashing', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
  });

  test('show input and button search', () => {
    render(<App />);
    expect(screen.getByPlaceholderText(/enter username/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('user can type a username', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: 'mochamad' } });
    expect(input).toHaveValue('mochamad');
  });

  test('clear button show while username type and can be used', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: 'testuser' } });

    const clearButton = screen.getByRole('button', { name: /clear username input/i });
    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
  });

  test('call searchUsers api when click search button', async () => {
    (searchUsers as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    render(<App />);
    const input = screen.getByPlaceholderText(/enter username/i);
    fireEvent.change(input, { target: { value: 'rifai' } });

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(searchUsers).toHaveBeenCalledWith('rifai');
    });
  });

  test('show allert "No result found" when empty result', async () => {
    (searchUsers as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), { target: { value: 'notfound' } });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await screen.findByText(/No result found/i);
  });

  test('should show loading spinner during fetch', async () => {
    let resolveFn: any;
    (searchUsers as jest.Mock).mockImplementationOnce(
      () => new Promise(resolve => (resolveFn = resolve))
    );

    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: 'rifai' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));
    expect(screen.getByRole('status')).toBeInTheDocument();

    await act(async () => {
      resolveFn({ data: { items: [] } });
    });
  });

  test('should show user data when search result is returned', async () => {
    const mockData = {
      data: {
        items: [
          {
            id: 123,
            login: 'rifaiid',
            avatar_url: 'https://avatars.githubusercontent.com/u/123?v=4',
            html_url: 'https://github.com/rifaiid',
          },
        ],
      },
    };

    (searchUsers as jest.Mock).mockResolvedValueOnce(mockData);

    render(<App />);

    fireEvent.change(screen.getByPlaceholderText(/enter username/i), {
      target: { value: 'rifai' },
    });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(searchUsers).toHaveBeenCalledWith('rifai');
    });
  });

  test('should call searchUsers when pressing Enter key in input', async () => {
    (searchUsers as jest.Mock).mockResolvedValueOnce({ data: { items: [] } });

    render(<App />);

    const input = screen.getByPlaceholderText(/enter username/i);

    fireEvent.change(input, { target: { value: 'rifai' } });

    // Simulasi tekan Enter
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(searchUsers).toHaveBeenCalledWith('rifai');
    });
  });
});


