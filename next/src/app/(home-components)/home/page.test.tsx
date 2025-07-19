// page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) Fake data ────────────────────────────────────────────
const fakePosts = [
  { id: 2, title: 'Newest', createdAt: new Date('2025-07-02'), author: { profile: { username: 'bob' } } },
  { id: 1, title: 'Oldest', createdAt: new Date('2025-07-01'), author: { profile: { username: 'alice' } } },
];

// ── 2) Mock PrismaClient ────────────────────────────────────
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    post: { findMany: jest.fn().mockResolvedValue(fakePosts) },
  })),
}));

// ── 3) Mock PostCard (the child component) ─────────────────
jest.mock('@/app/components/PostCard', () => ({
  __esModule: true,
  default: ({ post, userprofile }: any) => (
    <div data-testid="postcard">
      {post.id}-{userprofile.username}
    </div>
  ),
}));

// ── 4) Import the Server Component under test ───────────────
import HomePage from './page';

describe('HomePage', () => {
  it('renders one PostCard per post (newest first)', async () => {
    // call the async Server Component to get its React tree
    const tree = await HomePage();
    render(tree);

    // assert that two mocked PostCard divs exist
    const cards = screen.getAllByTestId('postcard');
    expect(cards).toHaveLength(2);

    // check order/content
    expect(cards[0]).toHaveTextContent('2-bob');
    expect(cards[1]).toHaveTextContent('1-alice');
  });
});
