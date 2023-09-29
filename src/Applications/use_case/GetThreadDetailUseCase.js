const GetThreadDetails = require('../../Domains/threads/entities/GetThreadDetails');
const GetComments = require('../../Domains/comments/entities/GetComments');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadDetails(threadId);
    const comments = await this._commentRepository.getComments(threadId);

    const commentsDetails = comments.map((comment) => new GetComments({ ...comment }));

    return new GetThreadDetails({
      ...thread,
      comments: commentsDetails,
    });
  }
}

module.exports = GetThreadDetailUseCase;
