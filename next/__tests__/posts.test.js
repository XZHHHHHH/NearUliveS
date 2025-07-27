// posts.test.js - Post Management Testing

describe('Post Management', () => {
  it('validates post title', () => {
    const isValidTitle = (title) => {
      if (!title) return false;
      return title.trim().length > 0 && title.length <= 200;
    };

    expect(isValidTitle('Valid Post Title')).toBe(true);
    expect(isValidTitle('')).toBe(false);
    expect(isValidTitle('   ')).toBe(false);
    expect(isValidTitle('A'.repeat(201))).toBe(false);
  });

  it('validates post ownership', () => {
    const post = { id: 1, authorId: 1, title: 'Test Post' };
    const currentUserId = 1;
    
    const canDelete = post.authorId === currentUserId;
    expect(canDelete).toBe(true);
  });

  it('handles comments', () => {
    const comments = [
      { id: 1, content: 'First comment', postId: 1, authorId: 1 },
      { id: 2, content: 'Second comment', postId: 1, authorId: 2 },
    ];

    const getCommentsForPost = (postId) => {
      return comments.filter(c => c.postId === postId);
    };

    const post1Comments = getCommentsForPost(1);
    expect(post1Comments).toHaveLength(2);
  });
});
