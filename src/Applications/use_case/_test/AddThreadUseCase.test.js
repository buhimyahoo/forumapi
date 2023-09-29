const AddThread = require('../../../Domains/threads/entities/AddThread');
const VerifyThread = require('../../../Domains/threads/entities/VerifyThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      title: 'judul thread',
      body: 'isi thread',
      owner: 'user-123',
    };
    const expectedAddedThread = new VerifyThread({
      id: 'thread-123',
      title: 'judul thread',
      owner: 'user-123',
    });

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();

    /* mocking needed function */
    mockThreadRepository.addThread = jest.fn()
      .mockImplementation(() => Promise.resolve(new VerifyThread({
        id: 'thread-123',
        title: 'judul thread',
        owner: 'user-123',
      })));

    /* creating use case instance */
    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    // Action
    const addedThread = await addThreadUseCase.execute(useCasePayload);

    // Assert
    expect(addedThread).toStrictEqual(expectedAddedThread);
    expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
      owner: expectedAddedThread.owner,
    }));
  });
});
