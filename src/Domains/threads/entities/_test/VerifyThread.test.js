const VerifyThread = require('../VerifyThread');

describe('VerifyThread entities', () => {
  it('should throw error when payload not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul thread',
    };

    // Action & Assert
    expect(() => new VerifyThread(payload)).toThrowError('VERIFY_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      title: true,
      owner: 'abc',
    };

    // Action & Assert
    expect(() => new VerifyThread(payload)).toThrowError('VERIFY_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create verifyThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: 'judul thread',
      owner: 'user-123',
    };

    // Action
    const verifyThread = new VerifyThread(payload);

    // Assert
    expect(verifyThread.id).toEqual(payload.id);
    expect(verifyThread.title).toEqual(payload.title);
    expect(verifyThread.owner).toEqual(payload.owner);
  });
});
