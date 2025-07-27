describe('Chat System', () => {
  it('validates message content', () => {
    const isValidMessage = (content) => {
      if (!content) return false;
      return content.trim().length > 0 && content.length <= 1000;
    };

    expect(isValidMessage('Hello world!')).toBe(true);
    expect(isValidMessage('')).toBe(false);
    expect(isValidMessage('   ')).toBe(false);
    expect(isValidMessage('A'.repeat(1001))).toBe(false);
  });

  it('creates conversation between users', () => {
    const createConversation = (user1Id, user2Id) => {
      return {
        id: 1,
        participants: [user1Id, user2Id],
        messages: [],
        createdAt: new Date(),
      };
    };

    const conversation = createConversation(1, 2);
    expect(conversation.participants).toContain(1);
    expect(conversation.participants).toContain(2);
  });

  it('sorts messages by timestamp', () => {
    const messages = [
      { id: 1, content: 'First', createdAt: new Date('2025-07-01T10:00:00Z') },
      { id: 2, content: 'Third', createdAt: new Date('2025-07-01T10:02:00Z') },
      { id: 3, content: 'Second', createdAt: new Date('2025-07-01T10:01:00Z') },
    ];

    const sortedMessages = messages.sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    expect(sortedMessages[0].content).toBe('First');
    expect(sortedMessages[1].content).toBe('Second');
    expect(sortedMessages[2].content).toBe('Third');
  });
});
