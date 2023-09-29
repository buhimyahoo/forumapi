class AddComment {
  constructor(payload) {
    const { threadId, owner, content } = payload;

    this._verifyPayload(threadId, owner, content);

    this.threadId = threadId;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload(threadId, owner, content) {
    if (!threadId || !owner || !content) {
      throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof threadId !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = AddComment;
