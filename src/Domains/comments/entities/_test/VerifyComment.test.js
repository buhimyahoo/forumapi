const VerifyComment = require('../VerifyComment');

describe('VerifyComment entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'komentar dicoding',
    };

    // Action & Assert
    expect(() => new VerifyComment(payload)).toThrowError('VERIFY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      content: true,
      owner: 'abc',
    };

    // Action & Assert
    expect(() => new VerifyComment(payload)).toThrowError('VERIFY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create verifyComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      content: 'komentar dicoding',
      owner: 'user-123',
    };

    // Action
    const comments = new VerifyComment(payload);

    // Assert
    expect(comments.id).toEqual(payload.id);
    expect(comments.content).toEqual(payload.content);
    expect(comments.owner).toEqual(payload.owner);
  });
});
