class VerifyComment {
  constructor(payload) {
    const { id, owner, content } = payload;

    this._verifyPayload(id, owner, content);

    this.id = id;
    this.owner = owner;
    this.content = content;
  }

  _verifyPayload(id, content, owner) {
    if (!id || !owner || !content) {
      throw new Error('VERIFY_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof id !== 'string' || typeof owner !== 'string' || typeof content !== 'string') {
      throw new Error('VERIFY_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = VerifyComment;
