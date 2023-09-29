class DeleteCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId, commentId, owner: ownerId } = useCasePayload;
    await this._threadRepository.verifyThread(threadId);
    await this._commentRepository.verifyComment({ threadId, commentId });
    await this._commentRepository.verifyCommentAccess({ commentId, ownerId });
    await this._commentRepository.deleteComment(commentId);
  }
}

module.exports = DeleteCommentUseCase;
