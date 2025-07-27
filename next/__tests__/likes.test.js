// likes.test.js - Likes System Testing

describe('Likes System', () => {
  it('validates like operations', () => {
    const post = {
      id: 1,
      title: 'Test Post',
      likes: [],
    };

    const addLike = (post, userId) => {
      if (!post.likes.includes(userId)) {
        return { ...post, likes: [...post.likes, userId] };
      }
      return post;
    };

    const likedPost = addLike(post, 1);
    expect(likedPost.likes).toContain(1);
    expect(likedPost.likes).toHaveLength(1);
  });

  it('prevents duplicate likes', () => {
    const post = {
      id: 1,
      title: 'Test Post',
      likes: [1],
    };

    const addLike = (post, userId) => {
      if (!post.likes.includes(userId)) {
        return { ...post, likes: [...post.likes, userId] };
      }
      return post;
    };

    const attemptDuplicateLike = addLike(post, 1);
    expect(attemptDuplicateLike.likes).toHaveLength(1);
  });

  it('removes likes', () => {
    const post = {
      id: 1,
      title: 'Test Post',
      likes: [1, 2, 3],
    };

    const removeLike = (post, userId) => {
      return { ...post, likes: post.likes.filter(id => id !== userId) };
    };

    const unlikedPost = removeLike(post, 2);
    expect(unlikedPost.likes).not.toContain(2);
    expect(unlikedPost.likes).toHaveLength(2);
  });
});
