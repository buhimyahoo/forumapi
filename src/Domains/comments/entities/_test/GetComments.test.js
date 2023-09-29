const GetComments = require('../GetComments');

describe('GetComments entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'komentar dicoding',
    };

    // Act & Assert
    expect(() => new GetComments(payload)).toThrowError('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: true,
      content: [],
      date: 'abc',
      is_deleted: 'abc',
    };

    // Act & Assert
    expect(() => new GetComments(payload)).toThrowError('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create getComments object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'komentar dicoding',
      date: '2023-07-07',
      is_deleted: false,
    };

    // Action
    const comments = new GetComments(payload);

    // Assert
    expect(comments.id).toEqual(payload.id);
    expect(comments.username).toEqual(payload.username);
    expect(comments.content).toEqual(payload.content);
    expect(comments.date).toEqual(payload.date);
  });

  it('should return \'**komentar telah dihapus**\' when is_deleted is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      content: 'komentar dicoding',
      date: '2023-07-07',
      is_deleted: true,
    };

    // Action
    const comment = new GetComments(payload);

    // Assert
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });
});
