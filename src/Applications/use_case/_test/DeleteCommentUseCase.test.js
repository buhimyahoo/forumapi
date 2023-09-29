const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrate the delete comment action properly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };
    const expectedDeletedComment = { id: 'comment-123' };

    /* creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /* mocking needed function */
    mockThreadRepository.verifyThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.verifyCommentAccess = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Act & Assert
    await expect(deleteCommentUseCase.execute(useCasePayload)).resolves.not.toThrowError();
    expect(mockThreadRepository.verifyThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.verifyComment).toBeCalledWith({ threadId: useCasePayload.threadId, commentId: useCasePayload.commentId });
    expect(mockCommentRepository.verifyCommentAccess).toBeCalledWith({ commentId: useCasePayload.commentId, ownerId: useCasePayload.owner });
    expect(mockCommentRepository.deleteComment).toBeCalledWith(expectedDeletedComment.id);
  });
});
