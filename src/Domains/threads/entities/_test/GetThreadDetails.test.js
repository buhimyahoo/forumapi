const GetThreadDetails = require('../GetThreadDetails');

describe('GetThreadDetails entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      username: 'user-123',
    };

    // Action & Assert
    expect(() => new GetThreadDetails(payload)).toThrowError('GET_THREAD_DETAILS.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      body: [],
      date: 123,
      username: true,
      comments: 'abc',
    };

    // Action & Assert
    expect(() => new GetThreadDetails(payload)).toThrowError('GET_THREAD_DETAILS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create threadDetail object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul thread',
      body: 'isi thread',
      username: 'user-123',
      date: '2023-07-07',
      comments: [],
    };

    // Action
    const threadDetail = new GetThreadDetails(payload);

    // Assert
    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.comments).toEqual(payload.comments);
  });
});
