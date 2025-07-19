import '@testing-library/jest-dom';

// Mock Next.js router once for all tests
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));
