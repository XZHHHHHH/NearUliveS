// src/app/login/login.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from './page';

/* ── Router mock shared across tests ── */
const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

/* ── Helper to stub fetch once per test ── */
function stubFetch(body: unknown, ok: boolean, status = ok ? 200 : 400) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as Response);
}

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('<Login />', () => {
  it('renders the form controls', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('stores user and redirects on success', async () => {
    const fakeUser = { id: 1, email: 'a@b.com' };
    stubFetch({ user: fakeUser }, true);

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'a@b.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    // wait until button re‑enables (state update flushed)
    await screen.findByRole('button', { name: /log in/i });

    expect(localStorage.getItem('user')).toEqual(JSON.stringify(fakeUser));
    expect(pushMock).toHaveBeenCalledWith('/home');
  });

  it('shows “Invalid email” when server flags email', async () => {
    stubFetch({ field: 'email', error: 'Invalid email' }, false);

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'wrong@x.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'whatever' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('shows “Invalid password” when server flags password', async () => {
    stubFetch({ field: 'password', error: 'Wrong password' }, false);

    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'a@b.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'badpass' },
    });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(await screen.findByText(/Wrong password/i)).toBeInTheDocument();
  });
});
