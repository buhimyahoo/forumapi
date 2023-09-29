/* eslint-disable camelcase */
class GetComments {
  constructor(payload) {
    this._verifyPayload(payload);

    const { id, username, content, date, is_deleted } = payload;

    this.id = id;
    this.username = username;
    this.content = is_deleted ? '**komentar telah dihapus**' : content;
    this.date = date;
  }

  _verifyPayload({ id, username, content, date, is_deleted }) {
    if (!id || !username || !content || !date || is_deleted === undefined) {
      throw new Error('GET_COMMENTS.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || typeof content !== 'string'
      || typeof date !== 'string'
      || typeof is_deleted !== 'boolean'
    ) {
      throw new Error('GET_COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = GetComments;
